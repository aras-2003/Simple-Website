#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

stop_pid_file() {
  local file="$1"
  local label="$2"
  if [[ ! -f "$file" ]]; then return 0; fi
  local pid
  pid="$(cat "$file")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "Stopped $label (PID $pid)."
  fi
  rm -f "$file"
}

stop_pid_file "$ROOT/.local-server.pid" "local preview"
stop_pid_file "$ROOT/.contact-api.pid" "contact API"
