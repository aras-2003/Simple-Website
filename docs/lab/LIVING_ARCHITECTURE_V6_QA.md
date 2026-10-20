# V6.2 lab acceptance record — 2026-10-20

Full sweep source: `30e2a38f3e4b94f3bb6b26f3674f5737dd015346`; final application includes lifecycle fix `0596471`. Final renders/recording use `2d01439f3192299d1b29816ce4989f88b174b46c`. This is a reviewable prototype, not owner visual acceptance or release authorization. [Design, architecture, iterations and reproduction](LIVING_ARCHITECTURE_V6.md).

| Gate | Status | Evidence / boundary |
|---|---|---|
| Six supplied images inspected as pixels | PASS | Reference analysis in design report; originals excluded from Git and website |
| Three open branching alternatives | PASS | `candidates.webp`; spine / mesh / cantilever; no closed-cube alternative |
| Unequal branches, deep apertures and sparse peripheral links | PASS, owner review pending | Final spine render; residual repeated rectangular grammar remains visible |
| Strong / moderate / loose dependencies affect physical structure | PASS | Explicit membership graph, authored unequal centers/extents, connector cross-sections and formation thresholds; model tests |
| Persistent identity across five scales | PASS | 350 stable IDs, 18 unequal teams, five departments, three organizations; fixed-camera checkpoints and reversible model/browser tests |
| Actual geometry morph with fixed camera | PASS | Eleven distinct position/shape signatures, identical camera matrix, forward/reverse reproduction |
| Stable projected module anchor | PASS | Desktop/mobile: projected persistent-module centroid range <3% viewport in each axis; camera/global transform never follow progress. Pixel-area centroid is separately reported below |
| Local interior and exterior life at final scroll | PASS | Frozen samples t=0,2,5,8; bounded changes in central and peripheral teams; fixed structural seams; motion recording |
| Semantic signals have structural consequences | PASS | Initiative moves adjacent sliding units; collaboration expands cross-team interface; decision realigns selected panels. Model checks include t=1.5,7.5,13.5; no random blink schedule |
| Editorial reading and legend | PASS with documented compromise | Normal-flow PL/EN, one annotation; actual pixel comparison with sculpture hidden/visible. Local luminance reading windows occlude geometry during copy crossings; debug isolate disables them |
| Desktop/mobile at 11 checkpoints | PASS, visual acceptance pending | Full-resolution checkpoint files plus contact sheets; narrow 320px and CTA captures |
| Native scroll / touch / reverse / reload / resize | PASS | Chromium desktop and phone emulation; Firefox/WebKit desktop; three inapplicable touch skips |
| Reduced motion / freeze / pause / context loss / denied WebGL | PASS | Browser suite; no extra idle GPU draws; static procedural fallback and complete content |
| Automated accessibility and keyboard | PASS | axe WCAG A/AA rules on PL/EN and skip link; 37 full-suite browser passes plus four targeted lifecycle passes across four projects |
| Full build / model / public budgets / Worker / privacy / API / predeploy | PASS | Build and verification logs; 5 V6 and 4 preserved V5 model tests |
| Native laptop GPU | VERIFIED, pacing risk remains | Apple M1 / ANGLE Metal; profile records CPU submit and frame intervals, not GPU completion or total VRAM |
| Physical phone GPU / heat / battery | NOT VERIFIED | Desktop emulation only; do not equate it with an actual handset |
| Manual VoiceOver/NVDA / full WCAG conformance | NOT VERIFIED | Automated audit and keyboard checks have narrower scope |
| External independent creative sign-off | NOT VERIFIED | Screenshot-only self-critique was separate from source inspection; no external reviewer claimed |
| Owner premium-art-direction acceptance | PENDING REVIEW | Small-scale metal can read flat; mobile has quiet reading intervals; local masking is visible during some transitions |
| Merge / staging / production / hosted preview deploy | NOT PERFORMED | Local demo only. Existing V3/V4/V5 and release environments preserved |

## Test execution conditions

Initial two-worker run overlapped additional active scenes and yielded five 30-second timeouts; it is retained as `v6-tests.log`. Sequential recheck with a 90-second ceiling passed all applicable cases (`v6-accepted.log`). No failing assertion was hidden or removed. The first sandboxed build could not finish a child-process privacy check; the local authorized recheck (`build-accepted.log`) exited successfully.

Local Chromium is installed Google Chrome. Firefox revision 1538 and WebKit revision 2336 were explicitly selected using an ignored local config because the lockfile-requested revisions were not installed. CI installs lockfile-matched browsers; local results do not establish CI success. No CI or branch protection was weakened.

## Visual critique after three cycles

The selected spine has the strongest hierarchy: a dense shared central interface, unequal upper and lower limbs, a deep left aperture and sparse, thin cross-links. Mesh has more depth but a less readable backbone. Cantilever is too horizontal for the intended emergence narrative. All three remain accessible in diagnostics.

Medium residuals: at phone scale, steel highlights flatten and the thin connectors are less legible; repeated rectangular portals remain apparent; mobile reading windows intentionally reduce geometry visibility and produce quiet intervals. No fourth morphology redesign was attempted after the repository's three-cycle limit. Owner review should decide whether the current balance warrants a further art-direction pass before any integration.


## Optical measurement method

`alpha-proof.json` reads the actual opaque canvas pixels synchronously with each frozen render, with reading windows disabled. This is distinct from the persistent-module position average used by the browser assertion. The latter stays essentially fixed; the pixel-area centroid can change as an unequal assembly grows.

The initial final-build readback showed peak-to-peak area-centroid travel of 1.08% viewport width / 3.53% height on desktop and 1.49% / 1.42% on mobile. Relative to the fixed projected module anchor, the largest displacement was approximately 2.56% viewport on desktop and 1.78% on mobile: within the provisional ±3% tolerance. Bounds expand and contract as the authored branches and dispersed field change; those bounds are not artificially normalized. Final evidence repeats this readback after the annotation-only correction.

Final screenshot review caught an annotation crossing the mobile department note even though the geometry mask test passed. The correction checks actual copy/UI rectangles, hides obstructed annotations/legend, and chooses a free vertical slot for the pause control. The final suite checks both pixel masking and UI collision at all eleven native-scroll checkpoints. This was a reading correction within the third morphology cycle, not a fourth form redesign.

Final native desktop profile: median 17.2 ms, P95 33.8 ms and two observed long tasks; final phone emulation median 16.7 ms / P95 18.0 ms. Earlier desktop P95 was 17.8 ms. Both runs are retained rather than selecting the better result. This variability warrants further hardware/frame-pacing review before production integration. Selected public/V3/V4/V5 Chromium regressions: 13 PASS, one expected skip; full release CI remains separate.

## Final lifecycle and recording verification

A real persisted back/forward-cache restoration failure was reproduced before correction (`bfcache-before.log`). The pageshow restore handler now survives pagehide cleanup. Targeted checks passed on Chromium desktop/mobile, Firefox and WebKit (`bfcache-after.log`, `bfcache-cross.log`); the full production-canonical rebuild passed afterward. Total V6 browser result: 41 PASS, three expected skips across the recorded runs. No rendering/model/style/content change followed the full visual sweep.

The first video path produced an empty file, caught by media validation. The replacement captures actual Chrome CDP frames and encodes their timestamps with ffmpeg. Final MP4: 1,387 frames, 26.48 seconds, 1280×800; full ffmpeg decode passed and motion metadata contains no runtime/frame errors. Final desktop/mobile images were recaptured against the final application. Earlier failed recording logs remain for provenance.
