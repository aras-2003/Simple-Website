# ASTRA executive refactor — 2026-09-10

## Release scope
User waived the tag and requested leaving the redesign on the feature branch. No merge, staging promotion or production deployment is authorized in the current scope. PR #31 remains the review surface.

## Thesis and product
Old ambiguity: a synthesis of strategy, architecture, portfolio and execution, without a sufficiently explicit engagement.
New proposition: Arkadiusz helps boards and CIOs decide what to fund, what to stop, and how accountability and technology must change to make their strategy executable.
The signature is TAK / NIE / KTO (YES / NO / WHO). Its three choices are readable without framework knowledge.

Diagnostic: select the problem and scope using a dependency map and decision list. Operating design: choose an operating change using options, decision rights, architecture/funding implications and a transition plan. Execution advisory: revisit priorities with evidence, a decision record and explicit review conditions. These are independent entry points, not a mandatory sequence. No price, duration or client outcome is invented.

## Information architecture
Primary: Advisory / Perspective / About / Contact CTA. Home identifies the problem. Advisory explains the work and retained outputs. Perspective puts four essays first. About presents the person and trajectory. OAF remains an indexable secondary route in the footer and Home method note. Existing localized URLs, canonical, hreflang and sitemap remain stable.

## Content architecture
Each page domain now owns bilingual content: home.ts, advisory.ts, about.ts, method.ts, perspective.ts, contact.ts, privacy.ts. ui.ts contains navigation/privacy introduction; journey.ts contains the shared contact starting sequence. Writing retains its Astro schema. Removed executive/platform/editorial/vnext/operating-model and unused shared copy after checking references. Removed eight diagram/presentation components. One stylesheet replaces the cascade of overlapping redesign layers.

## Evidence and human signal
Home uses the existing technology-strategy context; Advisory uses the existing portfolio context. Both describe management outputs, without invented metrics or clients. About preserves the supplied trajectory, credentials and portrait. No employment title or invented anecdote. Portrait dimensions corrected to 400 × 400.

## Final adversarial review — fixes
1. Advisory risked remaining a list of output labels. Fixed: each format explicitly includes situation, decision, process, leadership contribution, retained outputs and enabled change.
2. Essays still shared the same ending about feedback. Fixed: added distinct implications — architecture exception authority; resource released by a new priority; design of work before role assignment; AI controls according to action authority. Removed inaccurate unused read-time fields.
3. Executive labels were too small. Fixed: form labels, consent, engagement headings and decision-brief labels raised to 14px. Mobile signature becomes a horizontal word/meaning pair per row, not a miniature desktop diagram.

## Validation
Source checkpoint d32f348: remote CI passed Astro/build/static, Worker/contact, performance, external references, Worker package dry runs and automated WCAG 2.2 A/AA checks. Follow-up tests adapt old diagram-specific assertions to buyer paths and add mocked contact delivery and malformed JSON regressions. Final CI status is recorded in the PR; do not infer completion from this checkpoint.
Initial compiled redesign: 257.1 KiB artifact, 18.3 KiB CSS raw / 4.5 KiB gzip, 4.9 KiB JS, 8.0 KiB Home HTML. Original Home was 20.4 KiB against the unchanged 20 KiB limit. These are asset budgets, not field Core Web Vitals measurements.

## Rollback
Original main: 32aca86ed6b0f03e4e84f9ec65d4a23cb6fa1d6a.
Remote backup: backup/pre-astra-refactor-2026-09-08.
Tag: omitted by explicit user instruction.
Feature: feature/astra-executive-refactor.
PR: https://github.com/aras-2003/Simple-Website/pull/31.
No merge or deployment has occurred. To abandon, close the feature PR; main requires no rollback. To inspect original code: git fetch origin, then git switch -c restore/pre-astra origin/backup/pre-astra-refactor-2026-09-08. If a future merge requires rollback, revert its merge commit on a new branch and use the normal PR → main → staging → production path. Never reset production or bypass promotion safeguards.
