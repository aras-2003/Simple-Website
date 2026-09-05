# Release and deployment approval gate

**Status: RELEASE CANDIDATE — Cloudflare production target selected, public promotion still gated**

Ten dokument opisuje baseline produktu i warunki promocji do produkcji. Szczegółowy operator runbook znajduje się w `docs/PRODUCTION_LAUNCH_RUNBOOK.md`, a model branch/environment w `docs/ENVIRONMENTS.md`.

## Aktualny baseline produktu

1. **Pozycjonowanie** — osobista platforma executive / thought-leadership Arkadiusza Kamrowskiego, a nie katalog usług ani CV online.
2. **Narracja** — problem → dowody → perspektywa → synteza OAF → praktyka → autor → kontakt.
3. **Języki** — kompletne wersje polska i angielska w jednym release.
4. **Kontakt** — formularz i same-origin `/api/contact`; LinkedIn pozostaje kanałem pomocniczym.
5. **Analytics** — brak reklam, trackerów i analityki w baseline'ie.
6. **Frontend** — Astro SSG + TypeScript, statycznie generowane strony bez klientowego frameworka aplikacyjnego.
7. **Production runtime** — Cloudflare Workers + Static Assets; Worker obsługuje dynamiczny kontakt i wybrane canonicalization paths.
8. **Canonical production origin** — `https://arkadiuszkamrowski.com`; `www` jest redirect-only.
9. **Repo / branch model** — `aras-2003/Simple-Website`: `main` = integration only, `staging` = release candidate, `production` = production release.
10. **Production config contract** — `wrangler.production.jsonc` + `.env.production.example`; sekrety wyłącznie w Cloudflare/CI secret store.
11. **Staging contract** — `wrangler.staging.jsonc`, `staging.arkadiuszkamrowski.com`, osobne sekrety/Turnstile i obowiązkowe noindex + Cloudflare Access.

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
- kontrola zewnętrznych referencji;
- testy `worker/index.mjs`: Origin, validation, body ceiling, timing, Turnstile, rate limit, Resend, failure paths, 308, asset fallback oraz staging `noindex` / `robots.txt`;
- test legacy contact adapter tylko jako portability regression;
- test produkcyjnego predeploy contract bez logowania sekretów;
- Wrangler dry-run dla preview, staging i production config;
- automated WCAG 2.2 A/AA;
- Chromium, Firefox, WebKit smoke;
- performance budget.

Kontenerowe E2E/Trivy nie są produkcyjnym gate'em. Docker/NGINX/Kubernetes pozostają reference-only.

## Staging acceptance gates

Przed promocją `staging → production` wymagane są:

- staging Worker zbudowany wyłącznie z brancha `staging`;
- Cloudflare Workers Builds: non-production branch builds OFF;
- staging Custom Domain/cert PASS;
- Cloudflare Access PASS;
- `X-Robots-Tag: noindex, nofollow, noarchive` PASS;
- `/robots.txt` = `Disallow: /`;
- core routes / PL+EN / 404 / 308 PASS;
- osobny staging Turnstile + hostname PASS;
- realny staging contact smoke, jeśli contact delivery jest aktywowane;
- manual browser/accessibility acceptance na release candidate.

## Manualne production pre-launch gates

Wymagane przed publicznym GO:

- PR `staging → production` na zaakceptowanym commit lineage;
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

## Reguła promocji

```text
feature/*
  → PR + green CI
main
  → PR/promote + green CI
staging
  → Cloudflare staging + acceptance
  → PR to production
production
  → Cloudflare production + public smoke
  → GO
```

`main` **nigdy nie jest automatycznym źródłem deploymentu staging ani production**.

Szczegółowe kryteria PASS/FIX i rollback: `docs/PRODUCTION_LAUNCH_RUNBOOK.md`.
