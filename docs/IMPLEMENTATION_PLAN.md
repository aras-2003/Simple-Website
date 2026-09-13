> **Historical decision/source record.** Claims and instructions below describe an earlier checkpoint, not current branch, runtime or launch state. The refactor is merged. Current truth: [PRODUCT.md](PRODUCT.md), [PROOF_RELEASE.md](PROOF_RELEASE.md), [PROOF_SOURCES.md](PROOF_SOURCES.md).

# Implementation Plan

## 1. Existing code and assets — DONE

The stable Astro/Worker foundation is retained. No client application framework is added. Existing content, routes, security controls and publishing assets are reused where they remain valid.

## 2. Architecture and design tokens — DONE

- Astro 7 SSG + TypeScript.
- Typed PL/EN content and shared components.
- Cloudflare Worker for `/api/contact` and canonicalization paths.
- CSS variables/tokens and explicit stylesheet layers.
- Static Assets for the public frontend.

## 3. Executive experience architecture — DONE in code

The information architecture now separates buyer clarity from intellectual depth:

```text
Home
  → Advisory / Współpraca
  → OAF
  → Perspective
  → About
  → Contact
```

Home follows:

```text
executive tension
→ outcome
→ tangible outputs
→ proof
→ method
→ contact
```

OAF and Perspective remain deeper evidence/method layers rather than prerequisites for understanding the offer.

## 4. Visual storytelling — DONE in code

Added lightweight original visual components:

- `ExecutiveSystemMap` — Direction → Operating model → Architecture → Portfolio → Execution + feedback loop.
- `OutcomeBlueprint` — five tangible decision artifacts.
- trigger quadrants — recognizable executive situations.
- compressed case flow — friction → intervention/shift → management value.
- simplified OAF executive page with progressive disclosure.

The graphics are HTML/CSS, responsive, accessible by surrounding semantic copy and do not require a heavy chart/motion library.

## 5. Responsive layout — DONE baseline / live staging QA pending

Fluid typography/spacing and content-driven breakpoints support desktop, tablet and mobile. Multi-column diagrams rebuild into semantic linear stacks at narrow widths.

Automated browser tests check horizontal overflow. Manual live QA remains required at representative 320/390/768/1024/1440+ widths.

## 6. Content and localization — DONE redesign baseline

- PL/EN route parity retained.
- Home rewritten for CEO/CIO value clarity.
- `Praktyka` navigation reframed as `Współpraca / Advisory`.
- three engagement formats added: Diagnostic / Design / Advisory.
- tangible outputs made explicit.
- anonymized case studies retained without fabricated KPI or client identities.
- OAF remains an evolving synthesis with explicit provenance/boundaries.

Live staging tone/line-break review is still required before production.

## 7. Motion — DONE / intentionally restrained

No scroll hijacking, custom cursor or heavy animation library.

Current motion:

- subtle decision-flow line;
- small handoff/risk pulse;
- standard hover/focus transitions.

`prefers-reduced-motion` disables non-essential diagram animation/smooth behavior.

## 8. Accessibility / SEO / performance — DONE engineering baseline

- WCAG 2.2 A/AA automated audit.
- semantic landmarks and heading discipline.
- keyboard-native mobile navigation.
- visible focus and 44px practical target checks.
- PL/EN language metadata.
- canonical/hreflang/sitemap/robots/OG/structured data.
- CSP/security-header baseline.
- performance budget retained after redesign; obsolete CSS was removed instead of increasing the budget.

Manual VoiceOver/NVDA/zoom/forced-colors acceptance remains a production gate.

## 9. Testing — DONE by configuration

CI includes:

- `astro check` / build / static validation;
- executive narrative structure gates;
- performance budget;
- external reference check;
- Worker/contact runtime tests;
- Wrangler dry-run for preview/staging/production;
- automated WCAG audit;
- Chromium / Firefox / WebKit smoke matrix;
- desktop/mobile visual-audit captures;
- Release Policy promotion-path validation.

## 10. Deployment — STAGING LIVE / PRODUCTION GATED

Current model:

```text
short-lived branch → PR → main        no deploy
main → PR → staging                   automatic private staging deploy
staging → PR → production             release authority only
production → explicit manual deploy   public production
```

Staging is live on Cloudflare Workers, protected by Cloudflare Access and non-indexable.

Production Worker/public launch remains intentionally gated until:

- Resend/contact delivery is configured and tested;
- live staging content/visual/accessibility acceptance passes;
- production Worker/secrets/domain are prepared;
- public GO / NO-GO checklist is complete.

## 11. Current remaining work

### Before next staging promotion

- all PR CI green;
- merge executive redesign to `main`;
- explicit owner decision whether to promote now or wait for Resend.

### Before production

- Resend account/domain/DKIM/SPF/DMARC review;
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` per environment;
- real staging contact smoke;
- live executive 6s / 30s / 2min scan review;
- manual accessibility QA;
- production Worker/config/secrets;
- DNS/TLS/public smoke;
- monitoring + rollback readiness.
