#!/usr/bin/env bash
set -euo pipefail

mode="${1:-local}"
missing=0
check() {
  local bin="$1" note="$2"
  if command -v "$bin" >/dev/null 2>&1; then
    printf 'PASS  %-12s %s\n' "$bin" "$(command -v "$bin")"
  else
    printf 'MISS  %-12s %s\n' "$bin" "$note"
    missing=1
  fi
}

check python3 "required for build/test"
check curl "required for smoke tests"

if [[ "$mode" == "full" ]]; then
  check docker "required for container tests"
  check kubectl "required for Kubernetes deployment"
  check az "required for Azure provisioning/deploy"
  check helm "required by scripts/k8s-prereqs.sh"
fi

if [[ "$(uname -s)" == "Darwin" ]]; then
  if [[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]] || command -v chromium >/dev/null 2>&1; then
    echo "PASS  browser      Chrome/Chromium detected"
  else
    echo "MISS  browser      install Google Chrome or Chromium for browser smoke tests"
    missing=1
  fi
fi

exit "$missing"
