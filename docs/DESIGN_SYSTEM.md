# Design System

## Visual direction

**Quiet authority with strategic energy.** The system combines warm editorial minimalism with richer contemporary diagrams and motion. It should feel like a thoughtful executive publication rather than a SaaS dashboard or architecture repository.

## Core tokens

- **Paper** `#F4EEE5` — primary warm canvas.
- **Paper strong** `#FCF7EF` — elevated content surface.
- **Ink** `#1B1612` — deepest text / structural dark.
- **Chocolate** `#5C4437`, deep `#3F2F27` — warm depth and premium contrast.
- **Sage / forest** `#5F7255`, deep `#46543F` — strategic accent and diagram language.
- **Muted** `#655A52`, strong `#4C433D` — secondary text selected with AA margin.
- **Inverse text** `#F6F0E7` — text on chocolate/forest surfaces.
- **Focus** `#97B05B` — dedicated high-visibility keyboard focus.

Avoid decorative gradients without a compositional purpose. Current gradients combine chocolate/forest primarily to create depth in hero, OAF and CTA visual systems.

## Layout

Maximum content width: 1440px with fluid horizontal padding. Section spacing is deliberately tighter than the first design iteration; visual density comes from composed grids, diagrams and editorial cards rather than empty vertical space.

Breakpoints are content-driven. Tablet and mobile rebuild multi-column compositions instead of simply scaling desktop down. 320 CSS px is an explicit reflow test target.

## Type hierarchy

- H1: fluid editorial display, approximately 42–92px depending on viewport.
- H2: approximately 34–70px.
- Lead: 16–21px.
- Body: 14–19px depending on reading context.
- Labels / metadata: 10–12px, high enough contrast and used only as supporting hierarchy.
- Long-form notes use narrower reading measure and increased line-height.

The palette and spacing carry more brand character than font proliferation; the type system stays restrained.

## Component language

Primary components: sticky header, rounded primary/quiet buttons, hero OAF visualization, proof cards, editorial principle cards, OAF diagram, practice cards, note cards, article body, contact form, privacy cards and footer utility navigation.

Cards are used when they create a meaningful visual grouping or comparison. Long-form content remains editorial rather than being fragmented into cards.

## Motion

- Purposeful transforms and orbital/diagram motion only.
- No opacity animation on readable text; contrast must remain stable throughout transitions.
- No scroll hijacking, custom cursor or essential parallax.
- `prefers-reduced-motion` disables animation and smooth scrolling.

## Accessibility states

- Practical interactive target: at least 44px in normal layouts.
- Focus: 3px visible outline with offset.
- Hover never carries information unavailable to keyboard/touch users.
- `prefers-contrast: more` strengthens muted text and rules and removes decorative grid where appropriate.
- Form controls use native semantics, explicit labels, visible focus and non-color-only status feedback.
