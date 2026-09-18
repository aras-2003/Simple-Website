# Production launch runbook

Operational checklist for the first public launch of `arkadiuszkamrowski.com` on **Cloudflare Workers + Static Assets**. This is a plan and a release gate, **not** an assertion that production has launched or passed acceptance. See [PRELAUNCH_ACCEPTANCE_2026-09-17.md](PRELAUNCH_ACCEPTANCE_2026-09-17.md) for dated evidence and outstanding checks. Related: [CLOUDFLARE.md](CLOUDFLARE.md), [ENVIRONMENTS.md](ENVIRONMENTS.md), [DEPLOY_APPROVAL.md](DEPLOY_APPROVAL.md), [ANALYTICS.md](ANALYTICS.md).

## 1. Locked release decisions

- `main`: integration branch, **no deployment**; `staging`: automatic Cloudflare Workers Build; `production`: production release authority, **manual deployment only**.
- Staging: `https://staging.arkadiuszkamrowski.com`, private behind Cloudflare Access and noindex. Production: `https://arkadiuszkamrowski.com`, publicly accessible **only after explicit deploy GO**; `www` redirects to apex.
- Astro SSG frontend, Cloudflare Worker + Static Assets, same-origin `POST /api/contact` and `POST /api/events`, Cloudflare rate limiting + Managed Turnstile, Resend HTTPS API.
- **Owner decision 2026-09-17:** first-party, cookieless **product-event measurement ON at launch** (`PRODUCT_MEASUREMENT=1`); advertising trackers, third-party analytics, CRM, newsletter and own submissions database OFF. The prior statement that all analytics is disabled at launch is superseded. See [ANALYTICS.md](ANALYTICS.md).
- Secrets are isolated by environment. No values in source, PRs, screenshots or logs.

Promotion: `short-lived branch → PR + CI → main → PR + CI → staging → private acceptance → PR + CI → production → explicit manual deploy GO → public smoke`. Merging into `production` alone **does not deploy** in the v1 model. The production Wrangler config includes the apex Custom Domain; dispatching its workflow is a **public-launch action**.

## 2. Staging configuration and observed acceptance

Cloudflare Worker `arkadiuszkamrowski-staging`; Cloudflare Workers Build source branch `staging`, non-production branch builds OFF. Build `npm run build`, deployment `npx wrangler@4.129.0 deploy --config wrangler.staging.jsonc`, path `/`. Build values: `SITE_BASE_URL=https://staging.arkadiuszkamrowski.com`, `SITE_PRODUCTION_HOST=staging.arkadiuszkamrowski.com`, `REQUIRE_PRODUCTION_SITE=1`, `NODE_VERSION=22.23.2`, dedicated `PUBLIC_TURNSTILE_SITE_KEY`. Worker secrets: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. Never reuse production Turnstile secret on staging.

**Evidence as of 2026-09-17, not a blanket PASS:** owner tested a real staging form submission and receipt, verified Reply-To using a separate test address, and inspected a `contact_sent` log containing only category/topic, locale and timestamp. Owner inspected a separate `product_event` log for contact `page_view`; own event fields had no contact content. Cloudflare appends request/trace IDs and endpoint metadata. Owner also reviewed SPF/DKIM/DMARC in setup. These observations do not prove every error path, browser or accessibility scenario. See the dated evidence document.

Staging acceptance still requires confirmation of Cloudflare Access blocking unauthenticated users, HTTPS/certificate, `X-Robots-Tag: noindex, nofollow, noarchive`, `/robots.txt` disallow, staging canonical, PL/EN core routes, genuine 404, one-hop trailing-slash 308, CSP/security headers, dedicated Turnstile hostname, no sensitive data in **error-path** logs, Chromium/Firefox/WebKit, automated WCAG and manual keyboard/mobile/reduced-motion tests. The executive experience must convey audience/problem/outcome, show tangible advisory outputs, have no diagram overflow, preserve PL/EN meaning, work without motion and contain no invented proof/KPIs. Fix failures on a feature branch through `main` then re-promote; never patch only staging.

## 3. Production configuration and release safeguards

Target Worker: `arkadiuszkamrowski`; `wrangler.production.jsonc`; `workers_dev: false`, `preview_urls: false`, production `CONTACT_ALLOWED_ORIGINS`, production Turnstile hostname, separate contact and measurement rate limiters. Build value `PUBLIC_TURNSTILE_SITE_KEY` in GitHub production environment. Worker secrets `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` are separately set; the owner's reports of their presence do **not** independently verify their values or token permissions.

`.github/workflows/deploy-cloudflare.yml` is `workflow_dispatch` only, refuses non-`production` refs, builds and tests, checks required **secret names**, then deploys the apex Custom Domain. The secret-name check does not test actual validity or Cloudflare API-token scope. Verify least-privilege account/zone permissions and production-specific Turnstile/Resend configuration without exposing secrets. Do not activate automatic production deployment before a separate post-launch decision.

In Workers → Settings → Observability, owner screenshot on 2026-09-17 showed Logs ON, Include Invocation Logs OFF, Persist logs to Workers dashboard ON, Traces OFF and Logs sampling 100%. Production Wrangler contains `observability.enabled=true`, `head_sampling_rate=1` and `logs.invocation_logs=false`. Cloudflare's dashboard warns about Wrangler synchronization; do **not** paste full dashboard config over the application config. Reinspect effective settings after deployment. The observed staging application logs omit names/emails/message/tokens, but Cloudflare's `$workers`/`$metadata` fields include request/trace IDs and API endpoint path; never describe **all** Cloudflare processing as anonymous or identifier-free. No raw request/body logging. Worker Logs retention is short (see [ANALYTICS.md](ANALYTICS.md)); record aggregate event counts at least every 48 hours or document missing periods.

## 4. Final staging → production PR gate

[#59](https://github.com/aras-2003/Simple-Website/pull/59) is the Draft promotion from `staging` to `production`. A screenshot showed the then-current four checks green; **recheck checks for the final candidate SHA** after any documentation/code promotion. Before merge: precise candidate accepted, production configuration and limited-scope credentials reviewed, production Turnstile hostname/site key/secret ready, Resend sender/DNS ready, privacy/legal and manual accessibility reviewed, monitoring and first-deployment recovery plan recorded, and **explicit owner GO for merge**. Approval for merge is distinct from later **explicit owner GO for public deploy**.

## 5. DNS and TLS — ONLY during approved public launch

Production deploy attaches `arkadiuszkamrowski.com` as a Workers Custom Domain; verify resulting apex DNS record and Cloudflare certificate. Do not disturb existing email MX/SPF/DKIM/DMARC. Keep `www` redirect-only (never attach a second application Custom Domain), preserve path and query and use **308** to apex. At launch, if needed to allow a proxied Redirect Rule to match, add redirect-only `A | www | 192.0.2.0 | Proxied`; **not before deploy GO**. Verify `https://www.arkadiuszkamrowski.com/oaf?x=1` → 308 → `https://arkadiuszkamrowski.com/oaf?x=1`.

Public routes: HTTP→HTTPS; apex `/`, `/about`, `/en/about` = 200; trailing slash = one-hop 308; unknown route = true 404. Confirm valid certificates for apex and `www`, minimum TLS 1.3, HTTP/2+HTTP/3, 0-RTT OFF, no mixed content, and HSTS only while all covered names support HTTPS.

## 6. Email and contact

Sender `Website <contact@arkadiuszkamrowski.com>`. Resend sender/domain was reported verified; staged messages were delivered and Reply-To checked. Reverify DNS/provider status immediately before launch. Publish provider-generated DKIM; merge SPF into one existing SPF policy rather than creating a second independent SPF; review DMARC before enforcing; never replace Cloudflare Email Routing MX without a separate inbound-mail decision.

Production contact acceptance from the real public page: validation feedback; one valid Managed Turnstile submission with a controlled visitor address; on-page success; exactly one received message; correct Reply-To; no visitor email/message/token/secret in app or error logs; rejection of absent/invalid token and wrong hostname; sensible abuse throttling without load-testing Resend/Turnstile. `contact_sent` establishes Resend **acceptance**, not inbox delivery or lead qualification.

## 7. Headers, accessibility and content

Static `public/_headers` and Worker dynamic responses must agree: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`. CSP must permit same-origin and `https://challenges.cloudflare.com` only as needed for Turnstile; no `unsafe-inline`. Do not add Rocket Loader, Cloudflare Fonts or script injection without renewed tests.

Automated axe/Playwright is insufficient for manual sign-off. Test keyboard-only navigation/contact, Safari + VoiceOver, Chrome/Firefox + NVDA, 200%/400% zoom and 320px reflow, forced/high-contrast, visible focus, reduced motion, live form feedback and Turnstile accessibility. Check PL/EN commercial equivalence and all links/CTA on real mobile and desktop. Owner/QA must record evidence; no unperformed test should be marked PASS.

## 8. Privacy, analytics, SEO and monitoring

Confirm live PL/EN privacy notice accurately describes form data, Cloudflare/Turnstile/Resend/mailbox processing, transfers, retention and **first-party cookieless measurement**, without denying separate technical metadata. Confirm DNT/GPC, no advertising pixels or auto CRM/newsletter. Review provider DPAs/transfer terms and legal wording with owner/legal; code and isolated log examples do not establish blanket GDPR compliance. Retention on the account and availability of production event logs are to be verified live. Operational event logs must never include visitor contact data or Turnstile tokens.

After launch verify title/description, apex canonical, hreflang + x-default, sitemap/robots, OG 1200×630/social preview, structured data and no staging/preview/workers.dev/localhost references. Run `SITE_BASE_URL=https://arkadiuszkamrowski.com make smoke-production` **only after DNS and domain are live**; it checks routes, headers, redirects, SEO and API-origin behavior without sending real email.

Keep Cloudflare abuse/DDoS/status/SSL alerts as configured and verify actual notification delivery. Add/verify external HTTPS uptime on `/`, Workers errors/exceptions, `turnstile_unavailable`/`delivery_unavailable` monitoring and a recorded deployment Git SHA. Analytics dashboard may show sampling/retention limits; never interpret missing capture as zero traffic.

## 9. First deployment recovery and final GO / NO-GO

**First-launch caveat:** The pre-launch Hello World Worker is not a previously tested website release. Record the production Git SHA, deployment ID/version, DNS state, a tested way to disable/remove the Custom Domain or restore prior routing, responsible operator and rollback decision criteria **before** initial launch. For later releases preserve a previous known-good website Worker deployment/version. Do not promise a functional website rollback to Hello World.

Rollback/disable public launch if an unresolved TLS/routing loop, contact data leak, Turnstile bypass/block, delivery outage, major accessibility regression or material security-header failure appears. Use the prepared procedure; do not modify deployed assets by hand or bypass branch promotion.

| Gate | Pre-launch state / requirement |
|---|---|
| `main`/`staging` promotion + CI and staging build | Recheck final release SHA |
| Staging Access, noindex, routes, PL/EN, browsers and UX | Owner/QA acceptance required |
| Staging real contact and inspected product/contact logs | Observed 2026-09-17; error paths remain separate |
| PR #59 staging→production and final CI | Draft; recheck after updates |
| Production secrets, scoped token, Turnstile and sender | Owner reports configured; technical verification outstanding |
| VoiceOver, NVDA, keyboard, zoom, mobile, reduced motion | Manual evidence outstanding |
| Privacy/legal, provider terms and actual retention | Owner/legal sign-off outstanding |
| Monitoring and first-deployment recovery | Document/test before deploy GO |
| Apex/www DNS, HTTPS, smoke, real contact and analytics | **Only verifiable after approved public deploy** |

**NO-GO for public deployment until all pre-launch gates have evidence, the owner separately approves production-branch merge and then explicitly approves public deploy.** Post-launch acceptance gates are verified promptly after the approved deployment; they must not be mislabeled prelaunch PASS.
