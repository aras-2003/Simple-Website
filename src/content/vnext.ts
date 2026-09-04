import type { Locale } from '../lib/site';

export type EvidenceSignal = {
  value: string;
  title: string;
  body: string;
  source: string;
  href: string;
};

export type ReferenceThread = {
  author: string;
  concept: string;
  contribution: string;
  href: string;
};

export type Intersection = {
  title: string;
  question: string;
  body: string;
  misfit: string;
};

export type TrajectoryStage = {
  stage: string;
  title: string;
  body: string;
};

const pl = {
  home: {
    domain: 'Architektura organizacyjna · Strategia · Portfel · Wykonanie',
    perspectiveEyebrow: 'Perspektywa / dane i napięcia',
    perspectiveTitle: 'Problem nie polega na braku frameworków. Polega na tym, że organizacja nie działa jak jeden system.',
    perspectiveBody: 'Badania transformacji, operating modelu i projektowania organizacji wracają do tego samego motywu: strategia, struktura, decyzje, finansowanie, technologia i sposób pracy muszą pozostawać w zgodzie. Kiedy każdy obszar optymalizuje się osobno, lokalna poprawa nie składa się w wynik całej organizacji.',
    oafBridge: 'OAF pojawia się dopiero tutaj — jako sposób spięcia tych zależności w jeden rytm decyzji, a nie jako framework szukający problemu.',
    aboutEyebrow: 'Trajektoria / od wykonania do systemu',
    aboutTitle: 'Moja perspektywa powstała od dołu: od delivery i technologii do strategii, governance i odpowiedzialności za cały system.',
    aboutBody: 'To ważne, bo model organizacyjny nie może istnieć wyłącznie w prezentacji. Musi przeżyć kontakt z ograniczeniami delivery, architekturą, finansowaniem, odpowiedzialnością i realnym tempem decyzji.',
  },
  evidence: [
    {
      value: '26%',
      title: 'Transformacje, które tworzą trwałą wartość',
      body: 'Globalna analiza BCG z 2024 r. wskazuje, że tylko 26% transformacji stworzyło wartość jednocześnie w krótkim i długim horyzoncie. To problem systemu wykonania, nie braku ambicji.',
      source: 'BCG · Five Truths (and One Lie) About Corporate Transformation · 2024',
      href: 'https://www.bcg.com/publications/2024/five-truths-and-a-lie-about-corporate-transformation',
    },
    {
      value: '53%',
      title: 'Deklarowana zwinność, która dowozi wynik',
      body: 'W badaniu 127 firm BCG 66% deklarowało udaną transformację agile, ale tylko 53% spełniło kryteria realnego wpływu i trwałej zmiany. Praktyka bez spójnego operating modelu łatwo staje się rytuałem.',
      source: 'BCG · Why Companies Get Agile Right—and Wrong · 2024',
      href: 'https://www.bcg.com/publications/2024/why-companies-get-agile-right-wrong',
    },
    {
      value: '73,8%',
      title: 'Średni poziom performance projektów',
      body: 'PMI pokazuje, że sam wybór metodyki nie determinuje wyniku: predictive, hybrid i agile mogą działać podobnie. Większą różnicę robią zdolności organizacji, empowerment i dopasowanie sposobu pracy do kontekstu.',
      source: 'PMI · Pulse of the Profession · 2024',
      href: 'https://www.pmi.org/learning/thought-leadership/future-of-project-work',
    },
  ] satisfies EvidenceSignal[],
  orgArchitecture: {
    eyebrow: 'Definicja / organizacja jako system',
    title: 'Architektura organizacyjna nie jest nowym terminem — nowy ma być sposób użycia jej jako mechanizmu decyzji.',
    definition: 'Przez architekturę organizacyjną rozumiem projekt współzależnych elementów organizacji: strategii, struktury i praw decyzyjnych, procesów i przepływów informacji, ludzi i kompetencji, zachęt, governance, technologii oraz mechanizmów pomiaru. Jej jakość wynika z dopasowania tych elementów do celu i otoczenia, a nie z jakości pojedynczego diagramu.',
    oafDefinition: 'OAF — Organizational Architecture Framework — jest na tej stronie nazwą praktycznej syntezy. Nie jest roszczeniem do wynalezienia organizational architecture ani kolejnym „standardem branżowym”. Łączy istniejące nurty organization design i enterprise architecture z logiką portfolio, wykonania oraz evidence tak, aby można było śledzić decyzję od kierunku do rezultatu i z powrotem.',
  },
  lineage: [
    {
      author: 'Jay Galbraith',
      concept: 'Star Model',
      contribution: 'Strategia, struktura, procesy, rewards i ludzie jako współzależne dźwignie projektu organizacji. Fundament: organizacja to więcej niż org chart.',
      href: 'https://jaygalbraith.com/services/star-model/',
    },
    {
      author: 'David Nadler & Michael Tushman',
      concept: 'Congruence / information processing',
      contribution: 'Skuteczność zależy od zgodności elementów organizacji z zadaniem, strategią i poziomem niepewności; projekt organizacji to także projekt przepływu informacji i koordynacji.',
      href: 'https://journals.aom.org/doi/10.5465/amr.1978.4305791',
    },
    {
      author: 'McKinsey / Peters, Waterman, Phillips',
      concept: '7-S',
      contribution: 'Struktura nie jest organizacją. Strategia, systems, skills, staff, style i shared values wzajemnie się wzmacniają lub blokują.',
      href: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework',
    },
    {
      author: 'Richard Burton & Børge Obel',
      concept: 'Fit / misfit',
      contribution: 'Organization design jest problemem dopasowania: między strategią, kontekstem, strukturą i mechanizmami koordynacji. Misfit jest sygnałem do przeprojektowania systemu.',
      href: 'https://link.springer.com/article/10.1186/s41469-018-0029-2',
    },
    {
      author: 'Jeanne Ross, Peter Weill & David Robertson',
      concept: 'Operating model + enterprise architecture',
      contribution: 'MIT CISR łączy operating model z enterprise architecture jako organizującą logiką procesów i zdolności IT. To ważny most między strategią a fundamentem wykonania.',
      href: 'https://cisr.mit.edu/publication/enterprise-architecture-as-strategy',
    },
  ] satisfies ReferenceThread[],
  intersections: [
    {
      title: 'Strategia ↔ Architektura',
      question: 'Czy docelowy kształt organizacji rzeczywiście umożliwia wybrany kierunek?',
      body: 'Strategia definiuje wybór i outcome; architektura przekłada je na capability, decyzje, granice, standardy i target state. Bez tego strategia jest zbiorem ambicji, a architektura optymalizuje technologię bez kontekstu biznesowego.',
      misfit: 'Sygnał rozjazdu: strategiczne priorytety zmieniają się szybciej niż decyzje architektoniczne albo target state nie ma śladu do konkretnych outcomes.',
    },
    {
      title: 'Architektura ↔ Portfel',
      question: 'Czy finansujemy zależności i zdolności w kolejności, która pozwala wykonać architekturę?',
      body: 'Portfel jest miejscem, w którym architektura przestaje być intencją. Priorytety, capacity i budżet powinny finansować nie tylko funkcje widoczne dla biznesu, ale również krytyczne zależności i platformowe zdolności umożliwiające zmianę.',
      misfit: 'Sygnał rozjazdu: roadmapa architektoniczna wskazuje krytyczne zależności, ale portfolio stale finansuje lokalnie atrakcyjne inicjatywy przed fundamentami.',
    },
    {
      title: 'Portfel ↔ Wykonanie',
      question: 'Czy priorytet naprawdę ogranicza WIP, przesuwa zasoby i zmienia kolejność pracy?',
      body: 'Ranking bez realokacji nie jest priorytetyzacją. Portfel musi uwzględniać capacity, zależności i koszt alternatywny, a delivery musi zwracać informację o ryzyku, tempie i osiąganym outcome.',
      misfit: 'Sygnał rozjazdu: wszystko pozostaje „priorytetem”, liczba aktywnych inicjatyw rośnie, a statusy są raportowane bez decyzji stop/start/continue.',
    },
    {
      title: 'Wykonanie ↔ Strategia',
      question: 'Czy evidence z rynku i delivery może naprawdę zmienić wcześniejsze założenie?',
      body: 'Wykonanie nie powinno jedynie potwierdzać planu. Powinno generować dowody o wartości, ryzyku i trafności założeń, które mogą zmienić finansowanie, architekturę albo sam kierunek.',
      misfit: 'Sygnał rozjazdu: organizacja mierzy zgodność z planem, ale nie ma forum ani mandatu, by na podstawie danych zmienić plan.',
    },
  ] satisfies Intersection[],
  trajectory: [
    {
      stage: 'Wykonanie i technologia',
      title: 'Najpierw realia delivery',
      body: 'Praca blisko technologii, DevSecOps, platform i wykonania uczy, że decyzja strategiczna jest tyle warta, ile organizacja potrafi z niej zbudować i utrzymać.',
    },
    {
      stage: 'Architektura i transformacja',
      title: 'Od rozwiązania do systemu zależności',
      body: 'Perspektywa rozszerza się z pojedynczych rozwiązań na capability, target state, governance, zależności i sposób, w jaki organizacja przechodzi przez zmianę.',
    },
    {
      stage: 'Strategia, portfel i governance',
      title: 'Od spójności technicznej do spójności decyzji',
      body: 'Kolejny poziom to pytania o priorytety, finansowanie, mandaty, operating model i to, czy deklarowana strategia jest widoczna w realnej alokacji uwagi i kapitału.',
    },
    {
      stage: 'Synteza executive',
      title: 'Architektura organizacyjna jako mechanizm wykonania strategii',
      body: 'Obecny punkt ciężkości łączy enterprise architecture, strategię i PMO. OAF jest próbą zebrania tych doświadczeń w spójny język decyzji — nie zamkniętą metodologią.',
    },
  ] satisfies TrajectoryStage[],
};

const en = {
  home: {
    domain: 'Organizational architecture · Strategy · Portfolio · Execution',
    perspectiveEyebrow: 'Perspective / evidence and tensions',
    perspectiveTitle: 'The problem is not a shortage of frameworks. It is that the organization does not operate as one system.',
    perspectiveBody: 'Research on transformation, operating models and organization design keeps returning to the same pattern: strategy, structure, decisions, funding, technology and ways of working need to fit. When each domain optimizes independently, local improvements do not add up to enterprise performance.',
    oafBridge: 'OAF enters only at this point — as a way to connect these dependencies into one decision rhythm, not as a framework looking for a problem.',
    aboutEyebrow: 'Trajectory / from delivery to system design',
    aboutTitle: 'My perspective grew bottom-up: from delivery and technology to strategy, governance and accountability for the whole system.',
    aboutBody: 'That matters because an organization model cannot live only in a presentation. It has to survive contact with delivery constraints, architecture, funding, accountability and the real pace of decisions.',
  },
  evidence: [
    { value: '26%', title: 'Transformations creating durable value', body: 'BCG’s 2024 global analysis found that only 26% of transformations created value in both the short and long term. The constraint is the execution system, not a shortage of ambition.', source: 'BCG · Five Truths (and One Lie) About Corporate Transformation · 2024', href: 'https://www.bcg.com/publications/2024/five-truths-and-a-lie-about-corporate-transformation' },
    { value: '53%', title: 'Claimed agility that delivers impact', body: 'In BCG research across 127 companies, 66% claimed successful agile transformations while only 53% met the bar for real impact and lasting change. Practices without a coherent operating model can become ritual.', source: 'BCG · Why Companies Get Agile Right—and Wrong · 2024', href: 'https://www.bcg.com/publications/2024/why-companies-get-agile-right-wrong' },
    { value: '73.8%', title: 'Average project performance rate', body: 'PMI reports that predictive, hybrid and agile approaches can perform similarly. Organizational capability, empowerment and fit-for-purpose delivery matter more than ideology about one method.', source: 'PMI · Pulse of the Profession · 2024', href: 'https://www.pmi.org/learning/thought-leadership/future-of-project-work' },
  ] satisfies EvidenceSignal[],
  orgArchitecture: {
    eyebrow: 'Definition / organization as a system',
    title: 'Organizational architecture is not a new term — what should be new is using it as a decision mechanism.',
    definition: 'By organizational architecture I mean the design of interdependent elements of an organization: strategy, structure and decision rights, processes and information flows, people and capabilities, incentives, governance, technology and measurement. Its quality comes from fit between those elements, the purpose and the environment — not from the quality of one diagram.',
    oafDefinition: 'OAF — Organizational Architecture Framework — is used here as the name of a practical synthesis. It does not claim to invent organizational architecture or establish another industry standard. It connects established organization-design and enterprise-architecture thinking with portfolio logic, execution and evidence so a decision can be traced from direction to outcome and back.',
  },
  lineage: [
    { author: 'Jay Galbraith', concept: 'Star Model', contribution: 'Strategy, structure, processes, rewards and people as interdependent organization-design levers. The foundation: an organization is more than an org chart.', href: 'https://jaygalbraith.com/services/star-model/' },
    { author: 'David Nadler & Michael Tushman', concept: 'Congruence / information processing', contribution: 'Effectiveness depends on congruence between organizational components, task, strategy and uncertainty; organization design is also information and coordination design.', href: 'https://journals.aom.org/doi/10.5465/amr.1978.4305791' },
    { author: 'McKinsey / Peters, Waterman, Phillips', concept: '7-S', contribution: 'Structure is not organization. Strategy, systems, skills, staff, style and shared values reinforce or constrain one another.', href: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework' },
    { author: 'Richard Burton & Børge Obel', concept: 'Fit / misfit', contribution: 'Organization design is a fit problem between strategy, contingencies, structure and coordination mechanisms. Misfit is evidence that the system needs redesign.', href: 'https://link.springer.com/article/10.1186/s41469-018-0029-2' },
    { author: 'Jeanne Ross, Peter Weill & David Robertson', concept: 'Operating model + enterprise architecture', contribution: 'MIT CISR links the operating model to enterprise architecture as the organizing logic for processes and IT capabilities — a critical bridge from strategy to execution foundation.', href: 'https://cisr.mit.edu/publication/enterprise-architecture-as-strategy' },
  ] satisfies ReferenceThread[],
  intersections: [
    { title: 'Strategy ↔ Architecture', question: 'Does the target shape of the organization genuinely enable the chosen direction?', body: 'Strategy defines choices and outcomes; architecture translates them into capabilities, boundaries, principles and target state. Without that bridge, strategy remains ambition while architecture optimizes technology without business context.', misfit: 'Misfit signal: strategic priorities change faster than architecture decisions, or the target state has no visible trace to outcomes.' },
    { title: 'Architecture ↔ Portfolio', question: 'Are dependencies and capabilities funded in the sequence required to make the architecture executable?', body: 'Portfolio is where architecture stops being intent. Capacity and funding need to cover not only visible business features but also critical dependencies and shared capabilities that enable change.', misfit: 'Misfit signal: architecture identifies critical dependencies while the portfolio repeatedly funds locally attractive initiatives ahead of the foundations.' },
    { title: 'Portfolio ↔ Execution', question: 'Does priority actually limit WIP, move resources and change work sequence?', body: 'A ranking without reallocation is not prioritization. Portfolio needs capacity, dependencies and opportunity cost; delivery needs to return evidence on risk, pace and outcomes.', misfit: 'Misfit signal: everything remains a priority, active initiatives keep growing and status reporting does not trigger stop/start/continue decisions.' },
    { title: 'Execution ↔ Strategy', question: 'Can evidence from market and delivery genuinely change an earlier assumption?', body: 'Execution should not merely confirm the plan. It should generate evidence about value, risk and assumptions that can change funding, architecture or direction.', misfit: 'Misfit signal: the organization measures plan conformance but has no forum or mandate to change the plan when evidence says it should.' },
  ] satisfies Intersection[],
  trajectory: [
    { stage: 'Delivery & technology', title: 'Start with the reality of execution', body: 'Working close to technology, DevSecOps, platforms and delivery teaches that a strategic decision is worth only as much as the organization can build and sustain from it.' },
    { stage: 'Architecture & transformation', title: 'From solution to a system of dependencies', body: 'The perspective expands from individual solutions to capabilities, target state, governance, dependencies and the way an organization moves through change.' },
    { stage: 'Strategy, portfolio & governance', title: 'From technical coherence to decision coherence', body: 'The next layer is priorities, funding, mandates, operating model and whether declared strategy is visible in the actual allocation of attention and capital.' },
    { stage: 'Executive synthesis', title: 'Organizational architecture as a strategy-execution mechanism', body: 'The current center of gravity connects enterprise architecture, strategy and PMO. OAF is an attempt to collect those experiences into a coherent decision language — not a closed methodology.' },
  ] satisfies TrajectoryStage[],
};

export const vnext: Record<Locale, typeof pl | typeof en> = { pl, en };
