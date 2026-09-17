# Editorial art brief — Delivery beyond deployment

## Implemented · 2026-09-17

The fifth artwork is paired with a compact, localized two-item comparison before the three-level measurement section: a technical stage shortened by 30%, and two months waiting for a scope decision. It ends with the question of whether time to value got shorter. Both figures are explicitly marked hypothetical, never project results. The original nine-node, two-track diagram was removed after user feedback about readability; the comparison stacks on mobile. The separate three-level measurement model remains in place.

Original artwork: `delivery.png`, 1536 × 1024, generated with the built-in ImageGen tool and preserved with the conversation. Prompt: `delivery-prompt.txt`. Re-encode only this family with `node scripts/encode-editorial-art.mjs delivery`. Four derivatives pass the existing 48/160 KiB per-image caps. The artifact budget adds room for the fifth family, preserving CSS, JS and all individual asset limits. Current complete build is approximately 1.66 MiB; a visitor downloads one chosen image, 29–101 KiB in AVIF.

Local validation: production build, full image decoding, static/SEO/internal-link checks, Worker tests, PL/EN desktop/mobile figure and fallback tests, WCAG checks, keyboard navigation and 320 px reflow. Visual review covers both layouts. Release CI must pass before main and staging promotion.

## Purpose and placement

Article (PL/EN): `src/content/writing/{pl,en}/delivery-beyond-deployment.md`. Conceptual artwork illustrating the gap between a faster technical deployment stage and an unchanged end-to-end path to customer value. Place its responsive `<picture>` in the article **after the opening section, before “Trzy poziomy pomiaru...” / “Three measurement levels...”**. The article already has a semantic three-level HTML model below; retain that model. The new artwork is a visual metaphor, not the source of facts.

## Creative direction

Match the four existing editorial-art families in `public/images/writing`: warm limestone, honed deep-forest-green stone, restrained brass/ochre accents, tactile architectural objects, soft directional studio light, calm precise composition. Single coherent 3:2 landscape frame, actual 1536 × 1024 original, editorial art direction rather than generic SaaS/AI imagery. Think architectural model of **two parallel journeys**: a short, well-made upper pathway of modular blocks suggesting the engineered delivery segment; a longer lower pathway toward a modest illuminated destination suggesting customer use, interrupted by one conspicuous gap/decision gate. A subtle physical connection between the paths should express that deployment belongs to the whole journey. Use physically plausible shadows, fine material texture, crisp edges, deliberate negative space. The lower bottleneck, not the upper polished path, is the focal tension. Color/accessibility should remain legible on the warm-page background.

No people, screens, logos, dashboards, glowing circuit boards, decorative gradients, stock-office imagery, fake graphs, tiny UI, random floating blocks, or excessive glassmorphism. **NO text, letters, numbers, captions, arrows, KPI labels or typographic artifacts rendered inside the image**. Text is placed as selectable, localized HTML, not baked into raster. Never upscale a screenshot or resize an old failed image. Avoid literal implied chart geometry that could misrepresent the hypothetical 30%/two-month comparison.

## Prompt for Astra — image generation and integration

> Create one original premium 3:2 editorial still-life illustration for Arkadiusz Kamrowski’s executive technology website, visually consistent with the architecture/portfolio/transformation/AI-governance illustrations already in `public/images/writing/`. A tactile architectural miniature in warm limestone and honed deep forest-green stone, soft directional studio lighting, highly detailed surfaces and clean geometry. Two related physical paths: the upper short modular path is efficient and uninterrupted; the lower longer journey toward an understated destination is visibly interrupted by a single decision gate/gap. One precise connecting element shows they are segments of one larger system. Communicate the tension between efficient code deployment and delayed customer value without using a literal data chart. The obstructed lower journey is the storytelling focus. Calm architectural/editorial aesthetic, refined shadows, generous whitespace, naturally sharp 1536×1024 render. Absolutely no words, lettering, numerals, logos, diagrams with text, UI widgets, gradients, glowing circuits, people or rasterized typography. Generate from scratch at the target resolution — never upscale a screenshot.

## Native text layer accompanying the art

PL caption: `Sprawniejszy etap techniczny nie usuwa automatycznie ograniczenia między potrzebą a wartością. Przykład 30% i dwóch miesięcy w artykule jest hipotetyczny.`

EN caption: `A faster technical stage does not automatically remove the constraint between need and value. The 30% and two-month example in the article is hypothetical.`

PL alt, only if artwork conveys information not repeated in adjacent figure text: `Model dwóch połączonych ścieżek: krótki, drożny etap techniczny i dłuższa droga do wartości przerwana bramą decyzyjną.`

EN alt: `Architectural model of two linked paths: a clear short technical stage and a longer journey to value interrupted by a decision gate.`

The existing three-level model remains in semantic HTML; do not rasterize or duplicate it as image text. If the art is strictly decorative and the caption conveys the whole interpretation, use `alt=""` instead. Do not make the entire explanation dependent on vision.

## Asset implementation and gates

Use original 1536×1024 lossless artwork for derivative processing, ideally saved outside deployed `public/` as `design/writing/originals/delivery.png` if storage policy permits; repository currently excludes originals. Emit `public/images/writing/delivery-768.avif`, `delivery-1536.avif`, `delivery-768.webp`, `delivery-1536.webp`, all fully decoded and actual 3:2, no enlargement. Target the existing AVIF 65/WebP 84 settings, budgets 48 KiB for 768 and 160 KiB for 1536 or explicitly review any justified exception. Extend the `scripts/encode-editorial-art.mjs` source roster and `tests/editorial-assets.mjs` roster to include `delivery`, preserving all four existing families. Use responsive `<picture>` with AVIF source, WebP fallback, `width="1536" height="1024" loading="lazy" decoding="async"` and correct `sizes`, and add a localized native `<figcaption>` with no layout shift. Update editorial browser figure tests to include the new slug and ensure the fallback is actually selected and decoded in Chromium, Firefox and WebKit. Verify 320px mobile reflow, text zoom, accessibility, redirects/internal links, image budget, and cross-browser visual screenshots.

Work on a short-lived branch from current main; submit PR with passing CI, then promote main → staging via PR and verify the exact Cloudflare Workers Build. Never deploy production automatically. The published article must remain fully readable even before the art exists — do not add a missing `img` src or placeholder that breaks layout.
