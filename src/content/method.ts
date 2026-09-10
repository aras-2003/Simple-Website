import type { Locale } from '../lib/site';

interface MethodContent {
  title: string;
  lead: string;
  modelTitle: string;
  questions: { title: string; body: string }[];
  feedback: string;
  useTitle: string;
  uses: string[];
  boundaryLabel: string;
  boundary: string;
  sourceLabel: string;
  frameworkIntro: string;
  frameworkFocusLabel: string;
  frameworkRelationLabel: string;
}

interface FrameworkRelation {
  label: string;
  href: string;
  focus: string;
  relation: string;
}

interface FrameworkGroup {
  title: string;
  items: FrameworkRelation[];
}

export const method = {
  pl: {
    title: 'Cztery pytania. Jedna spójna odpowiedź.',
    lead: 'OAF — Organizational Architecture Framework — to mój model pracy z relacjami między strategią, organizacją, inwestycjami i wykonaniem. Sprawdza, czy odpowiedzi poszczególnych obszarów mogą działać razem.',
    modelTitle: 'Każda odpowiedź zmienia warunki następnej.',
    questions: [
      { title: 'Dokąd zmierzamy?', body: 'Jaki efekt uzasadnia zmianę i z czego świadomie rezygnujemy?' },
      { title: 'Jak musimy działać?', body: 'Jakie zdolności, technologia i uprawnienia są potrzebne, żeby osiągnąć ten efekt?' },
      { title: 'Co finansujemy najpierw?', body: 'Które inicjatywy uruchamiamy przy rzeczywistych zależnościach i dostępności ludzi?' },
      { title: 'Co mówi wykonanie?', body: 'Jakie dowody potwierdzają kierunek, a jakie wymagają zmiany wcześniejszych decyzji?' },
    ],
    feedback: 'Dowody z wykonania wracają do pytania o kierunek. Przegląd ma prawo zmienić decyzję.',
    useTitle: 'Kiedy ten model pomaga',
    uses: [
      'Strategia i finansowanie wskazują różne priorytety.',
      'Zmiana technologiczna wymaga innego podziału odpowiedzialności.',
      'Decyzje rozsądne dla pojedynczych działów wzajemnie się blokują.',
    ],
    boundaryLabel: 'Granice modelu',
    boundary: 'OAF jest syntezą służącą diagnozie i projektowaniu połączeń. Nie zastępuje specjalistycznej architektury, analizy biznesowej, zarządzania usługami, zarządzania portfelem ani wiedzy branżowej. Nie wymaga wdrożenia nowej metodyki w całej organizacji.',
    sourceLabel: 'Podstawy i relacje z innymi frameworkami',
    frameworkIntro: 'OAF nie próbuje zastąpić dojrzałych metod. Traktuje je jako specjalistyczne soczewki i łączy ich wyniki tam, gdzie jedna decyzja przecina strategię, organizację, architekturę, analizę, inwestycje i wykonanie.',
    frameworkFocusLabel: 'Gdzie jest silny',
    frameworkRelationLabel: 'Rola OAF',
  },
  en: {
    title: 'Four questions. One coherent answer.',
    lead: 'OAF — Organizational Architecture Framework — is my model for working with the relationships between strategy, organization, investment and execution. It tests whether answers from different functions can work together.',
    modelTitle: 'Each answer changes the conditions for the next.',
    questions: [
      { title: 'Where are we going?', body: 'What outcome justifies change, and what do we deliberately give up?' },
      { title: 'How must we operate?', body: 'Which capabilities, technology and decision rights are needed to achieve that outcome?' },
      { title: 'What do we fund first?', body: 'Which initiatives do we start given real dependencies and available people?' },
      { title: 'What does execution tell us?', body: 'Which evidence supports the direction, and which calls for earlier decisions to change?' },
    ],
    feedback: 'Execution evidence returns to the question of direction. A review must be allowed to change a decision.',
    useTitle: 'When the model helps',
    uses: [
      'Strategy and funding point to different priorities.',
      'Technology change requires a different distribution of accountability.',
      'Decisions that make sense within departments block one another.',
    ],
    boundaryLabel: 'Model boundaries',
    boundary: 'OAF is a synthesis for diagnosing and designing connections. It does not replace specialist architecture, business analysis, service management, portfolio management or industry expertise. It does not require a new methodology to be implemented throughout the organization.',
    sourceLabel: 'Foundations and relationships with other frameworks',
    frameworkIntro: 'OAF does not try to replace mature methods. It treats them as specialist lenses and connects their outputs where one decision crosses strategy, organization, architecture, analysis, investment and execution.',
    frameworkFocusLabel: 'Where it is strong',
    frameworkRelationLabel: 'Role of OAF',
  },
} satisfies Record<Locale, MethodContent>;

export const frameworkGroups = {
  pl: [
    {
      title: 'Strategia i projektowanie organizacji',
      items: [
        {
          label: 'Jay Galbraith · Star Model',
          href: 'https://jaygalbraith.com/services/star-model/',
          focus: 'Projektowanie organizacji przez spójność strategii, struktury, procesów, systemów nagród i ludzi.',
          relation: 'OAF korzysta z logiki dopasowania, ale rozszerza decyzję o architekturę technologiczną, kolejność inwestycji i dowody z wykonania.',
        },
        {
          label: 'McKinsey · 7-S',
          href: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework',
          focus: 'Diagnoza spójności współzależnych elementów organizacji.',
          relation: 'OAF przekłada pytanie o spójność na kontrakt konkretnej decyzji: właściciela, dowody, kompromisy i warunek ponownego rozpatrzenia.',
        },
        {
          label: 'Burton & Obel · Organization design',
          href: 'https://link.springer.com/article/10.1186/s41469-018-0029-2',
          focus: 'Fit i misfit: projekt organizacji zależny od kontekstu i konfiguracji.',
          relation: 'OAF traktuje misfit jako napięcie między domenami, które trzeba nie tylko zdiagnozować, ale rozstrzygnąć decyzją.',
        },
        {
          label: 'Ross, Weill & Robertson · Enterprise Architecture as Strategy',
          href: 'https://cisr.mit.edu/publication/enterprise-architecture-as-strategy',
          focus: 'Operating model i enterprise architecture jako fundament wykonania strategii.',
          relation: 'OAF rozszerza most strategia–wykonanie o odpowiedzialność organizacyjną, wybory portfelowe i jawny mechanizm informacji zwrotnej.',
        },
      ],
    },
    {
      title: 'Architektura, analiza i zarządzanie usługami',
      items: [
        {
          label: 'TOGAF® Standard · Enterprise Architecture',
          href: 'https://www.opengroup.org/togaf',
          focus: 'Metoda, praktyka i governance Enterprise Architecture, w tym rozwój i utrzymywanie architektury przedsiębiorstwa.',
          relation: 'OAF nie zastępuje ADM ani produktów architektonicznych. Umieszcza warianty i ograniczenia architektury w tej samej decyzji co strategia, operating model, portfel i odpowiedzialność.',
        },
        {
          label: 'BABOK® Guide · Business Analysis',
          href: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/',
          focus: 'Analiza potrzeb i interesariuszy, strategii, wymagań, opcji projektowych oraz wartości rozwiązania.',
          relation: 'OAF korzysta z analizy jako źródła dowodów i opcji. Dodaje jawnego właściciela decyzji, kompromis i warunek jej ponownego otwarcia na styku biznes–technologia–portfel.',
        },
        {
          label: 'ITIL® · Digital Product & Service Management',
          href: 'https://www.peoplecert.org/ITIL-4',
          focus: 'Zarządzanie cyfrowymi produktami i usługami przez value system, governance, praktyki, value streams i continual improvement.',
          relation: 'OAF wykorzystuje dowody z usług i wykonania jako pętlę zwrotną do wcześniejszych decyzji o finansowaniu, architekturze i odpowiedzialności. Nie zastępuje praktyk service management.',
        },
      ],
    },
  ],
  en: [
    {
      title: 'Strategy and organization design',
      items: [
        {
          label: 'Jay Galbraith · Star Model',
          href: 'https://jaygalbraith.com/services/star-model/',
          focus: 'Organization design through alignment of strategy, structure, processes, rewards and people.',
          relation: 'OAF uses the logic of fit, while extending the decision to technology architecture, investment sequencing and execution evidence.',
        },
        {
          label: 'McKinsey · 7-S',
          href: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework',
          focus: 'Diagnosing alignment across interdependent organizational elements.',
          relation: 'OAF turns the question of alignment into a concrete decision contract: owner, evidence, trade-offs and a condition for reconsideration.',
        },
        {
          label: 'Burton & Obel · Organization design',
          href: 'https://link.springer.com/article/10.1186/s41469-018-0029-2',
          focus: 'Fit and misfit: organization design contingent on context and configuration.',
          relation: 'OAF treats misfit as cross-domain tension that must be resolved through a decision, not only diagnosed.',
        },
        {
          label: 'Ross, Weill & Robertson · Enterprise Architecture as Strategy',
          href: 'https://cisr.mit.edu/publication/enterprise-architecture-as-strategy',
          focus: 'Operating model and enterprise architecture as a foundation for strategy execution.',
          relation: 'OAF extends the strategy-to-execution bridge with organizational accountability, portfolio choices and an explicit feedback mechanism.',
        },
      ],
    },
    {
      title: 'Architecture, analysis and service management',
      items: [
        {
          label: 'TOGAF® Standard · Enterprise Architecture',
          href: 'https://www.opengroup.org/togaf',
          focus: 'Enterprise Architecture method, practice and governance, including the development and maintenance of enterprise architecture.',
          relation: 'OAF does not replace the ADM or architecture deliverables. It puts architecture options and constraints into the same decision as strategy, operating model, portfolio and accountability.',
        },
        {
          label: 'BABOK® Guide · Business Analysis',
          href: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/',
          focus: 'Analysis of needs and stakeholders, strategy, requirements, design options and solution value.',
          relation: 'OAF uses analysis as a source of evidence and options. It adds an explicit decision owner, trade-off and reconsideration condition at the business–technology–portfolio boundary.',
        },
        {
          label: 'ITIL® · Digital Product & Service Management',
          href: 'https://www.peoplecert.org/ITIL-4',
          focus: 'Managing digital products and services through a value system, governance, practices, value streams and continual improvement.',
          relation: 'OAF uses service and execution evidence as a feedback loop into earlier funding, architecture and accountability decisions. It does not replace service-management practices.',
        },
      ],
    },
  ],
} satisfies Record<Locale, FrameworkGroup[]>;
