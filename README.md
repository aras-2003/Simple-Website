# Arkadiusz Kamrowski · Personal Site

Personal executive / thought-leadership site built with **Astro SSG + TypeScript**, complete Polish and English routes, a small isolated contact API, and a WCAG 2.2 AA accessibility target.

## Architecture

- **Frontend:** Astro 7 static generation. Content and navigation are pre-rendered to HTML.
- **Runtime web:** hardened non-root NGINX serving `dist/`.
- **Contact:** small Node.js sidecar exposing only `/api/contact` and `/healthz`; email delivery through Resend when production secrets are configured.
- **Locales:** Polish is default; English mirrors the same information architecture under `/en`.
- **Primary IA:** OAF → Practice → Perspective → About → Contact. Privacy is a footer-level utility route.
- **Writing:** four real editorial notes in PL and EN, generated as static article routes with article metadata.
- **No client framework:** JavaScript is limited to the contact workflow.
- **Deterministic dependencies:** exact direct versions plus committed `package-lock.json`; CI, Docker and local bootstrap paths use `npm ci`.
- Azure/public deployment remains disabled; the future AKS workflow stays under `.github/workflows-disabled/`.

See `docs/INFORMATION_ARCHITECTURE.md`, `docs/CONTACT_SERVICE.md` and `docs/ACCESSIBILITY.md`.

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

Production/static builds require an explicit HTTPS `SITE_BASE_URL`. Local build scripts deliberately opt into localhost so a forgotten production base URL cannot silently generate localhost canonical metadata.

## Quality gates

```bash
make test          # check + production build + static IA/SEO/security + link audit + contact API tests
make test-a11y     # Playwright + axe in Chromium, Firefox and WebKit projects
make audit         # both
make docker-build  # locked static build + contact runtime images
```

CI additionally runs the built containers through reverse-proxy/canonical/security-header/contact smoke tests and fails on HIGH/CRITICAL Trivy findings for either runtime image. Automated accessibility is a release gate, not a substitute for manual VoiceOver/NVDA/keyboard/zoom testing.

## Docker / Kubernetes

```bash
make mac-docker
make k8s-local
```

Docker Compose and Kubernetes run NGINX plus the contact API as an isolated companion process/container. Local Kubernetes uses contact dry-run; the generic production template expects email secrets to be created separately.

## Security / privacy notes

- CSP does not allow unrestricted inline script execution.
- Reverse-proxy client IP handling is authoritative; client-supplied forwarding chains cannot choose the contact rate-limit bucket.
- Contact rate-limit storage is bounded and TTL-pruned.
- Human-named assets use revalidation-friendly caching; only fingerprinted Astro assets are immutable.
- `/.well-known/security.txt` is published for vulnerability contact.
- The privacy route documents the controller, processing purposes/legal bases, providers, transfers, retention, rights, technical logs and the absence of advertising profiling.

## Environment status

- macOS native: ready
- Docker Desktop: ready by configuration
- local Kubernetes: ready by configuration
- GitHub CI: static validation + link audit + cross-browser accessibility + runtime smoke + two container security scans
- Azure AKS: future-ready, disabled
- public DNS/TLS: not deployed
