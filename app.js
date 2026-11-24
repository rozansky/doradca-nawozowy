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
      .map((r) => `<li role="option" data-id="${r.id}"><span>${r.ikona}</span> ${r.nazwa} <span class="lac">${r.lacina}</span></li>`)
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
    .map((r) => `<a class="kafel" href="#${r.id}"><span class="ikona">${r.ikona}</span>${r.nazwa}<br><span class="kat">${r.kategoria}</span></a>`)
    .join("");
}

// ===== Karta rośliny =====
function otworz(id) {
  location.hash = id;
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
    .map((n) => `<li><strong>${n.termin}</strong>${n.zalecenie}</li>`)
    .join("");

  const naturalne = r.naturalne.map((n) => `<span class="chip">${n}</span>`).join("");

  const problemy = r.problemy
    .map((p) => `
      <div class="problem">
        <h4>${p.nazwa} <span class="typ">${TYPY[p.typ] || p.typ}</span></h4>
        <p><strong>Objawy:</strong> ${p.objawy}</p>
        <p><strong>Zapobieganie:</strong> ${p.zapobieganie}</p>
        <p><strong>Środki:</strong> ${p.srodki}</p>
      </div>`)
    .join("");

  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <span class="ikona">${r.ikona}</span>
      <div>
        <h2>${r.nazwa}</h2>
        <span class="lac">${r.lacina}</span>
      </div>
      <button class="wroc" id="wroc">← Wszystkie rośliny</button>
    </div>
    <p>${r.opis}</p>

    <div class="info">
      <div><span class="etykieta">Optymalne pH gleby</span>${r.gleba.ph}</div>
      <div><span class="etykieta">Rodzaj gleby</span>${r.gleba.typ}</div>
      <div><span class="etykieta">Kategoria</span>${r.kategoria}</div>
    </div>

    <h3>🧪 Potrzeby pokarmowe</h3>
    <div class="npk">${npk}</div>

    <h3>📅 Harmonogram nawożenia</h3>
    <ul class="harmonogram">${harmonogram}</ul>

    <h3>🧮 Kalkulator dawki nawozu</h3>
    <div id="kalk-karta"></div>

    <h3>♻️ Nawozy naturalne</h3>
    <div class="chipy">${naturalne}</div>
    ${infoOObornikuHtml(r.id)}

    <h3>🛡️ Ochrona roślin</h3>
    <div class="problemy">${problemy}</div>

    <div class="uwaga">
      Przed zakupem środka ochrony roślin sprawdź, czy jest zarejestrowany do stosowania w tej uprawie –
      <a href="https://www.gov.pl/web/rolnictwo/wyszukiwarka-srodkow-ochrony-roslin" target="_blank" rel="noopener">oficjalna wyszukiwarka MRiRW</a>.
      Zawsze przestrzegaj dawek i okresu karencji podanych na etykiecie.
    </div>
  `;

  rysujKalkulator(document.getElementById("kalk-karta"), r.id, false);
  podepnijPrzyciskWroc();
}

function podepnijPrzyciskWroc() {
  document.getElementById("wroc").addEventListener("click", () => {
    history.pushState("", document.title, location.pathname);
    pokazWidok();
  });
}

// Osobna strona kalkulatora (#kalkulator lub #kalkulator/pomidor)
function rysujStroneKalkulatora(roslinaId) {
  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <span class="ikona">🧮</span>
      <div>
        <h2>Kalkulator dawki nawozu</h2>
        <span class="lac">Wybierz roślinę, powierzchnię i nawozy – policzymy, ile ich potrzebujesz.</span>
      </div>
      <button class="wroc" id="wroc">← Wszystkie rośliny</button>
    </div>
    <div id="kalk-strona"></div>`;
  rysujKalkulator(document.getElementById("kalk-strona"), roslinaId, true);
  podepnijPrzyciskWroc();
}

// ===== Przełączanie widoków (na podstawie adresu #id) =====
function pokazWidok() {
  const id = decodeURIComponent(location.hash.slice(1));
  const roslina = ROSLINY.find((r) => r.id === id);

  podpowiedzi.hidden = true;

  if (id === "kalkulator" || id.startsWith("kalkulator/") || id === "naturalne") {
    if (id === "naturalne") {
      rysujStroneNaturalnych();
      document.title = "Nawozy naturalne – Doradca Nawozowy";
    } else {
      rysujStroneKalkulatora(id.split("/")[1]);
      document.title = "Kalkulator nawozów – Doradca Nawozowy";
    }
    wynik.hidden = false;
    lista.hidden = true;
    kategorieEl.hidden = true;
    pole.value = "";
    wynik.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (roslina) {
    rysujRosline(roslina);
    wynik.hidden = false;
    lista.hidden = true;
    kategorieEl.hidden = true;
    pole.value = roslina.nazwa;
    document.title = `${roslina.nazwa} – Doradca Nawozowy`;
    wynik.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    wynik.hidden = true;
    lista.hidden = false;
    kategorieEl.hidden = false;
    pole.value = "";
    document.title = "Doradca Nawozowy";
  }
}

window.addEventListener("hashchange", pokazWidok);

// Start
rysujKategorie();
rysujListe();
pokazWidok();
