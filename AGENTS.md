# AGENTS.md

## Purpose

This repository powers arkadiuszkamrowski.com.

It is a personal executive technology and transformation platform, not a traditional CV, portfolio, consulting template or SaaS landing page.

The experience must communicate executive credibility, strategic clarity, systems thinking and technological sophistication.

## Sources of truth

Before significant work, read the relevant current documentation.

Priority:

1. `AGENTS.md` — execution rules for agents
2. `docs/PRODUCT.md` — product positioning and current product state
3. `docs/DESIGN_PRINCIPLES.md` — current creative and interaction direction
4. `docs/DESIGN_SYSTEM.md` — visual components and implementation language
5. `docs/ARCHITECTURE.md` — technical architecture
6. `docs/ENVIRONMENTS.md` — runtime and deployment environments
7. `docs/BRANCH_GOVERNANCE.md` — Git and release governance

Documents explicitly marked as historical are context, not current instructions.

## Tool routing

Use the narrowest capable tool and prefer direct integrations over manual context transfer.

Priority by task:

1. **GitHub connector** — repository truth, branches, files, diffs, PRs, CI/release state and code/documentation changes. Read the repository directly instead of asking for pasted files when access is available.
2. **Figma connector** — design-system inspection, visual exploration, layout/component work, design variables and design-to-code tasks. Use it when a Figma source exists or when composition should be resolved before implementation. Do not introduce a Figma round-trip for trivial code-only changes.
3. **Firecrawl connector** — external website/reference research, structured extraction from design references, documentation crawling and reference-library maintenance. Prefer compact structured extraction over repeatedly loading full pages into model context. Do not treat Firecrawl as evidence of private staging availability unless authenticated access is explicitly configured.
4. **Runway connector** — image/video generation or editing for production visual assets when generated media materially improves the approved concept. Do not generate decorative assets without a content or conversion role.
5. **GSC Wizard** — Search Console / GA4 analysis, indexing diagnostics, query/page performance, content decay, CTR and post-launch SEO learning. Prefer server-side aggregated analyses over importing raw analytics rows. Use only after the relevant property is connected and data exists.
6. **Motion tooling** — follow `docs/MOTION_SYSTEM.md`. Use Theatre.js as the preferred visual motion-authoring layer for high-fidelity sequences, GSAP as the preferred production animation runtime when native CSS/SVG is insufficient, and Three.js only for concepts that genuinely require a 3D scene/camera. Runway is for rendered media assets, not the runtime for interactive page motion.
7. **Web research** — current vendor documentation, standards and public facts when repository/plugin data is insufficient or freshness matters.

Tool use must reduce uncertainty or execution cost. Do not call multiple overlapping tools by default. Do not add another builder/hosting abstraction (for example Webflow, Lovable, Replit or Base44) when the current Astro + GitHub + Cloudflare architecture already supports the task.

For design-reference work, extract reusable mechanisms (composition, motion, interaction, typography, depth, transitions) rather than copying brand-specific shapes, colors or content.

For significant visual implementation, use the repository preview/staging path for real-browser QA. External crawlers may only access staging through an explicitly approved machine-authenticated path described in `docs/CLOUDFLARE.md`; never weaken staging Access globally for crawler convenience.

## Product standard

The site must not feel like a static executive CV or conventional portfolio.

The target is a premium interactive executive digital experience built around systems thinking.

The experience should create a clear visual wow effect through composition, typography, depth, motion, interaction, transitions, spatial relationships and visual storytelling.

The wow effect must come from quality and coherence rather than visual novelty.

## Visual direction

Prefer simple visual primitives with sophisticated behavior.

Use where appropriate:
- geometric forms,
- layered planes,
- depth,
- light,
- controlled transparency,
- spatial transitions,
- contextual background motion,
- scroll-linked progression,
- meaningful parallax,
- interactive diagrams,
- state transformation,
- micro-interactions.

The page should feel alive. Do not default to a static layout merely because it is simpler to implement.

Avoid:
- arbitrary blobs,
- generic SaaS cards,
- random particles,
- crypto/cyberpunk aesthetics,
- excessive neon,
- decorative 3D,
- gimmicky effects,
- motion without conceptual purpose.

## Content-driven motion

Whenever practical, motion should express the meaning of the content.

Examples:
- strategy → prioritization, convergence and choice,
- architecture → structure, layers and dependencies,
- transformation → transition between states,
- decision-making → signals becoming choices,
- execution → flow, synchronization and feedback,
- leadership → alignment and connection.

## Visual exploration

A technically working implementation is not automatically finished.

For significant visual work:
1. inspect the existing experience,
2. consider at least two materially different concepts,
3. implement the strongest concept,
4. render and interact with it,
5. evaluate visual quality,
6. iterate if the result feels generic, ordinary or disconnected from the content.

The agent may perform up to 3 implementation/visual-QA iterations autonomously before presenting the result. Stop earlier when the quality bar is clearly met. Do not continue beyond 3 iterations without explicit owner approval.

Do not implement multiple variants unless comparison would materially improve the decision.

## Performance

Performance enables the experience; it does not define the experience.

Do not remove meaningful visual behavior solely to maximize synthetic scores.

Avoid jank, excessive CPU/GPU use and unnecessary payload. Optimize perceived and real user performance, not synthetic scores in isolation.

Prefer native CSS, SVG and Web APIs. A motion or graphics dependency may be introduced only when it materially improves the approved experience and the same result would be disproportionately complex or brittle with the existing stack.

Always respect `prefers-reduced-motion`.

## Responsive experience

Mobile must preserve the visual idea rather than simply remove animation.

Adapt interaction, scale, density and motion to device capabilities while preserving the core concept.

## Accuracy

Do not invent professional achievements, metrics, employers, outcomes, testimonials or client information.

Preserve PL and EN parity.

## Engineering

Inspect existing architecture before changing it.

Reuse sound existing primitives. Avoid unrelated refactors and unnecessary dependencies.

For user-facing work, visual quality is part of correctness.

## Validation

For significant visual work:
- run the app,
- inspect the actual rendered experience,
- test desktop and mobile,
- interact with the feature,
- inspect console/runtime errors,
- run relevant automated tests,
- inspect the final diff.

A screenshot or passing test suite is not sufficient evidence for a major visual change.

Before merging a significant visual feature to `main`, provide a real browser-accessible preview when the repository tooling supports it. Use the repository's isolated preview/staging capabilities rather than production. Owner visual acceptance is required for material visual changes before release promotion.

Do not assess visual quality only from source code.

## Git and release

Follow the repository's existing controlled promotion path.

Significant work:
`feature branch → PR → main`.

Release:
`main → staging → production`.

Do not merge or deploy to production without explicit authorization.

Do not bypass repository protection rules.

## Definition of done

A visual feature is done only when:
- it works,
- the underlying idea is immediately understandable,
- it looks deliberate and polished,
- motion and interaction feel premium,
- it fits the overall system,
- mobile remains strong,
- tests and relevant quality gates pass.

"Technically works" is not sufficient.
"Looks acceptable" is not sufficient.
