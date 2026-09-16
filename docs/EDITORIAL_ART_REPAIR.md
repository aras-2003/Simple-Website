# Editorial visual repair · 2026-09-16

## Diagnosis

The four deployed Polish WebP sources could not be fully decoded; the Polish AI AVIF was also truncated. Redirects masked some broken WebPs by serving AVIFs with only 800 px intrinsic width. Polish and English articles used different asset families. Rasterized typography and overlapping labels were already present in the images. CSS contained obsolete hide/background workarounds.

## Implemented

- Four new, consistent 1536 × 1024 text-free 3D editorial artworks: architecture, portfolio, transformation and AI governance.
- Native semantic text and ordered models in all eight articles; separate localized copy, a single shared image family, mobile reflow.
- AVIF/WebP at 768 and 1536 widths; exact dimensions, lazy loading, no JS required, no raster enlargement.
- Removed retired assets and approximately 330 lines of obsolete figure styling. Legacy image URLs now redirect directly to valid WebP images.
- Long English article title wraps at 320 CSS px.
- Full binary decoding and image transfer-budget tests are part of the production build. Release browser tests decode AVIF and WebP, check overflow and capture every figure.
- Production artifact budget explicitly accommodates four responsive artwork families. Existing JS, CSS, home HTML and non-editorial file budgets are unchanged. Largest fallback is 135.4 KiB; chosen AVIF ranges from 19.9 to 107.9 KiB. One essay loads one derivative.

## Local quality and pre-launch audit

| Check | Result |
|---|---|
| Astro type/content validation | PASS · 52 files, no diagnostics |
| Static routes, metadata, internal links | PASS · 22 localized routes |
| Asset integrity | PASS · 16 derivatives fully decode |
| Figure render and WebP fallback | PASS · 16 desktop/mobile cases, PL/EN |
| Article accessibility, keyboard, 320 px reflow | PASS after long-title correction |
| Visual review | PASS · architecture, portfolio, transformation, AI; desktop and mobile captures |
| Performance budgets | PASS · approximately 1.34 MiB complete artifact; zero added client JS |
| Worker/contact and measurement tests | PASS |
| Predeploy contract tests | PASS |
| Remote CI, release-browser matrix, staging deploy | Check the exact release commit's GitHub checks before promotion |

Local browser checks used Chromium 153; the repository CI runs its pinned Playwright Chromium, Firefox and WebKit versions. No claim of a live Cloudflare Access session is made by local checks. Production publication is outside this repair's release scope.

Art direction, prompts and derivative encoding are documented in `design/writing/README.md`.
