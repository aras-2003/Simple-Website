# Living Architecture V6.4 — a shared vision, lived events

Owner direction approved in conversation on 2026-10-20. This supersedes the older pack's prohibition on a cubic envelope: the new target is an open, deeply recessed architecture with near-cubic proportions, four sides and a real interior. It must retain asymmetric cavities and different degrees of dependency. The approved inline vision study is a mechanism/composition reference; its missing rear geometry is explicitly rejected.

## Creative direction and experience

Left: methodology and executive message in normal document flow. Near the right of the actual sculpture: one very small, contextual event annotation. Full-depth graphite architecture, warm inner lintels, precise bevels and sparse causal pulses. A faint, non-solid drawing of the exact target precedes its realization. No early opaque cage. The building gradually occupies that authored target rather than docking completed equal groups.

Two approaches considered: extruding/mirroring the two visible elevations would be cheaper but leave the interior and rear organizational relationships superficial. Selected: author four independently articulated elevations, rear chambers, internal capability volumes and shared structural interfaces. Keep the existing membership graph and original module positions; supplement the model with identified structural members for the new depth. Every material member has a persistent identity, an initial pose and a target pose.

## Motion and semantics

Normal document scroll exclusively determines global assembly. Phase-local time selects and runs organization events, even when scroll is stationary. Moving inside the same phase does not restart its event; entering another phase starts its own schedule. Local responses are bounded and cannot drive the whole assembly. Hiring, responsibility ownership, departmental remit, team integration, investment priorities and execution feedback are illustrative interpretations of the repository's OAF content, not claims about a real company.

Participants brighten and regain material/color contrast while unrelated components desaturate and dim. Receiver pulses start only after signal arrival. Signals travel directly from point to point with short tails, never along a permanent conduit network. Different dependency strengths shape room spacing and shared interfaces.

## Implementation / preservation

Continue `feature/living-architecture-v6`, Draft PR #87. New PL/EN routes `/lab/living-architecture-v6-4` and `/en/lab/living-architecture-v6-4`; V6.3 and all earlier routes, source and evidence preserved. Reuse installed Three.js/GSAP; no dependencies, release settings or public-site changes. New artifact scope must retain all public budgets.

Validation will cover four-sided geometry and interior presence, exact target convergence, deterministic reverse seeking, independent clocks, phase membership, pulse arrival, native scroll, mobile, small tracked annotations, reduced motion, context loss, paused rendering and regression/build gates. Up to three implementation/render/critique cycles. Actual evidence and limitations will be appended after verification. No merge or production deployment.

## Authored model and event contract

The complete model has 1,026 stable members: the original 350 agency identities and initial poses, 226 additional chamber members, 432 window strata and 18 internal spine/landing/core members. Four elevations each contain 252 members; the rear has its own recessed-room pattern. The sculpture is approximately 6.8 × 6.6 × 6.8 units. A fixed default orthographic camera preserves the same view throughout transformation. The explicit **View rear / Zobacz tył** button changes only inspection angle; it never compensates for assembly or recenters the model.

Every module interpolates directly from its initial pose to its final authored pose. Seeded onset and structural responsibility determine timing: fine capabilities move before large structural members. At progress 1, positions and dimensions are assigned exactly to the target (with events disabled). Strong relationships share 2.2-unit floors, moderate ones retain a 0.1-unit threshold, loose ones a 0.24-unit separation. A faint drawing uses the actual target structural geometry and disappears at convergence.

| Phase | Illustrative event | Causal / physical consequence |
| --- | --- | --- |
| People | Hiring | New capability grows; mentor and adjacent team receive the signal in sequence. |
| Teams | Accountability | Ownership propagates through handoffs; the decision panel changes its interface position. |
| Teams, alternate cycle | Departmental remit | Two origins start together; affected handoffs and panel position change. |
| Departments | Team merger | Two teams initiate simultaneously; their shared capability receives both signals and widens. |
| Organization | Transformation priority | One priority branches to departments; arrived capability panels expand locally. |
| Group | Delivery feedback | A three-organization return path revisits a decision; its panel makes a bounded angular correction. |

These are deliberately illustrative interpretations of [OAF source content](../../src/content/method.ts) and [governance](../../src/components/OafPage.astro), not a simulation of a real organization or an endorsement of one universal structure. Phase entry resets event time; movement inside the same phase does not. Eleven-second cycles include an inactive interval. Signal receivers activate after travel, with short direct tails and no permanent pipe network. Geometry responses remain local; decks and the architectural envelope do not drift.

The single caption is 11px on desktop / 10px on phones, at most 174px / 148px wide, near the right of the active model. It tracks a ray-tested surface of an arrived participant; hidden targets suppress the pointer. Methodology remains left in normal document flow. Transparent fields preserve geometry; there is no canvas masking beneath text. Pause, reduced motion, offscreen suspension, context-loss fallback, partial-allocation cleanup and page-cache restoration are supported.

## Reproduction

```sh
SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
npm run preview
PLAYWRIGHT_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:living-architecture-v6-4
V64_CAPTURE_OUTPUT=artifacts/living-architecture-v6-4/final node scripts/living-architecture-v6-4-capture.mjs
V64_PROFILE_OUTPUT=artifacts/living-architecture-v6-4/profile.json node scripts/living-architecture-v6-4-profile.mjs
V64_MOTION_OUTPUT=artifacts/living-architecture-v6-4/recording node scripts/living-architecture-v6-4-motion.mjs
```

Capture, profile, recording and browser tests run separately to avoid GPU contention. Recording requires `ffmpeg` (`FFMPEG_PATH` override); Chrome has a `PLAYWRIGHT_CHROMIUM_EXECUTABLE` override. Diagnostic controls: `?debug=1&freeze=1&isolate=1`. Default visitor URLs contain no query string. Local feature previews do not deploy; private staging requires the existing controlled promotion path.

## Review / validation

Three bounded visual iterations: (1) establish four inhabited sides and interior, reject overly dark/repetitive frame expression; (2) improve warm lintels, window strata, rear inspection and visible-participant caption tracking; (3) strengthen full/empty chamber contrast and central capability volumes, retaining exact cubic target and smaller captions. Actual desktop/phone and four-side renders are inspected; older prototype source, routes and evidence remain unchanged.

Application source commit: `903119698c1ccbb3b327abc0daf333d757d393a5`. The final build passes Astro diagnostics (0 errors/warnings), static/PL–EN/editorial gates, all original public performance limits and Worker/contact/privacy tests. V6.4 JS is 192.7 KiB gzip against the unchanged 240 KiB isolated lab cap. New checks: 7 model tests and 20 desktop/mobile Chromium browser tests, including WCAG scans. The eight original V6 model tests and five artifact-reachability tests also pass. Subsequent evidence-only commits do not change application behavior.

Native device/touch hardware and Safari/Firefox performance are not claimed by phone emulation. The model is a real-time geometric prototype inspired by the supplied image, not a photorealistic rendering. Visual acceptance remains with the owner; this is a Draft PR, without merge or deployment.

## Final evidence

[Evidence index](living-architecture-v6-4-evidence/README.md) · [actual 41.64-second recording](living-architecture-v6-4-evidence/demo.mp4) · [eleven assembly checkpoints](living-architecture-v6-4-evidence/assembly.webp) · [four complete sides](living-architecture-v6-4-evidence/four-sides.webp) · [desktop narrative sweep](living-architecture-v6-4-evidence/desktop-sheet.webp) · [phone narrative sweep](living-architecture-v6-4-evidence/mobile-sheet.webp).

The recording contains 911 actual Chrome CDP frames, H.264 1280×800, 3,705,308 bytes. Native scrolling advances each phase, holds let time-based events continue, an explicit rear inspection reveals back chambers, and reverse scrolling restores chaos. Capture reports zero runtime/frame errors. Encoded video is decoded and representative frames inspected; recording cadence is not a performance measurement.

The separate native profile uses Chrome / ANGLE Metal / Apple M1, 181 forward/reverse morph updates per viewport, without concurrent capture/tests. Desktop CPU update p50/p95: **4.2 / 6.0ms**; CPU submission p50/p95: **0.4 / 0.8ms**. Phone emulation: **1.7 / 3.2ms** update and **0.2 / 0.3ms** submission. Frame interval p95 was 18.9ms desktop / 18.1ms emulation. Paused rendering adds **0 draws**; the deliberate local-event scheduler draws 54 / 53 frames over 1.8 seconds. CPU submission does not measure GPU completion. The active-target raycast is exercised by browser/event checks; morph timing samples are collected at frozen event time.

Instance buffers: 78,488 bytes, rounded-box geometry: 28,800 bytes, 615,600 visible solid triangles at convergence; two calls including the shadow pass at inactive final state. DPR caps remain 1.5 desktop / 1.1 phone. These are desktop-device measurements, not phone hardware claims. Private staging was not promoted or deployed; local [PL](http://127.0.0.1:4173/lab/living-architecture-v6-4) / [EN](http://127.0.0.1:4173/en/lab/living-architecture-v6-4) previews are the review targets.

Preservation is also checked through the existing V6.3 desktop/mobile browser suite, with its original reading-mask and tracked-surface behavior retained. The older model tests and original prototype source are unchanged; the new route has its own transparent composition and complete-volume model.

Final preserved-version result: **27 V6.3 browser checks passed**, with one expected desktop-only touch skip; eight original V6 model checks passed. This is in addition to the new V6.4 suite. Evidence and the decode check are tied to the unchanged application commit above.
