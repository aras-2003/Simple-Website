# Environments

## Current deployment policy

Public and Azure deployment are **disabled**. The project is maintained as future-ready for those targets, but local macOS is the current reference environment.

| Environment | Entry point | Exposure | Status |
|---|---|---|---|
| macOS native | `make mac-demo` | `127.0.0.1` only | ACTIVE / recommended |
| macOS Docker Desktop | `make mac-docker` | localhost port mapping | ACTIVE |
| macOS local Kubernetes | `make k8s-local` | localhost via `kubectl port-forward` | ACTIVE |
| ChatGPT/sandbox static | `make chatgpt-test` | none | ACTIVE |
| Generic Kubernetes | production template in `k8s/site.yaml.tpl` | requires explicit ingress/DNS | FUTURE-READY |
| Azure AKS | workflow blueprint `.github/workflows-disabled/deploy-aks.yml` | public/private depending platform setup | DISABLED |
| Public Internet | DNS + TLS + ingress | public | DISABLED |

## macOS native — recommended first view

Prerequisites: macOS, Python 3, curl. No Node.js and no Docker required.

```bash
make mac-demo
```

This runs the static validation suite, builds the site for localhost, starts a loopback-only HTTP server and opens the browser. It stays running in the background.

```bash
make mac-stop
```

Use a different port if needed:

```bash
PORT=8088 make mac-demo
```

## Docker Desktop

```bash
make mac-docker
make docker-down
```

The container uses the same hardened NGINX image and content build as CI.

## Local Kubernetes

Recommended options:

1. Docker Desktop with Kubernetes enabled (`docker-desktop` context), or
2. a `kind` cluster.

```bash
make k8s-local
make k8s-local-down
```

The local manifest deliberately has **no Ingress, no TLS, no HPA and no public DNS**. Access is localhost-only through `kubectl port-forward`.

## Promotion model

The artifact path is intentionally consistent:

`src → static build → container → local Kubernetes → generic Kubernetes → Azure/public`

Promotion to a public environment requires a deliberate repository change that re-enables the Azure workflow, plus separate approval of DNS, TLS, identity and subscription configuration.
