"""Szczegółowe ilustracje: warzywa i owoce."""
import math
import random
from narzedzia import Rys, cien, odblask, kropla, lisc, lodyga, platki_kielicha, punkty_w_elipsie, f

R = {}


# ---------------- POMIDOR ----------------
def pomidor():
    random.seed(1)
    r = Rys(("#FFF1EC", "#F9D7CC"))
    cien(r, 100, 170, 70, 9)
    lodyga(r, "M18 30C50 22 86 26 104 40S140 54 176 40", 6, ("#6FA548", "#335F1F"))
    # włoski na łodydze
    for i in range(40):
        t = i / 40
        x = 18 + t * 158
        y = 30 - math.sin(t * math.pi) * 6 + (14 * t if t > .5 else 0) - (8 if t > .5 else 0)
        r.add(f'<path d="M{f(x)} {f(y)}l{f(random.uniform(-1.5, 1.5))} -2.5" stroke="#9BCB72" stroke-width=".5" opacity=".7"/>')
    lodyga(r, "M138 47Q140 58 140 66", 4)
    lodyga(r, "M88 34Q86 48 88 62", 4.5)
    # tylny pomidor
    g2 = r.rad([(0, "#F7765A"), (.45, "#D6321D"), (.85, "#A01B0E"), (1, "#6E0F06")], .38, .35, .7)
    r.add(f'<ellipse cx="142" cy="102" rx="38" ry="34" fill="{g2}"/>')
    r.add('<path d="M142 72q-12 24-6 62M142 72q14 22 12 60" stroke="#7E1308" stroke-opacity=".3" stroke-width="2" fill="none"/>')
    odblask(r, 128, 86, 9, 5, -25, .45)
    platki_kielicha(r, 140, 68, 6, 16, 3.2, 10)
    # przedni pomidor
    g = r.rad([(0, "#FF9A7A"), (.25, "#F65236"), (.7, "#D2291A"), (.92, "#9C170B"), (1, "#701006")], .38, .33, .72, .34, .28)
    ksztalt = "M88 64C126 60 148 92 146 122C144 154 118 174 88 172C56 170 32 148 34 116C36 86 56 66 88 64Z"
    r.add(f'<path d="{ksztalt}" fill="{g}"/>')
    # delikatne żebrowanie
    for d in ("M88 66C72 90 70 140 84 170", "M88 66C104 92 110 140 98 170", "M88 66C56 84 44 120 50 150", "M88 66C120 84 136 116 128 150"):
        r.add(f'<path d="{d}" stroke="#8A1409" stroke-opacity=".22" stroke-width="2.2" fill="none"/>')
    r.add(f'<path d="M40 130C46 158 70 172 92 171C70 166 52 150 40 130Z" fill="#5A0A03" opacity=".25"/>')
    odblask(r, 62, 92, 15, 9, -35, .6)
    for x, y, s in [(110, 96, 3.6), (120, 128, 2.6), (76, 140, 3), (100, 152, 2.2), (54, 118, 2.4), (130, 110, 1.8)]:
        kropla(r, x, y, s)
    platki_kielicha(r, 88, 66, 6, 20, 3.8, -5)
    r.add('<circle cx="88" cy="66" r="3.5" fill="#3E7A28"/>')
    return r.svg()


# ---------------- OGÓREK ----------------
def ogorek():
    rng = random.Random(2)
    r = Rys(("#EEF7E6", "#D3E9C2"))
    cien(r, 104, 160, 74, 10)
    # liść ogórka w tle + wąs czepny
    lisc(r, 120, 76, 70, 34, -60, ("#86C866", "#4C9A3A", "#2E6B26"), zylki=4, zabki=7, ksztalt=.75)
    r.add('<path d="M150 70c10-6 18 2 12 8s-14 0-8-6 12-2 8 4" stroke="#79B65A" stroke-width="1.6" fill="none"/>')
    g = r.lin([(0, "#20501A"), (.18, "#3E8A2C"), (.42, "#7BB955"), (.55, "#5DA03F"), (.8, "#2F6E24"), (1, "#174014")], 0, 0, 0, 1)
    s = ['<g transform="rotate(-24 100 112)">']
    s.append(f'<path d="M30 112C30 92 56 86 100 86C146 86 172 94 174 112C172 130 146 138 100 138C56 138 30 132 30 112Z" fill="{g}"/>')
    for yy, op in ((98, .45), (112, .35), (126, .3)):
        s.append(f'<path d="M40 {yy}C80 {yy - 3} 130 {yy - 3} 166 {yy}" stroke="#C3E39A" stroke-opacity="{op}" stroke-width="2.4" stroke-dasharray="14 6 4 6" fill="none"/>')
    for _ in range(60):
        x, y = rng.uniform(38, 166), rng.uniform(90, 134)
        if ((x - 102) / 70) ** 2 + ((y - 112) / 25) ** 2 > .9:
            continue
        s.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="1.8" fill="#1E4A17"/><circle cx="{f(x - .5)}" cy="{f(y - .6)}" r=".8" fill="#D6EEB8"/>')
    s.append('<ellipse cx="96" cy="96" rx="44" ry="4" fill="#fff" opacity=".35" filter="url(#rozmyj2)"/>')
    # przekwitły kwiat
    for i in range(5):
        s.append(f'<ellipse cx="22" cy="112" rx="7" ry="3.4" fill="#F4C842" transform="rotate({i * 72} 27 112)" opacity=".9"/>')
    s.append('<circle cx="27" cy="112" r="3" fill="#C9961E"/>')
    s.append('<path d="M174 112h12" stroke="#6E7F2E" stroke-width="5" stroke-linecap="round"/>')
    s.append('</g>')
    r.add("".join(s))
    return r.svg()


# ---------------- ZIEMNIAK ----------------
def ziemniak():
    rng = random.Random(3)
    r = Rys(("#FBF4EA", "#EEDDC5"))
    cien(r, 100, 166, 76, 10)

    def bulwa(d, cx, cy, sk):
        g = r.rad([(0, "#F1D3A0"), (.5, "#D7A766"), (.9, "#A8743A"), (1, "#7C5226")], .38, .35, .75)
        r.add(f'<path d="{d}" fill="{g}"/>')
        s = [f'<g {r.przytnij(d)}>']
        for _ in range(int(60 * sk)):
            x, y = cx + rng.uniform(-44, 44) * sk, cy + rng.uniform(-30, 30) * sk
            s.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(.4, 1))}" fill="#7A5228" opacity=".45"/>')
        for _ in range(int(5 * sk)):
            x, y = cx + rng.uniform(-28, 28) * sk, cy + rng.uniform(-16, 16) * sk
            k = rng.uniform(0, 180)
            s.append(f'<g transform="rotate({f(k)} {f(x)} {f(y)})"><ellipse cx="{f(x)}" cy="{f(y + 1)}" rx="4" ry="1.6" fill="#F4DDB2"/>'
                     f'<path d="M{f(x - 3.5)} {f(y)}q3.5 -2.6 7 0" stroke="#6A4320" stroke-width="1.4" fill="none"/></g>')
        # cień od spodu bulwy
        s.append(f'<ellipse cx="{f(cx + 6)}" cy="{f(cy + 30 * sk)}" rx="{f(50 * sk)}" ry="{f(16 * sk)}" fill="#4A2E12" opacity=".25" filter="url(#rozmyj)"/>')
        s.append('</g>')
        r.add("".join(s))

    bulwa("M100 52C130 46 160 60 160 84C160 108 136 118 112 116C86 114 72 100 74 82C76 64 84 54 100 52Z", 118, 84, 1)
    odblask(r, 104, 66, 14, 6, -15, .4, False)
    bulwa("M58 92C88 84 114 98 116 122C118 146 96 160 70 158C42 156 26 140 28 120C30 102 40 96 58 92Z", 72, 124, 1.05)
    odblask(r, 50, 108, 14, 6, -20, .4, False)
    # przekrojona połówka
    r.add('<ellipse cx="142" cy="140" rx="38" ry="25" fill="#A8743A"/>')
    gm = r.rad([(0, "#FFF8D8"), (.6, "#FBE7A6"), (1, "#E9C877")], .45, .4, .6)
    r.add(f'<ellipse cx="141" cy="138" rx="34" ry="21" fill="{gm}"/>')
    r.add('<ellipse cx="141" cy="138" rx="26" ry="15" fill="none" stroke="#E5C474" stroke-width="1.4" stroke-dasharray="3 2" opacity=".7"/>')
    odblask(r, 128, 130, 12, 4, -10, .6, False)
    return r.svg()


# ---------------- TRUSKAWKA ----------------
def truskawka():
    rng = random.Random(4)
    r = Rys(("#FFF0F0", "#F8D4D4"))
    cien(r, 104, 172, 64, 9)
    # liść trójlistkowy w tle
    for k in (-150, -110, -70):
        lisc(r, 46, 96, 52, 20, k, ("#7DC25B", "#3F8E39", "#235F22"), zylki=6, zabki=9, ksztalt=.6)
    lodyga(r, "M46 96Q60 120 70 150", 3)
    # kwiat
    for i in range(5):
        r.add(f'<ellipse cx="160" cy="150" rx="10" ry="8" fill="#FFFFFF" stroke="#E7E2D6" transform="rotate({i * 72} 160 160) translate(0 -2)"/>')
    r.add('<circle cx="160" cy="160" r="5" fill="#F2C531"/><circle cx="160" cy="160" r="2.6" fill="#D49A14"/>')

    def owoc(cx, cy, s, kat):
        d = (f"M{f(cx)} {f(cy + 52 * s)}C{f(cx - 34 * s)} {f(cy + 34 * s)} {f(cx - 46 * s)} {f(cy)} {f(cx - 38 * s)} {f(cy - 22 * s)}"
             f"C{f(cx - 30 * s)} {f(cy - 40 * s)} {f(cx - 8 * s)} {f(cy - 38 * s)} {f(cx)} {f(cy - 32 * s)}"
             f"C{f(cx + 8 * s)} {f(cy - 38 * s)} {f(cx + 30 * s)} {f(cy - 40 * s)} {f(cx + 38 * s)} {f(cy - 22 * s)}"
             f"C{f(cx + 46 * s)} {f(cy)} {f(cx + 34 * s)} {f(cy + 34 * s)} {f(cx)} {f(cy + 52 * s)}Z")
        g = r.rad([(0, "#FF7A6A"), (.35, "#EE3330"), (.8, "#BE1420"), (1, "#86091A")], .38, .32, .75)
        out = [f'<g transform="rotate({kat} {f(cx)} {f(cy)})">', f'<path d="{d}" fill="{g}"/>']
        for wiersz in range(8):
            yy = cy - 26 * s + wiersz * 9.5 * s
            szer = (40 - abs(wiersz - 2.5) * 5.5) * s
            n = max(2, int(szer / (7 * s)))
            for j in range(n + 1):
                xx = cx - szer + j * (2 * szer / n) + (3.5 * s if wiersz % 2 else 0)
                if abs(xx - cx) > szer:
                    continue
                kk = math.degrees(math.atan2(yy - cy, xx - cx)) * .15
                out.append(f'<ellipse cx="{f(xx)}" cy="{f(yy)}" rx="{f(2.8 * s)}" ry="{f(3.6 * s)}" fill="#8E0B16" opacity=".35"/>'
                           f'<ellipse cx="{f(xx)}" cy="{f(yy + .4)}" rx="{f(1.2 * s)}" ry="{f(2 * s)}" fill="#F7D96A" transform="rotate({f(kk)} {f(xx)} {f(yy)})"/>')
        out.append(f'<path d="M{f(cx - 30 * s)} {f(cy - 10 * s)}C{f(cx - 30 * s)} {f(cy + 20 * s)} {f(cx - 14 * s)} {f(cy + 38 * s)} {f(cx)} {f(cy + 50 * s)}'
                   f'C{f(cx - 26 * s)} {f(cy + 36 * s)} {f(cx - 40 * s)} {f(cy + 10 * s)} {f(cx - 30 * s)} {f(cy - 10 * s)}Z" fill="#5B0410" opacity=".22"/>')
        out.append('</g>')
        r.add("".join(out))
        odblask(r, cx - 18 * s, cy - 14 * s, 9 * s, 5 * s, -40, .55)
        platki_kielicha(r, cx, cy - 32 * s, 8, 22 * s, 4.2 * s, 180 + kat)
        lodyga(r, f"M{f(cx)} {f(cy - 34 * s)}Q{f(cx + 4)} {f(cy - 50 * s)} {f(cx + 12)} {f(cy - 60 * s)}", 3.4)

    owoc(140, 96, .72, 18)
    owoc(96, 112, 1, -6)
    return r.svg()


# ---------------- BORÓWKA ----------------
def borowka():
    r = Rys(("#EEF1FB", "#D3DAF1"))
    cien(r, 100, 170, 66, 9)
    lodyga(r, "M30 40C70 44 110 42 160 30", 4, ("#8A6A44", "#5A3E22"))
    lisc(r, 120, 38, 56, 18, -25, ("#86C264", "#3F8C3A", "#245F26"), zylki=6)
    lisc(r, 60, 42, 50, 16, -160, ("#7DBB5C", "#3A8536", "#225A23"), zylki=5)
    jagody = [(64, 92, 22), (108, 82, 24), (148, 98, 20), (84, 132, 25), (128, 134, 23), (100, 108, 21)]
    for x, y, rr in jagody:
        r.add(f'<path d="M{f(x)} {f(y - rr)}Q{f(x + 4)} {f(y - rr - 20)} {f((x + 100) / 2)} 44" stroke="#6E5233" stroke-width="1.8" fill="none"/>')
    for x, y, rr in sorted(jagody, key=lambda j: j[1]):
        g = r.rad([(0, "#7F92DA"), (.35, "#4659A8"), (.8, "#27336F"), (1, "#141B45")], .38, .35, .7)
        r.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="{g}"/>')
        nalot = r.rad([(0, "#E4E9FF", .55), (1, "#E4E9FF", 0)], .3, .25, .6)
        r.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="{nalot}"/>')
        # korona (kielich) na szczycie
        cx, cy = x + rr * .1, y - rr * .35
        pkt = []
        for i in range(10):
            a = math.radians(i * 36 - 90)
            pr = rr * (.32 if i % 2 == 0 else .14)
            pkt.append(f"{f(cx + math.cos(a) * pr)} {f(cy + math.sin(a) * pr * .7)}")
        r.add(f'<path d="M{"L".join(pkt)}Z" fill="#141A3C"/>')
        r.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rr * .12)}" ry="{f(rr * .08)}" fill="#3B4A86"/>')
        odblask(r, x - rr * .45, y - rr * .1, rr * .22, rr * .12, -50, .45, False)
    return r.svg()


# ---------------- JABŁKO ----------------
def jablon():
    rng = random.Random(6)
    r = Rys(("#FFF2EC", "#F8D9CF"))
    cien(r, 96, 170, 70, 9)
    ks = "M88 58C70 46 30 50 30 98C30 140 58 172 88 166C118 172 146 140 146 98C146 50 106 46 88 58Z"
    g = r.rad([(0, "#F6D46A"), (.25, "#F2803E"), (.6, "#D8352A"), (.9, "#9E1A16"), (1, "#701010")], .32, .3, .8)
    r.add(f'<path d="{ks}" fill="{g}"/>')
    for i in range(26):
        x0 = 40 + i * 4
        r.add(f'<path d="M88 62C{f(x0)} 80 {f(x0 + rng.uniform(-8, 8))} 130 {f(88 + (x0 - 88) * .6)} 164" '
              f'stroke="#9A1410" stroke-opacity="{f(rng.uniform(.12, .3))}" stroke-width="{f(rng.uniform(1.2, 2.6))}" fill="none"/>')
    for _ in range(22):
        x, y = rng.uniform(44, 134), rng.uniform(70, 154)
        r.add(f'<circle cx="{f(x)}" cy="{f(y)}" r=".6" fill="#FFE6A8" opacity=".35"/>')
    r.add('<ellipse cx="88" cy="62" rx="12" ry="5" fill="#5A0D08" opacity=".45" filter="url(#rozmyj2)"/>')
    odblask(r, 54, 86, 13, 8, -40, .55)
    lodyga(r, "M88 62Q86 44 94 30", 4, ("#8B6238", "#4E3218"))
    lisc(r, 94, 34, 50, 16, -15, ("#8CCB62", "#45963A", "#256327"), zylki=6, zabki=10)
    # połówka jabłka
    r.add('<ellipse cx="150" cy="140" rx="34" ry="30" fill="#C4241B"/>')
    gm = r.rad([(0, "#FFFBE6"), (.7, "#FBEFC2"), (1, "#EED89A")], .5, .5, .55)
    r.add(f'<ellipse cx="150" cy="140" rx="31" ry="27" fill="{gm}"/>')
    pkt = []
    for i in range(10):
        a = math.radians(i * 36 - 90)
        pr = 12 if i % 2 == 0 else 5
        pkt.append(f"{f(150 + math.cos(a) * pr)} {f(140 + math.sin(a) * pr)}")
    r.add(f'<path d="M{"L".join(pkt)}Z" fill="#EAD9A0" stroke="#D9C47E" stroke-width=".8"/>')
    for a in (-90, -18, 54, 126, 198):
        x, y = 150 + math.cos(math.radians(a)) * 8, 140 + math.sin(math.radians(a)) * 8
        r.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="2.2" ry="3.6" fill="#5A3416" transform="rotate({a + 90} {f(x)} {f(y)})"/>'
              f'<ellipse cx="{f(x - .6)}" cy="{f(y - .8)}" rx=".7" ry="1.1" fill="#C98E58" transform="rotate({a + 90} {f(x)} {f(y)})"/>')
    return r.svg()


# ---------------- MARCHEW ----------------
def marchew():
    rng = random.Random(9)
    r = Rys(("#FFF5EA", "#FBE1C6"))
    cien(r, 104, 170, 64, 8)

    def nac(x, y, kat, dl):
        rad = math.radians(kat)
        ex, ey = x + math.cos(rad) * dl, y + math.sin(rad) * dl
        cx, cy = x + math.cos(rad) * dl * .5 + 8, y + math.sin(rad) * dl * .5
        lodyga(r, f"M{f(x)} {f(y)}Q{f(cx)} {f(cy)} {f(ex)} {f(ey)}", 2.2, ("#7CC05A", "#3F8B33"))
        for i in range(1, 9):
            t = i / 9
            px = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t * t * ex
            py = (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t * t * ey
            for strona in (-1, 1):
                lisc(r, px, py, 12 * (1.1 - t * .5), 3.2, kat + strona * 55, ("#8ED06A", "#4A9A3C", "#2C6A28"), zylki=0, ksztalt=.3, cien_lisc=False)

    def korzen(x0, y0, x1, y1, szer):
        kat = math.degrees(math.atan2(y1 - y0, x1 - x0))
        dl = math.hypot(x1 - x0, y1 - y0)
        g = r.lin([(0, "#C2560E"), (.3, "#F49B3E"), (.5, "#FDB867"), (.75, "#E9791C"), (1, "#A9480B")], 0, 0, 0, 1)
        s = [f'<g transform="translate({f(x0)} {f(y0)}) rotate({f(kat)})">']
        s.append(f'<path d="M0 {-szer}C{f(dl * .3)} {-szer} {f(dl * .8)} -3 {f(dl)} 0C{f(dl * .8)} 3 {f(dl * .3)} {szer} 0 {szer}Q-5 0 0 {-szer}Z" fill="{g}"/>')
        for i in range(1, 14):
            t = i / 14
            w = szer * (1 - t * .85)
            xx = dl * t * .95
            s.append(f'<path d="M{f(xx)} {f(-w * .9)}q-2 {f(w * .9)} 0 {f(w * 1.8)}" stroke="#B5540F" stroke-opacity=".45" stroke-width="1.1" fill="none"/>')
            if rng.random() < .5:
                strona = rng.choice((-1, 1))
                s.append(f'<path d="M{f(xx)} {f(strona * w)}l{f(rng.uniform(1, 4))} {f(strona * rng.uniform(2, 5))}" stroke="#D9894A" stroke-width=".5"/>')
        s.append(f'<path d="M4 {-szer * .45}C{f(dl * .3)} {-szer * .5} {f(dl * .6)} -3 {f(dl * .8)} -1" stroke="#FFE0B8" stroke-opacity=".6" stroke-width="2.4" fill="none"/>')
        s.append(f'<path d="M{f(dl)} 0l14 2" stroke="#C26A2A" stroke-width=".8"/>')
        s.append('</g>')
        r.add("".join(s))

    for k in (-120, -100, -80, -60):
        nac(80, 64, k, 50)
    for k in (-110, -85, -55):
        nac(112, 70, k, 44)
    korzen(112, 70, 160, 168, 13)
    korzen(80, 64, 66, 170, 15)
    return r.svg()


# ---------------- PAPRYKA ----------------
def papryka():
    r = Rys(("#FFF3EC", "#F9DCCD"))
    cien(r, 100, 170, 78, 9)

    def owoc(cx, cy, s, kolory, kat):
        g = r.rad([(0, kolory[0]), (.35, kolory[1]), (.85, kolory[2]), (1, kolory[3])], .36, .3, .8)
        d = (f"M{f(cx - 34 * s)} {f(cy - 20 * s)}C{f(cx - 36 * s)} {f(cy - 40 * s)} {f(cx - 14 * s)} {f(cy - 44 * s)} {f(cx)} {f(cy - 38 * s)}"
             f"C{f(cx + 14 * s)} {f(cy - 44 * s)} {f(cx + 36 * s)} {f(cy - 40 * s)} {f(cx + 34 * s)} {f(cy - 20 * s)}"
             f"C{f(cx + 40 * s)} {f(cy + 14 * s)} {f(cx + 30 * s)} {f(cy + 44 * s)} {f(cx + 16 * s)} {f(cy + 44 * s)}"
             f"C{f(cx + 8 * s)} {f(cy + 50 * s)} {f(cx - 2 * s)} {f(cy + 46 * s)} {f(cx - 4 * s)} {f(cy + 42 * s)}"
             f"C{f(cx - 10 * s)} {f(cy + 50 * s)} {f(cx - 24 * s)} {f(cy + 48 * s)} {f(cx - 26 * s)} {f(cy + 40 * s)}"
             f"C{f(cx - 40 * s)} {f(cy + 30 * s)} {f(cx - 40 * s)} {f(cy)} {f(cx - 34 * s)} {f(cy - 20 * s)}Z")
        out = [f'<g transform="rotate({kat} {f(cx)} {f(cy)})">', f'<path d="{d}" fill="{g}"/>']
        for dd in (f"M{f(cx - 4 * s)} {f(cy - 36 * s)}C{f(cx - 10 * s)} {f(cy)} {f(cx - 8 * s)} {f(cy + 30 * s)} {f(cx - 4 * s)} {f(cy + 42 * s)}",
                   f"M{f(cx + 14 * s)} {f(cy - 36 * s)}C{f(cx + 22 * s)} {f(cy)} {f(cx + 22 * s)} {f(cy + 30 * s)} {f(cx + 16 * s)} {f(cy + 44 * s)}",
                   f"M{f(cx - 20 * s)} {f(cy - 34 * s)}C{f(cx - 30 * s)} {f(cy)} {f(cx - 30 * s)} {f(cy + 28 * s)} {f(cx - 26 * s)} {f(cy + 40 * s)}"):
            out.append(f'<path d="{dd}" stroke="{kolory[3]}" stroke-opacity=".45" stroke-width="{f(2.6 * s)}" fill="none"/>')
        out.append(f'<ellipse cx="{f(cx - 18 * s)}" cy="{f(cy - 6 * s)}" rx="{f(5 * s)}" ry="{f(22 * s)}" fill="#fff" opacity=".5" filter="url(#rozmyj2)"/>')
        out.append(f'<ellipse cx="{f(cx - 19 * s)}" cy="{f(cy - 16 * s)}" rx="{f(1.8 * s)}" ry="{f(8 * s)}" fill="#fff" opacity=".9"/>')
        out.append(f'<ellipse cx="{f(cx + 22 * s)}" cy="{f(cy + 4 * s)}" rx="{f(2.5 * s)}" ry="{f(12 * s)}" fill="#fff" opacity=".25" filter="url(#rozmyj2)"/>')
        # kielich i szypułka
        gz = r.rad([(0, "#7DBE55"), (1, "#2D6A22")], .5, .4, .6)
        out.append(f'<path d="M{f(cx - 16 * s)} {f(cy - 36 * s)}Q{f(cx)} {f(cy - 50 * s)} {f(cx + 16 * s)} {f(cy - 36 * s)}Q{f(cx + 6 * s)} {f(cy - 30 * s)} {f(cx)} {f(cy - 33 * s)}Q{f(cx - 8 * s)} {f(cy - 30 * s)} {f(cx - 16 * s)} {f(cy - 36 * s)}Z" fill="{gz}"/>')
        out.append('</g>')
        r.add("".join(out))
        rad = math.radians(kat)
        tx, ty = cx + math.sin(rad) * 42 * s, cy - math.cos(rad) * 42 * s
        lodyga(r, f"M{f(tx)} {f(ty)}Q{f(tx - 2)} {f(ty - 14 * s)} {f(tx + 10 * s)} {f(ty - 22 * s)}", 5.5 * s, ("#6FA548", "#2F6322"))
        r.add(f'<ellipse cx="{f(tx + 10 * s)}" cy="{f(ty - 22 * s)}" rx="{f(2.6 * s)}" ry="{f(2 * s)}" fill="#B9D98F"/>')

    owoc(62, 98, .82, ("#FFF07A", "#F5C51E", "#D49A0A", "#8F6505"), -14)
    owoc(142, 96, .82, ("#9AD86B", "#4E9E32", "#2D6E1E", "#173F10"), 12)
    owoc(100, 118, 1, ("#FF8A6A", "#E8331F", "#B51A10", "#6E0A05"), 0)
    return r.svg()


# ---------------- KALAFIOR ----------------
def kalafior():
    rng = random.Random(13)
    r = Rys(("#F5F8EE", "#E0EAD0"))
    cien(r, 100, 172, 80, 9)
    for kat, dl in ((-170, 88), (-10, 88), (-135, 80), (-45, 80), (-100, 70), (-80, 70)):
        lisc(r, 100, 128, dl, 30, kat, ("#93C489", "#4F8F57", "#2A5F37"), zylki=6, zylka_kolor="#E6F2D8", ksztalt=.7)
    # różyczki – gęsta kopuła
    pts = punkty_w_elipsie(100, 92, 60, 42, 130, rng, .88)
    pts.sort(key=lambda p: p[1])
    for x, y in pts:
        odl = math.hypot((x - 100) / 60, (y - 92) / 42)
        rr = 12 - odl * 5 + rng.uniform(-1.5, 1.5)
        g = r.rad([(0, "#FFFFF4"), (.55, "#F6EDCF"), (.85, "#E3D3A2"), (1, "#C7B47A")], .4, .35, .65)
        r.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="{g}"/>')
        for _ in range(3):
            r.add(f'<circle cx="{f(x + rng.uniform(-rr * .5, rr * .5))}" cy="{f(y + rng.uniform(-rr * .5, rr * .5))}" r=".9" fill="#D8C68E" opacity=".7"/>')
    r.add('<ellipse cx="100" cy="128" rx="60" ry="9" fill="#6E6A3A" opacity=".25" filter="url(#rozmyj2)"/>')
    # liście zachodzące na róże od przodu (nisko, żeby nie zasłaniać kwiatostanu)
    for kat, dl in ((-165, 58), (-15, 58), (175, 50), (5, 50)):
        lisc(r, 100, 144, dl, 18, kat, ("#A4D095", "#5A9A5E", "#2F6A3C"), zylki=5, zylka_kolor="#EEF6E2", ksztalt=.7)
    return r.svg()


# ---------------- BROKUŁ ----------------
def brokul():
    rng = random.Random(14)
    r = Rys(("#F1F8EC", "#D8EACB"))
    cien(r, 100, 172, 56, 8)
    g = r.lin([(0, "#9BCB76"), (.5, "#C6E3A6"), (1, "#7DB35A")], 0, 0, 1, 0)
    r.add(f'<path d="M84 100L80 168Q100 174 120 168L116 100Z" fill="{g}"/>')
    r.add('<ellipse cx="100" cy="168" rx="20" ry="4" fill="#E4F2CF"/>')
    for d in ("M88 104C80 96 66 92 56 84", "M112 104C120 96 134 92 144 84", "M96 100C94 86 88 74 80 64", "M104 100C108 86 114 74 122 64", "M100 100V60"):
        r.add(f'<path d="{d}" stroke="{g}" stroke-width="9" fill="none" stroke-linecap="round"/>')
        r.add(f'<path d="{d}" stroke="#6FA34F" stroke-opacity=".4" stroke-width="1.2" fill="none"/>')
    lisc(r, 84, 140, 44, 14, 200, zylki=4)
    skupiska = [(54, 80, 24), (146, 80, 24), (78, 58, 26), (122, 58, 26), (100, 46, 26), (100, 76, 24), (64, 104, 18), (136, 104, 18)]
    for cx, cy, rr in sorted(skupiska, key=lambda s: s[1]):
        gb = r.rad([(0, "#5FA548"), (.8, "#2E6E28"), (1, "#1C4A19")], .4, .35, .65)
        r.add(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(rr)}" fill="{gb}"/>')
        for x, y in sorted(punkty_w_elipsie(cx, cy, rr * .92, rr * .92, 38, rng, .9), key=lambda p: p[1]):
            jas = 1 - ((x - cx + rr * .4) ** 2 + (y - cy + rr * .4) ** 2) ** .5 / (rr * 1.8)
            kol = "#8CCB66" if jas > .6 else ("#56A040" if jas > .35 else "#2F7A2C")
            r.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(2, 3.4))}" fill="{kol}"/>'
                  f'<circle cx="{f(x - .7)}" cy="{f(y - .7)}" r=".8" fill="#C7EAA6" opacity=".7"/>')
    return r.svg()


# ---------------- KAPUSTA ----------------
def kapusta():
    r = Rys(("#F2F8EA", "#DAEACB"))
    cien(r, 100, 172, 82, 9)
    for kat, dl in ((-165, 86), (-15, 86), (170, 80), (10, 80), (-130, 70), (-50, 70)):
        lisc(r, 100, 120, dl, 36, kat, ("#9CC79A", "#5E9A6C", "#2E6544"), zylki=7, zylka_kolor="#E3F1DC", ksztalt=.8)
    g = r.rad([(0, "#F1FAD8"), (.4, "#CDE7A2"), (.85, "#93C46B"), (1, "#5F9A48")], .42, .35, .7)
    r.add(f'<circle cx="100" cy="100" r="52" fill="{g}"/>')
    # liście okrywające główkę z żyłkami
    for d, op in (("M48 110C50 70 80 50 106 52C86 66 72 92 74 150C60 142 48 128 48 110Z", .9),
                  ("M152 110C150 70 120 50 94 52C114 66 128 92 126 150C140 142 152 128 152 110Z", .9),
                  ("M60 140C70 112 90 100 100 100C110 100 130 112 140 140C128 150 114 154 100 154C86 154 72 150 60 140Z", 1)):
        gl = r.lin([(0, "#BFE08F"), (.6, "#94C76A"), (1, "#6EA850")], 0, 0, 0, 1)
        r.add(f'<path d="{d}" fill="{gl}" opacity="{op}"/>')
    for d in ("M100 152V104", "M100 140L80 120", "M100 128L84 112", "M100 140L120 120", "M100 128L116 112",
              "M54 126C60 100 74 80 96 62", "M62 104L54 96", "M70 90L60 82", "M146 126C140 100 126 80 104 62", "M138 104L146 96", "M130 90L140 82"):
        r.add(f'<path d="{d}" stroke="#F2FAE2" stroke-opacity=".85" stroke-width="1.6" fill="none" stroke-linecap="round"/>')
    odblask(r, 82, 66, 16, 7, -20, .45, False)
    return r.svg()


for nazwa in ("pomidor", "ogorek", "ziemniak", "truskawka", "borowka", "jablon", "marchew", "papryka", "kalafior", "brokul", "kapusta"):
    R[nazwa] = globals()[nazwa]()
