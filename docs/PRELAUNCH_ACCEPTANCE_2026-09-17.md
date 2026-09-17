# Pre-launch acceptance evidence — 2026-09-17

Status: **release-candidate evidence, not production approval**. This document separates observed evidence from owner-reported configuration. Do not merge `staging → production`, dispatch the production workflow, attach the apex Custom Domain or change production DNS until separately approved.

## Release scope and evidence

- Promotion PR: [#59](https://github.com/aras-2003/Simple-Website/pull/59), `staging → production`, Draft at review time. A screenshot showed four green checks on the then-current candidate. Recheck CI for the final candidate SHA after documentation promotion.
- Staging: `arkadiuszkamrowski-staging`, `https://staging.arkadiuszkamrowski.com`, behind Cloudflare Access; no public staging indexing is intended.
- Contact: owner tested real staging submission, received the email and confirmed that a reply to the received message targets an independently supplied visitor test address. Mail authentication was reviewed in the setup conversation; verify again at public smoke.
- Measurement: owner-approved first-party, cookieless product events at launch. A staging Workers Logs entry with `kind=product_event`, `environment=staging`, `event=page_view`, `page=contact`, `locale=pl`, `source=internal` was observed. Another staging entry with `event=contact_sent`, `topic=execution`, `locale=pl` and timestamp was observed after provider acceptance. **These entries verify the tested path only**, not every event type or production collection.
- Privacy of inspected entries: neither entry contained a visitor name, email, message body, Turnstile token or API secret. Cloudflare *does* append platform metadata (request/trace IDs, Worker/script version, endpoint path). Do not claim that the platform processes no identifiers or technical data. Error-path logs and provider processing remain separate reviews.
- Production Worker settings: owner dashboard screenshot after changing Observability showed Logs ON, Include Invocation Logs OFF, Persist logs to Workers dashboard ON, Traces OFF, Logs sampling 100%. `wrangler.production.jsonc` specifies `observability.logs.invocation_logs=false`; recheck effective settings after deployment.
- Production secrets: owner reports dedicated `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` and `CONTACT_TO_EMAIL` Worker secrets, plus GitHub production environment values. Contents, effective access permissions and end-to-end production behavior were not independently inspected.

## Approved measurement boundaries

See [ANALYTICS.md](ANALYTICS.md). The client sends only fixed event/page/locale/source categories to `POST /api/events`. No third-party analytics script, advertising tracker, cookie, browser-storage identifier or raw contact content is part of the first-party event contract. DNT/GPC opt-outs are implemented. Cloudflare processes separate technical metadata; retention and provider transfer terms must be described accurately. `contact_sent` means provider acceptance, **not** inbox delivery or a qualified lead.

## Remaining before production-branch promotion

1. Confirm CI and staging build/commit lineage for the final release candidate after the docs-only promotion.
2. Complete manual keyboard, VoiceOver + Safari, NVDA + Chrome/Firefox, zoom/reflow and reduced-motion checks. PL/EN content, mobile/browser and legal/privacy sign-off remain owner/QA tasks until evidenced.
3. Verify scoped Cloudflare deployment-token permissions without exposing values; verify production Turnstile hostname configuration and Resend sender/DNS state.
4. Prepare first-deployment recovery plan (the initial Hello World Worker is **not** a previous known-good website release), release SHA, monitoring, apex/www redirect, DNS and TLS sequence.
5. Obtain **explicit owner GO for merging PR #59**, separately from **explicit owner GO for public production deployment**.

## After explicit public-deploy approval

The manual production workflow deploys the apex Custom Domain and is itself the first public launch. Check public TLS, apex/www redirects, headers, canonical/robots/sitemap/SEO/social, PL/EN routes, accessibility, product events and one real contact/Reply-To. Record the resulting deployment/version before subsequent releases. If the first launch fails, use the preplanned safe disable/recovery route rather than treating the initial Hello World Worker as a functional website rollback.
