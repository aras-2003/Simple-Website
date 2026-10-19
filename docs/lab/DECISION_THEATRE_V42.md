# Decision Theatre V4.2 — cinematic editorial prototype

Date: 2026-10-19. Route: `/lab/decision-theatre-v4`. Branch: `feature/decision-theatre-v4-visual-spike`. Existing draft PR: [#81](https://github.com/aras-2003/Simple-Website/pull/81), retaining its V3 base `feature/decision-theatre-gsap-three`.

Implementation commit: `0dc7e70f483719363dcef7e57e698add443ed32d`.

Internal prototype visual targets are met at the sampled checkpoints; owner promotion approval remains open.

Starting HEAD was verified locally and through GitHub as `18c9c9c066a40a4d693249bfe959436db50e5170`. The owner's V4.2 instruction authorizes motion on the approved black-metallic foundation; it supersedes the old static-study acceptance hold. It authorizes neither merge nor deployment.

## Implementation and rationale

One fixed, viewport-sized environment sits behind five semantic editorial sections. The content remains in document flow; it is never hidden, replaced, pinned or animated into availability. A paused GSAP timeline controlled by ScrollTrigger drives one scalar scene position. Its segment durations are measured from actual section positions and the document's final scroll extent. No spacer, snap, smooth-scroll replacement or panel-switching mechanism is introduced.

The strongest alternative was a pinned cinematic chapter with synchronized text panels. It would simplify framing but turn the site into a presentation and delay access to the content. The native document approach costs more composition work during transitions, but preserves direct navigation, reading, accessibility and restoration.

The same six named bodies persist throughout: three portals, two decision keys and one decision plane. Explicit pose waypoints use quintic smoothstep, giving zero velocity and acceleration at intended rests. A centripetal Catmull–Rom camera path approaches the structure, moves laterally, then pulls back. Lens shifts interpolate independently through the same scalar state. The keys clear the transformation lane before the portals align; the narrower plane slides out of the aperture and returns after alignment. There are no image replacements or scene cuts. This is authored kinematics, not a rigid-body simulation or a collision-proof CAD assembly.

Five phases:

1. Monumental hero establishes the executive thesis and direct contact path.
2. Complexity approaches the layered volumes and moves the reading column right.
3. Decision reorganizes the same bodies; YES / NO / WHO gives the transformation a concrete executive meaning.
4. Coherence resolves the portals around a shared opening and calms the light.
5. Execution pulls back, introduces the person and closes with a professional contact CTA. Geometry remains present rather than fading to black.

The existing Astro framework and pinned dependencies remain unchanged. No public homepage, V3 implementation, infrastructure, secrets, deployment workflow or budget is changed. English editorial claims derive from the existing About and Advisory content; no client results or credentials were invented. This remains an isolated noindex English lab prototype, not a bilingual product release.

## Materials, lighting and mobile

The procedural PMREM room uses broader lighting cards and a restrained side fill so reflected gradients persist across rotations. Graphite, satin and silver remain the material family. Cut and polished finishes are slightly rougher; ACES filmic tone mapping and sRGB output are preserved. There is no bloom, SSAO, depth of field or external HDRI/model/texture download. The architectural ground plane extends beyond the subject rather than framing a small product pedestal.

Portrait composition uses a wider lens, a separate pullback and downward subject framing, with readable text above the architecture. Phone shadow maps are 1024² instead of 1536²; its reflection target is 384² instead of 768². DPR remains capped at 1.25 phone / 1.5 desktop. Local editorial light flags protect individual reading areas, not the full viewport.

Reduced motion keeps the initial environment stationary while the complete text remains available. WebGL initialization failure or context loss disposes the scene and exposes the original vector fallback. Live reduced-motion preference changes are handled. Resize remeasures section geometry, including orientation changes; visibility restoration and anchor/history restoration synchronize the scene again. Page exit kills the timeline/trigger and disposes GPU resources. Back-forward cache restoration reloads the document rather than retaining a disposed renderer.

Rendering is demand-driven. Scroll changes, resize, visibility restoration and explicit debug/capture actions request renders; there is no independent idle animation loop. Canvas buffers are resized only when dimensions or DPR change. Materials, geometry, environment and reflection targets are reused.

Default visitors see no lab controls. `?debug=1` exposes a scene-position slider, return to scroll control and a material close-up. Diagnostics are local DOM data and events, without analytics, browser storage or network collection.

## Reference access and preserved baseline

The repository's [original desktop](decision-theatre-v4-evidence/desktop-ui.webp), [mobile](decision-theatre-v4-evidence/mobile-ui.webp), [material detail](decision-theatre-v4-evidence/material-detail.webp) and static A/B/C renders were inspected. The three latest owner screenshots and reference archive were **not attached to this session**; no direct comparison with unavailable originals is claimed. All original evidence files remain intact. The comparison sheet preserves the original image proportions; original and new captures use different viewports, and no image retouching is applied. The historical [V4 report](DECISION_THEATRE_V4.md) remains available with its dated findings.

## Visual iteration record

### Iteration 1 — full-page implementation

Actual browser captures: 23, including all requested narrative checkpoints, reverse positions, material mode, mobile, 320px and reduced motion. No collected browser errors. The first hero retained V4's monumental architecture and improved the executive hierarchy. A screenshot-only independent critic inspected baseline and new images before seeing implementation notes.

The critic identified High contrast defects: a silver portal crossed the complexity headline/body; decision labels crossed bright faces; mobile paragraphs and links crossed lintels and pillars. Scores were candid: readability 2.5/5, mobile 3/5, materials 3.5/5. The first implementation did not pass the visual target.

### Iteration 2 — composition and contrast correction

Moved the complexity/coherence framing further away from their reading columns. Added reliable local contrast flags across the full reading area and decision rail, testing broader local contrast fields. Increased annotation sizes. Extended the architectural floor beyond the composition, added restrained reflected side fill, corrected the close-up diagnostic and refined the plane's clearance path. The final pullback moves architecture away from the closing CTA.

The second review caught a regression: readable copy but visibly rectangular dark masks and a washed-out final CTA. Integration fell to 2/5 and mobile to 2.5/5. This correction did not pass.

### Iteration 3 — feathering and document bounds

Feathered the local flags in both axes, corrected the CTA reading surface and clipped horizontal overflow at the semantic main element. The overflow had widened a 390px phone canvas to 448px and affected pointer interaction with the debug panel. The third review scored materials 4 and readability 4.5, but found conspicuous oval smudges around small annotations, residual reading slabs and weak later phone geometry. Integration and polish remained 3.

### Iteration 4 — remove artifacts, retain the environment

Removed unnecessary hero/explore annotations, moved the YES / NO / WHO rail into its reading group, broadened feathering and reduced the final portrait camera retreat. The independent critic found no Critical/High defects in the inspected stills. Integration, mobile and polish were still honestly 3.5: bright edges crossed mobile paragraphs and desktop decision typography, while footer microcopy was faint.

### Iteration 5 — composition rather than more masking

Moved the staging key farther out of the reading area, lifted the temporary plane above the desktop decision headline, and lowered the portrait architecture during Complexity and Decision. The same objects and continuous interpolation remain. Raised the footer and CTA supporting type sizes/contrast. Actual repeat captures show mobile body copy and decision labels clear of luminous edges, the desktop beam above the headline, and visible architecture through the final CTA. No collected browser errors in any of the five 23-capture iterations.

The screenshot-only critic scores all nine visual categories 4/5, with no unresolved Critical/High in the reviewed stills. The remaining Medium refinements are recorded below; 4 means strong and coherent, not flawless. Earlier contact sheets and results remain in [the iteration record](decision-theatre-v42-evidence/iterations/). The implementation continued past three iterations under the owner's newer, explicit autonomous-improvement instruction.

## Critical Creative Director review and scorecard

Nine visual scores below come from an independent screenshot-only reviewer who first saw rendered pixels, not implementation notes. Camera choreography and continuity are author assessments supported by actual frame sequences, browser interaction tests and the scroll profile; the independent critic did **not** certify motion from stills. Scores are internal quality controls, not studio-level certification or owner approval.

| Category | /5 | Specific evidence |
| --- | ---: | --- |
| Full-page cinematic integration | 4 | [Complexity](decision-theatre-v42-evidence/complexity-entry.webp) enters the structure; [coherence](decision-theatre-v42-evidence/coherence.webp) changes its relationship to the reading column; the same environment persists through the CTA. |
| Hero impact | 4 | [Hero](decision-theatre-v42-evidence/hero.webp): restrained serif thesis, direct CTA, monumental layered portals and negative space. |
| Material realism | 4 | [Close-up](decision-theatre-v42-evidence/material-detail.webp): brushing, bevel response, satin/bright face separation and cold reflected gradients. |
| Lighting sophistication | 4 | [Transformation midpoint](decision-theatre-v42-evidence/transformation-50.webp): legible dark sides and controlled silver reflections; resolution calms the exposure. |
| Spatial composition | 4 | [Decision entry](decision-theatre-v42-evidence/decision-entry.webp): lifted plane avoids the title; approach/pullback change scale rather than rotating a fixed-size object. |
| Camera choreography | 4 | Camera moves from `[9,4,13.4]`, approaches `[4.48,3.55,10.29]` near Decision, then reveals `[11,5.8,23]`; [contact sheet](decision-theatre-v42-evidence/contact-sheet.webp) includes intermediate passages. Author assessment, with remaining mobile quiet interval below. |
| Scroll continuity | 4 | Native headings move by the exact document scroll distance; exact pose reversal and boundary samples pass on desktop/mobile. [Reverse decision](decision-theatre-v42-evidence/reverse-decision.webp) reproduces the forward midpoint. |
| Typography and readability | 4 | [Mobile Complexity](decision-theatre-v42-evidence/mobile-complexity.webp) paragraph at y500–585 and CTA near y643 now sit in clear dark space. |
| Brand credibility | 4 | [Execution](decision-theatre-v42-evidence/execution.webp): personal perspective and verified credentials, restrained visual hierarchy, no invented proof or outcomes. |
| Mobile experience | 4 | [Mobile Decision](decision-theatre-v42-evidence/mobile-decision.webp): paragraph and decision labels clear of bright edges; [ending](decision-theatre-v42-evidence/mobile-cta.webp) retains the architecture. 320px capture and rotation/overflow checks included. |
| Overall visual polish | 4 | All [23 final captures](decision-theatre-v42-evidence/contact-sheet.webp): annotation smudges removed, supporting type improved, one material vocabulary retained. |

Remaining **Medium** refinements, explicitly accepted as limitations of this prototype rather than hidden:

- Complexity still has a perceptible broad dark reading column around x800–1400 / y300–930 in the 1600px capture. It blends into the room but is not invisible.
- Decision has a dark upright around x55–270 / y315–930 behind portions of the desktop text. Contrast is sufficient; the composition is locally busy.
- Mobile transformation has a quiet room interval around y250–590. It preserves the continuous space but lowers narrative density.
- Wide views favor machined silver fronts with black sides, rather than uniformly dark graphite. This retains the approved black/graphite/silver family but is a candid stylistic distinction.

[Baseline comparison](decision-theatre-v42-evidence/baseline-comparison.webp) places unchanged V3, static V4 and V4.2 browser images side by side. V3 retains a diagram-like assembly beside a stable reading lane. V4 establishes metallic architecture but exposes a look-development desk. V4.2 preserves the metal vocabulary while using monumental scale, alternating composition, environmental depth and a complete executive narrative. This is a visual judgment, not a test-derived quality claim.

## Validation, performance and creative acceptance

Passing technical tests is not owner visual acceptance.

- Full `npm run test:static` passed: Astro, static/SEO/privacy/link gates, editorial assets/language, Worker/contact, logging, API and predeploy contracts. Final frozen-source Astro check: **0 errors, warnings or hints**; 29-page build and static guards repeated successfully. [Suite](decision-theatre-v42-evidence/static-suite.log), [final check](decision-theatre-v42-evidence/astro-check.log), [build](decision-theatre-v42-evidence/build.log), [static](decision-theatre-v42-evidence/static.log).
- V4.2 desktop/mobile Chromium: **18 passed**, covering native flow, persistent identities, exact reverse poses, boundary continuity, fast/slow seeks, resize/rotation, anchor/reload restoration, axe WCAG tags, keyboard/contact, reduced-motion preference changes, context loss, initialization denial, no JavaScript, explicit debug and bounded GPU allocation counts. [Log](decision-theatre-v42-evidence/v42-browser.log).
- Existing public-site/V3 Chromium regression: **269 distinct checks passed, 1 expected desktop skip**, across the initial run and targeted recheck. The first concurrent run had 260 passes and 9 failures: timeouts, transient missing pages/assets during a local rebuild, and a V3 pixel-reversal mismatch. The nine affected cases all passed with a stable build, one worker and a 90s test limit; public/V3 source and tests were not changed. [Initial failures retained](decision-theatre-v42-evidence/regression-first.log), [9/9 recheck](decision-theatre-v42-evidence/regression-recheck.log). Rebuilding a live test artifact was an execution mistake; subsequent builds used a separate directory and atomic replacement of only the four changed V4 files.
- Firefox/WebKit public-site smoke/editorial/privacy matrix: **88 passed, 14 expected project skips** (six Chromium-only visual audits plus the mobile-only navigation case per desktop engine). [Log](decision-theatre-v42-evidence/cross-browser-public.log).
- V4.2 Firefox/WebKit: **18 distinct checks passed** across the initial run (17 passed) and the single WebKit keyboard recheck. macOS WebKit skips links with ordinary Tab under its platform keyboard setting; a direct diagnostic verified Option+Tab reaches the skip link and Enter focuses main. The test supports that native shortcut without weakening the focus assertion. [First run](decision-theatre-v42-evidence/v42-cross-browser-first.log), [keyboard recheck](decision-theatre-v42-evidence/webkit-keyboard-recheck.log).
- Original static V4 evidence, V3, homepages, dependencies/lockfile, workflows and public budget definitions remain unchanged against starting HEAD. The final build differs only in V4 HTML and its three CSS/JS files.

## Performance findings

The unchanged gates all pass: [budget output](decision-theatre-v42-evidence/budgets.log). Public artifact **1702.2 / 1800 KiB**, public client JS **7.0 / 8.0 KiB**, gzip CSS **6.5 / 20 KiB**, V3 gzip JS **182.6 / 240 KiB**, V4.2 gzip JS **186.4 / 240 KiB**, external scene assets **0 / 3072 KiB**. V4's earlier 143.3 KiB JS becomes 186.4 KiB with the production GSAP/ScrollTrigger choreography and added runtime; no new dependency or limit increase.

[Final captures/observations](decision-theatre-v42-evidence/results.json) and [scroll profile](decision-theatre-v42-evidence/profile.json) contain raw measurements. The profile requests high DPR to exercise shipping backing-buffer caps, sends 360 native rAF scroll requests per viewport over two forward/reverse sweeps, then measures idle rendering. Exact endpoints are covered separately by the Chromium behavior tests. [DPR-1 diagnostic](decision-theatre-v42-evidence/profile-dpr1.json) is retained for comparison. The reported path is **ANGLE Metal / Apple M1**, not SwiftShader. It is a Mac desktop GPU measurement for both viewports, not a physical mobile GPU test.

| Measurement (one local run) | Desktop | Phone emulation |
| --- | ---: | ---: |
| Requested DPR / actual cap | 2 / 1.5 | 3 / 1.25 |
| Canvas backing pixels | 2400×1500 | 487×1055 |
| Construct + PMREM + first render submission, CPU | 380.1 ms | 320.1 ms |
| PMREM portion, CPU | 84.1 ms | 56.8 ms |
| Native rAF interval, median / p95 | 16.7 / 16.8 ms | 16.7 / 16.8 ms |
| Intervals >32 ms / 359 samples | 17 | 0 |
| Maximum interval | 50.1 ms | 16.8 ms |
| Scene renders across sweeps | 356 | 356 |
| Renders during 700 ms idle | 0 | 0 |
| Observed long tasks during sweeps | 0 | 0 |

Both sweeps cover progress 0–4.485 (exact final 4.5 is tested separately). Six additional scene positions record four GPU-synchronized repeated renders each; observed warmed values span about **0.3–1.3 ms**. These timings omit layout/compositing and do not establish whole-page FPS. A run concurrent with the cross-browser matrix had desktop p95 **33.3 ms**, retained in [the load observation](decision-theatre-v42-evidence/profile-under-test-load.json). With that matrix stopped the p95 recovered, but 17 delayed desktop intervals remain visible in the raw result. No constant-60-FPS or cross-device claim is made, and no quality reduction was justified solely by the contended run. Initialization varied under load (the capture run's desktop first submission was 1.77 s); this single-host observation is not a controlled cold-load distribution.

Each scene retains **19 geometry allocations / 6 textures** across sampled transformations; one ordinary frame submits **40–41 draw calls / 19,530–20,118 triangles**, including shadow/reflection work. No new materials, textures or geometry are created per scroll step. Target counts stay bounded in the tests. JS heap before/after is recorded without forced GC: it is indicative allocation behavior, not a retained-memory or leak proof.

The PMREM environment is **768×1024 half-float RGBA** (6 MiB color storage). The planar reflection uses **768² desktop** (4.5 MiB) or **384² phone** (1.125 MiB). Together that is at least **10.5 / 7.125 MiB color targets**, excluding shadow/depth buffers, the canvas, transient PMREM working targets and driver overhead. This is an allocation calculation, not measured total VRAM. Phone shadow maps are 1024² versus 1536² desktop. There is one extra reflection render, no postprocessing chain.

The renderer string in the separate profile establishes the observed host path. The conservative scene diagnostic `nativeGPUPerformance: NOT VERIFIED` reserves device qualification; it does not classify the renderer as SwiftShader. These observations are local headless-host evidence, not a statistical hardware benchmark, real-phone qualification or proof of every device's frame rate.

## Outstanding risks and release boundary

Owner visual review is still required before any promotion. No merge, staging or production deployment was performed. No latest owner screenshots/reference archive were available for direct reference matching. Occasional delayed desktop frames remain in the high-DPR host profile. Real iPhone/Android touch, browser chrome resizing, thermals/battery and low-end GPU memory pressure are not verified by emulation. JavaScript heap retention and total VRAM need a controlled device profiling session before release. The authored geometry is visually staged, not collision-certified physics. The route remains an English noindex lab prototype, with the original vector fallback when JavaScript/WebGL is unavailable.

## Local preview and reproduction

Requires the repository's Node ≥22.12 and lockfile:

```sh
npm ci --no-audit --no-fund
ASTRO_TELEMETRY_DISABLED=1 SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
npm run preview
```

Open [the local prototype](http://127.0.0.1:4173/lab/decision-theatre-v4). Astro 7 may start preview as a background server; `npx astro preview status` / `npx astro preview stop` manage it.

```sh
npm run test:decision-theatre-v4
node scripts/decision-theatre-v4-profile.mjs
V4_CAPTURE_OUTPUT=artifacts/decision-theatre-v42/review npm run capture:decision-theatre-v4
```

The capture script defaults to Playwright's installed Chromium. A system browser can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; this session used `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Screenshots are actual browser pixels encoded losslessly to WebP. `?debug=1` is optional for manual inspection.

No merge or staging/production deployment is authorized or performed. Owner approval remains required for promotion.

## Runtime references

The implementation uses the installed pinned GSAP 3.15.0 / Three.js 0.186.1 sources and the official [ScrollTrigger API](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP repository](https://github.com/greensock/GSAP) and [Three.js repository](https://github.com/mrdoob/three.js). PMREM and reflector allocation behavior were checked in the installed source rather than assumed from another version.
