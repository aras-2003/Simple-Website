# Motion System — authoring, runtime and quality contract

## Purpose

Motion is part of the product language of arkadiuszkamrowski.com. It should communicate systems thinking, decision flow, transformation, alignment and causality. It is not a decorative layer added after layout.

This document defines which tool to use for which motion problem and how visual exploration should reach production without introducing a second site builder.

## Tool roles

### Figma — composition before motion

Use Figma when the unresolved problem is primarily:
- hierarchy;
- scale;
- layout;
- spatial composition;
- typography;
- component/system structure;
- visual states before/after a transition.

Do not use Figma as the final authority for complex timing or scroll choreography. It is the composition and state-design surface.

### Theatre.js — preferred visual motion authoring

Use Theatre.js when a concept requires high-fidelity sequencing that would be inefficient to tune as numbers in source code.

Good fits:
- cinematic hero choreography;
- camera/object sequencing;
- layered transforms;
- coordinated HTML/SVG/Three.js motion;
- timing/easing exploration;
- multi-step system transformations;
- motion studies for Decision Theatre / System scenes.

Development model:
- `@theatre/studio` is a development/design tool only;
- authored state is exported/committed as project data;
- production must not ship the Studio editor;
- runtime usage should be limited to the properties/sequences that materially need authored keyframes.

Theatre.js is not mandatory for simple transitions. Native CSS remains the default for straightforward hover/focus/entrance states.

### GSAP — preferred production choreography runtime

Use GSAP when the production experience needs robust control over:
- scroll-linked animation;
- timelines;
- SVG drawing/morphing;
- text reveals;
- coordinated DOM transforms;
- pinning/progression;
- responsive/reduced-motion variants;
- state transitions that are too brittle in ad-hoc requestAnimationFrame code.

Preferred modules only when needed:
- ScrollTrigger for scroll choreography;
- Flip for state/layout transitions;
- SplitText for text choreography;
- MotionPath/DrawSVG/MorphSVG for diagram and system transitions.

Do not introduce GSAP merely for a fade or transform that clean CSS can express.

### Three.js — spatial scene engine, not a default dependency

Use Three.js only when the approved concept requires:
- real perspective/camera movement;
- true 3D geometry;
- lighting/material depth;
- object transformations that cannot be convincingly expressed with DOM/SVG/CSS.

A flat executive diagram does not become better by putting it in WebGL. Prefer DOM/SVG where semantic clarity and accessibility are stronger.

### Runway — rendered media, not interaction logic

Use Runway for:
- hero/background video plates;
- image/video assets;
- texture/material exploration;
- cinematic references;
- short ambient loops where a rendered asset is cheaper and more robust than realtime rendering.

Do not use pre-rendered video to fake an interaction whose state must respond to scroll, pointer, viewport or content.

### Rive / Spline

These are optional specialist tools, not default project dependencies.

Rive is appropriate for compact state-machine-driven vector interactions or highly polished reusable interactive illustrations. Production export requires a paid Rive plan, so do not choose it when Theatre.js/GSAP/SVG can meet the requirement without an additional recurring tool cost.

Spline is appropriate for rapid interactive 3D exploration. Its free web export is watermarked and self-hosted/code export capabilities are plan-gated, so it is not the default production path for this repository.

## Decision hierarchy

For each motion problem choose the first level that can achieve the approved experience:

1. CSS transitions / keyframes
2. SVG + browser APIs
3. GSAP
4. Theatre.js authoring + GSAP/core runtime
5. Three.js, optionally authored through Theatre.js

Do not escalate because a higher layer looks more impressive in isolation.

## Premium motion workflow

For significant motion-led work:

1. **Reference extraction** — use Firecrawl on approved reference sites and extract mechanisms: camera language, transition type, pacing, layering, scroll relationship and interaction response.
2. **Static composition** — resolve core frames/states in Figma when composition is not already clear.
3. **Motion prototype** — author the key sequence in Theatre.js or a small isolated browser prototype. Work with real typography, geometry and viewport constraints rather than a disconnected showreel.
4. **Owner evaluation** — judge whether the metaphor is immediately understandable and whether motion materially improves comprehension and distinction.
5. **Production implementation** — implement with CSS/SVG/GSAP and Three.js only where required. Keep Theatre Studio development-only.
6. **Browser QA** — inspect desktop and mobile in the real browser, including scroll speed variation, resize, touch, keyboard and `prefers-reduced-motion`.
7. **Performance QA** — measure long tasks, layout shifts, main-thread work, GPU-heavy idle behavior and payload. Remove complexity that does not survive the cost/benefit test.

## Motion quality bar

A premium sequence should have:
- a clear visual subject;
- continuity between states;
- disciplined easing;
- controlled acceleration/deceleration;
- no arbitrary simultaneous motion;
- readable text at every important moment;
- intentional depth hierarchy;
- transitions that preserve orientation;
- responsive behavior designed separately for mobile;
- a coherent reduced-motion equivalent.

Avoid:
- unrelated entrance animations per section;
- excessive stagger;
- floating particles without semantic purpose;
- scroll hijacking;
- text hidden until JS animation completes;
- long pinned scenes that delay access to content;
- ornamental 3D with no narrative role;
- permanent GPU animation in the background without visible value.

## Decision Theatre / System recommendation

For the current visual direction, the preferred exploration stack is:

```text
Firecrawl references
        ↓
Figma key states
        ↓
Theatre.js motion study
        ↓
GSAP ScrollTrigger / SVG / DOM
        ↓
Three.js only for approved spatial objects/camera
        ↓
Astro production
```

The goal is not to reproduce Auralis, House, Vesper or other references. Extract their motion grammar, then express Arkadiusz Kamrowski's narrative through simpler geometry and clearer executive metaphors.

## Dependency gate

Before adding GSAP, Theatre.js or Three.js to the application dependency graph, record:
- the approved visual behavior;
- why the current stack is insufficient;
- expected production bundle/runtime impact;
- mobile/reduced-motion fallback;
- how the dependency will be tested and removed if the concept is rejected.

Prototype dependencies may live on an isolated feature branch before approval. Do not merge experimental graphics dependencies to `main` solely because a prototype uses them.
