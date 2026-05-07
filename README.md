# Sage Studio · web design kit

Hand-built websites for small businesses in Slovakia and the Czech Republic.

Studio brand: **Sage** — short, calm, herbal. Tagline: *"Hand-built websites, made with care."*

A small portfolio website plus six demo sites that show what kind of work I can do.

## What's in the box

```
Webovky/
├── studio/                          ← Sage Studio brand (portfolio + about)
│   ├── index.html                   ← landing page (English default)
│   ├── about.html                   ← About Me · Kofio experience + LinkedIn
│   ├── services.html                ← services (only what I can deliver)
│   ├── pricing.html                 ← "discussed individually" — no packages
│   ├── portfolio.html               ← all six demo sites
│   ├── contact.html                 ← contact form
│   ├── social.html                  ← social media coming-soon
│   ├── privacy.html                 ← GDPR
│   ├── terms.html                   ← T&C
│   ├── 404.html                     ← error page
│   ├── css/                         ← design system
│   ├── js/                          ← interactions + i18n
│   ├── i18n/                        ← EN (primary) · SK · CS translations
│   └── favicon.svg
│
├── templates/                       ← 6 industry demos (each its own folder)
│   ├── 01-lumi-hair-salon/          ← Lumi · hair salon (warm / elegant)
│   ├── 02-luna-cafe/                ← Luna · café & brunch
│   ├── 03-mend-physiotherapy/       ← Mend · physiotherapy clinic
│   ├── 04-rove-photographer/        ← Rove · wedding/portrait photographer
│   ├── 05-stem-florist/             ← Stem · botanical florist
│   └── 06-aria-yoga-studio/         ← Aria · yoga & pilates studio
│
├── outreach/                        ← finding & contacting clients
│   ├── STRATEGIA.md                 ← weekly outreach playbook
│   ├── BIZNIS-TYPY.md               ← market analysis · realistic-fit shortlist
│   ├── EMAIL-SABLONY.md             ← cold email scripts (SK / CS)
│   └── tracker.csv
│
└── docs/
    ├── NASADENIE.md                 ← deploy · GitHub Pages / Netlify / Vercel
    ├── DIZAJN-SYSTEM.md             ← how to customize the design system
    └── KONFIGURACIA-CLIENT.md       ← client onboarding checklist
```

## Brand & site design

- **Studio name**: `Sage Studio`
- **Default UI language**: **English** — switchable to SK / CS via the navbar toggle
- **localStorage namespace**: `sage_*` (lang, cookies)
- **Suggested domain**: `sage.design` or `sage.studio`
- **Color palette**: warm cream `#f7f3ec` · sage green `#6a7a55` · warm ink `#2b2925` · dusty rose accent `#c58e85`
- **Typography**: Instrument Serif (display, italic) + Inter (body)

## Template overview

Each demo template is a standalone single-page site for that industry — used as a portfolio piece showing my work.

| # | Slug | Brand | Industry |
|---|---|---|---|
| 01 | `01-lumi-hair-salon` | **Lumi** | Hair salon |
| 02 | `02-luna-cafe` | **Luna** | Café · brunch · bistro |
| 03 | `03-mend-physiotherapy` | **Mend** | Physiotherapy clinic |
| 04 | `04-rove-photographer` | **Rove** | Wedding / portrait photographer |
| 05 | `05-stem-florist` | **Stem** | Boutique florist |
| 06 | `06-aria-yoga-studio` | **Aria** | Yoga & pilates studio |

## What's removed (deliberately simple)

Sage Studio is intentionally lean. The site does **not** include:

- ❌ Pricing packages — pricing is discussed per project, no fixed tiers
- ❌ Stat counters (delivery time, PageSpeed score, etc.)
- ❌ Process timeline (timelines depend on each project)
- ❌ Testimonials section (no real client references yet)
- ❌ Newsletter / email capture
- ❌ "Book a free call" / pushy CTAs — just "Get in touch"
- ❌ WhatsApp contact buttons
- ❌ Promises of features I can't deliver yet (blog, shop, GA4 analytics, 7-day delivery)

## Design system

The base CSS at `studio/css/style.css` provides a calm, considered design system used across studio + all six templates:

- Page loader with brand pulse
- Reading-progress bar
- Sticky navbar with hide-on-scroll
- Mobile hamburger overlay
- Hero with split typography (italic accent line)
- Hero text-shadow + image veil for readability
- Scroll indicator
- Marquee ticker
- Reveal-on-scroll + staggered children
- FAQ accordions (native `<details>`)
- Image lightbox
- Drag-to-scroll horizontal galleries
- Cookie banner (persisted)
- Mobile sticky CTA
- Back-to-top button
- Custom focus rings, skip-to-content link, reduced-motion respected

## i18n system (EN · SK · CS)

- Default = `en`. Detection via browser, persisted in `localStorage` under `sage_lang`.
- Switch is a simple 3-button toggle in the navbar (`EN / SK / CS`).
- Strings come from `studio/i18n/{en,sk,cs}.json`.
- HTML uses `data-i18n="key"` and `data-i18n-attr="content|key"` for attribute strings.
- All template demos have their own i18n folders too (industry-specific copy).

## Local development

Templates and the studio site use `fetch` for i18n, so opening files via `file://` won't load the translations. Always serve via a small HTTP server:

```bash
cd ~/Desktop/Webovky
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/studio/index.html` — main portfolio
- `http://localhost:8080/templates/01-lumi-hair-salon/index.html` — Lumi demo
- (etc.)

## Deployment

Free options for each template + studio:

| Where | Free | Custom domain | Build step |
|---|---|---|---|
| **GitHub Pages** | ✓ | ✓ | none (static) |
| **Netlify** | ✓ | ✓ | none |
| **Vercel** | ✓ | ✓ | none |

Recommended: GitHub Pages for the main studio site (deploy from a `webovky` repo), Netlify per-client for individual templates so each client owns their setup.

## Contact

- **Karolína Katriňáková**
- Email: `karolina.katrinakova@gmail.com`
- Phone: `+420 774 504 320`
- LinkedIn: profile linked from the About page
- Based in Prague & Bratislava — remote work, in-person if it makes sense
