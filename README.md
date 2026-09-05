# Arkadiusz Kamrowski · Personal Site

Personal executive / thought-leadership site built with **Astro SSG + TypeScript**, complete Polish and English routes, a small Cloudflare Worker contact API, and a WCAG 2.2 AA accessibility target.

## Architecture

- **Production runtime:** Cloudflare Workers + Static Assets. Cloudflare is both the public edge and application origin.
- **Frontend:** Astro 7 static generation. Content and navigation are pre-rendered to HTML and deployed as Workers Static Assets.
- **Contact:** same-origin `POST /api/contact` handled by `worker/index.mjs`; production submissions require server-side Cloudflare Turnstile validation and are delivered with the Resend HTTPS API.
- **Edge/security:** Cloudflare owns DNS, managed certificates, DDoS/WAF/bot posture, AI crawler policy, canonical `www` redirect, URL normalization, response headers and observability.
- **Locales:** Polish is default; English mirrors the same information architecture under `/en`.
- **Primary navigation:** Perspective → OAF → Practice → About → Contact. Privacy is a footer-level utility route.
- **Narrative:** problem → evidence → perspective → OAF synthesis → application/practice → author → contact.
- **Writing:** Perspective essays are Markdown entries in a typed Astro Content Collection; PL and EN share the same route slugs but remain independently validated content entries.
- **No client framework:** JavaScript is used only for the contact form, Turnstile integration and intentional micro-interactions.
- **Portability:** legacy NGINX, Docker, Kubernetes and AKS material is retained only as optional reference/testing material; it is not the production deployment target.

See `docs/CLOUDFLARE.md`, `docs/INFORMATION_ARCHITECTURE.md`, `docs/CONTACT_SERVICE.md`, `docs/DEPLOY_APPROVAL.md`, `docs/HOSTING_DECISION.md` and `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

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

## Cloudflare preview and production

Wrangler is intentionally invoked at a pinned version from the Makefile; it is not added to the application dependency graph.

Preview deployment to `workers.dev` / Preview URLs:

```bash
npm run build
make worker-preview
```

Production deployment to the apex Workers Custom Domain:

```bash
set -a
source .env.production
set +a
make worker-deploy-production
```

`wrangler.jsonc` is the preview contract. `wrangler.production.jsonc` disables `workers.dev` and declares `arkadiuszkamrowski.com` as the production Custom Domain.

## Publishing Perspective

Long-form Perspective content lives under:

```text
src/content/writing/pl/<slug>.md
src/content/writing/en/<slug>.md
```

The **filename is the canonical article slug**. Each article is validated by the schema in `src/content.config.ts`, including locale, category, title, description, reading time, ordering, publication/modification dates and source URLs. PL and EN counterparts should use the same filename so hreflang pairs remain stable.

Do not add a `slug` field to Markdown frontmatter: Astro treats it as an entry-ID override, which would collide across locales. When YAML text contains syntax-significant characters such as `:`, quote the value. Invalid metadata fails the build before release.

## Quality gates

```bash
make test          # Astro/static + Worker contact + portability contact + predeploy + performance/browser gates
make test-worker   # Worker contact runtime only
make test-a11y     # Playwright + axe across core and article routes
make audit         # combined local quality gate
```

GitHub CI checks static/SEO/privacy/link behavior, Worker contact logic, Wrangler preview/production packaging, Chromium/Firefox/WebKit paths, performance budgets and automated WCAG checks.

Automated accessibility is a gate, not a substitute for manual VoiceOver/NVDA/keyboard/zoom testing. See `docs/ACCESSIBILITY.md`.

## Production configuration

`.env.production.example` documents the build/runtime contract. Real secret values belong in Cloudflare Workers secrets or the selected CI/build secret store and must never be committed.

Production requires:

- public build value `PUBLIC_TURNSTILE_SITE_KEY`;
- Worker secrets `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`;
- exact canonical origin/hostname values from `.env.production.example`;
- verified Resend sender/domain DNS.

`make predeploy` validates the contract without printing private values.

## Docker / Kubernetes portability reference

```bash
make portability-docker-build
make mac-docker
make k8s-local
```

These paths are retained for portability/reference and local experimentation only. They are deliberately not the production CI/CD target.

## Environment status

- macOS native: ready
- Cloudflare Worker contact implementation: ready by configuration
- Wrangler preview/production contracts: ready
- GitHub CI: Astro/static + Worker + Wrangler dry-run + accessibility/browser/performance gates
- production secrets: not provisioned in Cloudflare yet
- production Custom Domain/DNS: not deployed yet
- `www` redirect rule: configured in Cloudflare; redirect-only DNS placeholder still required at launch
- Docker/Kubernetes/AKS: portability/reference only
