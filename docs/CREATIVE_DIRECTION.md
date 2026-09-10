> Superseded for the ASTRA frontend/content refactor by [ASTRA_IMPLEMENTATION.md](ASTRA_IMPLEMENTATION.md). Deployment safeguards remain in force. Tag waived; changes stay on feature branch.

# Creative Direction

## Cel biznesowy

Zbudować osobistą platformę executive advisory Arkadiusza Kamrowskiego, która w pierwszych 6–10 sekundach komunikuje trzy rzeczy:

1. **dla kogo** — CEO, CIO/CTO i liderzy transformacji / enterprise architecture;
2. **jaki problem** — utrata spójności pomiędzy strategią, modelem działania, architekturą, portfelem i wykonaniem;
3. **jaka wartość** — mniej konkurujących priorytetów, jaśniejsze prawa decyzyjne, lepsze sekwencjonowanie inwestycji i krótsza droga od kierunku do rezultatu.

Drugorzędne zastosowania: thought leadership, speaking, networking, rozwój OAF i publikowanie własnych idei.

## Główny użytkownik

Primary:
- CEO / członek zarządu;
- CIO / CTO;
- transformation leader;
- head of enterprise architecture / strategy / portfolio.

Secondary:
- konsultant strategiczny;
- senior enterprise architect;
- organizator konferencji / debaty;
- osoba szukająca pogłębionego materiału o OAF i operating modelu.

## Value proposition

**„Pomagam leadership teamom znaleźć miejsca, w których strategia, model operacyjny, architektura, portfel i wykonanie przestają się ze sobą zgadzać — i przeprojektować system decyzji, który je ponownie łączy.”**

Skrót marki:

**strategy → decision architecture → execution**

OAF jest zapleczem metodycznym tej pracy, nie pierwszym produktem, który odwiedzający ma zrozumieć.

## Emocja marki

Spokój kompetencji, intelektualna precyzja, zdolność do upraszczania złożoności i lekka prowokacja.

Marka ma wyglądać jak senior operator rozmawiający z innym senior operatorem — nie jak boutique agency udająca luksus, dashboard SaaS ani framework-consultancy sprzedająca własne akronimy.

## Visual narrative

Kierunek: **executive systems engineering**.

Podstawowe motywy:

- punkty decyzyjne;
- cienkie ścieżki i połączenia;
- handoffy między funkcjami;
- feedback loops;
- blueprinty current-state / target-state;
- numerowane evidence rails;
- małe sygnały ryzyka / tarcia;
- duża editorial typography przeciwstawiona precyzyjnej grafice systemowej.

Strona nie może być „tekst, tekst i jeszcze tekst”. Każdy abstrakcyjny blok o wysokiej wadze powinien mieć wizualny nośnik:

- problem systemowy → decision-system map;
- sytuacje wejścia → duże trigger quadrants;
- rezultaty → output blueprint;
- cases → friction → shift → value;
- OAF → circular model + linear mobile fallback.

## Kompozycja

Nie stosujemy ściany kart.

Preferowane układy:

- editorial split;
- szerokie rails;
- duże, asymetryczne pola;
- systemowe diagramy na ciemnym tle;
- numerowane moduły oddzielane linią zamiast radius/shadow;
- whitespace jako pauza pomiędzy decyzjami, nie pustka dekoracyjna.

Home ma być bardziej filmowy/eye-catching niż wcześniej, ale bez utraty czytelności. Największa ekspresja wizualna jest w hero/system map i output blueprint; reszta strony ma odzyskiwać spokój.

## Kolor i materiały

Bazą pozostaje matowa, ciepła paleta:

- warm paper / stone;
- niemal czarny ink;
- moss / sage jako sygnał funkcjonalny;
- głęboki cocoa jako pomocniczy materiał marki.

Unikamy przypadkowych gradientów, neonów, glassmorphismu i „AI glow”.

Materiały powinny kojarzyć się z papierem, deską decyzyjną, blueprintem i technicznym szkicem — nie z aplikacją webową.

## Typografia

System font stack (Helvetica Neue / Helvetica / Arial), bez zewnętrznych fontów: prywatność, wydajność, brak FOIT/FOUT.

Hierarchia:

- bardzo duże, zwarte nagłówki dla tez;
- 17–20 px dla głównego executive lead;
- 13–15 px dla treści roboczej;
- 9–11 px uppercase dla metadanych, indeksów i nazw artefaktów.

Akapity mają ograniczoną szerokość. Nie powtarzamy tej samej tezy w headline + lead + body innymi słowami.

## Motion language

Ruch jest systemem, ale bardzo lekkim:

- przepływ na liniach decision-system map;
- subtelny pulse w punktach handoff / risk;
- krótkie hover/focus transitions;
- naturalny scroll.

Nie ma:

- scroll hijackingu;
- custom cursora;
- reveal-on-scroll jako obowiązkowego sposobu czytania;
- ciężkich bibliotek motion;
- animacji, które opóźniają dostęp do treści.

`prefers-reduced-motion` wyłącza animowane przepływy i przejścia niekonieczne do obsługi.

## Język fotografii

Portret pozostaje głównie na About. Home nie powinien zamieniać się w klasyczną stronę „consultant headshot + quote”.

Jeśli w przyszłości dodawane są fotografie, preferowane są:

- prawdziwe konteksty wystąpień / pracy;
- architektura przestrzeni / systemów jako materiał narracyjny;
- detale, diagramy, notatki, whiteboardy;
- unikanie stockowych zdjęć sal konferencyjnych i „executive handshake”.

## Zasada jakości

Każdy element wizualny musi robić przynajmniej jedną rzecz:

- skracać czas zrozumienia;
- pokazywać relację, której tekst nie pokazuje tak dobrze;
- wzmacniać hierarchię;
- budować charakter marki;
- pomagać podjąć decyzję o kolejnym kroku.

Jeśli grafika jest tylko ozdobą, nie powinna trafić do produkcji.
