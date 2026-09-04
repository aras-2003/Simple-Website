export const sharedContent = {
  system: [
    { index: '01', title: 'Strategy', detailPl: 'kierunek', detailEn: 'direction' },
    { index: '02', title: 'Architecture', detailPl: 'wybory', detailEn: 'choices' },
    { index: '03', title: 'Portfolio', detailPl: 'priorytety', detailEn: 'priorities' },
    { index: '04', title: 'Execution', detailPl: 'rezultaty', detailEn: 'outcomes' },
  ],
  oafSteps: [
    {
      no: '01', title: 'Direction', tag: 'Strategy',
      pl: 'Co naprawdę chcemy osiągnąć — i po czym rozpoznamy, że cel został osiągnięty?',
      en: 'What are we actually trying to achieve — and what evidence will tell us that we have achieved it?',
    },
    {
      no: '02', title: 'Choices', tag: 'Architecture',
      pl: 'Jakie zdolności, zasady i decyzje architektoniczne są potrzebne, a czego świadomie nie robimy?',
      en: 'Which capabilities, principles and architectural choices are required — and what are we deliberately not doing?',
    },
    {
      no: '03', title: 'Priorities', tag: 'Portfolio',
      pl: 'Które inicjatywy zasługują na ludzi, budżet i uwagę — w jakiej kolejności i z jakimi zależnościami?',
      en: 'Which initiatives deserve people, funding and attention — in what order and with which dependencies?',
    },
    {
      no: '04', title: 'Evidence', tag: 'Execution',
      pl: 'Co dowodzi, że zmiana działa, czego się nauczyliśmy i jak ta wiedza wpływa na kolejne decyzje?',
      en: 'What proves that the change works, what have we learned, and how should that evidence change the next decision?',
    },
  ],
  focus: [
    { title: 'Enterprise Architecture', body: 'capability maps · target architecture · governance · standards · roadmaps' },
    { title: 'Strategy & Transformation', body: 'strategic choices · operating model · transformation portfolio · executive alignment' },
    { title: 'PMO & Portfolio', body: 'prioritization · dependencies · investment logic · outcomes · decision cadence' },
    { title: 'AI & Technology', body: 'AI governance · cloud · platforms · DevSecOps · technology radar · responsible adoption' },
  ],
} as const;
