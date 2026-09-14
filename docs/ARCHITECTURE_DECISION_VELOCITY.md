# Architecture decision velocity — release scope

## Purpose

Strengthen the existing decision-led brand in the architecture domain without widening the product or restarting the visual system.

Core thesis:

> The goal of architecture governance isn't more governance. It's better decisions made faster.

This is an author thesis and operating principle, not a claim attributed to the external sources cited in Perspective.

## Scope

1. Strengthen the existing bilingual Perspective essay `architecture-as-decision-system` instead of creating another overlapping article.
2. Clarify that architecture governance is a means to improve decision quality and decision speed, not an output measured by boards, reviews or documents.
3. Add the same principle to OAF as a concise bridge between architecture, decision rights, trade-offs and execution evidence.
4. Preserve Home, TAK/NIE/KTO, primary navigation, proof stories, Advisory, Contact, analytics schema, security controls and the current visual system.
5. Use existing editorial typography and responsive rules; no new dependency, font, image, animation or client framework.

## Content boundaries

- `Faster` never means bypassing evidence or controls.
- The supporting idea is: good governance reduces waiting, not thinking.
- Architecture decisions should expose an owner, criteria, alternatives/trade-offs, consequences and exception boundaries.
- Do not present the thesis as a direct conclusion of MIT CISR, McKinsey, TOGAF or another external source.

## Release path

Short-lived branch → full CI → `main` → full CI → `staging` → exact staging CI / Workers Build.

Production remains behind the existing live acceptance gates for real Turnstile/Resend delivery, Observability ingestion, branch governance and public production smoke. This content release must not weaken those gates.
