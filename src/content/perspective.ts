import type {Locale} from '../lib/site';
interface PerspectiveContent {title:string;lead:string;featured:string;more:string;read:string;sources:string;related:string;advisory:string;}
export const perspective = {
pl:{title:'Pytania, które zmieniają decyzje.',lead:'O tym, czego nie widać w planie: kosztach priorytetów, granicach odpowiedzialności i dowodach, które powinny zmienić zdanie zarządu.',featured:'Na początek',more:'Kolejne perspektywy',read:'Czytaj tekst',sources:'Źródła i dalsza lektura',related:'Powiązana perspektywa',advisory:'Przełóż problem na współpracę'},
en:{title:'Questions that change decisions.',lead:'What the plan leaves out: the cost of priorities, the limits of accountability and evidence that should change a leadership team’s mind.',featured:'Start here',more:'More perspectives',read:'Read essay',sources:'Sources and further reading',related:'Related perspective',advisory:'Turn the problem into an engagement'}
} satisfies Record<Locale,PerspectiveContent>;
export const relatedEssays: Record<string,string> = {
'architecture-as-decision-system':'transformation-operating-model',
'portfolio-as-strategy-in-motion':'architecture-as-decision-system',
'ai-governance-without-theatre':'transformation-operating-model',
 'transformation-operating-model':'portfolio-as-strategy-in-motion'
};
