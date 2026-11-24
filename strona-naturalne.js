// ===== Strona poradnika: Nawozy naturalne (#naturalne) =====

const OCENY = {
  tak: { tekst: "✅ tak", klasa: "ocena-tak" },
  umiarkowanie: { tekst: "🟡 z umiarem", klasa: "ocena-umiar" },
  nie: { tekst: "⛔ nie", klasa: "ocena-nie" }
};

function liczba(x) {
  return x.toLocaleString("pl-PL", { maximumFractionDigits: 2 });
}

// Zakres dawki w trzech jednostkach: "3–5 kg/m² · 300–500 kg/ar · 30–50 t/ha"
function zakresDawki(min, max, jednostka) {
  const ciekly = jednostka === "l";
  const z = (a, b) => (a === b ? liczba(a) : `${liczba(a)}–${liczba(b)}`);
  return `${z(min, max)} ${ciekly ? "l" : "kg"}/m² · ${z(min * 100, max * 100)} ${ciekly ? "l" : "kg"}/ar · ${z(min * 10, max * 10)} ${ciekly ? "m³" : "t"}/ha`;
}

function rysujStroneNaturalnych() {
  const karty = NAWOZY_NATURALNE.map((n) => `
    <article class="nat-karta">
      <header>
        <span class="nat-ikona">${n.ikona}</span>
        <div><h3>${n.nazwa}</h3><span class="typ">${n.charakter}</span></div>
      </header>
      <p>${n.opis}</p>
      <div class="nat-sklad">
        ${["N", "P", "K"].map((s) => `<div><span class="kropka" style="background: var(--${s})"></span>${{ N: "N", P: "P₂O₅", K: "K₂O" }[s]} <strong>${liczba(n.sklad[s])}%</strong></div>`).join("")}
      </div>
      <p class="nat-dawka"><strong>Typowa dawka:</strong><br>${zakresDawki(n.dawka.min, n.dawka.max, n.jednostka)}</p>
      <p><strong>Kiedy:</strong> ${n.kiedy}</p>
      <p><strong>Najlepszy do:</strong> ${n.najlepszy}</p>
      <p class="slaby">${n.uwagi}</p>
    </article>`).join("");

  const wierszeRoslin = ROSLINY.map((r) => {
    const o = OBORNIK_DLA_ROSLIN[r.id];
    if (!o) return "";
    const ocena = OCENY[o.ocena];
    return `
      <tr>
        <td><a href="#${r.id}">${r.ikona} ${r.nazwa}</a></td>
        <td><span class="ocena ${ocena.klasa}">${ocena.tekst}</span></td>
        <td class="liczba">${o.dawka[1] ? `${o.dawka[0]}–${o.dawka[1]} kg/m²<br><span class="slaby">${o.dawka[0] * 10}–${o.dawka[1] * 10} t/ha</span>` : "—"}</td>
        <td>${o.uwagi}</td>
      </tr>`;
  }).join("");

  wynik.innerHTML = `
    <div class="wynik-naglowek">
      <span class="ikona">♻️</span>
      <div>
        <h2>Nawozy naturalne</h2>
        <span class="lac">Obornik, kompost, pomiot, gnojowica – czym się różnią, ile ich dać i kiedy.</span>
      </div>
      <button class="wroc" id="wroc">← Wszystkie rośliny</button>
    </div>

    <p>Nawozy naturalne dostarczają azotu, fosforu, potasu i mikroelementów, ale przede wszystkim
      <strong>próchnicy</strong> – poprawiają strukturę gleby, jej zdolność do zatrzymywania wody i życie mikrobiologiczne.
      Działają wolniej niż nawozy mineralne: w pierwszym roku roślina wykorzystuje tylko część składników (z obornika ok. 30% azotu),
      a reszta uwalnia się przez kolejne 2–3 lata.</p>

    <div class="przelicznik">
      <h4>📏 Przelicznik jednostek</h4>
      <ul>
        <li><strong>1 kg/m²</strong> = 100 kg/ar = <strong>10 t/ha</strong></li>
        <li>Taczka obornika (80–100 l) ≈ <strong>50–70 kg</strong></li>
        <li>Wiadro 10 l ≈ <strong>6–7 kg</strong> obornika lub kompostu</li>
        <li>Przykład: 4 kg/m² na zagon 10 m² = 40 kg ≈ <strong>niecała taczka</strong></li>
      </ul>
    </div>

    <h3>🐄 Rodzaje nawozów naturalnych</h3>
    <div class="nat-siatka">${karty}</div>

    <h3>🔍 Skąd brać obornik i na co uważać</h3>
    <ul class="harmonogram">
      <li><strong>Wybieraj przefermentowany (dojrzały)</strong>Obornik leżący w pryzmie 4–6 miesięcy jest ciemny, kruchy i nie śmierdzi amoniakiem. Świeży może parzyć korzenie i zawiera dużo żywych nasion chwastów.</li>
      <li><strong>Zapytaj o pochodzenie</strong>Najlepszy jest obornik z małego gospodarstwa, gdzie zwierzęta jedzą siano i paszę z własnych łąk. Unikaj obornika od zwierząt karmionych sianem z pól pryskanych herbicydami z grupy pikolinowej (np. aminopyralid, chlopyralid) – ich resztki przechodzą przez zwierzę i potrafią zniszczyć pomidory, ziemniaki i fasolę.</li>
      <li><strong>Sprawdź ściółkę</strong>Najlepsza jest słoma. Obornik z dużą ilością trocin lub wiórów wiąże azot w glebie podczas rozkładu – trzeba go dłużej kompostować.</li>
      <li><strong>Unikaj odchodów psów, kotów i ludzi</strong>Mogą zawierać pasożyty i bakterie chorobotwórcze – nie nadają się na grządki.</li>
      <li><strong>Przechowuj w pryzmie</strong>Przykrytej (folią lub słomą) i na utwardzonym podłożu – deszcz wypłukuje składniki, a słońce i wiatr powodują straty azotu.</li>
    </ul>

    <h3>📅 Zasady stosowania</h3>
    <ul class="harmonogram">
      <li><strong>Najlepiej jesienią</strong>Rozrzucić i od razu przekopać lub przyorać (najpóźniej następnego dnia) – inaczej azot ulatnia się do powietrza.</li>
      <li><strong>Co 3–4 lata na ten sam zagon</strong>Klasyczny płodozmian: 1. rok – rośliny wymagające (kapustne, dyniowate, pomidor, ziemniak, kukurydza); 2. rok – średnio wymagające (cebula, por, burak, sałata); 3. rok – mało wymagające (marchew, pietruszka, groch, fasola).</li>
      <li><strong>Nie łącz z wapnem</strong>Wapno wapniowe lub tlenkowe razem z obornikiem powoduje duże straty azotu. Wapnuj osobno – z kilkutygodniowym odstępem lub w innym roku.</li>
      <li><strong>Uwzględnij w nawożeniu mineralnym</strong>Składniki z obornika odejmij od dawki nawozów mineralnych – kalkulator na stronie robi to automatycznie.</li>
    </ul>

    <div class="uwaga">
      <strong>Przepisy (gospodarstwa rolne):</strong> zgodnie z programem azotanowym dawka nawozów naturalnych nie może przekroczyć
      <strong>170 kg azotu na 1 ha rocznie</strong> (ok. 34 t/ha obornika bydlęcego). Obowiązuje też zakaz stosowania w okresie zimowym
      oraz na glebie zamarzniętej, zalanej lub pokrytej śniegiem. Terminy sprawdź w aktualnym programie azotanowym.
    </div>

    <h3>🌱 Czy obornik sprawdzi się przy mojej roślinie?</h3>
    <p class="slaby">Dawki dla obornika bydlęcego. Dla innych rodzajów przelicz według kart powyżej lub użyj kalkulatora.</p>
    <div class="tabela-przewijana">
      <table class="tabela">
        <thead><tr><th>Roślina</th><th>Obornik</th><th class="liczba">Dawka</th><th>Uwagi</th></tr></thead>
        <tbody>${wierszeRoslin}</tbody>
      </table>
    </div>

    <p style="margin-top: 20px"><a href="#kalkulator" class="przycisk">🧮 Policz dawkę w kalkulatorze</a></p>
  `;
  podepnijPrzyciskWroc();
}

// Krótka informacja o oborniku do karty rośliny.
function infoOObornikuHtml(roslinaId) {
  const o = OBORNIK_DLA_ROSLIN[roslinaId];
  if (!o) return "";
  const ocena = OCENY[o.ocena];
  const dawka = o.dawka[1] ? ` – <strong>${o.dawka[0]}–${o.dawka[1]} kg/m²</strong> (${o.dawka[0] * 10}–${o.dawka[1] * 10} t/ha) obornika bydlęcego` : "";
  return `
    <div class="obornik-info">
      <span class="ocena ${ocena.klasa}">Obornik: ${ocena.tekst}</span>${dawka}
      <p>${o.uwagi} <a href="#naturalne">Więcej o nawozach naturalnych →</a></p>
    </div>`;
}
