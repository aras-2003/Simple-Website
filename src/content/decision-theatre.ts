// Lab copy is intentionally PL-first. Keep locale-specific content out of the scene.
// Node order: strategy → structure → responsibility → technology → execution → outcome.
export const theatre = {
  pl: {
    modes: [
      { name: 'Co wybieramy?', question: 'Strategia i inwestycje', title: 'Jeden cel. Wspólny kierunek.', body: 'Wybierasz priorytet. Budżet, ludzie i technologia pracują na ten sam wynik.', steps: ['Wybierz cel. Finansuj to, co go wspiera.', 'Wskaż osobę, która połączy ludzi i zasoby.', 'Sprawdź, czy klient odczuwa zmianę.'], trace: ['Kierunek', 'Portfel', 'Właściciel', 'Platformy', 'Adopcja', 'Wartość'], path: [0, 2, 5, 7, 9, 10] },
      { name: 'Kto odpowiada?', question: 'Odpowiedzialność i decyzje', title: 'Jedna osoba odpowiada za wynik.', body: 'Właściciel zna cel, ma prawo decydować i może usunąć przeszkody.', steps: ['Ustal, za jaki wynik odpowiada właściciel.', 'Daj mu prawo do podejmowania decyzji.', 'Rozliczaj efekt, nie samą listę zadań.'], trace: ['Kierunek', 'Model działania', 'Mandat', 'Dane', 'Adopcja', 'Wartość'], path: [0, 3, 4, 6, 9, 10] },
      { name: 'Jak dowozimy?', question: 'Technologia i realizacja', title: 'Zmiana działa w codziennej pracy.', body: 'Łączysz ludzi, procesy i technologię. Wartość pojawia się, gdy rozwiązanie jest używane.', steps: ['Zacznij od potrzeby, nie od narzędzia.', 'Połącz odpowiedzialność z technologią.', 'Doprowadź zmianę do codziennego użycia.'], trace: ['Kierunek', 'Model działania', 'Właściciel', 'Dane', 'Platformy', 'Wdrożenie', 'Adopcja', 'Wartość'], path: [0, 3, 5, 6, 7, 8, 9, 10] },
    ],
    hero: [
      {word: 'TAK', title: 'Wybierasz priorytet.', body: 'Na nim skupiasz budżet i uwagę.'},
      {word: 'NIE', title: 'Uwalniasz zasoby.', body: 'Odkładasz to, co nie wspiera celu.'},
      {word: 'KTO', title: 'Wskazujesz właściciela.', body: 'Jedna osoba odpowiada za wynik.'},
    ],
    phases: ['Cel', 'Właściciel', 'Wynik'],
    layers: ['Cel', 'Priorytety', 'Właściciel', 'Narzędzia', 'Działanie', 'Wynik'],
    nodes: ['Kierunek', 'Opcje', 'Portfel', 'Model działania', 'Mandat', 'Właściciel', 'Dane', 'Platformy', 'Wdrożenie', 'Adopcja', 'Wartość'],
  },
};
export type TheatreLocale = keyof typeof theatre;
