"""Build OG card PNG (1200x630) for studio.

Uses macOS system fonts so output is consistent on the dev machine.
Re-run after tweaking copy or layout. Output: studio/og-image.png
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "studio" / "og-image.png"

CREAM = (247, 243, 236)
INK = (43, 41, 37)
INK_SOFT = (77, 71, 61)
SAGE = (106, 122, 85)

W, H = 1200, 630

img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)

SERIF = "/System/Library/Fonts/Supplemental/Baskerville.ttc"
SANS = "/System/Library/Fonts/Helvetica.ttc"

f_name = ImageFont.truetype(SERIF, 124, index=0)
f_tagline = ImageFont.truetype(SERIF, 32, index=2)
f_label = ImageFont.truetype(SANS, 18)
f_mark = ImageFont.truetype(SERIF, 60, index=0)

LEFT = 96

d.line([(LEFT, 92), (LEFT + 110, 92)], fill=SAGE, width=2)
d.text((LEFT, 108), "PORTFOLIO  \u00B7  2026", font=f_label, fill=SAGE)

d.text((LEFT, 200), "Karolína", font=f_name, fill=INK)
d.text((LEFT, 340), "Katriňáková", font=f_name, fill=INK)

d.text((LEFT, 510), "Hand-built websites for small businesses.",
       font=f_tagline, fill=INK_SOFT)

d.text((1060, 510), "k", font=f_mark, fill=INK)
d.ellipse([(1106, 516), (1118, 528)], fill=SAGE)

img.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
