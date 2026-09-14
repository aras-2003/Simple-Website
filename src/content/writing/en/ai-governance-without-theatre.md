---
locale: en
category: Autonomy, risk and governance
title: AI governance without control theatre
dek: Mature AI governance does not stop experimentation. It increases the strength of control when system autonomy, consequence and difficulty of reversal increase.
modifiedAt: 2026-09-14T23:05:00+02:00
order: 3
publishedAt: 2026-09-04T00:00:00+02:00
sources:
  - label: NIST · AI Risk Management Framework 1.0
    href: https://www.nist.gov/itl/ai-risk-management-framework
  - label: European Commission · AI Act regulatory framework
    href: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
  - label: Stanford · AI Index 2026
    href: https://hai.stanford.edu/ai-index/2026-ai-index-report
  - label: McKinsey · The state of AI · March 2025 report
    href: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value
---

## Adoption is outpacing governance maturity

AI governance is no longer a hypothetical design problem. In McKinsey's March 2025 report, based on research conducted in 2024, 78% of respondents said their organizations used AI in at least one business function. In a supplementary survey of executives, only 1% described their generative AI rollout as mature.

<aside class="evidence-callout" aria-label="Evidence">
<p class="evidence-number">362</p>
<p class="evidence-copy">documented AI incidents were recorded for 2025 in Stanford's AI Index 2026, up from 233 a year earlier.</p>
<p class="evidence-source"><a href="https://hai.stanford.edu/ai-index/2026-ai-index-report">Stanford · AI Index 2026</a></p>
</aside>

Adoption rates will keep changing. The more durable problem is that organizations are already using AI while ownership, review standards and escalation paths are still maturing.

## Control should strengthen with exposure

One policy for every AI use case is rarely enough. A tool that helps draft an internal note creates a different exposure from a system that independently triggers an action affecting a customer, employee or critical business process.

I find three variables useful.

**Autonomy.** How much can the system do without another human decision?

**Consequence.** How significant could the impact of a wrong decision or output be?

**Reversibility.** How easily can the organization undo the effect if it proves undesirable?

<figure class="concept-figure concept-figure--ai" aria-labelledby="ai-control-title-en">
<figcaption><span class="concept-kicker">Control intensity</span><strong id="ai-control-title-en">Control should increase with exposure — not simply because a solution uses AI.</strong></figcaption>
<div class="exposure-grid">
<div class="exposure-row"><strong>Autonomy</strong><span>low</span><div class="exposure-track" aria-hidden="true"></div><span>high</span></div>
<div class="exposure-row"><strong>Consequence</strong><span>low</span><div class="exposure-track" aria-hidden="true"></div><span>high</span></div>
<div class="exposure-row"><strong>Reversibility</strong><span>easy</span><div class="exposure-track" aria-hidden="true"></div><span>hard</span></div>
</div>
<div class="concept-arrow" aria-hidden="true">↓</div>
<div class="control-scale"><span>monitoring</span><span>sampling</span><span>review</span><span>escalation</span><span>stop authority</span></div>
<p class="concept-note">Regulatory requirements set the floor. This model determines additional operational control above that floor.</p>
</figure>

As autonomy and consequence rise, and reversibility falls, governance should become stronger: better evidence, monitoring, review, escalation or explicit authority to stop the system.

This is not an alternative to law. Regulatory categories and mandatory requirements establish a compliance floor. An internal risk model helps design controls above that floor and distinguish cases that may look similar from a technology perspective but create very different operational exposure.

## The AI Act sets a floor, not the whole governance operating model

The EU AI Act entered into force on 1 August 2024 and became broadly applicable on 2 August 2026, with important exceptions. Prohibited practices and AI literacy obligations started earlier, while governance rules and obligations for GPAI models became applicable from 2 August 2025.

Following changes to the implementation timeline, rules for Annex III high-risk use cases are scheduled to apply from 2 December 2027, while rules for high-risk systems embedded in regulated products under Annex I apply from 2 August 2028.

For the operating model, the more important principle is that a compliance floor does not remove the need to design accountability, evidence and escalation in proportion to the organization's actual exposure.

## Governance belongs in the lifecycle

When compliance appears only at the end, the organization creates a conflict between speed and safety. A better model embeds requirements for data, testing, human oversight, monitoring and escalation throughout the product lifecycle.

NIST AI Risk Management Framework 1.0 organizes this logic through Govern, Map, Measure and Manage, with governance operating across the framework rather than as a final gate. NIST also states that version 1.0 is currently being revised. The underlying operating principle remains useful: the question is not “did this solution pass review?” but “what evidence must exist at this level of exposure?”.

## “Human in the loop” is not a governance model

McKinsey's research shows how different current oversight practices are. Among respondents from organizations using generative AI, 27% said humans review all generated content before use, while a similar share said 20% or less is reviewed.

That does not tell us which model is correct. It shows why “human in the loop” is too vague to function as a control.

Human review is meaningful only when the organization knows which outputs require it, when it occurs, who has the capability and mandate to perform it, which criteria apply, and what happens when the result moves outside the accepted risk profile.

For low-autonomy, easily reversible use cases, sampling and monitoring may be enough. With high autonomy, high consequence or hard-to-reverse effects, stronger pre-deployment evidence, mandatory review, action limits or explicit stop authority may be necessary.

## Accountability remains with the organization

AI can analyze, recommend or automate parts of work, but organizational accountability does not disappear. Governance should identify the owner of the business outcome, the solution and the risk, as well as the escalation path when evidence moves outside the accepted profile.

In McKinsey's survey, 28% of respondents identified the CEO and 17% the board as the level responsible for AI governance oversight. That does not mean senior leadership should approve every use case. It means leadership is accountable for whether a system exists in which decisions are delegated in proportion to exposure and responsibility does not disappear with automation.

The same tension between autonomy and accountability appears in architecture governance. Too much centralization turns experimentation into bureaucracy. Boundaries that are too loose make accountability ambiguous.

## Test one live AI use case

Take one AI use case already in operation and assess it across three dimensions: autonomy, consequence and reversibility.

Then check whether the controls match that exposure: business outcome owner, monitored evidence, required level of verification, escalation condition and the person authorized to stop use.

If control strength rises with exposure, the organization probably has a governance mechanism. If the answer is only “it passed AI review”, it may have control theatre instead.
