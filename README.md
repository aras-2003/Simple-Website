# Arkadiusz Kamrowski · Personal Site

Personal executive / thought-leadership site built with **Astro SSG + TypeScript**, complete Polish and English routes, a small Cloudflare Worker contact API, and a WCAG 2.2 AA accessibility target.

Current product/source of truth: [docs/PRODUCT.md](docs/PRODUCT.md). Release evidence: [docs/PROOF_RELEASE.md](docs/PROOF_RELEASE.md).

## Architecture

- **Production runtime:** Cloudflare Workers + Static Assets. Cloudflare is both the public edge and application origin.
- **Frontend:** Astro 7 static generation. Content and navigation are pre-rendered to HTML and deployed as Workers Static Assets.
- **Contact:** same-origin `POST /api/contact` handled by `worker/index.mjs`; production submissions require server-side Cloudflare Turnstile validation and are delivered with the Resend HTTPS API.
- **Edge/security:** Cloudflare owns DNS, managed certificates, DDoS/WAF/bot posture, AI crawler policy, canonical `www` redirect, URL normalization, response headers and observability.
- **Locales:** Polish is default; English mirrors the same information architecture under `/en`.
- **Primary navigation:** Advisory → Perspective → About → Contact. OAF and Privacy are footer-level routes.
- **Narrative:** thesis → executive tensions → decision proof → person → conversation; OAF is a deeper path.
- **Writing:** Perspective essays are Markdown entries in a typed Astro Content Collection; PL and EN share the same route slugs but remain independently validated content entries.
- **No client framework:** JavaScript supports the contact form, Turnstile and limited first-party event measurement; no client framework or browser storage.
- **Portability:** legacy NGINX, Docker, Kubernetes and AKS material is retained only as optional reference/testing material; it is not the production deployment target.

See `docs/ENVIRONMENTS.md`, `docs/CLOUDFLARE.md`, `docs/INFORMATION_ARCHITECTURE.md`, `docs/CONTACT_SERVICE.md`, `docs/DEPLOY_APPROVAL.md`, `docs/HOSTING_DECISION.md` and `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## Release model

`main` is an integration branch and **never deploys directly**.

```text
feature/*
   ↓ PR + CI
main
   ↓ PR / promote
staging
   ↓ Cloudflare staging + acceptance
production
   ↓ guarded manual Cloudflare production workflow
```

Release environments are isolated:

- `staging` → Worker `arkadiuszkamrowski-staging` → `https://staging.arkadiuszkamrowski.com`
- `production` → Worker `arkadiuszkamrowski` → `https://arkadiuszkamrowski.com`

Cloudflare Workers Builds must have **Builds for non-production branches OFF** for both release applications. `main` is not the production branch for either application. Full branch/environment details are in `docs/ENVIRONMENTS.md`.

## macOS — fastest local preview

Requirements: Node.js 22+, npm and Python 3.

```bash
git clone git@github.com:aras-2003/Simple-Website.git
cd Simple-Website
make mac-demo
```

Open `http://127.0.0.1:8080`. The legacy local contact adapter starts in **dry-run** mode so the UX can be tested without real mail delivery or production Turnstile credentials.

Stop with:

```bash
make mac-stop
```

## Development

```bash
make install
make dev
# Astro: http://127.0.0.1:4321
```

The local Astro flow keeps the legacy Node adapter for fast development compatibility. The production contract is always the Worker implementation in `worker/index.mjs` and its dedicated tests.

## Cloudflare environments

Wrangler is intentionally invoked at a pinned version from the Makefile; it is not added to the application dependency graph.

Manual/non-release preview:

```bash
npm run build
make worker-preview
```

This uses `wrangler.preview.jsonc` and the isolated Worker name `arkadiuszkamrowski-preview`. The preview contract intentionally does not use the default `wrangler.jsonc` filename so Cloudflare Workers Builds cannot try to auto-reconcile staging/production dashboard settings into the manual preview config. It is not a release environment and must not be wired to `main` for automatic deployment.

Staging:

```bash
make worker-deploy-staging
```

This uses `wrangler.staging.jsonc`, the dedicated Worker `arkadiuszkamrowski-staging`, the staging custom domain, staging-only secrets and a separate Turnstile widget. Staging is protected from indexing at the Worker layer and should additionally be protected with Cloudflare Access.

Production:

```bash
set -a
source .env.production
set +a
make worker-deploy-production
```

`wrangler.production.jsonc` disables `workers.dev` and declares `arkadiuszkamrowski.com` as the production Custom Domain.

## Publishing Perspective

Long-form Perspective content lives under:

```text
src/content/writing/pl/<slug>.md
src/content/writing/en/<slug>.md
```

The **filename is the canonical article slug**. Each article is validated by the schema in `src/content.config.ts`, including locale, category, title, description, ordering, publication/modification dates and source URLs. PL and EN counterparts should use the same filename so hreflang pairs remain stable.

Do not add a `slug` field to Markdown frontmatter: Astro treats it as an entry-ID override, which would collide across locales. When YAML text contains syntax-significant characters such as `:`, quote the value. Invalid metadata fails the build before release.

## Quality gates

```bash
make test          # Astro/static + Worker contact + portability contact + predeploy + performance/browser gates
make test-worker   # Worker contact runtime only
make test-a11y     # Playwright + axe across core and article routes
make audit         # combined local quality gate
```

GitHub CI runs on PRs and pushes to `main`, `staging` and `production`. It validates static/SEO/privacy/link behavior, Worker contact logic, all Wrangler preview/staging/production packages, Chromium/Firefox/WebKit paths, performance budgets and automated WCAG checks.

Automated accessibility is a gate, not a substitute for manual VoiceOver/NVDA/keyboard/zoom testing. See `docs/ACCESSIBILITY.md`.

## Production configuration

`.env.production.example` documents the production build/runtime contract. Real secret values belong in Cloudflare Workers secrets or the selected CI/build secret store and must never be committed.

Production requires:

- public build value `PUBLIC_TURNSTILE_SITE_KEY`;
- Worker secrets `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`;
- exact canonical origin/hostname values from `.env.production.example`;
- verified Resend sender/domain DNS.

Staging uses equivalent values, but they are configured separately for `staging.arkadiuszkamrowski.com`. In particular, staging and production Turnstile secrets must not be shared.

`make predeploy` validates the production contract without printing private values.

## Docker / Kubernetes portability reference

```bash
make portability-docker-build
make mac-docker
make k8s-local
```

These paths are retained for portability/reference and local experimentation only. They are deliberately not the production CI/CD target.

## Environment status

Verified baseline 2026-09-11: main refactor is merged; staging contains the baseline main changes, its Cloudflare Workers Build succeeded and Access protects the custom domain. Production branch exists but its live deployment/configuration and real contact delivery are not verified. Earlier records list Resend/destination setup as pending. See the release evidence for fresh results; do not infer launch readiness from source configuration alone.

Production remains a **guarded manual workflow** from `production`. Staging automatically deploys only the `staging` branch. `main` does not deploy directly. Docker/Kubernetes/AKS remain reference/portability only.
