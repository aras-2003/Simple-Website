#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d node_modules ]]; then
  npm install --no-audit --no-fund
fi

CONTACT_PORT="${CONTACT_API_PORT:-8787}"
CONTACT_ORIGINS="${CONTACT_ALLOWED_ORIGINS:-http://127.0.0.1:4321,http://localhost:4321}"
CONTACT_DRY_RUN="${CONTACT_DRY_RUN:-1}"

CONTACT_API_PORT="$CONTACT_PORT" \
CONTACT_ALLOWED_ORIGINS="$CONTACT_ORIGINS" \
CONTACT_DRY_RUN="$CONTACT_DRY_RUN" \
node server/contact.mjs >.contact-api.log 2>&1 &
CONTACT_PID=$!

cleanup() {
  kill "$CONTACT_PID" 2>/dev/null || true
  wait "$CONTACT_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in {1..40}; do
  if curl -fsS "http://127.0.0.1:${CONTACT_PORT}/healthz" >/dev/null 2>&1; then
    break
  fi
  sleep .1
done
curl -fsS "http://127.0.0.1:${CONTACT_PORT}/healthz" >/dev/null

echo "Contact API: http://127.0.0.1:${CONTACT_PORT}/api/contact (dry-run defaults to ${CONTACT_DRY_RUN})"
npm run dev
