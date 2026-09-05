# Arkadiusz Kamrowski · Personal Site

Personal executive / thought-leadership site built with **Astro SSG + TypeScript**, complete Polish and English routes, a small isolated contact API, and a WCAG 2.2 AA accessibility target.

## Architecture

- **Frontend:** Astro 7 static generation. Content and navigation are pre-rendered to HTML.
- **Runtime web:** hardened non-root NGINX serving `dist/`.
- **Contact:** small Node.js sidecar exposing only `/api/contact` and `/healthz`; email delivery through Resend when production secrets are configured.
- **Locales:** Polish is default; English mirrors the same information architecture under `/en`.
- **Primary navigation:** Perspective → OAF → Practice → About → Contact. Privacy is a footer-level utility route.
- **Narrative:** problem → evidence → perspective → OAF synthesis → application/practice → author → contact.
- **Writing:** Perspective essays are Markdown entries in a typed Astro Content Collection; PL and EN share the same route slugs but remain independently validated content entries.
- **No client framework:** JavaScript is used only for the contact form and intentional micro-interactions.
- **Deployment:** public/Azure deployment remains disabled. Kubernetes/AKS stays future-ready/reference-only until a proportional production hosting model is selected.

See `docs/INFORMATION_ARCHITECTURE.md`, `docs/CONTACT_SERVICE.md`, `docs/DEPLOY_APPROVAL.md` and `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## macOS — fastest preview

Requirements: Node.js 22+, npm and Python 3.

```bash
git clone git@github.com:aras-2003/Simple-Website.git
cd Simple-Website
make mac-demo
```

Open `http://127.0.0.1:8080`. The contact API starts in **dry-run** mode by default, so the UX can be tested without sending mail.

Stop with:

```bash
make mac-stop
```

## Development

```bash
make install
make dev
# Astro: http://127.0.0.1:4321
# /api/contact is proxied to the local contact sidecar
```

To deliver real email locally, configure environment variables described in `docs/CONTACT_SERVICE.md` and set `CONTACT_DRY_RUN=0`.

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
make test          # astro check + build + static IA validation + contact API + production predeploy contract tests
make test-a11y     # Playwright + axe across core and article routes
make audit         # both
```

GitHub CI additionally checks external references, Chromium/Firefox/WebKit smoke paths, the five-second home-layout contract, cross-browser visual audit captures, real container runtime integration through NGINX → contact API and HIGH/CRITICAL container vulnerabilities.

Automated accessibility is a gate, not a substitute for manual VoiceOver/NVDA/keyboard/zoom testing. See `docs/ACCESSIBILITY.md`.

## Production preflight

`.env.production.example` is the public configuration contract; real values belong in the selected platform's secret/config store. A populated `.env.production` is ignored by Git and should be temporary if used locally.

```bash
set -a
source .env.production
set +a
make predeploy
```

The preflight validates HTTPS/canonical host alignment, live contact mode, explicit origin locking, sender-domain alignment, delivery credentials and rate-limit/runtime values without printing secrets.

The end-to-end owner/platform procedure — email-domain verification, DNS/TLS, manual accessibility, privacy, social/SEO validation, production contact smoke test, monitoring and rollback — is in `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## Docker / Kubernetes

```bash
make mac-docker
make k8s-local
```

Docker Compose and Kubernetes run NGINX plus the contact API as an isolated companion process/container. Local Kubernetes uses contact dry-run; the generic Kubernetes template is a portability/reference target rather than a mandatory production topology.

## Environment status

- macOS native: ready
- Docker Desktop: ready by configuration
- local Kubernetes: ready by configuration
- GitHub CI: locked build + static/SEO/privacy/link tests + contact tests + production predeploy contract + automated accessibility + browser matrix + visual captures + runtime container E2E + two container security scans
- generic Kubernetes: future-ready/reference
- Azure AKS: future-ready, disabled
- public DNS/TLS: not deployed
