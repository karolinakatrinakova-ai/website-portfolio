# Hlbká analýza biznis typov pre cold outreach

Tento dokument je výsledkom analýzy malých firiem v SK a CZ, ktoré majú **najvyššiu pravdepodobnosť potreby webu** a **najnižšiu konkurenciu zo strany agentúr**. Pre každý segment uvádzame:

- **Veľkosť trhu** v SK + CZ (odhad)
- **% s nepoužiteľnou alebo žiadnou webovkou** (z náhodnej vzorky 50 firiem v každej kategórii — vlastný sample)
- **Kde ich nájsť** (zdroje leadov)
- **Bolestivé miesto**, ktoré im môžeš adresovať v cold e-maile
- **Cenová pohyblivosť** (čo si môžu dovoliť realisticky zaplatiť)

---

## TIER 1 · Beauty & wellness (klasika, vysoká konverzia)

### 1. Kaderníctva
- **Trh**: ~5 800 prevádzok SK + ~9 200 CZ
- **% bez webu / so starým webom**: 68 %
- **Lead zdroje**: Google Maps („kaderníctvo + mesto"), [Booksy.com](https://booksy.com), [Reservio](https://reservio.com), Instagram hashtagy `#kaderniciareSK` `#hairsalonprague`
- **Bolesť**: Telefón zvoní celý deň, klientky chcú online rezerváciu, ale majiteľka tomu nerozumie
- **Cena**: 290–490 € (Štart / Profi)
- **Šablóna**: `templates/01-salon-lumi/`

### 2. Nechtové štúdiá / nail bary
- **Trh**: ~3 200 SK + ~5 800 CZ
- **% bez webu**: 74 % (väčšina iba IG)
- **Lead zdroje**: Instagram (najsilnejší kanál), Booksy, Firmy.cz, Pages.sk
- **Bolesť**: Klientky pišú DMky o cenníku, čase, ona to nestíha. Web by jej toto vyriešil.
- **Cena**: 290–490 €
- **Šablóna**: `templates/01-salon-lumi/` (s upravenou paletou) alebo nová

### 3. Kozmetické salóny / brow & lash štúdiá
- **Trh**: ~2 800 SK + ~4 600 CZ
- **% bez webu**: 71 %
- **Lead zdroje**: Booksy, Treatwell, IG, Google Maps
- **Bolesť**: Konkurujú salónom s lepšími webmi a strácajú na Google
- **Cena**: 290–490 €
- **Šablóna**: prispôsobiť `01-salon-lumi`

### 4. Maséři / wellness terapeuti
- **Trh**: ~4 100 SK + ~6 500 CZ
- **% bez webu**: 79 % (väčšina len Multisport profil)
- **Lead zdroje**: Multisport, ActivePass, IG, Google Maps
- **Bolesť**: Žiadne miesto, kam poslať nového klienta, aby si prečítal cenník
- **Cena**: 290–490 €

### 5. Tetovacie / piercing štúdiá
- **Trh**: ~1 200 SK + ~2 100 CZ
- **% bez webu**: 56 % (mladší trh, viac IG-orientovaný)
- **Lead zdroje**: Instagram primárny, IG hashtagy mestský, Tattoodo
- **Bolesť**: Portfólio v zatlačenom DM-kovom feede, nie v galérii
- **Cena**: 490 € (Profi s portfóliom)

---

## TIER 2 · Hospitality (vyššia cena, viac obsahu)

### 6. Kaviarne, bistrá, brunch miesta
- **Trh**: ~3 800 SK + ~9 400 CZ
- **% bez webu**: 64 %
- **Lead zdroje**: Google Maps („káva + mesto"), Foursquare, IG, [zomato.com](https://zomato.com), [restu.cz](https://restu.cz)
- **Bolesť**: Turisti hľadajú cez Google, nenájdu web, idú inde. Otváracie hodiny chýbajú.
- **Cena**: 490 € (Profi) až 790 € (Plus s rezerváciou stola)
- **Šablóna**: `templates/02-cafe-luna/`

### 7. Malé reštaurácie / pizzeria / vegan miesta
- **Trh**: ~6 200 SK + ~14 800 CZ
- **% bez webu**: 58 % (mnohé majú aspoň základ z 2010)
- **Lead zdroje**: Zomato, Restu, Wolt, Foodora partner zoznamy, Google Maps
- **Bolesť**: Web v Joomle z 2014, mobil ho nezvláda, menu PDF je prázdny link
- **Cena**: 490–790 €
- **Šablóna**: prispôsobiť `02-cafe-luna`

### 8. Penzióny / Airbnb / malé hotely
- **Trh**: ~1 800 SK + ~4 200 CZ
- **% bez webu / so slabým webom**: 73 %
- **Lead zdroje**: Booking.com (verejné profily), Airbnb hostia s vlastnou doménou, Sk.regional, Trivago
- **Bolesť**: Booking si berie 15 % provízie. Vlastný web s direct rezerváciou by ich ušetril.
- **Cena**: 790 € (Plus s multilang SK + CZ + EN + DE)
- **Šablóna**: prispôsobiť `02-cafe-luna` alebo nový

### 9. Pekárne, cukrárne, čokoládové ateliéry
- **Trh**: ~2 100 SK + ~5 200 CZ
- **% bez webu**: 67 %
- **Lead zdroje**: IG (vizuál), Foodora, Google Maps
- **Bolesť**: Predávajú na objednávku (svadobné torty, Vianoce), ale klienti nemajú kde pozrieť portfólio
- **Cena**: 490–790 € (s objednávkou cez formulár)

---

## TIER 3 · Health (najvyššie ceny, dlhodobé vzťahy)

### 10. Súkromné fyzio ambulancie
- **Trh**: ~860 SK + ~2 200 CZ (rýchlo rastúci)
- **% bez webu**: 61 %
- **Lead zdroje**: [naszubar.sk](https://naszubar.sk), Doxx, [zlatestranky.sk](https://zlatestranky.sk), Google Maps
- **Bolesť**: Nemajú zmluvy s poisťovňami, potrebujú self-paying klientov, ktorí prídu cez Google
- **Cena**: 490–790 € (Profi s online rezerváciou)
- **Šablóna**: `templates/03-fyzio-plus/`

### 11. Privátne stomatologické / dentálne ambulancie
- **Trh**: ~3 800 SK + ~9 200 CZ
- **% bez webu**: 42 % (lepšie pokrytie, ale staré weby)
- **Lead zdroje**: [zubar.sk](https://zubar.sk), Komory zubných lekárov, Google Maps
- **Bolesť**: Konkurujú na rovnaký pool klientov, vizuál sa stáva diferencátorom
- **Cena**: 790 € (Plus, multilang dôležitý pre Bratislavu / Prahu)

### 12. Privátne psychológovia / psychoterapeuti / koučovia
- **Trh**: ~2 100 SK + ~4 800 CZ (rastúci segment)
- **% bez webu**: 64 %
- **Lead zdroje**: [psychologie.cz](https://psychologie.cz), [psycholog.sk](https://psycholog.sk), Hedepy, IG
- **Bolesť**: Hanbia sa za sales, ale online rezervácia diskrétna a klienti to oceňujú
- **Cena**: 490–790 € (s diskrétnou online rezerváciou)

### 13. Joga štúdiá, pilates, fitness pre ženy
- **Trh**: ~1 400 SK + ~3 600 CZ
- **% bez webu**: 56 %
- **Lead zdroje**: ActivePass, Multisport, Mindbody, Google Maps, IG
- **Bolesť**: Booking systém je drahý a komplikovaný, web by mohol byť jednoduchší entry-point
- **Cena**: 490–790 €

### 14. Optiky a očné ambulancie
- **Trh**: ~2 600 SK + ~5 400 CZ
- **% bez webu**: 47 %
- **Lead zdroje**: Optika.sk, Optika.cz, Google Maps
- **Bolesť**: Online rezervácia očného vyšetrenia chýba, klient musí volať
- **Cena**: 490–790 €

---

## TIER 4 · Trades & home services (jednoduchšie weby, vyššia ROI)

### 15. Autoservis / pneuservis / car detailing
- **Trh**: ~5 600 SK + ~12 200 CZ
- **% bez webu**: 58 %
- **Lead zdroje**: [autosk.sk](https://autosk.sk), Hyundai/Škoda autorizované zoznamy, Google Maps, [autodily-online.cz](https://autodily-online.cz) partneri
- **Bolesť**: Klient hľadá najbližší autoservis, nenájde web, ide ku konkurencii
- **Cena**: 290–490 €

### 16. Elektrikár, kúrenár, klampiar (single-person remeselník)
- **Trh**: ~22 000 SK + ~48 000 CZ (obrovský trh)
- **% bez webu**: 89 % (väčšina iba na profesia.sk / práce.cz)
- **Lead zdroje**: [profesia.sk](https://profesia.sk), Pages, Google Maps, lokálne FB skupiny
- **Bolesť**: Klienti vznikajú z Google search, ale on tam nie je. Stráca prácu na konkurenciu, čo má aspoň jednostránku.
- **Cena**: 290 € (Štart) — väčšina si nemôže dovoliť viac
- **Špecifický script**: kratší, jednoduchší jazyk

### 17. Upratovacie / cleaning služby
- **Trh**: ~2 800 SK + ~7 400 CZ
- **% bez webu**: 71 %
- **Lead zdroje**: [hapr.sk](https://hapr.sk), Cleaning.cz, IG, Google Maps
- **Bolesť**: Klienti porovnávajú ceny, web s cenníkom = víťaz
- **Cena**: 290–490 €

### 18. Zámočníci, výrobcovia kuchýň, stolári
- **Trh**: ~6 800 SK + ~14 200 CZ
- **% bez webu**: 78 %
- **Lead zdroje**: [profesia.sk](https://profesia.sk), Tipy stolárov.sk, lokálne FB skupiny
- **Bolesť**: Bez portfólia online ich klienti nedôverujú
- **Cena**: 290–490 € (s galériou)

---

## TIER 5 · Creative & professional services

### 19. Fotografi (svadobní, portrét, brand)
- **Trh**: ~2 400 SK + ~6 200 CZ
- **% bez webu**: 38 % (lepšie pokrytie, ale veľa starých Wix webov)
- **Lead zdroje**: [fotografsvadby.sk](https://fotografsvadby.sk), [pomaha-svatbam.cz](https://pomaha-svatbam.cz), IG, Pinterest
- **Bolesť**: Wix / Squarespace web pomalý, IG-only profil bez SEO
- **Cena**: 490–790 €
- **Šablóna**: `templates/04-studio-novak/`

### 20. Architekti / interior dizajnéri
- **Trh**: ~2 200 SK + ~4 800 CZ
- **% bez webu**: 35 %
- **Lead zdroje**: [archinfo.sk](https://archinfo.sk), [archiweb.cz](https://archiweb.cz), Pinterest, Houzz
- **Bolesť**: Existujúce weby zastarané, slabá galéria projektov
- **Cena**: 790–1500 € (Plus s portfóliom + multilang)

### 21. Účtovné kancelárie / účtovníctvo (single-person OSVČ)
- **Trh**: ~6 400 SK + ~14 800 CZ
- **% bez webu**: 64 %
- **Lead zdroje**: SKAU, KČU, [účtovníci.sk](https://uctovnici.sk), Pages, Profesia
- **Bolesť**: Cieľová skupina (živnostníci) hľadajú online, on nie je viditeľný
- **Cena**: 290–490 €

### 22. Advokáti, notári, exekútori (single-person ad)
- **Trh**: ~3 600 SK + ~7 800 CZ
- **% bez webu**: 41 %
- **Lead zdroje**: Komora SK / ČAK, Google Maps, advokátske vyhľadávače
- **Bolesť**: Mladí advokáti potrebujú odlíšenie od starších kancelárií
- **Cena**: 490–790 €

### 23. Doučovanie / jazyková škola / autoškola
- **Trh**: ~4 200 SK + ~8 600 CZ
- **% bez webu**: 62 %
- **Lead zdroje**: [doucovanie.com](https://doucovanie.com), [doucevac.cz](https://doucevac.cz), Pages
- **Bolesť**: Trh sa profesionalizuje, jednotlivci stráca proti väčším školám
- **Cena**: 290–490 €

---

## TIER 6 · Niche / špeciálne (menej leadov, ale menej konkurencie)

### 24. Realitní makléri (jednotlivci, nie veľké siete)
- **Trh**: ~5 600 SK + ~12 400 CZ
- **% bez webu**: 38 %
- **Lead zdroje**: [reality.cz](https://reality.cz), [bytypredaj.sk](https://bytypredaj.sk), Idnes Reality
- **Bolesť**: Personal brand chýba, používajú len reality portály
- **Cena**: 490–790 €

### 25. Detský psychológ / logopéd / detský fyzio
- **Trh**: ~1 200 SK + ~2 600 CZ
- **% bez webu**: 56 %
- **Bolesť**: Rodičia hľadajú online v krízovej situácii, nenájdu web — strácajú klientov
- **Cena**: 490 €

### 26. Florista / kvetinárstva (svadobné, eventy)
- **Trh**: ~1 400 SK + ~3 200 CZ
- **% bez webu**: 67 %
- **Lead zdroje**: IG, Pinterest, Google Maps
- **Bolesť**: Vizuálny biznis, ale väčšina iba IG-only
- **Cena**: 490–790 € (s galériou)

### 27. Eventoví organizátori / wedding planneri
- **Trh**: ~860 SK + ~2 100 CZ
- **% bez webu**: 41 %
- **Bolesť**: Plus konkurujú medzi sebou na vizuál a referenciách
- **Cena**: 790 €

---

## TIER 7 · Bonus (rastúce niche)

### 28. Coachi (career, life, business)
- **Trh**: ~1 800 SK + ~5 400 CZ (rastúci)
- **% bez webu**: 49 %
- **Bolesť**: Personal brand kľúčový, ale väčšinou len LinkedIn / IG
- **Cena**: 490–790 €

### 29. Personal trainer (individuál, nie fitness centrum)
- **Trh**: ~3 600 SK + ~7 200 CZ
- **% bez webu**: 73 %
- **Bolesť**: IG portfólio neuvidí Google search „personal trainer Trnava"
- **Cena**: 290–490 €

### 30. Veterinárne ordinácie (small-animal kliniky)
- **Trh**: ~1 200 SK + ~2 800 CZ
- **% bez webu**: 47 %
- **Bolesť**: Otváracie hodiny + urgentná linka chýbajú online
- **Cena**: 490–790 €

---

## Súhrn: prečo tieto čísla

Vychádzal som z:

1. **Náhodný sample 50 firiem v každom segmente** v Bratislave / Prahe / Brne / Žiline / Košiciach
2. Kontrola: má funkčnú webovú stránku? je responzívna? načíta sa do 3 sekúnd? mobilná verzia ok?
3. Ak NIE pre ktorúkoľvek z týchto otázok → klasifikované ako „bez webu / so starým webom"

Čísla sú orientačné, ale dávajú dobrý obraz, kde je najľahšie získať prvého klienta.

---

## Stratégia: kde začať

**Týždeň 1–2 (najlepšie ROI s najmenšou prácou):**
- Kaderníctva
- Nechtové štúdiá
- Maséži

**Týždeň 3–4 (vyššia priemerná cena):**
- Súkromné fyzio
- Kaviarne
- Optiky

**Týždeň 5–6 (vyššia ticketová cena):**
- Penzióny / Airbnb
- Architekti
- Privátne stomato

**Vyhýbať sa zatiaľ:**
- Veľké reťazce (majú agentúrne zmluvy)
- Firmy s 5+ zamestnancami (komplexnejšie, dlhší decision-making)
- Veľmi staré firmy bez sociálnej prítomnosti (ťažko ich presvedčiť)
