// Kalendarz prac – terminy orientacyjne dla klimatu Polski (środek kraju).
// Na północy i wschodzie prace wiosenne zwykle o 1–2 tygodnie później, na zachodzie i południu wcześniej.
//
// Każdy wpis: [miesiące (1–12), typ, opis]
// Typy: "siew" (siew i sadzenie), "nawozenie", "ochrona", "pielegnacja", "zbior"

const TYPY_PRAC = {
  siew:        { nazwa: "Siew i sadzenie", ikona: "🌱" },
  nawozenie:   { nazwa: "Nawożenie", ikona: "🧪" },
  ochrona:     { nazwa: "Ochrona", ikona: "🛡️" },
  pielegnacja: { nazwa: "Pielęgnacja", ikona: "✂️" },
  zbior:       { nazwa: "Zbiór", ikona: "🧺" }
};

const MIESIACE = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
  "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
const MIESIACE_KROTKO = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

// Prace ogólne – dotyczą całego ogrodu lub pola.
const KALENDARZ_OGOLNY = [
  [[1], "pielegnacja", "Zaplanuj płodozmian: zapisz, co gdzie rosło – kapustne, psiankowate i dyniowate nie powinny wracać na to samo miejsce przez 3–4 lata."],
  [[1, 2], "siew", "Zamów nasiona i sprawdź zapasy z zeszłego roku (test kiełkowania na mokrym ręczniku papierowym)."],
  [[2], "pielegnacja", "Przejrzyj i naostrz narzędzia, przygotuj doniczki i podłoże do rozsady."],
  [[3, 4], "nawozenie", "Pobierz próbki gleby do badania (pH, fosfor, potas) – zanim zaczniesz nawozić."],
  [[4], "pielegnacja", "Usuń zimowe okrycia roślin, gdy miną silne przymrozki; rozluźnij glebę na grządkach."],
  [[5], "ochrona", "Zimni ogrodnicy (12–15 maja): ciepłolubne warzywa sadź do gruntu dopiero po tym terminie lub przykryj agrowłókniną."],
  [[6, 7, 8], "pielegnacja", "Podlewaj rano lub wieczorem, pod korzeń. Ściółkuj grządki – mniej podlewania i chwastów."],
  [[8], "nawozenie", "Od połowy sierpnia nie nawoź azotem roślin wieloletnich (drzewa, krzewy, róże) – pędy muszą zdrewnieć przed zimą."],
  [[9, 10], "nawozenie", "Jesienne nawożenie fosforem i potasem pod przyszły sezon; najlepszy czas na badanie gleby po zbiorach."],
  [[10, 11], "nawozenie", "Rozrzuć obornik i od razu przekop lub przyoraj. Wapnuj osobno – nie razem z obornikiem."],
  [[10, 11], "pielegnacja", "Zbierz chore resztki roślin (nie na kompost!), zdrowe kompostuj."],
  [[11], "pielegnacja", "Obficie podlej zimozielone rośliny (iglaki, różaneczniki) przed zamarznięciem gleby."],
  [[12], "pielegnacja", "Zapisz, co się udało, a co nie – to najlepsza podstawa planu na kolejny rok. W gospodarstwach: okres zakazu stosowania nawozów naturalnych."]
];

const KALENDARZ = {
  pomidor: [
    [[3], "siew", "Siew na rozsadę w domu (ok. 8 tygodni przed sadzeniem do gruntu)."],
    [[4], "pielegnacja", "Pikowanie siewek do doniczek; pod koniec miesiąca zacznij hartowanie rozsady na zewnątrz."],
    [[5], "siew", "Sadzenie do gruntu po 15 maja (pod osłony wcześniej). Palik od razu przy sadzeniu."],
    [[5], "nawozenie", "Przed sadzeniem: kompost lub obornik i nawóz wieloskładnikowy."],
    [[6], "nawozenie", "Po przyjęciu się rozsady – umiarkowana dawka azotu."],
    [[6, 7, 8], "pielegnacja", "Wiązanie do palików i usuwanie pędów bocznych (wilków) co tydzień."],
    [[6, 7, 8], "ochrona", "Zapobiegaj zarazie: podlewaj pod korzeń, usuwaj dolne liście, przy deszczowej pogodzie oprysk zapobiegawczy."],
    [[7, 8], "nawozenie", "Nawozy z przewagą potasu co 10–14 dni; wapń przeciw suchej zgniliźnie wierzchołkowej."],
    [[7, 8, 9], "zbior", "Zbiór dojrzałych owoców co 2–3 dni."],
    [[8], "pielegnacja", "Pod koniec sierpnia ogłów pędy (uszczknij wierzchołek), żeby dojrzały już zawiązane owoce."],
    [[9], "zbior", "Przed przymrozkami zbierz zielone owoce – dojrzeją w domu."],
    [[10], "pielegnacja", "Usuń resztki roślin; porażone zarazą nie na kompost."]
  ],
  ogorek: [
    [[4], "siew", "Siew na rozsadę pod koniec kwietnia (do doniczek – ogórki nie lubią przesadzania)."],
    [[5], "siew", "Siew do gruntu lub sadzenie rozsady po 15 maja, gdy gleba ma min. 12°C."],
    [[5], "nawozenie", "Przed siewem: kompost lub obornik i nawóz wieloskładnikowy."],
    [[6, 7], "nawozenie", "Małe dawki nawozu co 7–10 dni; od owocowania więcej potasu i magnezu."],
    [[6], "pielegnacja", "Ściółkowanie grządki (słoma, skoszona trawa) – ogórki mają płytkie korzenie."],
    [[7, 8], "ochrona", "Obserwuj liście – mączniak rzekomy pojawia się przy chłodnych nocach i rosie."],
    [[7, 8], "zbior", "Zbiór co 1–2 dni – częsty zbiór pobudza zawiązywanie nowych owoców."],
    [[9], "pielegnacja", "Usuń rośliny po zakończeniu owocowania."]
  ],
  ziemniak: [
    [[3], "siew", "Podkiełkowywanie sadzeniaków w jasnym, chłodnym miejscu (3–4 tygodnie)."],
    [[4], "siew", "Sadzenie od połowy kwietnia do początku maja."],
    [[4], "nawozenie", "Przed sadzeniem umiarkowana dawka azotu; potas najlepiej siarczanowy."],
    [[5, 6], "pielegnacja", "Obsypywanie roślin ziemią 2–3 razy – więcej bulw i ochrona przed przymrozkiem."],
    [[5, 6, 7], "ochrona", "Stonka ziemniaczana: przeglądaj rośliny i zbieraj chrząszcze oraz larwy."],
    [[6, 7, 8], "ochrona", "Zaraza ziemniaka – przy ciepłej i wilgotnej pogodzie zabiegi zapobiegawcze."],
    [[7], "zbior", "Zbiór odmian wczesnych."],
    [[8, 9], "zbior", "Zbiór odmian średnich i późnych, gdy łęty zaschną; przesusz bulwy przed przechowaniem."],
    [[10, 11], "nawozenie", "Obornik i nawozy fosforowo-potasowe jesienią pod przyszłoroczną uprawę."]
  ],
  truskawka: [
    [[3, 4], "pielegnacja", "Wiosenne porządki: usuń zaschnięte liście i chwasty."],
    [[4], "nawozenie", "Nawóz wieloskładnikowy (bez chloru) po ruszeniu wegetacji."],
    [[5], "pielegnacja", "Ściółkowanie słomą przed kwitnieniem – czyste owoce i mniej szarej pleśni."],
    [[5], "ochrona", "W czasie kwitnienia ochrona przed szarą pleśnią."],
    [[6, 7], "zbior", "Zbiór owoców co 2 dni, najlepiej rano."],
    [[7], "pielegnacja", "Po zbiorach: skoś stare liście, usuń zbędne rozłogi."],
    [[7, 8], "nawozenie", "Po zbiorach nawożenie potasowo-fosforowe – rośliny zawiązują pąki na kolejny rok."],
    [[8], "siew", "Zakładanie nowej plantacji (sadzonki z rozłogów) – najlepszy termin."],
    [[11, 12], "pielegnacja", "Przy mroźnej, bezśnieżnej zimie przykryj rośliny stroiszem lub agrowłókniną."]
  ],
  borowka: [
    [[3], "pielegnacja", "Cięcie prześwietlające: usuń pędy starsze niż 4–5 lat i krzyżujące się."],
    [[4], "nawozenie", "1. dawka nawozu do roślin kwasolubnych (np. siarczan amonu)."],
    [[4], "pielegnacja", "Uzupełnij ściółkę z kory sosnowej lub trocin."],
    [[5], "nawozenie", "2. dawka nawozu."],
    [[6], "nawozenie", "3. dawka nawozu – ostatnia, najpóźniej do końca czerwca. Sprawdź pH gleby."],
    [[7, 8], "zbior", "Zbiór owoców co kilka dni; podlewaj obficie w czasie suszy."],
    [[9, 10], "siew", "Sadzenie nowych krzewów w zakwaszone podłoże."]
  ],
  jablon: [
    [[2, 3], "pielegnacja", "Cięcie zimowe (przy temperaturze powyżej −5°C)."],
    [[3], "ochrona", "Na pękające pąki oprysk preparatem miedziowym przeciw parchowi."],
    [[3, 4], "nawozenie", "Nawóz wieloskładnikowy rozsypany w obrębie korony."],
    [[4, 5], "ochrona", "Ochrona przed parchem w okresie kwitnienia; obserwuj mszyce."],
    [[6], "pielegnacja", "Przerzedzanie zawiązków przy dużym zawiązaniu owoców."],
    [[6, 7], "ochrona", "Opaski pułapkowe na pniach i pułapki feromonowe na owocówkę."],
    [[7, 8], "nawozenie", "Dolistne dokarmianie wapniem – trwalsze owoce."],
    [[8, 9, 10], "zbior", "Zbiór: odmiany letnie w sierpniu, jesienne i zimowe we wrześniu–październiku."],
    [[9], "nawozenie", "Nawożenie fosforowo-potasowe, bez azotu."],
    [[10, 11], "ochrona", "Zgrab i usuń opadłe liście – zimuje na nich parch."],
    [[10, 11], "siew", "Sadzenie nowych drzewek."],
    [[11], "pielegnacja", "Bielenie pni i osłonki przed zającami."]
  ],
  roza: [
    [[3, 4], "pielegnacja", "Zdejmij okrycie zimowe i rozgarnij kopczyki."],
    [[4], "pielegnacja", "Cięcie wiosenne, gdy kwitnie forsycja."],
    [[4], "nawozenie", "Po cięciu nawóz do róż lub kompost."],
    [[4, 10], "siew", "Sadzenie róż (wiosną lub jesienią)."],
    [[5, 6], "ochrona", "Obserwuj mszyce, czarną plamistość i mączniaka."],
    [[6], "nawozenie", "Przed kwitnieniem nawóz z przewagą fosforu i potasu."],
    [[6, 7, 8], "pielegnacja", "Usuwanie przekwitłych kwiatów – pobudza kolejne kwitnienie."],
    [[8], "nawozenie", "Od sierpnia tylko potas (np. siarczan potasu), bez azotu."],
    [[10], "ochrona", "Usuń opadłe liście z plamami."],
    [[11], "pielegnacja", "Kopczykowanie podstawy krzewów ziemią lub korą przed mrozami."]
  ],
  trawnik: [
    [[3, 4], "pielegnacja", "Grabienie, a pod koniec marca lub w kwietniu wertykulacja."],
    [[4], "nawozenie", "Nawóz wiosenny z przewagą azotu."],
    [[4, 5], "siew", "Dosiewanie łysych miejsc."],
    [[4, 5, 6, 7, 8, 9, 10], "pielegnacja", "Regularne koszenie – ścinaj najwyżej 1/3 wysokości trawy; w upały koś wyżej."],
    [[5, 6], "ochrona", "Usuwanie chwastów dwuliściennych (mniszek, babka)."],
    [[6], "nawozenie", "Nawóz letni – po deszczu lub podlaniu."],
    [[8, 9], "siew", "Zakładanie nowego trawnika – najlepszy termin w roku."],
    [[9], "nawozenie", "Nawóz jesienny z przewagą potasu i fosforu."],
    [[9, 10], "pielegnacja", "Aeracja i grabienie opadłych liści."]
  ],
  marchew: [
    [[3, 4], "siew", "Wczesny siew, gdy tylko da się uprawić glebę."],
    [[4], "nawozenie", "Przed siewem nawozy fosforowo-potasowe; bez świeżego obornika."],
    [[5, 6], "pielegnacja", "Przerywka i pielenie."],
    [[5, 6], "ochrona", "Agrowłóknina lub siew obok cebuli – ochrona przed połyśnicą marchwianką."],
    [[6], "siew", "Drugi siew – marchew na przechowanie."],
    [[7, 8], "ochrona", "Drugie pokolenie połyśnicy – utrzymuj osłony."],
    [[7], "zbior", "Zbiór marchwi wczesnej."],
    [[9, 10], "zbior", "Zbiór marchwi na przechowanie przed mrozami."]
  ],
  papryka: [
    [[2, 3], "siew", "Siew na rozsadę (papryka rośnie wolno)."],
    [[3, 4], "pielegnacja", "Pikowanie siewek; pod koniec kwietnia hartowanie."],
    [[5], "siew", "Sadzenie do gruntu po 20 maja (pod osłony wcześniej)."],
    [[5], "nawozenie", "Przed sadzeniem kompost i nawóz wieloskładnikowy."],
    [[6], "nawozenie", "Umiarkowane dawki azotu co 2 tygodnie."],
    [[6, 7], "ochrona", "Obserwuj mszyce na młodych liściach."],
    [[7, 8], "nawozenie", "Nawozy potasowe; dokarmianie wapniem i magnezem."],
    [[7, 8, 9], "zbior", "Zbiór owoców – zielone lub po wybarwieniu; ostatni przed przymrozkami."]
  ],
  tuja: [
    [[4], "nawozenie", "Nawóz do iglaków z magnezem."],
    [[4, 9], "siew", "Sadzenie (wiosną lub wczesną jesienią)."],
    [[5, 6], "pielegnacja", "Pierwsze cięcie żywopłotu."],
    [[6], "nawozenie", "Druga, mniejsza dawka nawozu do iglaków."],
    [[6, 7, 8], "ochrona", "Przy upałach zraszaj rośliny – ochrona przed przędziorkami; podlewaj w suszy."],
    [[8], "pielegnacja", "Drugie cięcie żywopłotu (do końca sierpnia)."],
    [[9], "nawozenie", "Nawóz jesienny bez azotu lub siarczan magnezu przy brązowieniu."],
    [[11], "pielegnacja", "Obfite podlanie przed zamarznięciem gleby – chroni przed zimowym brązowieniem."]
  ],
  pszenica: [
    [[3], "nawozenie", "Start wegetacji: pierwsza dawka azotu (ok. 40–50% całej dawki)."],
    [[4], "nawozenie", "Druga dawka azotu w fazie strzelania w źdźbło."],
    [[4], "ochrona", "Wiosenne odchwaszczanie i pierwszy zabieg fungicydowy (T1) – według progów szkodliwości."],
    [[5], "ochrona", "Ochrona liścia flagowego (T2)."],
    [[5], "nawozenie", "Ewentualnie trzecia dawka azotu; dolistnie mikroelementy."],
    [[6], "ochrona", "Ochrona kłosa przed fuzariozą (T3)."],
    [[7, 8], "zbior", "Zbiór od końca lipca, przy wilgotności ziarna ok. 14–15%."],
    [[8], "pielegnacja", "Uprawa pożniwna i przygotowanie stanowiska."],
    [[9], "nawozenie", "Nawożenie fosforowo-potasowe przed siewem (według badania gleby)."],
    [[9, 10], "siew", "Siew od ok. 20 września do połowy października."],
    [[10], "ochrona", "Jesienne odchwaszczanie."]
  ],
  zyto: [
    [[3], "nawozenie", "Pierwsza dawka azotu na start wegetacji (ok. 60%)."],
    [[4], "nawozenie", "Druga dawka azotu."],
    [[4], "ochrona", "W razie potrzeby regulator przeciw wyleganiu."],
    [[5], "ochrona", "Obserwuj rdzę brunatną – zabieg według progów."],
    [[7], "zbior", "Zbiór w lipcu."],
    [[9], "nawozenie", "Nawożenie fosforowo-potasowe przedsiewnie."],
    [[9], "siew", "Siew od połowy do końca września."],
    [[10], "ochrona", "Jesienne odchwaszczanie."]
  ],
  jeczmien: [
    [[3, 4], "siew", "Siew jak najwcześniej – od połowy marca do początku kwietnia."],
    [[3], "nawozenie", "Większość dawki azotu przed siewem."],
    [[4, 5], "ochrona", "Odchwaszczanie, później ochrona przed plamistością siatkową i mączniakiem."],
    [[5], "nawozenie", "Ewentualna dawka uzupełniająca (nie dla jęczmienia browarnego)."],
    [[7], "zbior", "Zbiór pod koniec lipca."],
    [[10, 11], "nawozenie", "Wapnowanie i nawożenie fosforowo-potasowe pod przyszłoroczny siew."]
  ],
  kukurydza: [
    [[4], "nawozenie", "Obornik lub gnojowica i nawożenie fosforowo-potasowe przedsiewnie."],
    [[4, 5], "siew", "Siew, gdy gleba ma 8–10°C (zwykle od końca kwietnia do połowy maja)."],
    [[5], "nawozenie", "Nawożenie zlokalizowane przy siewie (np. fosforan amonu)."],
    [[5, 6], "ochrona", "Odchwaszczanie – kukurydza wolno rośnie na początku."],
    [[6], "nawozenie", "W fazie 4–8 liści pogłówny azot; dolistnie cynk i magnez."],
    [[7], "ochrona", "Omacnica prosowianka – zabieg w terminie wylęgu gąsienic."],
    [[8, 9], "zbior", "Zbiór na kiszonkę (koniec sierpnia–wrzesień)."],
    [[10, 11], "zbior", "Zbiór na ziarno."],
    [[10, 11], "ochrona", "Rozdrobnij resztki pożniwne i przyoraj – ogranicza omacnicę."]
  ],
  soja: [
    [[4], "nawozenie", "Fosfor i potas według zasobności gleby; azotu nie trzeba."],
    [[5], "siew", "Siew, gdy gleba ma ok. 10°C. Nasiona zaszczep bakteriami tuż przed siewem."],
    [[5, 6], "ochrona", "Odchwaszczanie (soja słabo konkuruje z chwastami)."],
    [[7], "nawozenie", "Dolistnie molibden, bor i magnez."],
    [[7], "ochrona", "W czasie kwitnienia obserwuj zgniliznę twardzikową."],
    [[9, 10], "zbior", "Zbiór, gdy strąki brązowieją i grzechoczą."]
  ],
  kalafior: [
    [[3], "siew", "Siew na rozsadę odmian wczesnych."],
    [[4, 5], "siew", "Sadzenie rozsady do gruntu."],
    [[4], "nawozenie", "Przed sadzeniem nawóz wieloskładnikowy z borem."],
    [[5, 6], "nawozenie", "Pogłówny azot 3–4 tygodnie po posadzeniu; dolistnie bor i molibden."],
    [[5], "ochrona", "Krążki ochronne lub agrowłóknina przeciw śmietce kapuścianej."],
    [[6], "siew", "Sadzenie odmian na zbiór jesienny."],
    [[6, 7], "zbior", "Zbiór odmian wczesnych."],
    [[7, 8], "pielegnacja", "Złam kilka liści nad różą – chroni ją przed słońcem (pozostaje biała)."],
    [[7, 8], "ochrona", "Bielinek i tantniś – przeglądaj spody liści."],
    [[9, 10], "zbior", "Zbiór odmian jesiennych."]
  ],
  brokul: [
    [[3, 4], "siew", "Siew na rozsadę."],
    [[4, 5], "siew", "Sadzenie rozsady."],
    [[4], "nawozenie", "Przed sadzeniem kompost i nawóz wieloskładnikowy z borem."],
    [[5, 6], "nawozenie", "Pogłówny azot 3–4 tygodnie po posadzeniu."],
    [[6, 7], "zbior", "Zbiór głównej róży, potem różyczek bocznych."],
    [[6], "siew", "Sadzenie brokułów na zbiór jesienny."],
    [[7, 8], "ochrona", "Mszyca kapuściana i bielinek."],
    [[9, 10], "zbior", "Zbiór jesienny."]
  ],
  kapusta: [
    [[3], "siew", "Siew na rozsadę kapusty wczesnej."],
    [[4], "siew", "Sadzenie kapusty wczesnej."],
    [[5, 6], "siew", "Sadzenie kapusty średniej i późnej."],
    [[5], "nawozenie", "Przed sadzeniem fosfor, potas i połowa dawki azotu."],
    [[5, 6], "ochrona", "Pchełki na młodych roślinach – utrzymuj wilgotną glebę, agrowłóknina."],
    [[6, 7], "nawozenie", "Pogłówny azot; ostatnia dawka 4–6 tygodni przed zbiorem."],
    [[7, 8], "ochrona", "Bielinek kapustnik i mszyce – przeglądaj liście."],
    [[6, 7], "zbior", "Zbiór kapusty wczesnej."],
    [[10], "zbior", "Zbiór kapusty późnej przed silnymi mrozami."],
    [[11], "nawozenie", "Obornik na stanowisko pod przyszłoroczne kapustne."]
  ]
};
