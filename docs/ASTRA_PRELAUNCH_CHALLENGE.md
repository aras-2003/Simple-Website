> **Historical decision/source record.** Claims and instructions below describe an earlier checkpoint, not current branch, runtime or launch state. The refactor is merged. Current truth: [PRODUCT.md](PRODUCT.md), [PROOF_RELEASE.md](PROOF_RELEASE.md), [PROOF_SOURCES.md](PROOF_SOURCES.md).

# ASTRA pre-launch challenge

## Executive Summary

**Status: audyt źródeł i decyzje do przebudowy; implementacja UI nie rozpoczęta.**

Strona ma właściwy obszar problemowy, ale nadal sprzedaje sposób myślenia lepiej niż współpracę. Najsilniejszy materiał jest już w repozytorium: budżet jako test strategii, rezygnacja jako warunek priorytetu oraz kontrakt decyzji obejmujący właściciela, dowody i warunek ponownego rozpatrzenia. Ten ostatni znajduje się w nieużywanym module `oaf-operating-model.ts`.

Decyzja: marka osobista doradcy pracującego nad konkretnymi wyborami zarządu. OAF pozostaje zapleczem. Home rozpoznaje problem i pokazuje człowieka; Advisory określa przedmiot współpracy; Perspective dostarcza samodzielnych idei. Redesign powinien usunąć część diagramów, nie zwiększać ich liczbę.

Wykryto również dwa istotne błędy treści wizualnej: osie macierzy portfelowej nie zgadzają się z opisami ćwiartek, a schemat analizy potencjalnego przyjęcia euro sugeruje ocenę wykonanej zmiany. Istniejące testy nie sprawdzają tych znaczeń. Sprawdzają natomiast obecność diagramów i niektórych sekcji przeznaczonych do usunięcia.

**Ograniczenia wykonania:** dostęp Git z terminala i próba przygotowania zależności zostały zakończone komunikatem środowiska `network approval was cancelled before a decision was returned`. Integracja GitHub umożliwiła pobranie źródeł i odczyt CI, ale nie udostępnia tworzenia tagów. Wymóg zdalnego backup branch **i tagu przed pierwszą zmianą implementacyjną** pochodzi z punktu 22 aktualnej misji. Nie został zastąpiony słabszym zabezpieczeniem. Brak możliwości potwierdzenia pełnego build/browser baseline jest jawny poniżej.

## Kontekst i metoda

- Repozytorium: `aras-2003/Simple-Website`.
- Referencja: `main`, commit `32aca86ed6b0f03e4e84f9ec65d4a23cb6fa1d6a`.
- Drzewo commitu: `cbfb2be15fabe1873b500573b64ec8d87d06157a`.
- Pobrano wszystkie **165 plików** snapshotu, w tym binarne assets. SHA-1 każdego obiektu Git blob porównano z manifestem API: **165 zgodnych, 0 różnic**.
- Workspace początkowo nie zawierał checkoutu. Lokalna kopia jest snapshotem zweryfikowanym względem GitHub, nie pełnym klonem historii. Nie deklarujemy `git status: clean` dla nieistniejącego klonu.
- Nie znaleziono `AGENTS.md` w drzewie repozytorium.
- Przegląd objął kompozycje wszystkich stron PL/EN, osiem plików czterech esejów, modele treści i ich użycia, komponenty wizualne, kaskadę CSS, SEO, kontakt, testy oraz kontrakt wydania. Nie zastępuje to renderowanej kontroli wizualnej.
- Obejrzano osiem dostarczonych obrazów oraz używany portret. Siedem screenshotów zawiera instrukcje projektowe, a nie referencyjne realizacje stron. Zdjęcie jest autentycznym materiałem dostarczonym przez właściciela; nie potrzeba generować zastępczego wizerunku.
- Repozytorium zawiera 20 komponentów Astro, 9 głównych modułów treści TypeScript oraz 15 plików CSS. `site.css` importuje 14 arkuszy; razem źródła CSS zajmują 110 303 bajty. To rozmiar źródeł, nie wynik pomiaru bundle.

## Analiza: weryfikacja hipotez A–G

| Hipoteza | Werdykt | Dowód i konsekwencja |
|---|---|---|
| A. Niejasny produkt | Potwierdzona częściowo | `ExecutiveEngagement` ma `when` i `outputs`, więc rezultaty nie są całkiem nieobecne. Brak przebiegu, wkładu klienta i końcowej decyzji. Uzupełnić te pola; nie porzucać trzech formatów bez powodu. |
| B. Nadmierna rola OAF | Potwierdzona | `Header.astro`: OAF jest drugim linkiem. `NotePage.astro`: jedyny końcowy button prowadzi do OAF. Usunąć OAF z primary nav; zachować route i indeksowanie. |
| C. Powtarzalność | Potwierdzona z korektą | Home ma pięć outputów i trzy cases. Advisory ma trzy formaty, macierz i trzy cases; tylko przypadek portfelowy jest wspólny dla obu wybranych zestawów. Powtarza się znaczenie, nie cały identyczny katalog. About opowiada tę samą trajektorię w hero, prozie i career river. |
| D. Monotonia grafik | Potwierdzona w kodzie; ocena renderu otwarta | Home: system map, pięć miniatur outputów i OAF. Advisory: delta systemu, macierz i trzy schematy proof. Dominują etykiety, linie, obramowane pola i strzałki. Nie brakuje komponentów graficznych. |
| E. Słaby sygnał człowieka | Potwierdzona | Home nie ma portretu ani osobistego bloku. About ma portret, ale także dodatkowy blok wyjaśniający „rolę marki”. Istnieją rzeczywista trajektoria i przekonania, brak udokumentowanej anegdoty lub punktu zwrotnego. |
| F. Nakładanie się esejów i meta-content | Potwierdzona | EA, portfel i transformacja wracają do właściciela, finansowania i feedbacku. AI ma bardziej odrębny problem. Perspective odsuwa teksty za research lens i benchmarki, potem wyjaśnia standard publikacji i odsyła do OAF. |
| G. Rozproszone modele treści | Potwierdzona z korektą | Typowanie istnieje poza Writing (`Record<Locale, ...>` i typy elementów); nie jest prawdą, że tylko Writing ma jakąkolwiek kontrolę. Tylko Writing ma schema validation. `editorial` nie wymusza wspólnego kontraktu obu języków; długie treści są również w komponentach. |

## Dziesięć odpowiedzi challenge

### 1. Jaka jest unikalna teza?

**Budżet, lista rezygnacji i prawa decyzyjne są testem strategii — pomagam zarządom przeprojektować je razem z technologią i sposobem pracy, tak aby wybrany kierunek dało się wykonać.**

EN: **Funding, the work you stop and decision rights are the test of strategy; I help leadership teams redesign them alongside technology and ways of working so the chosen direction can be executed.**

To konkretyzuje hipotezę misji: zamiast samego „łączenia strategii z wykonaniem” pojawia się przedmiot interwencji i trudny wybór. Źródła: esej portfelowy, `case-studies.ts`, `executive.ts` i kontrakt w `oaf-operating-model.ts`. Nie jest to dowód wyłączności rynkowej. Bez porównawczego badania konkurencji nie da się uczciwie twierdzić, że nikt inny nie używa podobnej tezy. Odrębność ma powstać z jej konsekwentnego zastosowania i wiarygodnego materiału osobistego.

### 2. Czym dokładnie jest produkt?

Przedmiotem zakupu jest **rozstrzygnięcie przekrojowego problemu oraz projekt warunków jego wykonania**: kryteria, alternatywy, odpowiedzialność, konsekwencje dla inwestycji i technologii oraz moment powrotu do decyzji. Arkadiusz pomaga przygotować i zakwestionować wybór; mandat biznesowy pozostaje po stronie kierownictwa.

Trzy formaty pozostają, z nazwami zrozumiałymi po polsku: Diagnoza decyzji, Projekt zmiany, Doradztwo w trakcie wykonania. Nie są automatycznym lejkiem wymagającym zakupu wszystkich etapów. Specyfikację zawiera następna sekcja.

### 3. Co CEO rozumie po 6 / 30 / 120 sekundach?

To ocena ekspercka źródeł, nie wynik badania z użytkownikami.

| Czas | Obecnie | Cel po przebudowie |
|---|---|---|
| 6 s | Doradztwo o strategii i wykonaniu; szeroka lista dyscyplin. | Pomoc w zmianie tego, co finansujemy, zatrzymujemy i komu dajemy mandat. |
| 30 s | Rozpoznawalne tarcia; pięć nazw artefaktów. | Rozpoznaję własną sytuację i wiem, że rezultatem może być konkretny wybór inwestycyjny lub organizacyjny. |
| 120 s | Poznaję metodę i schematy; nadal nie wiem, jak przebiega zlecenie. | Potrafię wybrać format, wskazać nasz wkład i nazwać rezultat, z którym zostaniemy. |

Warunek coffee test: po obejrzeniu hero, jednego napięcia i formatu współpracy odbiorca potrafi opisać usługę bez słów OAF, alignment i governance. Automatyczny test widoczności headline nie jest testem zrozumienia.

### 4. Które top-level pages są redundantne?

Żadna nie wymaga skasowania w całości. Redundantne są zadania wykonywane jednocześnie przez kilka stron. Home należy skrócić do kwalifikacji; Advisory zachowuje szczegóły oferty i przypadki; OAF przechodzi do drugiego poziomu nawigacji. About traci powtórzoną prezentację metodologii. Nie wprowadzamy nowych publicznych URL tylko z powodu zmiany nazewnictwa wewnętrznego.

### 5. Gdzie pęka ścieżka kupującego?

Home obiecuje „zobacz, co dostajesz”, ale Advisory mówi przede wszystkim, czym współpraca nie jest. Potem pojawia się kolejny diagram systemu. Brakuje prostego kontraktu: co zrobimy wspólnie i jaką decyzję to umożliwi. Formularz dobrze pyta o kontekst, lecz nie wyjaśnia wyraźnie następnego kroku po wiadomości. Artykuł kieruje do frameworka niezależnie od intencji czytelnika.

Dodatkowo dokumentacja środowisk wskazuje oczekującą konfigurację Resend i adresu odbiorcy. To historyczny zapis repozytorium, nie odczyt aktualnych sekretów Cloudflare. Wysyłka na żywo wymaga oddzielnego potwierdzenia na staging przed publicznym uruchomieniem.

### 6. Które obecne grafiki naprawdę pomagają?

- Model OAF ma sens **na stronie OAF**: pokazuje cztery perspektywy oraz powrót dowodów do kolejnej decyzji. Semantyczna lista jest dobrą podstawą mobile.
- BenchmarkSignalField prawidłowo rozdziela trzy badania i nie udaje wspólnej skali. Nadaje się do tekstu, którego argument wymaga tych danych; nie musi poprzedzać biblioteki artykułów.
- Przekrojowy zakres analizy euro jest bardziej charakterystyczny niż ogólny schemat governance. Należy pokazać go jako zakres analizy potencjalnego wpływu.
- Portret wnosi inną informację niż modele. Wykorzystać go bliżej decyzji o kontakcie, również na Home.

### 7. Które grafiki powtarzają tę samą gramatykę?

ExecutiveSystemMap, DecisionArchitectureDelta i OafDiagram powtarzają opowieść o połączeniu domen i feedbacku. Pięć OutcomeBlueprint miniatur powtarza logikę mapowania/wyboru bez rzeczywistego artefaktu. Schematy cases wizualnie przypominają metodologię, przez co mają słabszy status dowodowy.

Usunąć system map i output miniatury z Home. Usunąć deltę z Advisory. Zachować jeden model metody na OAF. Zastąpić macierz prostą kartą jednej decyzji, jawnie opisaną jako ilustracja formatu pracy.

### 8. Dlaczego Arkadiusz, a nie tylko OAF?

Najlepszym argumentem jest droga od technologii i dostarczania rozwiązań przez architekturę do odpowiedzialności za strategię i portfel. Pozwala zakwestionować atrakcyjny kierunek pytaniem o jego wykonalność, a lokalną optymalizację pytaniem o konsekwencje dla całości.

Użyć istniejącego przekonania: „Struktura odpowiedzialności potrafi unieważnić najlepszy diagram”. Zestawić je z portretem i krótką trajektorią. Zachować wiarygodne kwalifikacje z obecnego materiału, bez nowych dat, pracodawców, osiągnięć i nazw klientów. `CONTENT_SOURCES.md` wyklucza budowanie marki na aktualnym stanowisku u konkretnego pracodawcy; nowa misja tego nie wymaga, więc nie ma konfliktu do eskalacji.

### 9. Dlaczego wracać do Perspective?

Powodem powrotu ma być kolejna użyteczna różnica w myśleniu, nie rozwój biblioteki frameworka. Cztery tematy pozostają, lecz każdy dostaje odrębny przedmiot decyzji:

| Esej | Własne pytanie | Właściwe domknięcie |
|---|---|---|
| EA | Kiedy model rzeczywiście zmienia wybór inwestycyjny? | Problem, alternatywy, właściciel i konsekwencje; powiązany esej o portfelu. |
| Portfel | Co musi zniknąć z aktywnej pracy, aby priorytet był realny? | Koszt alternatywny i ograniczona zdolność wykonania; powiązany esej o transformacji. |
| Transformacja | Kto może zmienić plan, kiedy zmienią się dowody? | Mandat i warunek ponownego rozpatrzenia; powiązany esej o EA. |
| AI | Kto może zwiększyć ekspozycję systemu lub powiedzieć stop? | Konkretny właściciel i dowód proporcjonalny do ryzyka; Advisory/Contact. |

Artykuły liczą obecnie około 168–207 słów treści PL i 179–237 EN (liczenie whitespace z nagłówkami, bez frontmatter). To krótkie noty, nie pogłębione eseje 5–6 minut. Nie wydłużać ich dla pozoru; usunąć niewykorzystywane `readTime` albo wyliczać je, jeśli kiedyś wróci do UI. Źródła pod artykułem są opisane jako kontekst, a nie przypisy wspierające konkretne tezy. Przy przeredagowaniu przypisać źródła do faktycznie wspieranych twierdzeń; nie udawać badania własnego.

### 10. Co usunąć?

OAF z primary nav; publiczny standard publikacji; zapowiedzi przyszłej jakości źródeł; opis „roli marki”; powtórzoną trajektorię; pięć dekoracyjnych miniatur outputów; ogólną deltę systemu; niespójną macierz; powtarzane zastrzeżenia „nie kolejny deck/framework”; nieużywane warstwy treści po migracji wartościowych fragmentów. Nie usuwać kontraktu decyzji tylko dlatego, że dziś nie jest importowany.

## Decyzja produktowa: specyfikacja trzech formatów

Poniższe to projekt oferty oparty na istniejących obszarach i outputach, nie relacja z dawnych zleceń ani obietnica gotowego pakietu o nieznanych parametrach.

### Diagnoza decyzji / Decision diagnostic

- **Sytuacja:** zespoły widzą problem, ale inaczej wskazują jego przyczynę.
- **Zablokowany wybór:** co wymaga zmiany i na jakim poziomie należy podjąć decyzję.
- **Praca:** prześledzenie konkretnej decyzji przez kierunek, budżet, zależności i odpowiedzialność; porównanie materiałów oraz perspektyw kluczowych właścicieli; oddzielenie obserwacji od hipotez.
- **Wkład kierownictwa:** sponsor tematu, właściciele istotnych obszarów, dostępne priorytety i ograniczenia; wspólne sprawdzenie wniosków.
- **Co zostaje:** mapa problemu i zależności, kryteria oceny, lista decyzji z właścicielami oraz niewiadome wymagające rozstrzygnięcia.
- **Co staje się możliwe:** wybór problemu do rozwiązania i uzasadnionego zakresu dalszej zmiany.

### Projekt zmiany / Operating design

- **Sytuacja:** kierunek jest wybrany, lecz finansowanie, technologia lub podział odpowiedzialności go blokują.
- **Zablokowany wybór:** które elementy sposobu działania zmienić i jakie kompromisy zaakceptować.
- **Praca:** warianty rozwiązania, zależności i konsekwencje; projekt docelowego podziału odpowiedzialności; przełożenie wyboru na kolejność zmian.
- **Wkład kierownictwa:** kryteria i granice decyzji, udział właścicieli biznesu i technologii, rozstrzygnięcie kompromisów.
- **Co zostaje:** porównanie wariantów, uzgodnione prawa decyzyjne, konsekwencje dla architektury i finansowania, roadmapa przejścia z warunkami przeglądu.
- **Co staje się możliwe:** zatwierdzenie spójnej zmiany organizacyjnej i inwestycyjnej zamiast kilku sprzecznych planów lokalnych.

### Doradztwo w trakcie wykonania / Execution advisory

- **Sytuacja:** transformacja trwa; inicjatywy konkurują o zasoby, a statusy nie prowadzą do wyborów.
- **Zablokowany wybór:** co kontynuować, zatrzymać, połączyć lub przesunąć po nowych informacjach.
- **Praca:** przygotowanie przekrojowych przeglądów decyzji, kwestionowanie założeń, widoczność ograniczeń i konsekwencji zmiany priorytetu.
- **Wkład kierownictwa:** mandat do zmiany priorytetów, właściciele rezultatów, aktualne dane o wykonaniu i ograniczeniach.
- **Co zostaje:** rejestr rozstrzygnięć i przesłanek, uzgodniona kolejność pracy, rytm przeglądów i warunki ponownego otwarcia decyzji.
- **Co staje się możliwe:** korekta finansowania, zakresu lub odpowiedzialności, gdy wykonanie podważa wcześniejsze założenia.

**Wejście:** wiadomość z kontekstem, decyzją i ograniczeniem → rozmowa o problemie i dopasowaniu → uzgodnienie zakresu, uczestników i rezultatów. Nie obiecywać czasu odpowiedzi, darmowej diagnozy, liczby warsztatów, długości projektu ani ceny.

## Experience Architecture

| Powierzchnia | Jedno zadanie | Nowa zawartość i następny krok |
|---|---|---|
| Primary nav | Wybór intencji | Współpraca, Perspektywa, O mnie; CTA Opisz problem. EN: Advisory, Perspective, About; Discuss a decision. |
| Home | Czy to mój problem? | Teza i odbiorca; trzy rozpoznawalne napięcia; krótki opis możliwej zmiany; jeden fragment wiarygodnego przypadku; człowiek i pierwszy krok; dyskretny link metody. |
| Advisory | Co możemy zrobić wspólnie? | Trzy pełne kontrakty współpracy; jedna karta decyzji; dwa zróżnicowane przypadki; kontakt. |
| Perspective | Czy warto przeczytać kolejną myśl? | Najmocniejszy tekst od razu; krótka lista pozostałych; tematy odróżnione konkretnym pytaniem. |
| About | Dlaczego ta osoba? | Portret; jedna trajektoria; dwa–trzy przekonania; kwalifikacje i kontakt. |
| OAF | Jaki model stoi za pracą? | Krótka definicja; cztery pytania i jeden model; zastosowanie; źródła i granice w details. |
| Contact | Jak zacząć? | Krótka instrukcja, formularz, co dzieje się dalej, LinkedIn. |
| Footer | Głębia i narzędzia | OAF, kontakt, prywatność, LinkedIn. |

Zachować bieżące pary URL: `/wspolpraca` ↔ `/en/advisory`, `/perspektywa` ↔ `/en/perspective`; artykuły pod tymi indeksami. Dokumentacja IA nadal podaje `/work` i `/writing`, choć kod już używa nowych ścieżek. Zaktualizować dokumentację; zachować istniejące przekierowania legacy.

Hipoteza redukcji o 20–30%: strukturalnie uzasadniona, ale **nie zmierzona na wyrenderowanych stronach**. Przed implementacją zapisać liczbę słów w `main`, bez nawigacji/stopki i ukrytych dekoracji. Po zmianach porównać tą samą metodą. Home skracać silniej; Advisory może dodać istotny kontrakt współpracy kosztem usunięcia powtórzeń. Procent nie może prowadzić do ukrycia informacji potrzebnych kupującemu.

## Creative Direction i Visual Transformation

**Kierunek: strategia widoczna w wyborach.** Spokój, ciepły papier, głęboki atrament, ograniczona zieleń jako sygnał decyzji. Charakter tworzą rytm i konkret, nie liczba dekoracji.

**Signature moment:** duża typograficzna kompozycja trzech działań — „Finansujemy. Rezygnujemy. Odpowiadamy.” — spięta jednym znacznikiem decyzji. Środkowe działanie ma wyraźny znak skreślenia, ale pozostaje w pełni czytelne i ma semantyczny opis. To ilustracja tezy, nie wykres wyników ani fikcyjny case. Może działać jako statyczny motyw na LinkedIn i slajdzie. Na mobile trzy działania układają się pionowo w naturalnej kolejności, bez pomniejszania desktopowego canvasu.

Pięć ról wizualnych:

1. **Marka:** powyższa typograficzna decyzja; jeden motyw, bez architektonicznego schematu w hero.
2. **Wyjaśnienie:** jeden model OAF tylko na deep route, czytelny jako lista bez CSS.
3. **Artefakt:** karta decyzji na Advisory — pytanie, warianty, koszt rezygnacji, właściciel, dowód i warunek powrotu. Jawnie „przykład formatu”, bez fikcyjnych liczb.
4. **Dowód:** przypadek jako spokojny zapis kontekstu, interwencji i pozostającego materiału zarządczego. Analiza euro bez sugerowania wdrożenia waluty. Portfel bez sugerowania liczby zatrzymanych projektów.
5. **Człowiek:** portret z dostarczonego materiału, krótka trajektoria i istniejące przekonanie; bez fikcyjnego wspomnienia.

**Design system:** nagłówki redakcyjne z produkcyjnie bezpiecznym serif stackiem `Georgia, "Times New Roman", serif`; tekst i interfejs `system-ui, -apple-system, "Segoe UI", sans-serif`. Zweryfikować PL diakrytyki i długości EN w renderze. Główna proza 16–18 px, używane etykiety minimum 14 px; mniej skal i wag. Aktualna dokumentacja mówi o Helvetica-first, podczas gdy kod ustawia Arial-first. Nie instalować fontów dla samej zmiany technologicznej.

Ograniczyć szerokość tekstu do około 60–68 znaków. Zlikwidować nadmiar 9–11 px etykiet w diagramach. Ruch tylko w stanach interakcji po ustaleniu kompozycji; żadnych sekwencji zasłaniających treść. Rozmiary portretów ustawiać zgodnie z realnym assetem — square-v2 ma 400×400 px, a markup deklaruje 750×750 (ratio poprawne, informacja o rozdzielczości nie).

## Engineering: model treści i migracja

Nie tworzyć kolejnego równoległego `astra.ts` obok starych źródeł. Docelowo osobne, jawnie typowane domeny `home`, `advisory`, `about`, `perspective`, `method`, `contact`, `privacy`, plus mały wspólny model nawigacji/UI oraz osobne `cases` i `sources`. Każda domena wymusza `Record<Locale, PageContent>`. Identyfikatory formatów, przypadków i relacji artykułów muszą być stabilne; nie opierać wyboru case na indeksach `[2]`, `[3]`, `[4]`.

| Obecne źródło | Faktyczne użycie | Decyzja |
|---|---|---|
| `executive.ts` | Home i Work; typ outputów w OutcomeBlueprint | Rozdzielić na home/advisory; przenieść wartościowy materiał, usunąć starą wersję po migracji. |
| `platform.ts` | About, OAF, Perspective i źródła | Rozdzielić domeny; pola home/practice i pozostałe nieużywane treści usunąć. |
| `editorial-pl/en.ts` | Nav, Writing read label, OAF principles, Privacy hero | Zachować te wartości w odpowiednich domenach; usunąć nieużywane home/about/work/contact i nadmiarowe definicje. |
| `vnext.ts` | Brak importów w aktywnym kodzie | Usunąć po odnotowaniu, że wartościowe idee mają docelowe źródła. |
| `oaf-operating-model.ts` | Brak importów | Wykorzystać kontrakt w ofercie i karcie decyzji; dopiero wtedy usunąć duplikat. |
| `i18n/shared.ts` | Reeksport bez konsumentów | Usunąć po weryfikacji import graph. |
| Proza w `.astro` | Contact, Privacy, OAF, Work, About, Note i diagramy | Przenieść do właściwych domen, również metadata i stany formularza; komponentom zostawić prezentację. |
| Writing collection | Aktywne cztery pary artykułów | Zachować schema; dodać kontrolę par slugów i sensownych relacji next/related. |

Uprościć CSS od tokenów i wspólnego layoutu do arkuszy domen. Usuwać selektory na podstawie użycia po zmianie markup, nie przez kasowanie całych starych arkuszy w ciemno. `responsive.css` importowane przed kolejnymi warstwami oraz nadpisywane tokeny zwiększają ryzyko nieoczekiwanej kaskady. Accessibility/reduced motion mają pozostać skuteczne po konsolidacji.

Nie zmieniać modelu Cloudflare, branch promotion, domeny, origin validation ani kontraktu Resend. Dokument `ARCHITECTURE.md` opisuje nadal NGINX/sidecar jako runtime publiczny; to dokumentacyjna niespójność, nie powód do przebudowy deploymentu. `ENVIRONMENTS.md` określa repo jako prywatne, choć bieżące API zwraca `visibility: public`; sprostować fakt bez samowolnej zmiany widoczności lub planu.

## Quality: baseline i dodatkowe ustalenia

| Bramka | Status | Dowód / ograniczenie |
|---|---|---|
| Integralność snapshotu | PASS | 165 blobów zgodnych z GitHub. |
| Worker contact | PASS | `node tests/worker-contact.mjs`; mocki Turnstile/Resend, redirecty i staging noindex. |
| Node contact API | PASS | `node tests/contact-api.mjs`; walidacja, origin, rozmiar, timing, rate limit i awarie delivery. |
| Predeploy contract | PASS | `python3 tests/predeploy_check.py`; testy poprawnej i błędnej konfiguracji. |
| Astro check/build/static | PASS w CI | Run draft PR `34250966339`: 0 błędów, 0 ostrzeżeń; 22 trasy PL/EN. Lokalny runtime pozostaje niedostępny. |
| Performance budget | FAIL w CI | Home HTML 20,4 KiB / 20,0 KiB. Pozostałe limity PASS: całość 404,4 / 700 KiB; CSS raw 88,6 / 96 KiB; CSS gzip 16,6 / 20 KiB; JS 4,9 / 8 KiB. |
| Browser / axe / visual QA | NOT RUN | Pipeline pominął te kroki po błędzie performance. Nie oceniono renderów strony. |
| CI obecnego main | FAIL | Run `34061803865` (push) i `34061814290` (PR), oba failure. Odczytany job PR nie ma kroków ani artefaktów; przyczyna nieustalona. |
| Release Policy | PASS w istniejącym run | `34061814303`; nie jest to PASS pełnego release. |
| Dostarczenie prawdziwej wiadomości | NOT RUN | Mocki nie potwierdzają sekretów, konfiguracji domeny ani inbox delivery. |

### Konkretne problemy do naprawy

| Priorytet / severity | Problem i wpływ | Poprawka implementacyjna |
|---|---|---|
| P1 / wysoka, biznes | Kupujący nie zna kontraktu współpracy. | Trzy formaty z sytuacją, pracą, wkładem, outputem i decyzją końcową. |
| P1 / wysoka, wiarygodność | Macierz: wzrost istotności w prawo, ale Q1 po lewej opisuje wysoką wartość; Q2 na górze zaleca przyspieszanie przy wysokiej presji zależności. | Zastąpić kartą decyzji. Nie bronić sprzeczności podpisem „nie automat”. |
| P1 / wysoka, wiarygodność | Case analizy euro kończy się pytaniem „co naprawdę się zmieniło?”, mimo że źródło opisuje potencjalny wpływ. | Opisać mapę konsekwencji i decyzje przygotowawcze. Nie sugerować wykonanego wdrożenia. |
| P1 / wysoka, release | Brak pełnego backupu i zielonego CI. | Zweryfikować remote tag i branch na wskazanym SHA; ustalić przyczynę failure; komplet bramek przed merge. |
| P2 / średnia, API | JSON `null` powoduje nieobsłużony TypeError przed walidacją pól. | Sprawdzić niepusty obiekt niebędący tablicą po JSON.parse; zwracać 400. Dodać test rzeczywistej granicy danych. |
| P2 / średnia, API | `topic in topicLabels` dopuszcza klucze prototypu. Lokalny `toString` przechodzi walidację i kończy się 502 przy budowie wiadomości. | `Object.hasOwn(topicLabels, data.topic)`; błędny topic ma dawać 400 przed providerami. |
| P2 / średnia, QA | Testy wymagają starego designu i zakazują portretu na Home. | Testować dostępność oferty, wyraźne CTA, strukturę języków i brak zależności od OAF, nie stare nazwy klas i liczbę grafik. |
| P2 / średnia, mobile | Duża liczba etykiet 9–11 px i semantyka osi znikająca po liniowym ułożeniu macierzy. | Większa typografia; karta decyzji i listy semantyczne zamiast miniatur. Potwierdzić renderem. |
| P2 / średnia, content | Źródła benchmarków nie są przypisami do poszczególnych tez; opis mianownika BCG 53% różni się pomiędzy copy a provenance. | Sprawdzić pierwotną publikację przed ponownym użyciem. Nie używać benchmarków jako dowodu skuteczności doradcy. |
| P2 / średnia, utrzymanie | Stare IA/runtime docs, dead content, 14 importów CSS. | Aktualizacja dokumentacji i konsolidacja po audycie użyć. |

Dwa testy negatywne API uruchomiono lokalnie z syntetycznym payloadem i mockiem `fetch`; nie wysłano wiadomości ani danych do zewnętrznych usług. Nie jest to dowód naruszenia poufności, tylko odtworzona luka walidacji i obsługi błędów.

### Uzupełnienie baseline po utworzeniu draft PR #31

Run [34250966339](https://github.com/aras-2003/Simple-Website/actions/runs/34250966339) na head `0b3d52ea0fd6df276b73fe18101bf216c97171ca` obejmuje dokładnie tę samą aplikację co oryginalny main — jedyne zmiany to dwa pliki dokumentacji. Build i static PASS; performance FAIL na HTML Home. Potwierdza to defekt istniejącego baseline, nie regresję redesignu, którego jeszcze nie wykonano. Release Policy [34250966268](https://github.com/aras-2003/Simple-Website/actions/runs/34250966268) PASS. Job `102144983774` zawiera pełne logi. Artifact `site-dist` jest dostępny w runie; próba pobrania go do runtime zwróciła HTTP 403. Nie zmierzono liczby słów ani nie odtworzono widoku na podstawie domysłów. Zmiana treści i usunięcie miniatur powinny rozwiązać przekroczenie 20 KiB; limitu nie podnosić.

## Plan implementacji i kryteria odbioru

1. Ukończyć i zweryfikować backup branch/tag na dokładnym SHA. Utworzyć feature branch z tego SHA.
2. Zmierzyć baseline renderu, słów i budżetów, gdy runtime będzie dostępny; naprawić przyczynę CI failure bez osłabiania bramek.
3. Wdrożyć typowane modele treści i kontrolę PL/EN. Migrować strony domenami, usuwając wyłącznie potwierdzone duplikaty.
4. Zbudować nowe Home i Advisory, następnie About, Perspective, artykuły i OAF. Contact zachowuje bezpieczny kontrakt, z krótszym tekstem i jasnym następnym krokiem.
5. Wdrożyć tokeny, typografię i jeden motyw marki; pozostałe role wizualne muszą być rozróżnialne. Usunąć sprzeczną macierz i mylący proof.
6. Sprawdzić 320 / 390 / 768 / 1440 px, powiększenie tekstu, długie PL/EN, klawiaturę, focus, reduced motion i działanie bez JS poza formularzem.
7. Przeprowadzić build/static, Worker/contact, predeploy, performance, axe oraz Chromium/Firefox/WebKit. Nie utożsamiać braku wykrytych axe violations z pełną certyfikacją WCAG.
8. Obejrzeć screenshoty całych stron i kluczowych stanów; sprawdzić prawdziwe CTA, zmianę języka w artykule, mobile menu oraz błędy formularza.
9. Adversarial review CEO/CIO i Creative Director: wskazać trzy największe pozostałe słabości, poprawić je i ponownie sprawdzić związane bramki.
10. PR do main, sprawdzenie CI na finalnym head SHA, merge i odczyt finalnego main SHA. Bez promocji do staging/production w ramach tej misji.

### Pre-launch status na koniec audytu

| Obszar | PASS / FIX |
|---|---|
| Kierunek produktowy i rozdzielenie zadań stron | PASS jako decyzja projektowa, nie wynik wdrożenia |
| Istniejące testy Worker/contact/predeploy | PASS lokalnie |
| Clarity, person, proof, visual variety | FIX |
| Typowany model treści PL/EN i redukcja copy | FIX |
| Weryfikacja browser/a11y/performance | FIX — niewykonana |
| Zdalny backup tag i release CI | FIX |
| Merge redesignu do main | FIX — nie wykonano |

## Git / Rollback

Stan remote backupu i gałęzi roboczej zapisuje towarzyszący `ASTRA_RELEASE_STATE.md` po odczycie z GitHub. Ten dokument powstał przed jakąkolwiek zmianą UI.

Przed implementacją, w środowisku z autoryzowanym Git:

```bash
git fetch origin main --tags
git status --short
git rev-parse origin/main
git tag pre-astra-refactor-2026-09-08 32aca86ed6b0f03e4e84f9ec65d4a23cb6fa1d6a
git push origin refs/tags/pre-astra-refactor-2026-09-08
git ls-remote origin refs/tags/pre-astra-refactor-2026-09-08
```

Nie nadpisywać istniejącego tagu. Jeśli nazwa zajęta, użyć `pre-astra-refactor-2026-09-08-32aca86` i zapisać faktyczną nazwę. Jeśli main zmienił się od audytu, porównać delta i zrobić nowy backup na aktualnym SHA przed implementacją.

Rollback po przyszłym merge: nowa gałąź od aktualnego main, revert commitu redesignu (dla merge commitu: `git revert -m 1 <merge-sha>`; dla squash: `git revert <squash-sha>`), PR do main, pełne CI i merge. Nie wykonywać `reset --hard` ani force-push na release branches. Jeżeli później nastąpi publikacja, cofnięcie przechodzi tę samą ścieżkę main → staging → production. Obecnie aplikacja nie została zmieniona, więc rollback UI nie jest potrzebny.
