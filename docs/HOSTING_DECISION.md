# Production hosting decision

## Recommendation

The public production architecture is **Cloudflare edge → managed container origin**. If Azure is selected, the preferred origin runtime is **Azure Container Apps (ACA)** rather than a dedicated AKS cluster.

Cloudflare owns the public DNS/TLS/security edge; the hosting platform owns the private application runtime, immutable revisions, secrets, health and rollback. This is a production recommendation, not an enabled deployment. Azure subscription/account, real origin resources and production secrets remain external inputs.

## Why this fits the site

The runtime contract is small:

- Astro produces static HTML/assets.
- NGINX is the only application web container and listens on `8080`.
- The Node contact API listens on `8787` and is reached only by NGINX over loopback.
- There is no database, queue, worker fleet or service mesh.
- Cloudflare already provides the intended public edge controls: DNS, TLS, DDoS/WAF posture, canonical redirect, selected header transforms, crawler controls and Turnstile.
- Deployments should be immutable and easy to roll back.

Azure Container Apps supports multiple tightly coupled containers in one container app; that maps closely to the Docker Compose and Kubernetes-pod model already tested in this repository without introducing a cluster lifecycle solely for one site.

## Target topology

```text
Internet
   │
   │ HTTPS
   ▼
Cloudflare
   ├── authoritative DNS
   ├── Universal SSL / TLS edge
   ├── DDoS / WAF / security rules
   ├── www → apex redirect
   ├── response-header transforms
   └── Turnstile
   │
   │ proxied origin traffic only
   ▼
Managed origin (Azure Container Apps preferred)
   ├── web / NGINX :8080  ← only application ingress target
   │      │
   │      └── http://127.0.0.1:8787/api/contact
   │
   └── contact-api :8787  ← no independent public ingress

Secrets → contact-api only
Images  → immutable registry tags/digests
Logs    → operational metadata; no visitor message/email/token bodies
```

`arkadiuszkamrowski.com` is the canonical public origin. The generated Azure hostname/IP is infrastructure, not an alternative public site URL.

## Cloudflare/origin trust boundary

The production origin must not be trivially usable to bypass Cloudflare. Before DNS cutover, implement and document the strongest practical control supported by the chosen platform, for example ingress/network restrictions that only admit Cloudflare-sourced traffic plus explicitly required health/deployment paths.

This matters because NGINX derives the browser identity for the contact limiter from Cloudflare's `CF-Connecting-IP` header. That header is trusted only across the Cloudflare → origin boundary.

If a temporary platform validation step requires direct access or DNS-only resolution, treat it as a short provisioning state. Re-enable the production proxy/restrictions before GO.

## Production configuration

Web build:

- `SITE_BASE_URL=https://arkadiuszkamrowski.com`
- `SITE_PRODUCTION_HOST=arkadiuszkamrowski.com`
- `REQUIRE_PRODUCTION_SITE=1`

Contact runtime:

- `CONTACT_DRY_RUN=0`
- `CONTACT_API_PORT=8787`
- `CONTACT_RATE_LIMIT=5`
- `CONTACT_RATE_BUCKETS=5000`
- `CONTACT_REQUIRE_ORIGIN=1`
- `CONTACT_ALLOWED_ORIGINS=https://arkadiuszkamrowski.com`
- `TURNSTILE_REQUIRED=1`
- `TURNSTILE_EXPECTED_HOSTNAME=arkadiuszkamrowski.com`
- `TURNSTILE_SECRET_KEY` from secret store
- `RESEND_API_KEY` from secret store
- `CONTACT_TO_EMAIL` from secret/config store
- `CONTACT_FROM_EMAIL` on the verified public domain or subdomain

Frontend build:

- `PUBLIC_TURNSTILE_SITE_KEY` — public value injected at build time

Run `make predeploy` with final production values before promotion.

## Registry and identity

Preferred operational pattern:

1. Build web and contact images from the same Git commit.
2. Scan both images using the existing Trivy gate.
3. Push immutable image tags/digests to a private registry (Azure Container Registry when Azure is selected).
4. Let the runtime pull using managed/workload identity where practical rather than long-lived registry passwords.
5. Record both image digests plus Git commit in deployment/release metadata.
6. Keep the previous known-good revision available for rollback.

Never put Resend or Turnstile secrets in image layers, Docker build arguments, repository files or public frontend environment variables.

## DNS, custom domain and TLS

Cloudflare is authoritative DNS. The zone intentionally contains no public web records until the real origin exists.

When Azure Container Apps is selected, use the exact verification and custom-domain records produced by the final ACA deployment. The normal sequence is:

1. create origin/runtime and obtain final verification/origin values;
2. add required ownership TXT records as **DNS only**;
3. complete ACA hostname/certificate validation as required by Azure;
4. create the final apex web record and switch it to **Proxied** after validation;
5. create a proxied `www` alias so Cloudflare can terminate HTTPS and apply the existing 308 edge redirect;
6. set Cloudflare SSL/TLS mode to **Full (strict)** after the origin has a valid certificate;
7. verify one-hop HTTP→HTTPS and `www`→apex behavior from the public Internet.

Email/service verification records (MX, SPF, DKIM, DMARC and provider-specific TXT records) remain DNS-only unless the relevant provider explicitly requires a different configuration.

Do not publish an invented origin IP/hostname just to remove Cloudflare dashboard warnings.

## Canonical policy

- apex `arkadiuszkamrowski.com` serves the site;
- `www.arkadiuszkamrowski.com` is redirect-only and permanently redirects to the apex preserving path/query;
- all HTTP traffic redirects to HTTPS;
- no staging/provider hostname is indexed or treated as canonical;
- no second copy of the site is served under `www`.

Cloudflare owns the production `www` redirect. NGINX keeps the same 308 only as origin-side defense in depth and for runtime parity tests.

## Scale and cost posture

Start small; this site does not justify a dedicated Kubernetes cluster.

- use the smallest sensible managed runtime profile;
- prefer one warm replica if predictable first-request latency matters and incremental cost is acceptable;
- scale out only from measured traffic/latency/error data;
- do not introduce Redis, a database, service mesh or broker without a real requirement;
- if contact abuse increases, use Cloudflare edge controls before adding application complexity.

## Observability

Minimum signals:

- public HTTPS availability through Cloudflare;
- Cloudflare DDoS/TLS/security notifications already configured;
- origin revision/container restart failures;
- contact `turnstile_unavailable`, `delivery_unavailable` and 5xx events;
- origin certificate validity/renewal;
- deployment revision, Git SHA and image digests;
- basic request/error rate without contact payloads or Turnstile tokens.

Product analytics remains disabled at initial launch and can be evaluated later as a separate privacy/compliance decision.

## Rollback

Each promotion must preserve:

- previous known-good revision;
- web image digest;
- contact image digest;
- Git commit SHA;
- previous runtime configuration version;
- Cloudflare configuration backup/export or documented change set for launch-related edge changes.

Rollback switches to a previous immutable revision/configuration. Never recover by editing files inside a live container.

## Why not AKS now

AKS remains portability/reference architecture only. It introduces cluster lifecycle, node capacity, ingress/controller/certificate choices and a larger patching surface for a workload consisting of two tightly coupled stateless containers.

Use AKS only if an existing platform already makes it operationally cheaper/easier, or if the site is intentionally being used as a Kubernetes demonstration workload.

The existing `infra/azure` AKS Bicep files are therefore **reference/legacy IaC and must not be treated as the approved production deployment path**. ACA production IaC should be created only after the Azure subscription/environment naming and network/origin-lock strategy are confirmed.

## Alternative provider

Another managed platform is acceptable if it supports the same contract:

- Cloudflare remains the public edge;
- private/restricted origin ingress to NGINX;
- loopback/private communication to the contact sidecar;
- managed secrets;
- immutable revisions/images;
- valid origin TLS compatible with Cloudflare Full (strict);
- rollback;
- health/logging without contact payloads;
- a way to prevent trivial direct-origin bypass.

Changing the origin provider must not change canonical URLs, Cloudflare edge policy, contact/Turnstile validation, privacy or security contracts.
