# Design System

## Tokens
- **Ink** `#0B0D0F` — primary background.
- **Paper** `#F2EEE6` — warm light surface.
- **Text on dark** `#F2EEE6`; muted `#B4BBC2` / strong muted `#C9CFD5`.
- **Text on paper** `#111417`; muted `#4B535B`.
- **Signal** `#7F9CFF` — selection/accent.
- **Focus** `#C8FF8E` — dedicated high-contrast focus indicator.
- **Spacing** — fluid `--pad` and `--section` with a restrained token set.

All primary text token pairs exceed WCAG AA contrast for normal text; focus is intentionally much stronger than the minimum.

## Grid
Maximum width 1440px, four-column blueprint background and two-column narrative compositions. At 960px the information architecture reflows; at 620px the page becomes a mobile-first single-column composition. The target includes 320 CSS px without horizontal page scrolling.

## Type hierarchy
- H1: `clamp(46px, 6.2vw, 100px)`.
- H2: `clamp(38px, 5vw, 74px)`.
- Lead: 18–23px.
- Body: 14–18px.
- Labels: minimum 11–12px where used as supporting text.

## Components
Sticky header, desktop navigation, native `details/summary` mobile navigation, primary/quiet buttons, page hero, section label, OAF step, principle, timeline row, focus row and footer. Cards are not the default content container.

## Interaction and accessibility states
- Interactive targets: practical minimum 44px height.
- Focus: 3px `--focus` with 4px offset.
- Hover: subtle and never the only indication of interactivity.
- Reduced motion: smooth scrolling and transitions are disabled with `prefers-reduced-motion`.
- Increased contrast: stronger muted/line tokens and removal of decorative background grid with `prefers-contrast: more`.
- Mobile navigation uses native semantics and requires no client JavaScript.
