# Decision Theatre V5 — Organizational Morphosis

Status: implemented experimental candidate; independent screenshot review passed for owner review. Owner acceptance and release approval remain pending. Isolated route `/lab/decision-theatre-v5`; no release authorization.

Base: V4.2 `a9396831cb2b0b8f4e5b92ad9e68149f774a3937`, branch `feature/decision-theatre-v4-visual-spike`, PR #81. Its CI run 39295794726 completed successfully, including public browser/a11y and V3/V4 gates. V5 branch: `feature/decision-theatre-v5-morphosis`.

## Reference evidence and limits

Morphos, https://scrollhaus.ai/sites/morphos/, was inspected in real browsers. An initial Chrome session failed before the last chapters; hosted browser retries also timed out. A recovered in-app browser session subsequently completed forward scrolling to the skull ending (verified by a further downward scroll that left the endpoint unchanged) and reverse scrolling back to the dispersed/core state. Observed: point-sampled face → expanded field/core with connections → elongated skeletal lattice → skull. Intermediate structures visibly reorganise; their silhouettes and extent change while large editorial headings occupy the same full viewport. The ambient points continue moving at rest. Some headings fade with chapter transitions and some points overlap text. V5 adopts continuous structural change and integrated composition, not particles, ambient idle rendering or essential-text fades. Screenshots are saved in this evidence folder; no external implementation code was inspected, so shader/correspondence details remain assumptions. The browser tool did not expose a supported video recorder; a local V5 fixed-camera motion recording is provided instead.

Étude, https://promti.app/kits/product/demo/, was inspected in the recovered real browser at hero, intermediate floating/material close-up and final purchase section. Observed: the same bottle shifts from pedestal composition to floating and close-up views, leaving editorial negative space; the final CTA returns to a grounded product presentation. This informs subject/editorial balance and a deliberate ending, not product/ecommerce content. A final screenshot is saved. Page content was also retrieved separately; browser observation, rather than that text extraction, establishes these visual findings.

V4 source and committed V4.2 screenshots are the material baseline; no V4 geometry/choreography is imported by the new engine. Existing brand uses an editorial serif, concise decision-led positioning and factual personal credentials. No new achievements are introduced.

## Architecture decision, before page integration

| Direction | Sophistication / continuity | Business clarity / editorial integration | Materials | Cost / feasibility |
|---|---|---|---|---|
| A: persistent instanced field | Excellent correspondence; migration remains visible | Clusters clear, but easily reads as generic particle art | Metallic individual elements; weaker continuous surfaces | Very efficient GPU interpolation; feasible without extra dependencies |
| B: deforming structural surfaces — selected | Persistent strips change internal curvature and collective organisation | Three local capability families unfold into shared directed layers; silhouette leaves reading space | Continuous physical metal, analytic sweep normals; no stretched image textures | One indexed mesh, bounded CPU interpolation/normal update; native WebGL and existing Three.js |
| C: surfaces + nodes + relationships | Rich transformation, but several competing motion grammars | Most explicit relationships; greatest risk of network/dashboard appearance | Possible, with more occlusion and depth-management work | More buffers, draw calls, correspondence rules and maintenance |

Choose B, not a combination. Nine persistent lamellae, grouped into three families, preserve material coordinates `(ribbon, longitudinal sample, cross-section)` across all five states. Every surface changes curvature, spread and relationship to adjacent layers. Fixed topology avoids an invented mapping between incompatible meshes. The bands do not model a literal organisation chart; they express the distinction between locally optimised capabilities and coordinated execution.

Native morph targets are feasible but store complete endpoints and constrain custom interpolation. Custom GLSL is faster at very high vertex counts, but complicates deformation normals, CPU-side diagnostics and validation. Instancing is suitable for A, not this continuous sweep. GPU compute/data textures and WebGPU add no justified value at this scale. CPU BufferGeometry interpolation with one physical MeshStandardMaterial keeps the first experiment inspectable and dependency-free. Reconsider GPU deformation only if measured cost exceeds acceptable interactive frame time on representative devices.

## Proof-of-concept gate

Before editorial integration, capture normalized progress 0, .1, .25, .4, .5, .6, .75, .9, 1 with the camera locked. Review full-system and close-up frames independently. Numerical tests require deterministic reverse seeking, bounded local displacement, changes in intra-ribbon distances (therefore non-rigid deformation), changing inter-family distances, finite coordinates and a closed valid immutable index topology. Numerical tests alone cannot pass the visual gate.

## Verification

- Final type check: 68 files, zero errors/warnings/hints; static build: 31 pages. Full canonical build also passed editorial, Worker/contact, 404, measurement and privacy-logging gates. An earlier build without SITE_BASE_URL correctly failed canonical validation; rerun with repository-required canonical configuration passed. No safeguard was relaxed.
- Four geometry tests passed: deterministic forward/reverse sampling and bounded continuity, non-rigid structural change, closed manifold index connectivity, finite unit analytic normals.
- Public/previous-prototype Chromium desktop+phone regression: **255 passed, one expected skip**, including all public automated accessibility checks, browser smoke, V3 and V4. Source and public budgets remain intact.
- Artifact-scope unit tests: three passed. Shared dependencies remain charged to each experimental route, and public use always charges the unchanged public budget. V5 uses the same existing 240 KiB experimental JS ceiling.
- V5 browser gates cover semantic bilingual content and axe WCAG 2.2, keyboard/skip links, deterministic fixed-camera and native reverse scroll, reload/resize, idle rendering, live reduced motion, denied WebGL, context loss, 320px/no-JavaScript reading, native emulated touch and partial-construction failure cleanup.
- During validation, one loaded-machine Chromium audit exceeded the default 30-second test timeout; the complete sequential rerun passed (90-second command timeout). WebKit initially reloaded before it had persisted its newest native scroll history; a short browser-settling interval before reload fixed the test race. The engine continues to derive progress from actual restored scroll position.


## Visual iteration log

- POC-1: three curled families → sine-wave sheet. Independent screenshot-only auditor: HOLD. Non-rigid deformation visible, but dependency metaphor absent, first state too dark and later half too similar. No full-page integration was performed at this stage.
- POC-2: raised broad-face lighting, stronger wave changes. Captured as a material/shape comparison; superseded before integration because a wave remained too generic.
- POC-3: converging dependency spans → supported open framework → asymmetric extended route. Independent screenshot-only auditor: PASS for editorial integration of the geometry concept. Still not final acceptance. High: faceted highlights, upright shading bands and final moiré. Medium: convergence is a metaphor, not a literal engineered joint. Preserved all geometry identities; replaced shape trajectories rather than adding effects.
- Integration-1: complete bilingual natural document; increase sweep samples from 96×8 to 160×12, remap phone reading space, retain demand rendering. Independent reviewer: HOLD; High inner-face moiré and CTA text overlap. Mobile composition deliberate and text readable.
- Integration-2: 192×16 samples and analytic elliptical-gradient normals. Outer contour improved, but identical checkpoint comparison still showed strong inner-face interference. Rejected as final material treatment.
- Integration-3: simplify 21 fine bands to nine broader bands, preserving the same topology identity and structural progression. Reduce chapter framing offset to retain all dependency ends; add a continuous final framing tail instead of a scene swap. Independent reviewer: ready for owner visual review, no Critical/High evident in inspected stills. Materials improved from 2.5 to 3.5/5, not a claim of flawless metal.
- Final framing: add desktop CTA edge clearance and move phone execution/CTA geometry upward by about 40/50 px. No deformation or material change. Final fallback inspection also caught a phone SVG crossing the hero lead; its static composition is moved below the text. Re-capture the same checkpoints and native intermediate scroll positions.

## Independent Creative Director audit

Screenshot-only critic reviewed complete desktop and phone compositions, fixed-camera intermediate contact sheet, and 50%/100% material details. The critic had no source-code context. POC-1 HOLD prevented premature page integration; POC-3 passed the geometry gate before integration. Integration-1 HOLD triggered material and CTA fixes. Integration-3 verdict: **ready for owner visual review**; no Critical/High evident in these captures. This is still-image acceptance, not a motion or interaction certification.

| Criterion | Score / 5 |
|---|---:|
| Integration | 4 |
| Hero | 4 |
| Materials | 3.5 |
| Lighting | 4 |
| Composition | 4 |
| Readability | 4.5 |
| Credibility | 4 |
| Mobile | 4 |
| Polish | 3.5 |

Residual Medium observations: broken diagonal highlights on stacked inner surfaces (alignment desktop x260–630/y295–325; execution x880–1160/y335–375), softer rounded edges than V4, and more vertical breathing room on phone than desktop. The broad silver faces are now smooth and dominant. The critic did not recommend another geometry redesign. Final framing addresses edge clearance and some phone spacing; scores above remain the actual independent Integration-3 scores, not self-awarded final scores.

## Engine and editorial contract

- Nine persistent bands, three capability families, 192 longitudinal intervals and 16 cross-section samples: 27,792 vertices, 55,548 triangles, one indexed mesh/material/draw call. Immutable vertex/index correspondence throughout all five configurations.
- CPU deformation and analytic unit normals write reused Float32 buffers. Quintic interpolation has zero velocity/acceleration at the five authored anchors. Arbitrary intermediate positions remain continuous; deterministic tests run forward and backward.
- Shape variation changes both intra-band distances and inter-family distances. No rigid-body object animation, remeshing, point reseeding, opacity substitution or idle rotation.
- Camera position/look target is fixed for a given viewport. Secondary projection offsets alternate editorial negative space; the last offset continues smoothly into the CTA while geometry remains at 100%. Locked debug mode removes these offsets. Phone uses a deliberate lower composition and lower pixel-ratio cap.
- Native document scroll drives a paused GSAP timeline, with measured section offsets and a final editorial tail. No pinning, chapter replacement, text opacity or scroll-jacking. Essential content is semantic HTML and contact links are ordinary links.
- Demand rendering: only changed progress, framing or viewport causes a scene render. Context loss disposes GPU resources and reveals the static illustration. No JavaScript and failed WebGL initialization retain the full document. Reduced motion keeps the initial geometry static while the document scrolls.
- PL and EN share the same component/engine with localized content and contact/about/privacy routes. Existing portrait and professional credentials are reused; no new outcomes or endorsements are claimed.

## Local reproduction

```sh
npm ci
SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
npm run preview
```

Open `http://127.0.0.1:4173/lab/decision-theatre-v5` or `/en/lab/decision-theatre-v5`. Diagnostic comparison: `/en/lab/decision-theatre-v5?debug=1&lock=1&isolate=1`. Drag normalized progress to any value; toggle material detail or resume natural scrolling. Debug controls are absent from the visitor interface.

```sh
npm run test:decision-theatre-v5
V5_CAPTURE_OUTPUT=artifacts/decision-theatre-v5/final npm run capture:decision-theatre-v5
node scripts/decision-theatre-v5-profile.mjs
node scripts/decision-theatre-v5-motion.mjs
```

Capture/profile scripts use system Chrome on macOS by default; override `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for another local Chromium executable. Browser tests otherwise use Playwright's installed browsers. Geometry tests use Node's supported type stripping; no runtime/test dependency was added. CI remains on Node 22 and installs its browser versions from the lockfile.

## Remaining limits

This is an isolated noindex experiment, not the approved public homepage. Dependency convergence is an architectural metaphor, not a literal graph/joint simulation. Metal inner-face polish remains Medium. Phone testing uses viewport/touch emulation on a desktop GPU; physical phone thermal behavior, battery use and sustained mobile GPU cost are not established. Automated axe checks do not replace an assistive-technology audit. Reference browser inspection did not expose external shader/source code or a supported reference video recorder. No staging/production deployment or merge is authorized or performed.

## Engineering review and corrections

After the screenshot-only review completed, the independent reviewer switched to source review. One P2 was found and fixed: an exception after renderer creation could leave an appended canvas and allocated GPU resources because the caller had not received a world to dispose. Construction now tracks independently owned resources, releases them on any later exception, disposes the temporary environment generator in a finally block, and rethrows into the existing static fallback. A new browser test injects failure at observer setup, after environment/scene allocation, and requires canvas removal plus visible content/fallback.

Also fixed: reduced motion compares the effective static framing tail, preventing redundant GPU renders during the final CTA interval. Debug detail/camera setters skip unchanged values, so arbitrary seeking no longer submits a redundant render before each deformation. The reduced-motion test now checks the render counter while scrolling into the CTA. These changes preserve the accepted shapes and material appearance.

## Evidence index

- [Nine fixed-camera checkpoints](decision-theatre-v5-evidence/fixed-camera-sheet.webp) — ordered 0, 10, 25, 40, 50, 60, 75, 90, 100 percent.
- [Desktop editorial contact sheet](decision-theatre-v5-evidence/editorial-sheet.webp), [phone contact sheet](decision-theatre-v5-evidence/mobile-sheet.webp), [320px Polish hero](decision-theatre-v5-evidence/narrow-polish.webp).
- [Material at 50%](decision-theatre-v5-evidence/detail-50.webp), [material at 100%](decision-theatre-v5-evidence/detail-100.webp).
- Native intermediate scroll captures: [10%](decision-theatre-v5-evidence/native-10.webp), [40%](decision-theatre-v5-evidence/native-40.webp), [60%](decision-theatre-v5-evidence/native-60.webp), [90%](decision-theatre-v5-evidence/native-90.webp). Independent final still review found no new Critical/High or text/geometry collisions; viewport cuts are normal document scrolling.
- [V4 / V5 comparison](decision-theatre-v5-evidence/v4-v5-comparison.webp): left V4, right V5; hero above, execution below. Existing V4 captures were reused without modifying that prototype.
- Earlier rejected/checkpoint iterations are preserved under `decision-theatre-v5-evidence/iterations/`.
- [Reference Morphos ending](decision-theatre-v5-evidence/reference-morphos-ending.png), [reverse inspection](decision-theatre-v5-evidence/reference-morphos-reverse.png), [Étude ending](decision-theatre-v5-evidence/reference-etude-ending.png).

No Critical/High defect remains in the independent still review. The local interactive/motion evidence and deterministic tests establish behavior separately; still-image scores are not being used as a motion benchmark.

## Final browser and performance findings

Engine/lifecycle implementation: `9ca1e60fd75d7609a947b6e2d054afe83b9e708e`; final framing, reading field and expanded native-scroll profiler: `e43d36faa5f207948f2f544c77f99c720c131ef1`. The subsequent evidence commit changes documentation and captures only.

Final V5 browser rerun after lifecycle fixes: **17 passed / one expected skip** in system Chrome desktop+phone, **16 passed / two expected skips** in local Firefox/WebKit. All 33 applicable cases passed, including new partial-allocation failure and static reduced-motion render-counter checks. Touch is only executed in the mobile Chromium project; other project skips are intentional. Local cross-engine runs used installed Firefox revision 1538 and WebKit revision 2336 through a temporary test configuration; CI installs lockfile-matched engines. Raw final logs are included alongside captures.

Production budgets: public artifact 1702.2/1800 KiB, public JS 7.0/8 KiB, homepage 9.4/20 KiB, CSS gzip 6.5/20 KiB. V3 182.8/240 KiB gzip, V4 186.6/240 KiB, **V5 183.1/240 KiB**. No threshold increased and no source maps shipped. The existing large raw Three.js chunk advisory remains; compressed reachability is measured separately from public routes.

The isolated non-recording profile ran 241 RAF-driven arbitrary seeks forward/backward per viewport in headless system Chrome on **Apple M1 via ANGLE Metal**. The final clean run had no concurrent test browser, recorder or video encoder. A third scenario measured native document scrolling with the full HTML composition and secondary framing enabled. This is actual hardware-backed WebGL, not SwiftShader; it is not a native Metal or physical-phone benchmark. Each scene has one geometry/draw call, two reported textures and 1,000,296 bytes of position/normal/index buffers. DPR caps: 1.5 desktop and 1.25 phone.

| Observation | Desktop fixed-camera 1600×1000 | Phone emulation 390×844 | Desktop native scroll 1600×1000 |
|---|---:|---:|---:|
| Input DPR / rendered canvas | 2 / 2400×1500 | 3 / 487×1055 | 2 / 2400×1500 |
| Frame interval median / p95 / max | 16.7 / 17.4 / 18.4 ms | 16.7 / 16.9 / 18.1 ms | 16.7 / 18.3 / 26.0 ms |
| Deformation CPU median / p95 | 8.7 / 9.9 ms | 3.8 / 4.4 ms | 4.1 / 8.8 ms |
| Render CPU submission median / p95 | 0.5 / 0.7 ms | 0.3 / 0.4 ms | 0.2 / 0.5 ms |
| Initial scene CPU+submission | 270.3 ms | 278.4 ms | 101.5 ms |
| Long tasks during measured loop | 0 | 0 | 0 |
| Extra renders during 700 ms rest | 0 | 0 | 0 |

Native-scroll deformation samples include zeros in the final editorial tail, where geometry intentionally stays at 100%; its lower median is not evidence of a cheaper morph. These are observations from one desktop session; initialization/JIT/cache and viewport differ, so the columns do not imply a faster physical phone. Render submission excludes GPU completion; frame intervals include the browser/driver scheduling path. Initialization includes procedural environment creation and first draw submission, not network loading or a GPU fence. Recordings run separately and are not used as clean performance measurements. Raw [profile](decision-theatre-v5-evidence/profile.json) and [fixed-camera motion diagnostics](decision-theatre-v5-evidence/motion.json) preserve samples and geometry/camera data.

Final live laptop inspection additionally covered Polish anchor navigation and native intermediate scrolling at 1265×712. It caught a tight chapter-end clearance and a bright surface crossing the small outgoing alignment note. The final framing has more separation, and a compact soft reading field (the existing V4 principle, limited to the actual copy bounds) lets the geometry recede behind text during those intermediate overlaps. No text is hidden/replaced. Phone composition is unaffected. [Live Polish hero](decision-theatre-v5-evidence/live-polish-hero.png), [dependency anchor](decision-theatre-v5-evidence/live-polish-dependencies.png), [readable intermediate transition](decision-theatre-v5-evidence/live-polish-transition.png).

Recordings: [fixed camera, forward/reverse](decision-theatre-v5-evidence/fixed-camera.mp4), [native document, slower forward/faster reverse](decision-theatre-v5-evidence/native-scroll.mp4). These are real browser recordings, not pre-rendered substitutes for the runtime. Static fallback and reduced motion are also captured: [phone without JavaScript](decision-theatre-v5-evidence/fallback-mobile.webp), [reduced-motion ending](decision-theatre-v5-evidence/reduced-motion-end.webp).

Final independent reading-field review: no new High defect; intermediate Polish text remains readable and the overall spatial composition is preserved. Medium residual: the dark copy column is perceptible in the hero and slightly interrupts the metal behind an outgoing note. Feathering prevents a separate card appearance. Accepted for owner review; increasing opacity or bounds is not recommended.
