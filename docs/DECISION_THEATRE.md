# Decision Theatre — prototype review

Branch: `feature/astra-decision-theatre`  
Base: `545d873` (main)  
Route: `/lab/decision-theatre`  
Scope: two sections, PL-first. No merge, staging promotion or production deployment.

## Creative direction — 02 / Oś decyzji

The second direction follows the visual review: simple rectangular solids,
precise depth, translucent pine surfaces and light that connects the layers.
The organic ribbons and curved topology from the first version have been removed.
The visual impact now comes from material, perspective, occlusion and motion.

The hero presents TAK / NIE / KTO as three thin rectangular solids. Over a quiet
17-second cycle they separate and register onto a shared decision axis. Real CSS
3D transforms expose the front and side faces. Lighting stays consistent with
the material; the camera changes angle only slightly.

The dark System shows six organizational layers. Selecting a perspective moves
the same planes, adjusts the camera and redraws a rectilinear route through the
relevant decision points. A flat directory keeps layer names and selected nodes
readable independently of perspective. The map is a conceptual organization,
not a model of a building.

## Experience

- Hero: existing thesis and CTA logic, typographic hierarchy, three solids and
  a single axis connecting direction, focus and responsibility.
- System: strategy/investment, ownership/decision rights, technology/execution.
  Planes, signal path, selected nodes, directory and explanation change together.
- Mobile: 3D hero, dedicated SVG cross-section of straight rectangular prisms,
  vertical controls and a concise text trace. No scaled-down desktop system.
- Motion: staged entrance, 17-second alignment cycle, depth changes, path drawing,
  controlled signals and a restrained hover response. No scroll hijacking.
- Accessibility: keyboard navigation, visible focus, motion pause, reduced motion,
  native pressed buttons, text equivalents and a readable no-JS fallback.

## Implementation boundaries

The lab has a separate layout, stylesheet, script and content module. It does not
import the production header or analytics. Production page components and assets
are unchanged. The lab uses `noindex, nofollow` and is excluded from the sitemap.
The contact and advisory links retain their existing destinations.

`src/content/decision-theatre.ts` owns the view labels, explanations, nodes and
paths. The locale type currently supports **PL only**. Do not advertise an EN
prototype before its complete copy has been added.

The existing 8 KiB production JS budget remains in force. A separate 3 KiB lab
budget covers its isolated script; the budget test rejects references to that
bundle in non-lab HTML. No runtime dependencies were added.

## Screenshots

[Desktop](decision-theatre/desktop.png) · [Mobile](decision-theatre/mobile.png)

## Local review

```sh
npm ci
npm run dev
# Open /lab/decision-theatre on the URL printed by Astro.

SITE_BASE_URL=https://arkadiuszkamrowski.com npm run build
npm run test:browsers
```

The downloadable standalone review HTML embeds the compiled CSS and JS. It keeps
in-page navigation local and sends contact/advisory links to the existing site.
It is a review artifact, not a deployed production route.

## Quality audit — 2026-09-21

| Check | Result | Evidence / boundary |
| --- | --- | --- |
| Astro types and build | PASS | 58 source files; no diagnostics; complete static build |
| Existing pages | PASS | Static validation of 22 PL/EN routes; editorial and Worker gates |
| Responsive layout | PASS | 320, 390, 768, 1024, 1440 and 1920 px; no horizontal overflow |
| Accessible modes | PASS | All three modes, desktop and mobile; zero automated axe WCAG A/AA violations |
| Keyboard and focus | PASS | Arrow keys, Home/End, native activation; visible focus |
| Motion controls | PASS | Pause/resume, reduced motion, offscreen/background suspension |
| No JavaScript | PASS | Initial system and explanatory details remain readable; unavailable controls disabled |
| Loading budget | PASS | Approximately 1.7 KiB lab JS, no new dependencies or font/image requests |
| Prototype indexing | PASS | Noindex and sitemap exclusion |
| Forms / analytics | PASS | No new forms or analytics; existing CTA routes preserved |
| Cross-browser matrix | CI gate | Chromium, Firefox, WebKit and mobile Chromium; see the current PR checks for the latest result |
| Real-device motion / Core Web Vitals | FIX before production | Local functional checks are not field CWV or physical iPhone/Safari validation |
| Deployment | PASS | Review branch only; no release or environment promotion |

### Findings resolved during visual review

- **P2 / readability:** hidden mobile line break joined two sentences. Added a
  real whitespace separator in the copy.
- **P2 / progressive rendering:** offscreen animation could pause an explanation
  in a faded frame. All text entrances now use translation at full opacity. This also prevents
  rapid keyboard navigation from freezing offscreen hero text at low contrast.
  CI includes an immediate-focus opacity regression check.
- **P2 / spatial rendering:** clipped model corners and an offscreen material
  entrance could obscure the model. The scene now fits its bounds and system
  entrances preserve full material opacity. CI asserts this after immediate focus.
- **P2 / explanatory clarity:** the technology route originally looked too close
  to the strategy route. It now includes both data/platforms and deployment/adoption.

### Next review decision

Compare the new rectilinear standalone prototype with the existing home at desktop and mobile
sizes. Validate that TAK / NIE / KTO is understood within five seconds and that
each selected path helps explain a real executive decision. If approved, tune
the chosen visual language, complete EN, validate physical Safari/reduced motion,
and plan a separate home integration. Do not merge this lab as a home redesign.
