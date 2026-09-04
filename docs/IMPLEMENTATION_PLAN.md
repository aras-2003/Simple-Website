# Implementation Plan

## 1. Ocena assets i istniejącego projektu — DONE
Repo `Simple-Website` jest puste; nie było kodu do zachowania. Dołączone screeny potraktowano jako instrukcję jakości: creative direction → experience architecture → build → studio audit → final audit.

## 2. Architektura i design tokens — DONE
Static-first, zero framework runtime dependency; system tokenów CSS; semantyczna struktura HTML.

## 3. Layout + responsive — DONE
Hero, About, OAF, Point of View, Focus Areas, Signals, Contact. Breakpointy 960 / 620 oraz fluid type/spacing.

## 4. Treści — DONE / APPROVED
Copy oparty na publicznym LinkedIn i informacjach właściciela. OAF został zatwierdzony jako autorski working model bez rozwijania skrótu w v1.

## 5. Media — DONE for v1
Brak stocków i zależności od zewnętrznych CDN. Autorski OG card oraz favicon generowane lokalnie. Portret rekomendowany w v2 po dostarczeniu właściwego zdjęcia.

## 6. Motion — DONE
IntersectionObserver reveal, hero system scan, hover states, reduced-motion fallback.

## 7. Performance / SEO / accessibility — DONE baseline
Brak zewnętrznych fontów, trackingu i ciężkiego JS. Canonical/OG/JSON-LD/sitemap/robots, skip link, focus, labelled nav, heading hierarchy.

## 8. Testy — DONE baseline
`make test`, YAML parse, render K8s template. Browser smoke script działa lokalnie na Chrome/Chromium; bieżący sandbox ChatGPT nie kończy procesu headless Chromium, dlatego visual fallback został sprawdzony przez renderer statyczny.

## 9. Deployment — APPROVED / OPERATIONAL PREREQUISITES REMAIN
`docs/DEPLOY_APPROVAL.md` jest zatwierdzony. Repozytorium i branch produkcyjny: `aras-2003/Simple-Website` / `main`. Do realnego Azure cut-over pozostają wyłącznie kroki operacyjne: subscription/OIDC bootstrap, GitHub Environment, DNS i TLS.
