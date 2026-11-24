// ===== Pomocnicze =====

// Usuwa polskie znaki i zamienia na małe litery, żeby "Róża" = "roza".
function normalizuj(tekst) {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .trim();
}

function znajdzRosliny(zapytanie) {
  const q = normalizuj(zapytanie);
  if (!q) return [];
  return ROSLINY.filter((r) => {
    const nazwy = [r.nazwa, r.lacina, ...r.aliasy].map(normalizuj);
    return nazwy.some((n) => n.includes(q));
  });
}

const POZIOMY = ["", "niskie", "średnie", "wysokie"];
const SKLADNIKI = { N: "Azot (N)", P: "Fosfor (P)", K: "Potas (K)" };
const TYPY = { choroba: "🍂 choroba", szkodnik: "🐛 szkodnik", zaburzenie: "⚠️ zaburzenie", chwast: "🌿 chwast" };

// ===== Elementy strony =====
const pole = document.getElementById("pole-szukaj");
const podpowiedzi = document.getElementById("podpowiedzi");
const wynik = document.getElementById("wynik");
const lista = document.getElementById("lista");
const kategorieEl = document.getElementById("kategorie");

let aktywnaPodpowiedz = -1;
let wybranaKategoria = "Wszystkie";

// ===== Zdjęcia roślin =====
// img/zdjecia/<id>.jpg – 800×600 (kafelki, karta rośliny), img/zdjecia/male/<id>.jpg – 160×160 (podpowiedzi).
// Gdy zdjęcia brak, wracamy do starej ilustracji SVG z img/ilustracje.
function grafikaRosliny(r, klasa) {
  const male = klasa.split(" ").includes("miniatura"); // np. "miniatura kal-mini" w kalendarzu
  const src = male ? `img/zdjecia/male/${r.id}.jpg` : `img/zdjecia/${r.id}.jpg`;
  const [w, h] = male ? [160, 160] : [800, 600];
  return `<img class="${klasa}" src="${src}" alt="${r.nazwa}" width="${w}" height="${h}" loading="lazy" decoding="async"
    onerror="this.onerror=null;this.src='img/ilustracje/${r.id}.svg'">`;
}

// ===== Podpowiedzi w wyszukiwarce =====
function pokazPodpowiedzi() {
  const trafienia = znajdzRosliny(pole.value);
  aktywnaPodpowiedz = -1;

  if (!pole.value.trim()) {
    podpowiedzi.hidden = true;
    return;
  }

  if (trafienia.length === 0) {
    podpowiedzi.innerHTML = `<li class="brak">Nie znamy jeszcze tej rośliny 🌱</li>`;
  } else {
    podpowiedzi.innerHTML = trafienia
      .map((r) => `<li role="option" data-id="${r.id}">${grafikaRosliny(r, "miniatura")} ${r.nazwa} <span class="lac">${r.lacina}</span></li>`)
      .join("");
  }
  podpowiedzi.hidden = false;
}

pole.addEventListener("input", pokazPodpowiedzi);

pole.addEventListener("keydown", (e) => {
  const elementy = [...podpowiedzi.querySelectorAll("li[data-id]")];
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!elementy.length) return;
    aktywnaPodpowiedz = (aktywnaPodpowiedz + (e.key === "ArrowDown" ? 1 : -1) + elementy.length) % elementy.length;
    elementy.forEach((el, i) => el.classList.toggle("aktywna", i === aktywnaPodpowiedz));
  } else if (e.key === "Enter") {
    const wybrany = elementy[aktywnaPodpowiedz] || elementy[0];
    if (wybrany) otworz(wybrany.dataset.id);
  } else if (e.key === "Escape") {
    podpowiedzi.hidden = true;
  }
});

podpowiedzi.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-id]");
  if (li) otworz(li.dataset.id);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".szukaj")) podpowiedzi.hidden = true;
});

// ===== Kategorie i lista roślin =====
function rysujKategorie() {
  const kategorie = ["Wszystkie", ...new Set(ROSLINY.map((r) => r.kategoria))];
  kategorieEl.innerHTML = kategorie
    .map((k) => `<button class="kategoria ${k === wybranaKategoria ? "wybrana" : ""}" data-kat="${k}">${k}</button>`)
    .join("");
}

kategorieEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-kat]");
  if (!btn) return;
  wybranaKategoria = btn.dataset.kat;
  rysujKategorie();
  rysujListe();
});

function rysujListe() {
  const widoczne = ROSLINY.filter((r) => wybranaKategoria === "Wszystkie" || r.kategoria === wybranaKategoria);
  lista.innerHTML = widoczne
    .map((r) => `
      <a class="kafel" href="#${r.id}" aria-label="${r.nazwa} – ${r.kategoria}">
        ${grafikaRosliny(r, "kafel-grafika")}
        <span class="kafel-kat">${r.kategoria}</span>
        <span class="kafel-podpis"><b>${r.nazwa}</b><span>${r.lacina}</span></span>
      </a>`)
    .join("");
}

// ===== Karta rośliny =====
function otworz(id) {
  location.hash = id;
}

// Podlewanie, odporność i trudność uprawy – trzy karty w kroku „Wymagania”.
function uprawaHtml(r) {
  const u = r.uprawa;
  if (!u) return "";
  // skala 1–3 jako kropki, np. ●●○
  const skala = (n, klasa) => `<span class="skala ${klasa}" aria-hidden="true">${[1, 2, 3].map((i) => `<i class="${i <= n ? "pelna" : ""}"></i>`).join("")}</span>`;
  const PODLEWANIE = ["", "mało", "umiarkowanie", "dużo"];
  const ODPORNOSC = ["", "niska", "średnia", "wysoka"];
  const TRUDNOSC = ["", "łatwa", "średnia", "trudna"];
  return `
    <h4 class="krok-podtytul">Uprawa w skrócie</h4>
    <div class="uprawa">
      <div class="uprawa-karta">
        <div class="uprawa-gora"><span class="uprawa-ikona">💧</span><span><span class="etykieta">Podlewanie</span><b>${PODLEWANIE[u.podlewanie]}</b></span>${skala(u.podlewanie, "woda")}</div>
        <p>${u.podlewanieOpis}</p>
      </div>
      <div class="uprawa-karta">
        <div class="uprawa-gora"><span class="uprawa-ikona">🛡️</span><span><span class="etykieta">Odporność na choroby</span><b>${ODPORNOSC[u.odpornosc]}</b></span>${skala(u.odpornosc, "tarcza")}</div>
        <p>${u.odpornoscOpis}</p>
        <p class="uprawa-mroz">❄️ ${u.mroz}</p>
      </div>
      <div class="uprawa-karta">
        <div class="uprawa-gora"><span class="uprawa-ikona">🌱</span><span><span class="etykieta">Trudność uprawy</span><b class="trudnosc-${u.trudnosc}">${TRUDNOSC[u.trudnosc]}</b></span>${skala(u.trudnosc, "trud")}</div>
        <p>${u.trudnoscOpis}</p>
      </div>
    </div>`;
}

function rysujRosline(r) {
  const npk = Object.entries(r.potrzeby)
    .map(([s, poziom]) => `
      <div class="npk-wiersz">
        <span>${SKLADNIKI[s]}</span>
        <div class="pasek"><span style="width:${(poziom / 3) * 100}%; background: var(--${s})"></span></div>
        <span class="poziom">${POZIOMY[poziom]}</span>
      </div>`)
    .join("");

  const harmonogram = r.nawozenie
    .map((n, i) => `
      <li>
        <span class="os-nr">${i + 1}</span>
        <div><strong>${n.termin}</strong><p>${n.zalecenie}</p></div>
      </li>`)
    .join("");

  const naturalne = r.naturalne.map((n) => `<span class="chip">${n}</span>`).join("");

  // Problemy zwinięte – widać same nazwy, szczegóły po kliknięciu.
  const problemy = r.problemy
    .map((p) => `
      <details class="problem">
        <summary><span class="problem-nazwa">${p.nazwa}</span> <span class="typ">${TYPY[p.typ] || p.typ}</span></summary>
        <dl>
          <dt>Objawy</dt><dd>${p.objawy}</dd>
          <dt>Zapobieganie</dt><dd>${p.zapobieganie}</dd>
          <dt>Środki</dt><dd>${p.srodki}</dd>
        </dl>
      </details>`)
    .join("");

  const kroki = [
    { ikona: "🌱", tytul: "Wymagania", wstep: `Czego ${r.nazwa.toLowerCase()} potrzebuje od gleby i ile składników pobiera.`, tresc: `
      <div class="info">
        <div><span class="etykieta">Optymalne pH gleby</span><b>${r.gleba.ph}</b>
          <a class="maly-link" href="#ph/${r.id}">🧪 Jak zbadać pH i co, gdy jest złe? →</a></div>
        <div><span class="etykieta">Rodzaj gleby</span>${r.gleba.typ}</div>
      </div>
      ${uprawaHtml(r)}
      <h4 class="krok-podtytul">Potrzeby pokarmowe</h4>
      <div class="npk">${npk}</div>` },
    { ikona: "📅", tytul: "Kiedy nawozić", wstep: "Nawożenie w sezonie – po kolei, od przygotowania gleby.", tresc: `
      <ol class="os-czasu">${harmonogram}</ol>` },
    { ikona: "🧮", tytul: "Ile nawozu", wstep: "Podaj powierzchnię i to, co masz – policzymy dawki i ilość do kupienia.", tresc: `
      <div id="kalk-karta"></div>` },
    { ikona: "♻️", tytul: "Nawozy naturalne", wstep: "Co możesz podać zamiast (lub obok) nawozów ze sklepu.", tresc: `
      <div class="chipy">${naturalne}</div>
      ${infoOObornikuHtml(r.id)}` },
    { ikona: "🛡️", tytul: "Ochrona", wstep: "Najczęstsze choroby i szkodniki – kliknij, aby zobaczyć objawy i sposoby walki.", tresc: `
      <div class="problemy">${problemy}</div>
      <div class="uwaga">
        Przed zakupem środka ochrony roślin sprawdź, czy jest zarejestrowany do stosowania w tej uprawie –
        <a href="https://www.gov.pl/web/rolnictwo/wyszukiwarka-srodkow-ochrony-roslin" target="_blank" rel="noopener">oficjalna wyszukiwarka MRiRW</a>.
        Zawsze przestrzegaj dawek i okresu karencji podanych na etykiecie.
      </div>` },
  ];

  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <figure class="naglowek-grafika">${grafikaRosliny(r, "karta-grafika")}</figure>
      <div class="wynik-tytul">
        <h2>${r.nazwa}</h2>
        <span class="lac">${r.lacina}</span>
        <p class="wynik-opis">${r.opis}</p>
        <div class="szybkie">
          <span>pH <b>${r.gleba.ph}</b></span>
          <span>${r.kategoria}</span>
        </div>
      </div>
      <button type="button" class="powrot powrot-glowny wynik-powrot" data-cel="">
        <span class="strzalka" aria-hidden="true">←</span> Strona główna
      </button>
    </div>

    <nav class="kroki-nav" aria-label="Kroki">
      ${kroki.map((k, i) => `
        <button type="button" class="krok-przycisk" data-krok="${i}">
          <span class="krok-nr">${i + 1}</span><span class="krok-nazwa">${k.tytul}</span>
        </button>`).join("")}
    </nav>

    ${kroki.map((k, i) => `
      <section class="krok" data-krok="${i}" hidden>
        <header class="krok-naglowek">
          <span class="krok-licznik">Krok ${i + 1} z ${kroki.length}</span>
          <h3>${k.ikona} ${k.tytul}</h3>
          <p>${k.wstep}</p>
        </header>
        ${k.tresc}
        <footer class="krok-stopka">
          ${i > 0 ? `<button type="button" class="krok-wstecz" data-idz="${i - 1}">← ${kroki[i - 1].tytul}</button>` : "<span></span>"}
          ${i < kroki.length - 1
            ? `<button type="button" class="przycisk krok-dalej" data-idz="${i + 1}">Dalej: ${kroki[i + 1].tytul} →</button>`
            : `<button type="button" class="krok-wstecz" data-idz="0">↺ Od początku</button>`}
        </footer>
      </section>`).join("")}
  `;

  rysujKalkulator(document.getElementById("kalk-karta"), r.id);

  // Przełączanie kroków. Wszystkie kroki są w stronie (kalkulator nie traci wpisanych danych),
  // widać tylko aktywny. Ostatni krok każdej rośliny pamiętamy, np. po powrocie z poradnika pH.
  function pokazKrok(nr, przewin) {
    ostatniKrok[r.id] = nr;
    wynik.querySelectorAll(".krok").forEach((s) => { s.hidden = Number(s.dataset.krok) !== nr; });
    wynik.querySelectorAll(".krok-przycisk").forEach((b) => {
      const k = Number(b.dataset.krok);
      b.classList.toggle("aktywny", k === nr);
      b.classList.toggle("zrobiony", k < nr);
      if (k === nr) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    if (przewin) wynik.querySelector(".kroki-nav").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  wynik.onclick = (e) => {
    const powrot = e.target.closest("[data-cel]");
    if (powrot) return idzDo(powrot.dataset.cel);
    const cel = e.target.closest("[data-krok].krok-przycisk, [data-idz]");
    if (!cel) return;
    pokazKrok(Number(cel.dataset.idz ?? cel.dataset.krok), "idz" in cel.dataset);
  };
  pokazKrok(ostatniKrok[r.id] ?? 0, false);
}
const ostatniKrok = {};

// ===== Pasek powrotu (przyklejony u góry, widoczny w karcie rośliny i poradnikach) =====
const pasekPowrotu = document.getElementById("pasek-powrotu");
const zakladkaKalendarz = document.getElementById("zakladka-kalendarz");
const zakladkaGlowna = document.getElementById("zakladka-glowna");
// "Główna" zawsze wraca na stronę główną (także z karty rośliny), bez dopisywania "#" do adresu
zakladkaGlowna.addEventListener("click", (e) => {
  e.preventDefault();
  idzDo("");
});
const hero = document.querySelector(".hero");

// roslinaPowrot – gdy jesteśmy w poradniku, drugi przycisk wraca do karty tej rośliny.
function pokazPasekPowrotu(roslinaPowrot) {
  pasekPowrotu.innerHTML = `
    <button type="button" class="powrot powrot-glowny" data-cel="">
      <span class="strzalka" aria-hidden="true">←</span> Strona główna
    </button>
    ${roslinaPowrot ? `
      <button type="button" class="powrot powrot-roslina" data-cel="${roslinaPowrot.id}">
        <span class="strzalka" aria-hidden="true">←</span> ${roslinaPowrot.nazwa}
      </button>` : ""}`;
  pasekPowrotu.hidden = false;
}

// W kalendarzu i poradnikach przyciski powrotu idą do prawego górnego rogu nagłówka strony
// (tak jak w karcie rośliny), zamiast osobnego paska nad treścią.
function wstawPowrotDoNaglowka(roslinaPowrot) {
  const naglowek = wynik.querySelector(".wynik-naglowek");
  if (!naglowek) return pokazPasekPowrotu(roslinaPowrot); // strona bez nagłówka – zostaje pasek
  pasekPowrotu.hidden = true;
  const powroty = document.createElement("div");
  powroty.className = "wynik-powroty";
  powroty.innerHTML = `
    ${roslinaPowrot ? `
      <button type="button" class="powrot powrot-roslina wynik-powrot" data-cel="${roslinaPowrot.id}">
        <span class="strzalka" aria-hidden="true">←</span> ${roslinaPowrot.nazwa}
      </button>` : ""}
    <button type="button" class="powrot powrot-glowny wynik-powrot" data-cel="">
      <span class="strzalka" aria-hidden="true">←</span> Strona główna
    </button>`;
  powroty.addEventListener("click", (e) => {
    const przycisk = e.target.closest("[data-cel]");
    if (!przycisk) return;
    e.stopPropagation(); // żeby kliknięcie nie trafiło do obsługi kliknięć samej strony
    idzDo(przycisk.dataset.cel);
  });
  naglowek.appendChild(powroty);
}

// cel = id rośliny albo "" (strona główna)
function idzDo(cel) {
  if (cel) {
    location.hash = cel;
  } else {
    history.pushState("", document.title, location.pathname);
    pokazWidok();
  }
}

pasekPowrotu.addEventListener("click", (e) => {
  const przycisk = e.target.closest("[data-cel]");
  if (przycisk) idzDo(przycisk.dataset.cel);
});

// ===== Przełączanie widoków (na podstawie adresu #id) =====
function pokazSzczegoly() {
  wynik.hidden = false;
  hero.hidden = true;
  lista.hidden = true;
  podpowiedzi.hidden = true;
  window.scrollTo({ top: 0 });
}

function pokazWidok() {
  const id = decodeURIComponent(location.hash.slice(1));
  const roslina = ROSLINY.find((r) => r.id === id);

  podpowiedzi.hidden = true;
  // każdy widok sam podpina swoje kliknięcia – czyścimy po poprzednim
  wynik.onclick = null;
  wynik.onchange = null;

  // Poradniki otwierane z karty rośliny: #ph/pomidor, #naturalne/pomidor
  const [strona, roslinaZPoradnika] = id.split("/");
  // Zakładki w nagłówku: "Kalendarz" albo "Główna" (strona główna, karty roślin i poradniki)
  const naKalendarzu = strona === "kalendarz";
  for (const [zakladka, aktywna] of [[zakladkaKalendarz, naKalendarzu], [zakladkaGlowna, !naKalendarzu]]) {
    zakladka.classList.toggle("aktywna", aktywna);
    if (aktywna) zakladka.setAttribute("aria-current", "page");
    else zakladka.removeAttribute("aria-current");
  }

  if (strona === "kalendarz") {
    rysujStroneKalendarza(roslinaZPoradnika);
    document.title = "Kalendarz prac – Doradca Nawozowy";
    wstawPowrotDoNaglowka(null);
    pokazSzczegoly();
  } else if (strona === "ph" || strona === "naturalne") {
    if (strona === "ph") {
      rysujStronePh(roslinaZPoradnika);
      document.title = "pH gleby – Doradca Nawozowy";
    } else {
      rysujStroneNaturalnych(roslinaZPoradnika);
      document.title = "Nawozy naturalne – Doradca Nawozowy";
    }
    wstawPowrotDoNaglowka(ROSLINY.find((r) => r.id === roslinaZPoradnika));
    pokazSzczegoly();
  } else if (roslina) {
    rysujRosline(roslina);
    document.title = `${roslina.nazwa} – Doradca Nawozowy`;
    pasekPowrotu.hidden = true; // w karcie rośliny przycisk powrotu jest w jej nagłówku
    pokazSzczegoly();
  } else {
    wynik.hidden = true;
    pasekPowrotu.hidden = true;
    hero.hidden = false;
    lista.hidden = false;
    pole.value = "";
    document.title = "Doradca Nawozowy";
  }
}

window.addEventListener("hashchange", pokazWidok);

// Start
rysujKategorie();
rysujListe();
pokazWidok();
