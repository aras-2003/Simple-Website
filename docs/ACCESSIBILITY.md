# Accessibility · WCAG 2.2 AA target

## Conformance target

The implementation target is WCAG 2.2 Level AA across every Polish and English route and responsive variation.

A formal public conformance claim should be made only after the final production content, domain, third-party integrations and a manual assistive-technology audit are complete. Automated tools cannot prove full WCAG conformance on their own.

## Implemented controls

- Correct page language: `lang=pl` and `lang=en`; English passages on Polish pages are marked where material.
- Semantic landmarks: header, labelled navigation, main and footer.
- Exactly one H1 per page and structured heading hierarchy.
- A keyboard skip link bypasses repeated navigation and moves focus to the main content.
- High-visibility `:focus-visible` state; focus target is not intentionally obscured by the sticky header.
- Native `details/summary` mobile navigation: keyboard-operable without custom JavaScript or focus traps.
- Interactive targets use at least 44px practical height, exceeding the WCAG 2.2 AA minimum target-size requirement in normal layouts.
- Responsive reflow down to 320 CSS px with no intended horizontal scrolling.
- No essential information conveyed by color alone.
- Text/background palette selected for AA contrast; high-contrast preference receives stronger tokens.
- `prefers-reduced-motion` disables smooth scrolling and transitions.
- No autoplay media, flashing content, drag-only controls, authentication, time limits or forms.
- External new-tab links include hidden explanatory text.
- Canonical and hreflang metadata is language-consistent.

## Automated gate

Playwright runs desktop and mobile Chromium against all 10 routes. `@axe-core/playwright` is configured for WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags. Static validation separately checks language, titles, descriptions, H1 count, landmarks, skip links and alternate-language metadata.

## Manual release audit still required

Before any public WCAG conformance claim:

1. Keyboard-only navigation at 200% and 400% zoom.
2. VoiceOver + Safari on macOS/iOS.
3. NVDA + Firefox or Chrome on Windows.
4. Contrast verification against final images/assets and any future embeds.
5. Reflow at 320 CSS px and large-text settings.
6. Link purpose, language-of-parts and reading order review of final copy.
7. Any future forms, media, consent/analytics or interactive OAF explorer must receive their own WCAG audit.
