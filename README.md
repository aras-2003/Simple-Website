# Arkadiusz Kamrowski · Personal Site

Production-ready static personal site focused on **Enterprise Architecture × Strategy × Execution**, with OAF as the central intellectual property narrative.

## Quick start — macOS / Linux

```bash
bash scripts/check-prereqs.sh
make test
make chatgpt-test   # test bez zależności od przeglądarki
make dev
# open http://localhost:8080
```

Browser smoke screenshots (Chrome/Chromium required):

```bash
make browser-test
```

## Docker

```bash
make docker-build
make docker-run
# http://localhost:8080

# or
docker compose up --build
```

Production build with canonical URL:

```bash
docker build \
  --build-arg SITE_BASE_URL=https://arkadiuszkamrowski.pl \
  --build-arg PRODUCTION=1 \
  -t your-registry.example/personal-site:1.0.0 .
```

## Kubernetes

Prerequisites: NGINX Ingress Controller + cert-manager + metrics-server. Install the first two with `LETSENCRYPT_EMAIL=you@example.com bash scripts/k8s-prereqs.sh`; AKS provides metrics-server.

```bash
IMAGE=registry.example/personal-site:sha-123 \
HOST=arkadiuszkamrowski.pl \
make k8s-render

kubectl apply -f rendered-k8s.yaml
kubectl -n personal-site rollout status deployment/personal-site
```

## Azure / AKS

1. Install Azure CLI and Bicep.
2. Provision platform:

```bash
export AZURE_SUBSCRIPTION_ID='...'
# ACR_NAME is optional; if omitted a deterministic globally-unique candidate is generated.
bash scripts/azure-bootstrap.sh
```

3. Create the GitHub OIDC identity and least-secret access path (requires permission to create role assignments):

```bash
export AZURE_SUBSCRIPTION_ID='...'
# Use the ACR_NAME printed by bootstrap; when omitted the same deterministic name is derived.
export GITHUB_REPOSITORY='aras-2003/Simple-Website'
bash scripts/azure-github-oidc.sh
```

4. Connect locally to AKS and install ingress/TLS prerequisites. AKS is provisioned with managed Microsoft Entra, Azure RBAC and local admin accounts disabled:

```bash
az aks get-credentials -g rg-ak-site-prod -n aks-ak-site-prod
kubelogin convert-kubeconfig -l azurecli
LETSENCRYPT_EMAIL=you@example.com bash scripts/k8s-prereqs.sh
```

5. Copy variables printed by `azure-github-oidc.sh` into the GitHub repository/environment: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `ACR_NAME`, `AKS_NAME`.
6. Create GitHub environment `production` with a required reviewer.
7. `docs/DEPLOY_APPROVAL.md` is approved. Run workflow **Deploy · Azure AKS** after Azure/DNS prerequisites are configured.

> The current role model assumes a dedicated AKS cluster. For a shared AKS platform, scope the CI identity to the target namespace before production GO.

## CI/CD

- `ci.yml`: build, static/a11y/SEO validation, Docker build, Trivy scan.
- `deploy-aks.yml`: manual dispatch → GitHub environment approval → OIDC Azure login → multi-arch image push to ACR → immutable SHA deploy to AKS → rollout check.

## Project structure

```text
src/                  website source
scripts/              build/test/local/K8s/Azure helpers
nginx/                hardened static runtime
k8s/                  generic Kubernetes manifest template
infra/azure/           Bicep for ACR + AKS
.github/workflows/     CI and Azure CD
docs/                 IA, creative direction, architecture, approval gate, audits
```

## Deployment gate
`docs/DEPLOY_APPROVAL.md` is **APPROVED (2026-09-04)**. The remaining blockers are operational only: Azure subscription/OIDC bootstrap, globally unique ACR name, GitHub `production` environment, and DNS control for the production host.
