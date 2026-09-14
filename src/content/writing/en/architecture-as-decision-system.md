---
locale: en
category: Decision Systems & Architecture
title: Architecture as a decision system, not a document system
dek: Architecture governance should not create more checkpoints. It should help the organization make better decisions faster — with clear ownership, criteria and consequences.
modifiedAt: 2026-09-14T18:45:00+02:00
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

## The artifact is not the product

A capability map, target architecture or technology principle creates value only when it changes capital allocation, initiative sequencing or the boundaries of product decisions. A correct model is not the same thing as an influential model.

The more useful question is therefore not “do we have architecture?” but “which decisions do we make differently because of it?”. That shifts attention from completeness of documentation to the quality of the decision mechanism.

Architecture sits inside a broader organizational problem. In McKinsey’s global decision-making survey, only one in five respondents said their organizations excelled at decision making, while 37% said decisions were both fast and high quality. The numbers are self-reported, not an objective scorecard, but they point to the same operating challenge: organizations often struggle to combine speed, quality and alignment at the same time.

<aside class="evidence-callout" aria-label="Data point">
<p class="evidence-number">37%</p>
<p class="evidence-copy">of respondents in McKinsey’s global survey said their organizations made decisions both quickly and with high quality.</p>
<p class="evidence-source"><a href="https://www.mckinsey.com/capabilities/people-and-organization/our-insights/decision-making-in-the-age-of-urgency">McKinsey · Decision making in the age of urgency</a></p>
</aside>

## Governance is a means, not the outcome

> The goal of architecture governance isn't more governance. It's better decisions made faster.

That is the standard I find useful for architecture governance. An architecture board, standard, exception process or review is not valuable by itself. It should shorten the path from a problem to a responsible decision without losing context, ownership or an explicit trade-off.

Faster does not mean less rigorous. Good governance reduces waiting, not thinking. If a decision needs six meetings only because the process does not identify the owner, criteria or boundaries for an exception, the problem is not insufficient control. The decision system is poorly designed.

Software delivery provides a useful warning against equating approval with control. DORA’s research on change approval found that heavyweight external approval processes were associated with poorer software-delivery performance, while finding no evidence that formal external review reduced change-fail rates. That does not prove that all approval is bad. It does show why governance should add judgment where risk requires it rather than add the same queue to every decision.

## Autonomy needs accountability

> Autonomy without accountability creates chaos; governance without autonomy creates bureaucracy.

Architecture governance should define the space in which teams can decide locally and the smaller set of decisions that genuinely need escalation. Autonomy without explicit ownership and boundaries turns system trade-offs into accidental local optimizations. Governance that requires central approval for every reversible decision slows teams and moves responsibility away from the people closest to the work.

A healthy model therefore distinguishes enterprise guardrails from local choices, reversible decisions from hard-to-reverse ones, and exceptions from ordinary delivery. The aim is not centralized control. It is distributed decision-making with explicit accountability.

Consider a team adopting a new platform capability. If the choice stays within agreed standards, risk limits and budget, it should often remain a local decision. If it requires an exception from an enterprise guardrail, the relevant architecture owner should be able to decide or escalate it. If the choice creates a long-lived dependency for several domains or changes investment sequencing, it becomes a broader enterprise decision. The level of governance should follow the consequence, not the existence of an architecture diagram.

## A good decision needs context

An architectural decision needs a named problem, criteria, alternatives, an owner and consequences. Without them, governance can become a document approval process that neither reduces risk nor increases speed.

Architecture gains influence when it can connect a strategic outcome, a capability, a technology dependency and an investment choice. The discussion then moves from technical preference to organizational choice.

The same McKinsey survey found that only 41% of respondents said their organizations both aligned decisions with corporate strategy and allocated financial and human resources to high-value projects. Organizations that did both were 2.9 times more likely to be classified by McKinsey as decision-making winners. That is association, not proof of causation, but it illustrates why architecture cannot stop at design consistency. It must help connect choices to strategy and resources.

## Influence is visible in how the system moves

The most interesting architecture measures are not the number of reviews or template compliance. I care more about whether conflicting initiatives are detected earlier, whether hard-to-reverse choices become cheaper to challenge before commitment, and whether portfolio dependencies are funded in the right sequence.

In that sense architecture is leverage. Its job is not to describe the entire organization, but to help it make fewer contradictory decisions under time pressure and incomplete information.

## Test architecture’s influence

At the next review, choose one architectural principle. Ask which option it rules out, who can authorize an exception and which consequence that person accepts. Then add two questions: does the governance path help this decision happen faster, and is the decision being made at the lowest level that can responsibly own its consequences?

If the principle changes none of the available options, it describes a preference rather than a decision boundary. If governance does not accelerate a responsible decision, it becomes its own operating cost. If every meaningful choice must travel upward, accountability has been replaced with escalation.

That is my practical test for architecture that helps leaders govern rather than merely approve a document.
