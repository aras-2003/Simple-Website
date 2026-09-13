> **Historical decision/source record.** Claims and instructions below describe an earlier checkpoint, not current branch, runtime or launch state. The refactor is merged. Current truth: [PRODUCT.md](PRODUCT.md), [PROOF_RELEASE.md](PROOF_RELEASE.md), [PROOF_SOURCES.md](PROOF_SOURCES.md).

# Design System

## Visual direction

**Quiet authority + executive systems storytelling.**

The system combines warm editorial minimalism with precise diagrams, rails and decision maps. It should feel like a senior executive publication crossed with a system blueprint — never like a SaaS dashboard, generic consulting template or architecture repository.

The visual system has two modes:

1. **Editorial paper** — warm, spacious, readable, low-noise.
2. **System field** — dark, technical surfaces used selectively for diagrams and moments of conceptual compression.

## Core tokens

- **Paper** `#F4EEE5` — primary warm canvas.
- **Paper strong** `#FCF7EF` — lighter content surface.
- **Ink** `#1B1612` — deepest text / system background.
- **Chocolate** `#5C4437`, deep `#3F2F27` — warm depth and supporting brand material.
- **Sage / forest** `#5F7255`, deep `#46543F` — strategic accent, nodes, decision signals.
- **Muted** `#655A52`, strong `#4C433D` — secondary text with AA margin.
- **Inverse text** `#F6F0E7` — text on dark system fields.
- **Focus** `#97B05B` — dedicated high-visibility keyboard focus.

Avoid decorative gradients, glassmorphism and glow. Color is used for hierarchy, system state and material contrast rather than decoration.

## Layout

Maximum content width: 1440px with fluid horizontal padding.

Composition rules:

- prefer editorial splits, rails and large asymmetric fields;
- use borders/lines before card shadows;
- avoid wrapping every content unit in a rounded card;
- use whitespace to separate decisions, not to create empty prestige space;
- alternate prose with visual compression on Home and Advisory;
- keep long-form reading measures intentionally narrow.

Breakpoints are content-driven. Tablet and mobile rebuild multi-column compositions instead of scaling desktop down. 320 CSS px remains an explicit reflow target.

## Type hierarchy

- H1: fluid editorial display, approximately 42–82px depending on viewport.
- H2: approximately 34–64px.
- Lead: 17–20px.
- Body: 13–18px depending on context.
- Labels / metadata: 9–11px uppercase with adequate contrast.
- Long-form notes use narrower reading measure and increased line-height.

Headlines should make a claim rather than merely label a topic. Avoid repeating the same idea in H1 + lead + body.

## Core visual components

### ExecutiveSystemMap

Shows:

**Direction → Operating model → Architecture → Portfolio → Execution**

with a feedback loop from execution evidence to the next decision.

Uses:
- Home hero;
- compact mode on Advisory.

Motion:
- subtle flow along connections;
- small pulse on handoff/risk points;
- CSS-only;
- disabled with `prefers-reduced-motion`.

### OutcomeBlueprint

Five rows that make the advisory output tangible:

- decision/friction map;
- choices / target decision architecture;
- portfolio logic;
- decision governance;
- transition roadmap / evidence loop.

Each row combines a small blueprint graphic, artifact name, output name and executive decision question.

### Trigger grid

Four large editorial quadrants describing situations in which the work becomes relevant. These are not service cards; they are recognizable executive symptoms.

### Case flow

Case studies are compressed to:

**friction → intervention/shift → management value**

The visual hierarchy should make the logic scannable before the prose is fully read.

### OAF diagram

The circular OAF visualization remains the distinctive method visual. Desktop uses a collision-safe radial layout; mobile becomes a semantic linear stack. Supporting research/lineage is progressively disclosed.

## General component language

Primary components:

- sticky header with a visually stronger Contact action;
- primary / quiet buttons with restrained geometry;
- editorial section intro;
- decision-system map;
- output blueprint;
- trigger quadrants;
- evidence/case rails;
- OAF diagram;
- research ledger;
- article body;
- contact form;
- footer utility navigation.

Cards are only used where a contained unit genuinely helps comparison or interaction. Editorial content remains part of the page flow rather than becoming a card wall.

## Imagery

Photography is secondary to conceptual graphics on Home/Advisory.

Preferred imagery:

- real speaking / working contexts;
- professional portrait on About;
- authentic diagrams / whiteboards / notes when available;
- spatial/system details that reinforce architecture and decision-making.

Avoid generic executive stock imagery.

## Motion

- purpose-driven diagram flow and hover/focus transitions only;
- no opacity-dependent readable text animation;
- no scroll hijacking;
- no custom cursor;
- no essential parallax;
- no heavy animation library;
- `prefers-reduced-motion` disables non-essential motion and smooth scrolling.

## Accessibility states

- practical interactive target: at least 44px in normal layouts;
- focus: 3px visible outline with offset;
- hover never carries information unavailable to keyboard/touch users;
- `prefers-contrast: more` strengthens muted text/rules where implemented;
- form controls use native semantics, explicit labels, visible focus and non-color-only status feedback;
- diagrams must retain a meaningful textual/semantic explanation and never be the sole carrier of critical information.
