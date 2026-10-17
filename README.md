# elsewhere. – retreat i letenka na jednom místě

**Veřejná URL:** https://retreat-flight-finder.vercel.app

MVP webové aplikace, která k retreatu v teple (listopad–březen) najde zpáteční letenku z Prahy a ukáže celkovou cenu cesty, délku letu a počet přestupů. Uživatelka nemusí porovnávat retreaty a letenky na různých webech.

## Jak appku spustit u sebe

1. Naklonuj repozitář a nainstaluj závislosti:
```
   git clone https://github.com/solara-retreats/retreat-flight-finder.git
   cd retreat-flight-finder
   npm install
```
2. V hlavní složce vytvoř soubor `.env.local` s API tokenem z Travelpayouts:
```
   TRAVELPAYOUTS_TOKEN=tvuj_token
```
   Soubor je v `.gitignore`, takže se nikdy nenahraje na GitHub.
3. Spusť aplikaci: `npm run dev` (ve Windows PowerShellu `npm.cmd run dev`) a otevři http://localhost:3000.

## Architektura

```
Prohlížeč / mobil
  app/page.tsx  – formulář, filtry, řazení, karty, stavy (načítání / nic nenalezeno / chyba)
  data retreatů – 10 ukázkových záznamů přímo v kódu
        │  GET /api/flights?origin=PRG&destination=RAK&month=2026-11
        ▼
Server (Vercel)
  app/api/flights/route.ts – kontrola vstupu, přidá tajný token, přepočet EUR → Kč, cache 1 h
        │  HTTPS + token v hlavičce (X-Access-Token)
        ▼
Travelpayouts / Aviasales Data API – nejlevnější zpáteční letenka v daném měsíci
```

- API token je jen na serveru (proměnná prostředí na Vercelu, lokálně `.env.local`). V prohlížeči ani v repozitáři se neobjeví.
- Filtrování, výpočet celkové ceny a řazení dělá normální kód v prohlížeči.
- Když API selže, appka nespadne: ukáže chybovou hlášku a orientační ceny letenek.

## Proč tyhle nástroje a API

- **Next.js** – frontend i malý backend (API route) v jednom projektu. Backend je potřeba, aby API klíč nebyl vidět v prohlížeči.
- **Vercel** – hosting zdarma, HTTPS automaticky, každý `git push` se sám nasadí.
- **Travelpayouts (Aviasales Data API)** – zdarma, rychlá registrace, vrací cenu, přestupy, délku letu i data odletu a návratu.
  - **Amadeus Self-Service** jsem nepoužila, protože 17. 7. 2026 skončil.
  - **Duffel** jsem zkoušela, ale v testovacím režimu vracel jen testovací nabídky bez reálných cen.
  - **Kiwi Tequila** je dnes dostupný jen partnerům.
  - Nevýhoda Travelpayouts: ceny pocházejí z nedávných vyhledávání (cache), nejde o živou cenu k nákupu. Na MVP to stačí.
- **Měna:** API vrací EUR, přepočet pevným orientačním kurzem **1 EUR = 24,5 Kč**. Kurz je uvedený i v patičce webu.

## Odhad měsíčních nákladů na provoz

| | 100 uživatelů | 10 000 uživatelů |
|---|---|---|
| Hosting Vercel | 0 Kč (Hobby) | cca 500 Kč (Pro, 20 USD) + případné navýšení |
| Travelpayouts API | 0 Kč | 0 Kč (díky cache 1 h je počet volání malý: max. 8 letišť × 5 měsíců za hodinu) |
| Doména (volitelně) | cca 25 Kč (300 Kč/rok) | cca 25 Kč |
| **Celkem** | **cca 0–25 Kč** | **cca 500–1 500 Kč** |

Pozn.: Vercel Hobby je určený pro nekomerční projekty. Pro klienta bych hned počítala s tarifem Pro. Jde o odhady podle veřejných ceníků.

## Co bych udělala jinak při 10 000 uživatelích

- Retreaty přesunout z kódu do databáze (např. Supabase) s administrací pro klientku.
- Ceny letenek předpočítávat pravidelně na pozadí a ukládat do sdílené cache, aby se API nevolalo při každém hledání.
- Pro detail nabídky přidat placené API s živými cenami a odkazem na nákup.
- Přidat ochranu API route před zneužitím (rate limiting), monitoring chyb (Sentry) a analytiku.
- Denní kurz z ČNB místo pevného kurzu.
- Affiliate odkazy na letenky jako zdroj příjmů.

## Co nefunguje / co bych dodělala

- Letenka není přesně spárovaná s termínem a délkou pobytu retreatu. Appka bere nejlevnější zpáteční let v daném měsíci a data letu ukazuje na kartě.
- Ceny letenek jsou z cache Travelpayouts, ne živé. Cena je pro 1 osobu.
- Odlet jen z Prahy. Termíny retreatů jsou jen po měsících.
- Pevný kurz EUR/Kč.
- Bonusy (zadání přirozenou řečí, sdílení výsledku odkazem) nejsou hotové.
- Ověřovací skript Travelpayouts vypisuje v konzoli prohlížeče neškodnou chybu „config is not valid“.

## Jiné způsoby, jak appku postavit

| Způsob | Výhody | Nevýhody | Kdy bych ho klientovi doporučila |
|---|---|---|---|
| **Vlastní kód + GitHub + Vercel** (moje cesta) | plná kontrola, bezpečné API klíče, levný provoz, snadno se rozšiřuje | potřeba rozumět kódu, údržba vyžaduje vývojáře | když produkt poroste a bude potřeba vlastní logika |
| **No-code** (Bubble, Softr + Airtable, Make) | rychlé, klientka si data upraví sama | měsíční poplatky, omezená logika, závislost na platformě | rychlé ověření nápadu, malý rozpočet, bez vývojáře |
| **WordPress + widget Travelpayouts** | velmi rychlé, hotové vyhledávání letenek | neumí spojit retreat a let do celkové ceny, slabší UX | když stačí obsahový web s odkazy na letenky |
| **AI app builder** (Lovable, Bolt, v0) | prototyp za hodiny | kód je potřeba kontrolovat, hrozí chyby v bezpečnosti | na klikací prototyp pro první prezentaci |
| **Vývojářská agentura** | profesionální výsledek, podpora | nejdražší, pomalejší | když je produkt ověřený a je na něj rozpočet |

## Čas a náklady na vývoj

- **Čas:** cca 10 hodin (≈ 1,25 MD).
- **AI nástroje:** Claude Pro – 20 USD/měsíc (cca 500 Kč). Ostatní nástroje (VS Code, GitHub, Vercel, Travelpayouts) zdarma.

## Co dělala AI a co jsem rozhodla sama

- **AI (Claude):** psaní a úpravy kódu, vysvětlení postupu krok za krokem, řešení chyb (PowerShell, server), návrh README.
- **Sama jsem rozhodla / udělala:** název a vzhled appky, výběr API a srovnání alternativ, výběr destinací a dat retreatů, UX rozhodnutí (výchozí „bez omezení“, řazení, texty), testování na počítači i mobilu, nasazení a kontrolu, že API klíč není v repozitáři.

## Data a fotky

Všech 10 retreatů je **ukázkových (smyšlených)**. Fotky pocházejí z [Unsplash](https://unsplash.com) a jsou použité podle Unsplash License.