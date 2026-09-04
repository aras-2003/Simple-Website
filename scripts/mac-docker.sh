#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"
URL="http://127.0.0.1:${PORT}"
command -v docker >/dev/null || { echo "Docker Desktop / docker CLI is required" >&2; exit 2; }
command -v curl >/dev/null || { echo "curl is required" >&2; exit 2; }
cd "$ROOT"
PORT="$PORT" docker compose up --build -d
for _ in {1..60}; do
  if curl --fail --silent "$URL/healthz" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done
curl --fail --silent "$URL/healthz" >/dev/null
echo "Docker preview is running: $URL"
echo "Stop it with: make docker-down"
if [[ "${NO_OPEN:-0}" != "1" && "$(uname -s)" == "Darwin" ]]; then
  open "$URL"
fi
