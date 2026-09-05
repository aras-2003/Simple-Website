import type { Locale } from '../lib/site';

type DecisionContractItem = {
  title: string;
  question: string;
  body: string;
};

type OafOperatingModel = {
  eyebrow: string;
  title: string;
  lead: string;
  items: DecisionContractItem[];
  summary: string;
};

const pl: OafOperatingModel = {
  eyebrow: 'Operacjonalizacja / kontrakt decyzji',
  title: 'Rama staje się użyteczna dopiero wtedy, gdy wiadomo kto, kiedy i na podstawie czego może zmienić decyzję.',
  lead: 'OAF nie powinien kończyć się na mapie zależności. Dla decyzji o dużym wpływie potrzebny jest minimalny kontrakt, który łączy intencję strategiczną z odpowiedzialnością, rytmem i dowodem z wykonania.',
  items: [
    {
      title: 'Obiekt decyzji',
      question: 'Co dokładnie jest wybierane albo zmieniane?',
      body: 'Decyzja musi mieć wyraźny przedmiot: rezultat, zdolność, zasadę architektoniczną, alokację kapitału, priorytet, zakres albo kompromis. Bez tego organizacja omawia temat, ale nie podejmuje wyboru.',
    },
    {
      title: 'Właściciel',
      question: 'Kto ma mandat, żeby podjąć i utrzymać tę decyzję?',
      body: 'Jedna rola powinna odpowiadać za decyzję i jej konsekwencje. Współtworzenie może być szerokie, ale odpowiedzialność nie może rozpuścić się pomiędzy komitetami, architekturą, biznesem, PMO i zespołami wykonawczymi.',
    },
    {
      title: 'Rytm',
      question: 'Kiedy decyzja wraca na stół?',
      body: 'Część decyzji wymaga stałego przeglądu, część reakcji na zdarzenie. Rytm powinien określać nie tylko częstotliwość forum, lecz moment, w którym zmiana kontekstu, ryzyka albo wyniku wymusza ponowny wybór.',
    },
    {
      title: 'Dowód',
      question: 'Jakie dane mogą potwierdzić lub podważyć założenie?',
      body: 'Dowodem może być rezultat użytkownika, ekonomika, ryzyko, tempo, przepustowość, zależności, koszt alternatywny, zgodność z guardrailami albo fitness architektury. Ważne, by było wiadomo, które sygnały mają prawo zmienić wcześniejszą decyzję.',
    },
    {
      title: 'Trigger do zmiany',
      question: 'Co konkretnie uruchamia ponowne rozpatrzenie?',
      body: 'Próg, odchylenie, nowa zależność, utrata wartości, wzrost ryzyka albo pojawienie się lepszej opcji powinny mieć z góry określony skutek: eskalację, zatrzymanie, zmianę zakresu, zmianę finansowania albo rewizję architektury.',
    },
  ],
  summary: 'Minimalny kontrakt OAF: decyzja + właściciel + rytm + dowód + warunek ponownego otwarcia. Dopiero wtedy pętla kierunek → architektura → priorytety → wykonanie może rzeczywiście się zamykać.',
};

const en: OafOperatingModel = {
  eyebrow: 'Operationalization / decision contract',
  title: 'A framework becomes useful only when it is clear who can change a decision, when, and on what evidence.',
  lead: 'OAF should not end with a dependency map. High-impact decisions need a minimum contract that connects strategic intent with accountability, cadence and evidence from execution.',
  items: [
    {
      title: 'Decision object',
      question: 'What exactly is being chosen or changed?',
      body: 'A decision needs a clear object: an outcome, capability, architecture principle, capital allocation, priority, scope or trade-off. Without it, the organization discusses a topic but does not make a choice.',
    },
    {
      title: 'Accountable owner',
      question: 'Who has the mandate to make and sustain the decision?',
      body: 'One role should remain accountable for the decision and its consequences. Contribution can be broad, but accountability cannot dissolve across committees, architecture, business, PMO and delivery teams.',
    },
    {
      title: 'Cadence',
      question: 'When does the decision come back to the table?',
      body: 'Some decisions need a regular review; others should be event-driven. Cadence should define not only forum frequency but also the moment when context, risk or outcome changes force a new choice.',
    },
    {
      title: 'Evidence',
      question: 'Which signals can confirm or challenge the assumption?',
      body: 'Evidence can include user outcomes, economics, risk, speed, throughput, dependencies, opportunity cost, guardrail compliance or architecture fitness. The important point is to define which signals have the right to change a prior decision.',
    },
    {
      title: 'Revisit trigger',
      question: 'What explicitly forces reconsideration?',
      body: 'A threshold, deviation, new dependency, loss of value, risk increase or better option should have a predefined consequence: escalation, stop, scope change, funding change or architecture revision.',
    },
  ],
  summary: 'The minimum OAF contract: decision + owner + cadence + evidence + condition for reopening. Only then can the loop of direction → architecture → priorities → execution genuinely close.',
};

export const oafOperatingModel: Record<Locale, OafOperatingModel> = { pl, en };
