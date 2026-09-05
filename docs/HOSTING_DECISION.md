# Production hosting decision

## Recommendation

For this workload, the preferred production target is a **managed container runtime with one public HTTPS origin and two tightly coupled containers**. If the site is kept in Azure, the recommended first choice is **Azure Container Apps (ACA)** rather than a dedicated AKS cluster.

This is a production recommendation, not an enabled deployment. Account/subscription, DNS ownership and production secrets remain external inputs.

## Why this fits the site

The runtime contract is unusually small:

- Astro produces static HTML/assets.
- NGINX is the only public application container and listens on `8080`.
- The Node contact API listens on `8787` and is reached only by NGINX over loopback.
- There is no database, queue, worker fleet or microservice mesh.
- Deployments should be immutable and easy to roll back.

Azure Container Apps supports multiple tightly coupled containers in one container app; those containers share network resources and the application lifecycle. This maps closely to the Docker Compose and Kubernetes-pod model already tested in the repository.

Microsoft references:

- Containers / multiple-container behavior: https://learn.microsoft.com/azure/container-apps/containers
- Container Apps resource reference: https://learn.microsoft.com/azure/templates/microsoft.app/containerapps
- Managed environments resource reference: https://learn.microsoft.com/azure/templates/microsoft.app/managedenvironments
- Custom domains and free managed certificates: https://learn.microsoft.com/azure/container-apps/custom-domains-managed-certificates

## Target topology

```text
Internet
   │
   │ HTTPS / managed ingress
   ▼
arkadiuszkamrowski.com
   │
   ▼
Azure Container App (single revision)
   ├── web / NGINX :8080  ← only public target port
   │      │
   │      └── http://127.0.0.1:8787/api/contact
   │
   └── contact-api :8787  ← no independent public ingress

Secrets → contact-api only
Images  → immutable registry tags/digests
Logs    → operational metadata; no visitor message/email bodies
```

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
- `RESEND_API_KEY` from secret store
- `CONTACT_TO_EMAIL` from secret/config store
- `CONTACT_FROM_EMAIL` on the verified public domain or subdomain

Run `make predeploy` with the final values before promotion.

## Registry and identity

Preferred operational pattern:

1. Build the web and contact images from the same Git commit.
2. Scan both images before promotion using the existing Trivy gate.
3. Push immutable image tags/digests to a private registry (Azure Container Registry when using Azure).
4. Let the runtime pull using workload/managed identity where practical rather than long-lived registry passwords.
5. Record both image digests in the deployment/release metadata so rollback is deterministic.

Do not place email-provider secrets in image layers, Docker build arguments, repository files or public frontend environment variables.

## TLS and custom domain

For an ACA apex domain, Microsoft currently documents an **A record** to the Container Apps environment IP plus an `asuid` TXT verification record. Subdomains use a CNAME to the generated app domain plus the corresponding `asuid.<subdomain>` verification record. The provider-managed certificate can then be bound to the custom hostname.

If the DNS zone contains CAA records, confirm that the certificate issuer required by the platform is allowed before binding; otherwise issuance/renewal can fail.

The preferred canonical policy for this site remains:

- apex `arkadiuszkamrowski.com` serves the site,
- `www.arkadiuszkamrowski.com` redirects permanently to the apex preserving path/query,
- all HTTP redirects to HTTPS.

The `www` redirect can be implemented at the DNS/edge/front-door layer if the selected Container Apps configuration does not provide the exact redirect behavior desired. Do not serve two separately canonicalized copies of the site.

## Scale and cost posture

Start small. This site does not justify a dedicated Kubernetes cluster.

- Use the smallest sensible managed environment/runtime profile.
- Prefer one warm replica if the incremental cost is acceptable and predictable first-request latency matters.
- Scale out only from measured traffic/latency/error data.
- Do not introduce Redis, a database, service mesh or message broker without a real product requirement.
- If traffic grows enough for the per-process contact limiter to become insufficient, add edge/WAF rate limiting before adding application complexity.

## Observability

Minimum signals:

- public HTTPS availability,
- revision/container restart failures,
- contact `delivery_unavailable`/5xx events,
- TLS certificate expiry/renewal,
- deployment revision and image digest,
- basic request/error rate without storing contact payloads.

No analytics platform is required for the initial launch. Product analytics can be evaluated later as a separate privacy/compliance decision.

## Rollback

Every production promotion must preserve:

- previous known-good revision,
- web image digest,
- contact image digest,
- Git commit SHA,
- the previous runtime configuration version.

Rollback should switch to the previous revision/images, not mutate files inside a live container.

## Why not AKS now

AKS remains useful as a portability/reference architecture in this repository, but it introduces cluster lifecycle, node capacity, ingress/controller/certificate choices and a larger patching/operational surface for a site whose production runtime is two tightly coupled containers and no stateful services.

Use AKS only if a broader platform already exists and makes this deployment cheaper/easier to operate, or if the site intentionally serves as a Kubernetes demonstration workload.

## Alternative provider

The same production contract can be implemented on another managed platform if it provides:

- public HTTPS ingress to the NGINX container,
- private/loopback communication to the contact container or an equivalent private service,
- managed secrets,
- immutable revisions/images,
- automatic TLS,
- rollback,
- basic logs/health/monitoring.

Changing provider must not change the application-level canonical, security, privacy or contact contracts.
