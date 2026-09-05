#!/usr/bin/env bash
set -euo pipefail

SITE_CONTAINER="personal-site-runtime-$RANDOM"
CONTACT_CONTAINER="personal-contact-runtime-$RANDOM"
BASE="http://127.0.0.1:18080"

cleanup() {
  docker rm -f "$CONTACT_CONTAINER" "$SITE_CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker run -d --name "$SITE_CONTAINER" -p 18080:8080 personal-site:ci >/dev/null
docker run -d --name "$CONTACT_CONTAINER" --network "container:$SITE_CONTAINER" \
  -e CONTACT_DRY_RUN=1 \
  -e CONTACT_REQUIRE_ORIGIN=1 \
  -e CONTACT_RATE_LIMIT=2 \
  -e CONTACT_RATE_BUCKETS=100 \
  -e CONTACT_ALLOWED_ORIGINS="$BASE" \
  personal-contact:ci >/dev/null

for _ in $(seq 1 50); do
  if curl -fsS "$BASE/healthz" >/dev/null 2>&1; then break; fi
  sleep .2
done
curl -fsS "$BASE/healthz" >/dev/null

for path in / /about /en/about /oaf /work /writing /privacy /assets/og-card.png /sitemap-index.xml; do
  status=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE$path")
  test "$status" = "200" || { echo "$path expected 200, got $status"; exit 1; }
done

slash_headers=$(curl -sSI "$BASE/about/")
echo "$slash_headers" | grep -qE '^HTTP/.* 308'
echo "$slash_headers" | grep -qiE '^location: .*\/about\r?$'

headers=$(curl -sSI "$BASE/")
for expected in \
  'x-content-type-options: nosniff' \
  'x-frame-options: DENY' \
  'referrer-policy: strict-origin-when-cross-origin' \
  'strict-transport-security: max-age=31536000; includeSubDomains' \
  'cross-origin-opener-policy: same-origin' \
  'cross-origin-resource-policy: same-origin'; do
  echo "$headers" | grep -qiF "$expected" || { echo "missing header: $expected"; exit 1; }
done

html=$(curl -fsS "$BASE/")
echo "$html" | grep -q 'http-equiv="Content-Security-Policy"'
if echo "$html" | grep -q 'unsafe-inline'; then
  echo 'CSP unexpectedly allows unsafe-inline'
  exit 1
fi

timestamp=$(($(date +%s%3N) - 2500))
payload() {
  local email="$1"
  printf '{"name":"Runtime User","email":"%s","organization":"Example","topic":"architecture","message":"This is a valid runtime integration message.","website":"","consent":true,"locale":"en","startedAt":%s}' "$email" "$timestamp"
}

for n in 1 2; do
  status=$(curl -sS -o /dev/null -w '%{http_code}' \
    -X POST "$BASE/api/contact" \
    -H "Origin: $BASE" \
    -H 'Content-Type: application/json' \
    -H "X-Forwarded-For: 203.0.113.$n" \
    --data "$(payload "runtime$n@example.com")")
  test "$status" = "202" || { echo "contact request $n expected 202, got $status"; exit 1; }
done

status=$(curl -sS -o /dev/null -w '%{http_code}' \
  -X POST "$BASE/api/contact" \
  -H "Origin: $BASE" \
  -H 'Content-Type: application/json' \
  -H 'X-Forwarded-For: 203.0.113.99' \
  --data "$(payload 'runtime3@example.com')")
test "$status" = "429" || { echo "proxy/rate-limit integration expected 429, got $status"; exit 1; }

bad_origin=$(curl -sS -o /dev/null -w '%{http_code}' \
  -X POST "$BASE/api/contact" \
  -H 'Origin: https://attacker.example' \
  -H 'Content-Type: application/json' \
  --data "$(payload 'attacker@example.com')")
test "$bad_origin" = "403" || { echo "bad origin expected 403, got $bad_origin"; exit 1; }

echo 'RUNTIME SMOKE PASS'
