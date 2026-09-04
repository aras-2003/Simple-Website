#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/.local-server.pid"
if [[ ! -f "$PID_FILE" ]]; then
  echo "No managed local preview is running."
  exit 0
fi
PID="$(cat "$PID_FILE")"
if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  echo "Stopped local preview (PID $PID)."
else
  echo "Preview process $PID is not running; removing stale PID file."
fi
rm -f "$PID_FILE"
