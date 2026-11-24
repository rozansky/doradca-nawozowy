// Baza nawozów naturalnych i organicznych.
//
// sklad          – średnia zawartość składników w % świeżej masy (N, P jako P2O5, K jako K2O).
//                  Rzeczywisty skład zależy od gatunku zwierząt, paszy, ściółki i przechowywania.
// wykorzystanie  – jaka część składników jest dostępna dla roślin w PIERWSZYM roku
//                  (reszta uwalnia się powoli w kolejnych latach).
// dawka          – typowy zakres w kg/m² (dla płynnych: l/m²). 1 kg/m² = 100 kg/ar = 10 t/ha.
// dawkaWzgledna  – ile tego nawozu daje się w porównaniu z obornikiem bydlęcym
//                  (np. 0,12 = pomiotu kurzego daje się ok. 8 razy mniej).

const NAWOZY_NATURALNE = [
  {
    id: "obornik-bydlecy",
    nazwa: "Obornik bydlęcy (krowi)",
    ikona: "🐄",
    jednostka: "kg",
    rodzaj: "obornik",
    charakter: "zimny",
    sklad: { N: 0.5, P: 0.3, K: 0.7 },
    wykorzystanie: { N: 0.3, P: 0.3, K: 0.5 },
    dawka: { min: 3, max: 5 },
    dawkaWzgledna: 1,
    opis: "Najbardziej uniwersalny i najbezpieczniejszy obornik. Rozkłada się powoli i działa przez 3–4 lata, dlatego dobrze buduje próchnicę.",
    kiedy: "Jesienią, przed przekopaniem lub orką. Wiosną tylko dobrze przefermentowany.",
    najlepszy: "Większość warzyw (kapustne, dyniowate, pomidor, ziemniak), róże, kukurydza; gleby lekkie i średnie.",
    uwagi: "Dobry wybór, jeśli nie wiesz, jaki obornik wybrać."
  },
  {
    id: "obornik-konski",
    nazwa: "Obornik koński",
    ikona: "🐴",
    jednostka: "kg",
    rodzaj: "obornik",
    charakter: "gorący",
    sklad: { N: 0.6, P: 0.3, K: 0.6 },
    wykorzystanie: { N: 0.35, P: 0.3, K: 0.5 },
    dawka: { min: 2, max: 4 },
    dawkaWzgledna: 0.8,
    opis: "Suchszy i bardziej „gorący” – szybko się rozkłada i silnie nagrzewa. Działa szybciej, ale krócej niż bydlęcy.",
    kiedy: "Jesienią lub wczesną wiosną; świetny do ogrzewania inspektów i podwyższonych zagonów.",
    najlepszy: "Gleby ciężkie, zimne i wilgotne (rozluźnia je i ogrzewa), ogórki, dynie, cukinie.",
    uwagi: "Często zawiera dużo słomy i nasion chwastów – najlepiej go wcześniej przekompostować."
  },
  {
    id: "obornik-owczy",
    nazwa: "Obornik owczy / kozi",
    ikona: "🐑",
    jednostka: "kg",
    rodzaj: "obornik",
    charakter: "gorący",
    sklad: { N: 0.8, P: 0.4, K: 0.9 },
    wykorzystanie: { N: 0.35, P: 0.3, K: 0.5 },
    dawka: { min: 2, max: 3 },
    dawkaWzgledna: 0.6,
    opis: "Najbardziej stężony z oborników ssaków, bogaty w potas. Suchy i gorący.",
    kiedy: "Jesienią, w mniejszych dawkach niż bydlęcy.",
    najlepszy: "Gleby ciężkie i chłodne, rośliny potasolubne (ziemniak, pomidor, kapusta).",
    uwagi: "Ze względu na stężenie łatwo przedawkować – trzymaj się niższych dawek."
  },
  {
    id: "obornik-swinski",
    nazwa: "Obornik świński",
    ikona: "🐖",
    jednostka: "kg",
    rodzaj: "obornik",
    charakter: "zimny",
    sklad: { N: 0.6, P: 0.5, K: 0.5 },
    wykorzystanie: { N: 0.3, P: 0.3, K: 0.5 },
    dawka: { min: 3, max: 4 },
    dawkaWzgledna: 1,
    opis: "Mokry, zimny i lekko zakwaszający. Rozkłada się wolno; ma mniej potasu niż inne oborniki.",
    kiedy: "Jesienią, najlepiej po przekompostowaniu (np. z dodatkiem słomy).",
    najlepszy: "Gleby lekkie, piaszczyste; uprawy rolnicze.",
    uwagi: "W ogrodzie mniej polecany – ma intensywny zapach i może zawierać więcej metali ciężkich (miedź, cynk) z pasz."
  },
  {
    id: "pomiot-kurzy",
    nazwa: "Pomiot kurzy (kurzeniec)",
    ikona: "🐔",
    jednostka: "kg",
    rodzaj: "pomiot",
    charakter: "bardzo gorący",
    sklad: { N: 1.5, P: 1.3, K: 0.8 },
    wykorzystanie: { N: 0.5, P: 0.4, K: 0.6 },
    dawka: { min: 0.3, max: 0.6 },
    dawkaWzgledna: 0.12,
    opis: "Bardzo silny nawóz – kilka razy bogatszy w azot i fosfor niż obornik. Działa szybko.",
    kiedy: "Wiosną przed siewem lub sadzeniem, cienko rozsypany i wymieszany z glebą; albo jako rozcieńczona gnojówka (1:20) w trakcie wzrostu.",
    najlepszy: "Rośliny o dużych potrzebach azotowych: kapustne, dyniowate, kukurydza, trawnik (jako granulat).",
    uwagi: "Świeży może poparzyć korzenie – nie kłaść bezpośrednio pod rośliny. Najlepiej przekompostować."
  },
  {
    id: "obornik-granulowany",
    nazwa: "Obornik granulowany (suszony)",
    ikona: "🟤",
    jednostka: "kg",
    rodzaj: "granulat",
    charakter: "suchy, bez zapachu",
    sklad: { N: 2.5, P: 1.5, K: 2.5 },
    wykorzystanie: { N: 0.4, P: 0.4, K: 0.6 },
    dawka: { min: 0.1, max: 0.3 },
    dawkaWzgledna: 0.07,
    opis: "Suszony i granulowany obornik (najczęściej bydlęcy lub kurzy) ze sklepu ogrodniczego. Wygodny, bez zapachu i nasion chwastów.",
    kiedy: "Wiosną i latem, rozsypany i wymieszany z wierzchnią warstwą gleby.",
    najlepszy: "Małe ogródki, balkony, trawniki, rabaty – gdzie trudno o świeży obornik.",
    uwagi: "Skład zależy od producenta – sprawdź opakowanie. Daje mniej próchnicy niż świeży obornik."
  },
  {
    id: "kompost",
    nazwa: "Kompost",
    ikona: "🍂",
    jednostka: "kg",
    rodzaj: "kompost",
    charakter: "łagodny",
    sklad: { N: 0.5, P: 0.3, K: 0.5 },
    wykorzystanie: { N: 0.15, P: 0.3, K: 0.5 },
    dawka: { min: 3, max: 6 },
    dawkaWzgledna: 1.2,
    opis: "Przerobione resztki roślinne i odpady kuchenne. Najbezpieczniejszy nawóz organiczny – poprawia strukturę gleby i nie parzy korzeni.",
    kiedy: "Przez cały sezon; można stosować co roku, także pod rośliny wrażliwe.",
    najlepszy: "Wszystkie rośliny, także marchew, truskawki i trawnik (przesiany, cienką warstwą).",
    uwagi: "Dla borówki i innych kwasolubnych – kompost z igliwia, kory i liści dębu."
  },
  {
    id: "gnojowica-bydleca",
    nazwa: "Gnojowica bydlęca",
    ikona: "🛢️",
    jednostka: "l",
    rodzaj: "gnojowica",
    charakter: "płynny, szybki",
    sklad: { N: 0.35, P: 0.15, K: 0.45 },
    wykorzystanie: { N: 0.5, P: 0.3, K: 0.6 },
    dawka: { min: 2, max: 3 },
    dawkaWzgledna: 0.7,
    opis: "Płynna mieszanina kału i moczu bez ściółki. Azot jest w niej w formie szybko działającej, ale łatwo ulatnia się do powietrza.",
    kiedy: "Wiosną przed siewem lub pogłównie na użytki zielone; aplikacja doglebowa lub wężami wleczonymi.",
    najlepszy: "Uprawy rolnicze: kukurydza, zboża, użytki zielone.",
    uwagi: "Nie buduje próchnicy jak obornik. Na gruntach ornych trzeba ją szybko wymieszać z glebą."
  }
];

// Czy obornik (bydlęcy jako punkt odniesienia) sprawdzi się przy danej roślinie.
// ocena: "tak" / "umiarkowanie" / "nie"
// dawka: [min, max] w kg/m² obornika bydlęcego (inne rodzaje przelicza dawkaWzgledna)
// dozwolone: rodzaje nawozów naturalnych, które są OK mimo oceny "nie"
const OBORNIK_DLA_ROSLIN = {
  pomidor:   { ocena: "tak", dawka: [3, 5], uwagi: "Najlepiej jesienią; pomidor dobrze plonuje w pierwszym roku po oborniku." },
  ogorek:    { ocena: "tak", dawka: [4, 6], uwagi: "Ogórki uwielbiają obornik – także koński pod zagon (ogrzewa glebę)." },
  ziemniak:  { ocena: "tak", dawka: [3, 4], uwagi: "Dawać jesienią. Świeży obornik wiosną sprzyja parchowi i pogarsza smak." },
  truskawka: { ocena: "umiarkowanie", dawka: [3, 4], uwagi: "Tylko przed założeniem plantacji, dobrze przefermentowany. Później kompost." },
  borowka:   { ocena: "nie", dawka: [0, 0], uwagi: "Obornik podnosi pH gleby i szkodzi borówce. Zamiast niego: kompost z igliwia, kora sosnowa.", dozwolone: ["kompost"] },
  jablon:    { ocena: "umiarkowanie", dawka: [2, 3], uwagi: "Przekompostowany obornik przy sadzeniu (wymieszany z ziemią) i co 2–3 lata pod koroną." },
  roza:      { ocena: "tak", dawka: [3, 4], uwagi: "Przekompostowany, jesienią lub wiosną. Nie przykrywać nim szczepienia." },
  trawnik:   { ocena: "nie", dawka: [0, 0], uwagi: "Świeży obornik niesie nasiona chwastów i brudzi murawę. Lepiej: przesiany kompost lub obornik granulowany.", dozwolone: ["kompost", "granulat"] },
  marchew:   { ocena: "nie", dawka: [0, 0], uwagi: "Świeży obornik powoduje rozwidlanie korzeni. Dawać go rok wcześniej pod przedplon; w roku uprawy tylko dojrzały kompost.", dozwolone: ["kompost"] },
  papryka:   { ocena: "tak", dawka: [3, 4], uwagi: "Przefermentowany obornik jesienią lub wiosną." },
  tuja:      { ocena: "umiarkowanie", dawka: [2, 3], uwagi: "Przekompostowany obornik do dołka przy sadzeniu; potem raczej kompost i kora." },
  pszenica:  { ocena: "umiarkowanie", dawka: [2.5, 3.4], uwagi: "Zwykle stosowany pod przedplon (okopowe, rzepak); bezpośrednio pod pszenicę możliwy jesienią." },
  kalafior:  { ocena: "tak", dawka: [4, 6], uwagi: "Pierwszy rok po oborniku – kalafior ma bardzo duże potrzeby." },
  brokul:    { ocena: "tak", dawka: [4, 5], uwagi: "Pierwszy rok po oborniku." },
  kapusta:   { ocena: "tak", dawka: [4, 6], uwagi: "Klasyczna roślina „na oborniku”, zwłaszcza odmiany późne." },
  zyto:      { ocena: "umiarkowanie", dawka: [2, 3], uwagi: "Na glebach lekkich bywa stosowany bezpośrednio pod żyto; częściej pod przedplon." },
  jeczmien:  { ocena: "umiarkowanie", dawka: [2, 3], uwagi: "Lepiej pod przedplon. Pod jęczmień browarny nie – zbyt dużo białka w ziarnie." },
  kukurydza: { ocena: "tak", dawka: [3, 3.4], uwagi: "Kukurydza bardzo dobrze wykorzystuje obornik i gnojowicę. Górna granica wynika z limitu 170 kg N/ha." },
  soja:      { ocena: "nie", dawka: [0, 0], uwagi: "Soja sama wiąże azot – nadmiar azotu z obornika hamuje brodawkowanie.", dozwolone: ["kompost"] }
};

// Zalecana dawka (kg/m²) danego nawozu naturalnego dla danej rośliny.
function zalecanaDawkaNaturalnego(roslinaId, nawoz) {
  const o = OBORNIK_DLA_ROSLIN[roslinaId];
  const sredniaBydlecego = o ? (o.dawka[0] + o.dawka[1]) / 2 : 3;
  const niepolecany = o && o.ocena === "nie" && !(o.dozwolone || []).includes(nawoz.rodzaj);
  if (niepolecany) return 0;
  // Gdy obornik nie jest polecany, ale ten rodzaj (np. kompost) jest – bierzemy typową dawkę nawozu.
  const dawka = o && o.ocena === "nie" ? (nawoz.dawka.min + nawoz.dawka.max) / 2 : sredniaBydlecego * nawoz.dawkaWzgledna;
  return Math.round(dawka * 100) / 100;
}

// Czy nawóz naturalny jest odradzany dla rośliny.
function naturalnyOdradzany(roslinaId, nawoz) {
  const o = OBORNIK_DLA_ROSLIN[roslinaId];
  return !!o && o.ocena === "nie" && !(o.dozwolone || []).includes(nawoz.rodzaj);
}
