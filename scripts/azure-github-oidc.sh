#!/usr/bin/env bash
set -euo pipefail

: "${AZURE_SUBSCRIPTION_ID:?set AZURE_SUBSCRIPTION_ID}"
RG="${AZURE_RESOURCE_GROUP:-rg-ak-site-prod}"
if [[ -z "${ACR_NAME:-}" ]]; then
  suffix="$(printf '%s' "${AZURE_SUBSCRIPTION_ID}:${RG}" | python3 -c 'import sys,hashlib; print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest()[:12])')"
  ACR_NAME="aksite${suffix}"
  export ACR_NAME
  echo "ACR_NAME not set; using deterministic name: $ACR_NAME"
fi
AKS="${AKS_NAME:-aks-ak-site-prod}"
IDENTITY_NAME="${GITHUB_IDENTITY_NAME:-id-ak-site-github-prod}"
GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-aras-2003/Simple-Website}"
GITHUB_ENVIRONMENT="${GITHUB_ENVIRONMENT:-production}"
FEDERATED_CREDENTIAL_NAME="${FEDERATED_CREDENTIAL_NAME:-github-${GITHUB_ENVIRONMENT}}"

command -v az >/dev/null || { echo "Azure CLI (az) is required" >&2; exit 1; }

az account set --subscription "$AZURE_SUBSCRIPTION_ID"

if ! az identity show -g "$RG" -n "$IDENTITY_NAME" >/dev/null 2>&1; then
  az identity create -g "$RG" -n "$IDENTITY_NAME" >/dev/null
fi

CLIENT_ID="$(az identity show -g "$RG" -n "$IDENTITY_NAME" --query clientId -o tsv)"
PRINCIPAL_ID="$(az identity show -g "$RG" -n "$IDENTITY_NAME" --query principalId -o tsv)"
TENANT_ID="$(az account show --query tenantId -o tsv)"
SUBJECT="repo:${GITHUB_REPOSITORY}:environment:${GITHUB_ENVIRONMENT}"

if ! az identity federated-credential show \
  -g "$RG" \
  --identity-name "$IDENTITY_NAME" \
  -n "$FEDERATED_CREDENTIAL_NAME" >/dev/null 2>&1; then
  az identity federated-credential create \
    -g "$RG" \
    --identity-name "$IDENTITY_NAME" \
    -n "$FEDERATED_CREDENTIAL_NAME" \
    --issuer "https://token.actions.githubusercontent.com" \
    --subject "$SUBJECT" \
    --audiences "api://AzureADTokenExchange" >/dev/null
fi

ACR_ID="$(az acr show -g "$RG" -n "$ACR_NAME" --query id -o tsv)"
AKS_ID="$(az aks show -g "$RG" -n "$AKS" --query id -o tsv)"

ensure_role() {
  local role="$1" scope="$2"
  local count
  count="$(az role assignment list --assignee "$PRINCIPAL_ID" --role "$role" --scope "$scope" --query 'length(@)' -o tsv 2>/dev/null || echo 0)"
  if [[ "$count" == "0" ]]; then
    az role assignment create \
      --assignee-object-id "$PRINCIPAL_ID" \
      --assignee-principal-type ServicePrincipal \
      --role "$role" \
      --scope "$scope" >/dev/null
  fi
}

# Dedicated site cluster assumption: CI may manage the whole AKS data plane.
# If deploying into a shared AKS cluster, replace Cluster Admin with namespace-scoped RBAC before GO.
ensure_role "AcrPush" "$ACR_ID"
ensure_role "Azure Kubernetes Service Cluster User Role" "$AKS_ID"
ensure_role "Azure Kubernetes Service RBAC Cluster Admin" "$AKS_ID"

cat <<OUT
GitHub OIDC identity is ready.

Set these GitHub repository/environment variables:
AZURE_CLIENT_ID=$CLIENT_ID
AZURE_TENANT_ID=$TENANT_ID
AZURE_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
AZURE_RESOURCE_GROUP=$RG
ACR_NAME=$ACR_NAME
AKS_NAME=$AKS

Federated subject:
$SUBJECT

Security note:
The current role model assumes a dedicated AKS cluster for this site. For a shared cluster,
reduce the CI identity to namespace-scoped Azure Kubernetes Service RBAC Admin/Writer.
OUT
