# -*- coding: utf-8 -*-
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent

def render(html_path, pdf_path):
    t = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(Path(html_path).resolve().as_uri(), wait_until="networkidle", timeout=120000)
        pg.pdf(path=str(pdf_path), format="A4", print_background=True,
               margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        b.close()
    print("rendered", pdf_path, "in", round(time.time() - t, 1), "s")

if __name__ == "__main__":
    a = sys.argv[1:]
    html = Path(a[0]) if a else ROOT / "plan.html"
    pdf = Path(a[1]) if len(a) > 1 else ROOT / "最后45天冲刺总规划.pdf"
    render(html, pdf)
