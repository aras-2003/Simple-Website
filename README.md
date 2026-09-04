# Arkadiusz Kamrowski · Personal Site

Production-ready static personal site focused on **Enterprise Architecture × Strategy × Execution**, with OAF as the central intellectual-property narrative.

## See it on macOS — recommended

No Node.js is required. For the fastest path you only need macOS + Python 3.

```bash
git clone git@github.com:aras-2003/Simple-Website.git
cd Simple-Website
make mac-demo
```

The command validates the site, builds it for localhost, starts a loopback-only server and opens your default browser at `http://127.0.0.1:8080`.

Stop it with:

```bash
make mac-stop
```

If port 8080 is busy:

```bash
PORT=8088 make mac-demo
```

## Local environment matrix

### Native macOS

```bash
make mac-demo
```

### Docker Desktop

```bash
make mac-docker
# opens http://127.0.0.1:8080
make docker-down
```

### Local Kubernetes

Enable Kubernetes in Docker Desktop (or use `kind`), then:

```bash
make k8s-local
# opens localhost through kubectl port-forward
make k8s-local-down
```

The local Kubernetes path intentionally uses **no Ingress, no DNS, no TLS and no public endpoint**.

### ChatGPT / static sandbox

```bash
make chatgpt-test
```

### Browser smoke screenshots

```bash
make browser-test
```

Chrome/Chromium is required for this optional test.

## Standard development commands

```bash
make test
make dev
# http://localhost:8080
```

## Docker

```bash
make docker-build
make docker-run
```

or:

```bash
docker compose up --build
```

Docker Compose binds to `127.0.0.1` by default so the preview is local to the Mac.

## Deployment policy

**Azure and public deployment are currently disabled.**

The Azure/AKS implementation remains in the repository as a future-ready blueprint, but its GitHub Actions file lives under:

```text
.github/workflows-disabled/deploy-aks.yml
```

GitHub therefore cannot execute it as a workflow. Re-enabling public/Azure promotion will be a deliberate change with a separate approval gate.

The generic production Kubernetes template remains in `k8s/site.yaml.tpl`, while localhost-safe Kubernetes uses `k8s/local.yaml.tpl`.

See `docs/ENVIRONMENTS.md` for the complete environment and promotion model.

## CI

`ci.yml` remains active on `main` and pull requests:

- static build,
- SEO/accessibility validation,
- Docker build,
- Trivy HIGH/CRITICAL vulnerability gate.

CI validates deployability without publishing anything.

## Project structure

```text
src/                         website source
scripts/                     build/test/macOS/Docker/K8s helpers
nginx/                       hardened static runtime
k8s/local.yaml.tpl           localhost-only Kubernetes
k8s/site.yaml.tpl            future generic production Kubernetes
infra/azure/                 future-ready Bicep for ACR + AKS
.github/workflows/            active CI only
.github/workflows-disabled/   disabled Azure deployment blueprint
docs/                        IA, architecture, environments and audits
```

## Current status

- macOS native: **ready**
- Docker Desktop: **ready**
- local Kubernetes: **ready**
- CI security/build validation: **active**
- Azure AKS: **future-ready, disabled**
- public DNS/TLS: **not configured / not deployed**
