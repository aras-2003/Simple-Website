# Environments

## Current deployment policy

Public and Azure deployment are **disabled**. macOS is the current reference environment; Docker and local Kubernetes validate deployment portability without publishing the site. The release candidate now also includes a production configuration contract and launch runbook so the remaining work is operational rather than architectural.

| Environment | Entry point | Exposure | Contact mode | Status |
|---|---|---|---|---|
| macOS native | `make mac-demo` | loopback only | dry-run by default | ACTIVE / recommended |
| Astro dev | `make dev` | `127.0.0.1:4321` | dry-run by default | ACTIVE |
| macOS Docker Desktop | `make mac-docker` | localhost mapping | dry-run by default | ACTIVE |
| macOS local Kubernetes | `make k8s-local` | localhost port-forward | dry-run | ACTIVE |
| GitHub CI | push / PR | no deployment | integration dry-run | ACTIVE |
| Production preflight | `make predeploy` | no deployment | validates live config | READY |
| Generic Kubernetes | `k8s/site.yaml.tpl` | explicit ingress/DNS | live secrets required | FUTURE-READY |
| Azure AKS | `.github/workflows-disabled/deploy-aks.yml` | disabled | secret required | DISABLED / reference |
| Public Internet | selected managed runtime + DNS/TLS | public | live | NOT YET PROMOTED |

## macOS native

Prerequisites: Node.js 22+, npm, Python 3 and curl.

```bash
make mac-demo
```

This builds all PL/EN routes, starts the static site on `127.0.0.1:8080`, starts a loopback contact API and opens the browser. Contact delivery is dry-run unless real server-side email environment variables are supplied.

```bash
make mac-stop
```

For live development with Astro HMR and the Vite `/api/contact` proxy:

```bash
make dev
# http://127.0.0.1:4321
```

## Quality audit

```bash
make audit
```

This combines static/type/build/contact/predeploy-contract validation with the Playwright + axe accessibility gate.

## Docker Desktop

```bash
make mac-docker
make docker-down
```

Compose runs two hardened containers: NGINX/static site and the contact API. They share the network namespace so NGINX can proxy to the sidecar on loopback.

## Local Kubernetes

```bash
make k8s-local
make k8s-local-down
```

The local Deployment contains the web and contact containers in one Pod. There is no Ingress, TLS, HPA or public DNS; access remains localhost-only through `kubectl port-forward`.

## Production preparation

Start from `.env.production.example`; populate private values only in a local ignored file or the selected platform's config/secret store.

```bash
set -a
source .env.production
set +a
make predeploy
```

The release runtime should keep one public HTTPS origin with the NGINX container and contact sidecar/equivalent private runtime co-located so `/api/contact` remains same-origin and the API is not directly exposed.

All owner/platform steps — hosting selection, sender verification, DNS/TLS, accessibility, privacy, real contact smoke testing, monitoring and rollback — are defined in `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## Promotion model

`Astro source → locked CI → static site + contact image → local Docker/Kubernetes → production config preflight → manual release gates → selected managed runtime → DNS/TLS promotion`

Public promotion requires DNS/TLS, contact email provider configuration, runtime secrets and manual accessibility/privacy review. Generic Kubernetes/AKS remain portability/reference options rather than mandatory stages.
