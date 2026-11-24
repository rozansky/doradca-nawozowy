// ===== Kalkulator dawki nawozu =====
//
// Jak liczy:
// 1. Bierze zapotrzebowanie rośliny (g/m² składnika).
// 2. Koryguje P i K według zasobności gleby – wybranej ręcznie albo wyliczonej z wyników badania gleby.
// 3. Odejmuje składniki, które w pierwszym roku dostarczy nawóz naturalny (obornik, kompost…).
// 4. Jeśli wybrano nawóz wieloskładnikowy, dawkuje go tak, by nie przekroczyć zapotrzebowania na żaden składnik.
// 5. Brakujące składniki uzupełnia wybranymi nawozami jednoskładnikowymi.

const JEDNOSTKI = { m2: { nazwa: "m²", mnoznik: 1 }, ar: { nazwa: "ar", mnoznik: 100 }, ha: { nazwa: "ha", mnoznik: 10000 } };
const NAZWY_SKLADNIKOW = { N: "Azot (N)", P: "Fosfor (P₂O₅)", K: "Potas (K₂O)" };

// ----- Zasobność gleby -----
// mnoznik: jak zmienia się dawka P lub K przy danej klasie zasobności.
const KLASY_ZASOBNOSCI = [
  { id: "b-niska", nazwa: "bardzo niska", mnoznik: 1.5 },
  { id: "niska", nazwa: "niska", mnoznik: 1.3 },
  { id: "srednia", nazwa: "średnia", mnoznik: 1 },
  { id: "wysoka", nazwa: "wysoka", mnoznik: 0.7 },
  { id: "b-wysoka", nazwa: "bardzo wysoka", mnoznik: 0.3 }
];

// Granice klas (mg na 100 g gleby, metoda Egnera-Riehma – DL).
// Liczby to górne granice klas: bardzo niska / niska / średnia / wysoka (powyżej – bardzo wysoka).
const PROGI_P = [5, 10, 15, 20];
const KATEGORIE_GLEBY = {
  "bardzo-lekka": { nazwa: "bardzo lekka (piaski luźne i słabogliniaste)", progiK: [5, 7.5, 12.5, 17.5] },
  "lekka": { nazwa: "lekka (piaski gliniaste)", progiK: [7.5, 12.5, 17.5, 22.5] },
  "srednia": { nazwa: "średnia (gliny lekkie, pyły)", progiK: [10, 15, 20, 25] },
  "ciezka": { nazwa: "ciężka (gliny średnie i ciężkie, iły)", progiK: [12.5, 20, 25, 30] }
};

function klasaZWyniku(wartosc, progi) {
  const i = progi.findIndex((granica) => wartosc <= granica);
  return KLASY_ZASOBNOSCI[i === -1 ? 4 : i];
}

// Wyniki badania gleby zapamiętujemy w przeglądarce, żeby nie wpisywać ich przy każdej roślinie.
const KLUCZ_BADANIA = "doradca-badanie-gleby";
function wczytajBadanie() {
  try { return JSON.parse(localStorage.getItem(KLUCZ_BADANIA)) || {}; } catch { return {}; }
}
function zapiszBadanie(dane) {
  try { localStorage.setItem(KLUCZ_BADANIA, JSON.stringify(dane)); } catch { /* brak dostępu – trudno */ }
}

// pH rośliny z tekstu "6,0–7,0" -> { min: 6, max: 7 }
function zakresPh(r) {
  const [min, max] = r.gleba.ph.split(/[–-]/).map((x) => parseFloat(x.replace(",", ".")));
  return { min, max };
}

// ----- Formatowanie -----
function formatujMase(gramy) {
  if (gramy >= 1000000) return `${(gramy / 1000000).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} t`;
  if (gramy >= 1000) return `${(gramy / 1000).toLocaleString("pl-PL", { maximumFractionDigits: gramy >= 100000 ? 0 : 1 })} kg`;
  return `${Math.round(gramy).toLocaleString("pl-PL")} g`;
}

function formatujObjetosc(litry) {
  if (litry >= 1000) return `${(litry / 1000).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} m³`;
  return `${litry.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} l`;
}

function formatujNaM2(gramy) {
  return `${gramy.toLocaleString("pl-PL", { maximumFractionDigits: gramy < 10 ? 1 : 0 })} g/m²`;
}

function opcjeNawozow(grupa, wybrany, zPusta) {
  const pusta = zPusta ? `<option value="">— nie stosuję —</option>` : "";
  return pusta + NAWOZY.filter((n) => n.grupa === grupa)
    .map((n) => `<option value="${n.id}" ${n.id === wybrany ? "selected" : ""}>${n.nazwa}</option>`)
    .join("");
}

function opcjeKlas(wybrana) {
  return KLASY_ZASOBNOSCI.map((k) => `<option value="${k.id}" ${k.id === wybrana ? "selected" : ""}>${k.nazwa}</option>`).join("");
}

function domyslneNawozy(r) {
  return {
    N: r.kwasolubna ? "siarczan-amonu" : "saletra-amonowa",
    P: "superfosfat-potrojny",
    K: r.bezChloru ? "siarczan-potasu" : "sol-potasowa"
  };
}

// ----- Obliczenia (wszystko w g/m²) -----
function obliczDawki(r, opcje) {
  const klasaP = KLASY_ZASOBNOSCI.find((k) => k.id === opcje.klasaP);
  const klasaK = KLASY_ZASOBNOSCI.find((k) => k.id === opcje.klasaK);
  const potrzeba = { N: r.dawka.N, P: r.dawka.P * klasaP.mnoznik, K: r.dawka.K * klasaK.mnoznik };
  const pozostalo = { ...potrzeba };

  // Nawóz naturalny: kg/m² × % składnika × wykorzystanie w 1. roku -> g/m²
  let naturalny = null;
  if (opcje.naturalny && opcje.dawkaNaturalnego > 0) {
    const n = opcje.naturalny;
    const dostarcza = {};
    const lacznie = {};
    for (const s of ["N", "P", "K"]) {
      lacznie[s] = opcje.dawkaNaturalnego * 1000 * (n.sklad[s] / 100);
      dostarcza[s] = lacznie[s] * n.wykorzystanie[s];
      pozostalo[s] = Math.max(0, pozostalo[s] - dostarcza[s]);
    }
    naturalny = { nawoz: n, kgNaM2: opcje.dawkaNaturalnego, dostarcza, lacznie };
  }

  const pozycje = [];
  if (opcje.idNPK) {
    const npk = NAWOZY.find((n) => n.id === opcje.idNPK);
    const dawka = Math.min(...["N", "P", "K"]
      .filter((s) => npk.sklad[s] > 0)
      .map((s) => pozostalo[s] / (npk.sklad[s] / 100)));
    if (dawka > 0.05) {
      pozycje.push({ nawoz: npk, gNaM2: dawka });
      for (const s of ["N", "P", "K"]) pozostalo[s] -= dawka * (npk.sklad[s] / 100);
    }
  }

  for (const s of ["N", "P", "K"]) {
    const id = opcje.pojedyncze[s];
    if (!id || pozostalo[s] < 0.05) continue;
    const nawoz = NAWOZY.find((n) => n.id === id);
    pozycje.push({ nawoz, gNaM2: pozostalo[s] / (nawoz.sklad[s] / 100) });
    pozostalo[s] = 0;
  }

  return { potrzeba, naturalny, pozycje, pozostalo };
}

// ----- Interfejs -----
// Jeśli wyborRosliny = true, pokazuje listę wyboru rośliny (osobna strona kalkulatora).
function rysujKalkulator(kontener, roslinaId, wyborRosliny) {
  const r = ROSLINY.find((x) => x.id === roslinaId) || ROSLINY[0];
  const dom = domyslneNawozy(r);
  const rolnicza = r.kategoria === "Rolnicze"; // pola liczymy w hektarach, ogródki w m²
  const badanie = wczytajBadanie();
  const maBadanie = badanie.p || badanie.k || badanie.ph;

  const wyborHtml = wyborRosliny
    ? `<label class="pole">Roślina
        <select data-k="roslina">${ROSLINY.map((x) => `<option value="${x.id}" ${x.id === r.id ? "selected" : ""}>${x.ikona} ${x.nazwa}</option>`).join("")}</select>
      </label>`
    : "";

  kontener.innerHTML = `
    <div class="kalk">
      <div class="kalk-pola">
        ${wyborHtml}
        <label class="pole">Powierzchnia
          <span class="razem">
            <input type="number" data-k="pow" value="${rolnicza ? 1 : 10}" min="0" step="any" inputmode="decimal">
            <select data-k="jedn">
              <option value="m2">m²</option><option value="ar">ar</option><option value="ha" ${rolnicza ? "selected" : ""}>ha</option>
            </select>
          </span>
        </label>

        <fieldset class="grupa">
          <legend>🧪 Gleba</legend>
          <details class="badanie" ${maBadanie ? "open" : ""}>
            <summary>Mam wyniki badania gleby z laboratorium</summary>
            <p class="slaby maly">Wpisz liczby z wyniku badania (np. z Okręgowej Stacji Chemiczno-Rolniczej).
              Zasobność to ilość fosforu i potasu <strong>przyswajalnego</strong> dla roślin, podawana w mg na 100 g gleby.
              Progi klas dotyczą metody Egnera-Riehma (DL) – jeśli laboratorium użyło innej metody (np. Mehlich 3), wybierz klasę z wyniku ręcznie poniżej.
              Wyniki zapamiętamy w tej przeglądarce.</p>
            <label class="pole">Kategoria agronomiczna gleby
              <select data-k="kat">
                ${Object.entries(KATEGORIE_GLEBY).map(([id, k]) => `<option value="${id}" ${id === (badanie.kat || "srednia") ? "selected" : ""}>${k.nazwa}</option>`).join("")}
              </select>
            </label>
            <div class="trzy">
              <label class="pole">P₂O₅ <span class="jedn">mg/100 g</span>
                <input type="number" data-k="labP" min="0" step="0.1" inputmode="decimal" value="${badanie.p ?? ""}" placeholder="np. 12,4">
              </label>
              <label class="pole">K₂O <span class="jedn">mg/100 g</span>
                <input type="number" data-k="labK" min="0" step="0.1" inputmode="decimal" value="${badanie.k ?? ""}" placeholder="np. 9,8">
              </label>
              <label class="pole">pH <span class="jedn">w KCl</span>
                <input type="number" data-k="labPh" min="3" max="9" step="0.1" inputmode="decimal" value="${badanie.ph ?? ""}" placeholder="np. 5,8">
              </label>
            </div>
            <button type="button" class="link-przycisk" data-k="wyczysc">Wyczyść wyniki</button>
          </details>
          <div class="dwa">
            <label class="pole">Zasobność w fosfor (P)
              <select data-k="klasaP">${opcjeKlas("srednia")}</select>
            </label>
            <label class="pole">Zasobność w potas (K)
              <select data-k="klasaK">${opcjeKlas("srednia")}</select>
            </label>
          </div>
        </fieldset>

        <fieldset class="grupa">
          <legend>♻️ Nawóz naturalny</legend>
          <label class="pole">Rodzaj
            <select data-k="nat">
              <option value="">— nie stosuję —</option>
              ${NAWOZY_NATURALNE.map((n) => `<option value="${n.id}">${n.ikona} ${n.nazwa}</option>`).join("")}
            </select>
          </label>
          <label class="pole" data-k="natPole" hidden>Dawka <span class="jedn" data-k="natJedn">kg/m²</span>
            <input type="number" data-k="natDawka" min="0" step="0.1" inputmode="decimal">
            <span class="slaby" data-k="natPrzelicz"></span>
          </label>
        </fieldset>

        <fieldset class="grupa">
          <legend>🧂 Nawozy mineralne</legend>
          <label class="pole">Nawóz wieloskładnikowy
            <select data-k="npk">${opcjeNawozow("NPK", "", true)}</select>
          </label>
          <label class="pole">Nawóz azotowy
            <select data-k="N">${opcjeNawozow("N", dom.N, true)}</select>
          </label>
          <label class="pole">Nawóz fosforowy
            <select data-k="P">${opcjeNawozow("P", dom.P, true)}</select>
          </label>
          <label class="pole">Nawóz potasowy
            <select data-k="K">${opcjeNawozow("K", dom.K, true)}</select>
          </label>
        </fieldset>
      </div>
      <div class="kalk-wynik" data-k="wynik"></div>
    </div>`;

  const kalk = kontener.querySelector(".kalk");
  const pole = (k) => kalk.querySelector(`[data-k="${k}"]`);
  const liczbaZPola = (k) => {
    const v = parseFloat(String(pole(k).value).replace(",", "."));
    return Number.isFinite(v) ? v : null;
  };

  // Wyniki z laboratorium ustawiają (i blokują) klasy zasobności.
  function zastosujBadanie() {
    const kat = KATEGORIE_GLEBY[pole("kat").value];
    const p = liczbaZPola("labP");
    const k = liczbaZPola("labK");
    const ph = liczbaZPola("labPh");
    zapiszBadanie({ kat: pole("kat").value, p, k, ph });

    pole("klasaP").disabled = p !== null;
    if (p !== null) pole("klasaP").value = klasaZWyniku(p, PROGI_P).id;
    pole("klasaK").disabled = k !== null;
    if (k !== null) pole("klasaK").value = klasaZWyniku(k, kat.progiK).id;
    return { p, k, ph };
  }

  function przelicz() {
    const lab = zastosujBadanie();
    const powierzchnia = Math.max(0, parseFloat(pole("pow").value) || 0);
    const m2 = powierzchnia * JEDNOSTKI[pole("jedn").value].mnoznik;
    const naturalny = NAWOZY_NATURALNE.find((n) => n.id === pole("nat").value) || null;
    const dawkaNat = liczbaZPola("natDawka") || 0;

    // Opis dawki nawozu naturalnego w innych jednostkach.
    pole("natPole").hidden = !naturalny;
    if (naturalny) {
      const ciekly = naturalny.jednostka === "l";
      pole("natJedn").textContent = ciekly ? "l/m²" : "kg/m²";
      pole("natPrzelicz").textContent = `= ${(dawkaNat * 100).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} ${ciekly ? "l" : "kg"}/ar = ${(dawkaNat * 10).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} ${ciekly ? "m³" : "t"}/ha · typowo ${naturalny.dawka.min}–${naturalny.dawka.max}`;
    }

    const opcje = {
      klasaP: pole("klasaP").value,
      klasaK: pole("klasaK").value,
      naturalny,
      dawkaNaturalnego: dawkaNat,
      idNPK: pole("npk").value,
      pojedyncze: { N: pole("N").value, P: pole("P").value, K: pole("K").value }
    };
    const { potrzeba, naturalny: nat, pozycje, pozostalo } = obliczDawki(r, opcje);

    const klasaNazwa = (id) => KLASY_ZASOBNOSCI.find((k) => k.id === id).nazwa;
    const dopisek = { N: "", P: `zasobność ${klasaNazwa(opcje.klasaP)}`, K: `zasobność ${klasaNazwa(opcje.klasaK)}` };
    const zapotrzebowanie = ["N", "P", "K"].map((s) => `
      <div class="skladnik">
        <span class="kropka" style="background: var(--${s})"></span>
        <span>${NAZWY_SKLADNIKOW[s]}${dopisek[s] ? `<br><span class="slaby">${dopisek[s]}</span>` : ""}</span>
        <strong>${formatujNaM2(potrzeba[s])}</strong>
        <span class="slaby">${formatujMase(potrzeba[s] * m2)} łącznie</span>
      </div>`).join("");

    let naturalnyHtml = "";
    if (nat) {
      const ciekly = nat.nawoz.jednostka === "l";
      const ilosc = ciekly ? formatujObjetosc(nat.kgNaM2 * m2) : formatujMase(nat.kgNaM2 * 1000 * m2);
      naturalnyHtml = `
        <h4>${nat.nawoz.ikona} ${nat.nawoz.nazwa}</h4>
        <div class="nat-wynik">
          <p>Rozrzuć <strong>${ilosc}</strong> na całą powierzchnię (${nat.kgNaM2.toLocaleString("pl-PL")} ${ciekly ? "l" : "kg"}/m²).</p>
          <p class="slaby">W pierwszym roku roślina wykorzysta z niego ok.:
            N ${formatujNaM2(nat.dostarcza.N)}, P₂O₅ ${formatujNaM2(nat.dostarcza.P)}, K₂O ${formatujNaM2(nat.dostarcza.K)}.
            Reszta zadziała w kolejnych latach.</p>
        </div>`;
    }

    const wiersze = pozycje.map((p) => `
      <tr>
        <td>${p.nawoz.nazwa}<br><span class="slaby">${p.nawoz.uwagi}</span></td>
        <td class="liczba">${formatujNaM2(p.gNaM2)}</td>
        <td class="liczba"><strong>${formatujMase(p.gNaM2 * m2)}</strong></td>
      </tr>`).join("");

    const wszystkoPokryte = ["N", "P", "K"].every((s) => pozostalo[s] < 0.05);
    let mineralneHtml;
    if (!m2) mineralneHtml = `<p class="slaby">Podaj powierzchnię.</p>`;
    else if (pozycje.length) mineralneHtml = `
      <table class="tabela">
        <thead><tr><th>Nawóz</th><th class="liczba">Dawka</th><th class="liczba">Razem</th></tr></thead>
        <tbody>${wiersze}</tbody>
      </table>`;
    else if (wszystkoPokryte) mineralneHtml = `<p>✅ Nawóz naturalny i zasobność gleby pokrywają potrzeby – nawozy mineralne nie są potrzebne.</p>`;
    else mineralneHtml = `<p class="slaby">Wybierz co najmniej jeden nawóz.</p>`;

    // Ostrzeżenia
    const ostrzezenia = [];
    const niepokryte = ["N", "P", "K"].filter((s) => pozostalo[s] >= 0.05).map((s) => NAZWY_SKLADNIKOW[s].toLowerCase());
    if (niepokryte.length) ostrzezenia.push(`Nie pokryto zapotrzebowania na: ${niepokryte.join(", ")} – wybierz odpowiedni nawóz.`);
    if (r.bezChloru && pole("K").value === "sol-potasowa" && pozycje.some((p) => p.nawoz.id === "sol-potasowa")) ostrzezenia.push("Ta roślina jest wrażliwa na chlor – lepiej wybrać siarczan potasu.");
    if (r.kwasolubna && ["saletra-wapniowa", "saletra-amonowa"].includes(pole("N").value)) ostrzezenia.push("Roślina kwasolubna – zalecany siarczan amonu, który zakwasza glebę.");
    if (naturalny && naturalnyOdradzany(r.id, naturalny)) ostrzezenia.push(`Ten nawóz nie jest polecany dla tej rośliny: ${OBORNIK_DLA_ROSLIN[r.id].uwagi}`);
    if (nat && nat.lacznie.N > 17 && (rolnicza || pole("jedn").value === "ha")) ostrzezenia.push(`Dawka zawiera ok. ${Math.round(nat.lacznie.N * 10)} kg N/ha – powyżej limitu 170 kg N/ha z nawozów naturalnych (program azotanowy, dotyczy gospodarstw rolnych).`);
    if (nat && nat.kgNaM2 > nat.nawoz.dawka.max * 1.5) ostrzezenia.push("Dawka nawozu naturalnego jest znacznie wyższa niż typowa – ryzyko przenawożenia.");

    // pH z badania
    if (lab.ph !== null) {
      const { min, max } = zakresPh(r);
      if (lab.ph < min) ostrzezenia.push(`pH gleby ${lab.ph.toLocaleString("pl-PL")} jest niższe niż optymalne dla tej rośliny (${r.gleba.ph}) – rozważ wapnowanie (osobno od obornika). Przy kwaśnej glebie rośliny słabiej pobierają fosfor.`);
      else if (lab.ph > max) ostrzezenia.push(`pH gleby ${lab.ph.toLocaleString("pl-PL")} jest wyższe niż optymalne (${r.gleba.ph})${r.kwasolubna ? " – zakwaszaj glebę (siarka, kwaśny torf, kora sosnowa)" : " – nie wapnuj, stosuj nawozy zakwaszające (np. siarczan amonu)"}.`);
      else ostrzezenia.push(`✅ pH gleby ${lab.ph.toLocaleString("pl-PL")} mieści się w zakresie optymalnym dla tej rośliny.`);
    }

    pole("wynik").innerHTML = `
      <h4>Zapotrzebowanie na sezon ${m2 ? `(${m2.toLocaleString("pl-PL")} m²)` : ""}</h4>
      <div class="skladniki">${zapotrzebowanie}</div>
      ${naturalnyHtml}
      <h4>${nat ? "Uzupełnienie nawozami mineralnymi" : "Ile nawozu kupić i wysiać"}</h4>
      ${mineralneHtml}
      ${ostrzezenia.map((o) => `<p class="ostrz">${o.startsWith("✅") ? "" : "⚠️ "}${o}</p>`).join("")}
      <p class="slaby maly">Dawki są orientacyjne. Azot najlepiej podzielić na 2–3 dawki (patrz harmonogram nawożenia).
        ${lab.p === null && lab.k === null ? "Dokładniej policzymy po wpisaniu wyników badania gleby." : ""}</p>`;
  }

  kalk.addEventListener("input", przelicz);
  kalk.addEventListener("change", (e) => {
    const k = e.target.dataset.k;
    if (k === "roslina") {
      location.hash = `kalkulator/${e.target.value}`;
      return;
    }
    if (k === "nat") {
      const n = NAWOZY_NATURALNE.find((x) => x.id === e.target.value);
      let dawka = n ? zalecanaDawkaNaturalnego(r.id, n) : "";
      // W uprawach rolniczych nie przekraczamy limitu 170 kg N/ha (= 17 g N/m²).
      if (n && rolnicza) dawka = Math.min(dawka, Math.floor((17 / (n.sklad.N * 10)) * 10) / 10);
      pole("natDawka").value = dawka;
    }
    przelicz();
  });
  pole("wyczysc").addEventListener("click", () => {
    ["labP", "labK", "labPh"].forEach((k) => (pole(k).value = ""));
    przelicz();
  });

  przelicz();
}
