# Nasadenie webov · GitHub Pages, Netlify, doména

Tento návod ukáže, ako každý web — či už `studio/` alebo ktorýkoľvek z `templates/` — dostať on-line na URL adresu.

---

## Možnosť 1: GitHub Pages (zdarma, najjednoduchšie pre studio)

**Čas**: 10 minút. **Cena**: 0 €.

### Krok 1 — vytvoriť GitHub repo

```bash
cd ~/Desktop/Webovky
git init
git add .
git commit -m "init: webstudio + 4 templates"
```

Otvor [github.com/new](https://github.com/new) a vytvor repo `webovky` (verejný).

```bash
git remote add origin https://github.com/<TVOJE_MENO>/webovky.git
git branch -M main
git push -u origin main
```

### Krok 2 — zapnúť GitHub Pages

1. V repu choď na **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main`, folder `/ (root)`
4. **Save**

Po 1–2 minútach máš dostupné:
- `https://<TVOJE_MENO>.github.io/webovky/studio/` — rozcestník
- `https://<TVOJE_MENO>.github.io/webovky/templates/01-salon-lumi/` — Salón Lumi
- atď.

### Krok 3 (voliteľné) — vlastná doména

Ak máš `webovky.sk`:

1. V `studio/` vytvor súbor `CNAME` s obsahom:
   ```
   webovky.sk
   ```
2. V GitHub Pages settings nastavte custom domain → `webovky.sk`
3. U registrátora domény (Websupport / Active24 / GoDaddy):
   - Pridaj **A záznam** `@` → `185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153`
   - **CNAME** `www` → `<TVOJE_MENO>.github.io`
4. Po 30 minútach DNS propagácia, máš `https://webovky.sk`

> GitHub Pages automaticky generuje SSL certifikát zdarma. Označ checkbox **Enforce HTTPS**.

---

## Možnosť 2: Netlify (lepšia performance + náhľady pred publikáciou)

**Čas**: 5 minút. **Cena**: 0 €.

### Drag & Drop (najjednoduchšie pre demo klientov)

1. Choď na [netlify.com/drop](https://netlify.com/drop)
2. Pretiahni si jeden z foldrov, napr. `templates/01-salon-lumi/` 
3. Dostaneš URL ako `https://random-name.netlify.app`
4. (Voliteľné) Premenuj v Netlify settings na zmysluplný URL

### S Git integrácou (pre seba)

1. Po pushni na GitHub, choď na [netlify.com](https://netlify.com)
2. **New site from Git → GitHub → tvoj repo**
3. **Base directory**: `studio` (alebo `templates/01-salon-lumi`)
4. **Build command**: prázdne (statický web)
5. **Publish directory**: `.`
6. Deploy

> Netlify má najlepšie CDN — váš web sa načíta rovnako rýchlo z Bratislavy ako z LA.

---

## Možnosť 3: Vercel (alternatíva k Netlify)

Identický postup ako Netlify. Vercel je rýchlejší pri Next.js projektoch, statické weby fungujú rovnako dobre na oboch.

---

## Klientske weby — odporúčaný setup

Keď web odovzdávaš klientovi, optimálne riešenie:

1. **Doména** — kúpiš za neho na rok (15 €), refunduje ti ju vo finálnej faktúre
   - SK: [websupport.sk](https://websupport.sk), [active24.sk](https://active24.sk)
   - CZ: [forpsi.cz](https://forpsi.cz), [active24.cz](https://active24.cz), [Wedos](https://wedos.com)
2. **Hosting** — Netlify (zadarmo do 100 GB traffic / mes) alebo GitHub Pages
3. **E-mail** — Zoho Mail zdarma alebo Forpsi 1 €/mes
4. **DNS** — Cloudflare (zadarmo, rýchle a bezpečné)
5. **Monitoring** — UptimeRobot (zadarmo) → notifikácia keď web spadne

### Setup checklist pre nový klientsky web

- [ ] Doména kúpená a smeruje na hosting
- [ ] SSL aktívne (HTTPS)
- [ ] `index.html` obsahuje schema.org JSON-LD
- [ ] Open Graph metatagy (pre share na FB/IG)
- [ ] Favicon
- [ ] Google Search Console pridaný + sitemap
- [ ] Google Analytics 4 (ak chce klient)
- [ ] Google Business Profile prepojený s webom
- [ ] Robots.txt + sitemap.xml
- [ ] Test na mobile (skutočný mobil, nie iba devtools)
- [ ] PageSpeed score > 85 (test cez `pagespeed.web.dev`)
- [ ] Klient dostal PDF návod na drobné úpravy

---

## Ceny doménov a hostingu — referenčná tabuľka

| Položka | Cena | Periodicita | Poznámka |
|---|---|---|---|
| .sk doména | 12–18 € | rok | Websupport má najnižšie |
| .cz doména | 100–200 Kč | rok | Forpsi |
| .com doména | 10–15 € | rok | Cloudflare cena nákupná |
| GitHub Pages hosting | 0 € | trvalo | bez emaileov, len web |
| Netlify free tier | 0 € | trvalo | 100 GB transferu/mes |
| Netlify Pro | 19 $/mes | mes | nepotrebné pre malých |
| Forpsi shared hosting | 60–150 Kč/mes | mes | klasický LAMP |
| Cloudflare DNS | 0 € | trvalo | rýchle a bezpečné |
| Zoho Mail (free tier) | 0 € | trvalo | 5 GB, vlastná doména |
| UptimeRobot | 0 € | trvalo | monitoring zdarma |

---

## Po nasadení — povinný checklist pre klienta

1. **Pošli klientovi PDF s prístupmi**:
   - Doménový panel (login + heslo)
   - Hosting panel (login + heslo)
   - E-mail prístup
   - GitHub repo (ak je verejný)
2. **Pošli krátky video tutoriál** (5 minút), ako:
   - Zmeniť otváracie hodiny
   - Pridať fotku do galérie
   - Editovať cenník
3. **Faktúra** za zvyšných 50 % + odovzdací protokol
4. **Po 30 dňoch** — kontaktuj klienta, či všetko OK, nepotrebuje úpravy

---

## Záloha (backup) klientskych webov

Každý klientsky web by mal mať **2 zálohy**:

1. **GitHub repo** — kompletný kód
2. **Lokálna ZIP** záloha v Drive / Dropbox

Ak používaš Netlify alebo GitHub Pages s Git, prvý bod si vyriešiš automaticky.
Druhý: každé 3 mesiace sťahuj ZIP z GitHubu a ulož do cloud-u.

---

## Ak klient odíde

Klient ti dá vedieť, že chce „samostatne" (alebo prejsť k inej agentúre).

**Nezamykaj** ho v ničom — to je zaručené odporúčanie smerom dole. Naopak:

1. Daj mu plný prístup ku všetkým službám
2. Odovzdaj GitHub repo (alebo zip s kódom)
3. Pošli krátky exit dokument: „Tu je všetko, prajem ti veľa šťastia s ďalším vývojom."
4. Po 6 mesiacoch sa nehanebne ozvi: „Ahoj, ako sa darí webu? Potrebuješ niečo?"

V 30 % prípadov sa vrátia. V ďalších 30 % ťa odporučia kamarátovi.
