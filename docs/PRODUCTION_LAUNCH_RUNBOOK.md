# Production launch runbook

This is the operational checklist for promoting `arkadiuszkamrowski.com` to the public Internet on **Cloudflare Workers + Static Assets**.

The detailed Cloudflare configuration contract is in `docs/CLOUDFLARE.md`.

## 1. Locked release decisions

Unless explicitly changed and re-reviewed:

- canonical origin: `https://arkadiuszkamrowski.com`
- canonical host: `arkadiuszkamrowski.com`
- `www`: redirect-only alias to apex
- runtime: Cloudflare Workers + Static Assets
- frontend: pre-rendered Astro
- dynamic endpoint: same-origin `POST /api/contact`
- anti-abuse: Cloudflare security controls + Workers Rate Limiting + Turnstile Managed
- email delivery: Resend HTTPS API
- analytics/advertising: disabled at launch
- database / CRM / newsletter capture: none
- production secrets: Cloudflare Worker secrets only

Target path:

```text
Internet
  → Cloudflare Workers Custom Domain
      ├── Static Assets / Astro
      └── /api/contact → Turnstile Siteverify → Resend
```

No VM, NGINX, container registry, Container App, public origin server or Kubernetes cluster is required for production v1.

## 2. Inputs still required

1. Cloudflare Workers deployment permission.
2. Production Turnstile sitekey + secret for `arkadiuszkamrowski-contact`.
3. Turnstile hostname restriction for `arkadiuszkamrowski.com`.
4. `RESEND_API_KEY`.
5. Final `CONTACT_TO_EMAIL` mailbox.
6. Verified sender/domain for `CONTACT_FROM_EMAIL`.
7. Final privacy/legal review.
8. VoiceOver and NVDA manual QA.

Never paste production secrets into source, PRs, issues or screenshots.

## 3. Production configuration

Use `.env.production.example` only as a contract/template.

Required public build value:

```text
PUBLIC_TURNSTILE_SITE_KEY
```

Required Worker secrets:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
```

Non-secret Worker runtime configuration is committed in `wrangler.production.jsonc`.

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

## 4. Preview deployment

Before touching the apex Custom Domain:

```bash
SITE_BASE_URL=https://arkadiuszkamrowski.com \
SITE_PRODUCTION_HOST=arkadiuszkamrowski.com \
REQUIRE_PRODUCTION_SITE=1 \
PUBLIC_TURNSTILE_SITE_KEY=<approved-preview-or-production-sitekey> \
make worker-preview
```

`wrangler.jsonc` keeps `workers.dev` and Preview URLs enabled.

Preview acceptance:

- build succeeds;
- core PL/EN routes render;
- custom 404 works;
- security headers are present;
- CSP does not contain `unsafe-inline`;
- `/api/contact` rejects bad Origin;
- Worker logs contain no sensitive payloads;
- if real Turnstile is tested on preview, that preview hostname must be explicitly approved in the widget configuration. Do not weaken the production hostname restriction merely for convenience.

## 5. Provision Worker secrets

From a trusted local environment or equivalent Cloudflare secret-management flow:

```bash
npx --yes wrangler@4.129.0 secret put TURNSTILE_SECRET_KEY --config wrangler.production.jsonc
npx --yes wrangler@4.129.0 secret put RESEND_API_KEY --config wrangler.production.jsonc
npx --yes wrangler@4.129.0 secret put CONTACT_TO_EMAIL --config wrangler.production.jsonc
```

Confirm secret names exist without printing values.

## 6. Email-domain setup

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

## 7. Production Worker deployment

With production build/runtime values loaded:

```bash
make worker-deploy-production
```

`wrangler.production.jsonc`:

- disables `workers.dev`;
- disables public Preview URLs for the production deployment;
- attaches `arkadiuszkamrowski.com` as a Workers Custom Domain;
- deploys `dist` as Static Assets;
- sends `/api/*` and trailing-slash canonicalization through Worker code;
- uses real 404 handling;
- binds the contact rate limiter.

Cloudflare creates the apex Custom Domain DNS record and certificate automatically.

## 8. `www` redirect-only DNS

Keep the existing Cloudflare Redirect Rule:

- `www` → apex
- **308 Permanent Redirect**
- preserve path/query

Because `www` has no origin, add the Cloudflare-documented originless placeholder:

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

## 9. Public route/TLS acceptance

Expected behavior:

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
- HSTS only while all covered public hosts are intentionally HTTPS-capable.

There is no separate origin-certificate or Full-(strict)-to-origin dependency in the Worker-native architecture.

## 10. Security-header acceptance

Static Assets use `public/_headers`; Worker responses emit the same application security baseline.

Verify effective public values:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

CSP must:

- allow same-origin application resources;
- allow `https://challenges.cloudflare.com` only where required for Turnstile;
- block inline script attributes;
- contain no `unsafe-inline`.

Do not enable Rocket Loader, Cloudflare Fonts or other browser-script injection without re-running CSP/accessibility/performance/privacy gates.

## 11. Turnstile production activation

1. Widget remains `arkadiuszkamrowski-contact`, Managed mode.
2. Hostname list contains the apex and no unnecessary production hosts.
3. `PUBLIC_TURNSTILE_SITE_KEY` is present in the built form.
4. `TURNSTILE_SECRET_KEY` exists only as Worker secret.
5. Missing token cannot send email.
6. Invalid token cannot send email.
7. Wrong-hostname Siteverify response is rejected.
8. One valid token produces exactly one email.
9. Token/secret never appear in logs.

Pre-clearance remains disabled unless separately reviewed.

## 12. Production contact smoke

From the real public page:

1. Submit an invalid form and verify useful feedback.
2. Complete one valid Turnstile-backed submission using an address you control.
3. Confirm on-page success.
4. Confirm exactly one email arrives.
5. Reply and confirm Reply-To targets the submitted visitor address.
6. Confirm logs show only operational metadata.
7. Confirm repeated rapid attempts eventually hit abuse controls without breaking normal later submissions.

Do not load-test Resend or Turnstile.

## 13. Automated public smoke

After the Custom Domain and `www` DNS are live:

```bash
SITE_BASE_URL=https://arkadiuszkamrowski.com make smoke-production
```

It checks core routes, canonical URLs, real 404, `robots.txt`, sitemap, security headers, trailing-slash canonicalization, `www` 308, bad-Origin rejection and same-origin CORS preflight. It intentionally does not send a real email.

## 14. Accessibility sign-off

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

## 15. Privacy/compliance sign-off

Confirm actual behavior matches the privacy notice:

- Cloudflare/Turnstile and Resend roles are accurately described;
- only declared form + technical data is processed;
- no behavioral analytics/advertising is silently enabled;
- no contact payloads, visitor email addresses or Turnstile tokens are stored in Worker logs;
- no automatic CRM/newsletter enrollment;
- provider DPA/transfer terms reviewed as appropriate.

Final legal wording requires owner/legal approval.

## 16. SEO/social sign-off

Verify publicly:

- title/description on Home and representative PL/EN inner pages;
- apex canonical URLs;
- hreflang + `x-default`;
- sitemap and robots;
- OG image 1200×630;
- social preview;
- Perspective structured data;
- no `workers.dev`, preview or localhost URLs in production HTML.

## 17. Monitoring

Keep configured Cloudflare alerts:

- Abuse Report Alert;
- Major/Critical Cloudflare Status Incident Alert;
- HTTP DDoS Attack Alert;
- Universal SSL Alert;
- selected Security Insights.

Add/retain:

- public HTTPS uptime monitoring on `/`;
- Workers error/exception visibility;
- contact `turnstile_unavailable` / `delivery_unavailable` visibility;
- deployment version + Git SHA ownership.

Passive Origin Monitoring is not applicable to the Worker-native production target.

## 18. Rollback

Keep the previous known-good Worker deployment/version and Git commit.

Rollback immediately if unresolved:

- canonical/redirect loop;
- certificate/public availability failure;
- Turnstile blocks legitimate contact or validation can be bypassed;
- contact leaks data;
- repeated delivery failures;
- major accessibility regression;
- public headers/routing differ materially from the tested contract.

Rollback promotes a previous Worker version/deployment; do not mutate deployed assets manually.

## 19. Final GO / NO-GO

| Gate | Owner | Required |
|---|---|---|
| Astro/static/Worker CI | repository | PASS |
| Wrangler preview + production dry-run | repository | PASS |
| Performance + browser matrix + automated WCAG | repository | PASS |
| Worker secrets provisioned | platform owner | PASS |
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
