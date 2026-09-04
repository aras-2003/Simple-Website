#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-8080}"
HOST="127.0.0.1"
command -v node >/dev/null || { echo "Node.js 22+ is required. Install with: brew install node@22"; exit 1; }
command -v npm >/dev/null || { echo "npm is required."; exit 1; }
command -v python3 >/dev/null || { echo "python3 is required to serve dist locally."; exit 1; }
if [[ ! -d node_modules ]]; then npm install --no-audit --no-fund; fi
SITE_BASE_URL="http://${HOST}:${PORT}" npm run build
bash scripts/mac-stop.sh >/dev/null 2>&1 || true
python3 -m http.server "$PORT" --bind "$HOST" --directory dist >.local-server.log 2>&1 &
echo $! > .local-server.pid
for _ in {1..30}; do curl -fsS "http://${HOST}:${PORT}/" >/dev/null && break; sleep .2; done
curl -fsS "http://${HOST}:${PORT}/en" >/dev/null
URL="http://${HOST}:${PORT}"
echo "Local Astro site: $URL"
if command -v open >/dev/null; then open "$URL"; fi
