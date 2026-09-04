import type { Locale } from '../lib/site';

const sources = {
  bcgTransformation: 'https://www.bcg.com/publications/2024/five-truths-and-a-lie-about-corporate-transformation',
  bcgAgile: 'https://www.bcg.com/publications/2024/why-companies-get-agile-right-wrong',
  mckinseyTransformation: 'https://www.mckinsey.com/capabilities/implementation/our-insights/how-to-implement-transformations-for-long-term-impact',
  pmiPulse: 'https://www.pmi.org/learning/thought-leadership/future-of-project-work',
  mckinsey7s: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework',
  mitCisrEa: 'https://cisr.mit.edu/content/classic-topics-enterprise-architecture',
  mitCisrBook: 'https://cisr.mit.edu/publication/enterprise-architecture-as-strategy',
  galbraith: 'https://jaygalbraith.com/services/star-model/',
  burtonObel: 'https://link.springer.com/article/10.1186/s41469-018-0029-2',
} as const;

const pl = {
  home: {
    hero: {
      eyebrow: 'Architektura organizacyjna · strategia · wykonanie',
      title: 'Złożone organizacje rzadko przegrywają przez brak strategii.',
      emphasis: 'Przegrywają, gdy dobre decyzje nie składają się w jeden system.',
      lead: 'Strategia, architektura, portfel, ład decyzyjny i zespoły mogą działać poprawnie osobno — a razem prowadzić organizację w kilku kierunkach. Ta strona jest o tym, jak zobaczyć i projektować połączenia pomiędzy nimi.',
      primary: 'Poznaj perspektywę',
      secondary: 'Zobacz OAF',
    },
    problem: {
      eyebrow: 'Problem / lokalnie dobrze, systemowo źle',
      title: 'Najwięcej wartości znika pomiędzy funkcjami.',
      lead: 'Nie chodzi o kolejną ramę do wdrożenia. Chodzi o momenty, w których jedna racjonalna decyzja uruchamia konsekwencje, których nikt nie posiada od początku do końca.',
      tensions: [
        { title: 'Strategia → Portfel', body: 'Priorytety są jasne w prezentacji, ale finansowanie i liczba aktywnych inicjatyw opowiadają inną historię.' },
        { title: 'Architektura → Inwestycje', body: 'Stan docelowy i zależności są znane, lecz nie zmieniają kolejności finansowania ani decyzji produktowych.' },
        { title: 'Ład decyzyjny → Tempo', body: 'Kontrola mnoży fora i statusy, ale nie skraca czasu do decyzji ani nie wyjaśnia odpowiedzialności.' },
        { title: 'Wykonanie → Strategia', body: 'Zespoły generują dane i uczenie, lecz system zarządczy nie ma mechanizmu, by na ich podstawie zmienić wcześniejsze założenia.' },
      ],
    },
    evidence: {
      eyebrow: 'Dowody / skala problemu',
      title: 'To nie jest problem estetyki zarządzania. Ma mierzalne konsekwencje.',
      lead: 'Dane nie dowodzą jednej przyczyny. Pokazują jednak powtarzalny wzorzec: sama ambicja, metodyka albo poprawny projekt nie wystarczają bez spójnego systemu wykonania i sprzężenia zwrotnego.',
    },
    thesis: {
      eyebrow: 'Teza / poziom wyżej',
      title: 'Organizacja działa jak architektura decyzji.',
      lead: 'Jeżeli kierunek, projekt organizacji, alokacja kapitału, wykonanie i informacja zwrotna są rozdzielone, organizacja optymalizuje części. Jeżeli są połączone, może uczyć się jako system.',
      steps: [
        { title: 'Kierunek', body: 'Co ma się zmienić i dlaczego.' },
        { title: 'Projekt', body: 'Co musi być prawdą w strukturze, zdolnościach, technologii i odpowiedzialności.' },
        { title: 'Alokacja', body: 'Co finansujemy, w jakiej kolejności i kosztem czego.' },
        { title: 'Wykonanie', body: 'Jak decyzja przechodzi przez realne ograniczenia organizacji.' },
        { title: 'Dowody', body: 'Czego nauczył nas rezultat i co zmieniamy dalej.' },
      ],
    },
    oaf: {
      eyebrow: 'OAF / odpowiedź, nie punkt startu',
      title: 'OAF porządkuje połączenia, których klasyczne dyscypliny często pilnują osobno.',
      body: 'Organizational Architecture Framework jest tu nazwą praktycznej syntezy: łączy projektowanie organizacji, architekturę korporacyjną, model operacyjny, portfel i dowody z wykonania w jedną pętlę decyzji. Nie zastępuje tych dyscyplin i nie rości sobie prawa do ich wynalezienia.',
      cta: 'Poznaj logikę OAF',
    },
    perspective: {
      eyebrow: 'Perspektywa / badania i tezy',
      title: 'Rama ma wartość dopiero po dobrym zdefiniowaniu problemu.',
      body: 'Dlatego Perspektywa jest przed OAF: zaczyna od danych, badań i realnych napięć organizacyjnych, a dopiero potem buduje hipotezę i sposób odpowiedzi.',
      cta: 'Wszystkie materiały',
    },
    practice: {
      eyebrow: 'Praktyka / miejsca tarcia',
      title: 'Te same napięcia wracają w bardzo konkretnych decyzjach.',
      body: 'Praktyka nie jest katalogiem usług. Pokazuje interfejsy, w których organizacje tracą spójność, tempo lub zdolność do uczenia się.',
      cta: 'Zobacz praktykę',
    },
    author: {
      eyebrow: 'Autor / źródło perspektywy',
      title: 'Ta perspektywa powstała na styku technologii, architektury, transformacji, strategii i portfela.',
      body: 'Na stronie głównej ważniejsza jest idea niż biografia. Pełna historia doświadczenia i sposób pracy są osobnym kontekstem — dla tych, którzy chcą wiedzieć, skąd bierze się ten punkt widzenia.',
      cta: 'Poznaj moją drogę',
    },
    close: {
      eyebrow: 'Dalej',
      title: 'Najpierw nazwijmy problem systemowy. Dopiero potem wybierzmy narzędzie.',
      body: 'Jeżeli rozpoznajesz podobne napięcie w swojej organizacji, możesz wejść głębiej w Perspektywę, OAF albo Praktykę — lub opisać konkretny kontekst.',
      cta: 'Kontakt',
    },
  },
  evidence: [
    { value: '26%', title: 'transformacji tworzy wartość w krótkim i długim horyzoncie', body: 'BCG, analizując dwie dekady transformacji, wskazuje, że trwałe tworzenie wartości pozostaje wyjątkiem. To argument za projektowaniem systemu wykonania, nie tylko programu zmian.', source: 'BCG · 2024', href: sources.bcgTransformation },
    { value: '53%', title: 'firm deklarujących dojrzałość agile osiąga trwały wpływ', body: 'BCG pokazuje lukę między adopcją praktyk a zmianą modelu operacyjnego. Widoczne rytuały nie zastępują spójności strategii, finansowania, ładu decyzyjnego, technologii i zachowań.', source: 'BCG · 2024', href: sources.bcgAgile },
    { value: '42%', title: 'potencjalnej wartości transformacji ginie w wykonaniu i utrwalaniu zmiany', body: 'McKinsey wskazuje, że duża część wartości jest tracona już po zaprojektowaniu transformacji. Problem przesuwa się więc z planu na zdolność organizacji do wykonania i utrzymania decyzji.', source: 'McKinsey · 2022', href: sources.mckinseyTransformation },
  ],
  perspective: {
    hero: { eyebrow: 'Perspektywa / badania, benchmarki, tezy', title: 'Najpierw problem. Potem dane. Dopiero później rama.', lead: 'To biblioteka myślenia o architekturze organizacyjnej, architekturze korporacyjnej, strategii, portfelu, transformacji, AI i ładzie decyzyjnym. Każdy materiał powinien zaczynać się od realnego napięcia, a kończyć konsekwencją dla decyzji.' },
    manifesto: {
      eyebrow: 'Soczewka / czego szukam',
      title: 'Interesują mnie miejsca, w których organizacja mówi jedno, finansuje drugie i wykonuje trzecie.',
      body: 'Perspektywa nie ma być komentarzem do trendów. Ma tworzyć użyteczne modele problemów: takie, które CEO, CIO, CTO, architekt korporacyjny albo lider transformacji może rozpoznać, zakwestionować i zastosować.',
      questions: ['Czy strategia jest widoczna w alokacji kapitału?', 'Czy architektura zmienia decyzje, czy tylko je opisuje?', 'Czy ład decyzyjny poprawia jakość decyzji, czy jedynie zwiększa liczbę kontroli?', 'Czy dowody z wykonania mogą naprawdę zmienić plan?'],
    },
    evidenceTitle: 'Trzy sygnały, że problem leży głębiej niż w metodyce.',
    method: {
      eyebrow: 'Standard publikacji',
      title: 'Teza musi mieć trzy warstwy: obserwację, dowód i implikację.',
      items: [
        { title: 'Obserwacja', body: 'Co realnie dzieje się w organizacjach i jakie napięcie próbujemy nazwać.' },
        { title: 'Dowód', body: 'Badanie, benchmark, literatura lub dobrze opisany przypadek, który pozwala tezę osadzić albo podważyć.' },
        { title: 'Implikacja', body: 'Co z tego wynika dla decyzji, ładu decyzyjnego, architektury, portfela albo sposobu pracy.' },
      ],
    },
    bridge: { eyebrow: 'Od problemu do syntezy', title: 'OAF jest konsekwencją tej perspektywy, nie jej punktem startu.', body: 'Jeżeli powtarzalnym problemem jest brak spójności pomiędzy kierunkiem, projektem organizacji, finansowaniem i wykonaniem, potrzebny jest język, który pozwala śledzić decyzję przez cały system.', cta: 'Zobacz OAF' },
  },
  oaf: {
    hero: { eyebrow: 'OAF / Organizational Architecture Framework', title: 'Jedna pętla decyzji pomiędzy kierunkiem a dowodem.', lead: 'OAF nie próbuje zastąpić strategii, projektowania organizacji, architektury korporacyjnej, zarządzania portfelem ani sposobu wykonania. Jego rolą jest utrzymanie spójności pomiędzy nimi i nadanie dowodom z wykonania prawa do zmiany wcześniejszych założeń.' },
    definition: {
      eyebrow: 'Najpierw definicja',
      title: 'Architektura organizacyjna jest starsza niż OAF.',
      body: 'Na potrzeby tej strony przez architekturę organizacyjną rozumiem projekt współzależnych elementów organizacji — strategii, struktury i praw decyzyjnych, procesów i przepływów informacji, ludzi i kompetencji, zachęt, ładu decyzyjnego, technologii oraz mechanizmów pomiaru. Nie jest to jedna powszechnie obowiązująca definicja; jest syntezą tradycji projektowania organizacji i architektury korporacyjnej.',
      oaf: 'OAF jest rozwijaną ramą roboczą, która bierze tę systemową perspektywę i dodaje wyraźną logikę: kierunek → architektura → priorytety → wykonanie i dowody → kolejna decyzja.',
    },
    lineageTitle: 'OAF stoi na ramionach istniejących szkół myślenia.',
    lineageLead: 'Wartość nie polega na przemianowaniu istniejących pojęć. Polega na połączeniu ich tam, gdzie w praktyce organizacji zwykle rozchodzą się odpowiedzialności i rytmy decyzji.',
    gap: {
      eyebrow: 'Luka / co pozostaje pomiędzy dyscyplinami',
      title: 'Każda z klasycznych perspektyw rozwiązuje ważną część problemu. Żadna nie musi sama utrzymywać całej pętli.',
      streams: [
        { title: 'Projektowanie organizacji', body: 'Projektuje dopasowanie strategii, struktury, procesów, ludzi i mechanizmów koordynacji.' },
        { title: 'Architektura korporacyjna', body: 'Projektuje organizującą logikę procesów, informacji, zdolności i technologii potrzebnych do działania.' },
        { title: 'Portfel i ład decyzyjny', body: 'Decyduje o alokacji kapitału, uwagi, kolejności i odpowiedzialności.' },
        { title: 'Wykonanie', body: 'Konfrontuje założenia z ograniczeniami i generuje dowody o rezultacie.' },
      ],
      conclusion: 'OAF koncentruje się na interfejsach: jak decyzja przechodzi pomiędzy tymi światami i jak wraca do kolejnego wyboru.'
    },
    model: { eyebrow: 'Model / punkt ciężkości', title: 'Cztery perspektywy. Jeden środek ciężkości: spójność decyzji.', body: 'Nie istnieje jeden „najważniejszy” wymiar. Punkt ciężkości przesuwa się zależnie od problemu, ale system pozostaje zdrowy tylko wtedy, gdy relacje między wymiarami są jawne.' },
    layers: [
      { title: 'Kierunek', question: 'Dokąd i po co zmieniamy organizację?', body: 'Rezultat, granice, kompromisy i kryteria sukcesu. Kierunek ma być wystarczająco konkretny, żeby odróżnić decyzję strategiczną od życzenia.' },
      { title: 'Architektura', question: 'Co musi być prawdą, żeby ten kierunek był możliwy?', body: 'Zdolności, struktura, prawa decyzyjne, procesy, dane, technologia, zasady i zależności. Architektura zamienia ambicję w warunki wykonalności.' },
      { title: 'Priorytety', question: 'Co finansujemy, w jakiej kolejności i kosztem czego?', body: 'Portfel jest mechanizmem świadomego ograniczania pracy. Priorytet istnieje dopiero wtedy, gdy zmienia alokację zasobów lub kolejność decyzji.' },
      { title: 'Dowody', question: 'Czego nauczyło nas wykonanie?', body: 'Rezultaty, ryzyko, tempo i trafność założeń. Dowody mają prawo zmienić architekturę, finansowanie albo sam kierunek.' },
    ],
    misfit: {
      eyebrow: 'Dopasowanie / rozjazd',
      title: 'OAF staje się użyteczny wtedy, gdy elementy systemu przestają do siebie pasować.',
      examples: [
        { title: 'Cyfrowość jako model domyślny × finansowanie projektowe', body: 'Strategia oczekuje ciągłego rozwoju produktów i platform, a mechanizm finansowania nadal wymusza krótkie, odseparowane projekty.' },
        { title: 'Strategia platformowa × lokalne priorytety', body: 'Architektura wymaga wspólnych zdolności, ale portfel nagradza wyłącznie funkcje widoczne w pojedynczych jednostkach.' },
        { title: 'Ambicja AI × ciężki ład decyzyjny', body: 'Organizacja chce eksperymentować szybko, ale wszystkie przypadki użycia przechodzą przez identyczny poziom kontroli niezależnie od ryzyka.' },
        { title: 'Zwinne wykonanie × zamrożony plan portfela', body: 'Zespoły mogą adaptować rozwiązanie, ale nie mogą zmienić inwestycji ani priorytetu mimo nowych dowodów.' },
      ],
    },
    nonGoals: {
      eyebrow: 'Granice',
      title: 'Czego OAF nie próbuje zastąpić.',
      items: ['TOGAF ani innych metod architektury korporacyjnej', 'strategii i narzędzi jej formułowania', 'projektowania modelu operacyjnego', 'zarządzania portfelem i finansowania', 'agile, product management ani sposobu dostarczania zmiany'],
      body: 'OAF ma być warstwą integrującą rozmowę i ścieżkę zależności pomiędzy tymi dyscyplinami — nie nową nazwą dla każdej z nich.'
    },
    uses: [
      { title: 'Transformacja wielosilosowa', body: 'Kiedy jedna zmiana dotyka modelu operacyjnego, technologii, danych, finansowania i odpowiedzialności jednocześnie.' },
      { title: 'Przeciążony portfel', body: 'Kiedy priorytety są deklarowane, ale organizacja nie potrafi realnie zatrzymywać pracy i przesuwać zasobów.' },
      { title: 'Architektura bez wpływu', body: 'Kiedy modele są poprawne, ale nie zmieniają decyzji inwestycyjnych, produktowych ani technologicznych.' },
      { title: 'AI i ład decyzyjny', body: 'Kiedy tempo adopcji technologii rośnie szybciej niż jakość praw decyzyjnych, barier ochronnych i mechanizmów dowodowych.' },
    ],
  },
  practice: {
    hero: { eyebrow: 'Praktyka / interfejsy decyzji', title: 'Największe problemy organizacji pojawiają się pomiędzy funkcjami.', lead: 'Praktyka zaczyna się od miejsca rozjazdu, nie od nazwy usługi. Najpierw trzeba znaleźć interfejs, na którym organizacja traci spójność, a dopiero potem dobrać narzędzia z architektury, strategii, portfela, PMO czy technologii.' },
    intersectionsTitle: 'Cztery interfejsy, w których lokalnie dobra decyzja może zepsuć cały system.',
    intersections: [
      { title: 'Strategia ↔ Architektura', question: 'Czy docelowy kształt organizacji rzeczywiście umożliwia wybrany kierunek?', problem: 'Strategia pozostaje zbiorem ambicji, jeśli nie zmienia zdolności, granic odpowiedzialności, danych, technologii lub sposobu działania.', signal: 'Sygnał: stan docelowy nie ma śladu do konkretnych rezultatów albo architektura zmienia się wolniej niż strategiczne wybory.', decision: 'Decyzja: nazwać warunki wykonalności strategii i jawne kompromisy architektoniczne.' },
      { title: 'Architektura ↔ Portfel', question: 'Czy finansujemy zależności w kolejności, która pozwala wykonać architekturę?', problem: 'Platformy i zdolności wspólne konkurują z lokalnymi funkcjami o ten sam kapitał, choć bez nich kolejne inicjatywy stają się droższe.', signal: 'Sygnał: mapa przejścia pokazuje krytyczne zależności, ale portfel stale finansuje atrakcyjniejsze lokalnie elementy.', decision: 'Decyzja: włączyć zależności i opcjonalność architektoniczną do logiki inwestycyjnej.' },
      { title: 'Portfel ↔ Wykonanie', question: 'Czy priorytet naprawdę ogranicza pracę w toku i zmienia alokację zasobów?', problem: 'Ranking nie jest priorytetyzacją, jeśli niemal wszystko pozostaje aktywne. Wykonanie traci wtedy fokus, a zależności rosną szybciej niż przepustowość.', signal: 'Sygnał: liczba aktywnych inicjatyw rośnie mimo stałej zdolności wykonawczej, a statusy nie prowadzą do decyzji stop/start/continue.', decision: 'Decyzja: połączyć priorytety z limitami pracy, zdolnością wykonawczą i kosztem alternatywnym.' },
      { title: 'Wykonanie ↔ Strategia', question: 'Czy dowody z rynku i wykonania mogą zmienić wcześniejsze założenie?', problem: 'Organizacja uczy się na poziomie zespołów, ale plan pozostaje odporny na dane. Adaptacyjność kończy się wtedy poniżej poziomu finansowania.', signal: 'Sygnał: organizacja mierzy zgodność z planem, ale nie ma mandatu ani forum do zmiany planu.', decision: 'Decyzja: ustalić, jakie dowody mogą uruchomić zmianę kierunku, architektury lub finansowania.' },
    ],
    toolbox: {
      eyebrow: 'Narzędzia / nie katalog usług',
      title: 'Dyscypliny są narzędziami. Problem decyduje, których użyć.',
      items: [
        { title: 'Architektura korporacyjna', body: 'Zdolności, stan docelowy, zasady, zależności, architektura przejścia i ład decyzyjny.' },
        { title: 'Strategia i transformacja', body: 'Wybory strategiczne, rezultaty, model operacyjny, transformacja i rytm decyzji na poziomie zarządczym.' },
        { title: 'Portfel i PMO', body: 'Priorytetyzacja, zdolność wykonawcza, zależności, logika inwestycyjna, stop/start/continue i przegląd wartości.' },
        { title: 'AI i technologia', body: 'Ład AI, platformy, chmura, DevSecOps, bariery ochronne technologii i odpowiedzialna adopcja.' },
      ],
    },
    method: {
      eyebrow: 'Sposób pracy',
      title: 'Od diagnozy do pętli uczenia — bez produkowania artefaktów dla samych artefaktów.',
      steps: [
        { title: 'Zlokalizuj rozjazd', body: 'Znajdź decyzję lub interfejs, na którym system traci spójność.' },
        { title: 'Nazwij kryteria', body: 'Ustal rezultat, ograniczenia, właściciela i koszt alternatywny.' },
        { title: 'Zaprojektuj wybór', body: 'Połącz konsekwencje strategiczne, architektoniczne i portfelowe.' },
        { title: 'Zaprojektuj dowody', body: 'Zdefiniuj, jakie dane z wykonania mogą potwierdzić lub obalić założenie.' },
        { title: 'Zamknij pętlę', body: 'Wróć z dowodem do kolejnej decyzji zamiast raportować wyłącznie status.' },
      ],
    },
    contexts: {
      eyebrow: 'Konteksty',
      title: 'Gdzie ten sposób myślenia zwykle zaczyna być potrzebny.',
      items: ['duża transformacja przecinająca biznes i technologię', 'projektowanie lub zmiana modelu operacyjnego', 'przeciążenie portfela i konflikt priorytetów', 'modernizacja architektury korporacyjnej i platform', 'ład AI w środowisku regulowanym lub o dużym wpływie'],
    },
  },
  about: {
    hero: { eyebrow: 'O mnie / źródło perspektywy', title: 'Moja perspektywa zmieniała się wraz z poziomem problemów, za które odpowiadałem.', lead: 'Nie zaczynałem od modeli. Zaczynałem blisko technologii i wykonania. Z czasem punkt ciężkości przesuwał się przez architekturę i transformację do strategii, portfela, PMO i projektowania systemu decyzji na poziomie organizacji.' },
    personal: {
      eyebrow: 'Droga / nie lista stanowisk',
      title: 'Od dowożenia zmian do projektowania warunków, w których zmiana może się udać.',
      paragraphs: [
        'Praca blisko technologii, chmury, DevSecOps i wykonania zbudowała bardzo praktyczny filtr: decyzja ma wartość dopiero wtedy, gdy da się ją przełożyć na działający system, produkt lub zmianę sposobu pracy.',
        'Architektura korporacyjna poszerzyła tę perspektywę z pojedynczego rozwiązania na zdolności, zależności i stan docelowy. Transformacja dodała model operacyjny, odpowiedzialność i tempo zmiany. Strategia, portfel i PMO dołożyły pytanie o to, czy organizacja faktycznie finansuje to, co deklaruje jako ważne.',
        'Dzisiaj interesuje mnie przede wszystkim spójność pomiędzy tymi warstwami. OAF jest próbą opisania tego połączenia językiem decyzji — nie próbą stworzenia kolejnej zamkniętej metodologii.'
      ],
    },
    trajectory: [
      { stage: 'Technologia i wykonanie', title: 'Najpierw kontakt z ograniczeniami', body: 'Rozwiązania techniczne, architektura, chmura i DevSecOps uczą, że elegancki plan przegrywa z niewidoczną zależnością, odpowiedzialnością lub kosztem utrzymania.' },
      { stage: 'Architektura i transformacja', title: 'Potem cały system zależności', body: 'Perspektywa rozszerza się na zdolności, stan docelowy, ład decyzyjny, model operacyjny oraz sekwencję zmian pomiędzy stanem obecnym i docelowym.' },
      { stage: 'Strategia, portfel i PMO', title: 'Następnie mechanizm wyboru', body: 'W centrum pojawia się alokacja uwagi i kapitału, priorytetyzacja, prawa decyzyjne oraz pytanie, czy portfel jest rzeczywistym obrazem strategii.' },
      { stage: 'Dziś', title: 'Synteza na poziomie zarządczym', body: 'Obecna odpowiedzialność łączy Architektury Korporacyjną, Strategię i PMO. Punkt ciężkości leży w projektowaniu jednego rytmu decyzji pomiędzy kierunkiem, architekturą, inwestycjami i wykonaniem.' },
    ],
    role: {
      eyebrow: 'Dzisiaj',
      title: 'Dyrektor Departamentu Architektury Korporacyjnej, Strategii i PMO',
      body: 'Pracuję w skali cyfrowych usług publicznych, na styku zarządu, biznesu i technologii. Zakres tej roli naturalnie łączy architekturę korporacyjną, strategię, portfel, ład decyzyjny i mechanizmy wykonania — czyli obszary, które na tej stronie traktuję jako jeden system.'
    },
    principles: [
      { title: 'Jasność ponad objętość', body: 'Lepsza decyzja jest ważniejsza niż większa liczba artefaktów. Najpierw problem, kryteria, właściciel i konsekwencja.' },
      { title: 'Architektura jako dźwignia', body: 'Architektura ma zwiększać zdolność organizacji do zmiany, a nie wyłącznie opisywać stan docelowy.' },
      { title: 'Rezultat ponad aktywność', body: 'Status ma sens tylko wtedy, gdy pokazuje zmianę w wyniku, ryzyku, czasie, koszcie albo zdolności organizacyjnej.' },
      { title: 'Dowód ponad opinię', body: 'Silna opinia pozostaje hipotezą, dopóki wykonanie nie dostarczy danych, które mogą ją potwierdzić lub obalić.' },
      { title: 'Organizacja jest systemem ludzkim', body: 'Mandaty, zachęty, relacje, odpowiedzialność i finansowanie są częścią architektury równie mocno jak procesy i technologia.' },
    ],
    credentials: {
      eyebrow: 'Potwierdzenia / niższy poziom hierarchii',
      title: 'Doświadczenie i edukacja mają potwierdzać perspektywę — nie zastępować argumentu.',
      items: [
        { title: '10+ lat', body: 'Doświadczenie rozciągające się od technologii i wykonania po architekturę korporacyjną, strategię, transformację i PMO.' },
        { title: 'Kozminski University · 2024–2025', body: 'Program MBA / rozwój perspektywy strategicznej; wyróżnienie za najlepszy strategiczny projekt biznesowy.' },
        { title: 'Certyfikacje', body: 'Azure Fundamentals, AgilePM, PRINCE2 oraz SAFe Lean Portfolio Management — jako narzędzia, nie tożsamość zawodowa.' },
        { title: 'Debata i wystąpienia', body: 'Publiczne rozmowy o architekturze korporacyjnej, transformacji, ładzie AI oraz roli technologii w organizacji.' },
      ],
    },
  },
};

const en = {
  home: {
    hero: { eyebrow: 'Organizational architecture · strategy · execution', title: 'Complex organizations rarely fail because they lack strategy.', emphasis: 'They fail when good decisions do not add up to one system.', lead: 'Strategy, architecture, portfolio, governance and teams can all work well in isolation while moving the enterprise in different directions. This site is about seeing and designing the connections between them.', primary: 'Explore the perspective', secondary: 'See OAF' },
    problem: { eyebrow: 'Problem / locally right, systemically wrong', title: 'Most value disappears between functions.', lead: 'This is not about adding another framework. It is about the interfaces where one rational decision creates consequences nobody owns end-to-end.', tensions: [
      { title: 'Strategy → Portfolio', body: 'Priorities look clear in the deck, while funding and the active initiative set tell a different story.' },
      { title: 'Architecture → Investment', body: 'Target state and dependencies are known but do not change investment sequencing or product decisions.' },
      { title: 'Governance → Speed', body: 'Control multiplies forums and status reporting without reducing decision latency or clarifying accountability.' },
      { title: 'Execution → Strategy', body: 'Teams generate learning, but the management system has no mechanism to change prior assumptions.' },
    ] },
    evidence: { eyebrow: 'Evidence / scale of the problem', title: 'This is not a management-aesthetics problem. It has measurable consequences.', lead: 'The data does not prove a single cause. It does show a recurring pattern: ambition, methodology or good design are not enough without a coherent execution and feedback system.' },
    thesis: { eyebrow: 'Thesis / one level higher', title: 'An organization behaves like an architecture of decisions.', lead: 'When direction, organizational design, capital allocation, execution and feedback are separated, the enterprise optimizes parts. When connected, it can learn as a system.', steps: [
      { title: 'Direction', body: 'What changes, and why.' }, { title: 'Design', body: 'What must be true in structure, capability, technology and accountability.' }, { title: 'Allocation', body: 'What gets funded, in what sequence and at what opportunity cost.' }, { title: 'Execution', body: 'How the choice meets real organizational constraints.' }, { title: 'Evidence', body: 'What the outcome taught us and what changes next.' },
    ] },
    oaf: { eyebrow: 'OAF / response, not starting point', title: 'OAF connects interfaces that established disciplines often govern separately.', body: 'Organizational Architecture Framework is used here as the name of a practical synthesis connecting organization design, enterprise architecture, operating model, portfolio and evidence in one decision loop. It does not replace these disciplines or claim to have invented them.', cta: 'Explore OAF' },
    perspective: { eyebrow: 'Perspective / research and theses', title: 'A framework earns its place only after the problem is defined well.', body: 'That is why Perspective comes before OAF: it starts with evidence, research and real organizational tensions, then develops hypotheses and responses.', cta: 'All perspectives' },
    practice: { eyebrow: 'Practice / points of friction', title: 'The same tensions return in very concrete decisions.', body: 'Practice is not a services catalogue. It maps the interfaces where organizations lose coherence, speed or the ability to learn.', cta: 'Explore practice' },
    author: { eyebrow: 'Author / source of perspective', title: 'This perspective grew at the intersection of technology, architecture, transformation, strategy and portfolio.', body: 'On the home page the idea matters more than the biography. The full experience story and operating approach live separately for those who want to understand where this point of view comes from.', cta: 'See my trajectory' },
    close: { eyebrow: 'Next', title: 'Name the systemic problem first. Choose the tool second.', body: 'If you recognize a similar tension, go deeper into Perspective, OAF or Practice — or describe the specific context.', cta: 'Contact' },
  },
  evidence: [
    { value: '26%', title: 'of transformations create value in both the short and long term', body: 'BCG’s two-decade analysis shows durable value creation remains the exception. That points toward execution-system design, not merely a shortage of ambition.', source: 'BCG · 2024', href: sources.bcgTransformation },
    { value: '53%', title: 'of companies claiming agile maturity achieve lasting impact', body: 'BCG highlights the gap between adopting visible practices and changing the operating model across strategy, funding, governance, technology and behavior.', source: 'BCG · 2024', href: sources.bcgAgile },
    { value: '42%', title: 'of potential transformation value is lost during execution and sustaining', body: 'McKinsey reports substantial value leakage after transformation design. The problem shifts from the plan to the organization’s ability to execute and sustain decisions.', source: 'McKinsey · 2022', href: sources.mckinseyTransformation },
  ],
  perspective: {
    hero: { eyebrow: 'Perspective / research, benchmarks, theses', title: 'Problem first. Evidence second. Framework later.', lead: 'A library of thinking on organizational architecture, enterprise architecture, strategy, portfolio, transformation, AI and governance. Each piece should start with a real tension and end with an implication for decisions.' },
    manifesto: { eyebrow: 'Lens / what I look for', title: 'I am interested in places where the organization says one thing, funds another and executes a third.', body: 'Perspective is not trend commentary. It should create useful problem models that a CEO, CIO, CTO, EA or transformation leader can recognize, challenge and apply.', questions: ['Is strategy visible in capital allocation?', 'Does architecture change decisions or merely document them?', 'Does governance improve decision quality or just add control?', 'Can execution evidence genuinely change the plan?'] },
    evidenceTitle: 'Three signals that the problem is deeper than methodology.',
    method: { eyebrow: 'Publishing standard', title: 'A thesis needs three layers: observation, evidence and implication.', items: [
      { title: 'Observation', body: 'What repeatedly happens in organizations and what tension we are trying to name.' }, { title: 'Evidence', body: 'Research, benchmark, literature or a well-described case that grounds or challenges the thesis.' }, { title: 'Implication', body: 'What this changes for decisions, governance, architecture, portfolio or ways of working.' },
    ] },
    bridge: { eyebrow: 'From problem to synthesis', title: 'OAF is a consequence of this perspective, not its starting point.', body: 'If the recurring problem is incoherence between direction, organizational design, funding and execution, we need a language that can trace a decision across the whole system.', cta: 'See OAF' },
  },
  oaf: {
    hero: { eyebrow: 'OAF / Organizational Architecture Framework', title: 'One decision loop from direction to evidence.', lead: 'OAF does not replace strategy, organization design, enterprise architecture, portfolio management or delivery. Its role is to preserve coherence between them and give execution evidence the right to change prior assumptions.' },
    definition: { eyebrow: 'Definition first', title: 'Organizational architecture predates OAF.', body: 'On this site organizational architecture means the design of interdependent organizational elements: strategy, structure and decision rights, processes and information flows, people and capabilities, incentives, governance, technology and measurement. This is not claimed as one universal definition; it is a synthesis of organization-design and enterprise-architecture traditions.', oaf: 'OAF is an evolving working framework that takes this systemic view and adds an explicit loop: direction → architecture → priorities → execution/evidence → next decision.' },
    lineageTitle: 'OAF stands on established schools of thought.', lineageLead: 'The value is not renaming existing ideas. It is connecting them where real organizations typically separate responsibilities and decision cadences.',
    gap: { eyebrow: 'Gap / what sits between disciplines', title: 'Each established perspective solves an important part of the problem. None has to own the entire loop alone.', streams: [
      { title: 'Organization design', body: 'Designs fit across strategy, structure, processes, people and coordination mechanisms.' }, { title: 'Enterprise architecture', body: 'Designs the organizing logic of processes, information, capabilities and technology.' }, { title: 'Portfolio & governance', body: 'Allocates capital, attention, sequence and accountability.' }, { title: 'Execution', body: 'Tests assumptions against constraints and generates evidence about outcomes.' },
    ], conclusion: 'OAF focuses on the interfaces: how a decision moves across these worlds and returns into the next choice.' },
    model: { eyebrow: 'Model / center of gravity', title: 'Four perspectives. One center of gravity: decision coherence.', body: 'No single dimension is always dominant. The center of gravity shifts with the problem, while the system remains healthy only when the relationships are explicit.' },
    layers: [
      { title: 'Direction', question: 'Where are we going and why?', body: 'Outcome, boundaries, trade-offs and success criteria. Direction must be concrete enough to distinguish a strategic choice from an aspiration.' },
      { title: 'Architecture', question: 'What must be true for that direction to be possible?', body: 'Capabilities, structure, decision rights, processes, data, technology, principles and dependencies. Architecture turns ambition into conditions for execution.' },
      { title: 'Priorities', question: 'What do we fund, in what sequence and at what opportunity cost?', body: 'Portfolio is a mechanism for deliberately limiting work. A priority exists only when it changes resource allocation or decision sequence.' },
      { title: 'Evidence', question: 'What did execution teach us?', body: 'Outcomes, risk, speed and assumption validity. Evidence must be able to change architecture, funding or direction.' },
    ],
    misfit: { eyebrow: 'Fit / misfit', title: 'OAF earns its place when parts of the system stop fitting.', examples: [
      { title: 'Digital-first × project funding', body: 'Strategy expects continuous products and platforms while funding still forces short isolated projects.' }, { title: 'Platform strategy × local priorities', body: 'Architecture requires shared capabilities while portfolio rewards only locally visible features.' }, { title: 'AI ambition × heavy governance', body: 'The organization wants rapid experimentation while every use case faces the same control regardless of risk.' }, { title: 'Agile delivery × frozen portfolio plan', body: 'Teams can adapt the solution but cannot change investment or priority despite new evidence.' },
    ] },
    nonGoals: { eyebrow: 'Boundaries', title: 'What OAF does not try to replace.', items: ['TOGAF or other enterprise-architecture methods', 'strategy formulation and its tools', 'operating-model design', 'portfolio management and funding', 'agile, product management or delivery methods'], body: 'OAF is intended as an integrating layer for dialogue and traceability across these disciplines — not a new name for each one.' },
    uses: [
      { title: 'Cross-silo transformation', body: 'When one change touches operating model, technology, data, funding and accountability at the same time.' }, { title: 'Portfolio overload', body: 'When priorities are declared but the organization cannot actually stop work and move resources.' }, { title: 'Architecture without influence', body: 'When models are sound but do not change investment, product or technology decisions.' }, { title: 'AI and governance', body: 'When adoption speed grows faster than decision rights, guardrails and evidence mechanisms.' },
    ],
  },
  practice: {
    hero: { eyebrow: 'Practice / decision interfaces', title: 'The largest organizational problems appear between functions.', lead: 'Practice starts with the point of misfit, not the name of a service. First locate the interface where coherence is lost, then choose tools from architecture, strategy, portfolio, PMO or technology.' },
    intersectionsTitle: 'Four interfaces where a locally good decision can damage the whole system.',
    intersections: [
      { title: 'Strategy ↔ Architecture', question: 'Does the target organization actually enable the chosen direction?', problem: 'Strategy remains aspiration if it does not change capabilities, accountability boundaries, data, technology or the way the organization operates.', signal: 'Signal: target state has no trace to outcomes or architecture changes slower than strategic choices.', decision: 'Decision: name the conditions for strategy execution and explicit architectural trade-offs.' },
      { title: 'Architecture ↔ Portfolio', question: 'Are dependencies funded in the sequence required to make the architecture executable?', problem: 'Platforms and shared capabilities compete with local features for the same capital even when future initiatives depend on them.', signal: 'Signal: the roadmap identifies critical dependencies while portfolio repeatedly funds locally attractive work first.', decision: 'Decision: include dependencies and architectural optionality in investment logic.' },
      { title: 'Portfolio ↔ Execution', question: 'Does priority actually limit WIP and change resource allocation?', problem: 'A ranking is not prioritization when almost everything remains active. Focus disappears and dependencies grow faster than throughput.', signal: 'Signal: active initiatives increase despite fixed capacity and status reviews do not trigger stop/start/continue decisions.', decision: 'Decision: connect priorities to WIP limits, capacity and opportunity cost.' },
      { title: 'Execution ↔ Strategy', question: 'Can market and delivery evidence change a prior assumption?', problem: 'Teams learn locally while the plan remains resistant to evidence. Adaptability then stops below the funding layer.', signal: 'Signal: the organization measures plan compliance but has no mandate or forum to change the plan.', decision: 'Decision: define which evidence can trigger a change in direction, architecture or funding.' },
    ],
    toolbox: { eyebrow: 'Tools / not a service catalogue', title: 'Disciplines are tools. The problem decides which ones matter.', items: [
      { title: 'Enterprise Architecture', body: 'Capabilities, target state, principles, dependencies, transition architecture and governance.' }, { title: 'Strategy & Transformation', body: 'Strategic choices, outcomes, operating model, transformation and executive decision cadence.' }, { title: 'Portfolio & PMO', body: 'Prioritization, capacity, dependencies, investment logic, stop/start/continue and value review.' }, { title: 'AI & Technology', body: 'AI governance, platforms, cloud, DevSecOps, technology guardrails and responsible adoption.' },
    ] },
    method: { eyebrow: 'Operating approach', title: 'From diagnosis to learning loop — without producing artifacts for their own sake.', steps: [
      { title: 'Locate the misfit', body: 'Find the decision or interface where the system loses coherence.' }, { title: 'Name the criteria', body: 'Define outcome, constraints, owner and opportunity cost.' }, { title: 'Design the choice', body: 'Connect strategic, architectural and portfolio consequences.' }, { title: 'Instrument evidence', body: 'Define what execution data can confirm or disprove the assumption.' }, { title: 'Close the loop', body: 'Bring evidence back into the next decision rather than only reporting status.' },
    ] },
    contexts: { eyebrow: 'Contexts', title: 'Where this way of thinking tends to become useful.', items: ['large transformation across business and technology', 'operating-model design or redesign', 'portfolio overload and priority conflict', 'enterprise-architecture and platform modernization', 'AI governance in regulated or high-impact environments'] },
  },
  about: {
    hero: { eyebrow: 'About / source of perspective', title: 'My perspective changed with the level of problems I became accountable for.', lead: 'I did not start with frameworks. I started close to technology and execution. Over time the center of gravity moved through architecture and transformation into strategy, portfolio, PMO and the design of enterprise decision systems.' },
    personal: { eyebrow: 'Trajectory / not a list of roles', title: 'From delivering change to designing the conditions in which change can succeed.', paragraphs: [
      'Working close to technology, cloud, DevSecOps and execution created a practical filter: a decision matters only if it can become a working system, product or change in how the organization operates.',
      'Enterprise Architecture expanded that view from a single solution to capabilities, dependencies and target state. Transformation added operating model, accountability and pace. Strategy, portfolio and PMO added the question of whether the organization actually funds what it claims to value.',
      'Today I am most interested in coherence across these layers. OAF is an attempt to describe that connection in the language of decisions — not to create another closed methodology.'
    ] },
    trajectory: [
      { stage: 'Technology & execution', title: 'Start with constraints', body: 'Technical solutions, architecture, cloud and DevSecOps teach that an elegant plan loses to an invisible dependency, ownership gap or maintenance cost.' },
      { stage: 'Architecture & transformation', title: 'Then see the system of dependencies', body: 'The view expands to capabilities, target state, governance, operating model and the sequence between current and future state.' },
      { stage: 'Strategy, portfolio & PMO', title: 'Then design the choice mechanism', body: 'Attention shifts to capital allocation, prioritization, decision rights and whether portfolio is the real expression of strategy.' },
      { stage: 'Today', title: 'Executive synthesis', body: 'Current accountability connects Enterprise Architecture, Strategy and PMO. The center of gravity is one decision cadence across direction, architecture, investment and execution.' },
    ],
    role: { eyebrow: 'Today', title: 'Director of Enterprise Architecture, Strategy & PMO', body: 'I work at the scale of public digital services, across executive leadership, business and technology. The role naturally connects enterprise architecture, strategy, portfolio, governance and execution mechanisms — the domains treated on this site as one system.' },
    principles: [
      { title: 'Clarity over volume', body: 'A better decision matters more than more artifacts. Start with problem, criteria, owner and consequence.' }, { title: 'Architecture as leverage', body: 'Architecture should increase the organization’s ability to change, not only describe a target state.' }, { title: 'Outcome over activity', body: 'Status matters when it shows a change in outcome, risk, time, cost or capability.' }, { title: 'Evidence over opinion', body: 'A strong opinion remains a hypothesis until execution can confirm or disprove it.' }, { title: 'Organizations are human systems', body: 'Mandates, incentives, relationships, accountability and funding are as architectural as processes and technology.' },
    ],
    credentials: { eyebrow: 'Evidence / lower in hierarchy', title: 'Experience and education should confirm the perspective — not replace the argument.', items: [
      { title: '10+ years', body: 'Experience spanning technology and execution through enterprise architecture, strategy, transformation and PMO.' }, { title: 'Kozminski University · 2024–2025', body: 'MBA / strategic development, including an award for Best Strategic Business Project.' }, { title: 'Certifications', body: 'Azure Fundamentals, AgilePM, PRINCE2 and SAFe Lean Portfolio Management — tools, not professional identity.' }, { title: 'Public debate and speaking', body: 'Public conversations around enterprise architecture, transformation, AI governance and the role of technology in organizations.' },
    ] },
  },
};

export const platform: Record<Locale, typeof pl | typeof en> = { pl, en };
export const platformSources = sources;
