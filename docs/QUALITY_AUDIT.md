# Quality Audit — editorial platform v3

## Creative direction

**PASS** — the site now behaves as an executive/intellectual platform rather than a personal portfolio or generic consulting site.

Primary visual language:
- warm paper base, cocoa and moss accents,
- editorial typography and rules,
- diagrams as information, not decoration,
- limited card use,
- no portrait on Home,
- no arbitrary section numbering,
- motion limited to subtle transform-based cues with reduced-motion fallback.

## Information architecture

**PASS** — primary logic is: problem → evidence → perspective → OAF → practice → author → contact.

Business effect: executive visitors can recognize relevance before being asked to care about OAF or the author.

## Home

**PASS** — portrait, role, credentials and detailed trajectory removed. Home is a landing page with nine narrative beats and clear paths deeper into the platform.

Potential refinement: visual review of hero line breaks at 1440–1920 px.

## Perspective

**PASS** — evidence appears before OAF; one featured essay is prioritized over a wall of equal cards; publishing contract is explicit.

**P2 FIX** — add claim-level references and fuller bibliographies to each essay as the research layer matures.

## OAF

**PASS** — organizational architecture is explicitly presented as an established field. OAF is an evolving synthesis, not an invention claim.

**PASS** — intellectual lineage precedes the proprietary synthesis.

**PASS** — model moves from definition → lineage → gap → model → dimensions → misfit → principles → boundaries → application.

**P2 FIX** — formalize decision objects, roles/owners, cadence and evidence taxonomy before calling OAF a mature methodology.

## OAF diagram

**PASS by design** — labels are independent semantic layout elements; SVG geometry is decorative underneath. No text is placed directly on crossing SVG paths.

Mobile fallback is linear rather than a compressed orbit.

## Practice

**PASS** — interface/problem logic appears before competency/toolbox logic. The page no longer resembles a consulting service catalogue.

**P1 HOLD** — do not add fabricated case studies. Publish only anonymized cases with safe scope and defendable outcomes.

## About

**PASS** — the professional portrait is concentrated here. Biography is structured as an evolution of problem scale: technology/execution → architecture/transformation → strategy/portfolio/PMO → executive synthesis.

Credentials sit below the argument and trajectory.

## Content graduation

**PASS** — each page has a distinct abstraction level:
- Home: executive recognition,
- Perspective: evidence and hypotheses,
- OAF: theory and model,
- Practice: diagnostic/application level,
- About: provenance and credibility,
- Contact: action.

No page should jump directly from a market statistic into implementation mechanics without an intermediate thesis/model.

## Content provenance

**PASS** — BCG and McKinsey statistics are source-linked and dated. MIT CISR, Galbraith, 7-S and fit/misfit are treated as external intellectual lineage.

**P2 FIX** — keep expanding primary/authoritative sources; avoid over-reliance on consulting benchmarks for the long-term research moat.

## Accessibility

Implementation preserves semantic headings, lists, figure captions, keyboard links, reduced-motion fallback and a linear mobile OAF representation.

**CI REQUIRED** — Astro/Playwright/axe must pass after the final commit.

**MANUAL FIX BEFORE FORMAL CLAIM** — VoiceOver/Safari, NVDA/Chrome or Firefox, keyboard-only and 200–400% zoom review remain required.

## SEO

Localized canonical paths remain:
- PL: /perspektywa, /oaf, /praktyka, /o-mnie, /kontakt
- EN: /en/perspective, /en/oaf, /en/practice, /en/about, /en/contact

JSON-LD now describes the property primarily as a WebSite with a linked Person author rather than presenting every page as a Person entity.

## Pre-launch checklist

- Value proposition: PASS
- Home as landing: PASS
- Perspective before OAF: PASS
- OAF provenance: PASS
- Theory → application graduation: PASS
- Portrait placement: PASS
- PL/EN route consistency: PASS
- Contact form architecture: PASS (production secrets still required for live delivery)
- Automated WCAG: CI REQUIRED
- Container/Trivy: CI REQUIRED
- Manual browser visual review: FIX before public launch
- Manual assistive-technology audit: FIX before formal WCAG claim
- Real anonymized case studies: HOLD until publishable evidence exists
