# Environments

## Current deployment policy

Public and Azure deployment are **disabled**. macOS is the current reference environment; Docker and local Kubernetes validate deployment portability without publishing the site.

| Environment | Entry point | Exposure | Contact mode | Status |
|---|---|---|---|---|
| macOS native | `make mac-demo` | loopback only | dry-run by default | ACTIVE / recommended |
| Astro dev | `make dev` | `127.0.0.1:4321` | dry-run by default | ACTIVE |
| macOS Docker Desktop | `make mac-docker` | localhost mapping | dry-run by default | ACTIVE |
| macOS local Kubernetes | `make k8s-local` | localhost port-forward | dry-run | ACTIVE |
| GitHub CI | push / PR | no deployment | integration dry-run | ACTIVE |
| Generic Kubernetes | `k8s/site.yaml.tpl` | explicit ingress/DNS | live secrets required | FUTURE-READY |
| Azure AKS | `.github/workflows-disabled/deploy-aks.yml` | disabled | secret required | DISABLED |
| Public Internet | DNS + TLS + ingress | public | live | DISABLED |

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

This combines static/type/build/contact validation with the Playwright + axe accessibility gate.

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

## Promotion model

`Astro source → static site + contact image → local Docker/Kubernetes → generic Kubernetes → Azure/public`

Public promotion requires deliberate re-enablement plus DNS/TLS, contact email provider configuration, runtime secrets and manual accessibility/privacy review.
