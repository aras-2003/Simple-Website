# Release and deployment approval gate

**Status: RELEASE CANDIDATE — public production launch NOT approved.** This is the concise release policy; the detailed operator checklist is [PRODUCTION_LAUNCH_RUNBOOK.md](PRODUCTION_LAUNCH_RUNBOOK.md) and the dated test evidence is [PRELAUNCH_ACCEPTANCE_2026-09-17.md](PRELAUNCH_ACCEPTANCE_2026-09-17.md). Branch contract: [ENVIRONMENTS.md](ENVIRONMENTS.md).

## Product and platform baseline

- Executive advisory + thought leadership connecting strategy, operating model, architecture, portfolio and execution. Narrative: executive tension → outcome → outputs → proof → method/OAF → perspective → contact. OAF is not prerequisite knowledge for CEO/CIO.
- Home, Advisory/three engagement formats, OAF, Perspectives and Contact in meaningfully equivalent PL/EN. No invented client names, logos or performance claims.
- Astro SSG + TypeScript, Cloudflare Workers + Static Assets, same-origin `/api/contact`, Cloudflare rate limiting/Turnstile and Resend. Canonical production origin `https://arkadiuszkamrowski.com`; `www` redirects only.
- **Approved 2026-09-17:** first-party, cookieless product-event measurement using Workers Logs, enabled at launch; no advertising trackers, third-party analytics, cookies, browser-storage identifiers, own CRM or newsletter capture. Cloudflare independently processes technical metadata. Details/retention in [ANALYTICS.md](ANALYTICS.md).
- `main` integration only (never deploys); `staging` automatically deploys a private noindex Worker; `production` is release authority, with **explicit manual production workflow** for the first launch. Merging to `production` does not by itself publish the website.

## Required automated checks

CI on PRs and pushes to protected release branches must verify: deterministic `npm ci`, Astro check, correct production and staging canonical builds, IA/SEO/social/privacy/internal links, content contract and external references, Worker contact/Turnstile/rate-limit/Resend/error/redirect tests, measurement schema/privacy tests, production predeploy contract, Wrangler preview/staging/production dry-runs, automated WCAG 2.2 A/AA, Chromium/Firefox/WebKit smoke, visual captures, performance budget and Release Policy branch path. A green check is evidence only for **that commit SHA**; rerun/recheck after further changes. Container/Kubernetes checks are reference-only, not production gates.

## Staging acceptance

Verify Access denial for anonymous visitors, HTTPS, noindex and `robots.txt` Disallow, PL/EN core routes, real 404 and 308, canonical and CSP/security headers, dedicated staging Turnstile hostname, real Resend delivery and Reply-To, restricted app/error logs, event capture, browser/mobile UX, keyboard, zoom and reduced motion. Hero must explain audience/problem/outcome, concrete outputs must be visible without understanding OAF, and diagrams must not overflow. Manual VoiceOver/NVDA, content/legal checks and evidence remain required even after passing automated tests.

Observed 2026-09-17: owner-confirmed delivery and Reply-To, one staging `product_event` entry, one `contact_sent` entry without visitor content, and production dashboard Invocation Logs switched OFF. Those samples do **not** establish every browser, error path, production secret or regulatory requirement. See dated evidence.

## Separate authorizations

1. **GO for `staging → production` PR merge:** final staging candidate accepted, PR #59 checks green at final SHA, production settings/limited-permission deployment token/Turnstile sender verified, privacy/legal and accessibility sign-off, and first-launch recovery/monitoring plan documented. No direct pushes or bypass.
2. **GO for public deploy:** separate explicit owner instruction after the merge and a final preflight. The manual workflow attaches the apex Workers Custom Domain and makes the site public. No automatic production deployment and no premature DNS/route changes.
3. **Post-deploy verification:** public TLS/apex/www exact 308, routing, headers, robots/canonical/hreflang/SEO/social, single real production contact/Reply-To, product-event logging, alerts and smoke tests. Public-only checks cannot truthfully be marked PASS beforehand.

## Secrets, telemetry and privacy

Use separate per-environment `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`; public `PUBLIC_TURNSTILE_SITE_KEY` is a build variable. GitHub deployment credentials need minimum Cloudflare account/zone permissions. Do not disclose values in screenshots/issues/logs. Logs ON with Invocation Logs OFF, persisted custom operational/product events, 100% log sampling as configured. Inspected application events omitted visitor email/name/message/token, but Cloudflare metadata contains request/trace identifiers and endpoint paths; neither zero technical processing nor blanket GDPR compliance is claimed. Owner/legal should confirm provider DPAs/transfers and privacy notice.

## Repository governance — verify actual account state

Prior documentation stated that this repo was private on GitHub Free and protection was unavailable; that description is outdated. A GitHub API branch read on 2026-09-17 reported `main` with `protected:true`, but its nested protection payload showed checks enforcement OFF; do not infer which protections are effectively enforced. Recheck current settings on `main`, `staging` and `production`, required CI/status contexts and any admin bypass before release. PR + CI and the Release Policy are mandatory operating controls regardless of GitHub UI enforcement. Do not force-push or delete release branches.

Promotion: `feature/* → PR → main → PR → staging → private acceptance → PR #59 → production → separate manual workflow GO → public smoke`. **NO-GO until all prelaunch requirements are evidenced and both authorizations are separately given.**
