import type { Locale } from '../lib/site';
interface UI {nav:{home:string;work:string;writing:string;about:string;contact:string;oaf:string;privacy:string};privacy:{title:string;description:string;eyebrow:string;headline:string;lead:string};}
export const ui = {
pl:{nav:{home:'Start',work:'Współpraca',writing:'Perspektywa',about:'O mnie',contact:'Opisz problem',oaf:'Model OAF',privacy:'Prywatność'},privacy:{
    title: 'Prywatność — Arkadiusz Kamrowski',
    description: 'Informacja o przetwarzaniu danych w formularzu kontaktowym strony Arkadiusza Kamrowskiego.',
    eyebrow: 'Prywatność', headline: 'Minimum danych. Jeden cel: odpowiedzieć na Twoją wiadomość.',
    lead: 'Strona nie używa analityki ani trackerów reklamowych. Formularz kontaktowy przetwarza tylko dane potrzebne do dostarczenia i obsługi wiadomości.',
}},
en:{nav:{home:'Home',work:'Advisory',writing:'Perspective',about:'About',contact:'Discuss a decision',oaf:'OAF model',privacy:'Privacy'},privacy:{
      title: 'Privacy — Arkadiusz Kamrowski', description: 'Information about data processing in the contact form on Arkadiusz Kamrowski’s website.', eyebrow: 'Privacy', headline: 'Minimum data. One purpose: respond to your message.', lead: 'The site does not use analytics or advertising trackers. The contact form processes only the data needed to deliver and handle your message.',
}}
} satisfies Record<Locale,UI>;
