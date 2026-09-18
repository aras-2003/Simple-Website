import type { Locale } from '../lib/site';

// Owner-supplied practice areas, already published in main 083ffbe.
// Provenance and claim boundaries: docs/PROOF_SOURCES.md.
interface ProofStory {
  id: string; domain: string; title: string; context: string;
  decision: string; intervention: string; output: string; consequence: string;
}
export const proof = {
  pl: {
    title: 'Decyzje z praktyki.', label: 'Doświadczenie · przykłady anonimizowane',
    scope: 'Strategia technologiczna · architektura · portfel inicjatyw',
    more: 'Kontekst i mój wkład',
    labels: { context: 'Napięcie', decision: 'Decyzja', intervention: 'Mój wkład', output: 'Co zostało', consequence: 'Co umożliwia' },
    stories: [
      { id: 'technology', domain: 'Strategia technologiczna', title: 'Jeden kierunek dla inwestycji.',
        context: 'Architektura, platformy i inwestycje były rozpatrywane w różnych rytmach.',
        decision: 'Względem jakiego kierunku porównywać i układać inwestycje?',
        intervention: 'Połączyłem kierunek technologiczny, zasady architektury i priorytety zdolności z portfelem inicjatyw.',
        output: 'Wspólna podstawa do porównywania inwestycji i ustalania ich kolejności.',
        consequence: 'Ocenę inicjatyw względem jednego kierunku, z uwzględnieniem architektury i zdolności.' },
      { id: 'portfolio', domain: 'Portfel inicjatyw', title: 'Wspólni ludzie. Konkurujące priorytety.',
        context: 'Nakładające się inicjatywy korzystały ze wspólnych zdolności i ograniczonej dostępności zespołów.',
        decision: 'Co zatrzymać, połączyć, przesunąć lub kontynuować?',
        intervention: 'Połączyłem analizę oczekiwanych efektów, zależności, kosztu alternatywnego i architektury docelowej.',
        output: 'Podstawa wyboru dla całego portfela, uwzględniająca zależności i ograniczoną dostępność zespołów.',
        consequence: 'Porównanie inicjatyw przez ich wpływ na cały portfel, zanim każda z nich otrzyma osobny priorytet.' },
    ],
  },
  en: {
    title: 'Decisions from practice.', label: 'Experience · anonymised examples',
    scope: 'Technology strategy · architecture · initiative portfolio',
    more: 'Context and my contribution',
    labels: { context: 'Tension', decision: 'Decision', intervention: 'My contribution', output: 'What remained', consequence: 'What it enables' },
    stories: [
      { id: 'technology', domain: 'Technology strategy', title: 'One direction for investment.',
        context: 'Architecture, platforms and investments were considered on different cadences.',
        decision: 'Against which direction should investments be compared and sequenced?',
        intervention: 'I connected technology direction, architecture principles and capability priorities with the initiative portfolio.',
        output: 'A shared basis for comparing investments and deciding their sequence.',
        consequence: 'Assessing initiatives against one direction, taking architecture and capabilities into account.' },
      { id: 'portfolio', domain: 'Initiative portfolio', title: 'Shared people. Competing priorities.',
        context: 'Overlapping initiatives drew on shared capabilities and limited team capacity.',
        decision: 'What should stop, combine, move later or continue?',
        intervention: 'I connected the analysis of intended outcomes, dependencies, opportunity cost and target architecture.',
        output: 'A basis for choices across the portfolio, accounting for dependencies and limited team capacity.',
        consequence: 'Comparing initiatives by their effect on the whole portfolio before assigning each its own priority.' },
    ],
  },
} satisfies Record<Locale, { title: string; label: string; scope: string; more: string; labels: Record<'context'|'decision'|'intervention'|'output'|'consequence', string>; stories: ProofStory[] }>;
