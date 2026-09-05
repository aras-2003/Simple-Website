# Quality Audit — editorial platform v4

## Creative direction

**PASS** — the site behaves as an executive/intellectual platform rather than a personal portfolio or generic consulting site.

Primary visual language:
- warm paper base, cocoa and moss accents,
- editorial typography and rules,
- diagrams as information, not decoration,
- limited card use,
- no portrait on Home,
- no arbitrary section numbering,
- motion limited to subtle transform-based cues with a global reduced-motion fallback.

The hardening pass deliberately avoids adding decorative effects simply to make the interface feel “fancier”. Visual changes must improve hierarchy, comprehension, credibility or interaction quality.

## Information architecture

**PASS** — primary logic is: problem → evidence → Perspective → OAF → Practice → author → contact.

Business effect: executive visitors can recognize relevance before being asked to care about OAF or the author.

## Home / five-second clarity

**PASS** — Home is a lightweight executive landing page. The first viewport identifies Arkadiusz Kamrowski, the executive/CIO/CTO audience and the class of decision problems while preserving the problem-first editorial proposition.

**PASS / automated regression** — browser smoke tests protect the hero geometry, CTA touch target and first-screen content contract.

**PASS / visual review** — generated desktop Chromium/Firefox/WebKit and mobile captures were reviewed after the hardening pass. No evidence-based layout correction is required: hierarchy, line lengths, CTA placement and visual balance remain coherent.

## Perspective

**PASS** — evidence appears before OAF; one featured essay is prioritized over a wall of equal cards; publishing contract is explicit.

**PASS / scalable publishing** — Perspective uses typed Astro Content Collections + Markdown rather than a TypeScript content object. PL/EN entries share stable public slugs and metadata/source URLs are validated at build time.

**PASS / research provenance guard** — every essay must declare at least one research source before the production build can pass. Source links are exposed as structured `citation` properties on Article markup.

**PASS / stronger primary-source mix** — AI governance writing now uses NIST AI RMF and the European Commission's AI Act material alongside existing organizational/operating-model references.

**P2 EDITORIAL DISCIPLINE** — as essays become more empirical, map specific factual claims to the exact source and maintain fuller bibliographies. A source list is context, not permission to imply that every sentence is externally proven.

## OAF

**PASS** — organizational architecture is explicitly presented as an established field. OAF is an evolving synthesis, not an invention claim.

**PASS** — intellectual lineage precedes the proprietary synthesis.

**PASS** — model moves from definition → lineage → gap → model → dimensions → misfit → decision contract → principles → boundaries → application.

**PASS / maturity step** — the decision contract formalizes five operational elements for high-impact decisions: decision object, accountable owner, cadence, evidence and revisit trigger. This closes the conceptual gap between a dependency model and an executable management loop.

**P2 VALIDATION** — validate the decision contract against real anonymized cases and evolve a stable taxonomy of decision types, evidence thresholds and escalation patterns before calling OAF a mature methodology.

## OAF diagram

**PASS by design** — labels are independent semantic layout elements; SVG geometry is decorative underneath. No text is placed directly on crossing SVG paths.

Mobile fallback is linear rather than a compressed orbit.

## Practice

**PASS** — interface/problem logic appears before competency/toolbox logic. The page no longer resembles a consulting service catalogue.

**HOLD / evidence integrity** — do not add fabricated case studies. Publish only anonymized cases with safe scope and defendable outcomes.

## About

**PASS** — the professional portrait is concentrated here. Biography is structured as an evolution of problem scale: technology/execution → architecture/transformation → strategy/portfolio/PMO → executive synthesis.

Credentials sit below the argument and trajectory. Portrait geometry now has one CSS owner rather than dead cross-layer overrides.

## Content graduation

**PASS** — each page has a distinct abstraction level:
- Home: executive recognition,
- Perspective: evidence and hypotheses,
- OAF: theory, model and decision mechanics,
- Practice: diagnostic/application level,
- About: provenance and credibility,
- Contact: action.

No page should jump directly from a market statistic into implementation mechanics without an intermediate thesis/model.

## Accessibility

**PASS / automated** — CI audits all PL/EN core and essay routes with axe WCAG 2.2 A/AA tags, verifies a keyboard-first skip link, checks 320 px reflow as the practical 400% zoom-equivalent layout contract and verifies `prefers-reduced-motion` behavior.

**PASS / implementation** — semantic headings, lists, figure captions, labels, focusable controls, reduced-motion fallback and a linear mobile OAF representation are preserved.

**MANUAL GATE BEFORE FORMAL WCAG CLAIM** — VoiceOver/Safari and NVDA/Chrome or Firefox still require a human assistive-technology review. Automated tests reduce risk; they do not constitute a complete conformance audit.

## Responsive / browser compatibility

**PASS / automated** — Chromium, Firefox, WebKit and mobile Chromium smoke tests cover the primary experience and reject horizontal overflow.

**PASS / visual audit** — full-page captures for Home, Perspective, OAF, Practice, About and Contact were reviewed at canonical desktop/mobile sizes. Dense OAF/Practice pages remain long because of substantive content rather than accidental whitespace or broken layout.

**MANUAL DEVICE GATE** — final production-domain checks on real Safari/iOS and at least one Android device remain recommended after deployment because platform font rendering, browser chrome and network behavior cannot be fully represented by CI screenshots.

## Performance

**PASS / architecture** — Astro remains static-first with minimal client JavaScript and no SPA hydration tax for editorial content.

**PASS / automated budget** — CI now fails if the production artifact exceeds explicit budgets for total output, raw/gzipped CSS, client JavaScript, Home HTML, largest single file or if source maps ship accidentally.

**PRODUCTION OBSERVATION GATE** — real-user Core Web Vitals should be observed after the public domain receives representative traffic. Laboratory/build budgets cannot manufacture field data before launch.

## SEO / social discovery

**PASS** — canonical URLs, PL/EN hreflang + x-default, sitemap, Open Graph/Twitter metadata and 1200×630 raster social artwork are present.

**PASS** — Perspective pages expose Article metadata with publication/modification dates, section, author and structured citation links.

**POST-DEPLOY CHECK** — run a production crawl and validate rendered social previews after DNS/TLS are live.

## Contact / privacy

**PASS / UX** — the form has explicit labels, consent, localized actionable errors, loading/success/failure states and anti-bot timing/honeypot controls.

**PASS / API architecture** — contact delivery runs in a separate Node sidecar; secrets never enter browser code. Payload size, fields, topics, origin, timing and bounded per-IP rate limiting are validated.

**PASS / runtime contract** — CI exercises the real NGINX → contact API path, canonical redirects, cache semantics and browser security headers.

**OPERATIONAL GATE** — production mail credentials, verified sender domain and SPF/DKIM/DMARC must be configured and a real end-to-end message delivered before launch.

**LEGAL GATE** — current privacy wording is implementation-ready but final legal/compliance sign-off remains a human organizational decision, not a code test.

## Security / supply chain

**PASS** — GitHub Actions are pinned to immutable SHAs and dependency installation uses the committed lockfile with `npm ci`.

**PASS** — NGINX runtime is pinned; the vendor-published `libuuid` update is applied during image build rather than suppressing the discovered HIGH findings.

**PASS / deterministic release gate** — Trivy writes JSON reports for both frontend and contact images; a repository-owned parser fails release on any HIGH/CRITICAL vulnerability. No severity downgrade or CVE ignore is used.

**PASS / edge headers** — nested NGINX locations inherit the canonical CSP, framing, HSTS, referrer and MIME-sniffing policy. Upstream contact headers that would otherwise become duplicate comma-joined values are hidden at the edge while remaining available when the API runs standalone.

## Hosting / operations

**PASS / proportional architecture** — static/edge hosting plus a small managed API is the default production baseline. AKS remains a reference/future option, not an unnecessary launch requirement.

**EXTERNAL LAUNCH GATE** — final provider choice, DNS, TLS, secrets and production observability must be configured in the actual hosting environment.

## Pre-launch checklist

- Value proposition / five-second clarity: **PASS**
- Home as landing: **PASS**
- Perspective before OAF: **PASS**
- Perspective scalable publishing + required research context: **PASS**
- OAF provenance: **PASS**
- OAF decision contract: **PASS as model; real-case validation pending**
- Theory → application graduation: **PASS**
- Portrait placement: **PASS**
- PL/EN route consistency: **PASS**
- Cross-browser automated QA: **PASS when current CI head is green**
- Expanded desktop/mobile visual audit: **PASS**
- Automated WCAG/reflow/reduced-motion: **PASS when current CI head is green**
- Performance budget: **PASS when current CI head is green**
- Contact form/API architecture: **PASS**
- NGINX runtime/header/cache E2E: **PASS when current CI head is green**
- Deterministic container HIGH/CRITICAL gate: **PASS when current CI head is green**
- Manual VoiceOver/NVDA audit: **MANUAL BEFORE FORMAL WCAG CLAIM**
- Real production email + SPF/DKIM/DMARC: **FIX IN PRODUCTION**
- Final privacy/legal sign-off: **MANUAL**
- Hosting/DNS/TLS/production monitoring: **FIX IN PRODUCTION**
- Real anonymized case evidence: **HOLD until safely publishable**
- Merge to `main`: **HOLD until current CI is green and release decision is explicit**
