# Dizajn-system · ako customizovať

Celý projekt používa zdielaný **CSS dizajn-systém** so silnou architektúrou. Toto je návod, ako ho prispôsobovať pre nového klienta.

---

## Architektúra

```
studio/css/
├── style.css                ← root, importuje všetko + globálne tokeny
└── components/
    ├── navbar.css           ← navigačný panel
    ├── buttons.css          ← tlačidlá
    ├── cards.css            ← karty, pricing tiers
    ├── sections.css         ← sekcie, splity, photo grids
    ├── forms.css            ← formuláre
    ├── footer.css           ← päta
    └── testimonials.css     ← slider recenzií

templates/<X>/css/theme.css  ← override: import studio/style + override tokenov
```

Každý template má svoj **theme.css**, ktorý:
1. Importuje `studio/css/style.css`
2. Overrid-uje `:root { --bg, --ink, --accent, ... }` farby + fonty
3. Pridáva template-specific komponenty

---

## CSS premenné (design tokens)

Toto je sada premenných, ktoré definujú celý vzhľad.

| Premenná | Popis | Default (studio) |
|---|---|---|
| `--bg` | Hlavné pozadie | `#f6f3ee` cream |
| `--bg-2` | Alternatívne pozadie (sekcia--alt) | `#ece6dc` darker cream |
| `--bg-3` | Karty, formuláre | `#faf7f1` lighter |
| `--ink` | Hlavný text + tmavé pozadia | `#0c0c0b` near-black |
| `--ink-soft` | Sekundárny text | `#34322f` |
| `--stone` | Muted text | `#6e685d` |
| `--muted` | Placeholder, tichý | `#9a9285` |
| `--line` | Border default | `#d8cfc1` |
| `--line-soft` | Subtílne čiary | rgba |
| **`--accent`** | **Hlavná akcentová farba** | `#6a7a55` sage green |
| `--accent-deep` | Hover, dôraz | `#4f5c3f` |
| `--accent-soft` | Tagy, badges | `#e8ede0` |
| `--olive`, `--plum` | Sekundárne akcenty | green, plum |
| `--serif` | Display font | Instrument Serif |
| `--sans` | Body font | Inter |

---

## Ako customizovať pre klienta — 5 krokov

### Krok 1: zvoľ paletu

Otvor [coolors.co/palettes/trending](https://coolors.co/palettes/trending) alebo [pinterest.com → search "color palette + odvetvie klienta"]. Inšpiráciu pre štýly:

- **Warm & elegant** (salóny, butiky) → krémová + rose-gold
- **Earthy & natural** (kaviarne, ekoshopy) → terra + matcha
- **Trustworthy & calm** (zdravotníctvo, finance) → soft blue + warm gray
- **Editorial & dark** (fotografi, módnictvo) → black + champagne
- **Bold & modern** (startupy, IT) → off-white + electric

Vyber 4 farby:
- 1 hlavné pozadie (svetlé alebo tmavé)
- 1 textová farba (kontrastne k pozadiu)
- 1 akcent (signature farba brandu)
- 1 deep accent (hover, dôraz)

### Krok 2: zvoľ typografiu

Hlavné odporúčania (všetky cez Google Fonts, zdarma):

- **Cormorant Garamond / Instrument Serif** — moderné editorial
- **Fraunces** — soft serif s variabilnou estetikou
- **Italiana** — luxury display
- **Lora** — clean book serif (skvelé pre zdravotníctvo, právo)
- **Playfair Display** — high contrast, elegantné
- **Inter** — perfect sans-serif pre body text
- **DM Sans** — modernejšia alternatíva
- **Manrope** — geometric, tech feel

### Krok 3: priprav `theme.css`

```css
/* templates/05-novy-klient/css/theme.css */

@import url("../../../studio/css/style.css");

:root {
  --bg:          #FAF8F5;     /* nová svetlá béžová */
  --bg-2:        #EFE8DD;
  --bg-3:        #FFFFFF;
  --ink:         #1A1A1A;
  --ink-soft:    #3D3A35;
  --stone:       #807A6C;
  --muted:       #B0A89A;
  --line:        #E0D7C5;
  --line-soft:   rgba(60, 50, 40, 0.12);

  --accent:      #C04A2B;     /* terracotta */
  --accent-deep: #962E15;
  --accent-soft: #F4D5C4;

  --serif:       "Playfair Display", Georgia, serif;
  --sans:        "Manrope", system-ui, sans-serif;
}

@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap");

/* template-specific komponenty (napr. menu list pre kaviarne) */
```

### Krok 4: skopíruj a uprav HTML

Skopíruj index.html z najpodobnejšej šablóny. Upravuj v Sublime:

1. **Odstráň/pridaj sekcie** — komentáre `<!-- SECTION X -->` ti pomôžu
2. **Vymeň texty** — všetky relevantné majú `data-i18n="kľúč"` atribút
3. **Vymeň fotky** — search Unsplash, kopíruj link
4. **Aktualizuj schema.org JSON-LD** v `<head>`
5. **Aktualizuj kontaktné údaje** v navbar a footer

### Krok 5: uprav i18n súbory

Skopíruj `i18n/sk.json` z inej šablóny, prelož kľúče. Potom `cs.json` a `en.json`.

### Voliteľný krok 6: brand-specific komponent

Ak klient potrebuje špeciálnu komponentu (napr. timeline pre wedding plánovača), pridaj ju do `theme.css`:

```css
.wedding-timeline {
  /* ... */
}
```

---

## Skin templating — quick reference

| Komponenty (študio CSS) | Pred/po — čo zmeniť |
|---|---|
| `.banner` | Pozadie cez `.banner__bg`, vrstvenie cez `.banner__veil` |
| `.section`, `.section--alt`, `.section--dark` | Iba farby cez tokeny |
| `.cards`, `.icon-card` | Iba farby + okraje |
| `.timeline` | Farba bodiek cez `--accent` |
| `.faq__item` | Funguje univerzálne |
| `.testimonial-card` | Quote font cez `--serif` |
| `.tier`, `.tier--feat` | Najobľúbenejší tier má `--feat` modifier |
| `.btn`, `.btn-accent`, `.btn-secondary` | Iba farby |

---

## Animácie a interakcie

Všetko zdarma cez **vanilla JS** v `js/main.js`:

- `IntersectionObserver` pre fade-in / stagger animácie → pridaj triedu `.fade-in` na element
- `data-target="42" data-suffix="+"` → count-up štatistika
- `<details class="faq__item">` → FAQ accordion (HTML native)
- `class="testimonial-slider"` + správna štruktúra → automatický slider

---

## Best practices pri prerábaní šablóny

1. **Najprv obsah, potom dizajn** — nakopíruj texty a štruktúru, potom hraj farby
2. **3 farby maximálne** — bg, ink, accent. Viac = chaos
3. **2 fonty maximálne** — serif + sans-serif
4. **Whitespace > obsah** — radšej dva riadky textu s priestorom než pet riadkov natlačených
5. **Mobil first** — testuj na 375px (iPhone SE) a 390px (iPhone 14)
6. **Žiadne stock fotky úsmevov** — buď reálne fotky klienta, alebo Unsplash (žiadne gettyimages-style)

---

## Performance check pred dodaním

```bash
# Lokálne audit
npx lighthouse http://localhost:5500/templates/01-salon-lumi/ --view

# alebo online
# https://pagespeed.web.dev/?url=https://...
```

Ciele:
- **Performance** > 85
- **Accessibility** > 90
- **Best Practices** > 90
- **SEO** > 90

Bežné problémy:
- Obrázky bez `loading="lazy"` → pridaj atribút
- Externé fonty bez preload → pridaj `<link rel="preload" as="font" ...>`
- Layout shift z reklám / iframov → reservuj fixnú výšku

---

## Doplňovanie nových komponentov

Ak často potrebuješ nový komponent (napr. „event calendar"), **nepridávaj ho do template-u** — pridaj ho do `studio/css/components/` ako reusable a importni v `style.css`. Týmto získa ho každá šablóna.

Pravidlo: **3× použitý komponent = patrí do studio**, nie do template.
