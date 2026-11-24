// ===== Notatka z planem nawożenia (PDF i wydruk) =====
//
// Kalkulator po każdym przeliczeniu zapisuje "stan" (roślina, gleba, wyniki).
// Z niego budujemy osobny, jasny dokument A4 – niezależny od trybu ciemnego strony.

function bezpiecznyTekst(t) {
  return String(t ?? "").replace(/[&<>"']/g, (z) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
}

// Kiedy stosować dany nawóz mineralny (prosta reguła wg grupy nawozu).
function kiedyStosowac(nawoz, gNaM2, m2) {
  if (nawoz.grupa === "N") {
    const d1 = gNaM2 * 0.6, d2 = gNaM2 * 0.4;
    return `W 2 dawkach: <b>${formatujMase(d1 * m2)}</b> przed siewem/sadzeniem lub na start wegetacji, <b>${formatujMase(d2 * m2)}</b> pogłównie 3–6 tygodni później.`;
  }
  if (nawoz.grupa === "NPK") return "Jednorazowo przed siewem/sadzeniem (lub jesienią), wymieszać z glebą.";
  return "Przed siewem/sadzeniem (lub jesienią), wymieszać z wierzchnią warstwą gleby.";
}

function budujNotatke(s) {
  const r = s.r;
  const data = new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
  const tytulMiejsca = s.miejsce ? ` – ${bezpiecznyTekst(s.miejsce)}` : "";
  const pow = `${s.powierzchnia.toLocaleString("pl-PL")} ${JEDNOSTKI[s.jednostka].nazwa}` +
    (s.jednostka !== "m2" ? ` (${s.m2.toLocaleString("pl-PL")} m²)` : "");
  const brak = "—";
  const lab = (v) => (v === null || v === undefined ? brak : v.toLocaleString("pl-PL"));

  const zapotrzebowanie = ["N", "P", "K"].map((sk) => `
    <tr><td>${NAZWY_SKLADNIKOW[sk]}</td><td class="l">${formatujNaM2(s.potrzeba[sk])}</td><td class="l"><b>${formatujMase(s.potrzeba[sk] * s.m2)}</b></td></tr>`).join("");

  let naturalny = "";
  if (s.nat) {
    const n = s.nat.nawoz;
    const ciekly = n.jednostka === "l";
    const ilosc = ciekly ? formatujObjetosc(s.nat.kgNaM2 * s.m2) : formatujMase(s.nat.kgNaM2 * 1000 * s.m2);
    naturalny = `
      <h2>Nawóz naturalny</h2>
      <table>
        <tr><th>Nawóz</th><th class="l">Dawka</th><th class="l">Razem</th><th>Kiedy</th></tr>
        <tr>
          <td>${n.ikona} ${n.nazwa}</td>
          <td class="l">${s.nat.kgNaM2.toLocaleString("pl-PL")} ${ciekly ? "l" : "kg"}/m²<br><span class="s">${(s.nat.kgNaM2 * 10).toLocaleString("pl-PL")} ${ciekly ? "m³" : "t"}/ha</span></td>
          <td class="l"><b>${ilosc}</b></td>
          <td>${n.kiedy}</td>
        </tr>
      </table>
      <p class="s">W 1. roku dostarczy ok.: N ${formatujNaM2(s.nat.dostarcza.N)}, P₂O₅ ${formatujNaM2(s.nat.dostarcza.P)}, K₂O ${formatujNaM2(s.nat.dostarcza.K)} – uwzględnione w dawkach mineralnych poniżej.</p>`;
  }

  const mineralne = s.pozycje.length ? `
    <table>
      <tr><th>Nawóz</th><th class="l">Dawka</th><th class="l">Razem</th><th>Kiedy</th><th class="c">✓</th></tr>
      ${s.pozycje.map((p) => `
        <tr>
          <td>${p.nawoz.nazwa}</td>
          <td class="l">${formatujNaM2(p.gNaM2)}</td>
          <td class="l"><b>${formatujMase(p.gNaM2 * s.m2)}</b></td>
          <td>${kiedyStosowac(p.nawoz, p.gNaM2, s.m2)}</td>
          <td class="c"><span class="kratka"></span></td>
        </tr>`).join("")}
    </table>` : `<p>Nawozy mineralne nie są potrzebne.</p>`;

  const harmonogram = r.nawozenie.map((n) => `
    <li><span class="kratka"></span><div><b>${n.termin}</b><br>${n.zalecenie}</div></li>`).join("");

  const uwagi = s.ostrzezenia.length
    ? `<h2>Uwagi</h2><ul class="uwagi">${s.ostrzezenia.map((o) => `<li>${o.replace(/^✅\s*/, "")}</li>`).join("")}</ul>`
    : "";

  return `
  <div class="notatka">
    <style>
      .notatka { font-family: "Segoe UI", Roboto, Arial, sans-serif; color: #1f2a1f; background: #fff; font-size: 11.5pt; line-height: 1.45; width: 176mm; padding: 0; box-sizing: border-box; }
      .notatka .gora { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2f7d32; padding-bottom: 6px; margin-bottom: 14px; color: #2f7d32; font-weight: 700; }
      .notatka .gora span { color: #5b6b5b; font-weight: 400; font-size: 10pt; }
      .notatka .marka { display: flex; align-items: center; gap: 8px; }
      .notatka .marka img { width: 28px; height: 28px; }
      .notatka h1 { font-size: 19pt; margin: 0 0 2px; }
      .notatka .lac { color: #5b6b5b; font-style: italic; margin: 0 0 12px; }
      .notatka h2 { font-size: 13pt; margin: 18px 0 6px; color: #2f7d32; page-break-after: avoid; }
      .notatka table { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
      .notatka th { text-align: left; background: #eef5ec; padding: 6px 8px; font-size: 9.5pt; }
      .notatka td { padding: 6px 8px; border-bottom: 1px solid #dfe6da; vertical-align: top; }
      .notatka tr { page-break-inside: avoid; }
      .notatka .l { text-align: right; white-space: nowrap; }
      .notatka .c { text-align: center; width: 24px; }
      .notatka .s { color: #5b6b5b; font-size: 9.5pt; }
      .notatka .info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .notatka .info div { background: #f4f7f2; border-radius: 6px; padding: 6px 8px; }
      .notatka .info span { display: block; font-size: 8.5pt; color: #5b6b5b; }
      .notatka .kratka { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #1f2a1f; border-radius: 2px; flex: none; margin-top: 3px; }
      .notatka ul.harm { list-style: none; padding: 0; margin: 0; }
      .notatka ul.harm li { display: flex; gap: 10px; padding: 6px 0; border-bottom: 1px solid #dfe6da; page-break-inside: avoid; }
      .notatka ul.uwagi { margin: 0; padding-left: 18px; font-size: 10pt; }
      .notatka ul.uwagi li { margin-bottom: 4px; }
      .notatka .miejsce-na-notatki { border: 1px dashed #b9c4b4; border-radius: 6px; height: 70px; }
      .notatka .stopka { margin-top: 18px; padding-top: 8px; border-top: 1px solid #dfe6da; font-size: 8.5pt; color: #5b6b5b; }
    </style>

    <div class="gora"><div class="marka"><img src="logo/logo.svg" alt="" width="28" height="28">Plan nawożenia</div> <span>${data}</span></div>
    <h1>${r.ikona} ${r.nazwa}${tytulMiejsca}</h1>
    <p class="lac">${r.lacina}</p>

    <div class="info">
      <div><span>Powierzchnia</span><b>${pow}</b></div>
      <div><span>Gleba</span>${KATEGORIE_GLEBY[s.kat].nazwa.split(" (")[0]}</div>
      <div><span>pH (optymalne ${r.gleba.ph})</span>${lab(s.lab.ph)}</div>
      <div><span>P₂O₅ mg/100 g</span>${lab(s.lab.p)} → zasobność ${KLASY_ZASOBNOSCI.find((k) => k.id === s.klasaP).nazwa}</div>
      <div><span>K₂O mg/100 g</span>${lab(s.lab.k)} → zasobność ${KLASY_ZASOBNOSCI.find((k) => k.id === s.klasaK).nazwa}</div>
      <div><span>Źródło danych o glebie</span>${s.lab.p !== null || s.lab.k !== null ? "badanie laboratoryjne" : "ocena ręczna"}</div>
    </div>

    <h2>Zapotrzebowanie na sezon</h2>
    <table>
      <tr><th>Składnik</th><th class="l">Na 1 m²</th><th class="l">Na całą powierzchnię</th></tr>
      ${zapotrzebowanie}
    </table>

    ${naturalny}

    <h2>${s.nat ? "Nawozy mineralne (uzupełnienie)" : "Nawozy mineralne"}</h2>
    ${mineralne}

    <h2>Harmonogram</h2>
    <ul class="harm">${harmonogram}</ul>

    ${uwagi}

    <h2>Moje notatki</h2>
    <div class="miejsce-na-notatki"></div>

    <div class="stopka">Dawki orientacyjne, wyliczone w Doradcy Nawozowym. Środki ochrony roślin i nawozy stosuj zgodnie z etykietą.
      Dokładne zalecenia ustalisz na podstawie analizy gleby w Okręgowej Stacji Chemiczno-Rolniczej.</div>
  </div>`;
}

function nazwaPliku(s) {
  const czysc = (t) => normalizuj(t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `plan-nawozenia-${czysc(s.r.nazwa)}${s.miejsce ? "-" + czysc(s.miejsce) : ""}.pdf`;
}

// Biblioteka html2pdf ładowana dopiero po kliknięciu – strona działa bez niej.
let ladowanieHtml2pdf = null;
function zaladujHtml2pdf() {
  if (window.html2pdf) return Promise.resolve();
  if (!ladowanieHtml2pdf) {
    ladowanieHtml2pdf = new Promise((ok, blad) => {
      const skrypt = document.createElement("script");
      skrypt.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      skrypt.onload = ok;
      skrypt.onerror = () => { ladowanieHtml2pdf = null; blad(new Error("Nie udało się pobrać biblioteki PDF")); };
      document.head.appendChild(skrypt);
    });
  }
  return ladowanieHtml2pdf;
}

async function pobierzPdf(s) {
  await zaladujHtml2pdf();
  await html2pdf()
    .set({
      margin: [12, 15, 12, 15],
      filename: nazwaPliku(s),
      image: { type: "jpeg", quality: 0.95 },
      // scrollX/scrollY = 0: bez tego przewinięcie strony robi pustą przestrzeń na górze PDF.
      html2canvas: { scale: 2, backgroundColor: "#ffffff", scrollX: 0, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"], avoid: ["tr", "li", "h2"] }
    })
    .from(budujNotatke(s))
    .save();
}

// Wydruk: wstawiamy notatkę do osobnego kontenera, a CSS @media print ukrywa resztę strony.
function drukujNotatke(s) {
  let kontener = document.getElementById("notatka-druk");
  if (!kontener) {
    kontener = document.createElement("div");
    kontener.id = "notatka-druk";
    document.body.appendChild(kontener);
  }
  kontener.innerHTML = budujNotatke(s);
  // Logo to obrazek – czekamy, aż się wczyta, inaczej wydruk mógłby wyjść bez niego.
  const obrazki = [...kontener.querySelectorAll("img")].filter((img) => !img.complete);
  Promise.all(obrazki.map((img) => new Promise((gotowe) => { img.onload = img.onerror = gotowe; })))
    .then(() => window.print());
}
