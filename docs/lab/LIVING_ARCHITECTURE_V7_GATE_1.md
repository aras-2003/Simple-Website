# ASTRA / Living Architecture V7 — Gate 0 i Gate 1

Stan: **kandydat do oceny właściciela, bez akceptacji artystycznej**. 2026-10-21.
Branch: `codex/living-architecture-v7-gate-1`, baza `feature/living-architecture-v6` / `b2e2f51`.
V6.4 i wcześniejsze prototypy pozostają dostępne bez zmiany źródeł. Brak merge, promocji i deploymentu.

## Zakres i źródła

Przeczytano w całości `README_FIRST.md` i `PROMPT_FOR_GPT_SOL.md` z dostarczonego `ASTRA_Living_Architecture_V7_Sol_Pack.zip`. Właściciel nadał temu drugiemu dokumentowi rangę nadrzędnej specyfikacji zadania. Obejrzano wszystkie pięć obrazów jako piksele. Instrukcje późniejszych bramek są kontekstem architektury, nie upoważnieniem do wdrożenia ich teraz.

| Obraz | Wniosek z analizy |
| --- | --- |
| 01_TARGET_REFERENCE.jpg — wzorzec pozytywny | Monumentalna, niemal kubiczna sylweta; głębokie wnęki, cofnięty rdzeń, duże chłodne płaszczyzny, ciepłe podcięcia. Precyzja i hierarchia ważniejsze od liczby detali. Nie kopiować rzędów okien ani symetrii. |
| 02_CURRENT_CHAOS.png | Gęsty szkielet docelowy dominuje nad fragmentami; wiele części pozostaje w obrysie finału. Do korekty dopiero w Gate 2. |
| 03_CURRENT_RELATIONSHIPS.png | Mnogość cienkich elementów utrudnia odczyt kierunku relacji. Podświetlony uczestnik nie staje się samodzielnym tematem. |
| 04_CURRENT_DECISIONS.png | Nakładanie i przesłanianie części uniemożliwia czytelny przekaz; opis konkuruje z geometrią. Wymaga osobnego FocusRenderer w późniejszej bramce. |
| 05_CURRENT_FINAL.png — wzorzec negatywny | Powtarzalne komórki, dachy i słupki dają rusztowanie / szafę techniczną. Brak wyraźnej hierarchii mas i zaprojektowanych pustek. |

Oryginalne referencje nie są publikowane z aplikacją. Lokalne porównanie trójstronne zawiera inspirację z pakietu; repozytorium zachowuje wyłącznie rendery własnego prototypu i porównanie starego oraz nowego finału.

## Gate 0 — diagnoza kodu i odtworzenie

Odtworzono V6.4 w Chrome na lokalnym podglądzie: finał `seek=1`, zegar zamrożony, sygnały wyłączone. Rzeczywisty screenshot: `artifacts/living-architecture-v7/old-final.png`. Do porównania z intencją właściciela użyto także dostarczonego `05_CURRENT_FINAL.png`.

**Fakty w kodzie:**

- `src/scripts/lab/v6-4/model.ts` składa 1026 części według powtarzanej reguły zatok, elewacji i ról. Dominują cienkie słupy, przekrycia i drobne listwy. Końcowe położenia są deterministyczne, ale układ makro powstaje z powtarzanej komórki.
- `world.ts` skaluje jedną jednostkową `RoundedBoxGeometry` do wszystkich proporcji. Promień zaokrąglenia deformuje się razem ze skalą; brakuje jednej miary wykończenia krawędzi.
- Jeden `MeshStandardMaterial` obsługuje większość geometrii. Kolor instancji zastępuje rozdzielenie wykończenia i stanu zdarzenia. Emisja jest dodatkowo pochodną jasności koloru.
- Szkic jest generowany z krawędzi wielu części konstrukcyjnych; dlatego czyta się jako klatka.
- Nieuczestniczące elementy są przyciemniane kolorem, ale pozostają nieprzezroczyste i zapisują głębokość. Nie odsłaniają uczestników.
- Gdy inicjator jest przesłonięty, kotwica próbuje innego widocznego uczestnika. To kompromis techniczny, który nie gwarantuje czytelności przyczyny zdarzenia.
- Sterownik poprawnie rozdziela przewijanie i lokalny zegar fazy oraz sprząta zasoby. Te mechanizmy warto później zachować; nie rozwiązują jakości docelowej geometrii.

**Ocena projektowa:** problemem nie jest zbyt mała liczba polygonów. Większa liczba podobnych detali wzmacniałaby ten sam problem. Potrzebny jest projekt końcowych mas i pustek przed rozdrobnieniem do animacji.

Rozważono dwa kierunki: otwartą ramę z mostami oraz bryłę z ciągłych, wzajemnie związanych pasm. Wybrano drugi: pierwszy utrwalałby estetykę rusztowania obecną w V6.4. Nie implementowano dwóch wariantów dla samego porównania.

## Gate 1 — gramatyka nowej bryły

Kanoniczny model: **14 ciągłych mas**, cztery wysokości artykulacji, nominalny obrys **7.2 × 8.1 × 6**. Wspólna siatka proporcji 0.15; podstawowe grubości 0.60 / 0.75. Jest to interpretacja organizacyjnej rzeźby, nie model rzeczywistego budynku ani organizacji.

- Zachodnia część otwiera się do przodu; wschodnia obraca kierunek otwarcia o 90°. Wspólna miara wiąże je bez lustrzanego powielenia.
- Cofnięty, ciągły rdzeń tylny wiąże poziomy. Centralne klucze i progi są rzeczywistymi masami; otwory nie są czarnymi prostokątami na powierzchni.
- Duże przekroje C/L są ciągłymi ekstrudowanymi profilami, z wcięciami i wspornikami. Różne wysięgi i głębokości tworzą kontrolowaną asymetrię.
- Każda masa ma stabilne ID, profil, głębokość, wykończenie, opis funkcji i deklarowane styki. Test sprawdza rzeczywisty kontakt zadeklarowanych par oraz spójność całego obiektu.
- Bevel 0.022 w jednostkach świata; brak niejednorodnego skalowania jednostkowej kostki. Niewielkie zachodzenie zaokrągleń na styku jest świadomym wykończeniem połączenia; test brył nominalnych nie jest testem wszystkich trójkątów beveli.
- Dominują matowy grafit i petrol. Jaśniejszy metal jest ograniczony do cofniętych interfejsów. Ciepłe światło i neutralne wykładziny pozostają we wnękach. Drobne ciemne podziały występują na pasmach przekazujących obciążenie, bez siatki okien i dekoracyjnych cząstek.
- Proceduralne środowisko studyjne, światło główne i kontrowe, cienie oraz ograniczone SSAO. Brak bloom i białego obrysu. To rasteryzacja czasu rzeczywistego, nie render referencyjny z globalnym oświetleniem.

Trzy jawnie wybierane kamery oglądają ten sam obiekt. Zmiana ujęcia nie przestawia modułów. Kamera perspektywiczna ma wspólny obiektyw 30°; na wąskim ekranie zmienia się tylko dopasowanie kadru. Skala głównego ujęcia jest porównywalna z poprzednią, bez pozornego ulepszania przez miniaturyzację obiektu.

## Rzeczywiste rendery i krytyczny audyt

[Trzy ujęcia](living-architecture-v7/evidence/three-views.webp) · [pełny kadr](living-architecture-v7/evidence/primary.webp) · [tył](living-architecture-v7/evidence/reverse.webp) · [bok](living-architecture-v7/evidence/side.webp) · [telefon](living-architecture-v7/evidence/mobile.webp) · [V6.4 obok V7](living-architecture-v7/evidence/old-new.webp).

Trzy przebiegi: (1) masa i pustki — odrzucono zbyt jednolite przekroje i nieczytelne, ciemne wykończenie; (2) różnicowanie głębokości i połączeń — ujawniono zbyt chłodne wnętrza; (3) finalne wykończenie, wnęki, światło i podziały. Zastąpiono kosztowne tablice świateł powierzchniowych prostszymi źródłami wnętrz, zachowując istniejący budżet bez dodawania zależności. Po trzecim przebiegu zatrzymano zmiany artystyczne.

| Poziom | Ustalenie / wpływ | Działanie |
| --- | --- | --- |
| P0, stary model | Powtarzana komórka zamiast projektu makro; przesłonięci uczestnicy i gęsty szkic uniemożliwiają czytelność transformacji. | W Gate 1 zastąpiono model finału. Focus i szkic pozostają świadomie poza zakresem, do Gate 2/3 po akceptacji. |
| P1, pozostałe | Tył ma pełną głębokość, ale szerokie płaszczyzny są spokojniejsze i mniej zniuansowane od inspiracji. Centralne masy nadal mogą wyglądać zbyt blokowo. | Do decyzji właściciela: akceptacja takiej powściągliwości albo dodatkowy przebieg Gate 1 z jednym większym uskokiem tylnej masy i bardziej zróżnicowaną artykulacją rdzenia. Nie kompensować losowymi drobiazgami. |
| P1, pozostałe | Ciepłe wykładziny wnęk są bardziej dominujące niż subtelne podcięcia w inspiracji; mogą czytać się jako złote panele. | Jeśli oczekiwany jest ciemniejszy finał: ograniczyć powierzchnię wykładzin i osłonić źródła światła. Nie uznawać obecnego poziomu za zaakceptowany. |
| P2, pozostałe | Wykończenie ma kontrolowane refleksy, ale nie osiąga złożoności materiałowej obrazu referencyjnego. Brak kierunkowej mikrofaktury szczotkowania; lokalne źródła nie są pełnym GI. | Ewentualnie dopracować roughness / mikrostrukturę po decyzji o bryle, bez zwiększania gęstości części. |
| P2, walidacja | Telefon jest emulacją Chrome. Nie zweryfikowano fizycznego telefonu ani pełnej matrycy przeglądarek V7. | Wykonać przed promocją; obecna bramka nie jest zgodą na wydanie. |

**Ocena:** hierarchia, realne pustki i spójność przestrzenna są wyraźnie lepsze od V6.4. Nie stwierdzam, że jakość artystyczna inspiracji została osiągnięta. Podobieństwo palety ani poprawna topologia nie zastępują akceptacji kompozycji przez właściciela. Audyt wykonał autor implementacji; brak niezależnej oceny artystycznej.

## Implementacja i weryfikacja

Nowe pliki są odizolowane pod `src/scripts/lab/v7/`, osobnym komponentem, CSS i dwiema trasami PL/EN. Brak nowej zależności. Brak zegara, RAF, mapowania scrolla, generatora chaosu, blueprintu czy katalogu eventów. Render następuje przy inicjalizacji, zmianie ujęcia lub rozmiaru. W bezruchu nie powstają kolejne klatki. Reduced motion zachowuje całe statyczne studium. Awaria WebGL i wyłączenie JS pozostawiają uczciwy komunikat i nawigację.

- Pełny `npm run build`: PASS — Astro check, build, statyczne/SEO, editorial, budżety publiczne i laboratoryjne, Worker oraz privacy logging.
- V7: **3 testy modelu PASS** — proporcje/identyfikatory, brak przecięcia nominalnych brył i rzeczywiste styki, spójność i otwarte wnętrza. Próbkowanie pokrywa nominalne ortogonalne profile na ich wspólnej siatce; nie służy do oceny jakości artystycznej.
- V7: **12 testów Chrome PASS** — desktop i emulacja mobile; PL/EN, axe WCAG, klawiatura, wybór kamer, bezruch, 320px, resize, reduced motion, awaria kontekstu, częściowa inicjalizacja, BFcache i brak JS.
- **6 testów zakresu artefaktów PASS**. V7 JS około **149.0 KiB gzip / 240 KiB**. Publiczne limity pozostają bez zmian; wspólne chunk'i są rozliczane w każdym korzystającym z nich prototypie.
- Capture: **0 błędów runtime i 0 ostrzeżeń konsoli** w trzech ujęciach oraz mobilnym. Pomiary w `living-architecture-v7/evidence/render-report.json` obejmują cały łańcuch renderowania, nie tylko końcowy pass: 114 wywołań i 5016 raportowanych trójkątów na pełne odświeżenie. To studium statyczne; nie jest to pomiar czasu ukończenia pracy GPU ani deklaracja osiągów przyszłej animacji.
- Diff sprawdzony; V6.4 i wcześniejsze źródła nie są modyfikowane. **4 testy regresji V6.4 desktop PASS**: PL/EN + WCAG, niezależny zegar faz, impulsy i lokalna odpowiedź geometrii, pełny tył / śledzona adnotacja. To kontrola zakresowa, nie pełna matryca wydania.

## Lokalny podgląd i reprodukcja

```sh
SITE_BASE_URL=https://arkadiuszkamrowski.com REQUIRE_PRODUCTION_SITE=1 npm run build
npm run preview
```

- PL: http://127.0.0.1:4173/lab/living-architecture-v7
- EN: http://127.0.0.1:4173/en/lab/living-architecture-v7
- Ujęcia można też otwierać przez `?view=reverse` i `?view=side`; `?isolate=1` służy wyłącznie do diagnostyki bez UI.

Astro 7 może ponownie wykorzystać już działający daemon na innym porcie; sprawdzić adres wypisany przez `npm run preview`. Dowody w tym raporcie pochodzą z portu 4173.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:living-architecture-v7
V7_CAPTURE_OUTPUT=artifacts/living-architecture-v7/final npm run capture:living-architecture-v7
V7_REFERENCE_DIR=/path/to/extracted/references node scripts/living-architecture-v7-evidence.mjs
```

Skrypt evidence zachowuje rendery i plansze porównawcze. Nie generuje ani nie retuszuje bryły. Kadry porównawcze korzystają z dodatkowych screenshotów z ukrytym UI (ten sam canvas i kamera), są przycięte do modelu i skalowane proporcjonalnie; pełne screenshoty z UI pozostają dostępne. `manifest.json` zawiera SHA-256 źródeł i zapisanych obrazów.

## Obowiązkowe zatrzymanie

Specyfikacja: Gate 1 — **“STOP and request user approval. No full animations or event implementation yet.”**

Do oceny: proporcje, układ mas i pustek, tył, rozkład materiałów oraz intensywność ciepłych wnęk. Gate 2 nie rozpoczyna się bez akceptacji właściciela. Dalsze fragmentowanie powinno być pochodną zatwierdzonych profili; eventy nie mogą zmieniać kanonicznego finału.
