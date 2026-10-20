# V6.3 evidence

See [the implementation and review report](../LIVING_ARCHITECTURE_V6_3.md). All images are actual local browser output, not generated illustrations. Reference JPGs are not included. V6.2 evidence remains in its original sibling directory.

- `iteration-1/`: two initial frames only; automation then failed on hidden controls. Do not interpret this as a full checkpoint run.
- `iteration-2/` and `iteration-3/`: six-frame visual critiques with source diff and measurements in `results.json`. These precede final functional tracking/lifecycle fixes.
- `final/`: final source renders, eleven frozen poses, desktop/mobile scroll checkpoints, no-signal architecture, tracked event start/middle/end, camera yaw and mobile/fallback states. `results.json` records the exact source revision and runtime errors.
- `verification/`: accepted and failed checks retained. A log named `browser.log` is an initial failure; `browser-accepted.log` is its successful full rerun. Do not infer success from a file name alone; read its conclusion. Published logs normalize trailing whitespace only; original local logs remain in `artifacts/living-architecture-v6-3/verification`.
- `profile.json`: CPU update/submission timings and native renderer details; excludes GPU completion and physical-phone behavior.
- `alpha.json`: actual alpha silhouette measurements, separate from the projected persistent-module mass anchor.
- `recording/`: real Chrome screencast with timestamp-derived frames, including idle life, reversal, native document scroll and a tracked editorial event. This is capture evidence, not a frame-rate benchmark.
- `manifest.json`: checksums and exact source provenance. Its own hash is intentionally excluded.

No release or owner visual acceptance is established by these artifacts. The model is illustrative, not a representation of an actual employer or organization.
