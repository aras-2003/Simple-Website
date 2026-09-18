# Environments and branch promotion

`main` integrates code and **does not deploy**. Only `staging` automatically deploys; `production` is a release-authority branch with a **manually dispatched** first production launch. Detailed gates: [PRODUCTION_LAUNCH_RUNBOOK.md](PRODUCTION_LAUNCH_RUNBOOK.md), [DEPLOY_APPROVAL.md](DEPLOY_APPROVAL.md), dated [PRELAUNCH_ACCEPTANCE_2026-09-17.md](PRELAUNCH_ACCEPTANCE_2026-09-17.md).

| Branch | Purpose | Deployment |
|---|---|---|
| `feature/*`, `chore/*` | Development / PR review | None by default |
| `main` | Integrated code | **None** |
| `staging` | Private release candidate | Automatic Workers Build: `arkadiuszkamrowski-staging` |
| `production` | Approved release authority | **Explicit manual workflow only** |

Promotion: `feature/* → PR + CI → main → PR + CI → staging → automatic private deploy + acceptance → PR + CI → production → separate explicit public deploy GO → public smoke`. Do not use direct pushes, force pushes or branch deletion as shortcuts. A staging→production merge **does not itself publish** the site.

## Staging

Cloudflare Worker `arkadiuszkamrowski-staging` on `https://staging.arkadiuszkamrowski.com`, Cloudflare Access ON, noindex/robots Disallow. Workers Build source `staging`; non-production branches OFF; build `npm run build`; deploy `npx wrangler@4.129.0 deploy --config wrangler.staging.jsonc`; root `/`.

Build variables: `SITE_BASE_URL=https://staging.arkadiuszkamrowski.com`, `SITE_PRODUCTION_HOST=staging.arkadiuszkamrowski.com`, `REQUIRE_PRODUCTION_SITE=1`, `NODE_VERSION=22.23.2`, staging-specific `PUBLIC_TURNSTILE_SITE_KEY`. Runtime secret names: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. Never reuse the production Turnstile secret on staging.

**State observed/reported 2026-09-17:** owner performed a real staged contact submission, received the email and verified Reply-To; inspected `product_event` and `contact_sent` structured logs, each without visitor contact data in the application event. Staging private Access, build settings and dedicated Turnstile were previously configured/reported. These samples are not a substitute for checking all routes, browser and error-path behavior. Older notes that Resend is pending are superseded. Evidence and outstanding checks: dated acceptance document.

Staging config uses `DEPLOYMENT_ENV=staging`, strict Origin and expected Turnstile hostname, `PRODUCT_MEASUREMENT=1`, separate contact and measurement limiters, `observability.enabled=true` and `logs.invocation_logs=false` in `wrangler.staging.jsonc`. Cloudflare still attaches technical metadata to app events.

## Production

Target Worker `arkadiuszkamrowski`, `wrangler.production.jsonc`, domain `arkadiuszkamrowski.com`, Access OFF only when publicly launched, `workers.dev` OFF, preview URLs OFF. Production exists as a prelaunch Worker; **the website is not deployed or publicly attached**. The production config contains the apex Custom Domain: running deploy is a public launch.

`.github/workflows/deploy-cloudflare.yml` is `workflow_dispatch`-only and hard-fails outside `production`. It validates nonempty GitHub production `PUBLIC_TURNSTILE_SITE_KEY`, builds/tests and checks Worker secret **names**, not secret values or API-token scope. Production Worker secrets: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (owner-reported configured). Separate production Turnstile widget should be hostname-restricted to `arkadiuszkamrowski.com`. Cloudflare token must have least privilege and appropriate account/zone scope; verify without exposing values.

Owner screenshot on 2026-09-17: production Logs ON, Invocation Logs OFF, Persist to Workers dashboard ON, Traces OFF, log sampling 100%. `wrangler.production.jsonc` also configures Invocation Logs OFF. Owner-approved first-party, cookieless product-event measurement ON at launch; see [ANALYTICS.md](ANALYTICS.md). Effective deployed settings and production events must still be checked after a separately approved public launch. Do **not** enable automatic production deployments before an explicit post-launch decision.

## Preview and local portability

`wrangler.preview.jsonc` uses `arkadiuszkamrowski-preview` for explicit previews/CI dry-runs, never as the `main` deployment environment. No default `wrangler.jsonc` is intentionally committed, avoiding accidental wrong-environment reconciliation. Local macOS, Docker and Kubernetes (`make mac-demo`, `make mac-docker`, `make k8s-local`) are development/reference targets, not public production.

## Gates and governance

Before `main→staging`: CI + Release Policy green, staging configuration/isolation reviewed, no known P0/P1 UX/security/accessibility regression. After staging deploy: test routes, PL/EN, 404/308, headers/noindex, Access, contact/Turnstile, browser/mobile/accessibility and event logging.

Before `staging→production` **merge**: final candidate accepted, PR #59 CI green on final SHA, secrets/config/scoped token reviewed, privacy/legal and manual accessibility evidence, monitoring and first-launch recovery documented, **explicit owner merge GO**. Public deploy requires a **separate owner GO**; public-only checks run afterward.

Historical documentation called this a private GitHub Free repo with no available branch protection, but that is no longer a reliable description. The 2026-09-17 GitHub API reported `main.protected=true` while nested check enforcement showed OFF; inspect actual branch protection/rulesets for all three branches before release. `.github/workflows/release-policy.yml` enforces permitted PR paths at CI level, but does not itself prevent bypass by direct push. Use PRs: short-lived→main, main→staging, staging→production. Branch settings/required checks and administrator bypass need separate review.
