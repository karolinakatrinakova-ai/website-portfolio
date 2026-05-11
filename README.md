# Custom websites for small businesses

A small portfolio site plus seven industry demos by **Karolína Katriňáková**.
Hand-built websites for small businesses in Slovakia and the Czech Republic.

- **Tagline:** *"Hand-built websites, made with care."*
- **Stack:** plain HTML, CSS, vanilla JavaScript — no build step, no framework.
- **Languages:** EN (default) · SK · CS, switchable in the navbar.

## What's in the box

```
Webovky/
├── studio/                              ← portfolio site
│   ├── index.html                       ← landing page
│   ├── services.html                    ← what I do
│   ├── pricing.html                     ← fixed-quote model
│   ├── portfolio.html                   ← all seven demos
│   ├── contact.html                     ← mailto-based contact form
│   ├── privacy.html                     ← short, honest privacy note
│   ├── 404.html
│   ├── css/                             ← shared design system
│   ├── js/                              ← interactions + i18n
│   ├── i18n/                            ← en.json · sk.json · cs.json (+ dict.js bundle)
│   └── favicon.svg
│
├── templates/                           ← 7 industry demos, each a standalone site
│   ├── 01-lumi-hair-salon/              ← Lumi · hair salon
│   ├── 02-luna-cafe/                    ← Luna · café · brunch
│   ├── 03-mend-physiotherapy/           ← Mend · physiotherapy clinic
│   ├── 04-rove-photographer/            ← Rove · wedding / portrait photographer
│   ├── 05-stem-florist/                 ← Stem · boutique florist
│   ├── 06-aria-yoga-studio/             ← Aria · yoga & pilates studio (booking flow)
│   └── 07-sala-restaurant/              ← Sála · fine-dining restaurant
│
├── outreach/                            ← personal marketing materials (consider keeping private)
│   ├── STRATEGIA.md
│   ├── BIZNIS-TYPY.md
│   ├── EMAIL-SABLONY.md
│   └── tracker.csv
│
├── docs/                                ← internal notes
└── scripts/
    └── regen-dicts.js                   ← rebuilds template i18n bundles
```

## Studio main page sections

In order on `studio/index.html`:

1. **Hero** — name, tagline, CTAs
2. **Demo strip** — "Everything below is fully clickable"
3. **Marquee** — industries served
4. **7 demos** — clickable showcase grid
5. **About** — solo studio, marketing-led
6. **Services** — strategy, design & code, copy, local SEO, three languages, optional care
7. **Features** — what your site can include (booking, e-shop, schedule, gallery, payments, etc.)
8. **Process** — four steps from first call to launch
9. **Why custom** — comparison vs Wix/Squarespace and agency
10. **Pricing band** — fixed quote, no hourly games
11. **FAQ** — seven common questions
12. **CTA** — write me about your business
13. **Footer** with privacy + cookies link

## Brand & design

- **Palette:** warm cream `#f7f3ec` · sage green `#6a7a55` · warm ink `#2b2925` · dusty rose accent `#c58e85`
- **Typography:** Instrument Serif (display, italic) + Inter (body)
- **Logo mark:** lowercase serif `k.` on a dark squircle (see `studio/favicon.svg`)

## Internationalisation

- Three languages: `en`, `sk`, `cs` — default is `en`, switchable in the navbar
- Strings live in `studio/i18n/{en,sk,cs}.json` (and per-template equivalents)
- HTML uses `data-i18n="key"` and `data-i18n-attr="content|key"`
- Bundled into `dict.js` via `scripts/regen-dicts.js` for synchronous load
- localStorage keys (legacy from earlier brand iterations):
  - `sage_lang` — chosen language
  - `petal_cookies` — cookie banner answer
  - `petal_announcement_closed` — announcement bar dismissal

## What the site honestly does and doesn't do

- ✓ Stores chosen language and cookie-banner answer in your browser only
- ✓ Contact form opens your email client with a pre-filled message
- ✗ No analytics, no ad pixels, no third-party tracking installed
- ✗ No newsletter signup
- ✗ No real client data — the seven sites in `templates/` are demos, not live clients

## Local development

The site loads `dict.js` via `<script>` so opening `file://` works, but a local server is more reliable:

```bash
cd ~/Desktop/Webovky
python3 -m http.server 8765
```

Then open:

- `http://localhost:8765/studio/index.html` — main portfolio
- `http://localhost:8765/templates/06-aria-yoga-studio/index.html` — most complex demo (booking + checkout)
- (etc.)

## Regenerating i18n bundles

After editing any `i18n/{en,sk,cs}.json`:

```bash
node scripts/regen-dicts.js
```

This rewrites `templates/*/i18n/dict.js`. The studio bundle is regenerated inline by the same script pattern.

## Deployment

All files are static — pick whichever host you prefer:

| Host | Free tier | Custom domain | Build step |
|---|---|---|---|
| GitHub Pages | ✓ | ✓ | none |
| Netlify | ✓ | ✓ | none |
| Vercel | ✓ | ✓ | none |
| Cloudflare Pages | ✓ | ✓ | none |

Recommended: **GitHub Pages** for the main studio site, **Netlify per-client** for individual templates so each future client owns their own deploy.

## Contact

- **Karolína Katriňáková**
- Email: `karolina.katrinakova@gmail.com`
- Phone: `+420 774 504 320`
- Based in Prague — remote, in person if it makes sense

## License

All code in this repository is © 2026 Karolína Katriňáková. The seven demo templates, the studio site and its design system are the author's portfolio work. Please don't redistribute or resell as a template kit. Inspiration is fine; copy-paste isn't.
