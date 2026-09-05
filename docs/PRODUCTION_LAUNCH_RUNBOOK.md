# Production launch runbook

This is the operational checklist for promoting the site from release candidate to the public Internet. It separates what the repository can guarantee from what still requires access to Cloudflare, the hosting platform, Resend and real assistive technology.

The Cloudflare dashboard contract is documented in `docs/CLOUDFLARE.md`; this runbook treats that edge configuration as part of the production system, not as an optional CDN layer.

## 1. Locked release decisions

Unless explicitly changed and re-reviewed, production uses:

- canonical origin: `https://arkadiuszkamrowski.com`
- canonical host: `arkadiuszkamrowski.com`
- `www`: redirect-only alias to apex, never a second copy
- public edge: **Cloudflare**
- frontend: pre-rendered Astro served by hardened NGINX
- contact: same-origin `POST /api/contact` → isolated Node sidecar
- contact abuse protection: **Cloudflare Turnstile Managed + server-side Siteverify**
- email delivery: Resend HTTPS API
- analytics/advertising: disabled at launch
- public database / CRM / newsletter capture: none
- production secrets: hosting-platform secret store only
- release images: immutable digest or commit-addressable hexadecimal tag; never `latest`/`production`

Target request path:

```text
Internet → Cloudflare → managed origin (ACA preferred if Azure)
                     → NGINX :8080 → contact API :8787
```

The origin must not become a trivial alternative path around Cloudflare. The contact sidecar must never have independent public ingress.

## 2. Inputs required from owner/platform

Only these values/decisions cannot be manufactured by the repository:

1. Hosting target/account/subscription and deployment permission.
2. Cloudflare DNS control for `arkadiuszkamrowski.com`.
3. Final production origin values produced by the selected hosting platform.
4. Cloudflare Turnstile `site key` and `secret key` for widget `arkadiuszkamrowski-contact`.
5. Confirmation that the Turnstile hostname list includes `arkadiuszkamrowski.com` and no unnecessary production hosts.
6. `RESEND_API_KEY`.
7. Final `CONTACT_TO_EMAIL` mailbox.
8. Verified sender/domain for `CONTACT_FROM_EMAIL`.
9. Final privacy/legal approval for Cloudflare/Turnstile/Resend/provider processing.
10. Access to macOS/iOS VoiceOver and Windows NVDA for the manual audit.

Never paste production secret keys into source, documentation, PR comments or public issue threads.

## 3. Production configuration

Use `.env.production.example` as the contract; never commit a populated copy.

For a local preflight only:

```bash
umask 077
cp .env.production.example .env.production
# populate immutable image refs + private values locally
set -a
source .env.production
set +a
make predeploy
rm .env.production
```

`make predeploy` fails when, among other things:

- canonical origin is not HTTPS or host-aligned,
- image refs are mutable/missing,
- contact dry-run remains enabled,
- Origin enforcement/allow-list is wrong,
- Turnstile is not required in production,
- Turnstile sitekey/secret is absent or malformed,
- Turnstile expected hostname differs from `arkadiuszkamrowski.com`,
- email delivery credentials/addresses are incomplete,
- sender domain is not aligned,
- runtime/rate-limit values are invalid.

The preflight never prints Resend or Turnstile secrets.

After PASS:

```bash
make docker-build-production
```

## 4. Cloudflare edge pre-launch state

The dashboard has already been hardened, but the DNS zone intentionally remains empty while no origin exists.

Configured baseline includes:

- 308 `www` → apex redirect with query preservation,
- Browser Integrity Check,
- Cloudflare managed ruleset,
- HTTP DDoS protection,
- selected AI crawler blocking,
- URL normalization at the edge,
- response-header baseline transform,
- removal of `X-Powered-By`,
- HTTP/2, HTTP/2 to origin and HTTP/3,
- 0-RTT disabled,
- conservative cache/performance baseline,
- Turnstile widget in Managed mode,
- security/DDoS/TLS/status notifications.

Do **not** create placeholder DNS records merely to make dashboard recommendations disappear.

## 5. Hosting/runtime requirements

The production origin platform must provide:

- valid automatically renewed origin TLS,
- secret storage/injection,
- one application ingress to NGINX,
- private/loopback communication to the contact sidecar,
- a practical way to prevent trivial direct-origin bypass around Cloudflare,
- health/restart handling,
- immutable revision/image deployment tied to Git commit,
- logs without request/contact/token bodies,
- deterministic rollback,
- basic runtime monitoring.

If Azure is selected, default to Azure Container Apps. Existing AKS IaC is reference-only; see `infra/azure/README.md`.

## 6. DNS and TLS cutover

The zone currently has **0 records by design**.

When the final origin exists:

1. Capture/export the current Cloudflare zone state before changes.
2. Add hosting-provider ownership/verification TXT records exactly as generated; keep them DNS-only.
3. Complete origin custom-domain/certificate validation required by the hosting provider.
4. Add the final apex web record using the real origin value.
5. After origin validation, set the apex web record to **Proxied / orange cloud**.
6. Add a proxied `www` record so Cloudflare can terminate HTTPS and execute the existing redirect rule.
7. Set Cloudflare SSL/TLS encryption mode to **Full (strict)** after the origin certificate is valid.
8. Confirm Minimum TLS target remains 1.2+.
9. Confirm HTTP→HTTPS and `www`→apex are one-hop and loop-free.
10. Confirm origin is not trivially reachable in a way that bypasses Cloudflare controls.

Email/service records are different: MX, SPF, DKIM, DMARC and verification TXT records normally remain DNS-only.

Target behavior:

| Request | Expected result |
|---|---|
| `http://arkadiuszkamrowski.com/*` | permanent HTTPS redirect |
| `https://arkadiuszkamrowski.com/` | `200` |
| `https://arkadiuszkamrowski.com/about` | `200` |
| `https://arkadiuszkamrowski.com/en/about` | `200` |
| `https://arkadiuszkamrowski.com/path/` | `308` to no-trailing-slash path |
| `https://www.arkadiuszkamrowski.com/*` | **308** to apex preserving path/query |
| unknown path | real `404`, not SPA `200` |

TLS acceptance:

- valid Cloudflare certificate for every public hostname,
- valid origin certificate compatible with Full (strict),
- no mixed content,
- automatic renewal,
- HTTP redirects before content is served,
- HSTS only after every covered hostname is intentionally HTTPS-capable.

## 7. Turnstile production activation

Before enabling real contact delivery:

1. Confirm Cloudflare widget `arkadiuszkamrowski-contact` uses **Managed** mode.
2. Confirm hostname restriction includes `arkadiuszkamrowski.com`.
3. Put `PUBLIC_TURNSTILE_SITE_KEY` in the frontend build configuration.
4. Put `TURNSTILE_SECRET_KEY` only in the hosting secret store.
5. Set `TURNSTILE_REQUIRED=1`.
6. Set `TURNSTILE_EXPECTED_HOSTNAME=arkadiuszkamrowski.com`.
7. Build/promote a new immutable revision.
8. Verify the widget loads under the production CSP.
9. Verify a missing/invalid token cannot send email.
10. Verify one valid token results in exactly one delivered message.

Pre-clearance remains disabled; do not enable it casually because that changes challenge/cookie behavior beyond the contact action.

## 8. Email-domain setup

Default sender identity:

```text
Website <contact@arkadiuszkamrowski.com>
```

Use the exact verification records generated by the email provider.

- DKIM: publish exactly.
- SPF: inspect existing SPF first; never create two independent SPF policies.
- DMARC: inspect current policy before changing enforcement.
- MX: do not alter inbound-mail routing merely to enable transactional sending unless explicitly required and understood.

Acceptance:

- provider reports sender/domain verified,
- SPF/DKIM checks pass,
- DMARC has no known configuration error,
- a real form submission reaches `CONTACT_TO_EMAIL`,
- Reply targets the submitted visitor because API uses `reply_to`,
- no visitor message/email body is logged.

## 9. Security-header / CSP acceptance

At the public edge, effective responses must expose the intended baseline:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

Origin CSP/HSTS remain in NGINX. CSP must allow Turnstile without opening `unsafe-inline`:

```text
script-src ... https://challenges.cloudflare.com
frame-src https://challenges.cloudflare.com
```

Do not enable Rocket Loader, Cloudflare Fonts, JavaScript Detection or other browser-script injection without re-running CSP, accessibility, privacy and performance validation.

## 10. Manual accessibility sign-off

Automated axe/Playwright is necessary but not sufficient. Record PASS/FIX on final production build.

### Keyboard only

Test Home, Perspective article, OAF, Practice, About, Contact and Privacy in PL plus representative EN routes.

- skip link works,
- all controls reachable,
- focus visible,
- no trap,
- navigation order coherent,
- contact form including Turnstile remains usable without a pointer.

### VoiceOver + Safari

- title/language/landmarks/headings announced correctly,
- decorative visuals do not pollute order,
- form labels/hints/errors/status are understandable,
- Turnstile does not create an inaccessible dead end,
- successful submission is announced.

### NVDA + Chrome/Firefox

Verify headings/landmarks, form names/descriptions/errors, live status, PL/EN language changes and Turnstile flow.

### Zoom/reflow/contrast

- 200% zoom usable,
- 400% / ~320 CSS px without page-level horizontal scrolling,
- increased text size usable,
- reduced-motion respected,
- forced colors/focus remain perceivable.

Only after the manual pass should a formal WCAG conformance claim be made.

## 11. Privacy/compliance sign-off

Before public delivery confirm:

- privacy copy accurately names Cloudflare/Turnstile, hosting and Resend roles,
- actual data collected matches the notice,
- provider transfer/DPA terms have been reviewed as appropriate,
- no analytics/advertising is silently enabled,
- logs exclude contact payloads, visitor emails, Turnstile token and secret,
- no automatic CRM/newsletter enrollment occurs.

Final legal basis/wording requires owner/legal approval; repository checks are not legal advice.

## 12. SEO/social production check

After public DNS cutover verify:

- title/description on Home plus PL/EN inner pages,
- canonical URLs use final HTTPS apex,
- hreflang pairs + `x-default`,
- `sitemap-index.xml`,
- `robots.txt` canonical sitemap,
- 1200×630 OG image,
- LinkedIn/social preview,
- Perspective Article structured data,
- no staging/localhost/provider-origin URLs in rendered HTML.

## 13. Production contact smoke

From the public UI:

1. Invalid form produces useful feedback.
2. Turnstile is visible/non-disruptive as appropriate for Managed mode.
3. Valid submission succeeds.
4. Exactly one email arrives.
5. Reply targets visitor address.
6. Logs contain operational metadata only.
7. Missing/invalid Turnstile cannot deliver.
8. Repeated rapid submissions eventually reach limiter/WAF behavior without breaking normal later submissions.

Do not load-test the live mail provider or Turnstile unnecessarily.

## 14. Public automated smoke

After DNS/TLS/revision are live:

```bash
SITE_BASE_URL=https://arkadiuszkamrowski.com make smoke-production
```

The smoke test checks routes, canonicalization, `robots.txt`/sitemap, effective security/CSP headers, exact **308** `www` redirect, bad-origin rejection and same-origin CORS preflight. It intentionally does not send a real contact message.

Then manually walk:

`Home → Perspective → article → OAF → Practice → About → Contact`

in PL and equivalent EN paths.

## 15. Monitoring baseline

Already configured in Cloudflare:

- Abuse Report Alert,
- Major/Critical Cloudflare Status Incident Alert,
- HTTP DDoS Attack Alert,
- Universal SSL Alert,
- selected high-signal Security Insights.

After origin exists add, where useful:

- HTTPS uptime check on `/`,
- origin/container restart/crash alerting,
- `turnstile_unavailable` / contact-delivery error visibility,
- Passive Origin Monitoring,
- Health Check notifications.

For first 24h review errors/contact delivery manually. Review field Core Web Vitals later only when sufficient real traffic exists.

## 16. Rollback

Keep previous known-good image/artifact digests and Git commit available.

Rollback if any of these cannot be safely corrected in place:

- redirect loop/canonical break,
- invalid TLS or broad outage,
- direct-origin/security bypass introduced,
- Turnstile blocks legitimate contact flow or validation is bypassable,
- contact endpoint leaks data,
- repeated delivery failures,
- severe accessibility regression,
- effective headers/routing materially differ from tested contract.

Rollback restores previous immutable revision/configuration; never hot-edit production files.

## 17. Final GO / NO-GO

| Gate | Owner | Required |
|---|---|---|
| PR CI: build/static/performance/references | repository | PASS |
| Browser matrix + automated WCAG | repository | PASS |
| Container runtime E2E + Trivy | repository | PASS |
| Production predeploy + immutable images | platform owner | PASS |
| Cloudflare edge contract matches `docs/CLOUDFLARE.md` | domain owner | PASS |
| Origin direct-bypass restriction | platform owner | PASS |
| Cloudflare DNS + Full (strict) TLS + 308 canonical redirects | domain/platform owner | PASS |
| Turnstile hostname + sitekey/secret + server-side verification | domain/platform owner | PASS |
| Public non-destructive smoke | owner/QA | PASS |
| SPF/DKIM/DMARC reviewed | domain/email owner | PASS |
| Real contact delivery | owner | PASS |
| VoiceOver + Safari | manual QA | PASS |
| NVDA + Chrome/Firefox | manual QA | PASS |
| Keyboard/zoom/reflow | manual QA | PASS |
| Privacy/legal/provider review | owner/legal | PASS |
| Social preview + structured data | owner/QA | PASS |
| Monitoring + rollback path | platform owner | PASS |

**GO only when every required row is PASS.**
