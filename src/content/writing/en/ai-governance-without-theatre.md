---
locale: en
category: Autonomy, Risk & Governance
title: AI governance without control theatre
dek: Mature AI governance does not try to stop experimentation. It changes control with risk, autonomy and consequence — and keeps a person accountable for the outcome.
modifiedAt: 2026-09-14T18:55:00+02:00
order: 3
publishedAt: 2026-09-04T00:00:00+02:00
sources:
  - label: NIST · AI Risk Management Framework 1.0
    href: https://www.nist.gov/itl/ai-risk-management-framework
  - label: European Commission · AI Act regulatory framework
    href: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
  - label: Stanford · AI Index 2025 · Responsible AI
    href: https://hai.stanford.edu/ai-index/2025-ai-index-report/responsible-ai
  - label: McKinsey · The state of AI · March 2025 report
    href: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value
---

## Adoption is moving faster than governance maturity

AI governance is no longer a hypothetical design problem. McKinsey’s March 2025 report, based on a survey conducted in 2024, found that 78% of respondents said their organizations used AI in at least one business function. In a complementary executive survey, only 1% described their generative-AI rollout as mature.

The percentage will keep moving. The more durable point is the gap between adoption and operating maturity: organizations are already deciding where AI may assist, recommend or act while ownership, review standards and escalation paths are still being designed.

<aside class="evidence-callout" aria-label="Data point">
<p class="evidence-number">78%</p>
<p class="evidence-copy">of respondents in McKinsey’s March 2025 report said their organizations used AI in at least one business function. The underlying survey was conducted in 2024.</p>
<p class="evidence-source"><a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value">McKinsey · The state of AI</a></p>
</aside>

One universal AI policy is therefore rarely enough. The risk of a tool that drafts an internal note is different from the risk of a system that recommends or executes a consequential business action. Governance that treats them identically will be too heavy for low risk and too shallow for high risk.

## Risk should follow authority, not the label “AI”

The same model can draft, recommend or execute. Those are different management situations because the system is allowed to exercise different degrees of authority.

A useful starting point is to ask: what may the system do, how consequential would an error be, how reversible is the consequence, and who remains accountable when it is wrong?

A drafting assistant may need basic data boundaries and a reviewer. A recommendation system needs stronger evidence, traceability and a named decision owner. A system executing reversible actions also needs operational limits and a stop condition. Hard-to-reverse actions require materially stronger controls and escalation.

This logic is consistent with the EU AI Act’s risk-based design. Most provisions became applicable on 2 August 2026, while some obligations for high-risk systems apply later depending on system category and regulatory context. The operating lesson is more important than the calendar: control should be proportional to exposure and consequence.

## Control should be part of delivery

When compliance appears only at the end, the organization creates a conflict between speed and safety. A better model embeds data requirements, testing, human oversight, monitoring and escalation into the product lifecycle.

NIST’s AI Risk Management Framework uses the functions Govern, Map, Measure and Manage, with governance cutting across the lifecycle rather than appearing only as a final gate. That shifts the question from “has this passed AI review?” to “what evidence must exist at this level of exposure?”.

The need is not theoretical. Stanford’s 2025 AI Index recorded 233 reported AI-related incidents in 2024, 56.4% more than the year before. Reporting and awareness also affect incident counts, so the increase is not a clean measure of underlying failure frequency. It is still a useful signal that operational consequences are becoming more visible as adoption expands.

## “Human in the loop” is not a governance model

McKinsey’s 2025 report shows how varied oversight already is. Among respondents from organizations using generative AI, 27% said employees reviewed all generated content before use, while a similar share said 20% or less was reviewed.

That does not tell us which model is right. It shows why “human in the loop” is too vague to be a control. Governance needs to specify which outputs require review, when review happens, who is qualified and authorized to perform it, which evidence they use and what happens when the result leaves the expected profile.

A reviewer who is nominally present but has no criteria, time or authority is not meaningful oversight.

## Accountability sits above the model

AI may support analysis, recommend or automate, but organizational accountability does not disappear. Governance should name the owner of the outcome, the system or model, and the risk, together with an escalation path when evidence leaves the expected profile.

McKinsey respondents most often pointed to senior leadership for oversight of AI governance: 28% named the CEO and 17% the board. That does not mean senior leaders should approve every AI use case. A better interpretation is that leadership owns the governance system, while decisions within it should be delegated in proportion to risk and consequence.

This is the same autonomy-accountability balance that appears in architecture governance. Centralize every decision and experimentation slows into bureaucracy. Delegate without explicit owners and boundaries and the organization cannot explain who accepted the risk.

## Change the control when authority changes

Imagine the same model moving through three uses. First it drafts a response that a person reviews and sends. Then it recommends which response path to use. Finally it is allowed to execute a limited, reversible action automatically.

The model may be identical. The governance should not be.

The first use mainly needs data boundaries and review. The second needs evidence about recommendation quality and a named decision owner. The third also needs transaction limits, monitoring, a stop condition and escalation. Governance changes because the authority changed.

## Test one AI use case

For one live AI use case, answer six questions:

1. What may the system decide or do?
2. Is the consequence reversible?
3. Who owns the business outcome?
4. What evidence is monitored in operation?
5. What condition forces human escalation?
6. Who can stop the system?

If the answers are clear and proportional to the risk, the organization probably has a governance mechanism. If the answer is simply “it went through AI review”, it may only have control theatre.
