# Environments and branch promotion

This repository uses an explicit promotion model. `main` is an integration branch and **does not deploy to any public environment**.

## Branch → environment contract

| Branch | Purpose | Cloudflare deployment |
|---|---|---|
| `feature/*`, `chore/*`, other short-lived branches | development / PR review | none by default |
| `main` | integrated, releasable code | **none** |
| `staging` | release candidate / acceptance | `arkadiuszkamrowski-staging` → `https://staging.arkadiuszkamrowski.com` |
| `production` | approved production release | `arkadiuszkamrowski` → `https://arkadiuszkamrowski.com` |

Promotion path:

```text
feature/*
   ↓ PR + CI
main
   ↓ PR + CI + release decision
staging
   ↓ staging deployment + acceptance
production
   ↓ production deployment + public smoke
```

Do not configure Cloudflare Workers Builds so that `main` is a production branch for either environment.

## Cloudflare Workers Builds projects

Use two separate Cloudflare Workers Builds applications connected to the same GitHub repository.

### Staging

- Worker/application name: `arkadiuszkamrowski-staging`
- Git repository: `aras-2003/Simple-Website`
- Production branch: `staging`
- Builds for non-production branches: **OFF**
- Build command: `npm run build`
- Deploy command: `npx wrangler@4.129.0 deploy --config wrangler.staging.jsonc`
- Path: `/`
- Recommended Cloudflare Access protection: **ON**
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

The staging Worker has `DEPLOYMENT_ENV=staging`, enforces `X-Robots-Tag: noindex, nofollow, noarchive`, and serves a `robots.txt` that disallows all crawlers. This is defense in depth; Cloudflare Access is the primary staging visibility control.

Use a dedicated Turnstile widget restricted to `staging.arkadiuszkamrowski.com`. Do not reuse the production widget secret on staging.

### Production

- Worker/application name: `arkadiuszkamrowski`
- Git repository: `aras-2003/Simple-Website`
- Production branch: `production`
- Builds for non-production branches: **OFF**
- Build command: `npm run build`
- Deploy command: `npx wrangler@4.129.0 deploy --config wrangler.production.jsonc`
- Path: `/`
- Cloudflare Access: **OFF** for the public site
- Custom Domain: `arkadiuszkamrowski.com`

Build variables:

```text
SITE_BASE_URL=https://arkadiuszkamrowski.com
SITE_PRODUCTION_HOST=arkadiuszkamrowski.com
REQUIRE_PRODUCTION_SITE=1
NODE_VERSION=22.23.2
PUBLIC_TURNSTILE_SITE_KEY=<production widget site key>
```

Runtime secrets, configured on the **production Worker only**:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
```

The production Turnstile widget remains restricted to `arkadiuszkamrowski.com`.

## Preview config

`wrangler.jsonc` is intentionally named `arkadiuszkamrowski-preview` and is not a release environment. It exists for explicit/manual Worker previews and CI dry-run validation. It must not be used by the `main` branch as an automatic staging deployment.

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
- no known P0/P1 experience/security/accessibility regression;
- staging config changes reviewed;
- staging secrets and Turnstile widget remain environment-isolated.

After staging deploy:

- routes / PL+EN / 404 / redirects PASS;
- security headers and `noindex` PASS;
- Cloudflare Access PASS;
- Turnstile + contact delivery PASS if live staging contact testing is enabled;
- browser/accessibility acceptance PASS for the release candidate.

### `staging` → `production`

Promotion should be a PR from `staging` into `production`; do not cherry-pick arbitrary feature commits directly into production.

Required before merge:

- staging acceptance PASS;
- production CI PASS on the exact commit lineage;
- production secrets/config reviewed without exposing values;
- production launch checklist / rollback path ready.

After production deployment run the public smoke and final manual launch checks documented in `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## GitHub branch protection target

Configure GitHub rulesets/branch protection for `main`, `staging`, and `production`:

- require pull requests;
- require CI status checks;
- block force pushes and deletion;
- require branches to be up to date before merge where practical;
- require at least one explicit approval for `production` if the account/repository plan supports it.

Production deployment must never be triggered merely by a push to `main`.
