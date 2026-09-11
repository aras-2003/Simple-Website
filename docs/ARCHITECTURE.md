# Architecture — current runtime

Canonical product decisions: [PRODUCT.md](PRODUCT.md). Production is **Cloudflare Workers + Static Assets**.

## Delivery
Astro/TypeScript compile bilingual content to static HTML/CSS and small external scripts. `dist/` is served by Cloudflare Static Assets. `worker/index.mjs` handles `/api/contact`, `/api/events`, canonical legacy/trailing-slash redirects and staging noindex/robots. Production uses the existing asset-first route policy; staging runs the Worker first to enforce noindex.

## Module boundaries
| Module | Responsibility |
|---|---|
| `src/components/*Page.astro` | Localized page compositions |
| `src/content/{home,advisory,proof,about,method,contact,privacy,...}.ts` | Typed bilingual content; `proof.ts` shared by Home and Advisory |
| `src/content/writing/{pl,en}/*.md` | Essays with source links, dates, category and stable slugs |
| `src/layouts/BaseLayout.astro` | SEO, JSON-LD, hreflang, shell and measurement entry |
| `src/scripts/measurement.ts` | Fixed event and source categories; no form content or browser storage |
| `public/scripts/contact-form.js` | Form validation, Turnstile integration, status/retry behavior |
| `worker/index.mjs` | Production contact delivery/security and request routing |
| `worker/measurement.mjs` | Strict non-identifying event schema, separate rate limiter and structured logs |
| `server/contact.mjs`, Docker/NGINX/Kubernetes/Azure files | Local/reference portability; not production |

## Security and data
Contact: origin, JSON/body bounds, own-property topic allowlist, field validation, honeypot, timing, rate limiter, server-side Turnstile and idempotent Resend submission. Contact data is never included in event payloads. Events use same-origin POST and exact enum schema. Worker secrets remain environment-isolated. No database, frontend framework, remote font or additional analytics vendor.

CSP permits external same-origin scripts and Turnstile only. Vite `assetsInlineLimit=0` prevents automatic executable inlining. JSON-LD is inert data with `<` escaped; static validation parses every graph and continues rejecting executable inline scripts. SEO routes are `/perspektywa/<slug>` and `/en/perspective/<slug>`; legacy `/writing` redirects remain.

## Deployment and verification
See [ENVIRONMENTS.md](ENVIRONMENTS.md), [ANALYTICS.md](ANALYTICS.md) and [PROOF_RELEASE.md](PROOF_RELEASE.md). CI exercises both canonical builds, three Worker packages, browser/a11y routes, contact/security tests, event privacy and unchanged performance budgets. Real staging acceptance/Turnstile/mail delivery remains separate from simulated provider tests.
