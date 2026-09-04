#!/usr/bin/env bash
set -euo pipefail
IMAGE="${IMAGE:-arkadiusz-kamrowski-site:local}"
PORT="${PORT:-8080}"
docker build -t "$IMAGE" .
docker run --rm -p "$PORT:8080" "$IMAGE"
