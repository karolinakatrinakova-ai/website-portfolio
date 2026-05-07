# Petal Studio · web design kit

Hand-built websites for small businesses in Slovakia and the Czech Republic.

Studio brand: **Petal** — short, modern, Bloom-adjacent but distinct. Tagline: *"Websites that grow your small business."*

Inspired by Bloom Studio's design level — same animations, micro-interactions, attention to detail — applied to a portfolio hub plus 6 industry-specific demo websites.

## What's in the box

```
Webovky/
├── studio/                          ← Petal Studio brand (portfolio hub + multi-page)
│   ├── index.html                   ← landing page (English default)
│   ├── about.html                   ← About Me · Kofio experience + LinkedIn + offer
│   ├── services.html                ← services
│   ├── process.html                 ← how we work
│   ├── pricing.html                 ← packages
│   ├── portfolio.html               ← all 6 demos
│   ├── contact.html                 ← contact form
│   ├── social.html                  ← social media coming-soon
│   ├── privacy.html                 ← GDPR
│   ├── terms.html                   ← T&C
│   ├── 404.html                     ← error page
│   ├── css/                         ← design system (1100+ lines)
│   ├── js/                          ← interactions + i18n
│   ├── i18n/                        ← EN (primary) · SK · CS translations
│   └── favicon.svg
│
├── templates/                       ← 6 industry demos (each its own folder)
│   ├── 01-lumi-hair-salon/          ← Lumi · hair salon (warm / elegant)
│   ├── 02-luna-cafe/                ← Luna · café & brunch
│   ├── 03-mend-physiotherapy/       ← Mend · physiotherapy clinic
│   ├── 04-rove-photographer/        ← Rove · wedding/portrait photographer
│   ├── 05-stem-florist/             ← Stem · botanical florist (NEW)
│   └── 06-aria-yoga-studio/         ← Aria · yoga & pilates studio (NEW)
│
├── outreach/                        ← finding & contacting clients
│   ├── STRATEGIA.md                 ← weekly outreach playbook
│   ├── BIZNIS-TYPY.md               ← deep market analysis · 30 segments
│   │                                  + REALISTIC-FIT shortlist (Tier A/B/C)
│   │                                  + INNOVATIVE FEATURES per segment (2026)
│   ├── EMAIL-SABLONY.md             ← cold email scripts (SK / CS)
│   └── tracker.csv
│
└── docs/
    ├── NASADENIE.md                 ← deploy · GitHub Pages / Netlify / Vercel
    ├── DIZAJN-SYSTEM.md             ← how to customize the design system
    └── KONFIGURACIA-CLIENT.md       ← client onboarding checklist
```

## Brand decisions

- **Studio name**: `Petal Studio` (replaced the placeholder `webovky`)
- **Default UI language**: **English** — switchable to SK / CS via the language toggle in the navbar
- **Primary domain (suggested)**: `petal.studio` or `petal.sk`
- **localStorage namespace**: `petal_*` (lang, cookies, intro, announcement)

## Template archetype names

Each template is a starting point — clients customize copy, photos, palette.

| # | Slug | Brand | Industry | Distinct innovative features |
|---|---|---|---|---|
| 01 | `01-lumi-hair-salon` | **Lumi** | Hair salon | Online booking, floating WhatsApp, gallery, price list |
| 02 | `02-luna-cafe` | **Luna** | Café · brunch · bistro | Menu, IG feed, hours, brunch card |
| 03 | `03-mend-physiotherapy` | **Mend** | Physiotherapy clinic | Conditions index, therapist profiles, online booking |
| 04 | `04-rove-photographer` | **Rove** | Wedding / portrait photographer | Editorial galleries, packages, brief form, photo grid |
| 05 | `05-stem-florist` | **Stem** | Boutique florist | Same-day delivery banner, seasonal collections, weddings, workshops calendar |
| 06 | `06-aria-yoga-studio` | **Aria** | Yoga & pilates studio | Intro-week pass, color-coded schedule grid, teacher profiles, 3 membership tiers |

## Bloom-grade UX/UI features in the design system

All 20+ baseline features are implemented in `studio/css/style.css` and used across templates:

- Page loader with brand pulse
- Announcement bar (dismissible, persists)
- Reading-progress bar
- Sticky navbar with hide-on-scroll + dropdown menu
- Mobile hamburger overlay
- Hero with split typography (italic accent line)
- Hero text-shadow + image veil for readability on any background
- Scroll indicator
- Marquee ticker
- Animated stat counters (intersection observer)
- Reveal-on-scroll (`fade-in`) + staggered children
- Timeline sections (numbered process)
- FAQ accordions (native `<details>`)
- Image lightbox
- Drag-to-scroll horizontal galleries
- Testimonial slider with autoplay + dots + drag swipe
- Cookie banner (persisted)
- Intro offer modal
- Mobile sticky CTA
- Back-to-top button
- Smooth page exit transitions
- Custom focus rings, skip-to-content link, reduced-motion respected

## i18n system (EN · SK · CS)

- **Default language**: English (also when no preference detected)
- **Switcher**: top-right of navbar, `[data-lang-switch]`
- **Persistence**: `localStorage.petal_lang`
- **Per-element translations**: `<element data-i18n="key.path">fallback</element>`
- **Per-attribute translations**: `data-i18n-attr="placeholder|key"`
- **HTML allowed**: set `data-i18n-html="true"` on elements with embedded markup

JSON files live in `studio/i18n/` and `templates/<slug>/i18n/` — three files each (`en.json`, `sk.json`, `cs.json`).

## Local development

`fetch()` for the i18n JSONs **does not work on `file://` URLs** — you'll see the fallback HTML defaults but no language switching. Always run a local server.

```bash
cd ~/Desktop/Webovky
python3 -m http.server 5500
# open http://localhost:5500/studio/index.html
```

Sublime Text users: open `~/Desktop/Webovky` as a project folder. Save → refresh browser.

## Cheatsheet

| Want to… | Edit |
|---|---|
| Change studio brand copy | `studio/index.html` + `studio/i18n/*.json` |
| Edit About Me / Kofio paragraph | `studio/about.html` |
| Edit pricing | `studio/index.html` (pricing section) + `i18n/*.json` |
| Add a new client testimonial | `studio/index.html` (testimonials) + `i18n/*.json` |
| Customize a template's palette | `templates/<slug>/css/theme.css` (the CSS variables at the top) |
| Update template copy in 3 langs | `templates/<slug>/i18n/{en,sk,cs}.json` |
| Add a new template | duplicate one of the 6 folders, change brand name + colors + i18n |
| Add a new business segment to outreach | `outreach/BIZNIS-TYPY.md` |
| Tweak a cold email script | `outreach/EMAIL-SABLONY.md` |

## Deployment

See `docs/NASADENIE.md` for the full guide.

Quick options:

- **GitHub Pages** (free, easy): push to GitHub, enable Pages on `main` branch, root folder
- **Netlify** (free, recommended): drag-and-drop the project folder, get instant SSL + custom domain
- **Vercel** (free, fastest): connect GitHub repo, automatic deploys on push

```bash
git add . && git commit -m "site update"
git push origin main          # GitHub Pages auto-rebuilds
```

## Email templates available in Cursor

For convenience, all key outreach docs are mirrored to `~/Desktop/aiTraining/` so you can read them inside Cursor:

- `Webovky-Email-Sablony.md`
- `Webovky-Biznis-Typy.md`
- `Webovky-Strategia.md`
- `Webovky-Tracker.csv`

---

**Hand-built with love for SK & CZ small businesses · Petal Studio · 2026**
