# Architecture

## Runtime model

The site is a static-generated website, not a client-side SPA.

`Astro source → static build → dist/ → NGINX → browser`

Astro and Node.js exist only at build time. Production runtime serves immutable HTML/CSS/assets from an unprivileged NGINX container.

## Application structure

- `src/layouts/BaseLayout.astro` — document shell, SEO, hreflang and landmarks.
- `src/components/*Page.astro` — reusable localized page compositions.
- `src/i18n/content.ts` — typed PL/EN copy.
- `src/lib/site.ts` — locale-safe routing helpers.
- `src/pages/` — Polish default routes.
- `src/pages/en/` — English routes.
- `public/` — static public assets.
- `tests/` — static and WCAG automation.

## Route model

Polish is the default locale without a prefix. English is fully mirrored under `/en`. Every page emits canonical, `hreflang=pl`, `hreflang=en`, and `x-default` metadata.

## Deployment

The same `dist/` output works on localhost, Docker, generic Kubernetes and the prepared Azure/AKS architecture. Azure/public promotion remains intentionally disabled.
