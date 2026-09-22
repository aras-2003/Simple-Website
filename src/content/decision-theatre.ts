export const perspectives = [
  { name: 'Kierunek', label: 'Strategia i inwestycje', title: 'Każda inwestycja.\nTen sam kierunek.', body: 'Strategia staje się realna, gdy budżet, ludzie i technologia wspierają ten sam priorytet. Reszta może poczekać.', principle: 'Finansuj to, co prowadzi do celu.', trace: ['Priorytet', 'Inwestycje', 'Wartość'], caption: 'Wspólny cel porządkuje niezależne inicjatywy.' },
  { name: 'Odpowiedzialność', label: 'Właściciele i prawa decyzyjne', title: 'Jasny mandat.\nMniej zawieszeń.', body: 'Odpowiedzialność wymaga prawa do decyzji. Właściciel wyniku łączy zespoły i rozstrzyga to, co zatrzymuje zmianę.', principle: 'Połącz odpowiedzialność z mandatem.', trace: ['Wynik', 'Właściciel', 'Decyzja'], caption: 'Właściciel łączy zespoły, zachowując ich autonomię.' },
  { name: 'Wykonanie', label: 'Technologia i przepływ wykonania', title: 'Od decyzji\ndo działania.', body: 'Dane, platformy i zespoły tworzą drogę do wyniku. Wdrożenie ma sens, gdy zmiana działa w codziennej pracy.', principle: 'Sprawdzaj efekt, nie tylko wdrożenie.', trace: ['Decyzja', 'Wdrożenie', 'Adopcja'], caption: 'Przepływ łączy technologię z użyciem i efektem.' },
];

// Same nine modules, three organizational relationships. Units are scene pixels.
export function modulePosition(state: number, index: number): [number, number, number] {
  const row = Math.floor(index / 3), col = index % 3;
  if (state === 1) return [(col - 1) * 116, (row - 1) * 116, index === 4 ? 96 : 0];
  if (state === 2) return [(col - 1) * 112, (row - 1) * 87, (col - 1) * 36 + (row === 1 ? 18 : 0)];
  return [(col - 1) * 82, (row - 1) * 82, 0];
}
export const decisionPaths = [[0, 1, 4, 7, 8], [0, 4, 2, 4, 8, 4, 6], [0, 1, 2, 5, 4, 3, 6, 7, 8]];
