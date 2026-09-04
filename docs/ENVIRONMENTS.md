# Environments

## Current deployment policy

Public and Azure deployment are **disabled**. macOS is the current reference environment; Docker and local Kubernetes validate deployment portability without publishing the site.

| Environment | Entry point | Exposure | Status |
|---|---|---|---|
| macOS native | `make mac-demo` | `127.0.0.1` only | ACTIVE / recommended |
| Astro dev | `make dev` | `127.0.0.1:4321` | ACTIVE |
| macOS Docker Desktop | `make mac-docker` | localhost port mapping | ACTIVE |
| macOS local Kubernetes | `make k8s-local` | localhost via `kubectl port-forward` | ACTIVE |
| GitHub CI | push / PR | no deployment | ACTIVE |
| Generic Kubernetes | `k8s/site.yaml.tpl` | requires explicit ingress/DNS | FUTURE-READY |
| Azure AKS | `.github/workflows-disabled/deploy-aks.yml` | disabled | DISABLED |
| Public Internet | DNS + TLS + ingress | public | DISABLED |

## macOS native

Prerequisites: Node.js 22+, npm, Python 3 and curl.

```bash
make mac-demo
```

This installs dependencies when needed, runs `astro check`, builds all PL/EN routes, starts a loopback-only server and opens the browser at `http://127.0.0.1:8080`.

```bash
make mac-stop
```

Use another port if needed:

```bash
PORT=8088 make mac-demo
```

For live development with Astro HMR:

```bash
make dev
# http://127.0.0.1:4321
```

## Accessibility audit on macOS

```bash
make audit
```

The first accessibility run installs Playwright Chromium locally. The same axe gate runs in GitHub Actions.

## Docker Desktop

```bash
make mac-docker
make docker-down
```

The build stage uses Node/Astro; the runtime remains unprivileged NGINX.

## Local Kubernetes

```bash
make k8s-local
make k8s-local-down
```

The local manifest has no Ingress, TLS, HPA or public DNS. Access is localhost-only through `kubectl port-forward`.

## Promotion model

`Astro source → dist → container → local Kubernetes → generic Kubernetes → Azure/public`

Public promotion requires a deliberate repository change that re-enables the Azure workflow plus separate approval of DNS, TLS, identity and subscription configuration.
