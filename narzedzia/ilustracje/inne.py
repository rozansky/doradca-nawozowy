"""Szczegółowe ilustracje: róża, trawnik, tuja, zboża, kukurydza, soja."""
import math
import random
from narzedzia import Rys, cien, odblask, lisc, lodyga, platki_kielicha, f

R = {}


# ---------------- RÓŻA ----------------
def roza():
    rng = random.Random(21)
    r = Rys(("#FFF0F3", "#F8D3DC"))
    cien(r, 104, 186, 40, 6, .12)
    lodyga(r, "M100 100C98 130 106 160 102 200", 5.5, ("#5E9A3F", "#2D5E22"))
    for y in (124, 146, 170):
        strona = 1 if y % 2 else -1
        r.add(f'<path d="M{f(102 + strona * 2)} {y}l{strona * 7} -3l{-strona * 6} 6z" fill="#8A4A2E"/>')
    # liście złożone
    for (x, y, k) in ((101, 136, -150), (103, 158, -30)):
        lodyga(r, f"M{x} {y}l{f(math.cos(math.radians(k)) * 26)} {f(math.sin(math.radians(k)) * 26)}", 2.2)
        bx, by = x + math.cos(math.radians(k)) * 26, y + math.sin(math.radians(k)) * 26
        lisc(r, bx, by, 26, 10, k, ("#7FBE5E", "#3E8A38", "#205A22"), zylki=4, zabki=7)
        for d in (-1, 1):
            px, py = x + math.cos(math.radians(k)) * 14, y + math.sin(math.radians(k)) * 14
            lisc(r, px, py, 22, 8.5, k + d * 50, ("#7FBE5E", "#3E8A38", "#205A22"), zylki=3, zabki=6)
    platki_kielicha(r, 100, 96, 5, 26, 4, 60)

    def platek(cx, cy, L, w, kat, kol, sx=1, sy=.82):
        g = r.rad([(0, kol[0]), (.55, kol[1]), (.9, kol[2]), (1, kol[3])], .5, .95, 1)
        d = (f"M0 0C{f(-w * .9)} {f(-L * .2)} {f(-w)} {f(-L * .75)} {f(-w * .45)} {f(-L)}"
             f"C{f(-w * .15)} {f(-L * 1.06)} {f(w * .15)} {f(-L * .98)} {f(w * .45)} {f(-L)}"
             f"C{f(w)} {f(-L * .75)} {f(w * .9)} {f(-L * .2)} 0 0Z")
        return (f'<g transform="translate({f(cx)} {f(cy)}) scale({sx} {sy}) rotate({f(kat)})">'
                f'<path d="{d}" fill="{g}"/>'
                f'<path d="M{f(-w * .55)} {f(-L * .97)}Q0 {f(-L * 1.1)} {f(w * .55)} {f(-L * .97)}" stroke="{kol[3]}" stroke-width="1.6" fill="none" opacity=".8"/>'
                f'<path d="M0 -4L0 {f(-L * .7)}" stroke="#6E0B22" stroke-opacity=".18" stroke-width="1"/></g>')

    cx, cy = 100, 72
    kol_zew = ("#7E0A22", "#C81E3E", "#E9455F", "#F78FA2")
    kol_sr = ("#6A061B", "#B5153A", "#DD3654", "#F57A90")
    kol_wew = ("#5A0416", "#A20F31", "#CF2A4A", "#EE6A82")
    s = []
    for i in range(7):
        s.append(platek(cx, cy, 46 + rng.uniform(-3, 3), 30, i * 360 / 7 + 10, kol_zew))
    for i in range(6):
        s.append(platek(cx, cy, 36, 24, i * 60 + 35, kol_sr))
    for i in range(5):
        s.append(platek(cx, cy - 2, 26, 18, i * 72 + 5, kol_wew))
    r.add("".join(s))
    g = r.rad([(0, "#4A0312"), (.7, "#8E0C2C"), (1, "#C92345")], .5, .55, .6)
    r.add(f'<ellipse cx="{cx}" cy="{cy - 4}" rx="17" ry="13" fill="{g}"/>')
    r.add(f'<path d="M{cx} {cy - 4}m-3 0a3 2.4 0 1 1 6 0a6 4.8 0 1 1 -12 0a9 7.2 0 1 1 18 0a12 9.6 0 1 1 -24 0"'
          f' stroke="#F37E95" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>')
    odblask(r, 78, 58, 10, 4, -30, .35, False)
    return r.svg()


# ---------------- TRAWNIK ----------------
def trawnik():
    rng = random.Random(22)
    r = Rys(("#F1F8EA", "#D3E9C4"))
    r.add('<circle cx="150" cy="44" r="16" fill="#FFE17A" opacity=".9"/><circle cx="150" cy="44" r="24" fill="#FFE17A" opacity=".25"/>')
    cien(r, 100, 182, 80, 8)
    gz = r.lin([(0, "#7A5634"), (.4, "#5E3F22"), (1, "#3B2612")], 0, 0, 0, 1)
    r.add(f'<path d="M24 128H176V170Q176 180 166 180H34Q24 180 24 170Z" fill="{gz}"/>')
    for _ in range(140):
        r.add(f'<circle cx="{f(rng.uniform(28, 172))}" cy="{f(rng.uniform(134, 176))}" r="{f(rng.uniform(.5, 1.6))}" fill="{rng.choice(("#8E6A44", "#2E1C0C", "#A07A50"))}" opacity=".7"/>')
    for _ in range(7):
        x, y = rng.uniform(36, 164), rng.uniform(146, 172)
        gk = r.rad([(0, "#D8D2C4"), (1, "#8C8476")], .4, .35, .7)
        r.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rng.uniform(3, 5.5))}" ry="{f(rng.uniform(2, 3.5))}" fill="{gk}"/>')
    for _ in range(22):
        x = rng.uniform(30, 170)
        r.add(f'<path d="M{f(x)} 130q{f(rng.uniform(-6, 6))} 12 {f(rng.uniform(-4, 4))} {f(rng.uniform(16, 40))}" stroke="#E6D3AE" stroke-opacity=".55" stroke-width=".8" fill="none"/>')
    r.add('<rect x="24" y="122" width="152" height="10" rx="3" fill="#2E6B26"/>')
    gradienty = [r.lin([(0, a), (1, b)], 0, 1, 0, 0) for a, b in
                 (("#2A6324", "#6FB64F"), ("#2F6E28", "#8CCB62"), ("#24561F", "#5BA545"), ("#38792C", "#A2D676"))]
    zdzbla = []
    for _ in range(210):
        x = rng.uniform(24, 176)
        y = rng.uniform(122, 132)
        zdzbla.append((y, x))
    for y, x in sorted(zdzbla):
        h = rng.uniform(28, 62) * (1 - abs(x - 100) / 300)
        w = rng.uniform(1.6, 2.6)
        b = rng.uniform(-12, 12)
        r.add(f'<path d="M{f(x - w)} {f(y)}Q{f(x - w + b * .4)} {f(y - h * .6)} {f(x + b)} {f(y - h)}Q{f(x + w + b * .3)} {f(y - h * .55)} {f(x + w)} {f(y)}Z" fill="{rng.choice(gradienty)}"/>')
    # stokrotka i koniczyna z przodu
    for i in range(14):
        r.add(f'<ellipse cx="64" cy="96" rx="2.2" ry="7" fill="#FFFFFF" stroke="#EBDDE4" stroke-width=".5" transform="rotate({i * 360 / 14} 64 103)"/>')
    r.add('<circle cx="64" cy="103" r="4" fill="#F4C22E"/><circle cx="63" cy="102" r="1.4" fill="#FFE38A"/>')
    lodyga(r, "M64 107Q66 118 64 128", 1.6)
    for k in (-90, 30, 150):
        x, y = 140 + math.cos(math.radians(k)) * 6, 112 + math.sin(math.radians(k)) * 6
        r.add(f'<g transform="rotate({k + 90} {f(x)} {f(y)})"><path d="M{f(x)} {f(y + 6)}c-8-4-8-12-2-12 2 0 2 2 2 2s0-2 2-2c6 0 6 8-2 12z" fill="#4C9A3A"/>'
              f'<path d="M{f(x - 3)} {f(y)}q3 2 6 0" stroke="#CDEAB4" stroke-width=".8" fill="none"/></g>')
    lodyga(r, "M140 118Q142 124 140 130", 1.4)
    return r.svg()


# ---------------- TUJA ----------------
def tuja():
    rng = random.Random(23)
    r = Rys(("#EEF7EF", "#D2E8D5"))
    cien(r, 100, 176, 52, 8)
    r.add('<path d="M92 150h16l2 24h-20z" fill="#7A5230"/>')
    for _ in range(26):
        r.add(f'<ellipse cx="{f(rng.uniform(64, 136))}" cy="{f(rng.uniform(170, 180))}" rx="{f(rng.uniform(2, 5))}" ry="{f(rng.uniform(1, 2))}" fill="{rng.choice(("#6B4526", "#8A5E36", "#4E3018"))}"/>')
    kontur = "M100 14C114 40 140 96 144 146C128 162 72 162 56 146C60 96 86 40 100 14Z"
    r.add(f'<path d="M100 22C112 46 134 98 138 144C124 156 76 156 62 144C66 98 88 46 100 22Z" fill="#1E5428"/>')
    s = []
    galazki = []
    for _ in range(190):
        y = rng.uniform(20, 156)
        t = (y - 14) / 140
        pol = 4 + t * 38
        x = 100 + rng.uniform(-pol, pol)
        galazki.append((y, x))
    for y, x in sorted(galazki):
        swiatlo = (100 - x) / 50 * .5 + .5 - (y - 90) / 300
        kol = ("#9CD27C" if swiatlo > .75 else "#6DB453" if swiatlo > .5 else "#3F8C3B" if swiatlo > .28 else "#2A6A2E")
        kat = (x - 100) * .9 + rng.uniform(-25, 25) + 90
        dl = rng.uniform(9, 15)
        out = [f'<g transform="translate({f(x)} {f(y)}) rotate({f(kat)})">']
        out.append(f'<path d="M0 0L{f(dl)} 0" stroke="{kol}" stroke-width="1.2"/>')
        for i in range(1, 5):
            px = dl * i / 5
            for st in (-1, 1):
                out.append(f'<ellipse cx="{f(px)}" cy="{f(st * 2)}" rx="2.6" ry="1.6" fill="{kol}" transform="rotate({st * 35} {f(px)} {f(st * 2)})"/>')
        out.append(f'<ellipse cx="{f(dl)}" cy="0" rx="3" ry="2" fill="{kol}"/></g>')
        s.append("".join(out))
    r.add("".join(s))
    # światło z lewej, cień z prawej (przycięte do sylwetki)
    r.add(f'<g {r.przytnij(kontur)} opacity=".9">'
          '<path d="M100 10C112 60 126 120 130 166L170 166 150 90Z" fill="#0a2a0a" opacity=".22"/>'
          '<path d="M100 10C92 60 80 120 76 166L40 166 56 90Z" fill="#fff" opacity=".08"/></g>')
    return r.svg()


# ---------------- ZBOŻA – wspólny kłos ----------------
def klos(r, baza, ster, czubek, n, ziarno, osc, kolory, rzedy=2, osc_wygiecie=6, odstep=1.0, osc_szer=.7):
    """Kłos wzdłuż krzywej baza -> czubek (kontrola ster). ziarno=(dł, szer)."""
    out = []
    gz = r.lin([(0, kolory[0]), (.5, kolory[1]), (1, kolory[2])], 0, 0, 0, 1)
    for i in range(n):
        t = .05 + .95 * i / (n - 1)
        u = 1 - t
        px = u * u * baza[0] + 2 * u * t * ster[0] + t * t * czubek[0]
        py = u * u * baza[1] + 2 * u * t * ster[1] + t * t * czubek[1]
        tx = 2 * u * (ster[0] - baza[0]) + 2 * t * (czubek[0] - ster[0])
        ty = 2 * u * (ster[1] - baza[1]) + 2 * t * (czubek[1] - ster[1])
        a = math.atan2(ty, tx)
        nx, ny = -math.sin(a), math.cos(a)
        skala = 1 - .35 * t
        strony = (-1, 1) if rzedy == 2 else (-1, 1, 0)
        for s in strony:
            off = ziarno[1] * .95 * s * skala * odstep
            cx, cy = px + nx * off, py + ny * off
            kat = math.degrees(a) + s * 22
            dl, sz = ziarno[0] * skala, ziarno[1] * skala
            # oś
            if osc:
                ka = math.radians(kat - s * 10)
                ex = cx + math.cos(math.radians(kat)) * dl * .5
                ey = cy + math.sin(math.radians(kat)) * dl * .5
                ox, oy = ex + math.cos(ka) * osc, ey + math.sin(ka) * osc
                mx, my = (ex + ox) / 2 + nx * s * osc_wygiecie, (ey + oy) / 2 + ny * s * osc_wygiecie
                out.append(f'<path d="M{f(ex)} {f(ey)}Q{f(mx)} {f(my)} {f(ox)} {f(oy)}" stroke="{kolory[2]}" stroke-width="{osc_szer}" fill="none" opacity=".9"/>')
            out.append(f'<g transform="translate({f(cx)} {f(cy)}) rotate({f(kat)})">'
                       f'<ellipse cx="0" cy="0" rx="{f(dl / 2)}" ry="{f(sz / 2)}" fill="{gz}" stroke="{kolory[2]}" stroke-width=".5"/>'
                       f'<path d="M{f(-dl * .4)} {f(-sz * .1)}Q0 {f(-sz * .35)} {f(dl * .42)} 0" stroke="#FFF4C8" stroke-opacity=".6" stroke-width=".8" fill="none"/>'
                       f'<path d="M{f(-dl * .45)} {f(sz * .15)}Q0 {f(sz * .4)} {f(dl * .45)} {f(sz * .05)}" stroke="{kolory[2]}" stroke-opacity=".5" stroke-width=".6" fill="none"/>'
                       '</g>')
    r.add("".join(out))


def zdzblo(r, d, szer=2.6, kolory=("#D9B45A", "#A9852E")):
    lodyga(r, d, szer, kolory)


def ziarna_na_ziemi(r, rng, kolory, n=6, y=168):
    for _ in range(n):
        x = rng.uniform(50, 150)
        k = rng.uniform(0, 180)
        g = r.lin([(0, kolory[0]), (1, kolory[1])], 0, 0, 0, 1)
        r.add(f'<g transform="rotate({f(k)} {f(x)} {f(y)})"><ellipse cx="{f(x)}" cy="{f(y)}" rx="4.6" ry="2.6" fill="{g}"/>'
              f'<path d="M{f(x - 3.6)} {f(y)}h7.2" stroke="{kolory[1]}" stroke-width=".7"/></g>')


# ---------------- PSZENICA ----------------
def pszenica():
    rng = random.Random(31)
    r = Rys(("#FFF8E6", "#F6E6BE"))
    cien(r, 100, 176, 60, 7)
    kol = ("#F8DA86", "#E3B04B", "#A9782A")
    zdzblo(r, "M80 190Q78 120 66 70")
    zdzblo(r, "M100 190Q100 110 102 58")
    zdzblo(r, "M120 190Q124 120 138 74")
    lisc(r, 100, 150, 70, 5, -125, ("#D8C46A", "#B79E43", "#8E772A"), zylki=0, ksztalt=.2)
    lisc(r, 104, 160, 64, 5, -55, ("#D8C46A", "#B79E43", "#8E772A"), zylki=0, ksztalt=.2)
    klos(r, (66, 72), (60, 50), (58, 22), 11, (14, 8), 9, kol)
    klos(r, (102, 60), (102, 36), (104, 10), 12, (15, 8.5), 9, kol)
    klos(r, (138, 76), (144, 54), (150, 28), 11, (14, 8), 9, kol)
    ziarna_na_ziemi(r, rng, ("#E9BD5C", "#A9782A"), 7)
    return r.svg()


# ---------------- ŻYTO ----------------
def zyto():
    rng = random.Random(32)
    r = Rys(("#F8F4E8", "#E9E0C8"))
    cien(r, 100, 176, 56, 7)
    kol = ("#F2E4B0", "#CFB468", "#7A6430")
    zdzblo(r, "M84 196Q82 130 76 76", 2.4, ("#A8B894", "#6F8460"))
    zdzblo(r, "M116 196Q118 130 128 70", 2.4, ("#A8B894", "#6F8460"))
    zdzblo(r, "M100 196Q100 140 102 96", 2.2, ("#A8B894", "#6F8460"))
    lisc(r, 100, 160, 80, 4.5, -120, ("#B4C49E", "#8AA07A", "#5E7450"), zylki=0, ksztalt=.2)
    klos(r, (76, 78), (72, 46), (78, 12), 15, (12, 6.2), 28, kol, osc_wygiecie=3, osc_szer=1.1)
    klos(r, (128, 72), (132, 42), (124, 8), 15, (12, 6.2), 28, kol, osc_wygiecie=3, osc_szer=1.1)
    klos(r, (102, 98), (100, 70), (104, 40), 12, (11, 5.8), 26, kol, osc_wygiecie=3, osc_szer=1.1)
    ziarna_na_ziemi(r, rng, ("#BFA76A", "#7E6A3A"), 6)
    return r.svg()


# ---------------- JĘCZMIEŃ ----------------
def jeczmien():
    rng = random.Random(33)
    r = Rys(("#FFF7E2", "#F4E3B6"))
    cien(r, 100, 176, 58, 7)
    kol = ("#FBE39A", "#E6BC55", "#AE8430")
    zdzblo(r, "M70 196Q70 110 100 52", 2.6)
    zdzblo(r, "M118 196Q114 130 142 82", 2.4)
    lisc(r, 92, 150, 64, 5.5, -140, ("#C9C26A", "#A6A04A", "#7D782F"), zylki=0, ksztalt=.2)
    klos(r, (100, 52), (130, 40), (138, 92), 11, (13, 8), 40, kol, rzedy=3, osc_wygiecie=10, odstep=1.1)
    klos(r, (142, 82), (160, 80), (160, 122), 9, (12, 7.4), 34, kol, rzedy=3, osc_wygiecie=9, odstep=1.1)
    ziarna_na_ziemi(r, rng, ("#EFCB70", "#AE8430"), 6, 172)
    return r.svg()


# ---------------- KUKURYDZA ----------------
def kukurydza():
    rng = random.Random(34)
    r = Rys(("#FFF8E0", "#F6E7B0"))
    cien(r, 104, 178, 50, 8)
    cx, y0, y1 = 104, 34, 160
    # liście okrywowe z tyłu
    for kat, dl, sz in ((-112, 120, 22), (-70, 118, 22)):
        lisc(r, 104, 164, dl, sz, kat, ("#B5D77E", "#6FAE4A", "#3D7A2C"), zylki=0, ksztalt=.35)
    g_kolba = r.lin([(0, "#C98A12"), (.5, "#E8AE22"), (1, "#A8700C")], 0, 0, 1, 0)
    r.add(f'<path d="M{cx} {y0}C{cx + 34} {y0 + 10} {cx + 32} {y1 - 10} {cx} {y1}C{cx - 32} {y1 - 10} {cx - 34} {y0 + 10} {cx} {y0}Z" fill="{g_kolba}"/>')
    jasnosci = []
    for poziom in range(5):
        jas = .35 + poziom * .16
        jasnosci.append(r.rad([(0, "#FFF6C8"), (.35, f"#{int(250 * min(1, jas + .25)):02X}{int(205 * min(1, jas + .2)):02X}{int(70 * jas):02X}"),
                               (1, f"#{int(205 * jas + 30):02X}{int(140 * jas + 20):02X}10")], .4, .35, .7))
    ziarna = []
    y = y0 + 6
    while y < y1 - 4:
        t = (y - (y0 + y1) / 2) / ((y1 - y0) / 2)
        R_ = 30 * (1 - t * t * .55)
        for kol in range(-6, 7):
            th = math.radians(kol * 14 + (7 if int((y - y0) / 7.6) % 2 else 0))
            if abs(th) > math.radians(84):
                continue
            x = cx + R_ * math.sin(th)
            w = max(1.5, R_ * .26 * math.cos(th))
            b = math.cos(th + math.radians(28))
            ziarna.append((math.cos(th), x, y, w, b))
        y += 7.6
    for _, x, y, w, b in sorted(ziarna):
        poz = max(0, min(4, int((b + .2) / 1.2 * 5)))
        r.add(f'<rect x="{f(x - w / 2)}" y="{f(y - 3.4)}" width="{f(w)}" height="6.8" rx="{f(min(w / 2, 2.4))}" fill="{jasnosci[poz]}" stroke="#B37A10" stroke-width=".35"/>')
        if b > .7 and w > 3:
            r.add(f'<ellipse cx="{f(x - w * .15)}" cy="{f(y - 1.4)}" rx="{f(w * .22)}" ry="1" fill="#fff" opacity=".7"/>')
    # znamiona (wąsy)
    for _ in range(26):
        ex, ey = cx + rng.uniform(-30, 34), rng.uniform(4, 22)
        r.add(f'<path d="M{cx} {y0 + 2}Q{f(cx + rng.uniform(-14, 14))} {f(y0 - 14)} {f(ex)} {f(ey)}" stroke="{rng.choice(("#E9CB82", "#C9964E", "#A86B34"))}" stroke-width=".7" fill="none"/>')
    # liście okrywowe z przodu
    for kat, dl, sz in ((-140, 74, 16), (-42, 74, 16)):
        lisc(r, 104, 168, dl, sz, kat, ("#C7E392", "#7DBA55", "#43822F"), zylki=0, ksztalt=.3)
    for kat, dl in ((-140, 74), (-42, 74)):
        a = math.radians(kat)
        for k in range(-2, 3):
            r.add(f'<path d="M104 168L{f(104 + math.cos(a) * dl * .9 + k * 2)} {f(168 + math.sin(a) * dl * .9)}" stroke="#E8F5C8" stroke-opacity=".35" stroke-width=".6"/>')
    lodyga(r, "M104 166V196", 9, ("#8CBF5E", "#4E8A34"))
    return r.svg()


# ---------------- SOJA ----------------
def soja():
    rng = random.Random(35)
    r = Rys(("#F3F8E8", "#DDEAC6"))
    cien(r, 100, 178, 64, 7)
    lodyga(r, "M70 198C78 150 96 110 116 70S140 30 146 18", 4, ("#8DAA55", "#56722E"))
    kol_l = ("#8CC567", "#4C9640", "#2A6328")
    for (x, y, k) in ((116, 70, -40), (96, 112, -150), (140, 30, -70)):
        lodyga(r, f"M{x} {y}l{f(math.cos(math.radians(k)) * 18)} {f(math.sin(math.radians(k)) * 18)}", 2)
        bx, by = x + math.cos(math.radians(k)) * 18, y + math.sin(math.radians(k)) * 18
        for d in (-48, 0, 48):
            lisc(r, bx, by, 38 if d == 0 else 32, 13, k + d, kol_l, zylki=5, ksztalt=.6)

    def straczek(x, y, kat, s=1):
        d = ("M0 0C4 -9 11 -10 16 -6C20 -11 27 -11 31 -6C35 -11 42 -11 46 -4C49 1 47 6 42 7"
             "C36 9 30 8 25 8C18 9 10 9 4 7C0 6 -2 3 0 0Z")
        g = r.lin([(0, "#B8D98A"), (.5, "#86B85A"), (1, "#557F34")], 0, 0, 0, 1)
        out = [f'<g transform="translate({f(x)} {f(y)}) rotate({f(kat)}) scale({s})">',
               f'<path d="{d}" fill="#1f3a10" opacity=".2" transform="translate(1 2)"/>',
               f'<path d="{d}" fill="{g}"/>']
        for bx in (8, 23, 38):
            out.append(f'<ellipse cx="{bx}" cy="-1" rx="6" ry="4.4" fill="#D4ECA8" opacity=".45"/>')
        for i in range(36):
            t = i / 35
            px = -1 + t * 48
            py = -6 - 3 * abs(math.sin(t * math.pi * 3)) if i % 2 else 7.5
            dx, dy = rng.uniform(-1, 1.5), (-2.4 if py < 0 else 2.4)
            out.append(f'<path d="M{f(px)} {f(py)}l{f(dx)} {f(dy)}" stroke="#EDE6BE" stroke-width=".5" opacity=".85"/>')
        out.append('<path d="M2 5C14 7 30 7 44 4" stroke="#557F34" stroke-width=".8" fill="none"/>')
        out.append('<path d="M46 -3l7 -4" stroke="#7C9A4A" stroke-width="1.2" stroke-linecap="round"/>')
        out.append('</g>')
        r.add("".join(out))

    straczek(108, 82, 60, .95)
    straczek(116, 84, 95, 1)
    straczek(88, 126, 100, 1.05)
    straczek(80, 124, 135, .95)
    for x, y in ((44, 170), (56, 174), (148, 168), (160, 172), (136, 174)):
        g = r.rad([(0, "#FFF4CC"), (.6, "#E8D08A"), (1, "#B8984E")], .38, .35, .65)
        r.add(f'<ellipse cx="{x}" cy="{y}" rx="6" ry="5.2" fill="{g}"/><ellipse cx="{x + 1}" cy="{y + 1.5}" rx="2" ry=".9" fill="#7A5A2A"/>')
    return r.svg()


for nazwa in ("roza", "trawnik", "tuja", "pszenica", "zyto", "jeczmien", "kukurydza", "soja"):
    R[nazwa] = globals()[nazwa]()
