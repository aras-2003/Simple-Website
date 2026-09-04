#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"
cd "$ROOT"
SITE_BASE_URL="http://localhost:${PORT}" python3 scripts/build.py
printf 'Local preview: http://localhost:%s\n' "$PORT"
cd dist
exec python3 -m http.server "$PORT" --bind 127.0.0.1
