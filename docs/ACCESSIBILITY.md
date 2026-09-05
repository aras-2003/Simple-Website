# Accessibility · WCAG 2.2 AA target

## Conformance target

The implementation target is WCAG 2.2 Level AA across Polish and English routes, article pages, responsive variations and the contact workflow.

A formal public conformance claim should be made only after final production content, domain, third-party integrations and a manual assistive-technology audit are complete. Automated tooling is a release gate, not proof of conformance.

## Implemented controls

- Correct page language (`pl` / `en`) and language-of-parts markers where material.
- Semantic header, labelled navigation, main, article/section structures and footer.
- One H1 per route with structured heading hierarchy.
- Keyboard skip link moving focus to main content.
- High-visibility `:focus-visible` states.
- Native `details/summary` mobile navigation without focus traps.
- Practical interactive target height of at least 44px in normal layouts.
- Responsive reflow down to 320 CSS px without intended horizontal page scrolling.
- No essential meaning conveyed by color alone.
- `prefers-reduced-motion` and `prefers-contrast` fallbacks.
- Contact form labels, native field types, required-state semantics, clear hints, live status region and keyboard-operable submission.
- Form errors retain native browser validity semantics; success/failure feedback does not rely on color alone.
- External new-tab links include explanatory screen-reader text.
- Canonical and hreflang metadata remain language-consistent, including article routes.

## Automated gate

Playwright + axe scans the full route inventory, including the four PL/EN article pairs, contact and privacy routes. Each route is checked for WCAG A/AA rules, keyboard-first entry and 320px horizontal overflow. Static validation separately checks language, metadata, H1 count, landmarks and alternate-language links. The contact API has its own integration test for valid, invalid, bot and missing-origin requests.

The browser gate also exercises Chromium, Firefox and WebKit and uploads final visual captures. These checks reduce regression risk but do not simulate how a real screen-reader user experiences the final production environment.

## Manual release audit still required

Record PASS/FIX against the final production build for:

1. Keyboard-only navigation at 200% and 400% zoom: skip link, focus visibility, reading/focus order, no traps and full contact completion.
2. VoiceOver + Safari on macOS/iOS: landmarks, heading outline, links, images, PL/EN language, contact labels/errors/live status.
3. NVDA + Firefox or Chrome on Windows: landmark/heading navigation, link purpose, form descriptions/errors and live-region submission feedback.
4. Contact form completion, native errors, success/failure recovery and screen-reader announcements.
5. Contrast and focus verification against the final deployed assets, including high-contrast/forced-color behavior where available.
6. Reflow at 320 CSS px, 200–400% zoom and large-text settings with no loss of content or functionality.
7. Reduced-motion mode with no non-essential movement required for comprehension or interaction.
8. Link purpose, language-of-parts and reading order review of final copy.
9. Privacy wording and any future analytics/consent layer require separate release review.

The step-by-step route coverage and launch acceptance table are maintained in `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.
