# Product — canonical current state

Verified baseline: 2026-09-11. This document supersedes historical product/IA/architecture claims elsewhere. Release evidence belongs in [PROOF_RELEASE.md](PROOF_RELEASE.md); environment controls in [ENVIRONMENTS.md](ENVIRONMENTS.md).

## Positioning and audience
Arkadiusz Kamrowski is an executive technology/transformation leader. The decision-led advisory narrative serves boards, CEOs, CIOs and transformation sponsors who must reconcile strategy, investment, accountability and technology. Executive recruitment remains supported through About and direct contact. This is a personal executive brand, not a framework vendor or an agency.

Preserved assets: **Strategię widać w wyborach. / Strategy shows up in choices.** and **TAK / NIE / KTO · YES / NO / WHO**. The primary conversion is a conversation about a difficult decision. OAF is a secondary thinking model, never a prerequisite for understanding the offer.

## Experience architecture
| Page | Purpose | Next step |
|---|---|---|
| Home `/`, `/en` | Thesis → choices → tensions → two proof summaries → person → conversation | Contact or Advisory |
| Advisory `/wspolpraca`, `/en/advisory` | Three independent engagements; decision and enabled change visible; mechanics expandable; illustrative decision brief; two evidence stories | Contact |
| Perspective `/perspektywa`, `/en/perspective` | Four existing essays, with sources and useful next paths | Related essay, Advisory or Contact |
| About `/about`, `/en/about` | Human trajectory and existing credentials | Contact |
| OAF `/oaf`, `/en/oaf` | Deeper explanation of judgment and model boundaries | Advisory or Contact |
| Contact `/contact`, `/en/contact` | Situation-based topic, concise context, next-step expectation, LinkedIn alternative | Message |
| Privacy `/privacy`, `/en/privacy` | Contact handling and limited event measurement | Contact |

Primary navigation: Advisory, Perspective, About, Contact; language switch alongside it. OAF and Privacy are footer routes. Existing localized URLs and legacy redirects remain stable.

## Creative direction and design system
Preserve the calm editorial/architectural composition, green/cream palette, serif headlines and system sans-serif text, original portrait and TAK/NIE/KTO visual. New proof uses typography and output-led rows. No new image, font, framework or motion dependency. Native `details` compress deeper mechanics on both desktop and mobile and work with JavaScript disabled.

Observation → impact → fix: five always-visible engagement fields made mobile comparison lengthy. Decision and enabled change now remain visible; process, team input and retained outputs are one keyboard-operable disclosure. Proof summaries link to full context and personal contribution. The existing illustrative brief remains explicitly distinct from client evidence.

## Evidence architecture
See [PROOF_SOURCES.md](PROOF_SOURCES.md). Two owner-supplied anonymised practice areas are presented consistently on Home and Advisory, with contribution, management output and enabled decision. Existing experience duration, trajectory and MBA credential provide scope/human/external validation. No organisation size, budget, savings, client identity or attributed testimonial has been invented. An enabled decision is not reported as a measured business outcome.

## Production architecture
Astro SSG → Cloudflare Workers Static Assets. `worker/index.mjs` routes contact, limited product events, redirects and staging indexing protection. `worker/measurement.mjs` owns the event schema. Turnstile, origin checks, honeypot, timing, size limits, rate limits and Resend protect contact delivery. No application database or client framework.

Docker / NGINX / Node sidecar / Kubernetes / Azure remain **reference and portability paths**. They are not the production runtime. The Node adapter accepts the same new contact topics. Local Astro/portability preview does not persist product events; browser tests mock the event collector, Worker tests validate the real handler.

SEO: canonical/hreflang, sitemap and social metadata preserved; one JSON-LD graph links Person to WebPage/ProfilePage/Article. Existing Article microdata remains compatible. JSON-LD is inert data; executable scripts stay external under the existing CSP.

## Learning model
[ANALYTICS.md](ANALYTICS.md) defines the schema, query procedure, retention limits and baseline-first review. Lightweight first-party events use existing Cloudflare Workers Logs, without a new analytics vendor, cookies, browser storage or user identifiers. The main metric is owner-assessed qualified conversations; anonymous events describe intent and friction, not unique-user funnels or lead qualification.

## Release model and launch status
Short-lived branch → PR + full CI → main → PR + full CI → staging → Cloudflare Workers Build → staging acceptance → production branch → guarded manual production workflow. `main` is integration only. User has authorised promotion to main and staging after gates pass. The supplied mission authorises production only after actual launch gates pass; do not infer live acceptance from mocked tests.

Baseline main: `083ffbe70325a04bada510dee6a088f5469b1d35`; staging: `0c98ad88d25c023ee68ae9c7ace3bb328c353cc0`; production branch: `a00ee1e81b182d5fd1dc6317dbe7127cfeacb9cd`. The staging branch already contained all baseline main changes and had a successful Workers Build. Production branch SHA is not evidence of a live deployed version.

At baseline, staging returned the Cloudflare Access login redirect. Real contact delivery and production provisioning could not yet be verified. Earlier configuration records say Resend/destination are pending; treat those as the last documented status, not fresh account inspection. Public launch requires authenticated staging acceptance, actual sender/delivery readiness and production smoke. Do not delay for more articles or visual polish.
