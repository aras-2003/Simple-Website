# Technical Architecture

## Decyzja technologiczna
**Static-first / zero-runtime-JS framework dependency.** Semantyczny HTML + CSS + mały vanilla JS. Build w Pythonie tylko do podstawienia URL-i i generacji artefaktów SEO. Runtime: NGINX unprivileged.

## Dlaczego
- minimalny bundle i bardzo niski TTFB,
- brak zależności npm w ścieżce produkcyjnej,
- prosty supply chain,
- identyczny artefakt działa lokalnie, w Dockerze, Kubernetes i AKS,
- łatwe testowanie z ChatGPT / shell / Chromium.

## Runtime
Browser → Ingress/TLS → Service → NGINX (non-root) → static files.

## Security baseline
- non-root container,
- read-only root filesystem,
- dropped Linux capabilities,
- CSP, X-Frame-Options, nosniff, strict referrer policy,
- no forms, cookies, external scripts or trackers in v1,
- NetworkPolicy blocks egress,
- AKS: managed Microsoft Entra + Azure RBAC, local administrator accounts disabled,
- GitHub Actions → Azure through OIDC/federated identity; no long-lived Azure client secret.

## Observability
Liveness/readiness at `/healthz`. In v2: Azure Monitor / Prometheus HTTP SLI, synthetic availability test, basic RUM only after privacy decision.
