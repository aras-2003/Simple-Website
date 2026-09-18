import type { Locale } from '../lib/site';
interface Journey { cta:string; title:string; steps:string[]; label:string; }
export const journey = {
 pl:{cta:'Opisz problem',title:'Zacznijmy od decyzji, która utknęła.',label:'Jak zaczynamy',steps:['Napisz, co próbujecie rozstrzygnąć i co Was ogranicza.','W rozmowie sprawdzimy, gdzie mogę pomóc.','Ustalimy zakres, uczestników i rezultaty współpracy.']},
 en:{cta:'Discuss a decision',title:'Start with the decision that is stuck.',label:'How we begin',steps:['Tell me what you need to decide and what constrains you.','We discuss where my contribution would be useful.','We agree the scope, participants and outputs.']}
} satisfies Record<Locale, Journey>;
