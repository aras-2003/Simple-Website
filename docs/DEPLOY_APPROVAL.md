# Release and deployment approval gate

**Status: RELEASE CANDIDATE — public deployment disabled**

Ten dokument opisuje aktualny baseline produktu i warunki promocji do produkcji. Nie zatwierdza konkretnej platformy hostingowej przed zakończeniem hardeningu, audytu doświadczenia i decyzji operacyjnej.

## Aktualny baseline produktu

1. **Pozycjonowanie** — osobista platforma executive / thought-leadership Arkadiusza Kamrowskiego, a nie katalog usług ani CV online.
2. **Narracja** — problem → dowody → perspektywa → synteza OAF → praktyka → autor → kontakt.
3. **Języki** — kompletne wersje polska i angielska są częścią tego samego release'u i utrzymują równoległą architekturę informacji.
4. **Kontakt** — formularz kontaktowy i izolowany contact API są częścią produktu; LinkedIn pozostaje kanałem pomocniczym.
5. **Analytics** — brak reklam, trackerów i analityki w baseline'ie. Dodanie telemetryki wymaga osobnej decyzji privacy/compliance.
6. **Frontend** — Astro SSG + TypeScript; publiczne strony są generowane statycznie i serwowane bez klientowego frameworka aplikacyjnego.
7. **Runtime** — hardened non-root NGINX dla statycznego frontu oraz mały, odseparowany contact API.
8. **Canonical release origin** — automatyczne buildy release-candidate używają `https://arkadiuszkamrowski.com`. Zmiana domeny wymaga aktualizacji konfiguracji produkcyjnej, canonicali, hreflang, social metadata, DNS/TLS i testów release.
9. **Repo / branch produkcyjny** — `aras-2003/Simple-Website`, `main`. Zmiany release-candidate trafiają przez PR i obowiązujące quality gates.

## Decyzja hostingowa

Publiczny deployment pozostaje wyłączony do czasu świadomego wyboru modelu operacyjnego.

Dopuszczone kierunki do decyzji:

- **preferowany dla tego workloadu:** edge/CDN lub static hosting dla frontu + mały serverless/container runtime dla contact API + zarządzane sekrety,
- **reference / future-ready:** Kubernetes / AKS, jeżeli istnieje uzasadnienie platformowe, demonstracyjne lub wspólna infrastruktura, która redukuje koszt operacyjny.

Dedykowany klaster AKS nie jest wymaganiem produktu. Manifesty Kubernetes i wyłączony workflow Azure pozostają reference architecture i testem przenośności, a nie domyślnym celem produkcyjnym.

## Automatyczne release gates

Przed merge'em release-candidate do `main` wymagane są:

- deterministyczna instalacja przez committed lockfile i `npm ci`,
- `astro check` bez błędów,
- production build z guardem właściwego canonical origin,
- statyczne testy IA, SEO, social metadata, privacy i linków wewnętrznych,
- kontrola zewnętrznych referencji,
- testy contact API, w tym validation, origin, rate limiting, timing i failure paths,
- automatyczny WCAG 2.2 A/AA audit,
- smoke tests Chromium, Firefox i WebKit,
- runtime E2E przez realny NGINX → contact API,
- skany obrazów kontenerowych Trivy bez HIGH/CRITICAL zgodnie z polityką CI.

## Manualne pre-launch gates

Automatyczne CI nie zastępuje następujących kontroli:

- VoiceOver + Safari,
- NVDA + Chrome lub Firefox,
- keyboard-only navigation,
- zoom 200–400% i reflow przy 320 px,
- reduced motion / high contrast,
- finalne przejście formularza z realnym providerem poczty,
- weryfikacja social preview i danych strukturalnych,
- finalny przegląd informacji o prywatności i podstawy prawnej formularza,
- potwierdzenie DPA / transferów dla dostawcy poczty, jeżeli mają zastosowanie,
- konfiguracja i weryfikacja domeny wysyłkowej: SPF, DKIM i DMARC,
- DNS, TLS, redirect/canonical policy i monitoring po uruchomieniu.

## Sekrety i dane operacyjne

W repo nie przechowujemy sekretów produkcyjnych. Realna wysyłka wymaga konfiguracji providera poczty oraz odpowiednich sekretów po stronie platformy docelowej. Publiczny deployment nie może opierać się na długowiecznych poświadczeniach zapisanych w kodzie lub workflow.

## Reguła promocji

`feature/hardening branch → PR → wszystkie automatyczne gates zielone → final experience audit → manual pre-launch checks → decyzja hostingowa → main → production promotion`

Nie promujemy zmian do produkcji tylko dlatego, że build się kompiluje. Release wymaga jednocześnie jakości doświadczenia, bezpieczeństwa, accessibility, compliance i operacyjnej proporcjonalności rozwiązania.
