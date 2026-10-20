# Living Architecture V6.2 — The Emergent Group

Status: implementation in progress, isolated experiment; no merge or release authorization.

## Creative direction

Dependency without uniformity. One asymmetrical assembly, with a connected spine, unequal open limbs and deep apertures. Hundreds of identifiable machined elements retain their identity through people → teams → departments → organization → group. Strong relationships share broad interfaces; moderate relationships use shorter bridges; loose relationships cross deliberate voids on sparse thin members. Illustrative model, never claimed to represent a real organization.

Reference pixel analysis: A uses tall dark planes and broad cinematic silver light; B relies on recessed black faces, varied block sizes and fine bright bevels; C demonstrates precise planar highlights with nearly black side faces. Approved screenshots 01/02/03 establish graphite portals, exposed neutral edges, negative space, restrained serif editorial typography and physical shadow depth. None is redistributed. Avoid V4's rigid scene mechanics and V5's soft lamellae.

## Experience architecture

Three rendered final studies: **spine** (unequal limbs along a common interface), **mesh** (two open paths with cross-links), **cantilever** (long offset lateral wings). Select from real renders before final integration. All are open, not alternative cube proposals. The same graph supplies membership and all five poses; no scene swaps. Natural semantic bilingual document; a full-viewport persistent scene; fixed camera and transform in visitor and diagnostic mode. Separate macro and micro clocks. Debug controls expose every source of time and state.

## Design system

Charcoal #090c10, off-white #ece9e2, muted silver #a5afb7. Machined graphite/steel, tiny bevels, studio-card reflections and contact shadows. Amber = initiative, silver-blue = cross-team bridge, white = decision/interface response. One quiet annotation. No bloom, random particles or generated/reference-image assets. Desktop side reading space and full-viewport sculpture; mobile has a dedicated upper reading zone and lower sculpture composition. Controls use native inputs and visible focus.

## Implementation plan and base

Verified remote V5 d5df971eefdbc3126e3a83e68f4575d682d2c94f includes verified V4 a9396831cb2b0b8f4e5b92ad9e68149f774a3937; selected to preserve V3/V4/V5 and their tests without duplicating dependencies. New branch feature/living-architecture-v6. New route and engine only. Existing Three.js 0.186.1 / GSAP 3.15.0 suffice; no dependencies added. Shared rounded geometry and instancing; procedural environment; graph-based connection members. Keep public budgets unchanged, add a separately charged V6 reachability scope and the same 240 KiB lab cap. Test deterministic states, continuity, coupling geometry, live micro response, signals, fallback/lifecycle, accessibility, noindex and prior-route regressions. Capture candidates, 11 fixed checkpoints, final clock samples, desktop/mobile editorial and timing evidence. At most three integrated implementation/visual QA cycles under AGENTS.md.

## Rendered alternatives and selection

Candidate images are actual WebGL renders of different team-center/depth topologies with identical persistent identities. **Spine selected**: a central shared interface carries dense close relationships; unequal lateral and lower limbs preserve apertures and long sparse dependencies. Mesh had more depth but weaker visual hierarchy and an ambiguous optical backbone. Cantilever flattened into a horizontal band and weakened the distinction between integration and dispersal. Alternatives remain available in debug only, not visitor-facing variants.

## Runtime contract

350 stable module IDs → 18 teams (10–32 members) → five departments → three illustrative organizations → one group. Twenty directed dependencies include three authored cross-boundary links. The membership graph is illustrative; no real organizational or professional claims. Strong/moderate/loose connectors have 0.22 / 0.105 / 0.042 world-unit cross-sections and different formation thresholds. Orthogonal bridges grow continuously; no opacity scene swaps. Shared geometry and two InstancedMesh draws reuse all buffers; no per-frame remeshing.

Each five-scale pose is authored around the same weighted module-mass anchor before runtime. The renderer never translates, rotates, recenters or rescales the global sculpture with progress. An orthographic camera stays fixed within each viewport; the phone uses its own field and DPR cap. Local form, position, member extension and actual connector length change. Team-local formation is asynchronous. Micro offsets are separate, bounded, and limited in the final form to sliding panels/selected independent units; fixed structural seams remain stationary. A deterministic 18-second event schedule drives initiative, collaboration-interface expansion and decision-panel realignment, with staggered neighboring responses. Scroll also produces deterministic local signals. A pause button is available in the ordinary experience.

Normal document scroll controls a paused GSAP timeline through ScrollTrigger. No pins, wheel interception or essential-text fades. Local reading windows are computed from real copy bounds; a luminance mask reserves temporal editorial negative space without moving the object. Isolated diagnostic mode disables the windows, exposing complete geometry. This intentionally occludes some geometry in visitor transitions rather than claiming raw projected bounding boxes never intersect text. Masks are a composition treatment, not topology evidence. The window mask does not affect the fixed-camera proof. Reduced motion shows a complete static final architecture; no scroll or idle GPU updates. Paused/frozen/reduced/hidden scenes stop the animation clock. Context loss and partial construction failure release resources and retain semantic content plus a procedural SVG fallback. There are no external graphics assets, fonts or new packages.

## Three implementation / visual-QA cycles

| Cycle | Screenshot-only finding | Severity / impact | Correction |
|---|---|---|---|
| 1 | Dark metal front faces; disconnected toy-like tiles; late states too similar; phone copy intersects structure | High: material credibility, dependency legibility and reading fail | Add frontal studio reflections, author shared local frame members, center each authored pose, distinguish departmental/organizational growth |
| 2 | Common backbone and negative space readable, but repeated portal grammar; phone transitions remain unsafe | High reading / Medium form: visual language too repetitive | Unequal authored extents, dense central panels, low terraces, depth ribs and incomplete peripheral frames; local reading windows; larger phone legend; contrast correction |
| 3 | Richer open spine with unequal limbs; debug confirms continuous geometry. Screenshot review caught an ineffective alpha-based mask | High correctness defect in intended reading protection | Set explicit luminance mode; pixel-compare copy with geometry visible/hidden; hide/relocate legend/annotation/pause control during copy crossings. Recheck the same third-cycle checkpoints, without a fourth form redesign |

This is an author-run screenshot-only critique performed separately from source review. An external independent creative reviewer has **not** signed off; no independent-review claim or owner visual acceptance is implied. Residual visual risk: studio highlights can read as flat silver at small scale, and the rectangular module grammar remains intentionally visible. The mobile composition reserves a large quiet upper interval between some chapters; temporal masks may reduce visible assembly during transitions. These are owner-review considerations, not evidence of full premium art-direction acceptance.

## References actually inspected

All six supplied PNGs were opened as pixels. They remain outside the tracked website and are not redistributed. Live Morphos was observed in a browser at the face, dispersed field, skull ending and reverse skeletal state; continuous reconfiguration and editorial integration were visible. Étude was observed at its pedestal hero and floating-object editorial section. This establishes observed behavior, not knowledge of either implementation. The optional Sci-fi Cube link failed retrieval (cache miss); it is not essential to the selected form because all six original references were accessible. No source code or assets from these external sites were copied.

## Reproduction / preview

```sh
npm ci --no-audit --no-fund
SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
npm run preview
```

Open http://127.0.0.1:4173/lab/living-architecture-v6 or /en/lab/living-architecture-v6. Diagnostic route: /en/lab/living-architecture-v6?debug=1&freeze=1&isolate=1. Controls include normalized progress, three topology candidates, explicit micro-time offset, freeze/resume, groups/dependencies, signals, bounds/centroid and render diagnostics. Camera/global transform are always fixed. Resume document scroll restores native progress. For candidate evidence, select the final progress and each topology. For local life, hold 100% and sample time 0,2,5,8 seconds.

```sh
npm run test:living-architecture-v6
V6_CAPTURE_OUTPUT=artifacts/living-architecture-v6/final npm run capture:living-architecture-v6
node scripts/living-architecture-v6-alpha-proof.mjs
node scripts/living-architecture-v6-profile.mjs
node scripts/living-architecture-v6-motion.mjs
```

Capture/profile scripts use installed system Chrome on macOS; set PLAYWRIGHT_CHROMIUM_EXECUTABLE for another Chromium. Profiling must run separately from browser suites and recordings. The lab is noindex in both languages and excluded from the existing sitemap filter. V6 uses an independently charged reachability scope and the existing 240 KiB gzip experimental JS cap; every public threshold remains unchanged. Unreferenced or publicly shared assets remain charged to public budgets.

The repository's existing draft stack is V4 #81 → V5 #86. V6 is stacked on V5 for an isolated review diff. This does not authorize merging any prototype or bypassing the feature→main→staging→production release path. No staging/production/preview deployment is performed; the demo is the real local browser preview. A hosted preview would require a separate deployment action.
