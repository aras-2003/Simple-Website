export const sharedContent = {
  system: [
    { index: '01', title: 'Strategy', detailPl: 'kierunek', detailEn: 'direction' },
    { index: '02', title: 'Architecture', detailPl: 'wybory', detailEn: 'choices' },
    { index: '03', title: 'Portfolio', detailPl: 'priorytety', detailEn: 'priorities' },
    { index: '04', title: 'Execution', detailPl: 'rezultaty', detailEn: 'outcomes' },
  ],
  oafSteps: [
    { no: '01', title: 'Direction', tag: 'Strategy', pl: 'Co naprawdę chcemy osiągnąć — i po czym rozpoznamy, że cel został osiągnięty?', en: 'What are we actually trying to achieve — and what evidence will tell us that we have achieved it?' },
    { no: '02', title: 'Choices', tag: 'Architecture', pl: 'Jakie zdolności, zasady i decyzje architektoniczne są potrzebne, a czego świadomie nie robimy?', en: 'Which capabilities, principles and architectural choices are required — and what are we deliberately not doing?' },
    { no: '03', title: 'Priorities', tag: 'Portfolio', pl: 'Które inicjatywy zasługują na ludzi, budżet i uwagę — w jakiej kolejności i z jakimi zależnościami?', en: 'Which initiatives deserve people, funding and attention — in what order and with which dependencies?' },
    { no: '04', title: 'Evidence', tag: 'Execution', pl: 'Co dowodzi, że zmiana działa, czego się nauczyliśmy i jak ta wiedza wpływa na kolejne decyzje?', en: 'What proves that the change works, what have we learned, and how should that evidence change the next decision?' },
  ],
  focus: [
    { titlePl: 'Architektura korporacyjna', titleEn: 'Enterprise Architecture', bodyPl: 'zdolności · architektura docelowa · governance · standardy · roadmapy', bodyEn: 'capability maps · target architecture · governance · standards · roadmaps' },
    { titlePl: 'Strategia i transformacja', titleEn: 'Strategy & Transformation', bodyPl: 'wybory strategiczne · model operacyjny · portfel transformacji · alignment executive', bodyEn: 'strategic choices · operating model · transformation portfolio · executive alignment' },
    { titlePl: 'PMO i portfel', titleEn: 'PMO & Portfolio', bodyPl: 'priorytetyzacja · zależności · logika inwestycyjna · rezultaty · rytm decyzji', bodyEn: 'prioritization · dependencies · investment logic · outcomes · decision cadence' },
    { titlePl: 'AI i technologia', titleEn: 'AI & Technology', bodyPl: 'governance AI · chmura · platformy · DevSecOps · radar technologiczny · odpowiedzialna adopcja', bodyEn: 'AI governance · cloud · platforms · DevSecOps · technology radar · responsible adoption' },
  ],
} as const;
