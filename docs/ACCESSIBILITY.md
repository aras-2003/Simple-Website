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

## Manual release audit still required

1. Keyboard-only navigation at 200% and 400% zoom.
2. VoiceOver + Safari on macOS/iOS.
3. NVDA + Firefox or Chrome on Windows.
4. Contact form completion, native errors, success/failure recovery and screen-reader announcements.
5. Contrast verification against final assets and any future embeds.
6. Reflow at 320 CSS px and large-text settings.
7. Link purpose, language-of-parts and reading order review of final copy.
8. Privacy wording and any future analytics/consent layer need separate release review.
