# Quality Audit

## Creative director audit
| Problem | Severity | Wpływ | Priorytet | Konkretna poprawka |
|---|---|---|---|---|
| Brak autorskiej fotografii / portretu | Medium | Mniej „human signal” i zaufania | P1 | Dodać 1 portret editorial, nie stock; hero może pozostać typograficzny |
| OAF pozostaje working modelem v1 | Low | Zakres świadomie ograniczony względem przyszłego pełnego frameworka | P2 | Rozwinąć nazwę, metamodel i osobną stronę `/oaf` w v2, bez blokowania v1 |
| Brak case studies | Medium | Mniej dowodów wykonawczych | P1 | Dodać 2–3 anonimizowane case studies: problem → decyzja → outcome |
| Brak wersji EN | Low/Medium | Mniejszy zasięg międzynarodowy | P2 | Dodać /en po stabilizacji copy PL |
| Brak analytics | Low na start | Brak danych o konwersji | P2 | Włączyć dopiero po decyzji privacy/consent; preferować privacy-first |

## Pre-launch audit
- Visual quality / storytelling: **PASS**
- UX i CTA: **PASS**
- Responsive desktop/mobile: **FIX przed deployem — statyczny layout zweryfikowany, ale wymagany real-browser pixel audit na macOS/CI; Chromium w sandboxie ChatGPT nie uruchomił się stabilnie**
- Reduced motion: **PASS**
- Accessibility baseline: **PASS**
- SEO baseline: **PASS lokalnie; FIX domain/canonical przed deployem**
- Security headers: **PASS w NGINX**
- Container non-root: **PASS w konfiguracji**
- Kubernetes probes/resources/PDB/HPA: **PASS w konfiguracji**
- Production DNS/TLS: **FIX przed deployem**
- Analytics/tracking: **PASS — celowo wyłączone**
- OAF v1 copy: **PASS — zatwierdzony jako working model**
