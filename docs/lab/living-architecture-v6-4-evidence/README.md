# V6.4 browser evidence

Application commit: `903119698c1ccbb3b327abc0daf333d757d393a5`. Captured from the built local preview on 2026-10-20. Reproduction commands and limitations: [implementation notes](../LIVING_ARCHITECTURE_V6_4.md). Subsequent documentation/evidence commits preserve application source.

- [Actual 41.64-second MP4](demo.mp4): native forward/reverse scrolling, phase events continuing at rest and an explicit rear inspection. 911 Chrome CDP frames; H.264 1280×800, 3,705,308 bytes. Zero runtime/frame errors, full decode passed. [Decoded frame strip](recording-strip.jpg), [capture metadata](motion.json).
- [Eleven frozen assembly checkpoints](assembly.webp): one fixed camera, individual modules move directly into one target volume.
- [Four sides](four-sides.webp): complete front, sides, rear and visible inner cores; no two-plane facade shortcut.
- [Desktop narrative sweep](desktop-sheet.webp), [phone narrative sweep](mobile-sheet.webp), [320px start](narrow.webp), [reduced motion](reduced.webp).
- [Final desktop](desktop-100.webp), [final phone](mobile-100.webp), [initial chaos](desktop-0.webp), [middle phase](desktop-50.webp).
- [Captured measurements](captures.json): 11 frozen assembly poses, four yaw views, 11 native scroll points per viewport; no runtime errors.
- [Separate native profile](profile.json): Chrome / ANGLE Metal / M1. CPU update p95 6.0ms desktop, 3.2ms phone emulation; zero draws after pause. Emulation is not a phone hardware measurement. Profiling ran without concurrent browser tests/capture/recording.
Log content is preserved; trailing line whitespace is normalized for repository hygiene.

- [Full build log](build.log), [new model/browser checks](tests.log), [preserved V6.3 regression](regression.log).
- [SHA-256 evidence manifest](manifest.json).

Three visual iterations were inspected. Geometry and event logic are authored, illustrative interpretations of the owner's OAF narrative. This remains a reviewable prototype; material visual acceptance and any release promotion require the owner's decision. No merge or deployment occurred.
