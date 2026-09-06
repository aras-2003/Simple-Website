import type { Locale } from '../lib/site';

export type ExecutiveTrigger = {
  label: string;
  title: string;
  body: string;
};

export type ExecutiveOutput = {
  index: string;
  title: string;
  artifact: string;
  decision: string;
};

export type ExecutiveEngagement = {
  label: string;
  title: string;
  when: string;
  outputs: string[];
};

const pl = {
  home: {
    hero: {
      eyebrow: 'Executive advisory · strategia → wykonanie',
      title: 'Strategia nie potrzebuje kolejnej warstwy zarządzania.',
      emphasis: 'Potrzebuje organizacji, która potrafi ją wykonać.',
      lead: 'Pomagam CEO, CIO i liderom transformacji znaleźć miejsca, w których strategia, model operacyjny, architektura, portfel i wykonanie przestają się ze sobą zgadzać — a następnie przeprojektować te połączenia.',
      value: 'Efekt to mniej równoległych priorytetów, jaśniejsze prawa decyzyjne, lepsza kolejność inwestycji i krótsza droga od kierunku do rezultatu.',
      primary: 'Zobacz, co dostajesz',
      secondary: 'Porozmawiaj o kontekście',
    },
    triggers: {
      eyebrow: 'Kiedy warto rozmawiać',
      title: 'Problem zwykle nie wygląda jak „problem architektury”. Wygląda jak tarcie w decyzjach.',
      lead: 'Największa dźwignia pojawia się wtedy, gdy jedna decyzja przecina kilka funkcji, budżetów i rytmów zarządczych.',
      items: [
        { label: '01 / kierunek', title: 'Strategia jest jasna, ale organizacja nie zmienia sposobu działania.', body: 'Operating model, odpowiedzialność, technologia i finansowanie nadal wspierają poprzedni kierunek.' },
        { label: '02 / portfel', title: 'Wszystko jest priorytetem, więc nic nim naprawdę nie jest.', body: 'Inicjatywy konkurują o te same zdolności, zależności rosną, a decyzje stop / merge / sequence nie zapadają.' },
        { label: '03 / technologia', title: 'Architektura i modernizacja nie zmieniają logiki inwestycji.', body: 'Stan docelowy jest znany, ale platformy, dług i wspólne zdolności przegrywają z lokalnie atrakcyjnymi inicjatywami.' },
        { label: '04 / transformacja', title: 'Program raportuje postęp, lecz P&L i sposób pracy nie czują zmiany.', body: 'Transformacja działa obok biznesu zamiast stać się częścią wspólnego systemu decyzji i wykonania.' },
      ] as ExecutiveTrigger[],
    },
    outputs: {
      eyebrow: 'Co de facto dostajesz',
      title: 'Nie kolejny deck. Zestaw decyzji, artefaktów i rytmów, które można włączyć do realnego zarządzania.',
      lead: 'Zakres zależy od problemu, ale rezultat pracy powinien być możliwy do użycia po spotkaniu — nie tylko dobrze wyglądać na spotkaniu.',
      items: [
        { index: '01', title: 'Mapa decyzji i tarć', artifact: 'current-state decision map', decision: 'Gdzie dokładnie tracimy spójność, tempo albo odpowiedzialność?' },
        { index: '02', title: 'Wybory i kompromisy', artifact: 'target decision architecture', decision: 'Co musi się zmienić w modelu działania, architekturze i mandatach?' },
        { index: '03', title: 'Logika portfela', artifact: 'stop / merge / sequence / continue', decision: 'Co finansujemy, czego nie robimy i w jakiej kolejności?' },
        { index: '04', title: 'Governance decyzji', artifact: 'decision rights + executive cadence', decision: 'Kto decyduje, na podstawie jakich dowodów i w jakim rytmie?' },
        { index: '05', title: 'Roadmapa wykonania', artifact: 'transition roadmap + feedback loop', decision: 'Jak przejść od wyboru do zmiany i kiedy dowód może zmienić plan?' },
      ] as ExecutiveOutput[],
    },
    proof: {
      eyebrow: 'Praktyka / nie teoria',
      title: 'Ten sposób pracy powstał na realnych problemach przekrojowych.',
      lead: 'Technologia, strategia, architektura, PMO i portfel są tu narzędziami. Jednostką pracy jest decyzja i jej konsekwencje w całym systemie.',
    },
    method: {
      eyebrow: 'Metoda / OAF',
      title: 'OAF jest zapleczem myślenia, nie produktem do wdrożenia.',
      body: 'Organizational Architecture Framework utrzymuje jedną pętlę pomiędzy kierunkiem, architekturą, priorytetami i dowodami z wykonania. Ma pomóc zobaczyć zależności szybciej — bez dokładania nowej biurokracji.',
      cta: 'Zobacz model OAF',
    },
    close: {
      eyebrow: 'Pierwszy krok',
      title: 'Najlepszy punkt startu to jedna decyzja, która dziś utknęła między silosami.',
      body: 'Opisz kontekst, napięcie i decyzję do podjęcia. Jeżeli problem wymaga perspektywy przekrojowej, zaproponuję sensowny sposób wejścia.',
      cta: 'Opisz problem',
    },
  },
  work: {
    hero: {
      eyebrow: 'Współpraca / executive advisory',
      title: 'Wchodzę tam, gdzie jedna decyzja przecina strategię, organizację, technologię i portfel.',
      lead: 'Nie sprzedaję funkcji ani katalogu artefaktów. Pomagam leadership teamowi nazwać problem systemowy, podjąć kilka trudnych wyborów i zaprojektować mechanizm, który przeprowadzi je do wykonania.',
    },
    engagements: {
      eyebrow: 'Trzy formaty wejścia',
      title: 'Zakres powinien odpowiadać ryzyku decyzji — nie rozmiarowi prezentacji.',
      items: [
        {
          label: 'Diagnostic',
          title: 'Executive decision diagnostic',
          when: 'Gdy problem jest odczuwalny, ale nie ma zgody, gdzie naprawdę leży.',
          outputs: ['mapa decyzji i zależności', 'najważniejsze misfity', 'hipotezy przyczyn', 'krótka lista decyzji executive'],
        },
        {
          label: 'Design',
          title: 'Operating / architecture design',
          when: 'Gdy kierunek jest znany, ale trzeba przeprojektować sposób działania, governance, architekturę lub logikę inwestycji.',
          outputs: ['opcje i kompromisy', 'docelowa architektura decyzji', 'prawa decyzyjne', 'roadmapa przejścia'],
        },
        {
          label: 'Advisory',
          title: 'Transformation & portfolio advisory',
          when: 'Gdy zmiana już trwa i potrzebuje lepszego rytmu decyzji, priorytetyzacji i sprzężenia zwrotnego.',
          outputs: ['executive cadence', 'stop / start / continue', 'przegląd zależności', 'evidence loop i korekty kierunku'],
        },
      ] as ExecutiveEngagement[],
    },
    domains: {
      eyebrow: 'Obszary, które łączę',
      title: 'Dyscyplina jest narzędziem. Problem decyduje, które narzędzia trzeba połączyć.',
      items: [
        { title: 'Strategy & operating model', body: 'Kierunek, rezultaty, model działania, role i warunki potrzebne do wykonania strategii.' },
        { title: 'Enterprise architecture', body: 'Zdolności, platformy, zależności i zasady, które powinny realnie wpływać na decyzje inwestycyjne.' },
        { title: 'Portfolio & PMO', body: 'Priorytetyzacja, capacity, sekwencjonowanie, koszt alternatywny oraz decyzje stop / merge / continue.' },
        { title: 'AI & technology governance', body: 'Guardrails, prawa decyzyjne, platformy i profile ryzyka, które pozwalają skalować technologię bez utraty odpowiedzialności.' },
      ],
    },
    cases: {
      eyebrow: 'Wybrane wzorce problemów',
      title: 'Przykłady pokazuję przez zmianę logiki decyzji — nie przez liczbę slajdów.',
      lead: 'Przypadki pozostają anonimizowane. Nie dopisuję KPI, których nie mogę publicznie obronić; pokazuję problem, interwencję i wartość zarządczą.',
    },
    close: {
      title: 'Jeżeli problem da się rozwiązać jednym warsztatem, nie potrzebuje wielkiego programu.',
      body: 'Jeżeli wymaga zmiany kilku powiązanych decyzji, dobrze zacząć od zmapowania systemu i ustalenia, gdzie naprawdę jest dźwignia.',
      cta: 'Porozmawiajmy o problemie',
    },
  },
};

const en = {
  home: {
    hero: {
      eyebrow: 'Executive advisory · strategy → execution',
      title: 'Strategy does not need another management layer.',
      emphasis: 'It needs an organization that can execute it.',
      lead: 'I help CEOs, CIOs and transformation leaders find where strategy, operating model, architecture, portfolio and execution stop agreeing — then redesign the connections between them.',
      value: 'The outcome is fewer competing priorities, clearer decision rights, better investment sequencing and a shorter path from direction to result.',
      primary: 'See what you get',
      secondary: 'Discuss your context',
    },
    triggers: {
      eyebrow: 'When to talk',
      title: 'The problem rarely looks like an “architecture problem”. It looks like friction in decisions.',
      lead: 'The biggest leverage appears when one decision crosses several functions, budgets and management cadences.',
      items: [
        { label: '01 / direction', title: 'The strategy is clear, but the organization still operates the old way.', body: 'Operating model, accountability, technology and funding continue to reinforce the previous direction.' },
        { label: '02 / portfolio', title: 'Everything is a priority, so nothing truly is.', body: 'Initiatives compete for the same capabilities, dependencies grow, and stop / merge / sequence decisions do not happen.' },
        { label: '03 / technology', title: 'Architecture and modernization do not change investment logic.', body: 'The target state is known, yet platforms, debt and shared capabilities lose to locally attractive initiatives.' },
        { label: '04 / transformation', title: 'The program reports progress, while the P&L and operating reality barely move.', body: 'Transformation runs beside the business instead of becoming part of one decision and execution system.' },
      ] as ExecutiveTrigger[],
    },
    outputs: {
      eyebrow: 'What you actually get',
      title: 'Not another deck. Decisions, artifacts and operating rhythms that can enter real management practice.',
      lead: 'Scope varies with the problem, but the output should be usable after the meeting — not merely look good during it.',
      items: [
        { index: '01', title: 'Decision & friction map', artifact: 'current-state decision map', decision: 'Where exactly are coherence, speed or accountability being lost?' },
        { index: '02', title: 'Choices & trade-offs', artifact: 'target decision architecture', decision: 'What must change in the operating model, architecture and mandates?' },
        { index: '03', title: 'Portfolio logic', artifact: 'stop / merge / sequence / continue', decision: 'What gets funded, what stops and in what sequence?' },
        { index: '04', title: 'Decision governance', artifact: 'decision rights + executive cadence', decision: 'Who decides, using what evidence and at what cadence?' },
        { index: '05', title: 'Execution roadmap', artifact: 'transition roadmap + feedback loop', decision: 'How does the choice become change, and when can evidence change the plan?' },
      ] as ExecutiveOutput[],
    },
    proof: {
      eyebrow: 'Practice / not theory',
      title: 'This approach grew from real cross-system problems.',
      lead: 'Technology, strategy, architecture, PMO and portfolio are tools here. The unit of work is the decision and its consequences across the system.',
    },
    method: {
      eyebrow: 'Method / OAF',
      title: 'OAF is the thinking layer behind the work, not a framework to “implement”.',
      body: 'The Organizational Architecture Framework keeps one loop across direction, architecture, priorities and execution evidence. Its job is to expose dependencies faster — without adding another bureaucracy.',
      cta: 'See the OAF model',
    },
    close: {
      eyebrow: 'First step',
      title: 'A good starting point is one decision currently stuck between silos.',
      body: 'Describe the context, tension and decision to be made. If the problem needs a cross-system view, I will suggest a sensible way to enter it.',
      cta: 'Describe the problem',
    },
  },
  work: {
    hero: {
      eyebrow: 'Advisory / executive work',
      title: 'I work where one decision cuts across strategy, organization, technology and portfolio.',
      lead: 'I do not sell a function or a catalogue of artifacts. I help a leadership team frame the system problem, make a small number of hard choices and design the mechanism that carries those choices into execution.',
    },
    engagements: {
      eyebrow: 'Three ways to engage',
      title: 'The scope should match the risk of the decision — not the size of the deck.',
      items: [
        { label: 'Diagnostic', title: 'Executive decision diagnostic', when: 'When the problem is visible but there is no agreement on where it really sits.', outputs: ['decision and dependency map', 'critical misfits', 'cause hypotheses', 'short executive decision list'] },
        { label: 'Design', title: 'Operating / architecture design', when: 'When direction is clear but the operating model, governance, architecture or investment logic must change.', outputs: ['options and trade-offs', 'target decision architecture', 'decision rights', 'transition roadmap'] },
        { label: 'Advisory', title: 'Transformation & portfolio advisory', when: 'When change is underway and needs a stronger decision cadence, prioritization and feedback loop.', outputs: ['executive cadence', 'stop / start / continue', 'dependency review', 'evidence loop and course correction'] },
      ] as ExecutiveEngagement[],
    },
    domains: {
      eyebrow: 'Domains I connect',
      title: 'A discipline is a tool. The problem decides which tools need to work together.',
      items: [
        { title: 'Strategy & operating model', body: 'Direction, outcomes, operating model, roles and the conditions required to execute strategy.' },
        { title: 'Enterprise architecture', body: 'Capabilities, platforms, dependencies and principles that should materially influence investment choices.' },
        { title: 'Portfolio & PMO', body: 'Prioritization, capacity, sequencing, opportunity cost and stop / merge / continue decisions.' },
        { title: 'AI & technology governance', body: 'Guardrails, decision rights, platforms and risk profiles that let technology scale without losing accountability.' },
      ],
    },
    cases: {
      eyebrow: 'Selected problem patterns',
      title: 'Cases are framed through changed decision logic — not slide count.',
      lead: 'Cases remain anonymized. I do not invent public KPIs; I show the problem, intervention and management value that can be defended.',
    },
    close: {
      title: 'If one workshop can solve the problem, it does not need a giant program.',
      body: 'If several connected decisions need to change, start by mapping the system and finding where the real leverage sits.',
      cta: 'Discuss the problem',
    },
  },
};

export const executive: Record<Locale, typeof pl> = { pl, en };
