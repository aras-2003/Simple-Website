# Cloudflare edge contract

This document is the repository-side source of truth for the Cloudflare configuration protecting `arkadiuszkamrowski.com`. It records the configuration established in the Cloudflare dashboard and defines the deployment contract that the hosting platform must satisfy.

Last aligned with the dashboard: **2026-09-05**.

## 1. Role in the production architecture

Cloudflare is the only intended public edge for the production site.

```text
Internet
  │
  ▼
Cloudflare
  ├── authoritative DNS
  ├── Universal SSL / TLS edge
  ├── HTTP DDoS protection
  ├── WAF / security rules / Browser Integrity Check
  ├── AI crawler controls
  ├── redirect and response-header transforms
  ├── URL normalization
  └── Turnstile for the contact form
  │
  ▼
managed origin (Azure Container Apps preferred if Azure is selected)
  └── NGINX :8080 → contact sidecar :8787
```

The origin must not become an alternative public entry point. When the production origin is created, restrict direct access to the extent supported by the selected platform and document the control before switching DNS to proxied mode.

## 2. Current DNS state

The Cloudflare zone is active with **DNS Setup: Full**, but intentionally has **0 public DNS records** while no production origin exists.

Do not create placeholder `A`, `AAAA` or `CNAME` records merely to silence dashboard recommendations. DNS is added only after the final origin exists.

### Launch target

The canonical host is the apex:

- `https://arkadiuszkamrowski.com` — canonical site
- `https://www.arkadiuszkamrowski.com` — redirect-only alias

For an Azure Container Apps origin, use the exact records produced by the final ACA custom-domain workflow. The expected pattern is:

1. ownership/verification TXT records such as `asuid` remain **DNS only**;
2. validate the ACA custom domain and managed certificate before enabling the proxy if the platform requires direct DNS visibility during validation;
3. the canonical apex web record becomes **Proxied (orange cloud)** after validation;
4. create a proxied `www` record so Cloudflare can receive the HTTPS request and apply the edge redirect; `www` must not host an independently canonicalized copy of the site;
5. email/provider verification records (MX, SPF, DKIM, DMARC) remain **DNS only** unless their provider explicitly documents otherwise.

Never invent an origin IP or hostname in this repository. Record the final values in deployment metadata, not source code.

## 3. Canonical redirects

Configured Cloudflare Redirect Rule:

- name: `Redirect from WWW to apex`
- match: `https://www.*`
- target: `https://${1}`
- status: **308 Permanent Redirect**
- preserve query string: **enabled**

Expected behavior:

```text
https://www.arkadiuszkamrowski.com/path?a=1
  → 308
https://arkadiuszkamrowski.com/path?a=1
```

NGINX keeps the same redirect as a defensive fallback, but Cloudflare is the production edge owner of the public `www` redirect.

HTTP → HTTPS is a launch requirement. Keep the canonical redirect chain to one hop wherever possible.

## 4. TLS and protocol posture

Configured/approved protocol posture:

- HTTP/2: enabled
- HTTP/2 to Origin: enabled
- HTTP/3 (QUIC): enabled
- 0-RTT Connection Resumption: disabled
- Minimum TLS version target: **TLS 1.2 or newer**
- Universal SSL notifications: enabled

Production launch target:

- Cloudflare SSL/TLS encryption mode: **Full (strict)** once the origin certificate is bound;
- valid origin certificate for the canonical origin;
- no mixed content;
- HSTS only after every hostname covered by the policy is intentionally HTTPS-capable.

Do not weaken origin TLS to make a deployment pass.

## 5. Security controls

Dashboard posture established during hardening:

- Cloudflare managed security ruleset: active
- Browser Integrity Check: enabled
- Security Level: Cloudflare automated / always protected posture
- Challenge Passage: 30 minutes
- custom AI crawler blocking rule: active
- HTTP DDoS protection alerting: active
- Managed Transform `Remove "X-Powered-By" headers`: enabled

The AI policy is intentionally selective: block crawler traffic used primarily for model training/collection while keeping ordinary search and user-initiated assistant/search traffic available unless a later policy decision changes this. Do not block Googlebot/BingBot or user-initiated AI assistant/search agents merely because they are AI-related.

## 6. Response-header ownership

Cloudflare Response Header Transform Rule `Security Headers - Baseline` is active for all incoming requests with these values:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

NGINX intentionally emits the same baseline values as origin-side defense in depth. Cloudflare `Set static` remains authoritative at the public edge.

NGINX additionally owns:

- `Content-Security-Policy`
- `Strict-Transport-Security`

The CSP must allow Cloudflare Turnstile:

```text
script-src https://challenges.cloudflare.com
frame-src https://challenges.cloudflare.com
```

Do not enable Rocket Loader, Cloudflare Fonts, JavaScript Detection or another script-injection feature without re-running CSP, accessibility, privacy and performance checks.

## 7. URL normalization

Configured Cloudflare URL normalization:

- normalization type: **Cloudflare**
- Normalize incoming URLs: **enabled**
- Normalize URLs to origin: **disabled**

Application routing must therefore remain correct when Cloudflare normalizes the request used by edge products. The origin must not depend on receiving a second transformed path.

## 8. Cache and performance baseline

Configured baseline:

- Caching Level: `Standard`
- Browser Cache TTL: `4 hours`
- no custom Cache Rules yet
- Speed Brain: disabled
- Cloudflare Fonts: disabled
- Early Hints: disabled
- Rocket Loader: disabled
- Always Online: disabled
- Crawler Hints: disabled

NGINX remains the source of application cache semantics:

- `/_astro/*`: one year, immutable
- human-named static assets: one day + revalidation
- HTML: no browser freshness cache
- contact API: `no-store`

Do not create `Cache Everything` rules for the site or `/api/contact` without a measured need and an explicit bypass for dynamic/API responses.

## 9. Turnstile contract

Configured widget:

- name: `arkadiuszkamrowski-contact`
- mode: **Managed**
- pre-clearance: disabled

Before public launch:

1. restrict the widget hostname list to `arkadiuszkamrowski.com` (and only explicitly approved staging hosts, if any);
2. put the public sitekey in the frontend build as `PUBLIC_TURNSTILE_SITE_KEY`;
3. put the secret key only in the platform secret store as `TURNSTILE_SECRET_KEY`;
4. set `TURNSTILE_REQUIRED=1` and `TURNSTILE_EXPECTED_HOSTNAME=arkadiuszkamrowski.com`;
5. server-side Siteverify validation is mandatory before sending email;
6. never log the Turnstile token or secret.

Local/CI dry-run does not require a real Turnstile secret. Production predeploy does.

## 10. Notifications baseline

Active notification policies:

- `Abuse | Cloudflare Abuse Report Alert | arkadiuszkamrowski.com`
- `Cloudflare Status | Incident Alert` — Major + Critical impact
- `DDoS Protection | HTTP DDoS Attack Alert | arkadiuszkamrowski.com`
- `SSL/TLS | Universal SSL Alert | arkadiuszkamrowski.com`
- `Security insights | New Insight detected | arkadiuszkamrowski.com` — selected high-signal insight classes

Add `Traffic Monitoring | Passive Origin Monitoring` and Health Check notifications only after the production origin/health check actually exists.

## 11. Launch verification

The Cloudflare portion of launch is PASS only when all are true:

- [ ] apex DNS record points to the real origin and is Proxied
- [ ] `www` is Proxied and returns one-hop 308 to apex with path/query preserved
- [ ] `http://` redirects to `https://`
- [ ] SSL/TLS is Full (strict)
- [ ] Universal SSL is valid for every public hostname
- [ ] managed rules and Browser Integrity Check remain active
- [ ] baseline response headers are present exactly once/effectively resolve to the intended values
- [ ] CSP permits Turnstile but no unnecessary third-party origins
- [ ] Turnstile validates server-side and rejects missing/invalid tokens
- [ ] `/api/contact` is never cached
- [ ] public origin cannot be trivially bypassed around Cloudflare
- [ ] Cloudflare alerts remain enabled
- [ ] DNS/email records have been reviewed for SPF/DKIM/DMARC correctness

Any dashboard change that affects these contracts must be reflected in this document and in automated tests where technically enforceable.
