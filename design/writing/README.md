# Editorial artwork

Direction: warm limestone, honed forest-green stone, architectural objects, soft studio lighting. Artwork is a conceptual metaphor. All explanatory text, decision branches and labels are semantic HTML in the article, localized in PL/EN and reflowed on mobile. Never bake typography into the raster.

Four original 1536 × 1024 PNG images were generated using the built-in ImageGen tool on 2026-09-16. Full-resolution originals are preserved with the generating conversation. To reproduce web derivatives, download them here as `architecture.png`, `portfolio.png`, `transformation.png`, `ai.png` and run `node scripts/encode-editorial-art.mjs`. Do not resize screenshots of a prior illustration. The prompts are in `prompts.json`.

The production files live in `public/images/writing/`: 768/1536 widths, AVIF quality 65, WebP quality 84, no enlargement. Original PNG files are deliberately excluded from the deployed artifact. `<picture>` selects a single resource; dimensions reserve space before lazy loading.

`npm run test:editorial` fully decodes every derivative to catch truncation and bad headers. Browser tests decode the chosen source and the WebP fallback in each locale, check overflow, and capture every figure on desktop/mobile and release browsers. Changes to artwork must pass both checks.
