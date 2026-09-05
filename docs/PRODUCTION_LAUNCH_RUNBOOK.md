# Production launch runbook

This is the operational checklist for promoting `arkadiuszkamrowski.com` to the public Internet on **Cloudflare Workers + Static Assets**.

The Cloudflare contract is in `docs/CLOUDFLARE.md`; the branch/environment model is in `docs/ENVIRONMENTS.md`.

## 1. Locked release decisions

Unless explicitly changed and re-reviewed:

- integration branch: `main` — **no automatic deployment**
- staging branch: `staging`
- production branch: `production`
- staging origin: `https://staging.arkadiuszkamrowski.com`
- production origin: `https://arkadiuszkamrowski.com`
- `www`: redirect-only alias to production apex
- runtime: Cloudflare Workers + Static Assets
- frontend: pre-rendered Astro
- dynamic endpoint: same-origin `POST /api/contact`
- anti-abuse: Cloudflare security controls + Workers Rate Limiting + Turnstile Managed
- email delivery: Resend HTTPS API
- analytics/advertising: disabled at launch
- database / CRM / newsletter capture: none
- secrets: separate Cloudflare Worker secrets per release environment

Promotion path:

```text
feature/* → PR → main → PR → staging → acceptance → PR → production → public smoke
```

No VM, NGINX, container registry, Container App, public origin server or Kubernetes cluster is required for production v1.

## 2. Cloudflare Workers Builds setup gate

Before any release deployment, configure **two independent Workers Builds applications** connected to `aras-2003/Simple-Website`.

### Staging application

- Worker/application: `arkadiuszkamrowski-staging`
- Production branch: `staging`
- Builds for non-production branches: **OFF**
- Build command: `npm run build`
- Deploy command: `npx wrangler@4.129.0 deploy --config wrangler.staging.jsonc`
- Path: `/`
- Cloudflare Access: **ON**

Build variables:

```text
SITE_BASE_URL=https://staging.arkadiuszkamrowski.com
SITE_PRODUCTION_HOST=staging.arkadiuszkamrowski.com
REQUIRE_PRODUCTION_SITE=1
NODE_VERSION=22.23.2
PUBLIC_TURNSTILE_SITE_KEY=<staging site key>
```

### Production application

- Worker/application: `arkadiuszkamrowski`
- Production branch: `production`
- Builds for non-production branches: **OFF**
- Build command: `npm run build`
- Deploy command: `npx wrangler@4.129.0 deploy --config wrangler.production.jsonc`
- Path: `/`
- Cloudflare Access: **OFF**

Build variables:

```text
SITE_BASE_URL=https://arkadiuszkamrowski.com
SITE_PRODUCTION_HOST=arkadiuszkamrowski.com
REQUIRE_PRODUCTION_SITE=1
NODE_VERSION=22.23.2
PUBLIC_TURNSTILE_SITE_KEY=<production site key>
```

Do not configure `main` as a deployment branch for either application.

## 3. Inputs still required

Staging:

1. Dedicated Turnstile widget/sitekey/secret restricted to `staging.arkadiuszkamrowski.com`.
2. Staging Worker secrets: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
3. Cloudflare Access policy for the staging hostname.

Production:

1. Production Turnstile sitekey + secret for `arkadiuszkamrowski-contact`.
2. Turnstile hostname restriction for `arkadiuszkamrowski.com`.
3. Production `RESEND_API_KEY`.
4. Final `CONTACT_TO_EMAIL` mailbox.
5. Verified sender/domain for `CONTACT_FROM_EMAIL`.
6. Final privacy/legal review.
7. VoiceOver and NVDA manual QA.

Never paste secret values into source, PRs, issues or screenshots.

## 4. `main` → `staging` promotion

Promote through a PR into `staging`; do not deploy `main` directly.

Before merge:

- repository CI PASS;
- preview/staging/production Wrangler dry-runs PASS;
- no known P0/P1 UX/security/accessibility defect;
- release notes/change scope understood.

After merge, Workers Builds deploys the `staging` branch to `staging.arkadiuszkamrowski.com`.

## 5. Staging acceptance

Staging is a release candidate, not a public SEO surface.

Required PASS:

- Cloudflare Access blocks unauthenticated access;
- certificate and HTTPS valid;
- `X-Robots-Tag: noindex, nofollow, noarchive` present;
- `/robots.txt` returns `User-agent: *` + `Disallow: /`;
- PL/EN core routes render;
- canonical URLs point to staging origin in the staging build;
- real custom 404 works;
- trailing slash returns one-hop 308;
- CSP/security headers match contract;
- staging Turnstile validates only the staging hostname;
- staging contact delivery works if enabled;
- no contact payload/token/private values appear in logs;
- Chromium/Firefox/WebKit and manual keyboard/accessibility acceptance PASS.

If staging fails, fix on a normal development branch → `main`, then re-promote to `staging`. Do not patch staging-only code manually.

## 6. `staging` → `production` promotion

Production must be promoted by PR from `staging` into `production` after staging acceptance.

Do not cherry-pick arbitrary feature commits directly into `production`.

Before merge:

- exact staging release candidate accepted;
- production CI PASS on the candidate lineage;
- production Worker secrets/config reviewed without revealing values;
- Turnstile production widget/hostname ready;
- Resend sender DNS ready;
- rollback version/path identified.

After merge, only the production Workers Builds application may deploy the `production` branch.

## 7. Production configuration

Use `.env.production.example` only as a contract/template for local preflight.

Required public build value:

```text
PUBLIC_TURNSTILE_SITE_KEY
```

Required production Worker secrets:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
```

Non-secret runtime configuration is committed in `wrangler.production.jsonc`.

Local preflight:

```bash
umask 077
cp .env.production.example .env.production
# populate private values locally
set -a
source .env.production
set +a
make predeploy
rm .env.production
```

`make predeploy` rejects wrong canonical origin, weak/missing Turnstile configuration, incorrect Origin allow-list, missing delivery secrets and sender-domain mismatch. It never prints private values.

## 8. Production Worker deployment behavior

`wrangler.production.jsonc`:

- disables `workers.dev`;
- disables Preview URLs;
- attaches `arkadiuszkamrowski.com` as a Workers Custom Domain;
- deploys `dist` as Static Assets;
- sends `/api/*` and trailing-slash canonicalization through Worker code;
- preserves real 404 handling;
- binds the production contact rate limiter.

Cloudflare creates the apex Custom Domain DNS record and certificate automatically.

The manual GitHub workflow is fallback-only and hard-fails unless dispatched from the `production` branch.

## 9. `www` redirect-only DNS

Keep the existing Cloudflare Redirect Rule:

- `www` → apex
- **308 Permanent Redirect**
- preserve path/query

Because `www` has no origin, add the redirect-only proxied placeholder at production launch:

```text
A | www | 192.0.2.0 | Proxied
```

Do not attach `www` as a second application Custom Domain.

Verify:

```text
https://www.arkadiuszkamrowski.com/oaf?x=1
→ 308
https://arkadiuszkamrowski.com/oaf?x=1
```

## 10. Email-domain setup

Default sender:

```text
Website <contact@arkadiuszkamrowski.com>
```

Publish only provider-generated values:

- DKIM exactly as generated;
- SPF merged with any existing SPF policy, never a second independent SPF TXT record;
- DMARC reviewed before enforcement changes;
- MX changed only if inbound-mail impact is understood and explicitly required.

Acceptance:

- Resend reports sender/domain verified;
- SPF/DKIM checks pass;
- DMARC has no known syntax/configuration error.

## 11. Public route/TLS acceptance

Expected production behavior:

| Request | Expected |
|---|---|
| `http://arkadiuszkamrowski.com/*` | HTTPS redirect |
| `https://arkadiuszkamrowski.com/` | `200` |
| `https://arkadiuszkamrowski.com/about` | `200` |
| `https://arkadiuszkamrowski.com/en/about` | `200` |
| `https://arkadiuszkamrowski.com/path/` | `308` to no-trailing-slash path |
| `https://www.arkadiuszkamrowski.com/*` | `308` to apex preserving path/query |
| unknown path | real `404` |

TLS acceptance:

- valid Cloudflare-managed certificate for apex and `www`;
- minimum TLS target remains 1.2+;
- HTTP/2 and HTTP/3 remain enabled;
- 0-RTT remains disabled;
- no mixed content;
- HSTS only while all covered hosts are intentionally HTTPS-capable.

There is no separate origin-certificate or Full-(strict)-to-origin dependency in the Worker-native architecture.

## 12. Security-header acceptance

Static Assets use `public/_headers`; dynamic Worker responses emit the same application baseline.

Verify effective production values:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

CSP must allow same-origin resources and `https://challenges.cloudflare.com` only where required for Turnstile, while containing no `unsafe-inline`.

Do not enable Rocket Loader, Cloudflare Fonts or other browser-script injection without re-running CSP/accessibility/performance/privacy gates.

## 13. Turnstile production activation

1. Widget remains `arkadiuszkamrowski-contact`, Managed mode.
2. Hostname list contains the apex and no unnecessary production hosts.
3. `PUBLIC_TURNSTILE_SITE_KEY` is present in the production build.
4. `TURNSTILE_SECRET_KEY` exists only as production Worker secret.
5. Missing token cannot send email.
6. Invalid token cannot send email.
7. Wrong-hostname Siteverify response is rejected.
8. One valid token produces exactly one email.
9. Token/secret never appear in logs.

Pre-clearance remains disabled unless separately reviewed.

## 14. Production contact smoke

From the real public page:

1. Submit an invalid form and verify useful feedback.
2. Complete one valid Turnstile-backed submission using an address you control.
3. Confirm on-page success.
4. Confirm exactly one email arrives.
5. Reply and confirm Reply-To targets the submitted visitor address.
6. Confirm logs show only operational metadata.
7. Confirm repeated rapid attempts eventually hit abuse controls without breaking normal later submissions.

Do not load-test Resend or Turnstile.

## 15. Automated public smoke

After the Custom Domain and `www` DNS are live:

```bash
SITE_BASE_URL=https://arkadiuszkamrowski.com make smoke-production
```

It checks core routes, canonical URLs, real 404, `robots.txt`, sitemap, security headers, trailing-slash canonicalization, `www` 308, bad-Origin rejection and same-origin CORS preflight. It intentionally does not send a real email.

## 16. Accessibility sign-off

Automated axe/Playwright is necessary but not sufficient.

Manual PASS required for:

- keyboard-only navigation and Contact flow;
- VoiceOver + Safari;
- NVDA + Chrome/Firefox;
- 200% and 400% zoom/reflow;
- reduced motion;
- visible focus / forced colors;
- Turnstile not creating an accessibility dead end;
- live success/error messaging.

## 17. Privacy/compliance sign-off

Confirm actual behavior matches the privacy notice:

- Cloudflare/Turnstile and Resend roles are accurately described;
- only declared form + technical data is processed;
- no behavioral analytics/advertising is silently enabled;
- no contact payloads, visitor email addresses or Turnstile tokens are stored in Worker logs;
- no automatic CRM/newsletter enrollment;
- provider DPA/transfer terms reviewed as appropriate.

Final legal wording requires owner/legal approval.

## 18. SEO/social sign-off

Verify publicly:

- title/description on Home and representative PL/EN inner pages;
- apex canonical URLs;
- hreflang + `x-default`;
- sitemap and robots;
- OG image 1200×630;
- social preview;
- Perspective structured data;
- no staging, preview, `workers.dev` or localhost URLs in production HTML.

## 19. Monitoring

Keep configured Cloudflare alerts:

- Abuse Report Alert;
- Major/Critical Cloudflare Status Incident Alert;
- HTTP DDoS Attack Alert;
- Universal SSL Alert;
- selected Security Insights.

Add/retain:

- public production HTTPS uptime monitoring on `/`;
- Workers error/exception visibility;
- contact `turnstile_unavailable` / `delivery_unavailable` visibility;
- deployment version + Git SHA ownership.

Passive Origin Monitoring is not applicable to the Worker-native production target.

## 20. Rollback

Keep the previous known-good Worker deployment/version and Git commit.

Rollback immediately if unresolved:

- canonical/redirect loop;
- certificate/public availability failure;
- Turnstile blocks legitimate contact or validation can be bypassed;
- contact leaks data;
- repeated delivery failures;
- major accessibility regression;
- public headers/routing differ materially from the tested contract.

Rollback promotes a previous Worker version/deployment. Do not mutate deployed assets manually or bypass the branch promotion model with ad hoc fixes.

## 21. Final GO / NO-GO

| Gate | Owner | Required |
|---|---|---|
| PR + CI into `main` | repository | PASS |
| PR + CI into `staging` | repository | PASS |
| Staging Custom Domain + Access + noindex | platform owner | PASS |
| Staging functional/accessibility acceptance | owner/QA | PASS |
| PR `staging → production` + CI | repository | PASS |
| Production Worker secrets | platform owner | PASS |
| Turnstile hostname/sitekey/secret/server validation | platform owner | PASS |
| Apex Workers Custom Domain + certificate | domain/platform owner | PASS |
| `www` proxied placeholder + exact 308 redirect | domain owner | PASS |
| Public automated smoke | owner/QA | PASS |
| SPF/DKIM/DMARC reviewed | domain/email owner | PASS |
| Real contact delivery | owner | PASS |
| VoiceOver / NVDA / keyboard / zoom | manual QA | PASS |
| Privacy/legal/provider review | owner/legal | PASS |
| Social preview + structured data | owner/QA | PASS |
| Monitoring + rollback | platform owner | PASS |

**GO only when every required row is PASS.**
