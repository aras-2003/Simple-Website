export type Principle = {
  title: string;
  statement: string;
  practice: string;
};

export const editorialPl = {
    nav: { oaf: 'OAF', work: 'Praktyka', writing: 'Perspektywa', about: 'O mnie', contact: 'Kontakt', privacy: 'Prywatność' },
    home: {
      writingEyebrow: 'Perspektywa / Notes',
      writingTitle: 'Idee powinny dać się sprawdzić w praktyce.',
      writingBody: 'Publikuję krótkie tezy o architekturze, strategii, portfolio, AI i mechanizmach transformacji. Bez kalendarza treści — tylko wtedy, gdy jest własna myśl do obrony.',
      writingCta: 'Czytaj perspektywę',
      contactEyebrow: 'Kontakt',
      contactTitle: 'Najciekawsze rozmowy zaczynają się od konkretnego problemu, nie od briefu sprzedażowego.',
      contactBody: 'Jeżeli pracujesz nad zmianą, która przecina strategię, architekturę, portfolio albo technologię, opisz kontekst i decyzję, z którą się mierzysz. Odpowiem, jeśli widzę sensowny punkt zaczepienia.',
      contactCta: 'Napisz wiadomość',
    },
    about: {
      introEyebrow: 'Operating philosophy',
      introTitle: 'Pięć zasad, które trzymają system decyzji w ryzach.',
      introBody: 'To nie deklaracje wartości na ścianę. Każda z tych zasad ma wpływać na sposób prowadzenia rozmowy, projektowania governance, priorytetyzacji i oceny postępu.',
      principles: [
        { title: 'Clarity over volume', statement: 'Lepsza decyzja jest ważniejsza niż większa liczba artefaktów.', practice: 'W praktyce: jasny problem, kryteria wyboru, właściciel decyzji i ślad do konsekwencji — zanim powstanie kolejny deck lub model.' },
        { title: 'Architecture as leverage', statement: 'Architektura ma zwiększać zdolność organizacji do zmiany.', practice: 'W praktyce: decyzje architektoniczne łączę z capability, inwestycjami, zależnościami i tempem delivery, zamiast ograniczać je do standardów technologicznych.' },
        { title: 'Outcomes over activity', statement: 'Aktywność nie jest dowodem postępu.', practice: 'W praktyce: status projektu interesuje mnie dopiero wtedy, gdy można pokazać zmianę w rezultacie, ryzyku, koszcie, czasie albo zdolności organizacyjnej.' },
        { title: 'Evidence over opinion', statement: 'Silna opinia jest hipotezą, dopóki nie spotka się z dowodem.', practice: 'W praktyce: założenia zapisuję explicite, a decyzje projektuję tak, żeby wykonanie mogło je potwierdzić, skorygować albo obalić.' },
        { title: 'Human systems matter', statement: 'Struktura odpowiedzialności potrafi unieważnić najlepszy diagram.', practice: 'W praktyce: patrzę na operating model, mandaty, przepływ decyzji, finansowanie i zachowania ludzi jako część architektury organizacji.' },
      ] as Principle[],
      bridgeTitle: 'Mój punkt ciężkości',
      bridgeBody: 'Najwięcej wartości widzę nie w optymalizacji pojedynczej funkcji, ale w projektowaniu połączeń: strategia ↔ architektura, architektura ↔ portfolio, portfolio ↔ delivery oraz evidence ↔ kolejna decyzja.',
    },
    oaf: {
      layersTitle: 'Cztery warstwy — jedna pętla decyzyjna',
      layersBody: 'Każda warstwa odpowiada na inne pytanie. Wartość pojawia się dopiero wtedy, gdy odpowiedzi są ze sobą spójne i mają mechanizm sprzężenia zwrotnego.',
      layerDetails: [
        { title: 'Direction', question: 'Dokąd i po co zmieniamy organizację?', body: 'Kierunek musi być wystarczająco konkretny, żeby odróżnić dobrą decyzję od wygodnej. Obejmuje outcome, granice, trade-offy i kryteria sukcesu.' },
        { title: 'Choices', question: 'Jakie decyzje architektoniczne umożliwiają ten kierunek?', body: 'Tu strategia spotyka capability, target state, zasady, ograniczenia i świadome kompromisy. Wybór oznacza również decyzję, czego nie robimy.' },
        { title: 'Priorities', question: 'Co finansujemy, w jakiej kolejności i kosztem czego?', body: 'Portfolio zamienia kierunek i wybory w sekwencję inwestycji. Priorytet ma sens tylko wtedy, gdy ma właściciela, zależności i jawne kryteria.' },
        { title: 'Evidence', question: 'Czego nauczyło nas wykonanie?', body: 'Delivery dostarcza danych o rezultatach, ryzykach i błędnych założeniach. Evidence nie zamyka cyklu — zasila kolejną decyzję o kierunku, architekturze albo priorytecie.' },
      ],
      principlesTitle: 'Pryncypia OAF',
      principlesLead: 'Model ma działać jak kontrakt jakości decyzji. Dlatego ważniejsze od kolejności diagramów są poniższe reguły.',
      principles: [
        { title: 'Traceability', body: 'Każda istotna inicjatywa powinna mieć czytelny ślad do outcome strategicznego i decyzji, która uzasadnia jej istnienie.' },
        { title: 'Explicit trade-offs', body: 'Decyzja bez kosztu alternatywnego jest zwykle życzeniem. Trade-off powinien być nazwany razem z konsekwencją.' },
        { title: 'Portfolio is a choice', body: 'Portfolio nie jest listą wszystkich dobrych pomysłów. Jest mechanizmem świadomego ograniczania pracy do tego, co najważniejsze.' },
        { title: 'Architecture is executable', body: 'Architektura powinna prowadzić do zmian w produktach, platformach, danych, organizacji lub sposobie finansowania — inaczej pozostaje opisem.' },
        { title: 'Evidence can reverse a decision', body: 'Jeżeli wykonanie pokazuje, że założenie było błędne, system musi umożliwiać korektę bez traktowania jej jak porażki governance.' },
        { title: 'One decision cadence', body: 'Strategia, architektura, portfolio i delivery potrzebują wspólnego rytmu przeglądu, zamiast czterech niezależnych kalendarzy kontroli.' },
      ],
      usesTitle: 'Kiedy ten sposób myślenia jest szczególnie użyteczny',
      uses: [
        { title: 'Transformacja przecina wiele silosów', body: 'Kiedy jedna inicjatywa dotyka modelu operacyjnego, technologii, danych, finansowania i odpowiedzialności jednocześnie.' },
        { title: 'Portfolio jest przeładowane', body: 'Kiedy organizacja ma więcej inicjatyw niż realnej zdolności wykonania i potrzebuje wspólnych kryteriów odcinania pracy.' },
        { title: 'Architektura traci wpływ', body: 'Kiedy modele i standardy są poprawne, ale nie zmieniają decyzji inwestycyjnych, produktowych ani technologicznych.' },
      ],
    },
    work: {
      introTitle: 'Praktyka zaczyna się od problemu decyzyjnego.',
      introBody: 'Nie traktuję poniższych obszarów jako katalogu usług. To zestaw perspektyw, które łączę zależnie od tego, gdzie organizacja traci spójność, tempo albo jakość decyzji.',
      areas: [
        { title: 'Enterprise Architecture', promise: 'Od dokumentacji do mechanizmu wyboru.', body: 'Projektowanie capability, target state, zasad, governance i roadmaps tak, żeby wpływały na inwestycje i kolejność zmian.', questions: ['Które capability naprawdę ograniczają strategię?', 'Jakie decyzje są odwracalne, a które tworzą dług technologiczny lub organizacyjny?', 'Gdzie standard pomaga skalować, a gdzie blokuje wartość?'], outputs: 'Typowe rezultaty: decision principles, capability view, target architecture, transition roadmap, governance cadence.' },
        { title: 'Strategy & Transformation', promise: 'Od ambicji do wyborów i operating modelu.', body: 'Przekładanie kierunku strategicznego na mierzalne outcomes, trade-offy, portfel zmian i odpowiedzialność za wykonanie.', questions: ['Co musi być prawdą, żeby strategia zadziałała?', 'Jakie zdolności organizacja musi zbudować lub wygasić?', 'Które decyzje wymagają poziomu executive?'], outputs: 'Typowe rezultaty: strategic choices, transformation map, operating model decisions, outcome tree, executive decision cadence.' },
        { title: 'PMO & Portfolio', promise: 'Od listy projektów do alokacji kapitału i uwagi.', body: 'Budowanie priorytetyzacji, zarządzania zależnościami i rytmu portfolio wokół wartości, ograniczeń i outcome, a nie wyłącznie statusów.', questions: ['Co przestajemy robić?', 'Które zależności zmieniają kolejność inwestycji?', 'Czy finansowanie odzwierciedla deklarowaną strategię?'], outputs: 'Typowe rezultaty: portfolio criteria, dependency map, investment logic, outcome review, stop/start/continue decisions.' },
        { title: 'AI & Technology', promise: 'Adopcja technologii bez utraty odpowiedzialności.', body: 'Łączenie AI governance, cloud, platform engineering, DevSecOps i technology radar z realnymi scenariuszami biznesowymi i profilem ryzyka.', questions: ['Gdzie AI tworzy mierzalną przewagę, a gdzie tylko atrakcyjny demo effect?', 'Jak dobrać guardrails do ryzyka?', 'Które platform capabilities powinny być wspólne?'], outputs: 'Typowe rezultaty: AI guardrails, technology principles, platform choices, adoption roadmap, risk and evidence model.' },
      ],
      intersectionsTitle: 'Największa dźwignia jest pomiędzy obszarami.',
      intersections: ['Strategy ↔ Architecture: czy target state faktycznie umożliwia kierunek?', 'Architecture ↔ Portfolio: czy inwestujemy w zależności we właściwej kolejności?', 'Portfolio ↔ Delivery: czy ograniczenie WIP zwiększa tempo i jakość?', 'Delivery ↔ Strategy: czy evidence zmienia nasze założenia i kolejne priorytety?'],
    },
    writing: {
      label: 'Perspektywa / Notes',
      title: 'Krótkie teksty o tym, jak decyzje przechodzą przez organizację.',
      body: 'Piszę przede wszystkim po to, żeby doprecyzować tezę. Każdy tekst zaczyna się od konkretnego napięcia: między strategią i wykonaniem, governance i tempem albo innowacją i odpowiedzialnością.',
      read: 'Czytaj',
      min: 'min',
    },
    contact: {
      title: 'Kontakt — Arkadiusz Kamrowski',
      description: 'Kontakt z Arkadiuszem Kamrowskim w sprawie enterprise architecture, strategii, transformacji, portfolio, AI, wystąpień i współpracy eksperckiej.',
      eyebrow: 'Kontakt',
      headline: 'Opisz problem, który wymaga lepszego systemu decyzji.',
      lead: 'Najbardziej użyteczny pierwszy kontakt zawiera kontekst, decyzję do podjęcia i ograniczenia. Nie potrzebuję rozbudowanego briefu — wystarczy kilka konkretnych zdań.',
      fitTitle: 'Dobry punkt startu',
      fit: ['enterprise architecture lub target operating model', 'strategia i portfolio transformacji', 'PMO, priorytetyzacja i governance', 'AI governance i odpowiedzialna adopcja technologii', 'debata, panel, keynote lub rozmowa ekspercka'],
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
