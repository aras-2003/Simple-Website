#!/usr/bin/env bash
set -euo pipefail
: "${AZURE_SUBSCRIPTION_ID:?set AZURE_SUBSCRIPTION_ID}"
LOCATION="${LOCATION:-westeurope}"
RG="${AZURE_RESOURCE_GROUP:-rg-ak-site-prod}"
AKS="${AKS_NAME:-aks-ak-site-prod}"

if [[ -z "${ACR_NAME:-}" ]]; then
  suffix="$(printf '%s' "${AZURE_SUBSCRIPTION_ID}:${RG}" | python3 -c 'import sys,hashlib; print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest()[:12])')"
  ACR_NAME="aksite${suffix}"
  export ACR_NAME
  echo "ACR_NAME not set; generated deterministic name: $ACR_NAME"
fi

command -v az >/dev/null || { echo "Azure CLI (az) is required" >&2; exit 2; }
az account set --subscription "$AZURE_SUBSCRIPTION_ID"

available="$(az acr check-name -n "$ACR_NAME" --query nameAvailable -o tsv)"
if [[ "$available" != "true" ]]; then
  if ! az acr show -g "$RG" -n "$ACR_NAME" >/dev/null 2>&1; then
    echo "ACR name '$ACR_NAME' is not globally available. Set ACR_NAME to another lowercase alphanumeric value and retry." >&2
    exit 3
  fi
fi

az deployment sub create \
  --name "ak-site-platform-$(date +%Y%m%d%H%M%S)" \
  --location "$LOCATION" \
  --template-file infra/azure/main.bicep \
  --parameters location="$LOCATION" resourceGroupName="$RG" acrName="$ACR_NAME" aksName="$AKS"

echo "Azure platform ready: RG=$RG ACR=$ACR_NAME AKS=$AKS LOCATION=$LOCATION"
echo "Next: export ACR_NAME='$ACR_NAME' && bash scripts/azure-github-oidc.sh"
