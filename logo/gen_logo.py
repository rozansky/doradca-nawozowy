import base64, pathlib, sys

OUT = pathlib.Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
N, P, K = "#3b82c4", "#c4573b", "#8a5bc4"
FONT = 'font-family="system-ui,Segoe UI,sans-serif"'

DEFS = """
<linearGradient id="lisc1" gradientUnits="userSpaceOnUse" x1="22" y1="34" x2="64" y2="68"><stop offset="0" stop-color="#a5dc8f"/><stop offset="1" stop-color="#4caf50"/></linearGradient>
<linearGradient id="lisc2" gradientUnits="userSpaceOnUse" x1="110" y1="16" x2="64" y2="56"><stop offset="0" stop-color="#7cc576"/><stop offset="1" stop-color="#1f6b22"/></linearGradient>
<linearGradient id="gleba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6440"/><stop offset="1" stop-color="#4e341d"/></linearGradient>
<g id="kielek">
  <path d="M64 100 C64 82 64 70 64 54" stroke="#2f7d32" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M64 68 C44 68 26 56 22 34 C48 34 62 46 64 68 Z" fill="url(#lisc1)"/>
  <path d="M64 56 C68 30 84 16 110 16 C108 42 90 58 64 56 Z" fill="url(#lisc2)"/>
  <path d="M62 66 Q42 54 28 38" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M66 54 Q86 38 104 22" stroke="#fff" stroke-opacity=".4" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</g>"""


def gran(x, y, r, c):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
            f'<circle cx="{x - r/3:.2f}" cy="{y - r/3:.2f}" r="{r/3:.2f}" fill="#fff" fill-opacity=".55"/>')


def litera(x, y, t, s):
    return f'<text x="{x}" y="{y + s*0.36:.2f}" {FONT} font-weight="800" font-size="{s}" fill="#fff" text-anchor="middle">{t}</text>'


def kielek(x, y, s):
    return f'<use href="#kielek" transform="translate({x} {y}) scale({s}) translate(-64 -100)"/>'


def svg(vb, defs, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">\n<defs>{DEFS}{defs}</defs>\n{body}\n</svg>\n'


KORZENIE = f"""
<path d="M8 72 Q64 62 120 72 L120 114 Q64 124 8 114 Z" fill="url(#gleba)"/>
<g stroke="#ecdcb9" stroke-width="3" stroke-linecap="round" fill="none">
  <path d="M64 70 C64 84 50 92 36 100"/><path d="M64 70 L64 100"/><path d="M64 70 C64 84 78 92 92 100"/>
  <path d="M60 84 L52 81 M68 84 L76 81" stroke-width="2"/>
</g>
{gran(34,102,8,N)}{gran(64,104,8,P)}{gran(94,102,8,K)}
{litera(34,102,'N',9)}{litera(64,104,'P',9)}{litera(94,102,'K',9)}
<path d="M8 72 Q64 62 120 72" stroke="#6b4a2b" stroke-width="3" fill="none" stroke-linecap="round"/>
{kielek(64,70,.64)}"""

KROPLA = "M64 8 C88 36 104 58 104 80 A40 40 0 0 1 24 80 C24 58 40 36 64 8 Z"
KOLBA = "M54 52 L54 70 L24 112 Q20 120 30 120 L98 120 Q108 120 104 112 L74 70 L74 52"

pliki = {
"a-kropla.svg": svg("0 0 128 128", f"""
<linearGradient id="woda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1faee"/><stop offset="1" stop-color="#cfe9c9"/></linearGradient>
<clipPath id="wn"><path d="{KROPLA}"/></clipPath>""", f"""
<path d="{KROPLA}" fill="url(#woda)"/>
<g clip-path="url(#wn)">
  <path d="M10 92 Q64 82 118 92 L118 128 L10 128 Z" fill="url(#gleba)"/>
  {gran(48,106,5,N)}{gran(64,111,5,P)}{gran(80,106,5,K)}
</g>
{kielek(64,90,.55)}
<path d="{KROPLA}" fill="none" stroke="#2f7d32" stroke-width="4"/>"""),

"b-korzenie.svg": svg("0 0 128 128", "", KORZENIE),

"c-emblemat.svg": svg("0 0 128 128", """
<linearGradient id="niebo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset="1" stop-color="#f4fbf1"/></linearGradient>
<clipPath id="sr"><circle cx="64" cy="64" r="43"/></clipPath>
<path id="gora" d="M15 64 A49 49 0 0 1 113 64"/>
<path id="dol" d="M8 64 A56 56 0 0 0 120 64"/>""", f"""
<circle cx="64" cy="64" r="62" fill="#2f7d32"/>
<circle cx="64" cy="64" r="59" fill="none" stroke="#e3f1e1" stroke-width="1" stroke-opacity=".6"/>
<g clip-path="url(#sr)">
  <rect width="128" height="128" fill="url(#niebo)"/>
  <circle cx="90" cy="40" r="8" fill="#f2c94c"/>
  <path d="M10 84 Q64 76 118 84 L118 128 L10 128 Z" fill="url(#gleba)"/>
  {gran(50,98,5,N)}{gran(64,102,5,P)}{gran(78,98,5,K)}
</g>
{kielek(64,84,.5)}
<circle cx="64" cy="64" r="43" fill="none" stroke="#e3f1e1" stroke-width="2"/>
<text {FONT} font-weight="700" font-size="10.5" letter-spacing="1.6" fill="#fff"><textPath href="#gora" startOffset="50%" text-anchor="middle">DORADCA NAWOZOWY</textPath></text>
<text {FONT} font-weight="700" font-size="9" letter-spacing="3" fill="#cfe9c9"><textPath href="#dol" startOffset="50%" text-anchor="middle">• N • P • K •</textPath></text>"""),

"d-kolba.svg": svg("0 0 128 128", f"""
<linearGradient id="plyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8b0"/><stop offset="1" stop-color="#3f9a6a"/></linearGradient>
<clipPath id="kb"><path d="{KOLBA} Z"/></clipPath>""", f"""
<path d="{KOLBA} Z" fill="#f1faee"/>
<g clip-path="url(#kb)">
  <path d="M0 92 Q32 88 64 92 T128 92 L128 128 L0 128 Z" fill="url(#plyn)"/>
  {gran(46,108,6,N)}{gran(66,102,6,P)}{gran(84,110,6,K)}
  <circle cx="56" cy="96" r="2" fill="#fff" fill-opacity=".7"/><circle cx="76" cy="98" r="1.5" fill="#fff" fill-opacity=".7"/>
</g>
{kielek(64,64,.56)}
<path d="{KOLBA}" fill="none" stroke="#2f7d32" stroke-width="4" stroke-linejoin="round"/>
<path d="M48 52 L80 52" stroke="#2f7d32" stroke-width="5" stroke-linecap="round"/>
<path d="M36 104 L44 92" stroke="#fff" stroke-opacity=".7" stroke-width="2.5" stroke-linecap="round"/>"""),

"e-heksagon.svg": svg("0 0 128 128", """
<linearGradient id="hex" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#43a047"/><stop offset="1" stop-color="#1b5e20"/></linearGradient>
<linearGradient id="jasny" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cdeac6"/></linearGradient>""", f"""
<path d="M64 5 L115 34.5 L115 93.5 L64 123 L13 93.5 L13 34.5 Z" fill="url(#hex)"/>
<path d="M64 13 L108 38.5 L108 89.5 L64 115 L20 89.5 L20 38.5 Z" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>
<g transform="translate(64 82) scale(.52) translate(-64 -100)">
  <path d="M64 100 C64 82 64 70 64 54" stroke="#e3f1e1" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M64 68 C44 68 26 56 22 34 C48 34 62 46 64 68 Z" fill="#b8e0b0"/>
  <path d="M64 56 C68 30 84 16 110 16 C108 42 90 58 64 56 Z" fill="url(#jasny)"/>
</g>
<g stroke="#e3f1e1" stroke-width="3" stroke-linecap="round" fill="none"><path d="M42 98 L64 106 L86 98"/><path d="M64 84 L64 99" stroke-dasharray="2 4"/></g>
{gran(42,98,7,N)}{gran(64,106,7,P)}{gran(86,98,7,K)}
{litera(42,98,'N',8)}{litera(64,106,'P',8)}{litera(86,98,'K',8)}"""),

"f-pelne-logo.svg": svg("0 0 330 128", "", f"""{KORZENIE}
<text x="136" y="66" {FONT} font-weight="800" font-size="44" fill="#2f7d32" letter-spacing="-.5">Doradca</text>
<text x="138" y="100" {FONT} font-weight="600" font-size="24" fill="#a07a52" textLength="172" lengthAdjust="spacing">NAWOZOWY</text>
<path d="M138 110 L310 110" stroke="#a07a52" stroke-opacity=".35" stroke-width="1.5"/>
{gran(318,110,4,N)}{gran(318,98,4,P)}{gran(318,86,4,K)}"""),
}

opisy = {
"a-kropla.svg": ("Kiełek w kropli", "Kiełek zamknięty w kropli wody, pod nim przekrój gleby z granulkami NPK."),
"b-korzenie.svg": ("Korzenie sięgające po NPK", "Korzenie kiełka sięgają do trzech granulek N, P, K — roślina dosłownie „je” nawóz."),
"c-emblemat.svg": ("Emblemat", "Okrągła pieczęć z napisem na obwodzie: niebo, słońce, kiełek, gleba z granulkami."),
"d-kolba.svg": ("Kiełek z kolby", "Kiełek wyrasta z kolby laboratoryjnej z roztworem i granulkami — nauka + uprawa."),
"e-heksagon.svg": ("Heksagon-molekuła", "Sześciokąt jak w chemii, jasny kiełek i granulki NPK połączone wiązaniami."),
"f-pelne-logo.svg": ("Pełne logo z napisem", "Sygnet z korzeniami + napis Doradca / NAWOZOWY i trzy granulki."),
}

karty = []
for nazwa, tresc in pliki.items():
    (OUT / nazwa).write_text(tresc, encoding="utf-8")
    uri = "data:image/svg+xml;base64," + base64.b64encode(tresc.encode()).decode()
    tytul, opis = opisy[nazwa]
    szer = "szeroka" if "pelne" in nazwa else ""
    karty.append(f"""<div class="karta {szer}">
  <h2>{tytul}</h2><p class="pod">{opis} <code>runda2/{nazwa}</code></p>
  <div class="duze"><div><img src="{uri}" alt=""></div><div class="ciemne"><img src="{uri}" alt=""></div></div>
  <div class="naglowek"><img src="{uri}" alt="">{'' if szer else 'Doradca Nawozowy'}</div>
  <div class="male"><img src="{uri}" alt=""><img src="{uri}" alt=""><img src="{uri}" alt="">16 / 24 / 48 px</div>
</div>""")

strona = f"""<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Logo — runda 2</title>
<style>
:root {{ --tlo:#f6f8f3; --karta:#fff; --tekst:#1f2a1f; --slaby:#5b6b5b; --akcent:#2f7d32; --ramka:#dfe6da; }}
body {{ margin:0; padding:24px 16px; background:var(--tlo); color:var(--tekst); font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }}
h1 {{ font-size:1.4rem; margin:0 0 4px; }} p.opis {{ color:var(--slaby); margin:0 0 24px; }}
.siatka {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; max-width:1100px; }}
.karta {{ background:var(--karta); border:1px solid var(--ramka); border-radius:14px; overflow:hidden; }}
.karta.szeroka {{ grid-column:1/-1; }}
.karta h2 {{ font-size:1rem; margin:0; padding:12px 16px 0; }} .pod {{ color:var(--slaby); font-size:.85rem; padding:2px 16px 12px; margin:0; }}
.duze {{ display:grid; grid-template-columns:1fr 1fr; }} .duze div {{ display:grid; place-items:center; padding:20px; }}
.duze img {{ width:140px; height:140px; }} .szeroka .duze img {{ width:100%; max-width:440px; height:auto; }}
.ciemne {{ background:#1b221b; }}
.naglowek {{ display:flex; align-items:center; gap:10px; padding:12px 16px; border-top:1px solid var(--ramka); font-weight:700; font-size:1.15rem; color:var(--akcent); }}
.naglowek img {{ width:40px; height:40px; }} .szeroka .naglowek img {{ width:auto; height:44px; }}
.male {{ display:flex; align-items:center; gap:12px; padding:0 16px 14px; color:var(--slaby); font-size:.8rem; }}
.male img:nth-child(1) {{ height:16px; }} .male img:nth-child(2) {{ height:24px; }} .male img:nth-child(3) {{ height:48px; }}
.szeroka .male {{ display:none; }}
</style></head><body>
<h1>Doradca Nawozowy — logo, runda 2</h1>
<p class="opis">Rozwinięcia wariantu „kiełek z granulkami NPK”: gradienty, gleba w przekroju, korzenie, napisy.</p>
<div class="siatka">{''.join(karty)}</div>
</body></html>"""
(OUT.parent / "podglad-2.html").write_text(strona, encoding="utf-8")
print("ok", list(pliki))
