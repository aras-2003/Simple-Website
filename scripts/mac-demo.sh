#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"
HOST="127.0.0.1"
URL="http://${HOST}:${PORT}"
PID_FILE="$ROOT/.local-server.pid"
LOG_FILE="$ROOT/.local-server.log"

if [[ "$(uname -s)" != "Darwin" && "${ALLOW_NON_MAC:-0}" != "1" ]]; then
  echo "mac-demo is intended for macOS. Set ALLOW_NON_MAC=1 only for CI/sandbox validation." >&2
  exit 2
fi
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 2; }
command -v curl >/dev/null || { echo "curl is required" >&2; exit 2; }

cd "$ROOT"
bash scripts/test.sh

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Stopping previous local preview (PID $(cat "$PID_FILE"))"
  kill "$(cat "$PID_FILE")" || true
  rm -f "$PID_FILE"
fi

SITE_BASE_URL="$URL" python3 scripts/build.py >/dev/null
(
  cd dist
  exec python3 -m http.server "$PORT" --bind "$HOST"
) >"$LOG_FILE" 2>&1 &
PID=$!
echo "$PID" > "$PID_FILE"

cleanup_on_error() {
  kill "$PID" 2>/dev/null || true
  rm -f "$PID_FILE"
}
trap cleanup_on_error ERR

for _ in {1..40}; do
  if curl --fail --silent "$URL/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done
curl --fail --silent "$URL/" >/dev/null
trap - ERR

echo ""
echo "Local macOS preview is running: $URL"
echo "Stop it with: make mac-stop"
echo "Log: $LOG_FILE"

if [[ "${NO_OPEN:-0}" != "1" ]]; then
  open "$URL"
fi
