import type { Locale } from '../lib/site';

export type Note = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  readTime: number;
  sections: { heading: string; paragraphs: string[] }[];
};

const notes: Record<Locale, Note[]> = {
  pl: [
    {
      slug: 'architecture-as-decision-system', category: 'Enterprise Architecture', title: 'Architektura jako system decyzji, nie system dokumentów', readTime: 6,
      dek: 'Problemem architektury rzadko jest brak modeli. Częściej brakuje mechanizmu, który zamienia model w wybór, odpowiedzialność i konsekwencję.',
      sections: [
        { heading: 'Artefakt nie jest produktem architektury', paragraphs: ['Mapa capability, target architecture czy zasada technologiczna mają wartość dopiero wtedy, gdy zmieniają sposób alokacji kapitału, kolejność inicjatyw albo granice decyzji produktowych. Sam fakt, że model jest poprawny, nie oznacza jeszcze, że organizacja z niego korzysta.', 'Dlatego pytanie „czy mamy architekturę?” jest mniej użyteczne niż „jakie decyzje dzięki niej podejmujemy inaczej?”. To przesuwa ciężar z kompletności dokumentacji na jakość mechanizmu decyzyjnego.'] },
        { heading: 'Dobra decyzja potrzebuje kontekstu', paragraphs: ['Decyzja architektoniczna powinna mieć nazwany problem, kryteria, alternatywy, właściciela oraz konsekwencje. Bez tego łatwo zamienić governance w proces zatwierdzania dokumentów, który nie redukuje ryzyka i nie zwiększa tempa.', 'Architektura zyskuje wpływ, kiedy potrafi pokazać związek między strategicznym outcome, capability, zależnością technologiczną i inwestycją. Wtedy rozmowa przestaje być sporem o preferencję techniczną, a staje się rozmową o wyborze organizacyjnym.'] },
        { heading: 'Wpływ mierzy się w ruchu systemu', paragraphs: ['Najciekawsze miary architektury nie dotyczą liczby review ani zgodności z szablonem. Bardziej interesuje mnie, czy szybciej wykrywamy sprzeczne inicjatywy, czy ograniczamy koszt nieodwracalnych decyzji i czy portfolio finansuje zależności we właściwej kolejności.', 'W tym sensie architektura jest dźwignią. Jej zadaniem nie jest opisać całą organizację, ale pomóc jej podejmować mniej sprzecznych decyzji pod presją czasu i niepełnej informacji.'] },
      ],
    },
    {
      slug: 'portfolio-as-strategy-in-motion', category: 'Portfolio & PMO', title: 'Portfolio jest strategią w ruchu', readTime: 5,
      dek: 'Deklarowana strategia mówi, co jest ważne. Portfolio pokazuje, czy organizacja naprawdę w to wierzy.',
      sections: [
        { heading: 'Budżet jest bardziej szczery niż prezentacja', paragraphs: ['Jeżeli strategia wskazuje trzy priorytety, a portfolio finansuje trzydzieści niezależnych kierunków, rzeczywista strategia jest inna niż deklarowana. Alokacja ludzi, pieniędzy i uwagi pokazuje faktyczne wybory organizacji.', 'Dlatego portfolio nie powinno być końcową tabelą powstałą po procesie strategicznym. Powinno być jednym z głównych miejsc, w których strategia jest testowana.'] },
        { heading: 'Priorytetyzacja oznacza również „nie”', paragraphs: ['Ranking stu inicjatyw od 1 do 100 nie rozwiązuje problemu przeciążenia, jeżeli pierwszych osiemdziesiąt nadal jest aktywnych. Priorytetyzacja staje się realna dopiero wtedy, gdy ogranicza work in progress i przesuwa zasoby.', 'Dobra rozmowa portfolio powinna więc zawierać decyzje stop, start i continue oraz jawnie pokazywać koszt alternatywny. Bez tego governance łatwo staje się negocjacją o zachowanie wszystkiego.'] },
        { heading: 'Evidence zamyka — i otwiera — cykl', paragraphs: ['Portfolio potrzebuje informacji zwrotnej z wykonania. Nie tylko statusu i zużycia budżetu, ale dowodów dotyczących outcome, ryzyka i trafności wcześniejszych założeń.', 'Jeżeli evidence nie może zmienić priorytetu, finansowania albo samego kierunku, portfolio jest systemem raportowania. Jeżeli może — staje się strategią w ruchu.'] },
      ],
    },
    {
      slug: 'ai-governance-without-theatre', category: 'AI & Governance', title: 'AI governance bez teatru kontroli', readTime: 6,
      dek: 'Dojrzałe governance nie próbuje zatrzymać eksperymentu. Projektuje granice, odpowiedzialność i dowody proporcjonalne do ryzyka.',
      sections: [
        { heading: 'Jedna polityka dla każdego use case’u nie działa', paragraphs: ['Ryzyko narzędzia wspierającego redakcję wewnętrznej notatki jest inne niż ryzyko systemu wpływającego na decyzję dotyczącą obywatela, klienta lub pracownika. Governance, które traktuje je identycznie, będzie jednocześnie zbyt ciężkie dla niskiego ryzyka i zbyt płytkie dla wysokiego.', 'Punktem startu powinien być więc scenariusz użycia, dane, autonomia systemu, wpływ decyzji i możliwość odwrócenia skutku. Dopiero potem dobieramy guardrails.'] },
        { heading: 'Kontrola powinna być częścią delivery', paragraphs: ['Jeżeli compliance pojawia się wyłącznie na końcu procesu, organizacja otrzymuje konflikt między tempem i bezpieczeństwem. Lepszy model wbudowuje wymagania dotyczące danych, testów, human oversight i monitoringu do lifecycle produktu.', 'To nie oznacza mnożenia bramek. Oznacza jasne standardy dowodu: co zespół musi pokazać, żeby use case mógł przejść na kolejny poziom ekspozycji.'] },
        { heading: 'Najważniejsze pytanie: kto odpowiada za decyzję', paragraphs: ['AI może wspierać analizę, rekomendować albo automatyzować, ale odpowiedzialność organizacyjna nie znika. Governance powinno wskazywać właściciela outcome, właściciela modelu i właściciela ryzyka oraz sposób eskalacji, gdy evidence przestaje mieścić się w założonym profilu.', 'Bez tego łatwo stworzyć imponujący zestaw polityk, który nie odpowiada na podstawowe pytanie: kto może powiedzieć „stop” i na jakiej podstawie.'] },
      ],
    },
    {
      slug: 'transformation-operating-model', category: 'Transformation', title: 'Transformacja potrzebuje operating modelu, nie tylko roadmapy', readTime: 5,
      dek: 'Roadmapa pokazuje kolejność. Operating model odpowiada na trudniejsze pytanie: kto i w jakim rytmie potrafi tę kolejność zmieniać.',
      sections: [
        { heading: 'Roadmapa starzeje się szybciej niż organizacja', paragraphs: ['W złożonej transformacji nowe informacje pojawiają się szybciej niż można aktualizować centralny plan. To nie znaczy, że roadmapa jest zbędna. Znaczy, że sama nie wystarczy.', 'Potrzebny jest system ról, forów decyzyjnych, mierników i informacji zwrotnej, który pozwala korygować plan bez utraty kierunku. To właśnie rozumiem przez operating model transformacji.'] },
        { heading: 'Governance powinno usuwać konflikt, nie produkować spotkania', paragraphs: ['Każde forum powinno mieć określony typ decyzji, mandat i wejścia. Jeżeli te same tematy krążą między steering committee, architekturą, PMO i zespołami produktowymi bez jasnego właściciela, problemem nie jest brak spotkań — problemem jest architektura decyzji.', 'Dojrzały operating model redukuje liczbę miejsc, w których decyzja może utknąć, i zwiększa jakość informacji dostępnej w momencie wyboru.'] },
        { heading: 'Zmiana kierunku nie musi oznaczać utraty kontroli', paragraphs: ['Kontrola nie polega na utrzymaniu pierwotnego planu za wszelką cenę. Polega na tym, że organizacja wie, kiedy i dlaczego plan został zmieniony oraz jakie evidence uzasadniało korektę.', 'To pozwala połączyć odpowiedzialność z adaptacyjnością — dwie cechy, które w źle zaprojektowanym governance są często traktowane jak przeciwieństwa.'] },
      ],
    },
  ],
  en: [
    {
      slug: 'architecture-as-decision-system', category: 'Enterprise Architecture', title: 'Architecture as a decision system, not a document system', readTime: 6,
      dek: 'Architecture rarely suffers from a lack of models. More often it lacks the mechanism that turns a model into a choice, accountability and consequence.',
      sections: [
        { heading: 'The artifact is not the product', paragraphs: ['A capability map, target architecture or technology principle creates value only when it changes capital allocation, initiative sequencing or the boundaries of product decisions. A correct model is not the same thing as an influential model.', 'The more useful question is therefore not “do we have architecture?” but “which decisions do we make differently because of it?”. That shifts attention from completeness of documentation to quality of the decision mechanism.'] },
        { heading: 'A good decision needs context', paragraphs: ['An architectural decision needs a named problem, criteria, alternatives, an owner and consequences. Without them, governance can become a document approval process that neither reduces risk nor increases speed.', 'Architecture gains influence when it can connect a strategic outcome, a capability, a technology dependency and an investment choice. The discussion then moves from technical preference to organizational choice.'] },
        { heading: 'Influence is visible in how the system moves', paragraphs: ['The most interesting architecture measures are not the number of reviews or template compliance. I care more about whether conflicting initiatives are detected earlier, irreversible decisions become cheaper and portfolio dependencies are funded in the right sequence.', 'In that sense architecture is leverage. Its job is not to describe the entire organization, but to help it make fewer contradictory decisions under time pressure and incomplete information.'] },
      ],
    },
    {
      slug: 'portfolio-as-strategy-in-motion', category: 'Portfolio & PMO', title: 'Portfolio is strategy in motion', readTime: 5,
      dek: 'Declared strategy says what matters. The portfolio shows whether the organization really believes it.',
      sections: [
        { heading: 'Budget is more honest than a presentation', paragraphs: ['If strategy identifies three priorities while the portfolio funds thirty independent directions, the real strategy is different from the declared one. Allocation of people, money and attention reveals the organization’s actual choices.', 'Portfolio should therefore not be a final table created after the strategy process. It should be one of the main places where strategy is tested.'] },
        { heading: 'Prioritization also means “no”', paragraphs: ['Ranking one hundred initiatives from 1 to 100 does not solve overload if the first eighty remain active. Prioritization becomes real only when it limits work in progress and moves resources.', 'A useful portfolio conversation therefore includes stop, start and continue decisions and makes opportunity cost explicit. Without that, governance turns into a negotiation to preserve everything.'] },
        { heading: 'Evidence closes — and reopens — the loop', paragraphs: ['Portfolio needs feedback from execution. Not only status and budget consumption, but evidence about outcomes, risks and the validity of earlier assumptions.', 'If evidence cannot change priority, funding or direction, portfolio is a reporting system. If it can, it becomes strategy in motion.'] },
      ],
    },
    {
      slug: 'ai-governance-without-theatre', category: 'AI & Governance', title: 'AI governance without control theatre', readTime: 6,
      dek: 'Mature governance does not try to stop experimentation. It designs boundaries, accountability and evidence in proportion to risk.',
      sections: [
        { heading: 'One policy for every use case does not work', paragraphs: ['The risk of a tool helping edit an internal note is different from the risk of a system influencing a decision about a citizen, customer or employee. Governance that treats them identically will be too heavy for low risk and too shallow for high risk.', 'The starting point should be the use case, data, system autonomy, decision impact and reversibility. Guardrails come after that assessment.'] },
        { heading: 'Control should be part of delivery', paragraphs: ['When compliance appears only at the end, the organization creates a conflict between speed and safety. A better model embeds data, testing, human oversight and monitoring expectations into the product lifecycle.', 'That does not mean more gates. It means a clear standard of evidence: what must a team show before a use case moves to a higher level of exposure?'] },
        { heading: 'The core question is who owns the decision', paragraphs: ['AI may support analysis, recommend or automate, but organizational accountability does not disappear. Governance should name the owner of the outcome, the model and the risk, together with an escalation path when evidence leaves the expected profile.', 'Without that, it is easy to create an impressive policy set that cannot answer the basic question: who can say “stop”, and on what basis?'] },
      ],
    },
    {
      slug: 'transformation-operating-model', category: 'Transformation', title: 'Transformation needs an operating model, not only a roadmap', readTime: 5,
      dek: 'A roadmap shows sequence. An operating model answers the harder question: who can change that sequence, and in what decision rhythm?',
      sections: [
        { heading: 'The roadmap ages faster than the organization', paragraphs: ['In complex transformation, new information appears faster than a central plan can be updated. That does not make a roadmap useless. It means the roadmap is insufficient on its own.', 'What is needed is a system of roles, decision forums, measures and feedback that allows the plan to change without losing direction. That is what I mean by a transformation operating model.'] },
        { heading: 'Governance should remove conflict, not produce meetings', paragraphs: ['Every forum should have a defined decision type, mandate and inputs. If the same topics circulate between steering committees, architecture, PMO and product teams without a clear owner, the problem is not a lack of meetings — it is the architecture of decisions.', 'A mature operating model reduces the number of places where a decision can get stuck and improves the information available at the moment of choice.'] },
        { heading: 'Changing direction does not mean losing control', paragraphs: ['Control is not the preservation of the original plan at all costs. It means the organization knows when and why the plan changed and what evidence justified the correction.', 'That makes accountability and adaptability compatible — two properties that poorly designed governance often treats as opposites.'] },
      ],
    },
  ],
};

export function getNotes(locale: Locale): Note[] { return notes[locale]; }
export function getNote(locale: Locale, slug: string): Note | undefined { return notes[locale].find((note) => note.slug === slug); }
