# Decision Theatre 04 — one organization, three perspectives

Branch: `feature/astra-decision-theatre`  
Route: `/lab/decision-theatre`  
Review only. Do not merge to main/staging or promote to production.

## Creative direction

Warm paper, editorial serif typography, charcoal modular solids, one pale-green
signal. The geometry represents organizational relationships, not buildings.
Hero communicates a concrete executive offer in Polish. The System uses the same
nine-module object in three configurations: aligned investment priorities,
separated teams with an accountable owner, and a connected execution path.
GetLayers Creative Director and Onyx Cubes are directional references, not copied
assets or code. Public reference pages were checked; their premium prompts were
not accessed. The attached screenshots supplied process guidance, not template
visuals. No claim of exact visual fidelity to those templates is intended.

## Experience and implementation

Only Hero and The System, with a minimal brand header/footer. The existing Astro
stack is preserved. No framework, animation dependency, webfont, image or WebGL
runtime was added. CSS 3D creates all six faces of each module. A native controller
interpolates transforms and recalculates signal endpoints during movement.

Desktop (at least 1000 × 740): a 310svh section holds a 100svh scene. Scrolling
changes geometry and narrative, with stable reading intervals. Native scrolling
is not intercepted. Buttons and arrow/Home/End keys also select perspectives.
Mobile and short viewports: compact manual perspectives, with controls before the
explanation on mobile. The same object changes on selection; no pinned scene.
Reduced motion: no pinning, continuous motion or transitions; direct state changes.
Pause preserves the desktop section height to avoid scroll jumps. Offscreen and
background decorative animations are suspended. No JavaScript: static sculpture,
initial explanation and expandable text for the remaining two perspectives.

## Review

```sh
npm ci
SITE_BASE_URL=https://arkadiuszkamrowski.com npm run build
npm run dev
# Open /lab/decision-theatre on the development server.
node scripts/export-decision-theatre.mjs
```

The exporter creates a self-contained HTML sample, with CSS/JS inline and contact
links pointing to the real website. It is not a hosted deployment.

## Quality and pre-launch audit — 2026-09-22

| Check | Result | Evidence / limit |
| --- | --- | --- |
| Astro diagnostics | PASS | 58 files, zero errors/warnings |
| Desktop/mobile interaction | PASS | 8 local Chromium tests across desktop and mobile contexts |
| Scroll narrative | PASS | Same nine elements reconfigure; text follows state; signal endpoints track geometry |
| Responsive object fit | PASS | All states at 320, 390, 768, 1024, 1440 and 1920 px; no horizontal overflow |
| Automated accessibility | PASS | axe WCAG A/AA checks, all three perspectives, desktop/mobile |
| Keyboard and pause | PASS | Native controls, visible focus, arrows/Home/End, all animation stopped on pause |
| Reduced motion / no JS | PASS | Static/direct states and all explanations available |
| Route isolation | PASS | Noindex, excluded from sitemap, no production-page lab script |
| Performance budget | PASS | Lab JS ~3.7 KiB raw, within explicit 4 KiB lab-only budget; production JS budget unchanged |
| Copy / visual review | PASS | Reviewed desktop hero, all system states, mobile full page; concise PL copy |
| Forms and analytics | PASS | No new data collection; CTA uses existing contact page |
| Physical Safari / field CWV | FIX before production | Not established by local Chromium checks |
| Hosting | NOT DEPLOYED | Feature branch and offline review artifact only |

Resolved findings: P2 clipping of expanded geometry at narrow widths (reduced
scene scale); P2 paused pseudo-element transitions (explicit pause reset);
P2 mobile controls below long content (moved above the narrative).

The prior 3 KiB lab script cap was increased to 4 KiB for the native scroll
controller and continuously attached 3D paths. No production-page budget changed.

Before home integration: validate whether unfamiliar executives understand the
three relationships without explanation; review on a physical iPhone/Safari;
complete EN copy. This is a prototype, not evidence of field Core Web Vitals.
