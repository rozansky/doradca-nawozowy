"""Lokalny serwer strony bez pamięci podręcznej.

Zwykły `python -m http.server` pozwala przeglądarce trzymać stare pliki,
przez co po zmianach strona potrafi pokazywać starą wersję.
Ten serwer każe przeglądarce za każdym razem sprawdzać, czy plik się zmienił.

Użycie:  python serwer.py [port]     (domyślnie 8000)
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class BezPamieci(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Strona: http://localhost:{port}")
    ThreadingHTTPServer(("", port), BezPamieci).serve_forever()
