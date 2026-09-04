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

check node "Node.js 22+ required for Astro"
check npm "npm required for dependencies/build"
check python3 "used by localhost server and Kubernetes render helpers"
check curl "required for smoke tests"

if command -v node >/dev/null 2>&1; then
  major="$(node -p 'process.versions.node.split(`.`)[0]')"
  if (( major < 22 )); then
    echo "MISS  node-version Node.js 22+ required"
    missing=1
  fi
fi

if [[ "$mode" == "full" ]]; then
  check docker "required for container tests"
  check kubectl "required for Kubernetes deployment"
  check az "required only for future Azure provisioning"
  check helm "required only by future production Kubernetes prerequisites"
fi

exit "$missing"
