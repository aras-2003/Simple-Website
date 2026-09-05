# Cloudflare runtime and edge contract

This is the repository-side source of truth for the Cloudflare configuration and public runtime of `arkadiuszkamrowski.com`.

Last aligned: **2026-09-06**.

## 1. Target architecture

Cloudflare is both the public edge and the application origin.

```text
GitHub
  │ branch-gated build / deploy
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

This removes origin-bypass as an architectural class of risk: each Workers Custom Domain is the application origin.

## 2. Branch and environment model

`main` is integration-only and must not deploy automatically.

```text
feature/* → PR → main → PR/promote → staging → PR/promote → production
```

Release mapping:

| Git branch | Cloudflare Worker | Public hostname | Automatic release role |
|---|---|---|---|
| `main` | none | none | integration only |
| `staging` | `arkadiuszkamrowski-staging` | `staging.arkadiuszkamrowski.com` | release candidate |
| `production` | `arkadiuszkamrowski` | `arkadiuszkamrowski.com` | production |

Use **two separate Workers Builds applications** connected to the same repository. For both applications, set **Builds for non-production branches = OFF**. `main` must not be selected as the production branch for either application.

Detailed setup values and promotion gates are in `docs/ENVIRONMENTS.md`.

## 3. Wrangler contracts

Three explicit contracts are committed:

- `wrangler.preview.jsonc` — isolated manual/CI preview Worker (`arkadiuszkamrowski-preview`), `workers.dev` enabled; never a release environment.
- `wrangler.staging.jsonc` — staging Worker `arkadiuszkamrowski-staging`, custom domain `staging.arkadiuszkamrowski.com`.
- `wrangler.production.jsonc` — production Worker `arkadiuszkamrowski`, custom domain `arkadiuszkamrowski.com`.

The repository intentionally does **not** use a default `wrangler.jsonc`. This prevents Cloudflare Workers Builds from trying to auto-reconcile a release Worker name/config into the unrelated manual preview contract. Release builds always pass an explicit `--config` path.

Pinned CLI for repository procedures: `wrangler 4.129.0`.

Manual preview:

```bash
npm run build
make worker-preview
```

Staging manual equivalent to Workers Builds:

```bash
make worker-deploy-staging
```

Production manual equivalent:

```bash
set -a
source .env.production
set +a
make worker-deploy-production
```

Cloudflare Workers Builds is the preferred branch-driven release mechanism. The manual GitHub production workflow is retained as a guarded fallback and rejects execution unless the selected ref is `production`.

## 4. Environment isolation

### Staging

Staging uses its own:

- Custom Domain `staging.arkadiuszkamrowski.com`;
- Turnstile widget/sitekey/secret restricted to the staging hostname;
- Worker secret set;
- rate-limit namespace;
- build variables;
- Cloudflare Workers Builds application.

Staging must not share the production Turnstile secret.

Staging is non-indexable by construction:

- Worker emits `X-Robots-Tag: noindex, nofollow, noarchive`;
- Worker overrides `/robots.txt` to `Disallow: /`;
- `wrangler.staging.jsonc` sends all requests through Worker code so the noindex policy cannot be bypassed by direct Static Asset handling;
- Cloudflare Access should additionally protect the staging hostname.

### Production

Production remains public and indexable. Its Worker only runs first for `/api/*` and trailing-slash canonicalization; normal static pages stay on the optimized Static Assets path.

Production Turnstile remains widget `arkadiuszkamrowski-contact`, Managed mode, pre-clearance disabled, restricted to `arkadiuszkamrowski.com`.

## 5. DNS model

The production apex uses a Workers **Custom Domain**. Cloudflare creates the DNS record and certificate for `arkadiuszkamrowski.com` when the Custom Domain is attached; do not invent an A/CNAME origin record.

Staging uses the same Custom Domain mechanism for `staging.arkadiuszkamrowski.com`.

Canonical production host policy:

- `https://arkadiuszkamrowski.com` — application Custom Domain.
- `https://www.arkadiuszkamrowski.com` — redirect-only alias.

The existing Cloudflare rule `Redirect from WWW to apex` remains authoritative and must return **308**, preserving path and query. Because `www` is redirect-only and has no origin, create the documented originless placeholder only for production launch:

```text
A | www | 192.0.2.0 | Proxied
```

`192.0.2.0` is a reserved documentation address; proxied requests are intercepted by Cloudflare and must never be sent there.

Email verification/delivery DNS records (MX/TXT/DKIM/DMARC/SPF) remain DNS-only unless the provider explicitly documents otherwise.

## 6. Static asset routing

Wrangler deploys `./dist` as Workers Static Assets.

Production policy:

- assets are attempted directly without Worker invocation;
- `/api/*` invokes Worker code first;
- trailing-slash requests invoke Worker code first so the repository preserves the one-hop **308** no-trailing-slash contract;
- unknown paths return a real custom 404 (`not_found_handling = 404-page`);
- `html_handling = drop-trailing-slash` is defense in depth for alternate HTML file forms.

Staging/preview policy deliberately uses `run_worker_first = ["/*"]` so non-production anti-indexing headers and `robots.txt` policy are applied consistently.

## 7. Security headers and cache policy

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

## 8. Contact API

Same-origin `POST /api/contact` is handled by `worker/index.mjs`.

Controls:

- explicit environment-specific Origin allow-list;
- 32 KiB body ceiling;
- strict field lengths and topic allow-list;
- honeypot and minimum completion time;
- Cloudflare Workers Rate Limiting binding;
- mandatory Turnstile token and server-side Siteverify on release environments;
- expected Turnstile hostname bound to the current environment;
- Resend idempotency key derived from submission identity;
- no message body, visitor email, Turnstile token or secret in application logs;
- no contact database, CRM or newsletter enrollment.

Production expected hostname: `arkadiuszkamrowski.com`.

Staging expected hostname: `staging.arkadiuszkamrowski.com`.

## 9. Existing dashboard controls

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

`Full (strict)` is no longer an application-origin launch dependency because Workers Custom Domains are the origins. If the zone later proxies an external origin, that hostname must use an appropriate strict origin-TLS posture independently.

## 10. Notifications

Keep the active production policies:

- `Abuse | Cloudflare Abuse Report Alert | arkadiuszkamrowski.com`
- `Cloudflare Status | Incident Alert` — Major + Critical
- `DDoS Protection | HTTP DDoS Attack Alert | arkadiuszkamrowski.com`
- `SSL/TLS | Universal SSL Alert | arkadiuszkamrowski.com`
- `Security insights | New Insight detected | arkadiuszkamrowski.com`

Origin-specific monitoring such as Passive Origin Monitoring is not required for the Cloudflare-native target. Use Workers observability plus public HTTPS uptime monitoring instead.

## 11. Staging acceptance gate

PASS requires:

- [ ] `staging` branch CI passes
- [ ] staging Workers Builds application tracks only `staging`
- [ ] non-production branch builds are OFF
- [ ] staging Custom Domain/certificate is valid
- [ ] Cloudflare Access protects staging
- [ ] `X-Robots-Tag: noindex, nofollow, noarchive` is present
- [ ] staging `/robots.txt` disallows all crawlers
- [ ] PL/EN routes, 404 and 308 canonical redirects pass
- [ ] staging Turnstile uses staging-only credentials and hostname
- [ ] contact flow passes if enabled for acceptance
- [ ] browser/accessibility checks pass on the release candidate

## 12. Production launch gate

PASS requires all of the following:

- [ ] exact release candidate has been accepted on `staging`
- [ ] promotion to `production` occurs through PR/review
- [ ] `production` branch CI passes
- [ ] production Workers Builds application tracks only `production`
- [ ] non-production branch builds are OFF
- [ ] Worker secrets exist in the production Worker
- [ ] production sitekey is present at Astro build time
- [ ] Turnstile widget hostname is restricted to the production apex
- [ ] production Wrangler dry-run passes
- [ ] apex Workers Custom Domain is attached and certificate is valid
- [ ] apex DNS is Cloudflare-managed by the Custom Domain
- [ ] proxied `www → 192.0.2.0` redirect-only record exists
- [ ] `www` returns one-hop 308 to apex preserving path/query
- [ ] HTTP redirects to HTTPS
- [ ] all core routes and real 404 pass public smoke
- [ ] static and Worker security headers match the contract
- [ ] `/api/contact` is `no-store`, validates Turnstile server-side and delivers exactly one test email
- [ ] SPF/DKIM/DMARC are reviewed for the Resend sender domain
- [ ] Workers logs contain operational metadata only
- [ ] existing Cloudflare alert policies remain enabled

Any dashboard change that affects this contract must be reflected here and, where enforceable, in automated tests.
