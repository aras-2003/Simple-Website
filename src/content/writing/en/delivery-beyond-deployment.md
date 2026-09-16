---
locale: en
category: Operating model and execution
title: The code is in production. The value is still waiting.
dek: A faster deployment pipeline does not necessarily shorten the path from a business need to a useful outcome. Delivery leaders need to see the whole flow, not just its technical segment.
order: 5
publishedAt: 2026-09-16T14:00:00+02:00
modifiedAt: 2026-09-16T14:00:00+02:00
sources:
  - label: DORA · Software delivery performance metrics · 2026
    href: https://dora.dev/guides/dora-metrics/
  - label: DORA · Loosely coupled teams · 2025
    href: https://dora.dev/capabilities/loosely-coupled-teams/
  - label: DORA · A history of software delivery metrics · 2026
    href: https://dora.dev/insights/dora-metrics-history/
---

## Production is a milestone, not the end of the journey

At the delivery review, the numbers look good: deployments are more frequent, tests run faster, and changes spend less time between commit and production. The engineering team has genuinely improved how it works.

Then a business leader asks: **why does the customer still wait two months for the solution?**

Both accounts can be true. Engineering has become faster, while the organization has not shortened the journey from a business need to a useful result. The mistake is to present the performance of one segment as the performance of the whole system.

Deployment frequency is an important signal of technical capability. On its own, it cannot tell us whether we are delivering the right change, when someone can use it, or whether the intended benefit materialized. That is not a criticism of the metric. It is a reminder to **be precise about the question a metric answers**.

## Three measurement levels must describe the same change

I find it useful to connect three perspectives. The goal is not to create three separate dashboards. It is to trace one initiative across the flow and identify where the outcomes diverge.

<figure class="editorial-figure" aria-labelledby="delivery-levels-title">
<figcaption class="editorial-heading"><span class="editorial-kicker">Three perspectives</span><h3 id="delivery-levels-title">From technical performance to customer value.</h3></figcaption>
<ol class="editorial-model editorial-model--3">
<li><span class="editorial-index" aria-hidden="true">01</span><strong>Engineering performance</strong><p>How quickly and safely can we change software? Commit-to-production time, deployment frequency, stability, and recovery.</p></li>
<li><span class="editorial-index" aria-hidden="true">02</span><strong>Delivery performance</strong><p>How effectively does a commitment move through the organization? Predictability, quality, cost, dependencies, and waiting time.</p></li>
<li><span class="editorial-index" aria-hidden="true">03</span><strong>Business outcomes</strong><p>What changed for users and the organization? Availability, adoption, process cost, and realized benefits.</p></li>
</ol>
<p class="editorial-note">This is my way of linking technical measures, delivery accountability, and business outcomes – not an additional set of DORA metrics.</p>
</figure>

At the engineering level, the current [DORA model](https://dora.dev/guides/dora-metrics/) provides five measures: change lead time, deployment frequency, failed deployment recovery time, change fail rate, and deployment rework rate. The last measures the share of unplanned deployments resulting from a production incident; it is not a measure of every kind of project rework. These metrics are most useful in the context of a particular application or service, not as a context-free league table of teams.

The boundary of the clock matters. DORA change lead time runs from code commit to production. It does not include the weeks before a scope decision or the time between deployment and meaningful use. If we discuss *time to market* or *time to value*, we must state separately where each measure starts and ends. They are related, but they are not interchangeable.

## Three days saved do not eliminate two months of waiting

Consider a **hypothetical** initiative in which test automation cuts the code-ready-to-release stage by 30%. That is a real improvement within the team's control. Meanwhile, the initiative still waits two months for a scope decision, a shared environment, or an integration agreement.

The improvement is worthwhile, but it may barely move the end-to-end lead time. Another investment in the pipeline might improve reliability; it will not automatically resolve a decision bottleneck. The useful questions are **what are we waiting for, why, and who has the authority to decide?**

Not every lengthy decision is waste. Risk, compliance, and genuine user needs can require careful analysis. The problem is waiting without an owner, criteria, or an expected decision date – or finding a critical dependency only after implementation is well underway.

DORA connects technical architecture and organizational design to a team's ability to test and deploy independently. Its practical measures include [the number of handoffs and the time spent waiting for reviews and approvals](https://dora.dev/capabilities/loosely-coupled-teams/). Not every delivery constraint can be removed by buying another engineering tool.

## More frequent does not automatically mean safer

A second trap is celebrating deployment frequency without examining its consequences. With more deployments, the absolute number of incidents could rise even when the proportion of failed deployments stays constant. That is why frequency should be read alongside change fail rate, deployment rework rate, recovery time after failed deployments, and the actual impact on users.

An outage of a critical service and a minor defect do not have the same business consequence. The objective is not the maximum possible number of deployments. It is the ability to deliver frequently **and safely**. [DORA treats throughput and instability as complementary dimensions](https://dora.dev/guides/dora-metrics/), not a simplistic choice between speed and quality.

## A Delivery Director need not control everything, but must see the whole

Product and business owners also influence adoption. Engineering and operations own much of reliability. Sponsors and relevant business functions are accountable for financial benefits. It makes little sense to hold one team solely responsible for outcomes outside its control. It makes equally little sense to manage delivery as though accountability ends at deployment.

A Delivery Director should maintain a shared view of the flow, expose constraints between owners, and help secure decisions. If the bottleneck is testing, intervene in engineering. If the bottleneck is unclear authority over scope, another CI/CD dashboard will not help. If a feature is available but unused, revisit the product, change rollout, and assumptions about user behavior.

The question shifts from “which indicator is red?” to **“which decision would remove the constraint that matters to the outcome?”**

## Trace one change from need to meaningful use

At the next delivery review, select one important change. Reconstruct its path from the accepted need through scope decisions, implementation, and deployment to its first meaningful use. Separate active work from waiting time and put stability and quality evidence alongside the timeline. Identify the stage that constrains the flow, its owner, and the decision required to improve it.

Then check more than whether that stage became faster. Check whether **the entire journey** became shorter and whether the customer experienced the intended benefit.

A green engineering dashboard tells you that one part of the system works better. The Delivery Director's job is to establish whether the whole system does too.
