// ===== Przełącznik trybu jasny / ciemny =====
//
// Bez wyboru użytkownika strona idzie za ustawieniem systemu.
// Kliknięcie ustawia <html data-motyw="jasny|ciemny"> i zapamiętuje wybór w przeglądarce.

(function () {
  const html = document.documentElement;
  const przycisk = document.getElementById("przelacz-motyw");
  if (!przycisk) return;

  const systemCiemny = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const obecny = () => html.dataset.motyw || (systemCiemny() ? "ciemny" : "jasny");

  // Suwak (role="switch"): włączony = tryb ciemny.
  function opisz() {
    const ciemny = obecny() === "ciemny";
    przycisk.setAttribute("aria-checked", String(ciemny));
    przycisk.title = ciemny ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny";
  }

  przycisk.addEventListener("click", () => {
    const nowy = obecny() === "ciemny" ? "jasny" : "ciemny";
    html.dataset.motyw = nowy;
    try { localStorage.setItem("motyw", nowy); } catch (e) { /* tryb prywatny – trudno */ }
    opisz();
  });

  opisz();
})();
