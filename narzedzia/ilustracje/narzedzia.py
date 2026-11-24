"""Narzędzia do rysowania szczegółowych ilustracji SVG (viewBox 200x200)."""
import math
import random


def f(x):
    return f"{x:.1f}".rstrip("0").rstrip(".")


class Rys:
    def __init__(self, tlo=("#F3F8EC", "#DDEBCF")):
        self.defs = []
        self.czesci = []
        self.n = 0
        self.tlo = tlo

    def _id(self, p):
        self.n += 1
        return f"{p}{self.n}"

    def _stopy(self, stopy):
        out = []
        for s in stopy:
            off, kol = s[0], s[1]
            op = f' stop-opacity="{s[2]}"' if len(s) > 2 else ""
            out.append(f'<stop offset="{off}" stop-color="{kol}"{op}/>')
        return "".join(out)

    def lin(self, stopy, x1=0, y1=0, x2=0, y2=1, uzytk=False):
        i = self._id("l")
        u = ' gradientUnits="userSpaceOnUse"' if uzytk else ""
        self.defs.append(f'<linearGradient id="{i}" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{u}>{self._stopy(stopy)}</linearGradient>')
        return f"url(#{i})"

    def rad(self, stopy, cx=.5, cy=.5, r=.5, fx=None, fy=None):
        i = self._id("r")
        fxy = f' fx="{fx}" fy="{fy}"' if fx is not None else ""
        self.defs.append(f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}"{fxy}>{self._stopy(stopy)}</radialGradient>')
        return f"url(#{i})"

    def przytnij(self, d):
        """Tworzy clipPath z kształtu – zwraca atrybut clip-path do grupy."""
        i = self._id("c")
        self.defs.append(f'<clipPath id="{i}"><path d="{d}"/></clipPath>')
        return f'clip-path="url(#{i})"'

    def add(self, s):
        self.czesci.append(s)

    def svg(self):
        tlo = self.rad([(0, self.tlo[0]), (1, self.tlo[1])], .45, .4, .7)
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">'
                '<defs>'
                '<clipPath id="kolo"><circle cx="100" cy="100" r="96"/></clipPath>'
                '<filter id="rozmyj" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>'
                '<filter id="rozmyj2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>'
                + "".join(self.defs) +
                '</defs>'
                f'<circle cx="100" cy="100" r="96" fill="{tlo}"/>'
                '<g clip-path="url(#kolo)">' + "".join(self.czesci) + '</g>'
                '<circle cx="100" cy="100" r="95.5" fill="none" stroke="#000" stroke-opacity=".06"/>'
                '</svg>')


# ---------- elementy wspólne ----------

def cien(r, cx, cy, rx, ry, moc=.16):
    r.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="#1d2a12" opacity="{moc}" filter="url(#rozmyj)"/>')


def odblask(r, cx, cy, rx, ry, kat=-30, moc=.55, ostry=True):
    r.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="#fff" opacity="{moc}" '
          f'filter="url(#rozmyj2)" transform="rotate({kat} {f(cx)} {f(cy)})"/>')
    if ostry:
        r.add(f'<ellipse cx="{f(cx - rx * .25)}" cy="{f(cy - ry * .2)}" rx="{f(rx * .28)}" ry="{f(ry * .3)}" fill="#fff" opacity=".9" '
              f'transform="rotate({kat} {f(cx)} {f(cy)})"/>')


def kropla(r, cx, cy, s):
    g = r.rad([(0, "#ffffff", .05), (.7, "#ffffff", .18), (1, "#3a0a05", .35)], .45, .4, .6)
    r.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(s)}" ry="{f(s * 1.15)}" fill="{g}"/>')
    r.add(f'<ellipse cx="{f(cx - s * .35)}" cy="{f(cy - s * .4)}" rx="{f(s * .3)}" ry="{f(s * .22)}" fill="#fff" opacity=".95"/>')
    r.add(f'<path d="M{f(cx - s * .6)} {f(cy + s * .5)} q{f(s * .6)} {f(s * .5)} {f(s * 1.2)} 0" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/>')


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
            u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1])


def ksztalt_liscia(L, sz, zabki=0, ksztalt=.55):
    """Liść wzdłuż osi X, od (0,0) – nasada – do (L,0) – czubek. Zwraca ścieżkę."""
    gora = [(0, 0), (L * (1 - ksztalt) * .5, -sz * 1.3), (L * .75, -sz * .9), (L, 0)]
    dol = [(L, 0), (L * .75, sz * .9), (L * (1 - ksztalt) * .5, sz * 1.3), (0, 0)]
    if not zabki:
        return (f"M0 0C{f(gora[1][0])} {f(gora[1][1])} {f(gora[2][0])} {f(gora[2][1])} {f(L)} 0"
                f"C{f(dol[1][0])} {f(dol[1][1])} {f(dol[2][0])} {f(dol[2][1])} 0 0Z")
    pts = []
    for krzywa in (gora, dol):
        for i in range(1, zabki * 2 + 1):
            t = i / (zabki * 2 + 1)
            x, y = bez(*krzywa, t)
            if i % 2:
                # ząbek skierowany na zewnątrz i lekko do czubka
                dx = 1.6
                dy = -2.2 if krzywa is gora else 2.2
                x, y = x + dx, y + dy * (1 - abs(t - .5))
            pts.append((x, y))
        pts.append(krzywa[3])
    return "M0 0L" + "L".join(f"{f(x)} {f(y)}" for x, y in pts) + "Z"


def lisc(r, x, y, L, sz, kat, kolory=("#7CC35E", "#3E8E3A", "#256325"), zylki=5, zabki=0,
         zylka_kolor="#E8F5D8", ksztalt=.55, cien_lisc=True):
    """Liść z nasadą w (x,y), skierowany pod kątem kat (stopnie)."""
    g = r.lin([(0, kolory[0]), (.55, kolory[1]), (1, kolory[2])], 0, 0, 0, 1)
    d = ksztalt_liscia(L, sz, zabki, ksztalt)
    s = [f'<g transform="translate({f(x)} {f(y)}) rotate({f(kat)})">']
    if cien_lisc:
        s.append(f'<path d="{d}" fill="#14320f" opacity=".18" transform="translate(1.5 2.5)"/>')
    s.append(f'<path d="{d}" fill="{g}"/>')
    # połówka ciemniejsza – wrażenie zagięcia wzdłuż nerwu
    s.append(f'<path d="M0 0C{f(L * .3)} {f(sz * .9)} {f(L * .75)} {f(sz * .7)} {f(L)} 0Z" fill="#0d2a0a" opacity=".14"/>')
    s.append(f'<path d="M1 0Q{f(L * .5)} {f(-sz * .08)} {f(L * .97)} 0" stroke="{zylka_kolor}" stroke-opacity=".75" stroke-width="{f(max(.8, sz * .09))}" fill="none" stroke-linecap="round"/>')
    for i in range(1, zylki + 1):
        t = i / (zylki + 1)
        bx = L * t * .92
        for strona in (-1, 1):
            ex = bx + L * .14
            ey = strona * sz * (.95 - abs(t - .4) * .9)
            s.append(f'<path d="M{f(bx)} 0Q{f(bx + L * .05)} {f(ey * .5)} {f(ex)} {f(ey)}" stroke="{zylka_kolor}" '
                     f'stroke-opacity=".45" stroke-width=".7" fill="none"/>')
    s.append("</g>")
    r.add("".join(s))


def lodyga(r, d, szer, kolory=("#6AA548", "#3C7A2A")):
    g = r.lin([(0, kolory[0]), (1, kolory[1])], 0, 0, 1, 1)
    r.add(f'<path d="{d}" stroke="#16330f" stroke-opacity=".25" stroke-width="{f(szer + 1.5)}" fill="none" stroke-linecap="round" transform="translate(1 1.5)"/>')
    r.add(f'<path d="{d}" stroke="{g}" stroke-width="{f(szer)}" fill="none" stroke-linecap="round"/>')
    r.add(f'<path d="{d}" stroke="#fff" stroke-opacity=".25" stroke-width="{f(szer * .25)}" fill="none" stroke-linecap="round" transform="translate(-{f(szer * .2)} -{f(szer * .2)})"/>')


def platki_kielicha(r, cx, cy, n, L, sz, start, kolory=("#78C257", "#3E8E3A", "#235E22")):
    """Działki kielicha / szypułkowe listki rozchodzące się z jednego punktu."""
    for i in range(n):
        kat = start + i * 360 / n + random.uniform(-8, 8)
        lisc(r, cx, cy, L * random.uniform(.85, 1.1), sz, kat, kolory, zylki=0, ksztalt=.2)


def punkty_w_elipsie(cx, cy, rx, ry, n, rng, margines=.9):
    pts = []
    while len(pts) < n:
        x, y = rng.uniform(-1, 1), rng.uniform(-1, 1)
        if x * x + y * y <= margines:
            pts.append((cx + x * rx, cy + y * ry))
    return pts
