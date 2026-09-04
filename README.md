# Arkadiusz Kamrowski · Personal Site

Static-first personal site built with **Astro SSG + TypeScript**, with complete Polish and English routes and a WCAG 2.2 AA accessibility target.

## Architecture

- Astro 7 static generation — no application server at runtime.
- Polish is the default locale: `/`, `/about`, `/oaf`, `/work`, `/writing`.
- English uses `/en`: `/en`, `/en/about`, `/en/oaf`, `/en/work`, `/en/writing`.
- Zero client-side framework and zero required runtime JavaScript.
- Hardened non-root NGINX runtime in Docker/Kubernetes.
- Azure/public deployment remains disabled; the future AKS workflow is stored under `.github/workflows-disabled/`.

## macOS — fastest preview

Requirements: Node.js 22+, npm and Python 3.

```bash
git clone git@github.com:aras-2003/Simple-Website.git
cd Simple-Website
make mac-demo
```

Open `http://127.0.0.1:8080`. English is available at `http://127.0.0.1:8080/en`.

Stop with:

```bash
make mac-stop
```

If Node.js is missing:

```bash
brew install node@22
```

## Development

```bash
make install
make dev
# Astro dev server: http://127.0.0.1:4321
```

## Quality gates

```bash
make test          # astro check + build + static localized-route validation
make test-a11y     # Playwright + axe, desktop and mobile Chromium
make audit         # both
```

The accessibility gate scans all 10 PL/EN routes against axe rules tagged for WCAG 2 A/AA, WCAG 2.1 A/AA and WCAG 2.2 AA. Automated testing is a gate, not a substitute for manual assistive-technology testing. See `docs/ACCESSIBILITY.md`.

## Docker / Kubernetes

```bash
make mac-docker
make k8s-local
```

The output remains plain static files in `dist/`; Docker only changes the serving layer.

## Environment status

- macOS native: ready
- Docker Desktop: ready by configuration
- local Kubernetes: ready by configuration
- GitHub CI: Astro + accessibility + container security
- Azure AKS: future-ready, disabled
- public DNS/TLS: not deployed
