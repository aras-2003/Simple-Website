# Final product hardening — 2026-09-13

## Executive Summary
Scope is main and staging, per the owner's latest instruction. Preserve the executive decision-led product and current visual system. Fix verified brand/social-image inconsistencies, mobile Contact reading order and contact resilience. Production is not an accepted or deployed outcome of this scoped release.

## Starting remote state
| Branch | Verified SHA |
|---|---|
| main | `93f806041428441cd3232f4892bce1f5cd666b64` |
| staging | `0f3155446e0d3ed4776b709268d677198dc2418b` |
| production | `a00ee1e81b182d5fd1dc6317dbe7127cfeacb9cd` |

Remote branch heads were rechecked on 2026-09-14 and remain at the SHAs above.

Implementation branch: `feature/final-product-hardening`, created from current remote main. Exact feature/main/staging SHAs and successful CI/Workers Build IDs are recorded in the associated implementation and promotion PR descriptions after the gates complete. Do not infer a deployment from this pre-merge record.

## Audit reconciliation and changes
| Finding | Current evidence | Outcome |
|---|---|---|
| Old competency-led footer | Existing text was still in HTML, hidden by CSS | FIXED NOW — current tagline; preserves existing visual density |
| Social branding | Old OG/Twitter alt and SVG; PNG could not decode in Pillow or the image viewer | FIXED NOW — decision-led SVG and valid 1200×630 PNG; browser decode regression gate |
| Metadata consistency | Advisory title was the hero sentence; Advisory/OAF descriptions reused long leads (187–219 characters) | FIXED NOW — page-name title and concise descriptions; article headlines retained |
| Contact guidance below form on mobile | `order:-1` put form ahead of preceding DOM guidance | FIXED NOW — natural DOM/visual order at all widths; PL/EN 320px geometry check |
| Browser fetch has no deadline | No AbortController in contact client | FIXED NOW — 25s deadline covering request and response; localized unconfirmed-delivery message, retained fields, focus, button and Turnstile reset, user-controlled retry |
| Contact body fully buffered before bound check | `request.text()` preceded actual byte validation | FIXED NOW — stream cancellation at first chunk above 32 KiB, including absent/false Content-Length; read errors fail closed |
| Raw provider exception text logged | Contact catch logged arbitrary `error.message` | FIXED NOW — allowlisted categories only; injected private-text error regression test |
| OAF in primary navigation | Header lists work/writing/about/contact only | VERIFIED ALREADY RESOLVED — no code change |
| Old portfolio matrix | No matrix implementation in current source/assets | RESOLVED BY REMOVAL / superseded design — do not reintroduce |
| Unused `oaf-operating-model.ts` | File absent; decision brief already integrated | VERIFIED ALREADY RESOLVED — no code change |
| Contact competency taxonomy | Five decision/situation-led topics already shared by UI and servers | VERIFIED ALREADY RESOLVED — no code change |
| Stronger executive proof | Existing approved sources add no new scale/mandate/outcomes with public evidence | DEFERRED — keep truthful cases, 10+ years and existing MBA award |
| Disabled AKS ambiguity | General reference status documented, exact workflow not explicit in architecture | FIXED NOW — exact disabled workflow documented as historical/reference-only |
| Long release history | Current and historical publication narratives intermixed | FIXED NOW — compact current index with linked archive preserving evidence |
| Branch protections | All three unprotected, no rulesets; API lacks administration writes | FIX — exact owner settings in BRANCH_GOVERNANCE.md |

Hero, TAK/NIE/KTO, navigation, proof story structure, advisory modes, Perspective essays, About, OAF, PL/EN routes, JSON-LD, CSP, privacy event schema and performance limits are preserved. No new application dependency, font, SDK or redesign.

## Validation
Local production-configured `test:static`: Astro, 22 routes, JSON-LD/canonical/hreflang/metadata, Worker contact/measurement, Node reference and predeploy gates pass. Stream tests cover absent/false length, exact 32 KiB with split UTF-8, cancellation, read failure and provider isolation. Provider stubs verify Reply-To, topic, Polish characters and line breaks; this is not live mail evidence.

New browser gates cover real browser AbortController cancellation under a held response in PL/EN, retained payload/idempotency inputs, manual retry, status focus, Turnstile reset with an explicit stub, coarse events without message data, 320px guidance order and actual PNG decoding. Full CI must pass on the feature candidate, main and promotion; exact staging CI and Workers Build must pass after merge. Review all 12 desktop/mobile CI captures, especially Contact. Exact outcomes belong in the PR ledger.

Local supervised preview/browser execution was unavailable; no manual live browser acceptance, 200% browser zoom, assistive-technology or real Turnstile interaction is claimed from automated CI. Existing reduced-motion, keyboard, menu, language and axe gates remain in CI.

## Performance
| Metric | Before | After | Unchanged ceiling |
|---|---:|---:|---:|
| Static artifact | 302.4 KiB | 315.1 KiB | 700 KiB |
| CSS raw / gzip | 20.6 / 5.2 KiB | 20.6 / 5.2 KiB | 96 / 20 KiB |
| Client JS | 6.4 KiB | 7.0 KiB | 8 KiB |
| Home HTML | 9.5 KiB | 9.4 KiB | 20 KiB |

The artifact increase is mainly the repaired social image (24.5 KiB). No source maps. Generate its PNG from the committed SVG with the locked toolchain: `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/assets/og-card.svg').png({palette:true,colours:32,dither:0}).toFile('public/assets/og-card.png');"`. Browser decode verifies the shipped file, independently of the renderer.

## Real acceptance and remaining issues
| Priority | Observation and evidence | Impact / action | Public-launch blocker |
|---|---|---|---|
| P0 | Real Browser → Turnstile → Resend → mailbox delivery unverified; last staging request met Cloudflare protection; no connected provider configuration access | Authenticate staging; verify environment/secret presence without exposing values, verified sender and one labelled launch-smoke email, Reply-To, Unicode, line breaks, success/retry | Yes |
| P0 | Production config/DNS and smoke not accepted; latest scope is main/staging | Keep production promotion/deploy guarded until real staging acceptance and configuration pass | Yes |
| P1 | Branch protection absent, rulesets empty | Apply and verify BRANCH_GOVERNANCE.md before public release; current tested PR path is operating discipline only | Yes, release integrity |
| P1 | Actual Observability ingestion unverified; schema/privacy tests pass | With Cloudflare access, inspect staging-labelled page_view/contact_intent/advisory_intent/form_start/form_error/form_success and ensure fixed fields only | Yes for the requested complete launch acceptance |
| P2 | No additional public-safe leadership scale, attributable recommendations or outcomes | Collect strongest 1–2 verified signals after launch; do not fabricate | No |
| P2 | Short log retention | Export aggregates per ANALYTICS.md; reconsider persistence after 2–4 weeks of meaningful traffic | No |

Resend and Cloudflare integrations were suggested to enable account verification; no connection is assumed. The GitHub integration cannot configure branch protection. These limitations do not prevent shipping the tested fixes to staging.

## Production result
Deployed: **NO**. Public smoke: **FIX / unverified**. Real contact delivery: **FIX / unverified**. Live analytics ingestion: **FIX / unverified**. Build declarations and mocks are not evidence of actual provider configuration or acceptance.

## Rollback
Use a short-lived revert branch and tested PR into main, then main → staging. Preserve merge history; no reset/force push of release branches. `PRODUCT_MEASUREMENT=0` independently disables collection if needed.
