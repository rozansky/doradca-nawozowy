// ===== Strona poradnika: pH gleby (#ph lub #ph/pomidor) =====

// Klasyfikacja odczynu gleby (pH w KCl), stosowana w Polsce.
const KLASY_PH = [
  { do: 4.5, nazwa: "bardzo kwaśna", kolor: "#d9534f" },
  { do: 5.5, nazwa: "kwaśna", kolor: "#e8913a" },
  { do: 6.5, nazwa: "lekko kwaśna", kolor: "#d6c13a" },
  { do: 7.2, nazwa: "obojętna", kolor: "#5cb85c" },
  { do: 99, nazwa: "zasadowa", kolor: "#4a8fd4" }
];
const PH_MIN = 3.5, PH_MAX = 8.5;

function klasaPh(ph) {
  return KLASY_PH.find((k) => ph <= k.do);
}

function pozycjaPh(ph) {
  return ((Math.min(Math.max(ph, PH_MIN), PH_MAX) - PH_MIN) / (PH_MAX - PH_MIN)) * 100;
}

// Ocena wyniku pH dla rośliny – używana w szybkim sprawdzeniu na stronie.
function ocenaPhDlaRosliny(ph, r) {
  const { min, max } = zakresPh(r);
  const klasa = klasaPh(ph);
  if (ph < min - 0.05) {
    return { ok: false, tekst: `Gleba jest <b>${klasa.nazwa}</b> – za kwaśna dla rośliny ${r.nazwa} (optymalnie ${r.gleba.ph}). ${r.kwasolubna ? "" : "Rozważ wapnowanie – patrz niżej."}` };
  }
  if (ph > max + 0.05) {
    return { ok: false, tekst: `Gleba jest <b>${klasa.nazwa}</b> – za mało kwaśna dla rośliny ${r.nazwa} (optymalnie ${r.gleba.ph}). ${r.kwasolubna ? "Trzeba ją zakwasić – patrz niżej." : "Nie wapnuj; stosuj nawozy zakwaszające."}` };
  }
  return { ok: true, tekst: `Gleba jest <b>${klasa.nazwa}</b> – pH mieści się w zakresie optymalnym dla rośliny ${r.nazwa} (${r.gleba.ph}). 👍` };
}

function rysujStronePh(roslinaId) {
  const wybrana = ROSLINY.find((r) => r.id === roslinaId);

  // Skala z klasami odczynu
  const skala = KLASY_PH.map((k, i) => {
    const od = i === 0 ? PH_MIN : KLASY_PH[i - 1].do;
    const doo = Math.min(k.do, PH_MAX);
    return `<div style="left:${pozycjaPh(od)}%; width:${pozycjaPh(doo) - pozycjaPh(od)}%; background:${k.kolor}"><span>${k.nazwa}</span></div>`;
  }).join("");
  const podzialka = [4, 5, 6, 7, 8].map((v) => `<span style="left:${pozycjaPh(v)}%">${v}</span>`).join("");

  // Wykres optymalnego pH wszystkich roślin (posortowane od najbardziej kwasolubnych)
  const wiersze = [...ROSLINY]
    .sort((a, b) => zakresPh(a).min - zakresPh(b).min)
    .map((r) => {
      const { min, max } = zakresPh(r);
      return `
        <a class="ph-wiersz ${wybrana && wybrana.id === r.id ? "wybrana" : ""}" href="#ph/${r.id}">
          <span class="ph-nazwa">${r.ikona} ${r.nazwa}</span>
          <span class="ph-tor"><span class="ph-pasek" style="left:${pozycjaPh(min)}%; width:${pozycjaPh(max) - pozycjaPh(min)}%"></span></span>
          <span class="ph-zakres">${r.gleba.ph}</span>
        </a>`;
    }).join("");

  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <span class="ikona">🧪</span>
      <div>
        <h2>pH gleby</h2>
        <span class="lac">Jak je zbadać, co oznacza wynik i co się dzieje, gdy jest nieodpowiednie.</span>
      </div>
    </div>

    <p>pH (odczyn) mówi, jak bardzo kwaśna lub zasadowa jest gleba. To jedna z najważniejszych cech gleby:
      <strong>od pH zależy, czy roślina w ogóle pobierze składniki z nawozów</strong>. Przy złym odczynie nawet
      duże nawożenie nie pomoże – składniki są w glebie, ale zablokowane.</p>

    <div class="ph-skala">
      <div class="ph-klasy">${skala}</div>
      <div class="ph-podzialka">${podzialka}</div>
    </div>

    <div class="ph-sprawdz">
      <h4>🔎 Sprawdź swój wynik</h4>
      <div class="dwa">
        <label class="pole">Roślina
          <select id="ph-roslina">
            ${ROSLINY.map((r) => `<option value="${r.id}" ${wybrana && wybrana.id === r.id ? "selected" : ""}>${r.ikona} ${r.nazwa}</option>`).join("")}
          </select>
        </label>
        <label class="pole">Twoje pH
          <input type="number" id="ph-wartosc" min="3" max="9" step="0.1" inputmode="decimal" placeholder="np. 5,8">
        </label>
      </div>
      <p id="ph-werdykt" class="slaby">Wpisz wynik pomiaru.</p>
    </div>

    <h3>🔬 Jak zbadać pH w swoim ogrodzie</h3>
    <div class="nat-siatka">
      <article class="nat-karta">
        <header><span class="nat-ikona">🏛️</span><div><h3>Laboratorium (OSChR)</h3><span class="typ">najdokładniej</span></div></header>
        <p>Okręgowa Stacja Chemiczno-Rolnicza lub laboratorium glebowe. Za kilkadziesiąt złotych dostaniesz pH oraz zasobność w fosfor, potas i magnez – wyniki od razu wpiszesz do kalkulatora w ${wybrana ? `<a href="#${wybrana.id}">karcie rośliny</a>` : "karcie rośliny"}.</p>
        <p class="slaby">Najlepsze rozwiązanie raz na 3–4 lata.</p>
      </article>
      <article class="nat-karta">
        <header><span class="nat-ikona">🧴</span><div><h3>Kwasomierz Helliga</h3><span class="typ">tani i dość dokładny</span></div></header>
        <p>Płyn ze wskaźnikiem i porcelanowa płytka (kilkanaście–kilkadziesiąt zł w sklepie ogrodniczym). Na płytkę kładziesz szczyptę ziemi, nasączasz płynem, po 1–2 minutach przechylasz i porównujesz kolor spływającej cieczy ze skalą.</p>
        <p class="slaby">Dokładność ok. 0,5 pH – wystarczy w ogrodzie.</p>
      </article>
      <article class="nat-karta">
        <header><span class="nat-ikona">🧾</span><div><h3>Paski / testy paskowe</h3><span class="typ">szybko</span></div></header>
        <p>Ziemię mieszasz z wodą destylowaną (1:2), odczekujesz, aż się odstoi, i zanurzasz pasek w klarownej wodzie. Kolor porównujesz ze skalą na opakowaniu.</p>
        <p class="slaby">Używaj wody destylowanej – kranówka zafałszuje wynik.</p>
      </article>
      <article class="nat-karta">
        <header><span class="nat-ikona">📟</span><div><h3>pH-metr z sondą</h3><span class="typ">wygodnie, ale ostrożnie</span></div></header>
        <p>Najtańsze mierniki „3 w 1” wbijane w ziemię są bardzo niedokładne. Wiarygodne są elektroniczne pH-metry z elektrodą szklaną, kalibrowane płynami wzorcowymi – mierzy się nimi zawiesinę gleby w wodzie.</p>
        <p class="slaby">Przed pomiarem skalibruj miernik.</p>
      </article>
    </div>

    <h3>🥄 Jak pobrać próbkę gleby</h3>
    <ul class="harmonogram">
      <li><strong>Z wielu miejsc</strong>Z jednego zagonu lub działki pobierz ziemię z 10–15 punktów, chodząc zygzakiem. Omijaj miejsca nietypowe (pod kompostownikiem, przy ścieżce, gdzie leżał obornik lub wapno).</li>
      <li><strong>Z właściwej głębokości</strong>Warzywnik i trawnik: 0–20 cm (trawnik 0–10 cm). Drzewa i krzewy: także 20–40 cm. Wierzchnią warstwę z resztkami roślin odgarnij.</li>
      <li><strong>Wymieszaj</strong>Wszystkie porcje wymieszaj w czystym wiadrze i weź ok. 0,5 kg do badania. Do laboratorium – w woreczku, opisane.</li>
      <li><strong>Wybierz dobry termin</strong>Najlepiej jesienią po zbiorach albo wczesną wiosną – zawsze <strong>przed</strong> nawożeniem i co najmniej 2–3 miesiące po wapnowaniu.</li>
    </ul>

    <div class="uwaga">
      <strong>pH w KCl czy w H₂O?</strong> Laboratoria podają zwykle pH w KCl (roztwór chlorku potasu). Pomiar w wodzie
      (H₂O) – czyli większość testów domowych – daje wynik wyższy o ok. 0,5–1. Zakresy na tej stronie dotyczą pH w KCl,
      więc wynik z testu w wodzie dla porównania pomniejsz o ok. 0,5.
    </div>

    <h3>🌿 Podpowiedzi z natury</h3>
    <p>Zanim kupisz test, przyjrzyj się chwastom – część z nich rośnie chętnie na glebach o określonym odczynie:</p>
    <div class="dwa-tekst">
      <div><strong>Gleba kwaśna:</strong> skrzyp polny, szczaw polny (szczawik), mchy, rumian polny, sporek, fiołek trójbarwny.</div>
      <div><strong>Gleba zasadowa / wapienna:</strong> podbiał, mak polny, ostróżeczka, gorczyca polna, szałwia łąkowa.</div>
    </div>
    <p class="slaby">To tylko wskazówka – pewność daje pomiar.</p>

    <h3>⚠️ Co się dzieje, gdy pH jest nieodpowiednie</h3>
    <div class="nat-siatka">
      <article class="nat-karta ph-skutek kwasna">
        <h3>Za kwaśna gleba (pH za niskie)</h3>
        <ul>
          <li><strong>Fosfor zostaje zablokowany</strong> – wiąże się z glinem i żelazem, więc nawóz fosforowy się marnuje.</li>
          <li><strong>Brakuje wapnia, magnezu i molibdenu</strong> – żółknięcie liści, słaby wzrost, u kalafiora „biczykowatość” liści.</li>
          <li><strong>Toksyczny glin i mangan</strong> – uszkadzają korzenie, rośliny są karłowate i gorzej znoszą suszę.</li>
          <li><strong>Choroby</strong> – kwaśna gleba sprzyja kile kapusty.</li>
          <li><strong>Słabsze życie gleby</strong> – mniej dżdżownic i pożytecznych bakterii, wolniejszy rozkład obornika; bobowate (soja, groch) słabo wiążą azot.</li>
        </ul>
      </article>
      <article class="nat-karta ph-skutek zasadowa">
        <h3>Za zasadowa gleba (pH za wysokie)</h3>
        <ul>
          <li><strong>Brakuje żelaza i manganu</strong> – chloroza: żółte liście z zielonymi nerwami (szczególnie borówka, różaneczniki, hortensje).</li>
          <li><strong>Brakuje boru, cynku i miedzi</strong> – np. zgorzel serca buraka, brunatnienie róż kalafiora.</li>
          <li><strong>Fosfor wiąże się z wapniem</strong> – też staje się trudno dostępny.</li>
          <li><strong>Choroby</strong> – zasadowa gleba sprzyja parchowi zwykłemu ziemniaka.</li>
          <li><strong>Straty azotu</strong> – z nawozów amonowych i mocznika azot łatwiej ulatnia się jako amoniak.</li>
        </ul>
      </article>
    </div>

    <h3>🛠️ Jak poprawić pH</h3>
    <ul class="harmonogram">
      <li><strong>Gleba za kwaśna → wapnowanie</strong>Na glebach lekkich – wapno węglanowe (kreda) lub dolomit (dostarcza też magnez), orientacyjnie 15–30 kg/ar (150–300 g/m²). Na glebach ciężkich dawki większe, można użyć wapna tlenkowego. Najlepiej jesienią, wymieszać z glebą. Nie podnoś pH o więcej niż ok. 1 jednostkę na rok.</li>
      <li><strong>Nie łącz wapna z obornikiem</strong>Wapnuj w innym terminie (kilka tygodni odstępu lub w innym roku) – razem powodują duże straty azotu. Pod ziemniaki nie wapnuj tuż przed sadzeniem (parch).</li>
      <li><strong>Gleba za zasadowa → zakwaszanie</strong>Siarka ogrodnicza (orientacyjnie ok. 50 g/m² obniża pH o ok. 1 na glebie lekkiej, działa przez kilka miesięcy), kwaśny torf, kora i trociny sosnowe, kompost z igliwia. Nawozy: siarczan amonu zamiast saletry wapniowej.</li>
      <li><strong>Sprawdź efekt</strong>Zmierz pH ponownie po 2–3 miesiącach (siarka) lub w kolejnym sezonie (wapno). Dokładne dawki wapna ustala się na podstawie badania gleby.</li>
    </ul>

    <h3>📊 Optymalne pH roślin</h3>
    <p class="slaby">Kliknij roślinę, aby zaznaczyć ją na wykresie i w sprawdzaniu wyniku.</p>
    <div class="ph-wykres">
      <div class="ph-wiersz naglowek"><span></span><span class="ph-tor ph-os">${podzialka}</span><span></span></div>
      ${wiersze}
    </div>
  `;


  // Szybkie sprawdzanie wyniku
  const poleRoslina = document.getElementById("ph-roslina");
  const polePh = document.getElementById("ph-wartosc");
  const werdykt = document.getElementById("ph-werdykt");
  const zapisane = wczytajBadanie();
  if (zapisane.ph) polePh.value = zapisane.ph;

  function sprawdz() {
    const ph = parseFloat(String(polePh.value).replace(",", "."));
    if (!Number.isFinite(ph)) {
      werdykt.className = "slaby";
      werdykt.innerHTML = "Wpisz wynik pomiaru.";
      return;
    }
    const r = ROSLINY.find((x) => x.id === poleRoslina.value);
    const o = ocenaPhDlaRosliny(ph, r);
    werdykt.className = o.ok ? "werdykt-ok" : "ostrz";
    werdykt.innerHTML = o.tekst;
  }
  polePh.addEventListener("input", sprawdz);
  poleRoslina.addEventListener("change", () => (location.hash = `ph/${poleRoslina.value}`));
  sprawdz();
}
