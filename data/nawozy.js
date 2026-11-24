// Baza nawozów mineralnych.
// Zawartość składników w procentach: N = azot, P = fosfor jako P2O5, K = potas jako K2O.
// Skład podano typowy – przed zakupem sprawdź opakowanie konkretnego produktu.
// grupa: "N" / "P" / "K" = nawozy jednoskładnikowe, "NPK" = wieloskładnikowe.

const NAWOZY = [
  // --- Azotowe ---
  { id: "saletra-amonowa", nazwa: "Saletra amonowa", grupa: "N", sklad: { N: 34, P: 0, K: 0 }, uwagi: "Uniwersalny nawóz azotowy, działa szybko." },
  { id: "mocznik", nazwa: "Mocznik", grupa: "N", sklad: { N: 46, P: 0, K: 0 }, uwagi: "Najwięcej azotu w kg nawozu; najlepiej wymieszać z glebą." },
  { id: "saletra-wapniowa", nazwa: "Saletra wapniowa", grupa: "N", sklad: { N: 15.5, P: 0, K: 0 }, uwagi: "Dostarcza też wapń – dobra dla pomidora, papryki, jabłoni." },
  { id: "siarczan-amonu", nazwa: "Siarczan amonu", grupa: "N", sklad: { N: 21, P: 0, K: 0 }, uwagi: "Zakwasza glebę i dostarcza siarkę – dla roślin kwasolubnych." },

  // --- Fosforowe ---
  { id: "superfosfat-potrojny", nazwa: "Superfosfat potrójny", grupa: "P", sklad: { N: 0, P: 40, K: 0 }, uwagi: "Skoncentrowany nawóz fosforowy." },
  { id: "superfosfat-prosty", nazwa: "Superfosfat prosty", grupa: "P", sklad: { N: 0, P: 19, K: 0 }, uwagi: "Zawiera też siarkę i wapń." },

  // --- Potasowe ---
  { id: "sol-potasowa", nazwa: "Sól potasowa (chlorek potasu)", grupa: "K", sklad: { N: 0, P: 0, K: 60 }, uwagi: "Tania, ale zawiera chlor – nie dla roślin wrażliwych." },
  { id: "siarczan-potasu", nazwa: "Siarczan potasu", grupa: "K", sklad: { N: 0, P: 0, K: 50 }, uwagi: "Bez chloru – dla warzyw, truskawek, borówek." },

  // --- Wieloskładnikowe ---
  { id: "npk-15-15-15", nazwa: "NPK 15-15-15 (nawóz uniwersalny)", grupa: "NPK", sklad: { N: 15, P: 15, K: 15 }, uwagi: "Zrównoważony skład do ogrodu." },
  { id: "npk-6-20-30", nazwa: "NPK 6-20-30 (np. Polifoska 6)", grupa: "NPK", sklad: { N: 6, P: 20, K: 30 }, uwagi: "Przedsiewnie, gdy potrzeba dużo potasu." },
  { id: "npk-8-24-24", nazwa: "NPK 8-24-24 (np. Polifoska 8)", grupa: "NPK", sklad: { N: 8, P: 24, K: 24 }, uwagi: "Przedsiewnie pod zboża i rzepak." },
  { id: "npk-13-6-19", nazwa: "NPK 13,6-6,4-19,1 (np. Azofoska)", grupa: "NPK", sklad: { N: 13.6, P: 6.4, K: 19.1 }, uwagi: "Ogrodniczy, z magnezem i mikroelementami." },
  { id: "fosforan-amonu", nazwa: "Fosforan amonu 18-46-0", grupa: "NPK", sklad: { N: 18, P: 46, K: 0 }, uwagi: "Startowy pod kukurydzę, dużo fosforu." }
];
