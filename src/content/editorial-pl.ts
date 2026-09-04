export type Principle = {
  title: string;
  statement: string;
  practice: string;
};

export const editorialPl = {
  nav: { oaf: 'OAF', work: 'Praktyka', writing: 'Perspektywa', about: 'O mnie', contact: 'Kontakt', privacy: 'Prywatność' },
  home: {
    writingEyebrow: 'Perspektywa / Notatki',
    writingTitle: 'Idee powinny dać się sprawdzić w praktyce.',
    writingBody: 'Publikuję krótkie tezy o architekturze, strategii, portfelu, AI i mechanizmach transformacji. Bez kalendarza treści — tylko wtedy, gdy jest własna myśl do obrony.',
    writingCta: 'Czytaj perspektywę',
    contactEyebrow: 'Kontakt',
    contactTitle: 'Najciekawsze rozmowy zaczynają się od konkretnego problemu, nie od briefu sprzedażowego.',
    contactBody: 'Jeżeli pracujesz nad zmianą, która przecina strategię, architekturę, portfel albo technologię, opisz kontekst i decyzję, z którą się mierzysz. Odpowiem, jeśli widzę sensowny punkt zaczepienia.',
    contactCta: 'Napisz wiadomość',
  },
  about: {
    introEyebrow: 'Sposób pracy',
    introTitle: 'Pięć zasad, które trzymają system decyzji w ryzach.',
    introBody: 'To nie deklaracje wartości na ścianę. Każda z tych zasad wpływa na sposób prowadzenia rozmowy, projektowania governance, priorytetyzacji i oceny postępu.',
    principles: [
      { title: 'Jasność ponad objętość', statement: 'Lepsza decyzja jest ważniejsza niż większa liczba artefaktów.', practice: 'W praktyce: jasny problem, kryteria wyboru, właściciel decyzji i ślad do konsekwencji — zanim powstanie kolejna prezentacja lub model.' },
      { title: 'Architektura jako dźwignia', statement: 'Architektura ma zwiększać zdolność organizacji do zmiany.', practice: 'W praktyce: decyzje architektoniczne łączę ze zdolnościami, inwestycjami, zależnościami i tempem wykonania, zamiast ograniczać je do standardów technologicznych.' },
      { title: 'Rezultaty ponad aktywność', statement: 'Aktywność nie jest dowodem postępu.', practice: 'W praktyce: status projektu interesuje mnie dopiero wtedy, gdy można pokazać zmianę w rezultacie, ryzyku, koszcie, czasie albo zdolności organizacyjnej.' },
      { title: 'Dowody ponad opinię', statement: 'Silna opinia jest hipotezą, dopóki nie spotka się z dowodem.', practice: 'W praktyce: założenia zapisuję jawnie, a decyzje projektuję tak, żeby wykonanie mogło je potwierdzić, skorygować albo obalić.' },
      { title: 'Liczą się systemy ludzkie', statement: 'Struktura odpowiedzialności potrafi unieważnić najlepszy diagram.', practice: 'W praktyce: model operacyjny, mandaty, przepływ decyzji, finansowanie i zachowania ludzi traktuję jako część architektury organizacji.' },
    ] as Principle[],
    bridgeTitle: 'Mój punkt ciężkości',
    bridgeBody: 'Najwięcej wartości widzę nie w optymalizacji pojedynczej funkcji, ale w projektowaniu połączeń: strategia ↔ architektura, architektura ↔ portfel, portfel ↔ wykonanie oraz dowody ↔ kolejna decyzja.',
  },
  oaf: {
    layersTitle: 'Cztery warstwy — jedna pętla decyzyjna',
    layersBody: 'Każda warstwa odpowiada na inne pytanie. Wartość pojawia się dopiero wtedy, gdy odpowiedzi są ze sobą spójne i mają mechanizm sprzężenia zwrotnego.',
    layerDetails: [
      { title: 'Kierunek', question: 'Dokąd i po co zmieniamy organizację?', body: 'Kierunek musi być wystarczająco konkretny, żeby odróżnić dobrą decyzję od wygodnej. Obejmuje rezultat, granice, kompromisy i kryteria sukcesu.' },
      { title: 'Wybory', question: 'Jakie decyzje architektoniczne umożliwiają ten kierunek?', body: 'Tu strategia spotyka zdolności, stan docelowy, zasady, ograniczenia i świadome kompromisy. Wybór oznacza również decyzję, czego nie robimy.' },
      { title: 'Priorytety', question: 'Co finansujemy, w jakiej kolejności i kosztem czego?', body: 'Portfel zamienia kierunek i wybory w sekwencję inwestycji. Priorytet ma sens tylko wtedy, gdy ma właściciela, zależności i jawne kryteria.' },
      { title: 'Dowody', question: 'Czego nauczyło nas wykonanie?', body: 'Wykonanie dostarcza danych o rezultatach, ryzykach i błędnych założeniach. Dowody nie zamykają cyklu — zasilają kolejną decyzję o kierunku, architekturze albo priorytecie.' },
    ],
    principlesTitle: 'Pryncypia OAF',
    principlesLead: 'Model ma działać jak kontrakt jakości decyzji. Dlatego ważniejsze od kolejności diagramów są poniższe reguły.',
    principles: [
      { title: 'Pełna ścieżka decyzji', body: 'Każda istotna inicjatywa powinna mieć czytelny ślad do rezultatu strategicznego i decyzji, która uzasadnia jej istnienie.' },
      { title: 'Jawne kompromisy', body: 'Decyzja bez kosztu alternatywnego jest zwykle życzeniem. Kompromis powinien być nazwany razem z konsekwencją.' },
      { title: 'Portfel jest wyborem', body: 'Portfel nie jest listą wszystkich dobrych pomysłów. Jest mechanizmem świadomego ograniczania pracy do tego, co najważniejsze.' },
      { title: 'Architektura musi być wykonalna', body: 'Architektura powinna prowadzić do zmian w produktach, platformach, danych, organizacji lub sposobie finansowania — inaczej pozostaje opisem.' },
      { title: 'Dowód może odwrócić decyzję', body: 'Jeżeli wykonanie pokazuje, że założenie było błędne, system musi umożliwiać korektę bez traktowania jej jak porażki governance.' },
      { title: 'Jeden rytm decyzji', body: 'Strategia, architektura, portfel i wykonanie potrzebują wspólnego rytmu przeglądu, zamiast czterech niezależnych kalendarzy kontroli.' },
    ],
    usesTitle: 'Kiedy ten sposób myślenia jest szczególnie użyteczny',
    uses: [
      { title: 'Transformacja przecina wiele silosów', body: 'Kiedy jedna inicjatywa dotyka modelu operacyjnego, technologii, danych, finansowania i odpowiedzialności jednocześnie.' },
      { title: 'Portfel jest przeładowany', body: 'Kiedy organizacja ma więcej inicjatyw niż realnej zdolności wykonania i potrzebuje wspólnych kryteriów odcinania pracy.' },
      { title: 'Architektura traci wpływ', body: 'Kiedy modele i standardy są poprawne, ale nie zmieniają decyzji inwestycyjnych, produktowych ani technologicznych.' },
    ],
  },
  work: {
    introTitle: 'Praktyka zaczyna się od problemu decyzyjnego.',
    introBody: 'Nie traktuję poniższych obszarów jako katalogu usług. To zestaw perspektyw, które łączę zależnie od tego, gdzie organizacja traci spójność, tempo albo jakość decyzji.',
    areas: [
      { title: 'Architektura korporacyjna', promise: 'Od dokumentacji do mechanizmu wyboru.', body: 'Projektowanie zdolności, stanu docelowego, zasad, governance i roadmap tak, żeby wpływały na inwestycje i kolejność zmian.', questions: ['Które zdolności naprawdę ograniczają strategię?', 'Jakie decyzje są odwracalne, a które tworzą dług technologiczny lub organizacyjny?', 'Gdzie standard pomaga skalować, a gdzie blokuje wartość?'], outputs: 'Typowe rezultaty: zasady decyzyjne, mapa zdolności, architektura docelowa, roadmapa przejścia, rytm governance.' },
      { title: 'Strategia i transformacja', promise: 'Od ambicji do wyborów i modelu operacyjnego.', body: 'Przekładanie kierunku strategicznego na mierzalne rezultaty, kompromisy, portfel zmian i odpowiedzialność za wykonanie.', questions: ['Co musi być prawdą, żeby strategia zadziałała?', 'Jakie zdolności organizacja musi zbudować lub wygasić?', 'Które decyzje wymagają poziomu executive?'], outputs: 'Typowe rezultaty: wybory strategiczne, mapa transformacji, decyzje modelu operacyjnego, drzewo rezultatów, rytm decyzji executive.' },
      { title: 'PMO i portfel', promise: 'Od listy projektów do alokacji kapitału i uwagi.', body: 'Budowanie priorytetyzacji, zarządzania zależnościami i rytmu portfela wokół wartości, ograniczeń i rezultatów, a nie wyłącznie statusów.', questions: ['Co przestajemy robić?', 'Które zależności zmieniają kolejność inwestycji?', 'Czy finansowanie odzwierciedla deklarowaną strategię?'], outputs: 'Typowe rezultaty: kryteria portfelowe, mapa zależności, logika inwestycyjna, przegląd rezultatów, decyzje stop/start/continue.' },
      { title: 'AI i technologia', promise: 'Adopcja technologii bez utraty odpowiedzialności.', body: 'Łączenie governance AI, chmury, platform engineering, DevSecOps i radaru technologicznego z realnymi scenariuszami biznesowymi i profilem ryzyka.', questions: ['Gdzie AI tworzy mierzalną przewagę, a gdzie tylko atrakcyjne demo?', 'Jak dobrać guardrails do ryzyka?', 'Które zdolności platformowe powinny być wspólne?'], outputs: 'Typowe rezultaty: guardrails AI, zasady technologiczne, wybory platformowe, roadmapa adopcji, model ryzyka i dowodów.' },
    ],
    intersectionsTitle: 'Największa dźwignia jest pomiędzy obszarami.',
    intersections: [],
  },
  writing: {
    label: 'Perspektywa / Notatki',
    title: 'Krótkie teksty o tym, jak decyzje przechodzą przez organizację.',
    body: 'Piszę przede wszystkim po to, żeby doprecyzować tezę. Każdy tekst zaczyna się od konkretnego napięcia: między strategią i wykonaniem, governance i tempem albo innowacją i odpowiedzialnością.',
    read: 'Czytaj',
    min: 'min',
  },
  contact: {
    title: 'Kontakt — Arkadiusz Kamrowski',
    description: 'Kontakt z Arkadiuszem Kamrowskim w sprawie architektury korporacyjnej, strategii, transformacji, portfela, AI, wystąpień i współpracy eksperckiej.',
    eyebrow: 'Kontakt',
    headline: 'Opisz problem, który wymaga lepszego systemu decyzji.',
    lead: 'Najbardziej użyteczny pierwszy kontakt zawiera kontekst, decyzję do podjęcia i ograniczenia. Nie potrzebuję rozbudowanego briefu — wystarczy kilka konkretnych zdań.',
    fitTitle: 'Dobry punkt startu',
    fit: ['architektura korporacyjna lub docelowy model operacyjny', 'strategia i portfel transformacji', 'PMO, priorytetyzacja i governance', 'governance AI i odpowiedzialna adopcja technologii', 'debata, panel, keynote lub rozmowa ekspercka'],
    formTitle: 'Napisz wiadomość',
    formBody: 'Wiadomość trafi bezpośrednio na skonfigurowany adres e-mail. Formularz nie zapisuje zgłoszenia do newslettera ani automatycznego CRM.',
    privacy: 'Dane są używane do obsługi wiadomości i przekazywane przez usługę transactional email. Szczegóły znajdziesz w informacji o prywatności.',
    linkedin: 'Wolisz krócej? Napisz na LinkedIn.',
  },
  privacy: {
    title: 'Prywatność — Arkadiusz Kamrowski',
    description: 'Informacja o przetwarzaniu danych w formularzu kontaktowym strony Arkadiusza Kamrowskiego.',
    eyebrow: 'Prywatność', headline: 'Minimum danych. Jeden cel: odpowiedzieć na Twoją wiadomość.',
    lead: 'Strona nie używa analityki ani trackerów reklamowych. Formularz kontaktowy przetwarza tylko dane potrzebne do dostarczenia i obsługi wiadomości.',
    sections: [
      { title: 'Jakie dane', body: 'Imię i nazwisko, adres e-mail, opcjonalna organizacja, wybrany temat oraz treść wiadomości. Technicznie przetwarzane mogą być również podstawowe dane wymagane do ochrony formularza przed nadużyciami, np. adres IP.' },
      { title: 'Po co', body: 'Wyłącznie w celu dostarczenia wiadomości, odpowiedzi i zapewnienia bezpieczeństwa formularza. Dane nie są automatycznie dodawane do newslettera, profilu marketingowego ani systemu reklamowego.' },
      { title: 'Dostawca wysyłki', body: 'Warstwa contact API korzysta z Resend jako usługi transactional email. Klucze i adres odbiorczy pozostają po stronie serwera i nie są ujawniane w kodzie przeglądarki.' },
      { title: 'Retencja', body: 'Sama aplikacja nie tworzy bazy zgłoszeń. Wiadomość i techniczne logi mogą być przechowywane przez skrzynkę pocztową oraz dostawcę wysyłki zgodnie z ich konfiguracją i politykami retencji.' },
    ],
  },
} as const;
