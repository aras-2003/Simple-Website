# Decision Theatre — prototype review

Branch: `feature/astra-decision-theatre`  
Base: `545d873` (main)  
Route: `/lab/decision-theatre`  
Scope: two sections, PL-first. No merge, staging promotion or production deployment.

## Creative direction — 03 / Zobacz konsekwencję

The approved rectilinear direction is retained. This iteration makes the scene
interactive and much easier to read: **Cel → Właściciel → Wynik**. The six
organizational layers remain the underlying structure, grouped into three
plain-language stages. Only the active route is shown.

## Experience

- **Hero choices:** selecting TAK / NIE / KTO brings that solid through the other,
  now translucent layers and reveals a one-sentence consequence. The large native
  controls work with touch, keyboard and pointer. The decorative solids mirror
  the same actions for pointer users.
- **Three questions:** Co wybieramy? Kto odpowiada? Jak dowozimy? Each changes the
  same organization and its route. A short explanation appears above the scene.
- **Choose a stage:** Cel, Właściciel or Wynik highlights a pair of layers and
  explains its role in the current perspective. Changing perspective restores
  the full context.
- **Join / separate:** Połącz warstwy compresses the depth of the entire model,
  including its connectors. Transparent materials expose the overlaps. The action
  is reversible, with stable layout and no scroll manipulation.
- **Mobile:** the SVG cross-section has its own compact joined geometry; labels
  keep their size and are never squashed with the model. The phase controls sit
  above it.
- **Accessibility:** native pressed buttons, arrow/Home/End navigation in all
  three control groups, visible focus, live explanations, motion pause and
  reduced motion. Without JS the diagram remains static and readable.
- **Clarity:** inactive nodes and small point labels are hidden; the perspective
  text, simple stage labels and plain-language explanations carry the meaning.

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
| No JavaScript | PASS | Static initial system and explanations remain readable; unavailable controls disabled |
| Loading budget | PASS | Approximately 2.7 KiB lab JS, no new dependencies or font/image requests |
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

- **P2 / progressive enhancement:** without JS, continuous decorative motion had
  no in-page pause control. The server-rendered state now disables all animation;
  JS enables motion only once the controls are ready.
- **P2 / clarity:** explanatory text followed a dense map. The explanation now
  precedes a simplified route; selecting a stage provides one relevant detail.

### Next review decision

Compare the new rectilinear standalone prototype with the existing home at desktop and mobile
sizes. Validate that visitors can explain TAK / NIE / KTO and Cel / Właściciel / Wynik
within five seconds, then use the controls without instruction. Check that the
joined state helps explain interdependence. If approved, tune
the chosen visual language, complete EN, validate physical Safari/reduced motion,
and plan a separate home integration. Do not merge this lab as a home redesign.
