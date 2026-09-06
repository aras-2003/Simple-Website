# Release and deployment approval gate

**Status: RELEASE CANDIDATE — Cloudflare production target selected, public promotion still gated**

Ten dokument opisuje baseline produktu i warunki promocji do produkcji. Szczegółowy operator runbook znajduje się w `docs/PRODUCTION_LAUNCH_RUNBOOK.md`, model branch/environment w `docs/ENVIRONMENTS.md`, a kierunek content/design w `docs/EXECUTIVE_CONTENT_STRATEGY.md`.

## Aktualny baseline produktu

1. **Pozycjonowanie** — osobista platforma executive advisory + thought leadership dla problemów przecinających strategię, operating model, enterprise architecture, portfel i wykonanie.
2. **Narracja komercyjna** — executive tension → outcome → konkretne outputs → proof → method/OAF → deeper thinking → contact.
3. **OAF** — named method / intellectual product wspierający pracę, ale nie pierwszy element, który CEO/CIO musi zrozumieć.
4. **Współpraca / Advisory** — trzy formaty wejścia: Diagnostic, Design, Advisory; nie jest to sztywny katalog pakietów.
5. **Języki** — kompletne wersje polska i angielska w jednym release.
6. **Kontakt** — formularz i same-origin `/api/contact`; LinkedIn pozostaje kanałem pomocniczym.
7. **Analytics** — brak reklam, trackerów i analityki w baseline'ie.
8. **Frontend** — Astro SSG + TypeScript, statycznie generowane strony bez klientowego frameworka aplikacyjnego.
9. **Production runtime** — Cloudflare Workers + Static Assets; Worker obsługuje dynamiczny kontakt i wybrane canonicalization paths.
10. **Canonical production origin** — `https://arkadiuszkamrowski.com`; `www` jest redirect-only.
11. **Repo / branch model** — `main` = integration only, `staging` = release candidate, `production` = production release authority.
12. **Production deployment v1** — manualny, jawnie uruchamiany z `production`; merge do `production` sam nie publikuje strony.
13. **Staging contract** — `wrangler.staging.jsonc`, `staging.arkadiuszkamrowski.com`, osobne Turnstile/secrets, noindex i Cloudflare Access.

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

CI działa na PR-ach oraz pushach do `main`, `staging` i `production`.

Wymagane są:

- deterministyczne `npm ci` z committed lockfile;
- `astro check` + canonical production build guard;
- osobny staging build z canonical `https://staging.arkadiuszkamrowski.com`;
- testy IA/SEO/social/privacy/linków;
- executive content-architecture gates dla Home / Advisory / OAF;
- kontrola zewnętrznych referencji;
- testy `worker/index.mjs`: Origin, validation, body ceiling, timing, Turnstile, rate limit, Resend, failure paths, 308, asset fallback oraz staging `noindex` / `robots.txt`;
- test produkcyjnego predeploy contract bez logowania sekretów;
- Wrangler dry-run dla preview, staging i production config;
- automated WCAG 2.2 A/AA;
- Chromium, Firefox, WebKit smoke;
- desktop/mobile visual-audit captures;
- performance budget;
- `Release Policy` dla dozwolonej ścieżki promocji branchy.

Kontenerowe E2E/Trivy nie są produkcyjnym gate'em. Docker/NGINX/Kubernetes pozostają reference-only.

## Content / experience acceptance gates

Przed promocją nowego kierunku do stagingu wymagane są:

- hero jasno komunikuje audience + problem + outcome;
- primary CTA prowadzi do `Współpraca / Advisory`;
- visitor może rozpoznać konkretne outputs bez czytania OAF;
- Home nie wraca do długiego ciągu tekstowych sekcji;
- decision-system map, output blueprint i case flows działają bez JS;
- mobile nie ma horizontal scroll;
- `prefers-reduced-motion` wyłącza animowany flow/pulse;
- case studies nie zawierają wymyślonych KPI, nazw/logotypów klientów ani pseudo-precyzji;
- PL/EN zachowują ten sam sens komercyjny, nie tylko literalne tłumaczenie;
- live staging przechodzi ręczny 6-second / 30-second / 2-minute scan test.

## Staging acceptance gates

Przed promocją `staging → production` wymagane są:

- staging Worker zbudowany wyłącznie z brancha `staging`;
- Cloudflare Workers Build: non-production branch builds OFF;
- staging Custom Domain/cert PASS;
- Cloudflare Access PASS;
- `X-Robots-Tag: noindex, nofollow, noarchive` PASS;
- `/robots.txt` = `Disallow: /`;
- core routes / PL+EN / 404 / 308 PASS;
- osobny staging Turnstile + hostname PASS;
- realny staging contact smoke, gdy contact delivery jest aktywowane;
- manual browser/accessibility acceptance na release candidate;
- content/visual acceptance po realnym renderze stagingu.

## Manualne production pre-launch gates

Wymagane przed publicznym GO:

- PR `staging → production` na zaakceptowanym commit lineage;
- jawny manual production deploy uruchomiony wyłącznie z `production`;
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

Staging i production posiadają osobne zestawy sekretów. Produkcyjnego `TURNSTILE_SECRET_KEY` nie wolno używać na stagingu.

Worker secrets per environment:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

GitHub/CI deployment credentials, jeśli używane, muszą być minimalnie uprawnione i przechowywane w secret store. `PUBLIC_TURNSTILE_SITE_KEY` jest publicznym build value, nie sekretem.

Nie logujemy visitor email/message body, Turnstile tokenów ani prywatnych kluczy.

## GitHub controls — proporcjonalne do jednoosobowego repo

Repo pozostaje prywatne na GitHub Free i ma jednego maintainer'a. Hard branch protection/rulesets nie są obecnie częścią dostępnego planu.

Zamiast sztucznej biurokracji obowiązują:

- PR-y jako standard pracy;
- `Release Policy` dla promotion paths;
- full CI przed merge;
- brak direct push do `main`, `staging`, `production` jako operating convention;
- `main` nie jest źródłem żadnego deploymentu;
- staging deployuje tylko `staging`;
- production deployment wymaga jawnego workflow dispatch z `production`.

## Reguła promocji

```text
short-lived branch
  → PR + green CI
main
  → PR/promote + green CI
staging
  → automatic Cloudflare staging + acceptance
  → PR to production
production
  → explicit manual Cloudflare production deploy
  → public smoke
  → GO
```

`main` **nigdy nie jest automatycznym źródłem deploymentu staging ani production**.

Szczegółowe kryteria PASS/FIX i rollback: `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.
