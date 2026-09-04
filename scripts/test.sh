#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
python3 scripts/build.py
python3 scripts/validate.py
python3 -m py_compile scripts/build.py scripts/validate.py scripts/render-k8s.py scripts/render-k8s-local.py
for script in scripts/*.sh; do bash -n "$script"; done

echo "STATIC TESTS PASS"
