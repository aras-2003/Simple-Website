# Architecture

## Runtime model

The public experience remains static-first and is not a client-side SPA.

`Astro source → static build → dist/ → NGINX → browser`

A deliberately small companion service handles contact delivery:

`browser → NGINX /api/contact → Node contact sidecar → transactional email API`

Astro/TypeScript are build-time concerns. The browser receives pre-rendered HTML/CSS and only the small amount of JavaScript required for the contact form and intentional micro-interactions. The contact API has no application database and no frontend framework dependency.

## Application structure

- `src/layouts/BaseLayout.astro` — document shell, SEO, hreflang and landmarks.
- `src/components/*Page.astro` — localized page compositions.
- `src/content/` — editorial long-form content, OAF/practice detail and article data.
- `src/i18n/` — interface and page-level PL/EN copy.
- `src/lib/site.ts` — locale-safe route helpers.
- `src/pages/` / `src/pages/en/` — Polish default routes and mirrored English routes.
- `server/contact.mjs` — isolated contact delivery endpoint.
- `nginx/default.conf` — static delivery, security headers and same-origin API proxy.
- `tests/` — static IA/SEO/privacy/link tests, contact API tests, browser/a11y automation and container runtime E2E.

## Information architecture

Primary user-facing navigation:

`Perspective → OAF → Practice → About → Contact`

The broader narrative is deliberately problem-first:

`problem → evidence → perspective → OAF synthesis → application/practice → author → contact`

Privacy is a utility route. Perspective articles are statically generated under `/writing/<slug>` and `/en/writing/<slug>`.

Every public content route emits a canonical URL plus PL/EN/x-default alternate-language metadata. Article routes provide their own localized path pairs rather than canonicalizing to the writing index.

The home hero stays editorial rather than CV-led, but it must pass a five-second clarity test: users should understand the author/context, intended executive audience and the class of decisions the platform addresses without requiring them to decode OAF first.

## Contact boundary

The form does not expose email credentials to the browser. NGINX proxies `/api/contact` to a Node sidecar sharing the Docker/Kubernetes network namespace. Production secrets are injected at runtime. The service validates origin, payload size, field lengths, topic allow-list, honeypot and timing, applies bounded lightweight per-IP rate limiting, and uses an idempotency key when requesting email delivery.

The contact service owns response cache semantics such as `Cache-Control: no-store`; reverse proxies should not duplicate that header.

## Deployment

The same static site image plus contact sidecar work on Docker and Kubernetes. Local modes default to contact dry-run. The generic Kubernetes template remains a portability/reference target and expects a separately provisioned contact Secret.

Azure/public promotion remains intentionally disabled. A dedicated AKS cluster is not an application requirement. Production hosting should be selected proportionally to the workload; a static/edge frontend plus a small managed runtime for the contact API is the preferred baseline unless a shared platform or explicit architectural objective justifies Kubernetes.

See `docs/DEPLOY_APPROVAL.md` for release gates and the current production decision status.
