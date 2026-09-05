# Release and deployment approval gate

**Status: RELEASE CANDIDATE — Cloudflare production target selected, public promotion still gated**

Ten dokument opisuje baseline produktu i warunki promocji do produkcji. Szczegółowy operator runbook znajduje się w `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.

## Aktualny baseline produktu

1. **Pozycjonowanie** — osobista platforma executive / thought-leadership Arkadiusza Kamrowskiego, a nie katalog usług ani CV online.
2. **Narracja** — problem → dowody → perspektywa → synteza OAF → praktyka → autor → kontakt.
3. **Języki** — kompletne wersje polska i angielska w jednym release.
4. **Kontakt** — formularz i same-origin `/api/contact`; LinkedIn pozostaje kanałem pomocniczym.
5. **Analytics** — brak reklam, trackerów i analityki w baseline'ie.
6. **Frontend** — Astro SSG + TypeScript, statycznie generowane strony bez klientowego frameworka aplikacyjnego.
7. **Production runtime** — Cloudflare Workers + Static Assets; Worker obsługuje tylko dynamiczny kontakt i wybrane canonicalization paths.
8. **Canonical origin** — `https://arkadiuszkamrowski.com`; `www` jest redirect-only.
9. **Repo / branch produkcyjny** — `aras-2003/Simple-Website`, `main`.
10. **Production config contract** — `wrangler.production.jsonc` + `.env.production.example`; sekrety wyłącznie w Cloudflare/CI secret store.

## Decyzja hostingowa

**Zatwierdzony v1 target:** Cloudflare Workers + Static Assets.

Uzasadnienie:

- workload jest statyczny poza jednym małym endpointem;
- Cloudflare już pełni rolę DNS/security edge;
- Worker eliminuje osobny origin, NGINX, registry, container lifecycle i origin-bypass;
- Turnstile i Resend mapują się bezpośrednio na stateless Worker API;
- rozwiązanie jest proporcjonalne kosztowo i operacyjnie.

Azure Static Web Apps + Functions pozostaje preferowaną alternatywą, jeśli Azure governance stanie się wymaganiem. Azure Container Apps i Kubernetes/AKS są reference/future-ready dla workloadu, który rzeczywiście wymaga kontenerów.

## Automatyczne release gates

Przed merge'em do `main` wymagane są:

- deterministyczne `npm ci` z committed lockfile;
- `astro check` + production build z canonical guard;
- testy IA/SEO/social/privacy/linków;
- kontrola zewnętrznych referencji;
- testy produkcyjnego `worker/index.mjs`: Origin, validation, body ceiling, timing, Turnstile, rate limit, Resend, failure paths, 308 i asset fallback;
- test legacy contact adapter tylko jako portability regression;
- test produkcyjnego predeploy contract bez logowania sekretów;
- Wrangler dry-run dla preview i production config;
- automated WCAG 2.2 A/AA;
- Chromium, Firefox, WebKit smoke;
- performance budget.

Kontenerowe E2E/Trivy nie są już produkcyjnym gate'em. Docker/NGINX/Kubernetes pozostają reference-only.

## Manualne pre-launch gates

Wymagane przed publicznym GO:

- VoiceOver + Safari;
- NVDA + Chrome/Firefox;
- keyboard-only;
- zoom 200–400% / 320px reflow;
- reduced motion / high contrast;
- produkcyjny Turnstile + realna dostawa przez Resend;
- social preview i structured data;
- finalny privacy/legal review;
- SPF/DKIM/DMARC;
- apex Workers Custom Domain i certyfikat;
- proxied `www` redirect-only DNS + exact 308;
- public `make smoke-production`;
- Workers observability, Cloudflare alerting i rollback path.

## Sekrety i dane operacyjne

W repo nie przechowujemy sekretów produkcyjnych.

Worker secrets:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

GitHub/CI deployment credentials, jeśli używane, muszą być minimalnie uprawnione i przechowywane w sekretnym store. `PUBLIC_TURNSTILE_SITE_KEY` jest publicznym build value, nie sekretem.

Nie logujemy visitor email/message body, Turnstile tokenów ani prywatnych kluczy.

## Reguła promocji

`branch → PR → green CI → final experience audit → production preflight → Worker preview → manual pre-launch checks → main → guarded production deployment → public smoke → GO`

Szczegółowe kryteria PASS/FIX i rollback: `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.
