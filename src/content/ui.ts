import type { Locale } from '../lib/site';
interface UI {nav:{home:string;work:string;writing:string;about:string;contact:string;oaf:string;privacy:string};privacy:{title:string;description:string;eyebrow:string;headline:string;lead:string};}
export const ui = {
pl:{nav:{home:'Start',work:'Współpraca',writing:'Perspektywa',about:'O mnie',contact:'Opisz problem',oaf:'Model OAF',privacy:'Prywatność'},privacy:{
    title: 'Prywatność – Arkadiusz Kamrowski',
    description: 'Informacja o przetwarzaniu danych na stronie Arkadiusza Kamrowskiego i w korespondencji.',
    eyebrow: 'Prywatność', headline: 'Twoje dane. Jasne zasady.',
    lead: 'Strona nie używa reklamowych narzędzi śledzących ani analitycznych plików cookie. Wybrane zdarzenia mierzymy bez identyfikatorów użytkownika; Cloudflare przetwarza osobno dane techniczne na potrzeby działania i ochrony serwisu.',
}},
en:{nav:{home:'Home',work:'Advisory',writing:'Perspective',about:'About',contact:'Discuss a decision',oaf:'OAF model',privacy:'Privacy'},privacy:{
      title: 'Privacy – Arkadiusz Kamrowski', description: 'Information about data processing on Arkadiusz Kamrowski’s website and in correspondence.', eyebrow: 'Privacy', headline: 'Your data. Clear principles.', lead: 'The site uses no advertising trackers or analytics cookies. We measure selected events without user identifiers; Cloudflare separately processes technical data to operate and protect the service.',
}}
} satisfies Record<Locale,UI>;
