#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACTION="${1:-up}"
IMAGE="${IMAGE:-arkadiusz-kamrowski-site:local}"
CONTACT_IMAGE="${CONTACT_IMAGE:-arkadiusz-kamrowski-contact:local}"
NAMESPACE="${NAMESPACE:-personal-site-local}"
PORT="${PORT:-8080}"
PID_FILE="$ROOT/.k8s-port-forward.pid"
LOG_FILE="$ROOT/.k8s-port-forward.log"
MANIFEST="$ROOT/rendered-k8s-local.yaml"

command -v kubectl >/dev/null || { echo "kubectl is required" >&2; exit 2; }
command -v docker >/dev/null || { echo "Docker Desktop / docker CLI is required" >&2; exit 2; }
cd "$ROOT"

stop_forward() {
  if [[ -f "$PID_FILE" ]]; then
    PID="$(cat "$PID_FILE")"
    kill "$PID" 2>/dev/null || true
    rm -f "$PID_FILE"
  fi
}

if [[ "$ACTION" == "down" ]]; then
  stop_forward
  kubectl delete namespace "$NAMESPACE" --ignore-not-found
  rm -f "$MANIFEST"
  echo "Local Kubernetes preview removed."
  exit 0
fi

if [[ "$ACTION" != "up" ]]; then
  echo "Usage: $0 [up|down]" >&2
  exit 2
fi

CONTEXT="$(kubectl config current-context 2>/dev/null || true)"
if [[ -z "$CONTEXT" ]]; then
  echo "No active Kubernetes context. Enable Kubernetes in Docker Desktop or create a kind cluster." >&2
  exit 2
fi

echo "Using Kubernetes context: $CONTEXT"
docker build --build-arg SITE_BASE_URL="http://127.0.0.1:${PORT}" --build-arg ALLOW_LOCAL_SITE_BASE=1 -t "$IMAGE" .
docker build -f server/Dockerfile -t "$CONTACT_IMAGE" .

if [[ "$CONTEXT" == kind-* ]]; then
  command -v kind >/dev/null || { echo "kind CLI is required for context $CONTEXT" >&2; exit 2; }
  CLUSTER="${CONTEXT#kind-}"
  kind load docker-image "$IMAGE" "$CONTACT_IMAGE" --name "$CLUSTER"
elif [[ "$CONTEXT" != "docker-desktop" && "$CONTEXT" != "rancher-desktop" ]]; then
  echo "Warning: context '$CONTEXT' may not see local Docker images '$IMAGE' and '$CONTACT_IMAGE'." >&2
  echo "For the frictionless local path use Docker Desktop Kubernetes or kind." >&2
fi

python3 scripts/render-k8s-local.py --image "$IMAGE" --contact-image "$CONTACT_IMAGE" --namespace "$NAMESPACE" --output "$MANIFEST"
kubectl apply -f "$MANIFEST"
kubectl -n "$NAMESPACE" rollout status deployment/personal-site --timeout=120s

stop_forward
kubectl -n "$NAMESPACE" port-forward service/personal-site "$PORT:80" >"$LOG_FILE" 2>&1 &
PF_PID=$!
echo "$PF_PID" > "$PID_FILE"

URL="http://127.0.0.1:${PORT}"
for _ in {1..40}; do
  if curl --fail --silent "$URL/healthz" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done
curl --fail --silent "$URL/healthz" >/dev/null

echo "Local Kubernetes preview is running: $URL"
echo "Stop/remove it with: make k8s-local-down"
if [[ "${NO_OPEN:-0}" != "1" && "$(uname -s)" == "Darwin" ]]; then
  open "$URL"
fi
