---
locale: en
category: Decision systems and architecture
title: Architecture as a decision system, not a document system
dek: Architecture governance should not produce more control points. It should help organizations make better decisions faster – with clear ownership, criteria and consequences.
modifiedAt: 2026-09-15T10:35:00+02:00
order: 1
publishedAt: 2026-09-04T00:00:00+02:00
sources:
  - label: McKinsey · Decision making in the age of urgency
    href: https://www.mckinsey.com/capabilities/people-and-organization/our-insights/decision-making-in-the-age-of-urgency
  - label: DORA · Streamlining change approval
    href: https://dora.dev/capabilities/streamlining-change-approval/
  - label: MIT CISR · Enterprise Architecture as Strategy
    href: https://cisr.mit.edu/publication/enterprise-architecture-as-strategy
---

## The artifact is not the product of architecture

A capability map, target architecture or technology principle creates value only when it changes capital allocation, initiative sequencing or the boundaries of product decisions. A model can be correct without the organization actually using it.

That makes “do we have architecture?” less useful than “which decisions do we make differently because of it?”. The emphasis shifts from documentation completeness to the quality of the decision system.

Architecture sits inside a wider organizational problem. In a global McKinsey survey, only one in five respondents rated their organizations as very good at decision making, while 37% said decisions were both fast and high quality. These are self-assessments rather than an objective ranking, but they capture the tension: organizations struggle to maintain speed, quality and coherence at the same time.

<aside class="evidence-callout" aria-label="Evidence">
<p class="evidence-number">37%</p>
<p class="evidence-copy">of respondents in McKinsey's research said their organizations make decisions both quickly and at high quality.</p>
<p class="evidence-source"><a href="https://www.mckinsey.com/capabilities/people-and-organization/our-insights/decision-making-in-the-age-of-urgency">McKinsey · Decision making in the age of urgency</a></p>
</aside>

## Governance is a mechanism, not an outcome

The goal of architecture governance is not to produce more control points. It is to help the organization make better decisions faster.

An architecture board, standard, exception process or review has no intrinsic value. These mechanisms should shorten the path from problem to accountable decision without losing context, ownership or an explicit trade-off.

Faster does not mean careless. Good governance reduces waiting, not thinking. If a decision needs six meetings because the process does not identify an owner, criteria or the boundary of an exception, the problem is a poorly designed decision system.

Software delivery offers a useful warning against equating approval with control. DORA research on change approval links heavyweight external approval processes with worse software delivery performance and did not find evidence that more formal external review reduces change-fail rate. That does not mean all approval is bad. It means governance should add judgment where risk requires it rather than adding the same queue to every decision.

## Decisions should sit where their consequences can be owned

Autonomy without accountability creates chaos. Governance without autonomy creates bureaucracy.

A mature model therefore asks more than whether a decision is “architectural”. It asks about scope, reversibility and the cost of being wrong.

**A local decision** can stay with a team when consequences are contained and reversible.

**A constrained decision** still belongs to the team but must remain within enterprise standards, risk limits or budget guardrails.

**An enterprise decision** needs broader ownership when it creates dependencies across domains, changes a shared platform or data model, affects security, or creates a multi-year capital commitment.

**An exception** should go to the person with the mandate to accept a departure from a guardrail and own the consequence.

Centralization therefore makes sense when the consequence is broad, long-lived or hard to reverse. It should not be the default mechanism for every technical choice.

<figure class="editorial-figure editorial-figure--architecture" aria-labelledby="architecture-figure-title">
<figcaption class="editorial-heading"><span class="editorial-kicker">Architecture</span><h3 id="architecture-figure-title">The right decision at the right level.</h3></figcaption>
<picture class="editorial-art">
<source type="image/avif" srcset="/images/writing/architecture-768.avif 768w, /images/writing/architecture-1536.avif 1536w" sizes="(max-width: 800px) calc(100vw - 48px), 748px" />
<img src="/images/writing/architecture-1536.webp" srcset="/images/writing/architecture-768.webp 768w, /images/writing/architecture-1536.webp 1536w" sizes="(max-width: 800px) calc(100vw - 48px), 748px" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
</picture>
<ol class="editorial-model editorial-model--4">
<li><span class="editorial-index" aria-hidden="true">01</span><strong>Team</strong><p>Local decisions that are easy to reverse.</p></li>
<li><span class="editorial-index" aria-hidden="true">02</span><strong>Team within guardrails</strong><p>Autonomy within agreed boundaries.</p></li>
<li><span class="editorial-index" aria-hidden="true">03</span><strong>Organization</strong><p>Decisions with consequences beyond one team.</p></li>
<li><span class="editorial-index" aria-hidden="true">04</span><strong>Exception</strong><p>Explicit authority to approve a departure from the rules.</p></li>
</ol>

<p class="editorial-note">Wider consequences and lower reversibility require broader authority. Exceptions follow an explicit approval path.</p>
</figure>

## A good decision needs context

An architecture decision should have a named problem, criteria, alternatives, owner and consequences. Without them, governance can become a document-approval process that neither reduces risk nor increases speed.

Architecture gains influence when it can show the relationship between a strategic outcome, organizational capability, technology dependency and investment. The conversation then stops being a debate about technical preference and becomes a conversation about an organizational choice.

In the same McKinsey study, only 41% of respondents said their organizations both link decisions to strategy and direct people and capital toward high-value projects. Organizations doing both were 2.9 times more likely to be classified by McKinsey as “decision-making winners”. That is correlation rather than proof of causation, but it helps explain why architecture cannot end with solution consistency. It must help connect decisions with strategy and resources.

## Influence is visible in how the system moves

The most interesting architecture measures are not the number of reviews or compliance with a template. I care more about whether conflicting initiatives are detected earlier, whether hard-to-reverse decisions are challenged before full commitment, and whether the portfolio funds dependencies in the right sequence.

Architecture is a lever in that sense. Its purpose is not to describe the entire organization. It is to help the organization make fewer contradictory decisions under time pressure and incomplete information.

## Test the influence of one architecture principle

At the next review, pick one architecture principle. Ask which option it rules out, who can authorize an exception, and which consequence that person accepts.

Then test the level of the decision: does it genuinely require an enterprise perspective, or can it safely remain local within existing guardrails?

If the principle changes no available option, it describes a preference rather than a decision boundary. If every material choice must escalate, accountability has been replaced by escalation. If the consequence crosses team boundaries and nobody has the mandate to resolve it, autonomy has been confused with the absence of governance.

That is my practical test for distinguishing architecture that helps manage the enterprise from architecture that can only be approved.