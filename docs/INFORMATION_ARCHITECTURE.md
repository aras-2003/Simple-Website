# Information Architecture – editorial platform

## Product thesis

The site is not a personal CV with a framework attached. It is an executive/intellectual platform with a named author and a clear professional brand.

The primary narrative is:

**problem → evidence → perspective → synthesis (OAF) → application → author → contact**

This order is deliberate. A CEO/CIO/CTO should first recognize a problem worth thinking about, not be asked to care about the author's framework or biography.

## One information architecture, two translations

PL and EN use the same route keys and the same page structure. English differs only by the `/en` prefix and translated content.

Canonical pairs:
- `/` ↔ `/en`
- `/about` ↔ `/en/about`
- `/oaf` ↔ `/en/oaf`
- `/work` ↔ `/en/work`
- `/writing` ↔ `/en/writing`
- `/contact` ↔ `/en/contact`
- `/privacy` ↔ `/en/privacy`
- `/writing/<slug>` ↔ `/en/writing/<slug>`

The language switch preserves the current page and, for essays, the current article slug.

## Primary navigation

1. Perspective / Perspektywa
2. OAF
3. Practice / Praktyka
4. About / O mnie
5. Contact / Kontakt

The name/brand links to Home. Home is a landing hub and is not repeated in the primary nav.

## Home – lightweight manifest / landing

Purpose: create recognition and curiosity without reproducing the deep pages.

Sequence:
1. Hero: the systemic problem; no portrait, employment title, education or credentials.
2. Problem: three representative places where locally rational choices create system-level incoherence.
3. Evidence: two market/research signals, presented as a compact proof layer rather than a research section.
4. OAF teaser: OAF as a response, not a starting point.
5. Three deeper paths: Perspective, Practice and About.
6. Close: route into contact.

Home deliberately does **not** contain the full decision-chain thesis, essay previews, full practice-interface map or author biography. Those belong one level deeper.

Visual grammar: large editorial type, compact decision field, horizontal tension rows, two-signal evidence layer, restrained OAF preview and one compact path selector.

## Perspective – research editorial

Purpose: establish the problem space and evidence base before presenting OAF.

Sequence:
1. Hero: problem first, framework later.
2. Research lens: recurring executive questions.
3. Benchmark/evidence ledger.
4. Featured essay.
5. Essay library.
6. Publishing standard: observation → evidence → implication.
7. Bridge: OAF as a synthesis that follows from recurring evidence.

Essay cards use category labels without reading-time estimates. Reading depth is communicated by structure and copy, not artificial precision such as “6 min”.

Visual grammar: research notes, ledger, one featured article, compact editorial library. No generic blog-card wall.

## OAF – intellectual product

Purpose: explain the synthesis with intellectual honesty and increasing specificity.

Sequence:
1. Hero: OAF as an integrating decision loop.
2. Definition of organizational architecture; explicit statement that it predates OAF.
3. Intellectual lineage: Galbraith, 7-S, fit/misfit, MIT CISR / operating model + EA.
4. Gap: what organization design, EA, portfolio/governance and execution each solve, and what remains between them.
5. Full OAF visual: Direction / Architecture / Priorities / Evidence around Decision Coherence.
6. Layer deep dive: one question and decision meaning per dimension.
7. Fit/misfit examples: concrete contradictions in real operating models.
8. Principles: quality standards for the decision system.
9. Boundaries: what OAF does not replace.
10. Applications: when a cross-system view earns its place, presented as a continuous editorial list.
11. Next: Practice or Perspective, not an immediate sales push.

Visual grammar: intellectual lineage river, convergence field, collision-safe circular diagram on desktop, linear semantic fallback on mobile.

## Practice – executive problem solving

Purpose: answer “what does this look like in real work?” without becoming a consulting-services catalogue.

Sequence:
1. Hero: problems occur between functions.
2. Four interfaces: Strategy↔Architecture, Architecture↔Portfolio, Portfolio↔Execution, Execution↔Strategy.
3. Each interface: question → problem → signal → decision.
4. Toolbox: EA, Strategy & Transformation, Portfolio & PMO, AI & Technology as tools, not offers.
5. Operating method: locate misfit → criteria → choice → evidence → close loop.
6. Six anonymized experience-based case studies: technology strategy, reference models, portfolio rationalization, euro-impact analysis, governance and PMO.
7. Contexts where this thinking is useful.
8. Next: OAF or About.

Case studies use four layers: **context → challenge → approach → value**. They do not contain invented organizations, confidential details or unsupported KPIs.

Visual grammar: long-form interface rows, method rail and a continuous case-study ledger rather than a wall of cards.

## About – personal brand / credibility

Purpose: explain the source of the perspective without tying the brand to one employer or employment title.

Sequence:
1. Hero with a restrained professional portrait.
2. Personal story: delivery/technology → EA → transformation → strategy/portfolio/PMO.
3. Brand profile: the professional role defined by the intersection of disciplines, not by an employer-specific title.
4. Trajectory river: evolution of problem scale and perspective.
5. Working principles.
6. Credentials: 10+ years, Kozminski/MBA, certifications, public speaking – deliberately lower in hierarchy.
7. Next: Perspective or Contact.

The site must not describe the brand through a current employer or a director/executive title. Employment history may be discussed in future only when it serves the narrative and is factually current.

Visual grammar: smaller portrait, long-form biography, trajectory river, dark brand-profile field and editorial credentials.

## Contact – minimal conversion

Purpose: make a useful first contact easy.

Structure:
1. “Start with the problem” hero.
2. Short context guidance.
3. Accessible form.
4. LinkedIn fallback.
5. Privacy disclosure.

## Granularity rule

Every transition must move exactly one level deeper:

Home: **recognize** → Perspective: **understand/evidence** → OAF: **model** → Practice: **apply** → About: **trust the author** → Contact: **act**.

Content should not jump from a market-level statement directly to implementation detail without an intermediate thesis/model layer. Conversely, deeper pages should not repeat Home copy unless it is needed as a short bridge.

## Linking rule

Each page exposes at most two strong next paths:
- Home → Perspective / OAF, with lower-priority Practice/About/Contact later in the page
- Perspective → OAF / related essay
- OAF → Practice / Perspective
- Practice → OAF / About
- About → Perspective / Contact
- Contact → end state

This creates multiple executive journeys without turning every section into a menu.
