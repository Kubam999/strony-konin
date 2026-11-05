# Strony Konin

Portfolio demonstracyjne trzyosobowego zespołu, który robi strony internetowe dla małych firm z Konina i powiatu konińskiego. Czysty HTML, CSS i minimalny JS. Bez frameworków, bez buildu, bez npm. Każda strona działa po otwarciu pliku `index.html` w przeglądarce i po wrzuceniu na Cloudflare Pages.

## Struktura

- `index.html`, `style.css`, `script.js`: strona główna zespołu (robocza nazwa "Studio Konin").
- `polityka-prywatnosci.html`: wspólna polityka prywatności, linkowana ze strony głównej i ze wszystkich demo.
- `demo/<slug>/`: każde demo w osobnym, samowystarczalnym folderze (własny `style.css`, podstrony jako osobne pliki `.html`). Folder można skopiować i oddać klientowi jako punkt startowy.
- `demo/index.html`: lista wszystkich demo.
- `screenshots/`: zrzuty ekranu z kontroli jakości (1366 px i 390 px), używane też jako miniatury w portfolio na stronie głównej.
- `NAZWY.md`: 10 propozycji nazwy zespołu z domenami do sprawdzenia.

## Jak podejrzeć lokalnie

Wystarczy otworzyć `index.html` w przeglądarce. Linki między stroną główną a demo są względne, więc działają z dysku. Jeśli wolisz serwer (żeby mapy i czcionki ładowały się bez ostrzeżeń):

```bash
python3 -m http.server 8080
```

i wejść na `http://localhost:8080`.

## Jak wdrożyć na Cloudflare Pages

1. Zaloguj się w Cloudflare, Workers & Pages, Create, Pages, Connect to Git.
2. Wybierz to repozytorium i gałąź.
3. Framework preset: None. Build command: puste. Build output directory: `/` (katalog główny).
4. Deploy. Strona główna będzie pod `https://<nazwa>.pages.dev/`, demo pod `/demo/<slug>/`.
5. Żeby oddać klientowi pojedyncze demo, skopiuj folder `demo/<slug>/` do osobnego repozytorium i wdróż tak samo. W stopce demo popraw wtedy link do polityki prywatności (skopiuj `polityka-prywatnosci.html` do folderu i zmień `href`).

Hosting na Cloudflare Pages jest bezpłatny. Domenę podpina się w zakładce Custom domains.

## Lista demo

| Slug | Branża | Pakiet | Fonty |
|---|---|---|---|
| `szkola-jazdy` | szkoła jazdy, Konin | Firma | Barlow + Source Sans 3 |
| `weterynarz` | przychodnia weterynaryjna, Konin | Firma | Nunito |
| `stomatolog` | gabinet stomatologiczny, Konin | Firma | DM Serif Display + DM Sans |
| `fotowoltaika-pompy-ciepla` | instalator PV i pomp ciepła, Kazimierz Biskupi | Firma | Manrope |
| `fizjoterapia` | gabinet fizjoterapii, Konin | Firma | Fraunces + Inter |
| `kancelaria-adwokacka` | kancelaria adwokacka, Konin | Firma | Libre Baskerville + IBM Plex Sans |
| `warsztat-detailing` | studio auto detailingu, Konin | Wizytówka | Oswald + Roboto |
| `firma-remontowa` | firma remontowa, Golina | Wizytówka | Work Sans |
| `meble-na-wymiar` | stolarnia mebli na wymiar, Stare Miasto | Wizytówka | Cormorant Garamond + Karla |
| `biuro-rachunkowe` | biuro rachunkowe, Konin | Wizytówka | Figtree |
| `kawiarnia` | kawiarnia na starówce, Konin | Wizytówka | Bricolage Grotesque + Atkinson Hyperlegible |
| `restauracja-sala-weselna` | restauracja z salą weselną, Ślesin | Rozbudowana | Playfair Display + Lato |
| `salon-beauty-szkolenia` | salon brwi i rzęs ze szkoleniami, Konin | Firma | Jost + Mulish |

Nie powstały jeszcze (zaplanowane w kolejności): instalator-hydraulik, psychoterapia.

Wszystkie firmy w demo są fikcyjne. Adresy są wymyślone przy prawdziwych ulicach Konina i okolicznych miejscowości, telefony w formacie 63 000 00 00 lub 500 000 000.

## Co trzeba uzupełnić ręcznie

- **Nazwa zespołu**: robocza "Studio Konin". Zmiana w jednym miejscu: atrybut `data-brand` w `<body>` w `index.html` (skrypt podmienia wszystkie wystąpienia). Propozycje w `NAZWY.md`.
- **Kontakt**: placeholdery `[imię]`, `[telefon]`, `[mail]` w `index.html` i `polityka-prywatnosci.html`.
- **Formularze**: każdy formularz wysyła na Web3Forms. Zarejestruj darmowy klucz na web3forms.com i podmień `TWOJ_KLUCZ` w polu `access_key` (strona główna i każde demo).
- **Zdjęcia**: wszystkie obrazy to placeholdery z `picsum.photos`. Do podmiany na zdjęcia klienta (zachowaj atrybuty `width`, `height`, `alt`).
- **Mapy**: iframe Google Maps wskazuje na wymyślony adres. Podmień parametr `q=` w `src`.
- **Booksy**: w demo salonu link do Booksy jest placeholderem `https://booksy.com/pl-pl/TWOJ-LINK`.
- **Zrzuty ekranu**: robione w środowisku bez dostępu do picsum.photos i Google Maps, więc w miejscu zdjęć i mapy widać szare pola z tekstem alternatywnym. W przeglądarce z internetem zdjęcia się ładują.
- **Realizacje**: kafelki `[realizacja 1]` i `[realizacja 2]` w portfolio na stronie główną czekają na prawdziwe wdrożenia.
- **Miniatury portfolio**: strona główna pokazuje `screenshots/<slug>-desktop.png`. Po zmianach w demo odśwież zrzuty.
