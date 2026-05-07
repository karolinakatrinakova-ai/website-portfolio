# Webovky · webstudio kit

Profesionálny štartovací kit na živnosť tvorby webov pre malé firmy v SK/CZ.

Inšpirované [Bloom Studio](https://bloomstudio.cz) projektom — rovnaká úroveň dizajnu, animácií a UX, len pre tvoj webstudio brand a pre 4 rôzne biznis archetypy ako šablóny.

## Čo je vnútri

```
Webovky/
├── studio/                      ← Tvoj webstudio brand (rozcestník + multi-page)
│   ├── index.html               ← úvodná stránka
│   ├── about.html               ← príbeh, hodnoty, ja
│   ├── services.html            ← služby
│   ├── process.html             ← ako spolupracujeme
│   ├── pricing.html             ← cenník
│   ├── portfolio.html           ← všetky 4 ukážky
│   ├── contact.html             ← kontakt + formulár
│   ├── social.html              ← coming-soon pre social media
│   ├── privacy.html             ← GDPR
│   ├── 404.html                 ← chybová stránka
│   ├── css/                     ← ucelený design system
│   ├── js/                      ← interakcie + i18n
│   ├── i18n/                    ← preklady (SK / CS / EN)
│   └── images/
│
├── templates/                   ← 4 ukážkové weby pre rôzne biznis typy
│   ├── 01-salon-lumi/           ← Kaderníctvo (warm / elegant)
│   ├── 02-cafe-luna/            ← Kaviareň + brunch (NEW)
│   ├── 03-fyzio-plus/           ← Fyzioterapia (NEW)
│   └── 04-studio-novak/         ← Fotograf (NEW)
│
├── outreach/                    ← Hľadanie a oslovovanie klientov
│   ├── STRATEGIA.md
│   ├── BIZNIS-TYPY.md           ← detailná analýza segmentov SK + CZ
│   ├── EMAIL-SABLONY.md
│   └── tracker.csv
│
└── docs/
    ├── NASADENIE.md             ← deploy + Github Pages + doména
    ├── DIZAJN-SYSTEM.md         ← ako rozšíriť / customizovať
    └── KONFIGURACIA-CLIENT.md   ← checklist pre nový klientsky web
```

## Ako to spustiť (lokálne)

Stačí dvojklik na ktorýkoľvek `index.html` v Sublime / Finderi → otvorí sa v prehliadači.

Pre serióznejšie testovanie spusti lokálny server:

```bash
cd ~/Desktop/Webovky
python3 -m http.server 5500
# potom otvor http://localhost:5500/studio/
```

## Ako to publikovať na GitHube (zdarma)

```bash
cd ~/Desktop/Webovky
git init
git add .
git commit -m "init: webstudio + 4 templates"
gh repo create webovky --public --source=. --remote=origin --push
# alebo bez gh CLI:
# git remote add origin https://github.com/<user>/webovky.git
# git push -u origin main
```

Potom v `Settings → Pages → Source: main / root` zapneš **GitHub Pages**.
Web bude dostupný napríklad ako `https://<user>.github.io/webovky/studio/`.

Pre vlastnú doménu: pridaj `CNAME` súbor s tvojou doménou a v DNS nastav `A` záznam na GitHub IP-čka.

Detailne: viď `docs/NASADENIE.md`.

## Dizajn-system (Bloom-grade)

Každá stránka — či už studio alebo template — má všetky tieto features:

- ✓ **Page loader** s pulzujúcim brandom
- ✓ **Announcement bar** (zatvárateľný, perzistované cez localStorage)
- ✓ **Reading progress bar** v hornej časti
- ✓ **Sticky navbar** s hide-on-scroll-down + scrolled state + dropdown menu
- ✓ **Mobile menu overlay** s plynulým prechodom
- ✓ **Hero** s split typografiou + scroll indicator
- ✓ **Marquee** running text
- ✓ **Count-up stats**
- ✓ **Stagger animations** pri scrolle
- ✓ **Timeline** komponent
- ✓ **FAQ accordion**
- ✓ **Lightbox** pre fotky
- ✓ **Drag-to-scroll gallery strip**
- ✓ **Testimonial slider** s autoplay + dots + drag/swipe
- ✓ **Cookie banner** (perzistencia)
- ✓ **Intro offer modal** (sessionStorage, časovač)
- ✓ **Mobile sticky CTA**
- ✓ **Back-to-top** floating tlačidlo
- ✓ **Page exit transitions** (fade out pri navigácii)
- ✓ **Skip-to-content** link (a11y)
- ✓ **Reduced motion** rešpektovanie
- ✓ **Schema.org JSON-LD** local business
- ✓ **OG meta tagy** + theme-color
- ✓ **Lazy loading** obrázkov
- ✓ **i18n** — SK / CS / EN switcher v navbare

## Multilanguage (i18n)

Každá stránka načíta `i18n/<lang>.json` a rozdistribuuje preklady do `data-i18n="kľúč"` elementov. Voľba sa ukladá do `localStorage` ako `webovky_lang`.

Pridanie ďalšieho jazyka = vytvor nový JSON súbor, doplň switcher option v navbare.

## Ako pridať nový template pre klienta

1. Skopíruj `templates/01-salon-lumi/` do `templates/05-novy-klient/`.
2. Otvor `index.html` v Sublime — uprav texty (postupne).
3. Vlož klientske fotky do `images/`.
4. Aktualizuj farby v `css/style.css` (premenné `--primary`, `--accent`).
5. Uprav i18n preklady v `i18n/`.
6. Test → publikuj.

Detailne: `docs/KONFIGURACIA-CLIENT.md`.
