# Design System

## Tokens
- **Ink** `#0B0D0F` — podstawowe tło i tekst na jasnych sekcjach.
- **Paper** `#F2EEE6` — ciepły off-white zamiast klinicznej bieli.
- **Signal blue** `#4169FF` — zaznaczenie / selection; nie jako dekoracyjny gradient.
- **Signal green** `#B6FF6A` — punkt napięcia, małe znaczniki i stany sygnałowe.
- **Spacing** — płynny `--pad` i `--section`; rytm 20/28/36/54/72+.
- **Radius** — 2 px; celowo techniczny, bez „pill UI”.

## Grid
Maksymalna szerokość 1440 px, 4-kolumnowy blueprint w tle oraz kompozycje 2-kolumnowe dla sekcji narracyjnych. Mobile nie skaluje desktopu — przebudowuje layout do jednej kolumny.

## Type hierarchy
- H1: `clamp(48px, 6.3vw, 104px)`, line-height 0.94.
- H2: `clamp(38px, 5vw, 76px)`, line-height 1.
- Lead: 18–23 px.
- Body: 14–18 px.
- Labels: 9–11 px, uppercase, większy tracking.

## Components
Header, mobile nav, primary/quiet button, section label, architecture-system node, OAF step, principle, timeline row, focus row, footer. Nie używamy kart jako domyślnego kontenera treści.

## Interaction states
- Hover: maks. 2 px ruchu / subtelna zmiana obramowania.
- Focus: 2 px `signal green`, 4 px offset.
- Reduced motion: wszystkie animacje skrócone praktycznie do zera, reveal ustawiony jako widoczny.
