import type { Locale } from '../lib/site';
interface UI {nav:{home:string;work:string;writing:string;about:string;contact:string;oaf:string;privacy:string};privacy:{title:string;description:string;eyebrow:string;headline:string;lead:string};}
export const ui = {
pl:{nav:{home:'Start',work:'Współpraca',writing:'Perspektywa',about:'O mnie',contact:'Opisz problem',oaf:'Model OAF',privacy:'Prywatność'},privacy:{
    title: 'Prywatność – Arkadiusz Kamrowski',
    description: 'Informacja o przetwarzaniu danych w formularzu kontaktowym strony Arkadiusza Kamrowskiego.',
    eyebrow: 'Prywatność', headline: 'Minimum danych. Jeden cel: odpowiedzieć na Twoją wiadomość.',
    lead: 'Strona nie używa reklamowych narzędzi śledzących ani analitycznych plików cookie. Prowadzimy minimalny, anonimowy pomiar działania strony bez identyfikowania użytkowników.',
}},
en:{nav:{home:'Home',work:'Advisory',writing:'Perspective',about:'About',contact:'Discuss a decision',oaf:'OAF model',privacy:'Privacy'},privacy:{
      title: 'Privacy – Arkadiusz Kamrowski', description: 'Information about data processing in the contact form on Arkadiusz Kamrowski’s website.', eyebrow: 'Privacy', headline: 'Minimum data. One purpose: respond to your message.', lead: 'The site uses no advertising trackers or analytics cookies. We run minimal, anonymous first-party measurement without identifying users.',
}}
} satisfies Record<Locale,UI>;
