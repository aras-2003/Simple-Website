# Product measurement

## Decision and architecture
Use existing **Cloudflare Workers Logs** as the initial collector/query surface. The account already deploys an observable Worker. A small compiled first-party script sends `POST /api/events`; a dedicated Worker module validates and logs only a closed schema. No third-party script, new service account, database, tracking pixel, fingerprint, cookie or browser storage is introduced.

Cloudflare Web Analytics is useful for traffic/performance, but its documented page metrics alone do not establish the required engagement/form events. A separate analytics product/Analytics Engine dataset adds setup before a baseline exists. Existing Workers Logs supports structured event filtering and counts; its short retention is the explicit trade-off. Reconsider persistent **aggregate** reporting if the review cadence proves too demanding.

Sources checked 2026-09-11:
- [Workers Logs configuration, structured objects, retention and limits](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Cloudflare Web Analytics scope](https://developers.cloudflare.com/web-analytics/)
- [Observability query builder](https://developers.cloudflare.com/workers/observability/query-builder/)

## Event contract
Every client event carries exactly `event`, `page`, `locale`, `source`. Server adds `kind=product_event`, `version=1`, and `environment=staging|production`.

| Event | Meaning | Useful breakdown |
|---|---|---|
| `page_view` | Home, Advisory, article or Contact opened | page, locale, broad referral source |
| `contact_intent` | Internal link to Contact clicked | source page: Home, Advisory, article, etc. |
| `advisory_intent` | Home link to Advisory clicked | locale |
| `language_switch` | Language link clicked | page, source language |
| `form_start` | First input event in this page's form | locale, referral category |
| `form_success` | Browser received a successful contact response | locale |
| `form_error` | Browser validation, missing challenge token or submission failure | locale |

Primary CTA clicks are `contact_intent`; Home → Advisory is `advisory_intent`; article → Contact is `contact_intent` with `page=article`. Contact visits are `page_view` with `page=contact`. Do not sum overlapping event definitions as distinct conversions.

Pages are fixed categories: home/work/writing/article/about/contact/oaf/privacy. Sources: direct/internal/linkedin/search/other. No raw path, query string, UTM value, referrer URL, article text, topic selection, error string, name, email, organisation or message enters product events. Referrer is classified on the client into the fixed categories only. Browser privacy restrictions can hide referrals; `direct` includes unknown/no-referrer.

`contact_sent` is the existing server-side provider-accepted signal. It logs topic enum, locale and timestamp, without provider email ID or message content. Provider acceptance is not mailbox delivery and is not a qualified conversation. Browser success can include honeypot decoys; use provider acceptance separately for operational checks.

## Privacy and abuse controls
DNT/GPC are honoured before sending and again at the collector. Server requires exact same-origin configured Origin, JSON, no query parameters, a maximum 256-byte streamed body, exact keys and enum values. Unknown or personal fields reject the whole event. A separate Cloudflare rate limiter (60/minute/IP key) prevents analytics from consuming contact limits. IP is used transiently in that limiter, never included in application event logs. Page-local dispatch is capped at 30 events and measurement failures never block navigation/contact.

Requests still traverse Cloudflare, which processes technical data for delivery/security. Do not describe the entire infrastructure as collecting no personal data. Worker invocation logging is disabled to reduce automatic URL capture; only explicit structured application logs are intended. No request/body object is logged. Privacy copy describes both boundaries. No blanket legal-compliance assertion is made merely because cookies are absent.

## Retention, retrieval and review
Workers Logs retention documented by Cloudflare: **3 days on Free; 7 days on Paid**. The Free log allowance is 200,000/day; Paid includes 20 million/month with usage pricing above that. Account plan was not inspected; this release does not change the plan. `head_sampling_rate=1` requests full capture, subject to platform quotas/limits, blockers, retries and bot traffic.

Owner workflow at least every 48 hours during the initial baseline:
1. Workers & Pages → `arkadiuszkamrowski` → Observability → query builder.
2. Select the preceding complete day(s); filter structured field `kind = product_event`, `environment = production`.
3. Count events grouped by `event`, `page`, `locale`, `source`. Save/export **aggregate counts only** before retention expires; keep them in a private product review record.
4. Review the staging Worker separately for acceptance evidence. Never mix staging/test traffic with production.
5. Separately count qualified conversations in the private correspondence review, without importing message text into analytics.

Record missing capture days as **missing**, never zero. Until the account has been inspected and events seen in Observability, collection is implemented/tested, not claimed as live-verified. Historical reporting beyond retention is not automatic in this release.

## Baseline-first decisions
Primary metric: number of conversations with a concrete decision, a sponsor/owner able to act, and an agreed useful next step. The owner makes this assessment from correspondence. Do not automate qualification from topic clicks.

After 2–4 weeks of aggregate records and sufficient real traffic, review:
- Home → Advisory intent and Home/Advisory/article → Contact intent;
- form starts, browser errors and provider acceptance as friction signals;
- PL/EN distribution;
- broad source mix and voluntary source information from actual conversations.

No numeric conversion target yet. Counts are **events, not unique visitors, sessions or joined individual funnels**. Ratios are directional aggregate indicators; do not claim source-attributed qualified leads or exact person-level form conversion. Each repeat visit can count again; client events can be fabricated by bots. Correlate trends with qualitative conversations before changing the product.

## Validation and operations
`tests/measurement.mjs`: schema rejection/no PII logs, malformed/oversized payloads, origins, opt-outs, disabled/missing binding, rate limits and staging isolation. Browser integration tests inspect actual event requests across intent/error/retry/success and verify DNT/GPC. Existing security/CSP and asset budgets stay unchanged.

Disable collection by setting `PRODUCT_MEASUREMENT=0` on the affected Worker. The frontend still functions. Local Astro/reference Node previews do not persist events; validate those flows with mocks or use the Worker package locally.
