# Cloudflare production contract

This is the repository-side source of truth for the Cloudflare configuration and production runtime of `arkadiuszkamrowski.com`.

Last aligned: **2026-09-06**.

## 1. Target architecture

Cloudflare is both the public edge and the application origin.

```text
GitHub
  │ build / deploy
  ▼
Cloudflare Workers
  ├── Static Assets → pre-rendered Astro HTML/CSS/JS
  ├── Worker /api/contact
  │      ├── Turnstile Siteverify
  │      └── Resend HTTPS API → mailbox
  ├── DNS + certificates
  ├── WAF / DDoS / bot controls
  ├── redirects / URL normalization
  └── observability / notifications
```

There is **no production VM, NGINX, container registry, Container App, Kubernetes cluster or public application server** in the v1 target. Docker/Kubernetes material in the repository is portability/reference-only.

This removes origin-bypass as an architectural class of risk: the Worker Custom Domain is the origin.

## 2. Deployments

Two Wrangler contracts are committed:

- `wrangler.jsonc` — preview deployment with `workers.dev` and Preview URLs enabled.
- `wrangler.production.jsonc` — production deployment, `workers.dev` disabled, apex attached as a Workers **Custom Domain**.

Pinned CLI for repository procedures: `wrangler 4.129.0`.

Preview:

```bash
npm run build
make worker-preview
```

Production:

```bash
set -a
source .env.production
set +a
make worker-deploy-production
```

The production build requires `PUBLIC_TURNSTILE_SITE_KEY`. Runtime secrets are stored in Cloudflare, never in Git.

Required Worker secrets:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

## 3. DNS model

Before the first Worker production deployment, an empty web DNS zone is valid.

The apex uses a Workers **Custom Domain**. Cloudflare creates the DNS record and certificate for `arkadiuszkamrowski.com` when the Custom Domain is attached; do not invent an A/CNAME origin record.

Canonical host policy:

- `https://arkadiuszkamrowski.com` — application Custom Domain.
- `https://www.arkadiuszkamrowski.com` — redirect-only alias.

The existing Cloudflare rule `Redirect from WWW to apex` remains authoritative and must return **308**, preserving path and query. Because `www` is redirect-only and has no origin, create the Cloudflare-documented originless placeholder after the Worker is ready:

```text
A | www | 192.0.2.0 | Proxied
```

`192.0.2.0` is a reserved documentation address; proxied requests are intercepted by Cloudflare and must never be sent there.

Email verification/delivery DNS records (MX/TXT/DKIM/DMARC/SPF) remain DNS-only unless the provider explicitly documents otherwise.

## 4. Static asset routing

Wrangler deploys `./dist` as Workers Static Assets.

Policy:

- assets are attempted directly without Worker invocation;
- `/api/*` invokes Worker code first;
- trailing-slash requests invoke Worker code first so the repository preserves the existing one-hop **308** no-trailing-slash contract;
- unknown paths return a real custom 404 (`not_found_handling = 404-page`);
- `html_handling = drop-trailing-slash` is defense in depth for alternate HTML file forms.

Static asset requests therefore remain on the optimized asset path instead of paying Worker execution cost for every page view.

## 5. Security headers and cache policy

`public/_headers` is the application-level source for headers on Static Assets. Dynamic Worker responses emit the same security baseline in code.

Baseline:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

CSP allows only the existing same-origin resources plus Cloudflare Turnstile (`https://challenges.cloudflare.com`) in the required script/frame/connect directives. `unsafe-inline` is not permitted.

Static cache policy:

- `/_astro/*`: `public, max-age=31536000, immutable`
- `/assets/*` and `/scripts/*`: one day + stale-while-revalidate
- HTML: Workers Static Assets default revalidation semantics
- `/api/contact`: `no-store`

The dashboard Response Header Transform `Security Headers - Baseline` may remain as edge defense in depth. Values must stay semantically identical to the repository contract so duplicate/conflicting policy is not created.

## 6. Contact API

Production endpoint: same-origin `POST /api/contact` handled by `worker/index.mjs`.

Controls:

- explicit production Origin allow-list;
- 32 KiB body ceiling;
- strict field lengths and topic allow-list;
- honeypot and minimum completion time;
- Cloudflare Workers Rate Limiting binding (10 attempts/minute per edge client identity, permissive safety layer);
- mandatory Turnstile token and server-side Siteverify;
- expected Turnstile hostname `arkadiuszkamrowski.com`;
- Resend idempotency key derived from submission identity;
- no message body, visitor email, Turnstile token or secret in application logs;
- no contact database, CRM or newsletter enrollment.

Turnstile remains configured as widget `arkadiuszkamrowski-contact`, Managed mode, pre-clearance disabled. Restrict its production hostname to the apex domain.

## 7. Existing dashboard controls

Keep the security posture already established:

- Universal SSL / managed edge certificates
- HTTP/2 and HTTP/3 enabled
- minimum TLS target 1.2+
- 0-RTT disabled
- managed security ruleset active
- Browser Integrity Check enabled
- HTTP DDoS protection
- Bot Fight Mode / bot protections as configured
- AI crawler policy as configured
- URL normalization: Cloudflare normalization enabled for incoming requests
- managed transform removing `X-Powered-By`
- Rocket Loader / Cloudflare Fonts / script-injection optimizations disabled unless re-audited

`Full (strict)` is no longer an application-origin launch dependency because the Worker Custom Domain is itself the origin. If the zone later proxies another external origin, that hostname must use an appropriate strict origin-TLS posture independently.

## 8. Notifications

Keep the active policies:

- `Abuse | Cloudflare Abuse Report Alert | arkadiuszkamrowski.com`
- `Cloudflare Status | Incident Alert` — Major + Critical
- `DDoS Protection | HTTP DDoS Attack Alert | arkadiuszkamrowski.com`
- `SSL/TLS | Universal SSL Alert | arkadiuszkamrowski.com`
- `Security insights | New Insight detected | arkadiuszkamrowski.com`

Origin-specific monitoring such as Passive Origin Monitoring is no longer required for the Cloudflare-native target. Use Workers observability plus public HTTPS uptime monitoring instead.

## 9. Production launch gate

PASS requires all of the following:

- [ ] preview deploy passes on the Workers preview hostname
- [ ] Worker secrets exist in Cloudflare
- [ ] production sitekey is present at Astro build time
- [ ] Turnstile widget hostname is restricted to approved production host(s)
- [ ] production Wrangler dry-run passes
- [ ] apex Workers Custom Domain is attached and certificate is valid
- [ ] apex DNS is Cloudflare-managed by the Custom Domain
- [ ] proxied `www → 192.0.2.0` placeholder exists for the redirect-only hostname
- [ ] `www` returns one-hop 308 to apex preserving path/query
- [ ] HTTP redirects to HTTPS
- [ ] all core routes and real 404 pass public smoke
- [ ] static and Worker security headers match the contract
- [ ] `/api/contact` is `no-store`, validates Turnstile server-side and delivers exactly one test email
- [ ] SPF/DKIM/DMARC are reviewed for the Resend sender domain
- [ ] Workers logs contain operational metadata only
- [ ] existing Cloudflare alert policies remain enabled

Any dashboard change that affects this contract must be reflected here and, where enforceable, in automated tests.
