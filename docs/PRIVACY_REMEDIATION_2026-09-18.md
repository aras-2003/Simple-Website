# Privacy remediation — 18 September 2026

Scope: verified corrections to PL/EN copy, application logging and test coverage. Owner authorizes feature → main → private staging only. No legal approval, measurement decision or production release is implied.

## Verified starting snapshot

GitHub API and `git ls-remote` agreed:

| Ref | SHA |
| --- | --- |
| main | 2aeba4964be207bc3e2b03638d89f5d4f0b8aae9 |
| staging / draft PR #59 head | 00f67742c7eba172fa112ccbebd6a87bdf39974a |
| production | a00ee1e81b182d5fd1dc6317dbe7127cfeacb9cd |

## Triage before implementation

Rows map the audit findings by subject; code evidence supersedes historical feedback. Account settings are not inferred from repository documentation.

| Finding | Initial status and current evidence | Correction / acceptance |
| --- | --- | --- |
| Controller / contact | PARTIALLY FIXED: privacy §1 says form only; accessible mailto already present | Extend scope to website and direct email; preserve mailto and eight sections, PL/EN browser tests |
| Required / optional data | PARTIALLY FIXED: voluntary disclosure already present; payload adds consent, locale, startedAt, token and honeypot | Describe transient processing versus email and logs; real UI → captured payload → Worker validation test |
| Contract / acknowledgement | OPEN: §3 contract wording too broad; UI already acknowledgement | Limit Article 6(1)(b) to necessary processing for data subject's contract/request; no API rename |
| Provider roles | OPEN: Turnstile addendum distinguishes processor protection and controller bot-detection improvement; footer says processor | Explain roles PL/EN, neutral provider label, verified Cloudflare DPA link |
| Measurement / PKE | REQUIRES OWNER DECISION: client reads referrer and sends four dimensions; Worker adds three fields; infrastructure adds metadata | Correct factual schema description; decision card; no measurement behavior or legal-basis change |
| Transfers | REQUIRES OWNER DECISION: generic provider documents do not establish account-specific instruments | Request recipient/region/contract evidence; no invented SCC/DPF coverage |
| Retention | REQUIRES OWNER DECISION: policy has criteria, Workers plan and mailbox deletion practice unverified | Separate datasets and request actual settings; propose an owner-approved deletion process |
| Cookies / runtime | REQUIRES OWNER DECISION: no measurement storage in code; Access/Turnstile runtime and pre-clearance need evidence | Keep measurement-specific wording; separate private Access cookies from future public deployment |
| Technical assurance | OPEN: privacy spec absent from both Playwright testMatch and npm browser gate; local server logs response fragments and arbitrary errors | Enable standard CI; synthetic marker tests for success/error/exception/timeout; safe category/status logs |
| Stale deployment note | OPEN: CLOUDFLARE.md says Resend pending; dated acceptance records owner-tested mail | Attribute dated owner report; do not claim new account inspection |
| Alleged missing voluntary disclosure / direct contact | ALREADY FIXED in current policy/component | Preserve; regression coverage |
| Alleged automatic safety of custom_domain=true | NOT REPRODUCED: production deploy would attach the domain | Preserve manual production gate; no production actions |

## Measurement decision card — owner decision required before public launch

The current client reads `document.referrer`, maps it to a coarse source, observes page/click/form events and sends event/page/locale/source. DNT/GPC are respected; no measurement cookies or browser storage. The Worker validates a closed schema and logs kind/version/environment plus those dimensions. These facts alone do not settle Article 399 PKE or a GDPR basis. Merely adding Article 6(1)(f) to the notice does not address PKE.

| Option | Evidence / minimal work | Privacy, analytics, UX and complexity | Acceptance tests |
| --- | --- | --- | --- |
| A. Current measurement without consent | Obtain a documented assessment of the exact client reads/writes/transmissions against Article 399 and its exceptions; assess purpose/necessity, whether personal data is processed across the full chain, GDPR basis (including balancing if legitimate interests), recipients and retention | Current counts and unobtrusive UX retained; legal uncertainty must be resolved using this implementation, not a general cookieless claim; no code change until assessment accepted | Verify assessed code/version, field allowlist, opt-outs, no storage, no contact data, actual infrastructure metadata and retention |
| B. Measurement after consent | Gate module initialization, referrer reads and sending until affirmative optional choice; reject/ignore Worker events without the chosen consent protocol, retain schema/rate limits; equally accessible refusal and withdrawal; stop listeners/reads/queued sends after withdrawal; minimize consent-state storage and document its purpose/expiry | Fewer observations; explicit choice UI and withdrawal control; additional state, accessibility and consent-evidence work; server cannot blindly treat a client boolean as proof of valid UX consent | Fresh/refused/accepted/withdrawn/expired states, no pre-consent reads or events, no queued events after withdrawal, forged/missing protocol, DNT/GPC, keyboard/screen-reader/mobile |
| C. Temporarily disable at public launch | Add a build-time frontend switch that omits/short-circuits initialization before any measurement reads or listeners, plus PRODUCT_MEASUREMENT=0 on Worker; verify built output and endpoint. Server switch alone does not stop browser reads/sends | No analytics; no added consent UI; lowest implementation complexity, reversible after decision; security/contact remain separate | No client initialization/referrer reads/listeners/requests; direct events yield no logs; contact success/error and security unaffected |

No option is implemented by this remediation. Staging measurement remains enabled.

Legal sources to assess: [PKE Article 399](https://eli.gov.pl/api/acts/DU/2024/1221/text.html), [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB Guidelines 2/2023, final technical scope](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf). Browser access can involve more than cookies; neither cookieless implementation nor use of referrer alone settles the legal analysis.

## Owner evidence requests, in priority order

1. **Measurement:** choose A/B/C above with the supporting legal assessment for A or an implementation authorization for B/C. No implied choice.
2. **Transfers:** for Cloudflare/Turnstile, Resend and the actual mailbox provider, supply the contracting entity, actual processing locations, applicable DPA/version and instrument covering the actual route (including any relevant DPF scope or SCC module). General provider pages alone are insufficient. No private recipient address is needed.
3. **Mail flow:** confirm whether direct email follows `contact@arkadiuszkamrowski.com → Cloudflare Email Routing → mailbox provider`, plus the separate `form → Worker → Resend → mailbox provider` route. In Cloudflare domain → Email → Email Routing → Routing rules, provide a redacted screenshot showing the source and destination **provider**, masking the destination address. Confirm forwarding rules, copies and exports separately. The repository does not prove this route.
4. **Retention:** Cloudflare Workers & Pages → staging Worker → Observability/Logs and Settings → Observability: plan, enabled/persisted logs, invocation logging, sampling and actual retention; zone Security events/log export settings separately. Resend dashboard email/log retention and account plan; mailbox deletion/archive/trash/backup settings; exports and third-party backups separately. Provide settings screenshots with no message bodies, addresses, tokens or secrets. Proposed rule for approval: review completed non-contractual enquiries quarterly; delete 12 months after closure unless a documented, time-limited claims/legal hold applies; set a separate lawful schedule for contractual records; include trash/exports and record when provider backups expire. This is a proposal, not a current practice or public policy claim.
5. **Cookies/security:** Cloudflare → Turnstile → staging widget → Settings: widget mode, hostname scope and pre-clearance setting; separately provide production widget settings read-only. Browser DevTools Application → Cookies/Storage: names, domains, purpose and expiry only; Network: whether Set-Cookie occurs and which response origin, with **values redacted**. Compare before/after Access authentication and Turnstile on non-form/form pages. Do not send cookie values, full HAR, tokens or secrets. Access cookies on private staging do not establish the future public site's cookie behavior.

Verified provider documents: [Turnstile Privacy Addendum](https://www.cloudflare.com/turnstile-privacy-policy/) (updated 18 June 2025, checked in this task), [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/). Their general roles support the copy correction; they do not establish the owner's account configuration.

## Evidence boundaries

Application tests inspect data controlled by this code; they do not inspect all internal Cloudflare metadata. Existing owner-reported successful staging delivery is historical evidence, not a new submission in this task. A Cloudflare verification screen currently blocks this browser's staging access; runtime checks must be recorded separately from local and CI checks.

## Reproducible local validation

Runtime: Node `v24.19.0`, npm `11.9.0`; CI uses Node 22 from the existing workflow. Locked dependencies installed with `npm ci --no-audit --no-fund`.

Commands executed:

```sh
SITE_BASE_URL=https://arkadiuszkamrowski.com SITE_PRODUCTION_HOST=arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run test:static
SITE_BASE_URL=https://arkadiuszkamrowski.com SITE_PRODUCTION_HOST=arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build:astro
npm run test:performance
npx playwright test tests/privacy.spec.ts --list
```

PASS: Astro check (0 errors), build, 22-route static validation, editorial asset/language checks, `node tests/worker-contact.mjs`, `node tests/404-worker.mjs`, `node tests/measurement.mjs`, `node tests/privacy-logging.mjs`, local contact API and predeploy contract tests. Performance budgets pass. Privacy spec discovery now lists 16 cases across four browser projects. The test exercises the rendered required/optional controls, actual serializer, captured payload, actual Worker validation and PL/EN disclosure. Logging tests cover both providers in both backends, including the real 8-second AbortSignal deadline. The local backend remains used by `contact:dev`, Makefile and portability/container examples; it is retained.

Initial local static execution without the CI site environment failed canonical checks; rerunning with the workflow's existing environment passed. Local `playwright install --with-deps` failed on container package-manager permissions; browser download also encountered network timeouts. No test was disabled to accommodate the environment. Browser and accessibility execution must be evidenced by the normal CI job before merge. External-link verification is a separate workflow gate.

Code review: no changes to Worker request behavior, measurement client/server, contact serializer, Wrangler files, secrets or deployment workflows. The local backend removes provider response fragments, arbitrary error messages and untrusted provider IDs from logs. Policy retains eight sections, voluntary/required/optional explanation and accessible direct email. Owner decision/evidence gaps above remain open even after technical checks pass.
