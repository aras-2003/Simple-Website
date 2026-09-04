#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
: "${LETSENCRYPT_EMAIL:?set LETSENCRYPT_EMAIL}"
command -v kubectl >/dev/null || { echo "kubectl required" >&2; exit 2; }
command -v helm >/dev/null || { echo "helm required" >&2; exit 2; }

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx --force-update
helm repo add jetstack https://charts.jetstack.io --force-update
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.externalTrafficPolicy=Local \
  --wait --timeout 8m

helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true \
  --wait --timeout 8m

python3 - <<'PY' | kubectl apply -f -
import os
from pathlib import Path
s=Path('k8s/clusterissuer.yaml.tpl').read_text()
print(s.replace('{{LETSENCRYPT_EMAIL}}', os.environ['LETSENCRYPT_EMAIL']))
PY

kubectl get ingressclass nginx
kubectl get clusterissuer letsencrypt-prod
