# Branch governance — current enforced state

Verified 2026-09-22 through the repository API.

The repository now has active branch rulesets for:
- `main`,
- `staging`,
- `production`.

The earlier enforcement gap documented on 2026-09-13 has been closed.

## Current controls

All three protected branches:
- require pull requests before merging;
- block branch deletion;
- block non-fast-forward updates;
- require the GitHub Actions checks `quality` and `validate promotion path`;
- have no configured bypass actors.

`main` additionally requires strict/up-to-date status checks before merge.

`staging` and `production` intentionally do not require strict up-to-date checks because the approved release model is one-way promotion:
`main → staging → production`.

The rulesets are the current enforcement mechanism. Do not replace them with classic branch-protection rules unless there is a deliberate governance decision to do so.

## Release flow

```text
feature/*
   ↓ PR + CI
main
   ↓ PR / promote
staging
   ↓ Cloudflare staging + acceptance
production
   ↓ guarded manual Cloudflare production workflow
```

Do not merge feature branches directly into `staging` or `production`.

Do not require the Cloudflare staging deployment check before the staging merge: deployment occurs after the branch update. Publication is complete only after the exact staging commit's Workers Build succeeds and staging acceptance is complete.

Production deployment remains guarded and manual.

## Verification

When governance is reviewed, verify:
- all three rulesets remain active;
- branch include patterns still target the exact intended branches;
- deletion and non-fast-forward protections remain enabled;
- PR requirement remains enabled;
- required checks remain `quality` and `validate promotion path`;
- bypass actors remain empty unless explicitly approved;
- `main` remains strict and release branches remain compatible with one-way promotion.

Record material governance changes in release evidence.

GitHub rulesets are the source of enforcement truth; this document describes the intended policy and the last verified state.
