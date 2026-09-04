import type { Locale } from '../lib/site';

export type CaseStudy = {
  tag: string;
  title: string;
  context: string;
  challenge: string;
  approach: string;
  value: string;
};

const pl: CaseStudy[] = [
  {
    tag: 'Strategia technologiczna',
    title: 'Od listy inicjatyw technologicznych do wspólnego kierunku inwestycyjnego',
    context: 'Strategia technologiczna w złożonej organizacji, w której decyzje architektoniczne, platformowe i inwestycyjne powstawały w różnych rytmach.',
    challenge: 'Połączyć kierunek biznesowy, zdolności organizacyjne, technologię i ograniczenia portfela w jeden zestaw wyborów, zamiast tworzyć katalog aspiracji.',
    approach: 'Zbudowanie logiki kierunku technologicznego, zasad decyzyjnych, priorytetów zdolności i zależności pomiędzy stanem docelowym a portfelem zmian.',
    value: 'Wartość: wspólny język do rozmowy o inwestycjach, kompromisach i kolejności zmian oraz czytelniejsze kryteria dla kolejnych decyzji technologicznych.',
  },
  {
    tag: 'Modele referencyjne',
    title: 'Modele referencyjne jako mechanizm spójności, nie biblioteka diagramów',
    context: 'Środowisko, w którym podobne problemy technologiczne były rozwiązywane wielokrotnie i lokalnie, a standardy nie zawsze przechodziły do praktyki delivery.',
    challenge: 'Zaprojektować modele na poziomie wystarczająco konkretnym, żeby przyspieszały decyzje, ale nie zamieniały się w sztywne wzorce oderwane od kontekstu.',
    approach: 'Połączenie wzorców architektonicznych, zasad, wariantów użycia, punktów decyzyjnych i kryteriów odstępstwa z realnym procesem projektowania rozwiązań.',
    value: 'Wartość: większa powtarzalność decyzji, mniej lokalnych reinwencji i lepszy most pomiędzy architekturą korporacyjną a zespołami wykonawczymi.',
  },
  {
    tag: 'Racjonalizacja portfela',
    title: 'Portfel jako wybór: redukcja nakładania się inicjatyw i zależności',
    context: 'Portfel zmian z dużą liczbą równoległych inicjatyw, współdzielonymi zdolnościami i konkurencją o te same zasoby.',
    challenge: 'Oddzielić inicjatywy naprawdę strategiczne od duplikacji, lokalnych optymalizacji i pracy, która nie miała wystarczającego uzasadnienia systemowego.',
    approach: 'Analiza inicjatyw przez pryzmat rezultatów, zdolności, zależności, kosztu alternatywnego i architektury docelowej, a następnie budowa logiki stop / merge / sequence / continue.',
    value: 'Wartość: lepsza podstawa do realnej priorytetyzacji, ograniczania pracy w toku i sekwencjonowania inwestycji zgodnie z zależnościami.',
  },
  {
    tag: 'Analiza wpływu euro',
    title: 'Analiza wpływu przyjęcia euro jako problem przekrojowy, nie projekt jednego systemu',
    context: 'Analiza potencjalnej zmiany waluty obejmująca procesy biznesowe, dane, systemy, integracje, raportowanie, rozliczenia i zależności organizacyjne.',
    challenge: 'Zobaczyć pełny wpływ zmiany zanim zostanie rozproszony pomiędzy właścicieli systemów, procesów i inicjatyw, które lokalnie widzą tylko własny fragment.',
    approach: 'Mapa wpływu, identyfikacja krytycznych zależności, klasyfikacja obszarów zmian, ocena gotowości oraz przełożenie wyników na sekwencję decyzji i potencjalny portfel przygotowawczy.',
    value: 'Wartość: wspólna mapa konsekwencji i zależności, która pozwala wcześniej rozmawiać o ryzyku, kolejności zmian i odpowiedzialności.',
  },
  {
    tag: 'Governance',
    title: 'Governance projektowane wokół decyzji, a nie liczby forów',
    context: 'Środowisko z wieloma ciałami decyzyjnymi, review, standardami i odpowiedzialnościami przecinającymi biznes, technologię i architekturę.',
    challenge: 'Ograniczyć sytuacje, w których ta sama decyzja krąży pomiędzy forami, a odpowiedzialność pozostaje rozmyta.',
    approach: 'Porządkowanie typów decyzji, mandatów, właścicieli, wymaganych dowodów, ścieżek eskalacji i rytmu przeglądów, z naciskiem na minimalną liczbę potrzebnych punktów kontroli.',
    value: 'Wartość: governance jako czytelna architektura praw decyzyjnych i odpowiedzialności, zamiast kolejnej warstwy administracyjnej.',
  },
  {
    tag: 'PMO',
    title: 'PMO przesunięte z raportowania statusu w stronę jakości portfela i decyzji',
    context: 'Praktyka PMO wymagająca silniejszego połączenia z priorytetami strategicznymi, zależnościami i realną zdolnością organizacji do wykonania zmian.',
    challenge: 'Zamienić statusowanie projektów w mechanizm, który pomaga wybierać, zatrzymywać, sekwencjonować i eskalować decyzje na poziomie portfela.',
    approach: 'Wspólna logika portfelowa, przegląd zależności i rezultatów, pakiety decyzyjne stop / start / continue oraz rytm łączący strategię, architekturę i wykonanie.',
    value: 'Wartość: PMO bliżej roli systemu informacji i decyzji dla portfela, a dalej od roli centralnego kolektora statusów.',
  },
];

const en: CaseStudy[] = [
  {
    tag: 'Technology strategy',
    title: 'From a list of technology initiatives to a shared investment direction',
    context: 'Technology strategy in a complex organization where architecture, platform and investment decisions operated on different cadences.',
    challenge: 'Connect business direction, organizational capabilities, technology and portfolio constraints into explicit choices rather than a catalogue of aspirations.',
    approach: 'Define technology direction, decision principles, priority capabilities and dependencies between target state and the change portfolio.',
    value: 'Value: a shared language for investment, trade-offs and sequencing, with clearer criteria for subsequent technology decisions.',
  },
  {
    tag: 'Reference models',
    title: 'Reference models as a coherence mechanism, not a diagram library',
    context: 'An environment where similar technology problems were repeatedly solved locally and standards did not always reach delivery practice.',
    challenge: 'Design models concrete enough to accelerate decisions without turning them into rigid patterns detached from context.',
    approach: 'Connect architecture patterns, principles, usage variants, decision points and exception criteria to the real solution-design process.',
    value: 'Value: more repeatable decisions, less local reinvention and a stronger bridge between enterprise architecture and delivery teams.',
  },
  {
    tag: 'Portfolio rationalization',
    title: 'Portfolio as a choice: reducing overlap and exposing dependencies',
    context: 'A change portfolio with many parallel initiatives, shared capabilities and competition for the same capacity.',
    challenge: 'Separate genuinely strategic work from duplication, local optimization and activity without enough system-level justification.',
    approach: 'Assess initiatives through outcomes, capabilities, dependencies, opportunity cost and target architecture, then build stop / merge / sequence / continue logic.',
    value: 'Value: a stronger basis for real prioritization, limiting work in progress and sequencing investment around dependencies.',
  },
  {
    tag: 'Euro impact analysis',
    title: 'Euro adoption impact as a cross-system problem, not a single-system project',
    context: 'Potential currency-change impact across business processes, data, systems, integrations, reporting, settlement and organizational dependencies.',
    challenge: 'See the full impact before it fragments across system owners, process owners and initiatives that each see only one part.',
    approach: 'Build an impact map, identify critical dependencies, classify change domains, assess readiness and translate findings into decision sequence and a potential preparation portfolio.',
    value: 'Value: a shared map of consequences and dependencies that enables earlier discussion of risk, sequencing and accountability.',
  },
  {
    tag: 'Governance',
    title: 'Governance designed around decisions rather than the number of forums',
    context: 'An environment with multiple decision bodies, reviews, standards and responsibilities spanning business, technology and architecture.',
    challenge: 'Reduce situations where the same decision circulates between forums while accountability remains unclear.',
    approach: 'Clarify decision types, mandates, owners, required evidence, escalation paths and review cadence, with the minimum number of control points needed.',
    value: 'Value: governance as an explicit architecture of decision rights and accountability rather than another administrative layer.',
  },
  {
    tag: 'PMO',
    title: 'Moving PMO from status reporting toward portfolio and decision quality',
    context: 'A PMO practice needing a stronger link to strategic priorities, dependencies and the organization’s real capacity to execute change.',
    challenge: 'Turn project reporting into a mechanism that helps select, stop, sequence and escalate decisions at portfolio level.',
    approach: 'Introduce shared portfolio logic, dependency and outcome reviews, stop / start / continue decision packages and a cadence connecting strategy, architecture and execution.',
    value: 'Value: PMO closer to a portfolio information-and-decision system and further from a central status-collection function.',
  },
];

export const caseStudies: Record<Locale, CaseStudy[]> = { pl, en };
