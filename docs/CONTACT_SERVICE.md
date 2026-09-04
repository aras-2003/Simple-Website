# Contact service

The public website remains **Astro SSG + NGINX**. A small dependency-free Node.js sidecar exposes only `POST /api/contact` and `/healthz`. NGINX proxies the public same-origin `/api/contact` route to the sidecar.

## Delivery

Production delivery uses the Resend HTTPS Email API. The API key and destination address are server-side environment variables and never reach browser code.

Required production secrets:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` — use a sender on a domain verified with the transactional email provider

Runtime controls:

- `CONTACT_ALLOWED_ORIGINS` — comma-separated explicit origins
- `CONTACT_REQUIRE_ORIGIN=1` — recommended for production
- `CONTACT_RATE_LIMIT` — default 5 requests per 10 minutes per process
- `CONTACT_DRY_RUN=1` — local/CI mode that validates the full request without sending mail

The delivery request includes a deterministic 24-hour idempotency key so an identical browser submission cannot accidentally produce duplicate transactional emails if a request is retried.

## Abuse and privacy controls

- 32 KB request body limit
- field length and topic allow-list validation
- explicit contact-purpose consent
- honeypot field
- minimum form-completion time
- per-IP in-memory rate limiting
- origin allow-list validation; origin required in production
- no message body or email address written to application logs
- no contact database and no newsletter/CRM enrollment

For a public high-traffic deployment, add edge/WAF rate limiting because the in-memory limiter is intentionally lightweight and scoped to each replica.

## Local development

`make dev` starts the contact API in dry-run mode and Astro. Astro's dev proxy keeps `/api/contact` same-origin.

`make mac-demo` builds the static site, starts a loopback-only Python web server and a loopback contact API. The build points the form to the local contact port because the Python static server does not proxy.

To test real email delivery locally:

```bash
export CONTACT_DRY_RUN=0
export RESEND_API_KEY='...'
export CONTACT_TO_EMAIL='...'
export CONTACT_FROM_EMAIL='Website <contact@your-verified-domain.example>'
make dev
```

Never commit these values. Production Kubernetes expects them in the `personal-site-contact` Secret, which must be provisioned separately from the repository.
