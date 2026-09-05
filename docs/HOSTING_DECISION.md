# Production hosting decision

## Decision

The production target for `arkadiuszkamrowski.com` is **Cloudflare Workers + Static Assets**.

Azure Container Apps is no longer the preferred v1 target. Azure Static Web Apps + Functions remains the preferred Azure alternative if a future governance or platform requirement makes Azure mandatory.

## Why this fits the workload

The application is intentionally small:

- Astro pre-renders the public site to static HTML/assets.
- The only dynamic route is `POST /api/contact`.
- Contact processing is stateless: validation → Turnstile Siteverify → Resend HTTPS API.
- There is no database, queue, worker fleet, file store or private service mesh.
- Cloudflare is already the authoritative DNS/security edge.

Putting this workload in a general-purpose container runtime would add registry, image lifecycle, ingress, health probes, container patching and origin security without adding business value.

## Target topology

```text
GitHub
  │
  │ build / release
  ▼
Cloudflare Workers
  ├── Static Assets / Astro
  │
  └── /api/contact
        ├── Turnstile Siteverify
        └── Resend API
               ▼
             mailbox
```

Cloudflare also owns DNS, managed certificates, WAF/DDoS/bot controls, redirects, static delivery and Workers observability.

## Runtime contract

Static application:

- `SITE_BASE_URL=https://arkadiuszkamrowski.com`
- `SITE_PRODUCTION_HOST=arkadiuszkamrowski.com`
- `REQUIRE_PRODUCTION_SITE=1`
- `PUBLIC_TURNSTILE_SITE_KEY` supplied at build time

Worker runtime:

- `CONTACT_REQUIRE_ORIGIN=1`
- `CONTACT_ALLOWED_ORIGINS=https://arkadiuszkamrowski.com`
- `TURNSTILE_REQUIRED=1`
- `TURNSTILE_EXPECTED_HOSTNAME=arkadiuszkamrowski.com`
- `CONTACT_FROM_EMAIL=Website <contact@arkadiuszkamrowski.com>`
- `TURNSTILE_SECRET_KEY` as Worker secret
- `RESEND_API_KEY` as Worker secret
- `CONTACT_TO_EMAIL` as Worker secret/private value

The contact Worker also uses the `CONTACT_RATE_LIMITER` Workers Rate Limiting binding defined in Wrangler.

## Routing

`wrangler.jsonc` is the preview contract and keeps the `workers.dev` endpoint available for pre-production verification.

`wrangler.production.jsonc` disables `workers.dev` and attaches `arkadiuszkamrowski.com` as a Workers Custom Domain. The Custom Domain makes the Worker the application origin and lets Cloudflare create the apex DNS record and certificate.

`www` remains redirect-only and is not a second application hostname. The existing Cloudflare 308 redirect rule stays authoritative.

## Security consequences

Moving from containers to Workers removes several controls because the underlying risks disappear:

- no public origin IP/hostname to bypass;
- no container ingress to harden;
- no registry credentials;
- no NGINX patch lifecycle;
- no sidecar network exposure;
- no VM/node/cluster lifecycle;
- no origin certificate renewal path.

Controls that remain mandatory:

- Turnstile server-side verification;
- same-origin contact policy;
- strict CSP/security headers;
- input/body limits;
- Worker rate limiting / Cloudflare WAF protections;
- secret isolation;
- no sensitive payloads in logs;
- immutable Git-based release history and rollback.

## Cost posture

For this traffic profile, Static Assets are expected to dominate requests and avoid Worker invocation. Worker execution is limited to the contact API and explicit canonicalization paths.

Start on the smallest appropriate Workers plan and move to paid capacity only when operational requirements or measured usage justify it. Cost is secondary to the architectural benefit: fewer moving parts and less operational surface.

## Deployment and rollback

Every production release must retain:

- Git commit SHA;
- Cloudflare Worker version/deployment identifier;
- build artifact provenance;
- previous known-good Worker version;
- current runtime secret/configuration ownership.

Rollback means promoting the previous known-good Worker deployment/version, not editing production assets manually.

## Alternatives

### Azure Static Web Apps + Functions

Preferred alternative when Azure governance, Entra/RBAC, Azure Policy, private networking or enterprise landing-zone alignment becomes a hard requirement.

### Vercel / Netlify

Strong developer-experience alternatives, but they duplicate edge/CDN concerns already owned by Cloudflare and create a second operational platform for little benefit in this workload.

### Azure Container Apps

Still valid if the application evolves into a true container workload: long-running processes, container-specific dependencies, private services, background workers or other runtime requirements that Workers cannot reasonably satisfy.

### GitHub Pages

Suitable for the static half only. It would still require a separate backend for `/api/contact`, so it does not beat the single-platform Workers design.

## Portability reference

Existing Docker, NGINX, Kubernetes and AKS files are retained only as portability/reference material. They are not the production deployment contract and must not be enabled automatically by CI/CD.
