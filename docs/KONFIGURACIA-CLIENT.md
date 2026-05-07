# Konfigurácia nového klientskeho webu — checklist

Krok-po-kroku, ako z portfólio-šablóny urobiť funkčný klientsky web.

---

## Pred-projektový audit (deň 0)

- [ ] Vyplnený **brief** od klienta (tu nižšie šablóna)
- [ ] Doména — kúpená alebo dohodnutá kúpa
- [ ] Hosting — vybrané riešenie (GitHub Pages / Netlify / iné)
- [ ] Záloha 50 % zaplatená
- [ ] Šablóna na základ vybraná (z `templates/`)

---

## Klientsky brief (pošli mailom pred začiatkom)

```
Ahoj [meno],

aby som mohla pripraviť čo najlepší web, potrebujem od teba pár informácií.
Stačia stručné odpovede — pomôže to urýchliť celý proces.

1. PREDSTAVENIE FIRMY
   - Názov firmy:
   - Slogan / krátka veta o tom, čo robíš:
   - Mesto / lokácia:
   - Kedy ste začali:

2. KLIENTI
   - Kto sú vaši typickí klienti? (vek, situácia)
   - Ako vás zvyčajne nájdu? (referencie, Google, IG)
   - Čo by mal web vyriešiť? (rezervácie, telefonáty, kontakt, nákup)

3. SLUŽBY / PRODUKTY
   - Zoznam hlavných služieb (3–8):
   - Cenník (alebo „od – do"):
   - Sezónnosť?

4. KONTAKTNÉ ÚDAJE
   - E-mail:
   - Telefón:
   - WhatsApp (ak iný):
   - Instagram:
   - Facebook:
   - Adresa (pre Google Maps):
   - Otváracie hodiny:

5. VIZUÁL
   - Logo (ak máš, posli SVG / PNG):
   - Existujúce fotky (Drive / Dropbox link):
   - Farby, ktoré sa ti páčia (hex, alebo „warm + elegant"):
   - Stránky, ktoré sa ti páčia (linky):

6. ŠTRUKTÚRA
   - Stačí jednostránkový web alebo viacstránkový?
   - Multilanguage (SK / CZ / EN)?
   - Online rezervácia?
   - Newsletter?

7. INÉ
   - Niečo špeciálne, čo by web mal mať?
   - Termíny / deadliny?

Pošli odpovede e-mailom. Ak ti nejaká otázka nedáva zmysel,
preskoč ju, prejdeme cez ňu na hovore.

Vďaka!
[Vaše meno]
```

---

## Setup — deň 1

### 1. Vytvor priečinok pre klienta

```bash
cd ~/Desktop/Webovky/templates
cp -r 01-salon-lumi 05-novy-klient
cd 05-novy-klient
```

### 2. Inicializuj Git pre tento projekt (samostatný repo)

```bash
# alebo ak budeš v jednom mono-repe, preskoč
git init
git add .
git commit -m "init: 05-novy-klient based on 01-salon-lumi"
```

### 3. Otvor v Sublime / VS Code

```bash
subl . # alebo cursor . / code .
```

---

## Customizácia — deň 2–3

### A. Theme.css

- [ ] Skopíruj nový blok `:root { ... }` s farbami klienta
- [ ] Vyber Google Fonts (1 serif + 1 sans-serif)
- [ ] Zmena `@import` Google Fonts URL
- [ ] Test v prehliadači — vyzerá to "ako klientovi"?

### B. index.html

- [ ] **`<head>`**:
  - [ ] `<title>` — názov firmy + mesto
  - [ ] `<meta name="description">` — výstižná veta s kľúčovými slovami
  - [ ] OG meta tags (title, description, image URL)
  - [ ] `theme-color` — primárna brand farba
  - [ ] schema.org JSON-LD — správny typ (`HairSalon`, `Restaurant`, `MedicalBusiness`, etc.)
- [ ] **Hero**:
  - [ ] Pozadie (`.banner__bg img src`) — relevantná fotka
  - [ ] H1 / H2 texty
- [ ] **Sekcie**:
  - [ ] Aktualizuj všetky `data-i18n="..."` texty (alebo nahraď v JSON)
  - [ ] Vymeň fotky
- [ ] **Kontakt**:
  - [ ] Adresa
  - [ ] Telefón / WhatsApp linky (`tel:`, `wa.me/`)
  - [ ] E-mail (`mailto:`)
  - [ ] Mapa (OpenStreetMap iframe URL — uprav súradnice)
- [ ] **Footer**: copyright, právne linky

### C. i18n preklady

Otvor `i18n/sk.json` a prepíš všetky kľúče. Potom skopíruj do `cs.json` a `en.json` a prelož.

> **Tip**: Použi DeepL Pro pre prvý draft, potom prejdi a polepi humán.

### D. Fotky

Klientske fotky:
- [ ] Hero fotka (najmenej 1920×1080)
- [ ] 4–6 fotiek do galérie / portfólio sekcie
- [ ] 3 portrétne fotky tímu (ak je `team` sekcia)

Ak klient fotky nemá, zatiaľ použi Unsplash:
1. Choď na [unsplash.com](https://unsplash.com)
2. Hľadaj „hair salon", „cafe interior" atď.
3. Klikni na fotku → **Free Download** → kopíruj URL alebo stiahni
4. **Optimalizuj** cez [squoosh.app](https://squoosh.app) — cieľ < 200 KB pre web obrázok
5. Použi format **WebP** alebo **AVIF**

---

## Test — deň 4

### Lokálny test

```bash
cd ~/Desktop/Webovky
python3 -m http.server 5500
# v prehliadači: http://localhost:5500/templates/05-novy-klient/
```

### Cross-browser test

- [ ] Chrome desktop
- [ ] Safari desktop (Mac)
- [ ] Firefox desktop
- [ ] **iPhone Safari** (skutočný telefón!)
- [ ] **Android Chrome** (skutočný telefón!)

### Funkčný test

- [ ] Hamburger menu sa otvorí na mobile
- [ ] Lang switcher funguje (SK/CS/EN)
- [ ] Lightbox sa otvára kliknutím na fotku
- [ ] Smooth scroll na #anchor odkazoch
- [ ] Formulár sa odošle (e-mail otvorí klienta)
- [ ] Mapa sa zobrazuje
- [ ] FAQ accordion otvára/zatvára

### Performance test

Po nasadení online:
- [ ] [pagespeed.web.dev](https://pagespeed.web.dev) — skóre > 85
- [ ] [gtmetrix.com](https://gtmetrix.com) — A grade
- [ ] [webpagetest.org](https://webpagetest.org) — Speed Index < 4s

### SEO test

- [ ] [structured-data.org/validator](https://validator.schema.org) — schema.org valid
- [ ] [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) — mobil-friendly
- [ ] Google Search Console — sitemap submitted

---

## Nasadenie — deň 5

Pozri `NASADENIE.md` pre detailný návod (GitHub Pages / Netlify / Vercel).

### Po nasadení

- [ ] Prepojenie s **Google Business Profile** (Settings → Edit profile → Website)
- [ ] **Google Search Console** pridaný + sitemap
- [ ] **Google Analytics 4** (ak chce klient)
- [ ] **Robots.txt** — minimum:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://klient.sk/sitemap.xml
  ```
- [ ] **sitemap.xml** — generuj cez [xml-sitemaps.com](https://xml-sitemaps.com)
- [ ] **Favicon** — `favicon.svg` v root + `<link rel="icon">` v `<head>`
- [ ] **Apple touch icon** — 180×180px PNG, `<link rel="apple-touch-icon">`

---

## Odovzdávanie klientovi

### PDF prístupový dokument

```
WEBOVKA: <názov klienta>
Doménový panel: https://websupport.sk · login: ... · heslo: ...
Hosting: https://app.netlify.com · login: ... · heslo: ...
E-mail (ak vlastný): https://zoho.com · login: ... · heslo: ...
GitHub repo: https://github.com/.../klient-web
Google Business: https://business.google.com · login: ...

URL adresy webu:
- https://klient.sk (hlavná)
- https://www.klient.sk → automatický redirect
```

### Krátke video tutorialy (5 min každý)

- Ako zmeniť otváracie hodiny
- Ako pridať / odstrániť službu z cenníka
- Ako pridať fotku do galérie
- Čo robiť, ak web spadne (pošli mi mail)

Nahraj cez [Loom](https://loom.com) alebo [Vidyard](https://vidyard.com) — zdarma.

### Faktúra + odovzdací protokol

Krátky dokument, ktorý oboje podpíšete:

```
ODOVZDÁVACÍ PROTOKOL

Web: https://klient.sk
Klient: <názov, IČO>
Dodávateľ: <Vaše meno, IČO>
Dátum dodania: <dátum>

Odovzdané:
☑ Funkčný web na adrese https://klient.sk
☑ Mobilný + desktop responzívny dizajn
☑ Online rezervácia napojená
☑ Lokálne SEO + schema.org
☑ Prístupy: doména, hosting, GitHub
☑ PDF návod + 4 video tutoriály
☑ 30-dňová záruka funkčnosti

Cena: 490 €
Záloha (50 %, dátum): 245 €
Doplatok (50 %): 245 €

Podpis dodávateľa: __________  Podpis klienta: __________
Dátum: __________            Dátum: __________
```

---

## 30 dní po dodaní — follow-up

- [ ] Pošli mail: "Ahoj, ako sa darí webu? Stretla si nejaký problém?"
- [ ] Skontroluj uptime cez UptimeRobot
- [ ] Skontroluj Search Console — žiadne errory?
- [ ] Ponuk **mesačnú údržbu** za 25 € (ak ešte nepodpísali)
- [ ] **Poprosi o referenciu** + odporučenie na kamarátov (s 50 € odmenou)

---

## Po roku — ročná kontrola

- [ ] Doménová obnova (klient si predĺži alebo cez teba)
- [ ] Hosting status — stále funguje?
- [ ] Pridanie noviniek (texty, fotky, akcie)
- [ ] Aktualizácia copyright roku v päte
- [ ] PageSpeed re-test
- [ ] Návrh možného upgrade (multilang, blog, e-shop?)

---

## Bežné problémy a riešenia

| Problém | Riešenie |
|---|---|
| Mobilná verzia vyzerá divne | Test na skutočnom mobile, nie len devtools |
| Web sa otvára pomaly | PageSpeed audit → comprime obrázky |
| Forma nepošle e-mail | mailto: má limit; použi Tally / Formspree |
| Klient chce zmeniť písmo o 1px | Posun ho na placený mesačný balíček |
| Klient chce e-shop | Premysli — Shopify / WooCommerce, nie my |
| Klient odíde k inej agentúre | Daj mu plný prístup, neplytvaj energiou |
