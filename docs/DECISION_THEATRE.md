# Decision Theatre — prototype review

Branch: `feature/astra-decision-theatre`  
Base: `545d873` (main)  
Route: `/lab/decision-theatre`  
Scope: two sections, PL-first. No merge, staging promotion or production deployment.

## Creative direction

**Ślad decyzji / The trace of a decision.** The earlier Enterprise Decision Graph
made relationships legible but lacked a strong focal point. This prototype gives
the brand's TAK / NIE / KTO signature dimensional presence, then follows a single
decision through six organizational layers. The organization stays recognizable
when its interpretation changes.

Warm ivory, pine and one pale signal color retain the current brand. Georgia and
the system sans stack avoid new font requests. Curved fields suggest overlapping
responsibilities, rather than buildings, server racks or a dashboard. The broad
dark stage and editorial typography provide the main visual contrast.

## Experience

- Hero: thesis, short buyer-oriented explanation, direct **Opisz problem** CTA,
  in-page **Zobacz system** link, layered signature and continuous signal.
- System: three views of strategy/investment, ownership/decision rights, and
  technology/execution. Selected nodes, route, explanation and ordered text trace
  change together. Technology explicitly passes through deployment and adoption.
- Mobile: dedicated portrait topology, vertical controls, native wrapping copy;
  it does not scale down the desktop map.
- Motion: staggered entrance, path drawing, sparse flow signal, restrained depth
  transitions and hover. No automatic mode changes or scroll hijacking.
- Accessibility: native pressed buttons, arrow/Home/End navigation, live
  explanation, textual equivalent of each path, focus styles, motion pause,
  reduced-motion support and readable no-JS details.

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
| Cross-browser release validation | FIX before production | Chromium inspected locally; Firefox/WebKit matrix is included in CI |
| Real-device motion / Core Web Vitals | FIX before production | Local functional checks are not field CWV or physical iPhone/Safari validation |
| Deployment | PASS | Review branch only; no release or environment promotion |

### Findings resolved during visual review

- **P2 / readability:** hidden mobile line break joined two sentences. Added a
  real whitespace separator in the copy.
- **P2 / progressive rendering:** offscreen animation could pause an explanation
  in a faded frame. All text entrances now use translation at full opacity. This also prevents
  rapid keyboard navigation from freezing offscreen hero text at low contrast.
  CI includes an immediate-focus opacity regression check.
- **P2 / explanatory clarity:** the technology route originally looked too close
  to the strategy route. It now includes both data/platforms and deployment/adoption.

### Next review decision

Compare the standalone prototype with the existing home at desktop and mobile
sizes. Validate that TAK / NIE / KTO is understood within five seconds and that
each selected path helps explain a real executive decision. If approved, tune
the chosen visual language, complete EN, validate physical Safari/reduced motion,
and plan a separate home integration. Do not merge this lab as a home redesign.
