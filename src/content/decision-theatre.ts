// Lab copy is intentionally PL-first. Keep locale-specific content out of the scene.
// Node order: strategy → structure → responsibility → technology → execution → outcome.
export const theatre = {
  pl: {
    modes: [
      { name: 'Strategia i inwestycje', question: 'Co zasługuje na TAK?', title: 'Jeden kierunek. Konkretne wybory.', body: 'Priorytet zmienia portfel. Portfel potrzebuje właściciela, zdolności i drogi do wyniku. To, czemu mówisz NIE, uwalnia zasoby dla tego, co naprawdę ważne.', trace: ['Kierunek', 'Portfel', 'Właściciel', 'Platformy', 'Adopcja', 'Wartość'], path: [0, 2, 5, 7, 9, 10] },
      { name: 'Odpowiedzialność i decyzje', question: 'Kto ma prawo zdecydować?', title: 'Mandat, który dociera do działania.', body: 'Odpowiedzialność działa wtedy, gdy właściciel wyniku ma prawo rozstrzygać kompromisy. Od modelu działania po decyzje zespołów.', trace: ['Kierunek', 'Model działania', 'Mandat', 'Dane', 'Adopcja', 'Wartość'], path: [0, 3, 4, 6, 9, 10] },
      { name: 'Technologia i realizacja', question: 'Co musi zadziałać razem?', title: 'Od możliwości do wykorzystania.', body: 'Technologia tworzy możliwość. Właściciel przekłada ją na zmianę sposobu pracy. Wartość pojawia się dopiero wtedy, gdy ludzie tę zmianę wykorzystują.', trace: ['Kierunek', 'Model działania', 'Właściciel', 'Dane', 'Platformy', 'Wdrożenie', 'Adopcja', 'Wartość'], path: [0, 3, 5, 6, 7, 8, 9, 10] },
    ],
    layers: ['Strategia', 'Struktura', 'Odpowiedzialność', 'Technologia', 'Realizacja', 'Rezultat'],
    nodes: ['Kierunek', 'Opcje', 'Portfel', 'Model działania', 'Mandat', 'Właściciel', 'Dane', 'Platformy', 'Wdrożenie', 'Adopcja', 'Wartość'],
  },
};
export type TheatreLocale = keyof typeof theatre;
