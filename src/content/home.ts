import type { Locale } from '../lib/site';
interface HomeContent {
  title: string; emphasis: string; lead: string; audience: string; advisory: string;
  signature: { word: string; meaning: string }[];
  tensionsTitle: string; tensions: { title: string; body: string }[];
  proofLabel: string; proofTitle: string; proofBody: string; proofChange: string;
  personTitle: string; personBody: string; personLink: string;
  method: string; methodLink: string;
}
export const home = {
  pl: {
    title: 'Strategię widać', emphasis: 'w wyborach.',
    lead: 'Pomagam zarządom i CIO zdecydować, co finansować, z czego zrezygnować i jak zmienić odpowiedzialność oraz technologię, żeby strategię dało się wykonać.',
    audience: 'Doradztwo dla zarządów, CIO i liderów transformacji', advisory: 'Jak możemy pracować',
    signature: [{word:'TAK.',meaning:'Co finansujemy.'},{word:'NIE.',meaning:'Z czego rezygnujemy.'},{word:'KTO.',meaning:'Kto może zdecydować.'}],
    tensionsTitle: 'Plan jest. Wybory wciąż przed Wami.',
    tensions: [
      {title:'Wszystko jest priorytetem.',body:'Inicjatywy konkurują o tych samych ludzi. Trzeba wybrać, co zatrzymać, połączyć lub przesunąć.'},
      {title:'Decyzja wraca na kolejne spotkanie.',body:'Brakuje właściciela, kryteriów albo zgody na kompromis. Kolejny komitet tego nie rozstrzygnie.'},
      {title:'Technologia ma wykonać sprzeczne obietnice.',body:'Strategia, budżet i sposób działania wymagają różnych rzeczy. Potrzebna jest wspólna decyzja o zmianie.'}
    ],
    proofLabel:'Z praktyki · strategia technologiczna', proofTitle:'Wspólna podstawa dla inwestycji.',
    proofBody:'Architektura, platformy i inwestycje były rozpatrywane w różnych rytmach. Praca polegała na połączeniu kierunku technologicznego, zasad i priorytetów zdolności z portfelem inicjatyw.',
    proofChange:'Rezultat: podstawa do porównywania inwestycji i ustalania ich kolejności względem jednego kierunku.',
    personTitle:'Widzę więcej niż jedną stronę tej decyzji.',
    personBody:'Ponad 10 lat pracy od dostarczania technologii i cloud / DevSecOps, przez architekturę, po strategię, portfel i PMO. Ta droga ukształtowała mój sposób zadawania pytań.',personLink:'Poznaj moją perspektywę',
    method:'Za tym sposobem pracy stoi OAF: model sprawdzania, czy kierunek, organizacja, inwestycje i wykonanie wspierają się wzajemnie.',methodLink:'Poznaj model OAF'
  },
  en: {
    title:'Strategy shows up',emphasis:'in choices.',
    lead:'I help boards and CIOs decide what to fund, what to stop, and how accountability and technology must change to make their strategy executable.',
    audience:'Advisory for boards, CIOs and transformation leaders',advisory:'How we can work together',
    signature:[{word:'YES.',meaning:'What we fund.'},{word:'NO.',meaning:'What we stop.'},{word:'WHO.',meaning:'Who can decide.'}],
    tensionsTitle:'There is a plan. The choices are still ahead.',
    tensions:[
      {title:'Everything is a priority.',body:'Initiatives compete for the same people. Someone must decide what to stop, combine or defer.'},
      {title:'The decision returns to another meeting.',body:'An owner, criteria or an accepted trade-off is missing. Another committee will not settle it.'},
      {title:'Technology inherits contradictory promises.',body:'Strategy, funding and the way work happens demand different things. They need one coherent decision about change.'}
    ],
    proofLabel:'From practice · technology strategy',proofTitle:'One basis for investment choices.',
    proofBody:'Architecture, platforms and investments were considered on different cadences. The work connected technology direction, principles and capability priorities with the initiative portfolio.',
    proofChange:'Output: a shared basis for comparing investments and sequencing them against one direction.',
    personTitle:'I see more than one side of the decision.',personBody:'Over 10 years of work from technology delivery and cloud / DevSecOps, through architecture, to strategy, portfolio and PMO. That trajectory shaped the questions I ask.',personLink:'Meet the person behind the work',
    method:'Behind this approach is OAF: a model for checking whether direction, organization, investment and execution reinforce one another.',methodLink:'Explore the OAF model'
  }
} satisfies Record<Locale, HomeContent>;
