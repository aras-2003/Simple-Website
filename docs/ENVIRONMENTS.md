# Environments and branch promotion

This repository uses an explicit promotion model. `main` is an integration branch and **does not deploy to any environment**.

## Branch → environment contract

| Branch | Purpose | Cloudflare deployment |
|---|---|---|
| `feature/*`, `chore/*`, other short-lived branches | development / PR review | none by default |
| `main` | integrated, releasable code | **none** |
| `staging` | release candidate / acceptance | automatic Workers Build: `arkadiuszkamrowski-staging` → `https://staging.arkadiuszkamrowski.com` |
| `production` | approved production release authority | **manual production deployment for v1**; no automatic deploy until explicitly enabled after launch gates |

Promotion path:

```text
feature/*
   ↓ PR + CI
main
   ↓ PR + CI + release decision
staging
   ↓ automatic staging deploy + acceptance
production
   ↓ explicit manual production deployment + public smoke
```

Do not configure `main` as a deployment branch anywhere.

## Staging Workers Build

The staging Cloudflare Workers Build is the only automatic deployment currently enabled.

- Worker/application name: `arkadiuszkamrowski-staging`
- Git repository: `aras-2003/Simple-Website`
- Production branch in Cloudflare terminology: `staging`
- Builds for non-production branches: **OFF**
- Build command: `npm run build`
- Deploy command: `npx wrangler@4.129.0 deploy --config wrangler.staging.jsonc`
- Path: `/`
- Cloudflare Access: **ON**
- Custom Domain: `staging.arkadiuszkamrowski.com`

Build variables:

```text
SITE_BASE_URL=https://staging.arkadiuszkamrowski.com
SITE_PRODUCTION_HOST=staging.arkadiuszkamrowski.com
REQUIRE_PRODUCTION_SITE=1
NODE_VERSION=22.23.2
PUBLIC_TURNSTILE_SITE_KEY=<staging widget site key>
```

Runtime secrets, configured on the **staging Worker only**:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
```

Current state:

- dedicated staging Turnstile widget: configured;
- `PUBLIC_TURNSTILE_SITE_KEY`: configured as build variable;
- `TURNSTILE_SECRET_KEY`: configured as runtime secret;
- Cloudflare Access: configured and verified on desktop/mobile;
- `RESEND_API_KEY`: pending Resend account;
- `CONTACT_TO_EMAIL`: pending contact-delivery setup.

The staging Worker has `DEPLOYMENT_ENV=staging`, enforces `X-Robots-Tag: noindex, nofollow, noarchive`, and serves a `robots.txt` that disallows all crawlers. This is defense in depth; Cloudflare Access is the primary staging visibility control.

Use the dedicated Turnstile widget restricted to `staging.arkadiuszkamrowski.com`. Do not reuse the production widget secret on staging.

## Production release

Production remains intentionally manual until the first public launch has passed the full GO / NO-GO checklist.

Target Worker/application:

- name: `arkadiuszkamrowski`
- release authority branch: `production`
- Custom Domain: `arkadiuszkamrowski.com`
- Cloudflare Access: **OFF**
- config: `wrangler.production.jsonc`
- `workers.dev`: disabled
- Preview URLs: disabled

The guarded workflow `.github/workflows/deploy-cloudflare.yml` is `workflow_dispatch` only and hard-fails unless it is run from the `production` branch. It also checks production build configuration and required Worker secret names before deployment.

Do **not** connect production to an automatic branch deployment yet. That can be reconsidered after the first stable launch, rollback has been exercised, and the owner explicitly accepts automatic production deployment.

Production build value:

```text
PUBLIC_TURNSTILE_SITE_KEY
```

Production Worker secrets:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
```

The production Turnstile widget remains restricted to `arkadiuszkamrowski.com`.

## Preview config

`wrangler.preview.jsonc` is intentionally named `arkadiuszkamrowski-preview` and is not a release environment. It exists for explicit/manual Worker previews and CI dry-run validation. The repository intentionally has no default `wrangler.jsonc`, preventing Cloudflare tooling from silently reconciling staging/production dashboard settings into the unrelated preview contract.

It must never be used by `main` as an automatic staging deployment.

## Local and portability environments

Local macOS, Docker Desktop and local Kubernetes remain development/portability targets. They do not participate in public promotion.

```bash
make mac-demo
make mac-docker
make k8s-local
```

Container/Kubernetes material remains reference-only for portability; Cloudflare Workers is the approved public runtime.

## Promotion gates

### `main` → `staging`

Required before merge/promotion:

- all repository CI jobs PASS;
- Release Policy PASS;
- no known P0/P1 experience/security/accessibility regression;
- staging config changes reviewed;
- staging secrets and Turnstile widget remain environment-isolated.

After staging deploy:

- routes / PL+EN / 404 / redirects PASS;
- security headers and `noindex` PASS;
- Cloudflare Access PASS;
- Turnstile + contact delivery PASS when live contact testing is enabled;
- browser/accessibility acceptance PASS for the release candidate.

### `staging` → `production`

Promotion is a PR from `staging` into `production`; do not cherry-pick arbitrary feature commits directly into production.

Required before merge:

- staging acceptance PASS;
- production CI PASS on the exact commit lineage;
- production secrets/config reviewed without exposing values;
- production launch checklist / rollback path ready;
- explicit owner GO.

The merge makes the commit eligible for production release; it does **not** itself deploy production in the current v1 model. The owner then explicitly runs the guarded production deployment workflow.

## GitHub Free / private-repository guardrails

This is a single-owner private repository on the GitHub Free plan. Hard branch protection/rulesets for this private repository are not available on the current plan, so we deliberately avoid pretending otherwise.

Current controls:

- `.github/workflows/release-policy.yml` validates allowed PR promotion paths;
- CI runs on pull requests and pushes to `main`, `staging`, and `production`;
- Cloudflare staging deploys only from `staging`;
- production deployment is manual and refuses non-`production` refs;
- operating convention: **no direct pushes to `main`, `staging`, or `production`; use PRs**;
- operating convention: no force pushes or deletion of release branches.

Allowed PR paths:

```text
short-lived branch → main
main → staging
staging → production
```

Disallowed by Release Policy:

```text
feature/fix → staging
feature/fix/main → production
staging/production → main
```

This is a proportional control for a one-person repository. If the repository becomes multi-maintainer or moves to a plan supporting private-repo rulesets, add hard branch protection then.
