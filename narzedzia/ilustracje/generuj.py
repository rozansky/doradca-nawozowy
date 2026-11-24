"""Zapisuje wszystkie ilustracje do katalogu podanego jako argument."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import warzywa  # noqa: E402
import inne  # noqa: E402

kat = sys.argv[1]
os.makedirs(kat, exist_ok=True)
wszystkie = {**warzywa.R, **inne.R}
for nazwa, tresc in wszystkie.items():
    with open(os.path.join(kat, f"{nazwa}.svg"), "w", encoding="utf-8") as plik:
        plik.write(tresc)
    print(f"{nazwa:10} {len(tresc) // 1024:4} KB")
