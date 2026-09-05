#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-8080}"
HOST="127.0.0.1"
CONTACT_PORT="${CONTACT_API_PORT:-8787}"
CONTACT_DRY_RUN="${CONTACT_DRY_RUN:-1}"
command -v node >/dev/null || { echo "Node.js 22+ is required. Install with: brew install node@22"; exit 1; }
command -v npm >/dev/null || { echo "npm is required."; exit 1; }
command -v python3 >/dev/null || { echo "python3 is required to serve dist locally."; exit 1; }
command -v curl >/dev/null || { echo "curl is required."; exit 1; }
if [[ ! -d node_modules ]]; then npm ci --no-audit --no-fund; fi

bash scripts/mac-stop.sh >/dev/null 2>&1 || true

CONTACT_API_PORT="$CONTACT_PORT" \
CONTACT_DRY_RUN="$CONTACT_DRY_RUN" \
CONTACT_ALLOWED_ORIGINS="http://${HOST}:${PORT},http://localhost:${PORT}" \
node server/contact.mjs >.contact-api.log 2>&1 &
echo $! > .contact-api.pid

for _ in {1..40}; do curl -fsS "http://${HOST}:${CONTACT_PORT}/healthz" >/dev/null 2>&1 && break; sleep .1; done
curl -fsS "http://${HOST}:${CONTACT_PORT}/healthz" >/dev/null

SITE_BASE_URL="http://${HOST}:${PORT}" \
ALLOW_LOCAL_SITE_BASE=1 \
PUBLIC_CONTACT_ENDPOINT="http://${HOST}:${CONTACT_PORT}/api/contact" \
npm run build

python3 -m http.server "$PORT" --bind "$HOST" --directory dist >.local-server.log 2>&1 &
echo $! > .local-server.pid
for _ in {1..30}; do curl -fsS "http://${HOST}:${PORT}/" >/dev/null && break; sleep .2; done
curl -fsS "http://${HOST}:${PORT}/en" >/dev/null
URL="http://${HOST}:${PORT}"
echo "Local Astro site: $URL"
echo "Contact API: http://${HOST}:${CONTACT_PORT}/api/contact (CONTACT_DRY_RUN=${CONTACT_DRY_RUN})"
if command -v open >/dev/null; then open "$URL"; fi
