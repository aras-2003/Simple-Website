import type { Locale } from '../lib/site';

type PrivacySection = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

type PrivacyContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lead: string;
  updated: string;
  sections: PrivacySection[];
};

const resendGdpr = 'https://resend.com/security/gdpr';
const resendDpa = 'https://resend.com/legal/dpa';

export const privacyContent: Record<Locale, PrivacyContent> = {
  pl: {
    title: 'Prywatność – Arkadiusz Kamrowski',
    description: 'Informacja o przetwarzaniu danych w formularzu kontaktowym strony Arkadiusza Kamrowskiego.',
    eyebrow: 'Prywatność / informacja o danych',
    headline: 'Minimum danych. Jasny cel. Bez profilu reklamowego.',
    lead: 'Strona nie korzysta z analityki ani trackerów reklamowych. Formularz kontaktowy przetwarza dane potrzebne do dostarczenia wiadomości, odpowiedzi i ochrony formularza przed nadużyciami.',
    updated: 'Ostatnia aktualizacja: 5 września 2026',
    sections: [
      {
        title: 'Administrator danych',
        body: 'Administratorem danych przekazanych przez formularz jest Arkadiusz Kamrowski. W sprawach dotyczących danych możesz skontaktować się przez formularz kontaktowy tej strony lub przez profil LinkedIn wskazany w serwisie.',
      },
      {
        title: 'Zakres danych',
        body: 'Formularz przetwarza imię i nazwisko, adres e-mail, opcjonalną nazwę organizacji, wybrany temat i treść wiadomości. Dla bezpieczeństwa przetwarzane mogą być również podstawowe dane techniczne, w szczególności adres IP, nagłówki żądania oraz znaczniki czasu potrzebne do ograniczania nadużyć.',
      },
      {
        title: 'Cele i podstawy prawne',
        body: 'Dane są używane do obsługi korespondencji i odpowiedzi. Gdy wiadomość dotyczy potencjalnej współpracy, podstawą może być podjęcie działań przed zawarciem umowy (art. 6 ust. 1 lit. b RODO). W pozostałych przypadkach podstawą jest uzasadniony interes administratora polegający na prowadzeniu korespondencji oraz ochronie formularza przed nadużyciami (art. 6 ust. 1 lit. f RODO). Checkbox w formularzu potwierdza zapoznanie się z informacją o prywatności; nie jest mechanizmem zgody marketingowej.',
      },
      {
        title: 'Odbiorcy i dostawcy',
        body: 'Wiadomość jest przekazywana przez warstwę contact API do usługi Resend (Plus Five Five, Inc.) jako dostawcy transactional email, a następnie do skonfigurowanej skrzynki pocztowej. Dane mogą być również przetwarzane przez dostawców infrastruktury technicznej niezbędnej do hostowania i zabezpieczenia serwisu, w zakresie koniecznym do świadczenia tych usług.',
        href: resendDpa,
        linkLabel: 'Resend DPA',
      },
      {
        title: 'Transfer poza EOG',
        body: 'Resend informuje, że dane klientów – w tym treść wiadomości i logi dostarczenia – są przechowywane w Stanach Zjednoczonych. Według aktualnej dokumentacji Resend transfery z EOG są objęte Standardowymi Klauzulami Umownymi, a dodatkowym mechanizmem jest udział Resend w EU–U.S. Data Privacy Framework. Szczegóły i aktualny DPA należy traktować jako źródło nadrzędne dla zasad dostawcy.',
        href: resendGdpr,
        linkLabel: 'Informacja GDPR Resend',
      },
      {
        title: 'Retencja',
        body: 'Sama aplikacja nie tworzy bazy zgłoszeń. Korespondencja jest przechowywana tak długo, jak jest to potrzebne do obsługi sprawy, a w uzasadnionych przypadkach dłużej – w zakresie niezbędnym do ustalenia, dochodzenia lub obrony roszczeń albo wykonania obowiązków prawnych. Resend obecnie deklaruje 30-dniową retencję danych e-mail i logów na planach Free, Pro i Scale; plan Enterprise może mieć konfigurowalną retencję. Skrzynka pocztowa stosuje własne zasady retencji.',
        href: resendGdpr,
        linkLabel: 'Retencja w Resend',
      },
      {
        title: 'Twoje prawa',
        body: 'W zależności od podstawy i okoliczności przetwarzania możesz żądać dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a gdy ma to zastosowanie – przenoszenia danych. Wobec przetwarzania opartego na uzasadnionym interesie możesz wnieść sprzeciw. Masz również prawo złożyć skargę do właściwego organu nadzorczego ds. ochrony danych.',
      },
      {
        title: 'Brak profilowania i marketingu',
        body: 'Dane z formularza nie są automatycznie dodawane do newslettera, CRM marketingowego ani profilu reklamowego. Serwis nie podejmuje wobec nadawcy zautomatyzowanych decyzji wywołujących skutki prawne i nie wykorzystuje danych z formularza do profilowania reklamowego.',
      },
      {
        title: 'Cookies i logi techniczne',
        body: 'Aplikacja nie ustawia cookies analitycznych ani reklamowych. Standardowe logi infrastruktury mogą powstawać w celu obsługi ruchu, diagnostyki i bezpieczeństwa. Ich zakres i retencja zależą od konfiguracji środowiska hostingowego.',
      },
    ],
  },
  en: {
    title: 'Privacy – Arkadiusz Kamrowski',
    description: 'Information about processing personal data submitted through the contact form on Arkadiusz Kamrowski’s website.',
    eyebrow: 'Privacy / data information',
    headline: 'Minimum data. A clear purpose. No advertising profile.',
    lead: 'The site does not use analytics or advertising trackers. The contact form processes the data needed to deliver and answer a message and to protect the form from abuse.',
    updated: 'Last updated: 5 September 2026',
    sections: [
      {
        title: 'Data controller',
        body: 'The controller of data submitted through the form is Arkadiusz Kamrowski. For data-protection matters you can use the contact form on this site or the LinkedIn profile linked from the site.',
      },
      {
        title: 'Data processed',
        body: 'The form processes your name, email address, optional organization, selected topic and message content. For security, basic technical data may also be processed, in particular IP address, request headers and timing information used to limit abuse.',
      },
      {
        title: 'Purposes and legal bases',
        body: 'Data is used to handle correspondence and respond. When a message concerns potential cooperation, processing may be necessary to take steps before entering into a contract (GDPR Article 6(1)(b)). In other cases the basis is the controller’s legitimate interest in handling correspondence and protecting the form against abuse (Article 6(1)(f)). The form checkbox confirms that you have read the privacy information; it is not consent to marketing.',
      },
      {
        title: 'Recipients and providers',
        body: 'The contact API sends the message through Resend (Plus Five Five, Inc.) as the transactional email provider and then to the configured mailbox. Data may also be processed by technical infrastructure providers required to host and secure the service, only to the extent necessary to provide those services.',
        href: resendDpa,
        linkLabel: 'Resend DPA',
      },
      {
        title: 'Transfers outside the EEA',
        body: 'Resend states that customer data, including message content and delivery logs, is stored in the United States. According to Resend’s current documentation, transfers from the EEA are covered by the EU Standard Contractual Clauses, with participation in the EU–U.S. Data Privacy Framework as an additional mechanism. Resend’s current DPA and GDPR documentation are the authoritative source for the provider’s transfer arrangements.',
        href: resendGdpr,
        linkLabel: 'Resend GDPR information',
      },
      {
        title: 'Retention',
        body: 'The application itself does not create a database of submissions. Correspondence is kept for as long as needed to handle the matter and, where justified, longer to establish, exercise or defend legal claims or meet legal obligations. Resend currently states that email and log data is retained for 30 days on Free, Pro and Scale plans, while Enterprise may use flexible retention. The destination mailbox follows its own retention settings.',
        href: resendGdpr,
        linkLabel: 'Resend retention information',
      },
      {
        title: 'Your rights',
        body: 'Depending on the legal basis and circumstances, you may request access, rectification, erasure or restriction of processing and, where applicable, data portability. You may object to processing based on legitimate interests. You also have the right to lodge a complaint with the competent data-protection supervisory authority.',
      },
      {
        title: 'No profiling or marketing',
        body: 'Form data is not automatically added to a newsletter, marketing CRM or advertising profile. The service does not make automated decisions about the sender that produce legal effects and does not use contact-form data for advertising profiling.',
      },
      {
        title: 'Cookies and technical logs',
        body: 'The application does not set analytics or advertising cookies. Standard infrastructure logs may be generated for traffic handling, diagnostics and security. Their scope and retention depend on the hosting environment configuration.',
      },
    ],
  },
};
