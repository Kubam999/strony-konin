# Strony Konin

Strona portfolio trzyosobowego zespołu, który robi strony internetowe dla lokalnych firm z Konina
i okolic. Klient przegląda na niej nasze realizacje, czyta krótko, co robimy i dla kogo, i pisze do nas
po wycenę. Identyfikacja i zasady w `DESIGN.md`.

Adres po wdrożeniu: https://kubam999.github.io/strony-konin/

## Struktura

- `index.html`, `src/`: nowa strona (Vite + React + TypeScript).
  - `src/config/site.ts`: nazwa zespołu, hasło, kontakt. Jedno miejsce do podmiany.
  - `src/data/realizacje.ts`: lista realizacji. Nową dodaje się jednym wpisem i zrzutem (niżej).
  - `src/components/`: sekcje strony, każda z własnym CSS.
  - `src/styles/tokens.css`: kolory, fonty, odstępy z `DESIGN.md`.
- `public/realizacje/`: miniatury realizacji generowane skryptem (WebP).
- `scripts/screenshots.mjs`: robi miniatury (Playwright + sharp).
- `scripts/qa-shots.mjs`: zrzuty kontrolne strony na 1440 i 390 px.
- `scripts/copy-static.mjs`: po buildzie kopiuje `demo/`, `screenshots/` i politykę prywatności do `dist/`.
- `demo/`: 15 stron demo dla firm z Konina (czysty HTML, bez zmian). Dostępne pod `/demo/`, link w stopce.
- `polityka-prywatnosci.html`: wspólna polityka prywatności, linkowana ze stopki i z demo.
- `reference/`: materiały referencyjne do projektu (nagranie i opis). Nie trafiają do builda.
- `.github/workflows/deploy.yml`: build i wdrożenie na GitHub Pages.

## Praca lokalna

```bash
npm install
npm run dev
```

Strona działa pod `http://localhost:5173/strony-konin/` (base taki sam jak na GitHub Pages).

```bash
npm run build
npm run preview
```

`build` sprawdza typy, buduje do `dist/` i dokłada demo. `preview` serwuje `dist/` pod
`http://localhost:4173/strony-konin/`.

## Jak dodać realizację

1. Dopisz wpis do `src/data/realizacje.ts` (slug, nazwa, branża, opis, adres, autor, rodzaj, kolor).
2. Zrób miniatury:

```bash
npx playwright install chromium
```

```bash
npm run zrzuty <slug>
```

3. Zatwierdź wpis i pliki z `public/realizacje/`.

Bez argumentu `npm run zrzuty` odświeża wszystkie miniatury. Filtr branż w realizacjach jest w kodzie
i włącza się sam od 8 wpisów (`FILTR_BRANZ_OD` w `src/config/site.ts`).

## Jak działa wstęga i siatka

- `src/components/wstega/`: scena WebGL (react-three-fiber) w dwóch stałych warstwach, za treścią i przed nią.
  Kafle z miniaturami krążą po pochylonej pętli w hero, a przy scrollu przelatują do komórek siatki
  w sekcji realizacji i tam zostają (komórki DOM są zwykłymi linkami). Po najechaniu kafel faluje
  i pokazuje pełny zrzut strony przesuwany w dół.
- Na telefonie, bez WebGL i przy `prefers-reduced-motion` zamiast sceny jest przewijana palcem
  taśma kafli w CSS, a siatka pokazuje zwykłe obrazki. Lenis też się wtedy wyłącza.
- Parametry `?pauza=1` i `?offset=0.3` zatrzymują wstęgę w zadanym miejscu (do zrzutów i testów),
  `?accent=kobalt` przełącza akcent.

## Zrzuty kontrolne

```bash
npm run preview
```

```bash
npm run qa -- <katalog-wyjściowy>
```

Robi zrzuty ekranu i całej strony na 1440 i 390 px oraz wypisuje błędy z konsoli przeglądarki.
Katalog `zrzuty-etapy/` jest ignorowany przez git i służy do podglądu zrzutów z pracy nad stroną.

## Wdrożenie

Workflow w `.github/workflows/deploy.yml` buduje stronę przy każdym pushu na `main` i `przebudowa`
i wdraża `dist/` na GitHub Pages. W ustawieniach repozytorium (Settings, Pages) źródło musi być
ustawione na „GitHub Actions”. Base w `vite.config.ts` to `/strony-konin/`; przy zmianie nazwy
repozytorium trzeba go zmienić.

## Co trzeba uzupełnić ręcznie

- **Nazwa zespołu**: robocza „Studio Konin”, stała `BRAND` w `src/config/site.ts`. Propozycje w `NAZWY.md`.
- **Hasło**: stała `HASLO` tamże.
- **Kontakt**: placeholdery `[mail]` i `[telefon]` w `KONTAKT`.
- **Formularz kontaktowy**: na razie tylko wizualny, nic nie wysyła.
- **Demo**: formularze w `demo/` wysyłają na Web3Forms i wymagają klucza w polu `access_key`.
