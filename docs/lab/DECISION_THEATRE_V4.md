# Decision Theatre V4 — Black Architecture

Static art-direction spike, 2026-10-15. Route: `/lab/decision-theatre-v4`.
Branch: `feature/decision-theatre-v4-visual-spike`, based on V3 `68cb883f145834b0486c9c66d6248d8948995dbe`.

**Status: static visual review; owner acceptance pending. No motion sequence, merge or deployment.**
The production homepage, V3 scene and original production performance limits are preserved. This is an English look-development desk, not a localized website release.

## Reference analysis and provenance

The owner supplied `decision-theatre-v4-references.zip`. All three actual images were inspected, rather than relying on their descriptions. The archive's README identifies them as reference material, not licensed production assets. They are not included in the site or redistributed in this branch.

| Reference | Observed mechanism | Original interpretation |
| --- | --- | --- |
| A — Architectural Monoliths, 640×362 | Monumental vertical proportions, low architectural view, long directional shadows, silver faces interrupted by dark reflection bands, reflected floor depth | Tall apertured volumes, dark architectural enclosure, directed key and restrained planar floor reflection |
| B — Black Modular Cubes, 2048×1556 | Closely layered black masses, fine bevel highlights, broad low-contrast gradients, shadowed gaps and a consistent finish | Shared graphite material family, machined keys, varying depth and proportions; no pile of repeated cubes |
| C — Metallic Macro Geometry, 1024×1024 | Close oblique framing, smooth broad specular transitions, precise edges and heavy black side faces | Separate detail camera, bevelled extrusions, satin/graphite/polished finishes with subtle roughness variation |

SHA-256 provenance:

```text
A 6ebd1e7fba15d641537c5d52558fc5fd3347b80fcfc72e43924cbcf877aa2e9d
B 43067e8026df4cafac2329785abbe2c99df20b599cfa6402e22e20a9713cf216
C 324aaf151bfc2844224a9d5a88ebea235d4e1e1c532560232c1519df92debca5
```

The supplied Unusually `images.openai.com` URL returned HTTP 403 under the cloud proxy. No pixel-level comparison with that unavailable image is claimed. The three attached images are the primary reference evidence. Scroll Craft's narrative/hero-depth/peak/visual-verification principles inform the review; no Scroll Craft runtime is introduced.

## Two directions, one physical system

Both directions use the **same six named objects**, materials, enclosure and renderer. The poses change; objects are never replaced with unrelated scenes or images.

| Direction | Composition | Critical judgment |
| --- | --- | --- |
| **Incision — selected** | Three standing apertured volumes, two dense machined keys and one structural plane. Fragmented depth resolves into a shared opening. Low oblique camera and full-width environmental plate. | Stronger monumentality, negative space and legible argument. The opening creates an original motif beyond a cube assembly. Best starting point for owner review. |
| Compression — comparison | The same apertures turn horizontal and become an offset layered assembly, held against vertical keys. Higher, tighter camera. | Stronger macro weight and relation to B/C, but darker face detail and denser silhouette weaken the executive hierarchy. Retained for comparison rather than selected for motion. |

The Transformation view deliberately uses a close upper-edge crop of the tallest portal; review that framing before turning it into a moving shot. The endpoint views retain the complete subject silhouette.

The selected three keyframes are [Complexity](decision-theatre-v4-evidence/incision-complexity-studio.webp), [Transformation](decision-theatre-v4-evidence/incision-transformation-studio.webp), and [Coherence](decision-theatre-v4-evidence/incision-coherence-studio.webp). [Contact sheet](decision-theatre-v4-evidence/contact-sheet.webp) includes both candidates, lighting comparison, detail and desktop/mobile compositions.

- **A / Complexity:** related but differently oriented portals; displaced keys create controlled overlaps and unresolved sight lines.
- **B / Transformation:** a closer, lower perspective and converging poses reveal the emerging shared opening. This is a static intermediate pose, not evidence of animation continuity.
- **C / Coherence:** portals share an axis, keys flank the opening and the decision plane resolves across the system.

## Material, lighting and camera specification

Original bevelled extruded portal shells have four-segment machined edge bevels and subtly rounded aperture corners. Keys, structural plane and plinth use rounded boxes. Geometry is authored in source; no external models, HDRIs or image textures ship.

Metalness is 1 for the subject. Graphite roughness 0.28, satin 0.26, cut metal 0.17 and polished metal 0.15 distinguish surfaces without unrelated colors. A seeded 256×64 procedural roughness map has linear/mipmap filtering and restrained grain. ACES filmic tone mapping, sRGB output and exposure 1.25 establish the common response.

A warm directional key casts shadows at 1536²; a cool rim separates dark faces. The studio treatment adds five luminous cards baked into a half-float PMREM environment and a low-opacity 768² planar floor reflection. The cards are lighting geometry, not visible neon strips. The background is a near-black enclosure with structural fins. No bloom, SSAO or depth-of-field pass: clear edges and readable relationships matter more here, and the reflection adds a measurable extra scene pass. Raster shadowing provides contact; this is not path tracing or baked global illumination.

Desktop uses a 34° lens with a horizontal lens shift to protect editorial negative space. Mobile deliberately pulls back and places the object below the title. Detail mode uses a 31° lens and a closer oblique angle. Pixel ratio is capped at 1.5 desktop / 1.25 phone. Rendering happens on study selection, resize or visibility restoration; there is no animation loop.

## Actual visual review

Three implementation/render reviews were performed within the repository's autonomous iteration limit:

1. Initial PBR setup: black faces read as outline drawings; roughness filtering produced obvious floor stepping. Rejected.
2. Broader reflection cards, refined finishes and filtered grain restored face gradients; floor texture removed. Incision selected over Compression from actual rendered images.
3. Reduced environment response on the wall, refined key intensity, wider mobile camera and SVG link arrows corrected background balance, phone cropping and platform-dependent arrow glyphs.

Final review is based on real Chromium canvas exports and page screenshots, not mockups or generated images. The WebP evidence preserves the full-resolution PNG pixels losslessly; original PNGs and the capture JSON also remain in ignored `artifacts/decision-theatre-v4/`. The capture script redraws the actual WebGL frame immediately before canvas export. Editorial page screenshots are separate, so typography cannot disguise material quality.

### Creative Director audit

| Criterion | Assessment |
| --- | --- |
| Spatial authorship | Clear improvement over V3's green modular diagram. Apertures, standing masses and shared axis establish a coherent sculptural language. |
| Material response | Reflected light now crosses broad faces; bevels and brushed variation are visible. More credible than flat primitives. Still less rich than A/C's photographic reflection gradients. |
| Lighting/depth | Directed shadows, negative space and floor reflection establish depth. The enclosure remains simpler and the contact light less nuanced than reference A. |
| Macro finish | Precision edges and finish variation are present. Compression retains near-black side faces and lacks some of C's subtle grazing-light detail. |
| Narrative | A/B/C are related and resolved by the same object identities. Static pose reversibility is verified; interpolation, collisions during motion and emotional pacing remain untested. |
| Typography/mobile | Quiet editorial hierarchy and explicit review controls. Mobile preserves the geometry and title separation, but this remains a lookdev desk rather than finished executive storytelling. |

**Recommendation:** select Incision for owner review. Do not authorize full animation on test results alone. The static scene is a substantial art-direction change, but parity with the reference images and the requested premium quality gate are not asserted. Owner acceptance is pending. A subsequent approved pass should focus on more nuanced grazing reflections/contact lighting before adding the motion sequence if those aspects remain below the owner's bar.

The owner's V4 brief §11E explicitly says: “If visual acceptance has not been obtained, preserve the static look-development output and report animation as awaiting approval.” This is the reason motion stops here; no additional setup approval is needed.

## Technical comparison and limitations

See [capture record](decision-theatre-v4-evidence/results.json) for exact per-mode values. Both approaches use the same shipped JavaScript; direct mode does not download a smaller bundle. Studio textures and the reflection target are allocated lazily, so fresh direct mode avoids them. Switching back to direct after studio keeps that cached allocation until disposal; the comparison uses separate fresh pages.

| Fresh-page observation | Direct | Studio |
| --- | --- | --- |
| Draw calls / triangles per measured render | 26 / 13,406 | 41 / 20,118 |
| Renderer-tracked geometries / textures | 11 / 4 | 17 / 6 |
| Four synchronized render samples | 0.9–1.4 ms | 2.4–3.4 ms |
| PMREM setup CPU time | 0 ms | 98.6 ms |
| Navigation until ready, including network-idle wait | 1.45 s | 6.35 s |

One fresh-page sample per mode is insufficient to characterize loading distributions; shader compilation and software rendering dominate this local comparison. There is no FPS or native-device claim.

The environment is 768×1024 RGBA half-float (6 MiB base color storage); reflection color is 768² RGBA half-float (4.5 MiB). Thus studio adds at least 10.5 MiB of color target storage, plus reflection depth, temporary PMREM work and driver overhead. This is an allocation estimate, **not measured VRAM**. Shared shadow targets, canvas buffers, geometry and roughness are additional in both approaches. Renderer memory counts are recorded as a second observable indicator.

Timings are four repeated render submissions with `gl.finish()` in cloud Chromium, at a 1600×approximately850 scene viewport and DPR 1. They are functional measurements, not a device performance forecast. Native GPU performance is **NOT VERIFIED**. SwiftShader is the functional WebGL backend. Phone screenshots emulate layout, not phone GPU speed or thermals. Studio has the stronger material response and an extra rendering pass; direct is retained as a comparison, not the chosen appearance.

V4 JavaScript is approximately **143.3 KiB gzip**, below a deliberately tighter 240 KiB experiment cap (owner provisional ceiling 500 KiB). Downloaded scene assets: **0 bytes**; generated GPU textures are accounted above, not called free memory. Existing production limits and the V3 240 KiB/1000 KiB limits remain unchanged. Asset-graph tests charge shared Three.js chunks to both experiments; public reuse is always charged to the original public budget. Unreachable files do not gain a lab exemption.

### Prioritized remaining work

1. **Acceptance gate:** owner review of Incision and the A/B/C evidence; animation awaits that decision.
2. **Visual refinement:** richer grazing-light gradients and contact shadow integration, particularly on dark side faces. No further autonomous visual iterations beyond the three recorded here.
3. **Performance:** native GPU, Safari/WebKit WebGL, real mobile memory/thermals and context restoration are not verified by the software-rendered Chromium captures. Context loss intentionally disposes the scene and exposes the semantic fallback; it does not attempt automatic GPU restoration.
4. **Motion:** no collision-free interpolation or scroll choreography is claimed. The three tested states establish identities and endpoints only.
5. **Product integration:** this noindex English experiment is not a localized homepage, contact redesign or production release.

## Reproduce locally

Use the repository's existing Node requirement (≥22.12) and pinned lockfile. No new dependency was needed for V4. From the existing checkout:

```bash
npm ci --no-audit --no-fund
ASTRO_TELEMETRY_DISABLED=1 SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
ASTRO_TELEMETRY_DISABLED=1 npm run preview
```

Open `/lab/decision-theatre-v4` on the preview server's port 4173. V3 remains `/lab/decision-theatre-v2`. Supported query examples: `?frame=coherence`, `?candidate=compression`, `?quality=direct`, `?detail=1`. Controls are immediate static poses.

With the preview running, reproduce the evidence/checks:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:decision-theatre-v4
XDG_CACHE_HOME=/workspace/.cache npm run capture:decision-theatre-v4
```

Omit the executable override for Playwright tests on machines using its installed Chromium. The capture script defaults to `/usr/bin/chromium` and supports the same override. Raw outputs are ignored build artifacts; review evidence is committed under `decision-theatre-v4-evidence/`.

## Validation record

- Astro type check: 0 errors, 0 warnings, 0 hints; production-canonical build passed.
- Existing static/SEO/sitemap/internal-link, editorial, Worker, measurement/privacy, contact API and predeploy contracts passed.
- Artifact-scope unit tests: 2 passed; original public and V3 budgets passed; V4 143.3 KiB gzip passed.
- V4 browser suite: **12 passed** across desktop and mobile Chromium. Covers exact pixel reversal between poses, stable object identity, idle render count, fresh direct/studio allocation differences, axe WCAG 2.2 tags, keyboard/CTA, reduced motion, context loss and no JavaScript. First run hit 30-second timeouts during concurrent software screenshots; rerun with 60/120-second allowances passed with assertions unchanged.
- Captures: **12**, plus contact sheet; zero collected capture errors. All 13 committed evidence images verified by decoded RGBA equality against original PNGs; [manifest](decision-theatre-v4-evidence/manifest.json).
- V3 scene, production homepage source and lockfile diff against the V3 base: empty.
- Existing public/V3 desktop/mobile Chromium regression: **269 passed, 1 expected skip** out of 270 (3.9 minutes). The skipped desktop case is the existing mobile-navigation-only smoke test; no tests were disabled for V4.
- Final rebuilt-source context-loss checks: **2 passed**. `git diff --check` and capture-script syntax validation passed.
- Firefox/WebKit browser suites and native GPU performance were not run in this spike. CI retains the existing cross-browser release checks; V4's new CI check explicitly uses desktop/mobile Chromium.
