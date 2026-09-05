# Azure infrastructure status

The Bicep files in this directory currently describe the older **AKS + ACR reference architecture**. They are retained for portability/history and are **not the approved production deployment path** for this site.

Current production direction:

```text
Internet → Cloudflare → managed origin
                       └→ Azure Container Apps preferred when Azure is selected
```

Do not deploy `main.bicep` / `platform.bicep` for the website merely because they exist.

Before creating production Azure IaC, confirm:

1. Azure subscription/tenant and resource naming.
2. Azure Container Apps region and environment design.
3. Azure Container Registry and managed-identity pull path.
4. Two-container layout: NGINX :8080 + private loopback contact API :8787.
5. Origin TLS compatible with Cloudflare **Full (strict)**.
6. Direct-origin restriction / Cloudflare-only ingress strategy.
7. Secret injection for `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` and contact mailbox configuration.
8. Immutable revisions, health probes, logs and rollback.
9. Exact ACA custom-domain verification values before any Cloudflare DNS records are created.

See:

- `docs/CLOUDFLARE.md`
- `docs/HOSTING_DECISION.md`
- `docs/PRODUCTION_LAUNCH_RUNBOOK.md`

Once the final Azure design is approved, replace or move the AKS reference IaC and add ACA-specific IaC in a separate reviewed change.
