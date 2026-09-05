# Contact service

The public website remains **Astro SSG + NGINX** behind Cloudflare. A small dependency-free Node.js sidecar exposes only `POST /api/contact` and `/healthz`; NGINX is the only web-facing application container and proxies the same-origin contact route to the sidecar over loopback.

## Production request path

```text
browser
  → Cloudflare (DNS/TLS/WAF/DDoS/Turnstile)
  → NGINX :8080
  → POST /api/contact
  → contact-api :8787
  → Cloudflare Turnstile Siteverify
  → Resend HTTPS Email API
```

The contact sidecar must not have independent public ingress. The origin must also be protected against trivial direct access that would bypass Cloudflare; see `docs/CLOUDFLARE.md` and `docs/HOSTING_DECISION.md`.

## Delivery

Production delivery uses the Resend HTTPS Email API. The API key and destination address are server-side environment variables and never reach browser code.

Required production values:

- `RESEND_API_KEY` — secret
- `CONTACT_TO_EMAIL` — private configuration
- `CONTACT_FROM_EMAIL` — verified sender on the public domain or subdomain

The delivery request includes a deterministic idempotency key so an identical browser submission cannot accidentally produce duplicate transactional emails if a request is retried.

## Cloudflare Turnstile

The Cloudflare dashboard widget is named `arkadiuszkamrowski-contact` and uses **Managed** mode. Production requires server-side Siteverify validation before an email can be sent.

Configuration:

- `PUBLIC_TURNSTILE_SITE_KEY` — public browser sitekey; safe to include in the frontend build
- `TURNSTILE_REQUIRED=1` — mandatory in production
- `TURNSTILE_EXPECTED_HOSTNAME=arkadiuszkamrowski.com`
- `TURNSTILE_SECRET_KEY` — secret; hosting-platform secret store only

The browser obtains a short-lived token from Turnstile and submits it with the contact payload. The sidecar sends that token to Cloudflare Siteverify and rejects missing, invalid, failed or wrong-hostname responses. The token and secret are never written to application logs.

Local/CI dry-run keeps `TURNSTILE_REQUIRED=0` unless a dedicated test widget or mocked Siteverify endpoint is being exercised.

## Abuse and privacy controls

- Cloudflare edge security / DDoS / managed rules
- Cloudflare Turnstile with mandatory server-side verification in production
- 32 KB request body limit
- field length and topic allow-list validation
- explicit contact-purpose acknowledgement
- honeypot field
- minimum form-completion time
- per-IP in-memory rate limiting
- bounded rate-limit bucket storage
- origin allow-list validation; Origin required in production
- no message body, visitor email address, Turnstile token or secret in application logs
- no contact database and no newsletter/CRM enrollment

NGINX supplies the application's `X-Real-IP` from Cloudflare's `CF-Connecting-IP` header. That trust boundary is safe only when direct-origin bypass is prevented at the hosting/network layer. The sidecar never trusts a browser-controlled `X-Forwarded-For` chain as its rate-limit identity.

The application limiter is deliberately lightweight and replica-local. Cloudflare edge rate limiting/WAF should be the first scaling step if measured abuse justifies additional controls.

## Runtime controls

- `CONTACT_ALLOWED_ORIGINS` — comma-separated explicit origins
- `CONTACT_REQUIRE_ORIGIN=1` — required in production
- `CONTACT_RATE_LIMIT` — default 5 requests per 10 minutes per process
- `CONTACT_RATE_BUCKETS` — default 5000 bounded identities
- `CONTACT_DRY_RUN=1` — local/CI mode; production requires `0`

## Production contract

Use `.env.production.example` as the public configuration contract. Real secret values belong only in the selected platform's secret/config store.

Before promotion:

```bash
set -a
source .env.production
set +a
make predeploy
```

The predeploy check verifies:

- canonical HTTPS origin and host,
- immutable web/contact image references,
- live contact mode,
- exact production Origin allow-list,
- Turnstile enabled with sitekey, secret and canonical expected hostname,
- valid sender/recipient configuration,
- sane rate-limit/runtime values.

It reports only configuration state and never prints email or Turnstile secrets.

## Email DNS

Use provider-generated DKIM records exactly. Inspect existing SPF before editing it; do not create two independent SPF TXT policies. Review DMARC and MX before changing either. Provider verification records remain DNS-only in Cloudflare unless the provider explicitly documents otherwise.

The complete operational sequence is in `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## Local development

`make dev` starts the contact API in dry-run mode and Astro. Astro's dev proxy keeps `/api/contact` same-origin.

`make mac-demo` builds the static site, starts a loopback-only preview and a loopback contact API. Real Cloudflare/Resend secrets are not required for this flow.

Never commit production secrets. Azure Container Apps, if selected, should use its native secret store/injection mechanism rather than Kubernetes Secrets or repository variables.
