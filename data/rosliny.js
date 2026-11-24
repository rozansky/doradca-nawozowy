// Baza danych roślin.
// Aby dodać nową roślinę, skopiuj jeden obiekt i zmień jego wartości.
// Poziomy potrzeb pokarmowych: 1 = niskie, 2 = średnie, 3 = wysokie.
// dawka: orientacyjne zapotrzebowanie na sezon w g/m² czystego składnika
//        (N = azot, P = fosfor jako P2O5, K = potas jako K2O). 10 g/m² = 100 kg/ha.
// bezChloru: true  -> roślina wrażliwa na chlor (kalkulator domyślnie wybierze siarczan potasu)
// kwasolubna: true -> kalkulator domyślnie wybierze nawozy zakwaszające

const ROSLINY = [
  {
    id: "pomidor",
    nazwa: "Pomidor",
    lacina: "Solanum lycopersicum",
    aliasy: ["pomidory", "tomat"],
    kategoria: "Warzywa",
    ikona: "🍅",
    dawka: { N: 15, P: 8, K: 20 },
    bezChloru: true,
    opis: "Warzywo o dużych wymaganiach pokarmowych, szczególnie wobec potasu i wapnia w okresie owocowania.",
    gleba: { ph: "6,0–7,0", typ: "Żyzna, próchniczna, przepuszczalna" },
    potrzeby: { N: 2, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed sadzeniem", zalecenie: "Kompost lub obornik (ok. 3–5 kg/m²) oraz wieloskładnikowy nawóz NPK." },
      { termin: "Po przyjęciu się rozsady", zalecenie: "Nawóz z przewagą azotu w umiarkowanej dawce, by pobudzić wzrost." },
      { termin: "Kwitnienie i owocowanie", zalecenie: "Nawozy z przewagą potasu (np. siarczan potasu) co 10–14 dni, wapń przeciw suchej zgniliźnie wierzchołkowej." }
    ],
    naturalne: ["Gnojówka z pokrzywy (rozcieńczona 1:10)", "Kompost", "Popiół drzewny (źródło potasu, z umiarem)"],
    problemy: [
      { nazwa: "Zaraza ziemniaka", typ: "choroba", objawy: "Brunatne plamy na liściach i owocach, biały nalot od spodu liści.", zapobieganie: "Podlewanie pod korzeń, przewiewne stanowisko, usuwanie dolnych liści, uprawa pod zadaszeniem.", srodki: "Fungicydy miedziowe lub inne fungicydy zarejestrowane przeciw zarazie w pomidorze." },
      { nazwa: "Sucha zgnilizna wierzchołkowa", typ: "zaburzenie", objawy: "Ciemne, wklęsłe plamy na wierzchołkach owoców.", zapobieganie: "Regularne podlewanie, dokarmianie wapniem.", srodki: "Nawozy wapniowe dolistnie (np. saletra wapniowa)." },
      { nazwa: "Mszyce i mączlik", typ: "szkodnik", objawy: "Skręcone liście, lepka spadź, drobne białe owady.", zapobieganie: "Żółte tablice lepowe, wyciągi z czosnku, biedronki.", srodki: "Insektycydy zarejestrowane w pomidorze, preparaty na bazie olejów roślinnych lub mydła potasowego." }
    ]
  },
  {
    id: "ogorek",
    nazwa: "Ogórek",
    lacina: "Cucumis sativus",
    aliasy: ["ogórki", "ogorki"],
    kategoria: "Warzywa",
    ikona: "🥒",
    dawka: { N: 12, P: 8, K: 18 },
    bezChloru: true,
    opis: "Szybko rosnące warzywo o płytkim systemie korzeniowym, wrażliwe na zasolenie podłoża.",
    gleba: { ph: "6,0–7,0", typ: "Ciepła, próchniczna, wilgotna" },
    potrzeby: { N: 3, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed siewem", zalecenie: "Obornik lub kompost jesienią albo wiosną, nawóz NPK przed siewem." },
      { termin: "Wzrost", zalecenie: "Mniejsze, częstsze dawki nawozu (co 7–10 dni), bo korzenie są wrażliwe." },
      { termin: "Owocowanie", zalecenie: "Nawozy z przewagą potasu i magnezu." }
    ],
    naturalne: ["Gnojówka z pokrzywy", "Kompost", "Ściółkowanie skoszoną trawą"],
    problemy: [
      { nazwa: "Mączniak rzekomy", typ: "choroba", objawy: "Kanciaste żółte plamy na liściach, szarofioletowy nalot od spodu.", zapobieganie: "Odmiany odporne, unikanie zraszania liści, płodozmian.", srodki: "Fungicydy zarejestrowane przeciw mączniakowi rzekomemu dyniowatych." },
      { nazwa: "Przędziorek", typ: "szkodnik", objawy: "Drobne jasne plamki, delikatna pajęczyna na spodzie liści.", zapobieganie: "Utrzymywanie wilgotności powietrza, drapieżne roztocza.", srodki: "Akarycydy zarejestrowane w ogórku." }
    ]
  },
  {
    id: "ziemniak",
    nazwa: "Ziemniak",
    lacina: "Solanum tuberosum",
    aliasy: ["ziemniaki", "kartofel", "kartofle", "pyry"],
    kategoria: "Warzywa",
    ikona: "🥔",
    dawka: { N: 12, P: 8, K: 18 },
    bezChloru: true,
    opis: "Roślina o dużym zapotrzebowaniu na potas. Nadmiar azotu pogarsza smak i trwałość bulw.",
    gleba: { ph: "5,5–6,5", typ: "Lekka do średniej, przepuszczalna" },
    potrzeby: { N: 2, P: 2, K: 3 },
    nawozenie: [
      { termin: "Jesień / wczesna wiosna", zalecenie: "Obornik (nie świeży bezpośrednio przed sadzeniem), nawozy fosforowo-potasowe." },
      { termin: "Przed sadzeniem", zalecenie: "Azot w umiarkowanej dawce; potas najlepiej w formie siarczanowej." },
      { termin: "Wapnowanie", zalecenie: "Unikać wapnowania tuż przed sadzeniem – sprzyja parchowi zwykłemu." }
    ],
    naturalne: ["Obornik przekompostowany", "Nawozy zielone (np. łubin, gorczyca)"],
    problemy: [
      { nazwa: "Zaraza ziemniaka", typ: "choroba", objawy: "Brunatne plamy na liściach, gnicie bulw.", zapobieganie: "Zdrowe sadzeniaki, odmiany odporne, płodozmian.", srodki: "Fungicydy zarejestrowane przeciw zarazie ziemniaka." },
      { nazwa: "Stonka ziemniaczana", typ: "szkodnik", objawy: "Wyjedzone liście, pomarańczowe larwy i paskowane chrząszcze.", zapobieganie: "Ręczne zbieranie, sąsiedztwo aksamitek i kocimiętki.", srodki: "Insektycydy zarejestrowane przeciw stonce, preparaty biologiczne (np. na bazie Bacillus thuringiensis)." }
    ]
  },
  {
    id: "truskawka",
    nazwa: "Truskawka",
    lacina: "Fragaria × ananassa",
    aliasy: ["truskawki", "poziomka ogrodowa"],
    kategoria: "Owoce",
    ikona: "🍓",
    dawka: { N: 6, P: 5, K: 10 },
    bezChloru: true,
    opis: "Wymaga gleby lekko kwaśnej i umiarkowanego nawożenia – nadmiar azotu daje bujne liście i miękkie owoce.",
    gleba: { ph: "5,5–6,5", typ: "Próchniczna, przepuszczalna" },
    potrzeby: { N: 2, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed posadzeniem", zalecenie: "Kompost lub obornik, nawóz wieloskładnikowy bez chloru." },
      { termin: "Wczesna wiosna", zalecenie: "Nawóz NPK z mikroelementami po ruszeniu wegetacji." },
      { termin: "Po zbiorach", zalecenie: "Nawożenie potasowo-fosforowe – rośliny zawiązują wtedy pąki na kolejny rok." }
    ],
    naturalne: ["Kompost", "Ściółkowanie słomą (chroni owoce przed gniciem)"],
    problemy: [
      { nazwa: "Szara pleśń", typ: "choroba", objawy: "Szary, puszysty nalot na owocach.", zapobieganie: "Ściółkowanie słomą, przewiewne nasadzenia, usuwanie chorych owoców.", srodki: "Fungicydy zarejestrowane przeciw szarej pleśni w truskawce (zabiegi w czasie kwitnienia)." },
      { nazwa: "Roztocz truskawkowiec", typ: "szkodnik", objawy: "Drobne, pomarszczone, skarlałe liście sercowe.", zapobieganie: "Zdrowe sadzonki z pewnego źródła.", srodki: "Akarycydy zarejestrowane w truskawce." }
    ]
  },
  {
    id: "borowka",
    nazwa: "Borówka amerykańska",
    lacina: "Vaccinium corymbosum",
    aliasy: ["borówka", "borowka", "borówki"],
    kategoria: "Owoce",
    ikona: "🫐",
    dawka: { N: 5, P: 3, K: 6 },
    bezChloru: true,
    kwasolubna: true,
    opis: "Roślina kwasolubna – w glebie o zbyt wysokim pH żółknie i słabo rośnie mimo nawożenia.",
    gleba: { ph: "3,8–4,8", typ: "Kwaśna, próchniczna, z dodatkiem torfu" },
    potrzeby: { N: 2, P: 1, K: 2 },
    nawozenie: [
      { termin: "Przed sadzeniem", zalecenie: "Zakwaszenie podłoża kwaśnym torfem, korą sosnową lub siarką." },
      { termin: "Wiosna (w 2–3 dawkach)", zalecenie: "Specjalistyczne nawozy do roślin kwasolubnych; azot w formie amonowej (np. siarczan amonu)." },
      { termin: "Czego unikać", zalecenie: "Wapna, popiołu i nawozów zawierających chlor oraz azot azotanowy." }
    ],
    naturalne: ["Ściółka z kory sosnowej lub trocin", "Kompost z igliwia"],
    problemy: [
      { nazwa: "Chloroza (żółknięcie liści)", typ: "zaburzenie", objawy: "Żółte liście z zielonymi nerwami.", zapobieganie: "Utrzymywanie niskiego pH gleby.", srodki: "Zakwaszenie gleby, nawozy z chelatem żelaza." },
      { nazwa: "Zamieranie pędów", typ: "choroba", objawy: "Brunatnienie i zasychanie młodych pędów.", zapobieganie: "Wycinanie porażonych pędów, cięcie prześwietlające.", srodki: "Fungicydy zarejestrowane w borówce." }
    ]
  },
  {
    id: "jablon",
    nazwa: "Jabłoń",
    lacina: "Malus domestica",
    aliasy: ["jabłonie", "jablon", "jabłko", "jabłka"],
    kategoria: "Drzewa owocowe",
    ikona: "🍎",
    dawka: { N: 6, P: 3, K: 10 },
    opis: "Drzewo owocowe wymagające regularnego dokarmiania wapniem, który poprawia trwałość owoców.",
    gleba: { ph: "6,0–7,0", typ: "Żyzna, umiarkowanie wilgotna" },
    potrzeby: { N: 2, P: 1, K: 2 },
    nawozenie: [
      { termin: "Wczesna wiosna", zalecenie: "Nawóz wieloskładnikowy rozsypany w obrębie korony (nie przy samym pniu)." },
      { termin: "Lato", zalecenie: "Dolistne dokarmianie wapniem (zapobiega gorzkiej plamistości podskórnej)." },
      { termin: "Jesień", zalecenie: "Nawozy fosforowo-potasowe; bez azotu, by drewno zdrewniało przed zimą." }
    ],
    naturalne: ["Kompost pod koroną", "Obornik granulowany"],
    problemy: [
      { nazwa: "Parch jabłoni", typ: "choroba", objawy: "Oliwkowe, potem ciemne plamy na liściach i strupowate plamy na owocach.", zapobieganie: "Grabienie i usuwanie opadłych liści jesienią, odmiany odporne.", srodki: "Fungicydy zarejestrowane przeciw parchowi jabłoni." },
      { nazwa: "Owocówka jabłkóweczka", typ: "szkodnik", objawy: "Robaczywe owoce z chodnikami larw.", zapobieganie: "Opaski pułapkowe na pniach, pułapki feromonowe.", srodki: "Insektycydy zarejestrowane w jabłoni, preparaty wirusowe (biologiczne)." }
    ]
  },
  {
    id: "roza",
    nazwa: "Róża",
    lacina: "Rosa spp.",
    aliasy: ["róże", "roze", "roza"],
    kategoria: "Kwiaty",
    ikona: "🌹",
    dawka: { N: 8, P: 6, K: 10 },
    opis: "Krzew ozdobny lubiący żyzną glebę i regularne nawożenie w pierwszej połowie sezonu.",
    gleba: { ph: "6,0–6,5", typ: "Żyzna, gliniasto-próchniczna" },
    potrzeby: { N: 2, P: 2, K: 3 },
    nawozenie: [
      { termin: "Wiosna (po cięciu)", zalecenie: "Nawóz wieloskładnikowy do róż lub kompost." },
      { termin: "Przed kwitnieniem", zalecenie: "Nawóz z przewagą fosforu i potasu." },
      { termin: "Od sierpnia", zalecenie: "Tylko potas (np. siarczan potasu), bez azotu – poprawia zimotrwałość." }
    ],
    naturalne: ["Obornik przekompostowany", "Gnojówka z pokrzywy", "Skórki od bananów w kompoście"],
    problemy: [
      { nazwa: "Czarna plamistość", typ: "choroba", objawy: "Czarne plamy na liściach, żółknięcie i opadanie liści.", zapobieganie: "Usuwanie opadłych liści, podlewanie pod krzew.", srodki: "Fungicydy zarejestrowane w roślinach ozdobnych przeciw czarnej plamistości." },
      { nazwa: "Mączniak prawdziwy", typ: "choroba", objawy: "Biały, mączysty nalot na liściach i pąkach.", zapobieganie: "Przewiewne stanowisko, umiarkowane nawożenie azotem.", srodki: "Preparaty siarkowe lub inne fungicydy zarejestrowane przeciw mączniakowi." },
      { nazwa: "Mszyce", typ: "szkodnik", objawy: "Kolonie zielonych owadów na wierzchołkach pędów.", zapobieganie: "Biedronki, oprysk wodą z mydłem potasowym.", srodki: "Insektycydy zarejestrowane w roślinach ozdobnych." }
    ]
  },
  {
    id: "trawnik",
    nazwa: "Trawnik",
    lacina: "Poaceae",
    aliasy: ["trawa", "murawa"],
    kategoria: "Trawniki",
    ikona: "🌱",
    dawka: { N: 20, P: 5, K: 10 },
    opis: "Trawnik zużywa dużo azotu, bo jest regularnie koszony. Nawozy o spowolnionym działaniu dają równy kolor.",
    gleba: { ph: "5,5–7,0", typ: "Przepuszczalna, próchniczna" },
    potrzeby: { N: 3, P: 1, K: 2 },
    nawozenie: [
      { termin: "Wiosna (kwiecień)", zalecenie: "Nawóz do trawnika z przewagą azotu, najlepiej o spowolnionym działaniu." },
      { termin: "Lato", zalecenie: "Kolejna dawka nawozu wieloskładnikowego; przy upałach nawozić po deszczu lub podlaniu." },
      { termin: "Jesień (wrzesień)", zalecenie: "Nawóz jesienny z przewagą potasu i fosforu, z małą ilością azotu." }
    ],
    naturalne: ["Pozostawianie skoszonej trawy (mulczowanie)", "Przesiany kompost"],
    problemy: [
      { nazwa: "Mech", typ: "zaburzenie", objawy: "Zielone, miękkie kępy w miejscach zacienionych i wilgotnych.", zapobieganie: "Wertykulacja, regulacja pH (wapnowanie), napowietrzanie.", srodki: "Siarczan żelaza lub zarejestrowane preparaty przeciw mchom." },
      { nazwa: "Chwasty dwuliścienne", typ: "chwast", objawy: "Mniszek, koniczyna, babka w murawie.", zapobieganie: "Gęsta darń, regularne koszenie i nawożenie.", srodki: "Herbicydy selektywne zarejestrowane do stosowania na trawnikach." }
    ]
  },
  {
    id: "marchew",
    nazwa: "Marchew",
    lacina: "Daucus carota",
    aliasy: ["marchewka", "marchewki"],
    kategoria: "Warzywa",
    ikona: "🥕",
    dawka: { N: 8, P: 6, K: 18 },
    opis: "Nie lubi świeżego obornika – powoduje on rozwidlanie i gorszy smak korzeni.",
    gleba: { ph: "6,0–7,0", typ: "Lekka, głęboko spulchniona, bez kamieni" },
    potrzeby: { N: 1, P: 2, K: 3 },
    nawozenie: [
      { termin: "Rok wcześniej", zalecenie: "Obornik pod roślinę uprawianą przed marchwią (np. kapustę)." },
      { termin: "Przed siewem", zalecenie: "Nawozy fosforowo-potasowe, umiarkowana dawka azotu." },
      { termin: "W trakcie wzrostu", zalecenie: "Ewentualnie pogłówne nawożenie potasem." }
    ],
    naturalne: ["Dojrzały kompost", "Popiół drzewny (z umiarem)"],
    problemy: [
      { nazwa: "Połyśnica marchwianka", typ: "szkodnik", objawy: "Rdzawe chodniki w korzeniach, więdnięcie naci.", zapobieganie: "Siew na przemian z cebulą, agrowłóknina, wczesny lub późny siew.", srodki: "Insektycydy zarejestrowane w marchwi." },
      { nazwa: "Alternarioza", typ: "choroba", objawy: "Brązowe plamy i zasychanie naci.", zapobieganie: "Płodozmian, zdrowe nasiona.", srodki: "Fungicydy zarejestrowane w marchwi." }
    ]
  },
  {
    id: "papryka",
    nazwa: "Papryka",
    lacina: "Capsicum annuum",
    aliasy: ["papryki", "chili", "pieprzowiec"],
    kategoria: "Warzywa",
    ikona: "🫑",
    dawka: { N: 14, P: 8, K: 20 },
    bezChloru: true,
    opis: "Ciepłolubne warzywo o dużych potrzebach pokarmowych, wrażliwe na niedobór wapnia i magnezu.",
    gleba: { ph: "6,5–7,0", typ: "Ciepła, żyzna, próchniczna" },
    potrzeby: { N: 2, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed sadzeniem", zalecenie: "Kompost i nawóz wieloskładnikowy." },
      { termin: "Wzrost", zalecenie: "Umiarkowane dawki azotu co 2 tygodnie." },
      { termin: "Owocowanie", zalecenie: "Nawozy potasowe, dokarmianie wapniem i magnezem." }
    ],
    naturalne: ["Gnojówka z pokrzywy", "Kompost"],
    problemy: [
      { nazwa: "Mszyce", typ: "szkodnik", objawy: "Kolonie owadów na młodych liściach, zniekształcenia.", zapobieganie: "Biedronki, złotooki, mydło potasowe.", srodki: "Insektycydy zarejestrowane w papryce." },
      { nazwa: "Sucha zgnilizna wierzchołkowa", typ: "zaburzenie", objawy: "Wklęsłe, jasne plamy na owocach.", zapobieganie: "Równomierne podlewanie.", srodki: "Dolistne nawozy wapniowe." }
    ]
  },
  {
    id: "tuja",
    nazwa: "Tuja (żywotnik)",
    lacina: "Thuja occidentalis",
    aliasy: ["tuje", "tuja", "żywotnik", "zywotnik", "thuja"],
    kategoria: "Iglaki",
    ikona: "🌲",
    dawka: { N: 6, P: 3, K: 6 },
    opis: "Iglaki potrzebują magnezu i siarki – ich brak to częsta przyczyna brązowienia igieł.",
    gleba: { ph: "5,5–7,0", typ: "Wilgotna, próchniczna" },
    potrzeby: { N: 2, P: 1, K: 2 },
    nawozenie: [
      { termin: "Wiosna (kwiecień–maj)", zalecenie: "Nawóz do iglaków z magnezem." },
      { termin: "Czerwiec", zalecenie: "Druga, mniejsza dawka nawozu do iglaków." },
      { termin: "Wrzesień", zalecenie: "Nawóz jesienny bez azotu lub siarczan magnezu przy brązowieniu." }
    ],
    naturalne: ["Ściółka z kory", "Kompost"],
    problemy: [
      { nazwa: "Brązowienie igieł", typ: "zaburzenie", objawy: "Brązowe, zasychające fragmenty.", zapobieganie: "Podlewanie w suszy i przed zimą, nawożenie magnezem.", srodki: "Siarczan magnezu, przy chorobie grzybowej – fungicydy zarejestrowane w iglakach." },
      { nazwa: "Przędziorki", typ: "szkodnik", objawy: "Szarzenie i matowienie łusek, delikatna pajęczyna.", zapobieganie: "Zraszanie w czasie upałów.", srodki: "Akarycydy zarejestrowane w roślinach ozdobnych." }
    ]
  },
  {
    id: "pszenica",
    nazwa: "Pszenica ozima",
    lacina: "Triticum aestivum",
    aliasy: ["pszenica", "zboże", "zboza", "zboże ozime"],
    kategoria: "Rolnicze",
    ikona: "🌾",
    dawka: { N: 16, P: 7, K: 9 },
    opis: "Główne zboże w Polsce. Kluczowe jest dzielenie dawki azotu na kilka terminów.",
    gleba: { ph: "6,0–7,0", typ: "Średnie i ciężkie, żyzne" },
    potrzeby: { N: 3, P: 2, K: 2 },
    nawozenie: [
      { termin: "Przedsiewnie (jesień)", zalecenie: "Fosfor i potas zgodnie z zasobnością gleby (na podstawie analizy)." },
      { termin: "Start wegetacji wiosną", zalecenie: "Pierwsza dawka azotu (ok. 40–50% całej dawki)." },
      { termin: "Strzelanie w źdźbło / kłoszenie", zalecenie: "Druga i ewentualnie trzecia dawka azotu; dolistnie mikroelementy (miedź, mangan)." }
    ],
    naturalne: ["Obornik pod przedplon", "Poplony i przyorywanie słomy"],
    problemy: [
      { nazwa: "Choroby grzybowe (septorioza, rdze, mączniak)", typ: "choroba", objawy: "Plamy i naloty na liściach, przedwczesne zasychanie.", zapobieganie: "Płodozmian, odporne odmiany, zaprawianie nasion.", srodki: "Fungicydy zbożowe zarejestrowane w pszenicy – według progów szkodliwości." },
      { nazwa: "Chwasty", typ: "chwast", objawy: "Miotła zbożowa, przytulia i inne konkurujące z łanem.", zapobieganie: "Właściwa agrotechnika, terminowy siew.", srodki: "Herbicydy zarejestrowane w pszenicy ozimej (jesień lub wiosna)." }
    ]
  },
  {
    id: "kalafior",
    nazwa: "Kalafior",
    lacina: "Brassica oleracea var. botrytis",
    aliasy: ["kalafiory"],
    kategoria: "Warzywa",
    ikona: "🥦",
    dawka: { N: 20, P: 8, K: 20 },
    opis: "Najbardziej wymagające z warzyw kapustnych. Przy niedoborze boru i molibdenu tworzy małe, brązowiejące róże.",
    gleba: { ph: "6,5–7,5", typ: "Żyzna, próchniczna, stale wilgotna" },
    potrzeby: { N: 3, P: 2, K: 3 },
    nawozenie: [
      { termin: "Jesień przed uprawą", zalecenie: "Obornik (ok. 4–6 kg/m²); na glebach kwaśnych wapnowanie." },
      { termin: "Przed sadzeniem", zalecenie: "Nawóz wieloskładnikowy z borem; część azotu (ok. 2/3 dawki)." },
      { termin: "3–4 tygodnie po posadzeniu", zalecenie: "Pogłówne nawożenie azotem; dolistnie bor i molibden." }
    ],
    naturalne: ["Obornik", "Gnojówka z pokrzywy", "Kompost"],
    problemy: [
      { nazwa: "Kiła kapusty", typ: "choroba", objawy: "Narośla na korzeniach, więdnięcie roślin w ciepłe dni.", zapobieganie: "Wapnowanie (pH powyżej 7), 4–5-letnia przerwa w uprawie kapustnych, zdrowa rozsada.", srodki: "Brak skutecznych środków chemicznych – liczy się zapobieganie i odporne odmiany." },
      { nazwa: "Śmietka kapuściana", typ: "szkodnik", objawy: "Larwy żerujące w korzeniach, więdnięcie i zamieranie rozsady.", zapobieganie: "Krążki ochronne wokół szyjki korzeniowej, agrowłóknina.", srodki: "Insektycydy zarejestrowane w warzywach kapustnych." },
      { nazwa: "Bielinek i tantniś", typ: "szkodnik", objawy: "Wygryzione liście, gąsienice na spodzie liści.", zapobieganie: "Siatki ochronne, ręczne zbieranie gąsienic.", srodki: "Preparaty biologiczne (Bacillus thuringiensis) lub insektycydy zarejestrowane w kalafiorze." }
    ]
  },
  {
    id: "brokul",
    nazwa: "Brokuł",
    lacina: "Brassica oleracea var. italica",
    aliasy: ["brokuły", "brokul", "brokuly"],
    kategoria: "Warzywa",
    ikona: "🥦",
    dawka: { N: 18, P: 8, K: 18 },
    opis: "Mniej wymagający niż kalafior, ale również potrzebuje boru i regularnego podlewania.",
    gleba: { ph: "6,5–7,5", typ: "Żyzna, próchniczna, wilgotna" },
    potrzeby: { N: 3, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed sadzeniem", zalecenie: "Kompost lub obornik, nawóz wieloskładnikowy z borem." },
      { termin: "Wzrost", zalecenie: "Pogłównie azot 3–4 tygodnie po posadzeniu." },
      { termin: "Po ścięciu głównej róży", zalecenie: "Niewielka dawka azotu pobudza wyrastanie róż bocznych." }
    ],
    naturalne: ["Kompost", "Gnojówka z pokrzywy"],
    problemy: [
      { nazwa: "Kiła kapusty", typ: "choroba", objawy: "Narośla na korzeniach, więdnięcie.", zapobieganie: "Wapnowanie, płodozmian, zdrowa rozsada.", srodki: "Brak skutecznych środków chemicznych – liczy się zapobieganie." },
      { nazwa: "Mszyca kapuściana", typ: "szkodnik", objawy: "Szare, woskowe kolonie na liściach i różach.", zapobieganie: "Biedronki, złotooki, oprysk mydłem potasowym.", srodki: "Insektycydy zarejestrowane w brokule." }
    ]
  },
  {
    id: "kapusta",
    nazwa: "Kapusta głowiasta",
    lacina: "Brassica oleracea var. capitata",
    aliasy: ["kapusta", "kapusty", "kapusta biała", "kapusta czerwona"],
    kategoria: "Warzywa",
    ikona: "🥬",
    dawka: { N: 22, P: 10, K: 25 },
    opis: "Odmiany późne mają bardzo duże potrzeby pokarmowe. Dobrze reagują na obornik.",
    gleba: { ph: "6,5–7,5", typ: "Żyzna, zwięzła, zasobna w próchnicę" },
    potrzeby: { N: 3, P: 2, K: 3 },
    nawozenie: [
      { termin: "Jesień przed uprawą", zalecenie: "Obornik (ok. 4–6 kg/m²) – kapustę uprawia się w pierwszym roku po oborniku." },
      { termin: "Przed sadzeniem", zalecenie: "Fosfor, potas i ok. połowa dawki azotu." },
      { termin: "Wzrost (1–2 razy)", zalecenie: "Pogłówne dawki azotu; ostatnia najpóźniej 4–6 tygodni przed zbiorem (azotany!)." }
    ],
    naturalne: ["Obornik", "Kompost", "Gnojówka z pokrzywy"],
    problemy: [
      { nazwa: "Kiła kapusty", typ: "choroba", objawy: "Narośla na korzeniach, rośliny karłowacieją.", zapobieganie: "Wapnowanie, 4–5-letnia przerwa w uprawie kapustnych.", srodki: "Brak skutecznych środków chemicznych – liczy się zapobieganie." },
      { nazwa: "Bielinek kapustnik", typ: "szkodnik", objawy: "Duże dziury w liściach, żółto-zielone gąsienice.", zapobieganie: "Siatki ochronne, sąsiedztwo selera i pomidora.", srodki: "Preparaty biologiczne (Bacillus thuringiensis) lub insektycydy zarejestrowane w kapuście." },
      { nazwa: "Pchełki", typ: "szkodnik", objawy: "Drobne, okrągłe dziurki w liściach młodych roślin.", zapobieganie: "Utrzymywanie wilgotnej gleby, agrowłóknina.", srodki: "Insektycydy zarejestrowane w kapuście." }
    ]
  },
  {
    id: "zyto",
    nazwa: "Żyto ozime",
    lacina: "Secale cereale",
    aliasy: ["żyto", "zyto", "zboże", "zboza"],
    kategoria: "Rolnicze",
    ikona: "🌾",
    dawka: { N: 9, P: 6, K: 8 },
    opis: "Najmniej wymagające zboże – dobrze znosi lekkie i kwaśne gleby. Nadmiar azotu powoduje wyleganie.",
    gleba: { ph: "5,0–6,5", typ: "Lekka, piaszczysta do średniej" },
    potrzeby: { N: 2, P: 1, K: 2 },
    nawozenie: [
      { termin: "Przedsiewnie (jesień)", zalecenie: "Fosfor i potas według zasobności gleby; azot jesienią zwykle zbędny." },
      { termin: "Start wegetacji wiosną", zalecenie: "Pierwsza dawka azotu (ok. 60% całej dawki)." },
      { termin: "Strzelanie w źdźbło", zalecenie: "Druga dawka azotu; w razie potrzeby regulator przeciw wyleganiu." }
    ],
    naturalne: ["Obornik pod przedplon", "Przyorywanie słomy", "Poplony"],
    problemy: [
      { nazwa: "Rdza brunatna", typ: "choroba", objawy: "Rdzawobrązowe skupienia zarodników na liściach.", zapobieganie: "Odmiany odporne, niszczenie samosiewów, umiarkowane nawożenie azotem.", srodki: "Fungicydy zarejestrowane w życie – według progów szkodliwości." },
      { nazwa: "Sporysz", typ: "choroba", objawy: "Ciemnofioletowe, rożkowate twory w kłosach (trujące!).", zapobieganie: "Kwalifikowany materiał siewny, głęboka orka, koszenie traw na miedzach.", srodki: "Czyszczenie ziarna; brak skutecznej ochrony chemicznej w kłosie." }
    ]
  },
  {
    id: "jeczmien",
    nazwa: "Jęczmień jary",
    lacina: "Hordeum vulgare",
    aliasy: ["jęczmień", "jeczmien", "jęczmień ozimy", "zboże", "zboza", "browarny"],
    kategoria: "Rolnicze",
    ikona: "🌾",
    dawka: { N: 8, P: 6, K: 9 },
    opis: "Bardzo wrażliwy na kwaśny odczyn gleby. Jęczmień browarny nawozi się azotem oszczędniej niż paszowy.",
    gleba: { ph: "6,0–7,0", typ: "Średnia, żyzna, nie kwaśna" },
    potrzeby: { N: 2, P: 2, K: 2 },
    nawozenie: [
      { termin: "Jesień / wczesna wiosna", zalecenie: "Wapnowanie przy pH poniżej 6; fosfor i potas według zasobności." },
      { termin: "Przed siewem", zalecenie: "Większość dawki azotu (jęczmień jary ma krótki okres wegetacji)." },
      { termin: "Krzewienie", zalecenie: "Ewentualnie uzupełniająca dawka azotu (nie dla jęczmienia browarnego)." }
    ],
    naturalne: ["Obornik pod przedplon", "Poplony"],
    problemy: [
      { nazwa: "Plamistość siatkowa", typ: "choroba", objawy: "Brunatne plamy z siateczką ciemnych linii na liściach.", zapobieganie: "Płodozmian, przyorywanie resztek, zaprawianie nasion.", srodki: "Fungicydy zarejestrowane w jęczmieniu." },
      { nazwa: "Mączniak prawdziwy", typ: "choroba", objawy: "Biały, watowaty nalot na liściach.", zapobieganie: "Odmiany odporne, zrównoważone nawożenie azotem.", srodki: "Fungicydy zarejestrowane w jęczmieniu." }
    ]
  },
  {
    id: "kukurydza",
    nazwa: "Kukurydza",
    lacina: "Zea mays",
    aliasy: ["kukurydza na ziarno", "kukurydza na kiszonkę", "kolby"],
    kategoria: "Rolnicze",
    ikona: "🌽",
    dawka: { N: 15, P: 8, K: 12 },
    opis: "Roślina ciepłolubna o dużych potrzebach pokarmowych. Wrażliwa na niedobór cynku i fosforu na starcie.",
    gleba: { ph: "6,0–7,0", typ: "Żyzna, ciepła, przewiewna" },
    potrzeby: { N: 3, P: 2, K: 3 },
    nawozenie: [
      { termin: "Jesień / przedsiewnie", zalecenie: "Obornik lub gnojowica; fosfor i potas według zasobności." },
      { termin: "Siew", zalecenie: "Nawożenie zlokalizowane (np. fosforan amonu pod nasiona) – dobry start w chłodną wiosnę." },
      { termin: "Faza 4–8 liści", zalecenie: "Pogłówna dawka azotu; dolistnie cynk i magnez." }
    ],
    naturalne: ["Obornik", "Gnojowica", "Poplony"],
    problemy: [
      { nazwa: "Omacnica prosowianka", typ: "szkodnik", objawy: "Złamane wiechy i łodygi, otwory z trocinkami.", zapobieganie: "Rozdrabnianie resztek pożniwnych i głęboka orka, kruszynek (biologicznie).", srodki: "Insektycydy zarejestrowane w kukurydzy – w terminie wylęgu gąsienic." },
      { nazwa: "Głownia guzowata", typ: "choroba", objawy: "Duże, białoszare guzy wypełnione czarnym pyłem.", zapobieganie: "Płodozmian, unikanie uszkodzeń roślin, odmiany odporne.", srodki: "Brak skutecznej ochrony chemicznej – zapobieganie." },
      { nazwa: "Chwasty", typ: "chwast", objawy: "Silne zachwaszczenie w pierwszych tygodniach (kukurydza rośnie wolno).", zapobieganie: "Terminowy siew, mechaniczne pielenie międzyrzędzi.", srodki: "Herbicydy zarejestrowane w kukurydzy." }
    ]
  },
  {
    id: "soja",
    nazwa: "Soja",
    lacina: "Glycine max",
    aliasy: ["soi", "soję", "soje", "bobowate", "strączkowe"],
    kategoria: "Rolnicze",
    ikona: "🫘",
    dawka: { N: 3, P: 6, K: 9 },
    opis: "Roślina bobowata – sama wiąże azot z powietrza dzięki bakteriom brodawkowym, więc azotu potrzebuje bardzo mało.",
    gleba: { ph: "6,0–7,0", typ: "Ciepła, średnia, przepuszczalna" },
    potrzeby: { N: 1, P: 2, K: 3 },
    nawozenie: [
      { termin: "Przed siewem", zalecenie: "Fosfor i potas według zasobności; ewentualnie mała, startowa dawka azotu." },
      { termin: "Siew", zalecenie: "Szczepienie nasion bakteriami Bradyrhizobium japonicum (szczepionka) – kluczowe na polach bez historii soi." },
      { termin: "Wzrost", zalecenie: "Dolistnie molibden, bor i magnez; azotu nie dodawać – hamuje brodawkowanie." }
    ],
    naturalne: ["Szczepionka bakteryjna", "Kompost (w ogrodzie)"],
    problemy: [
      { nazwa: "Zgnilizna twardzikowa", typ: "choroba", objawy: "Biała grzybnia i czarne sklerocja na łodygach, więdnięcie.", zapobieganie: "Płodozmian (nie po rzepaku i słoneczniku), przewiewny łan.", srodki: "Fungicydy zarejestrowane w soi, preparaty biologiczne." },
      { nazwa: "Chwasty", typ: "chwast", objawy: "Silne zachwaszczenie na początku wzrostu.", zapobieganie: "Pielenie mechaniczne, odpowiednia rozstawa rzędów.", srodki: "Herbicydy zarejestrowane w soi." }
    ]
  }
];
