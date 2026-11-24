// ===== Zakładka: Kalendarz prac =====
//
// Dwa widoki:
//  • #kalendarz/5        – miesiąc (maj): co robić przy wszystkich roślinach,
//  • #kalendarz/pomidor  – wybrana roślina: cały rok prac + najważniejsze informacje o niej.
// Zmiana filtrów nie przewija strony.

const kal = {
  miesiac: new Date().getMonth() + 1,
  roslina: null,          // id wybranej rośliny albo null = wszystkie
  typ: "wszystko",
  kategoria: "Wszystkie"
};

const TERAZ = () => new Date().getMonth() + 1;

function pracaPasuje(wpis, miesiac) {
  const [miesiace, typ] = wpis;
  return (!miesiac || miesiace.includes(miesiac)) && (kal.typ === "wszystko" || typ === kal.typ);
}

function roslinyKalendarza() {
  return ROSLINY.filter((r) => KALENDARZ[r.id] && (kal.kategoria === "Wszystkie" || r.kategoria === kal.kategoria));
}

function etykietaTypu(typ) {
  const t = TYPY_PRAC[typ];
  return `<span class="kal-typ typ-${typ}"><span aria-hidden="true">${t.ikona}</span> ${t.nazwa}</span>`;
}

function listaPrac(prace) {
  return `<ul class="kal-prace">${prace.map(([, typ, opis]) => `
    <li class="kal-praca typ-${typ}">${etykietaTypu(typ)}<span>${opis}</span></li>`).join("")}</ul>`;
}

function liczbaPrac(miesiac) {
  let n = KALENDARZ_OGOLNY.filter((w) => pracaPasuje(w, miesiac)).length;
  for (const r of roslinyKalendarza()) n += KALENDARZ[r.id].filter((w) => pracaPasuje(w, miesiac)).length;
  return n;
}

function odmianaPrac(n) {
  if (n === 1) return "praca";
  const d = n % 10, s = n % 100;
  return d >= 2 && d <= 4 && (s < 12 || s > 14) ? "prace" : "prac";
}

// ---------- Ekran startowy: wybór rośliny ----------
function htmlEkranuWyboru() {
  const teraz = TERAZ();
  const kategorie = [...new Set(ROSLINY.map((r) => r.kategoria))];
  const wszystkieTeraz = liczbaPrac(teraz);
  const kafel = (r) => {
    const nTeraz = KALENDARZ[r.id].filter((w) => w[0].includes(teraz)).length;
    const nRok = KALENDARZ[r.id].length;
    return `
      <a class="kal-kafel" href="#kalendarz/${r.id}">
        ${grafikaRosliny(r, "kal-kafel-foto")}
        <span class="kal-kafel-tekst">
          <b>${r.nazwa}</b>
          <span class="kal-kafel-info">${nRok} terminów w roku</span>
          <span class="kal-kafel-teraz ${nTeraz ? "" : "pusto"}">${nTeraz ? `teraz: ${nTeraz} ${odmianaPrac(nTeraz)}` : "teraz spokój"}</span>
        </span>
      </a>`;
  };
  return `
    <h3 class="kal-start-tytul">🌱 Wybierz roślinę</h3>
    <p class="slaby">Kliknij roślinę – zobaczysz jej cały rok: kiedy siać, nawozić, chronić i zbierać, oraz najważniejsze wskazówki.</p>
    ${kategorie.map((k) => {
      const rosliny = ROSLINY.filter((r) => r.kategoria === k && KALENDARZ[r.id]);
      return rosliny.length ? `
        <h4 class="kal-start-kat">${k}</h4>
        <div class="kal-kafle">${rosliny.map(kafel).join("")}</div>` : "";
    }).join("")}
    <a class="kal-wszystkie-karta" href="#kalendarz/${teraz}">
      <span class="kal-wszystkie-ikona" aria-hidden="true">🗓️</span>
      <span><b>Albo: co robić teraz przy wszystkich roślinach?</b>
        <span class="slaby">${MIESIACE[teraz - 1]} – ${wszystkieTeraz} ${odmianaPrac(wszystkieTeraz)}. Widok miesiąc po miesiącu dla całego ogrodu.</span></span>
      <span class="kal-strzalka" aria-hidden="true">→</span>
    </a>`;
}

// ---------- Pasek nad widokiem rośliny / miesiąca ----------
function htmlPaskaWyboru() {
  const opcje = ROSLINY.filter((r) => KALENDARZ[r.id])
    .map((r) => `<option value="${r.id}" ${r.id === kal.roslina ? "selected" : ""}>${r.nazwa}</option>`).join("");
  return `
    <a class="kal-zmien" href="#kalendarz">← Wybierz inną roślinę</a>
    <label class="kal-szybki-wybor">Roślina:
      <select data-szybka-roslina>
        <option value="" ${kal.roslina ? "" : "selected"}>🗓️ wszystkie (widok miesiąca)</option>
        ${opcje}
      </select>
    </label>`;
}

// ---------- Filtry ----------
function htmlFiltrow() {
  const typy = [["wszystko", "Wszystkie prace", ""], ...Object.entries(TYPY_PRAC).map(([id, t]) => [id, t.nazwa, t.ikona])];
  const kategorie = ["Wszystkie", ...new Set(ROSLINY.map((r) => r.kategoria))];
  return `
    <div class="kal-filtr" role="group" aria-label="Rodzaj prac">
      ${typy.map(([id, nazwa, ikona]) => `
        <button type="button" class="kal-chip ${id !== "wszystko" ? `typ-${id}` : ""} ${kal.typ === id ? "wybrany" : ""}"
          data-typ="${id}" aria-pressed="${kal.typ === id}">${ikona ? `<span aria-hidden="true">${ikona}</span> ` : ""}${nazwa}</button>`).join("")}
    </div>
    ${kal.roslina ? "" : `
      <label class="kal-kategoria">Rośliny:
        <select data-kategoria>
          ${kategorie.map((k) => `<option ${k === kal.kategoria ? "selected" : ""}>${k}</option>`).join("")}
        </select>
      </label>`}`;
}

// =====================================================================
// WIDOK MIESIĄCA (wszystkie rośliny)
// =====================================================================
function htmlMiesiecy() {
  const teraz = TERAZ();
  return MIESIACE_KROTKO.map((m, i) => {
    const nr = i + 1;
    const n = liczbaPrac(nr);
    return `
      <button type="button" class="kal-miesiac ${nr === kal.miesiac ? "aktywny" : ""}" data-m="${nr}"
        aria-pressed="${nr === kal.miesiac}" title="${MIESIACE[i]} – ${n} ${odmianaPrac(n)}">
        <span class="kal-m-nazwa">${m}</span>
        <span class="kal-m-liczba">${n}</span>
        ${nr === teraz ? '<span class="kal-teraz">teraz</span>' : ""}
      </button>`;
  }).join("");
}

function htmlMiesiaca() {
  const m = kal.miesiac;
  const ogolne = KALENDARZ_OGOLNY.filter((w) => pracaPasuje(w, m));
  const grupy = roslinyKalendarza()
    .map((r) => ({ r, prace: KALENDARZ[r.id].filter((w) => pracaPasuje(w, m)) }))
    .filter((g) => g.prace.length);
  const razem = ogolne.length + grupy.reduce((s, g) => s + g.prace.length, 0);

  if (!razem) {
    return `<h3 class="kal-tytul">${MIESIACE[m - 1]}</h3>
      <p class="kal-pusto">W tym miesiącu nie ma prac pasujących do wybranych filtrów. 🌙</p>`;
  }
  return `
    <h3 class="kal-tytul">${MIESIACE[m - 1]} <span>${razem} ${odmianaPrac(razem)}</span></h3>
    ${ogolne.length ? `
      <article class="kal-roslina kal-ogolne">
        <div class="kal-roslina-naglowek"><span class="kal-ogolne-ikona" aria-hidden="true">🏡</span><span><b>Cały ogród i pole</b></span></div>
        ${listaPrac(ogolne)}
      </article>` : ""}
    <div class="kal-siatka">
      ${grupy.map(({ r, prace }) => `
        <article class="kal-roslina">
          <button type="button" class="kal-roslina-naglowek" data-roslina="${r.id}" title="Cały rok: ${r.nazwa}">
            ${grafikaRosliny(r, "miniatura kal-grafika")}
            <span><b>${r.nazwa}</b><span class="kat">${r.kategoria}</span></span>
            <span class="kal-strzalka">cały rok →</span>
          </button>
          ${listaPrac(prace)}
        </article>`).join("")}
    </div>`;
}

function htmlRoku() {
  const teraz = TERAZ();
  const kropki = (wpisy, m) => {
    const typy = [...new Set(wpisy.filter((w) => pracaPasuje(w, m)).map((w) => w[1]))];
    return typy.map((t) => `<span class="kal-kropka typ-${t}" title="${TYPY_PRAC[t].nazwa}"></span>`).join("");
  };
  const klasaKol = (m) => `${m === kal.miesiac ? "wybrany" : ""} ${m === teraz ? "teraz" : ""}`;
  return `
    <div class="kal-rok-przewijany">
      <table class="kal-rok">
        <thead><tr><th scope="col">Roślina</th>${MIESIACE_KROTKO.map((m, i) => `
          <th scope="col" class="${klasaKol(i + 1)}"><button type="button" data-m="${i + 1}">${m}</button></th>`).join("")}</tr></thead>
        <tbody>
          ${roslinyKalendarza().map((r) => `
            <tr>
              <th scope="row"><button type="button" data-roslina="${r.id}" title="Cały rok: ${r.nazwa}">${grafikaRosliny(r, "miniatura kal-mini")}${r.nazwa}</button></th>
              ${MIESIACE_KROTKO.map((_, i) => `<td class="${klasaKol(i + 1)}" data-m="${i + 1}">${kropki(KALENDARZ[r.id], i + 1)}</td>`).join("")}
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="kal-legenda">${Object.keys(TYPY_PRAC).map((t) => `<span><span class="kal-kropka typ-${t}"></span>${TYPY_PRAC[t].nazwa}</span>`).join("")}</div>`;
}

function htmlWidokuMiesiaca() {
  return `
    <div class="kal-miesiace" data-k="miesiace">${htmlMiesiecy()}</div>
    <section aria-live="polite">${htmlMiesiaca()}</section>
    <h3>📊 Przegląd całego roku</h3>
    <p class="slaby maly">Kliknij miesiąc lub kratkę, żeby zobaczyć prace – albo nazwę rośliny, żeby zobaczyć jej cały rok.</p>
    ${htmlRoku()}`;
}

// =====================================================================
// WIDOK ROŚLINY (cały rok + wszystko o roślinie)
// =====================================================================
function kolejneMiesiace() {
  const t = TERAZ();
  return Array.from({ length: 12 }, (_, i) => ((t - 1 + i) % 12) + 1);
}

function htmlPaskaRoku(r) {
  // Wykres Gantta: wiersz na każdy rodzaj prac, kolumny = miesiące
  const teraz = TERAZ();
  const typy = Object.keys(TYPY_PRAC).filter((t) => KALENDARZ[r.id].some((w) => w[1] === t) && (kal.typ === "wszystko" || kal.typ === t));
  if (!typy.length) return "";
  return `
    <div class="kal-gantt" role="table" aria-label="Rok w skrócie">
      <div class="kal-gantt-wiersz kal-gantt-naglowek" role="row">
        <span role="columnheader"></span>
        ${MIESIACE_KROTKO.map((m, i) => `<button type="button" role="columnheader" class="${i + 1 === teraz ? "teraz" : ""}" data-skocz="${i + 1}">${m}</button>`).join("")}
      </div>
      ${typy.map((t) => {
        const mies = new Set(KALENDARZ[r.id].filter((w) => w[1] === t).flatMap((w) => w[0]));
        return `
          <div class="kal-gantt-wiersz typ-${t}" role="row">
            <span class="kal-gantt-etykieta" role="rowheader"><span aria-hidden="true">${TYPY_PRAC[t].ikona}</span> ${TYPY_PRAC[t].nazwa}</span>
            ${MIESIACE_KROTKO.map((_, i) => {
              const jest = mies.has(i + 1), lewy = mies.has(i), prawy = mies.has(i + 2);
              return `<span role="cell" class="kal-gantt-kom ${i + 1 === teraz ? "teraz" : ""}">${jest
                ? `<span class="kal-gantt-pasek ${lewy ? "" : "poczatek"} ${prawy ? "" : "koniec"}" title="${TYPY_PRAC[t].nazwa} – ${MIESIACE[i]}"></span>` : ""}</span>`;
            }).join("")}
          </div>`;
      }).join("")}
    </div>`;
}

function htmlORoslinie(r) {
  const u = r.uprawa || {};
  const kropkiSkali = (n, maks = 3) => `<span class="kal-skala" aria-label="${n} z ${maks}">${"●".repeat(n)}<span>${"●".repeat(maks - n)}</span></span>`;
  const obornik = (typeof OBORNIK_DLA_ROSLIN !== "undefined") ? OBORNIK_DLA_ROSLIN[r.id] : null;
  const ocenaObornika = obornik ? { tak: "✅ tak", umiarkowanie: "🟡 z umiarem", nie: "⛔ nie" }[obornik.ocena] : null;
  const npk = Object.entries(r.potrzeby).map(([s, p]) => `<span class="kal-npk"><b style="color: var(--${s})">${s}</b> ${POZIOMY[p]}</span>`).join("");

  const fakty = [
    ["🧪", "Optymalne pH", r.gleba.ph, `#ph/${r.id}`],
    ["🌍", "Gleba", r.gleba.typ],
    ["🌿", "Potrzeby pokarmowe", npk],
    u.podlewanie ? ["💧", "Podlewanie", kropkiSkali(u.podlewanie), null, u.podlewanieOpis] : null,
    u.trudnosc ? ["🎯", "Trudność uprawy", kropkiSkali(u.trudnosc), null, u.trudnoscOpis] : null,
    u.mroz ? ["❄️", "Mróz", u.mroz] : null,
    ocenaObornika ? ["♻️", "Obornik", ocenaObornika, `#naturalne/${r.id}`, obornik.uwagi] : null
  ].filter(Boolean);

  return `
    <div class="kal-fakty">
      ${fakty.map(([ikona, etykieta, wartosc, link, opis]) => `
        <div class="kal-fakt">
          <span class="kal-fakt-etykieta"><span aria-hidden="true">${ikona}</span> ${etykieta}</span>
          <span class="kal-fakt-wartosc">${wartosc}</span>
          ${opis ? `<span class="kal-fakt-opis">${opis}</span>` : ""}
          ${link ? `<a class="kal-fakt-link" href="${link}">Więcej →</a>` : ""}
        </div>`).join("")}
    </div>
    ${r.problemy && r.problemy.length ? `
      <h4 class="kal-podtytul">🛡️ Na co uważać w ciągu roku</h4>
      <div class="kal-problemy">
        ${r.problemy.map((p) => `
          <details class="kal-problem">
            <summary><b>${p.nazwa}</b> <span class="typ">${p.typ}</span></summary>
            <p><b>Objawy:</b> ${p.objawy}</p>
            <p><b>Zapobieganie:</b> ${p.zapobieganie}</p>
            <p><b>Środki:</b> ${p.srodki}</p>
          </details>`).join("")}
      </div>` : ""}`;
}

function htmlWidokuRosliny() {
  const r = ROSLINY.find((x) => x.id === kal.roslina);
  const teraz = TERAZ();
  const miesiace = kolejneMiesiace()
    .map((m) => ({ m, prace: KALENDARZ[r.id].filter((w) => pracaPasuje(w, m)) }))
    .filter((x) => x.prace.length);
  const razem = miesiace.reduce((s, x) => s + x.prace.length, 0);

  const oznaczenie = (m) => m === teraz ? '<span class="kal-teraz-znacznik">teraz</span>'
    : m === (teraz % 12) + 1 ? '<span class="kal-teraz-znacznik nastepny">w przyszłym miesiącu</span>' : "";

  return `
    <article class="kal-profil">
      <div class="kal-profil-foto">${grafikaRosliny(r, "kal-duza")}</div>
      <div class="kal-profil-opis">
        <span class="kal-profil-kat">${r.kategoria}</span>
        <h3>${r.nazwa}</h3>
        <span class="lac">${r.lacina}</span>
        <p>${r.opis}</p>
        <div class="kal-profil-akcje">
          <a class="przycisk" href="#${r.id}">Pełna karta i kalkulator nawozu →</a>
        </div>
      </div>
    </article>

    <h3>📊 Rok w skrócie</h3>
    <p class="slaby maly">Kliknij miesiąc, żeby przejść do jego prac.</p>
    ${htmlPaskaRoku(r)}

    <h3 class="kal-tytul bez-wielkich">📅 Miesiąc po miesiącu <span>${razem} ${odmianaPrac(razem)} · od bieżącego miesiąca</span></h3>
    ${miesiace.length && miesiace[0].m !== teraz ? `
      <p class="kal-info">😴 W tym miesiącu (${MIESIACE[teraz - 1]}) przy tej roślinie nie ma prac.
        Najbliższe: <b>${MIESIACE[miesiace[0].m - 1]}</b>.</p>` : ""}
    ${miesiace.length ? `
      <ol class="kal-os">
        ${miesiace.map(({ m, prace }) => `
          <li class="kal-os-miesiac ${m === teraz ? "teraz" : ""}" id="kal-m-${m}">
            <div class="kal-os-naglowek"><span class="kal-os-nazwa">${MIESIACE[m - 1]}</span>${oznaczenie(m)}</div>
            ${listaPrac(prace)}
          </li>`).join("")}
      </ol>` : `<p class="kal-pusto">Brak prac wybranego rodzaju dla tej rośliny.</p>`}

    <h3>📌 Najważniejsze o roślinie</h3>
    ${htmlORoslinie(r)}`;
}

// =====================================================================
// #kalendarz            – ekran startowy: wybór rośliny
// #kalendarz/pomidor    – cały rok wybranej rośliny
// #kalendarz/5          – widok miesiąca dla wszystkich roślin
function rysujStroneKalendarza(parametr) {
  const m = parseInt(parametr, 10);
  let ekran;
  if (m >= 1 && m <= 12) { kal.miesiac = m; kal.roslina = null; ekran = "miesiac"; }
  else if (parametr && ROSLINY.some((r) => r.id === parametr)) { kal.roslina = parametr; ekran = "roslina"; }
  else { kal.roslina = null; ekran = "wybor"; }

  const podtytul = ekran === "roslina" ? `Cały rok: ${ROSLINY.find((r) => r.id === kal.roslina).nazwa}`
    : ekran === "miesiac" ? "Co robić przy wszystkich roślinach w wybranym miesiącu."
    : "Wybierz roślinę i sprawdź, co robić z nią przez cały rok.";

  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <span class="ikona" aria-hidden="true">📅</span>
      <div>
        <h2>Kalendarz prac</h2>
        <span class="lac">${podtytul}</span>
      </div>
    </div>
    ${ekran === "wybor" ? `<div class="kal-start">${htmlEkranuWyboru()}</div>` : `
      <div class="kal-pasek-wyboru">${htmlPaskaWyboru()}</div>
      <div class="kal-filtry" data-k="filtry">${htmlFiltrow()}</div>
      <div data-k="widok"></div>`}
    <p class="slaby maly kal-uwaga">Terminy są orientacyjne dla środkowej Polski. Na północy i wschodzie prace wiosenne
      przesuń zwykle o 1–2 tygodnie później, na zachodzie i południu – wcześniej. Zawsze kieruj się pogodą i stanem roślin.</p>`;

  if (ekran === "wybor") return; // kafelki to zwykłe linki – nic więcej nie trzeba

  const czesc = (k) => wynik.querySelector(`[data-k="${k}"]`);

  function odswiez(przewin) {
    czesc("filtry").innerHTML = htmlFiltrow();
    czesc("widok").innerHTML = kal.roslina ? htmlWidokuRosliny() : htmlWidokuMiesiaca();
    history.replaceState(null, "", `#kalendarz/${kal.roslina || kal.miesiac}`);
    if (przewin) czesc("widok").scrollIntoView({ behavior: "smooth", block: "start" });
    wynik.querySelector(".kal-miesiac.aktywny")?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  wynik.onclick = (e) => {
    const wybor = e.target.closest("[data-roslina]");
    if (wybor) {
      // przejście do całego roku rośliny (z widoku miesiąca) – nowy wpis w historii, "Wstecz" wraca
      location.hash = `kalendarz/${wybor.dataset.roslina}`;
      return;
    }
    const skocz = e.target.closest("[data-skocz]");
    if (skocz) {
      document.getElementById(`kal-m-${skocz.dataset.skocz}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const mies = e.target.closest("[data-m]");
    if (mies) {
      kal.miesiac = Number(mies.dataset.m);
      odswiez(!!e.target.closest(".kal-rok"));
      return;
    }
    const typ = e.target.closest("[data-typ]");
    if (typ) {
      kal.typ = typ.dataset.typ;
      odswiez(false);
    }
  };
  wynik.onchange = (e) => {
    if (e.target.matches("[data-szybka-roslina]")) {
      location.hash = `kalendarz/${e.target.value || TERAZ()}`;
      return;
    }
    if (e.target.matches("[data-kategoria]")) {
      kal.kategoria = e.target.value;
      odswiez(false);
    }
  };

  odswiez(false);
}
