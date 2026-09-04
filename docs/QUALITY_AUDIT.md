# Quality + Pre-launch Audit

## Current architecture audit

| Area | Severity | Status | Impact / implementation |
|---|---|---|---|
| Astro SSG architecture | — | PASS | Static HTML, no client framework/runtime dependency. |
| PL/EN route parity | — | PASS | Five routes mirrored 1:1, language switch preserves context. |
| WCAG 2.2 AA engineering baseline | P0 | PASS by implementation | Semantic HTML, keyboard, focus, contrast tokens, reflow, reduced motion, target size. |
| Automated accessibility | P0 | PASS when CI green | Axe + Playwright across all localized routes and mobile/desktop. |
| Manual AT audit | P1 | FIX before public claim | VoiceOver + NVDA and zoom/reflow audit required before claiming formal conformance. |
| Authentic portrait | P1 | OPEN | Add only if a strong editorial portrait improves trust without weakening performance. |
| Case studies | P1 | OPEN | Publish 2–3 anonymized cases only after content approval. |
| Analytics | P2 | INTENTIONALLY OFF | No tracker until privacy/measurement decision. |
| Azure/public deployment | — | DISABLED | Future-ready blueprint remains outside active workflows. |

## Pre-launch

- Visual hierarchy/storytelling: PASS
- Localized PL/EN IA: PASS
- SEO/canonical/hreflang: PASS by configuration; final domain must be supplied at build
- Keyboard/focus semantics: PASS by implementation
- Reduced motion / responsive reflow: PASS by implementation
- Automated WCAG gate: must be green in CI
- Manual assistive technology audit: FIX before formal conformance claim
- Docker/Kubernetes configuration: PASS by configuration
- Production DNS/TLS: intentionally not configured
- Analytics: intentionally off
