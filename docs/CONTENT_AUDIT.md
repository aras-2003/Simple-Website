# Content & Logic Audit — CEO/CIO clarity review

## Review lens

This audit evaluates the site as if reviewed by a skeptical CEO/CIO/CTO with limited time and no obligation to care about the author’s framework vocabulary.

The critical questions are:

1. In six seconds, do I know what this is and why it may matter to me?
2. In thirty seconds, can I recognize my situation and see what I would actually receive?
3. In two minutes, can I understand the engagement model, proof and method?
4. Is the site commercially legible without becoming a generic consulting catalogue?
5. Does OAF strengthen the proposition rather than compete with it?
6. Are abstract ideas visually compressed rather than repeatedly explained in prose?
7. Is every strong claim either evidence-backed, clearly an author thesis, or explicitly a method hypothesis?

## Executive verdict

The previous architecture was intellectually stronger than most personal-expert sites, but still too demanding commercially. It asked a senior visitor to assemble the value proposition from multiple deep sections.

The redesign corrects that by separating two jobs:

- **buyer job:** relevance → outcome → tangible outputs → proof → next step;
- **thinker job:** evidence → OAF → provenance → deeper research.

The site now leads with the buyer job while keeping the deeper layer intact.

## Highest-impact diagnosis

### P0/P1 — “What do I actually get?” was too implicit

**Old risk:** a CEO/CIO could understand the worldview but still not know what an engagement produces.

**Change:** Home and Advisory now expose five tangible outputs:

1. decision / friction map;
2. choices and target decision architecture;
3. portfolio logic — stop / merge / sequence / continue;
4. decision rights + executive cadence;
5. transition roadmap + feedback loop.

**Why it matters:** this converts abstract expertise into a usable buying model without promising a fixed consulting package.

### P1 — the site was too text-dominant

**Old risk:** repeated heading + paragraph + heading + paragraph structures made good ideas feel heavier than they were.

**Change:** high-value concepts now get visual carriers:

- decision-system map;
- four trigger quadrants;
- output blueprint;
- friction → shift → value case flows;
- OAF diagram;
- progressive disclosure for intellectual lineage and principles.

**Why it matters:** the visitor can scan relationships before reading every sentence.

### P1 — OAF carried too much first-order burden

**Old risk:** the method could look like the thing being sold, forcing the visitor to understand a proprietary framework before understanding the business value.

**Change:** OAF is explicitly the thinking layer behind the work. Home establishes value first. OAF remains a strong named asset for deeper exploration.

### P1 — Practice was too anti-commercial

**Old risk:** “not a services catalogue” protected intellectual positioning but made it harder to answer “how could we work together?”.

**Change:** navigation becomes **Współpraca / Advisory** and the page defines three ways to enter a problem:

- Diagnostic;
- Design;
- Advisory.

These are engagement shapes, not off-the-shelf products.

### P2 — case studies were too documentary

**Old risk:** six cases × context/challenge/approach/value created a long evidence ledger.

**Change:** Home uses three selected cases. Advisory uses four. The visual logic is compressed to **friction → intervention/shift → management value**.

No unsupported KPI, client names or pseudo-precision are introduced.

### P2 — navigation followed author taxonomy more than buyer intent

**Old:** Perspective → OAF → Practice → About → Contact.

**New:** Advisory → OAF → Perspective → About → Contact.

The change is intentional: a buyer can now understand the offer before deciding whether to inspect the method or research depth.

## Page-by-page audit

### Home

**Executive job:** relevance and value.

**New sequence:**

1. executive hero — audience + systemic problem + outcome;
2. decision-system visual;
3. four trigger situations;
4. tangible output blueprint;
5. three proof cases;
6. OAF as method;
7. direct contact close.

**Assessment:** PASS at content-architecture level.

**Remaining live check:** validate actual line breaks, visual hierarchy and scan time on staging. The hero must not become visually impressive but cognitively crowded.

### Advisory / Współpraca

**Executive job:** “What would working together look like?”

**New sequence:**

1. cross-system problem framing;
2. Diagnostic / Design / Advisory;
3. output blueprint;
4. connected disciplines;
5. selected cases;
6. CTA.

**Assessment:** PASS conceptually.

The key improvement is that the page now makes the engagement concrete without turning expertise into generic service cards.

### OAF

**Executive job:** understand the method once there is already a reason to care.

**New visible sequence:**

1. four executive questions;
2. OAF model;
3. misfit examples;
4. application contexts.

**Progressive disclosure:** intellectual lineage and decision-quality principles.

**Assessment:** PASS conceptually, with one important guardrail: OAF must remain an evolving synthesis, not be described as an industry standard or invention of organizational architecture.

### Perspective

**Executive job:** evidence and depth.

Perspective retains the research-led structure and no longer carries the burden of explaining the advisory proposition.

**Assessment:** PASS.

Backlog remains: long-form essays should progressively gain stronger claim-level sourcing and explicit separation between external evidence and author interpretation.

### About

**Executive job:** “Why this person?”

The page remains trajectory-led rather than current-title-led. Portrait and credentials stay concentrated here instead of competing with the Home proposition.

**Assessment:** PASS.

### Contact

**Executive job:** low-friction first action around a concrete decision/context.

**Assessment:** PASS structurally; delivery remains incomplete until Resend is configured and tested.

## CEO/CIO language rules

### Prefer

- decision / choice / trade-off;
- business outcome;
- operating model;
- investment sequence;
- accountability / decision rights;
- capacity / constraint;
- portfolio logic;
- evidence from execution;
- transition / course correction;
- friction / dependency / handoff.

### Use carefully

- enterprise architecture;
- governance;
- capability;
- target state;
- PMO;
- OAF.

These are useful but should not appear as unexplained first-order value propositions.

### Avoid as default sales language

- transformation theatre;
- framework implementation;
- maturity journey;
- best-practice operating model;
- end-to-end optimization;
- holistic transformation;
- value realization framework;
- generic “accelerate / unlock / empower” language.

The tone should feel like one senior operator speaking to another: concrete, calm and slightly provocative.

## Claim hierarchy

Every strong statement must belong to one of four levels:

1. **Observed problem** — recurring organizational pattern.
2. **External evidence** — research/benchmark with source and date where relevant.
3. **Author thesis** — interpretation that can be challenged.
4. **OAF implication** — how the synthesis organizes the decision problem.

The site must not present level 3 or 4 as if it were level 2.

## Proof rules

Public case material may show:

- problem type;
- decision tension;
- intervention logic;
- management value;
- anonymized artifact examples where safe.

Do not publish without evidence/permission:

- client names/logos;
- revenue/savings figures;
- percentages;
- confidential architecture;
- internal program names;
- claims of causality that cannot be defended.

Absence of a metric is better than a fabricated one.

## Visual coherence audit

### PASS by implementation

- Home has no portrait/biography block.
- Home includes a dedicated decision-system visual.
- Tangible outputs use blueprint graphics rather than another card wall.
- Cases use flow logic.
- OAF supporting depth is progressively disclosed.
- mobile OAF uses a semantic linear fallback.
- visual motion is CSS-only and non-essential.
- `prefers-reduced-motion` removes the animated flow/pulse.
- performance budget is retained rather than relaxed to accommodate new visuals.

### FIX before staging acceptance

- inspect full-page desktop/mobile captures for local density;
- verify system-map node labels are legible at tablet widths;
- verify output blueprint does not feel like repeated decoration after row 3;
- check Home vertical length against the previous version;
- review PL/EN line lengths separately;
- verify visual hierarchy at 320/390/768/1024/1440 px;
- ensure the dark system field does not visually overpower the core proposition.

## Executive scan acceptance

### Six-second test

A new visitor should answer:

- who is this for?
- what class of problem?
- what business effect is being improved?

### Thirty-second test

They should identify:

- at least two recognizable trigger situations;
- at least three concrete outputs;
- the primary next action.

### Two-minute test

They should understand:

- three engagement formats;
- at least one proof case;
- what OAF is and is not;
- why the author has a cross-functional point of view.

If a senior tester cannot do this without explanation, the fix should be copy/hierarchy reduction — not additional explanatory paragraphs.

## Severity backlog

### P1 before public launch

- live staging executive scan test;
- real contact delivery through Resend;
- manual accessibility pass including VoiceOver/NVDA;
- final privacy wording against actual Resend behavior;
- production social preview / metadata check.

### P2 after the redesign is accepted

- stronger claim-level citations in essays;
- 2–3 deeper anonymized cases if safe publishable evidence exists;
- formalize OAF decision objects, owners, cadence and evidence taxonomy;
- consider one original data visualization for Perspective when enough source data exists.

### P3 future

- field-data Core Web Vitals review after real traffic;
- content taxonomy only if the Perspective library becomes materially larger;
- analytics only if there is a concrete measurement question and privacy review.

## Pre-launch assessment

- Executive value proposition: **PASS at architecture level / live visual review pending**
- “What do I get?” clarity: **PASS**
- Information architecture: **PASS**
- Visual storytelling density: **PASS in code / staging review pending**
- OAF provenance: **PASS**
- Evidence honesty: **PASS**
- PL/EN route architecture: **PASS**
- Automated accessibility: **PASS when current CI is green**
- Cross-browser smoke: **PASS when current CI is green**
- Manual assistive-technology audit: **FIX before formal compliance claim**
- Real contact delivery: **FIX — waiting for Resend**
- Production release readiness: **FIX — production Worker and public launch gates still pending**
