# Proof + conversion + learning release — 2026-09-11

## Executive Summary
Preserve the executive decision-led brand and improve credibility, contact coherence and product learning. Two shared qualitative proof stories replace separate page-specific fragments; engagement mechanics are expandable; Contact uses buyer situations; first-party event measurement and Person/ProfilePage/Article JSON-LD are added. Canonical product documentation is consolidated; legacy infrastructure is retained as reference.

## Pre-release baseline
| Item | Evidence |
|---|---|
| main | `083ffbe70325a04bada510dee6a088f5469b1d35` |
| staging | `0c98ad88d25c023ee68ae9c7ace3bb328c353cc0`; contains all main commits (9 merge-lineage commits ahead) |
| production branch | `a00ee1e81b182d5fd1dc6317dbe7127cfeacb9cd`; live deployed SHA not verified |
| main CI / promotion policy | [CI 34462609435](https://github.com/aras-2003/Simple-Website/actions/runs/34462609435) and [Release Policy 34462609402](https://github.com/aras-2003/Simple-Website/actions/runs/34462609402): success |
| staging build | Workers Builds check `857cfcf0-3abd-4d98-80ed-0987020d8e0e`: success |
| Open PRs inspected | #37/#36/#35/#9/#8/#7 dependency updates; #12 historical hardening. No open competing proof/conversion implementation |
| Local baseline | Astro check/build/static, Worker/contact/predeploy and unchanged performance budgets: PASS |
| Live staging | HTTP 302 to Cloudflare Access login; authenticated acceptance not established |
| Public origin | Runtime network returned proxy 502; not evidence that the public service itself is down |
| Visual baseline | Prior ASTRA captures available; current baseline build retained locally before source changes |

## Implementation and quality impact
- Proof: two owner-sourced examples, technology strategy and portfolio choices; explicit contribution/output/decision consequence. Existing MBA credential surfaced beside the portrait. No new numeric outcomes or client claims.
- Conversion: competency taxonomy replaced with diagnostic/design/execution/speaking/other across UI, Worker, Node reference adapter and tests. Email reply/next-step expectation visible on mobile. LinkedIn fallback preserved.
- Mobile: decision and enabled change visible for all three engagements; methods, team input and retained outputs behind native keyboard-operable disclosures. This is a reduction of initial reading load, not removal of content.
- Learning: seven fixed client event names, coarse dimensions, exact server schema, DNT/GPC, no form content or browser storage. Cloudflare log retention requires aggregate export during baseline collection; no unique-user or joined-source conversion claims.
- SEO: valid per-route JSON-LD, matching canonical and bilingual metadata. Small executable scripts forced external to preserve CSP.
- Documentation: PRODUCT/ARCHITECTURE/ANALYTICS/PROOF_SOURCES are current; old audits and design checkpoints labelled historical. Production remains Cloudflare; no Docker/Kubernetes deletion.

## Performance
| Asset | Before | After | Existing budget |
|---|---:|---:|---:|
| Total static artifact | 272.2 KiB | 302.4 KiB | 700 KiB |
| CSS raw / gzip | 18.6 / 4.5 KiB | 20.6 / 5.2 KiB | 96 / 20 KiB |
| Client JS | 4.9 KiB | 6.4 KiB | 8 KiB |
| Home HTML | 8.0 KiB | 9.5 KiB | 20 KiB |

No budget relaxed; no source maps shipped. These are compiled asset measurements, not field Core Web Vitals or measured conversion improvement.

## Validation checkpoint
Local Astro check: 0 errors/warnings/hints. 22 translated routes pass static/SEO/internal-link/JSON-LD gates. Worker and reference contact tests pass. Measurement tests verify malformed/unknown/PII payload rejection, opt-outs, streaming byte ceiling, origins, missing/exhausted binding and staging isolation. Browser tests cover intent → form failure → retained input → retry/success and keyboard disclosures.

Release browsers could not be downloaded locally (CDN timeout/502); GitHub CI resolved that validation gap. For implementation commit `fe586d3a8c2d05ad885fce28018a483c78555274`, [CI 34627326047](https://github.com/aras-2003/Simple-Website/actions/runs/34627326047) and [Release Policy 34627326006](https://github.com/aras-2003/Simple-Website/actions/runs/34627326006) passed. The accessibility suite passed 134 tests; the browser suite passed 105 tests with 15 intentional project/device skips. Preview, staging and production package checks, staging canonical build, performance and external-reference steps all passed.

The 12 Chromium desktop/mobile captures for Home, Advisory, Contact, About, OAF and Perspective were reviewed on 2026-09-13: no blocking overflow, clipping or visual regression found. CI interaction tests cover the supported browser matrix, contact failure/retry/success with a mocked provider, measurement opt-outs and keyboard disclosures. These results do not establish real email delivery or live user acceptance behind Cloudflare Access.

The owner authorized public source/documentation publication and promotion through main to staging. [PR #38](https://github.com/aras-2003/Simple-Website/pull/38) records the implementation and exact merge/check state. Subsequent documentation-only revisions and main → staging promotion must pass their own required CI; GitHub PR/check history is the authoritative release ledger. Staging publication additionally requires a successful Workers Builds check on the exact staging commit.

## Release gates
| Area | Status at verified candidate checkpoint (2026-09-13) |
|---|---|
| Positioning / proof / content / PL+EN | PASS — preserved positioning, source-backed qualitative proof |
| Contact taxonomy / validation / security | PASS — local integration tests; live delivery unverified |
| Analytics implementation / privacy boundary | PASS — code/tests; actual Observability ingestion unverified |
| SEO / structured data / performance | PASS — local generated output |
| Mobile / accessibility / browser compatibility / visual QA | PASS — exact implementation CI and 12 reviewed desktop/mobile captures |
| Documentation / rollback | PASS — current-state docs and preserved history |
| CI / main / staging release | Implementation CI PASS; promotion authorized, with each exact promotion commit gated by its checks |
| Production readiness | FIX — authenticated staging acceptance, live Turnstile/Resend and production configuration/smoke not verified |

## Adversarial review
P1/public-launch gate: verify the real end-to-end contact path and production setup; mocked provider acceptance does not prove mailbox delivery. P2: independently attributable recommendations or publication links would strengthen proof. P2: source-backed organisation/portfolio scale and real outcomes remain unavailable. P2: short log retention requires disciplined aggregate export; move to persistent aggregates if operationally necessary. No cosmetic issue is promoted to a launch blocker.

## Rollback
Revert the main release merge on a new branch, review/test the revert PR, then promote through main → staging → production as applicable. Do not reset/force-push release branches. The original pre-ASTRA backup is preserved. Disable product collection independently with `PRODUCT_MEASUREMENT=0` if needed.

## Final challenge
The executive value, scope of work and independent engagement formats are explicit; source-backed qualitative proof improves credibility without fabricated precision. Measurement can diagnose intent/friction but the owner must qualify conversations. There is a rational reason to defer **public production** until real contact and authenticated staging gates are verified. More articles, animation or decorative proof are not required for this release.

## Historical publication access checkpoint
Local implementation commit: `6240b9cdba810a8545944367b156eefaeffe13fe` (with follow-up validation/status amendments). Local working branch: `feature/proof-conversion-learning`.

Automatic approval review rejected the feature-branch push twice. After the first rejection, the exact repository/owner/origin and connected push permissions were verified, and added content was checked for private keys/API tokens. The second rejection explicitly states that this is a **public GitHub repository** and separate user confirmation is required to publish the prepared source/documentation payload there. No alternate upload/connector path was attempted after that decision.

At that historical checkpoint only: no new remote branch/PR/CI run, no main merge, no new staging deployment and no production deployment for this release. Existing remote main/staging/production baseline remains the last verified remote state. Final browser/axe/visual gates are pending; local browser installation failed due CDN transport and the cloud browser encountered a Cloudflare challenge loop. This is an environment verification limitation, not a claim of a detected UI defect.

The historical resumption condition, since fulfilled, was owner confirmation of public code/documentation publication to `aras-2003/Simple-Website`: push this feature branch; open PR to main; run full CI; inspect browser/axe outputs and desktop/mobile visual artifacts; resolve any failures; merge to main after required gates; promote main to staging by PR; verify the exact staging commit's Workers Build; report live acceptance limits separately. Public production remains blocked until its real configuration/contact/acceptance gates pass.

Final local recheck: Astro check 0 errors/warnings/hints; 22 translated static/SEO/JSON-LD routes; Worker contact and measurement; Node contact; predeploy contract; unchanged performance budgets all PASS. External-reference checker completed for 19 links: 11 verified and 8 temporarily unverifiable due network timeouts (not reported as verified). Browser/axe/visual CI remains pending the publication approval.

Worker package checks: production and staging Wrangler 4.129.0 dry-runs passed, including the separate measurement limiter. Staging-canonical build passed and the production-canonical build was restored afterward. The preview package attempt was interrupted by environment network approval and is not marked PASS. No deployment was performed by these dry-runs.

## Publication resumed

The owner explicitly confirmed public publication of the prepared source/documentation and the main → staging release on 2026-09-11. The earlier approval blocker is resolved. The connected GitHub API is used for the same verified repository because terminal Git lacks credentials. Verified implementation CI and visual evidence are recorded above; subsequent promotion results are recorded in the linked GitHub PR and check history.
