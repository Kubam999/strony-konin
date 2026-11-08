# DESIGN.md: identyfikacja strony Studio Konin

Strona portfolio zespołu, który robi strony dla lokalnych firm. Klimat jak w referencji kitefold
(jasne tło, duża typografia, wstęga realizacji, falujące kafelki), ale własne wartości, własne fonty
i własny układ. Ten plik jest źródłem prawdy dla tokenów w `src/styles/tokens.css`.

## 1. Założenia

- Jedna strona, długi scroll. Treść krótka: kim jesteśmy, realizacje, kontakt. Bez cen.
- Efekty tylko tam, gdzie dają efekt: wstęga 3D w hero i falowanie z podglądem w realizacjach.
  Reszta strony jest statyczna i szybka.
- Miniatury realizacji są najbardziej kolorowym elementem strony, więc sama strona jest
  niemal monochromatyczna: jasne tło, prawie czarny tekst, jeden akcent.
- Telefon dostaje lżejszą wersję (bez WebGL), `prefers-reduced-motion` wyłącza ruch.

## 2. Kolory

| Token | Wartość | Użycie |
|---|---|---|
| `--bg` | `#EDEDEF` | tło strony, chłodna jasna szarość |
| `--surface` | `#FAFAFA` | karty, pola formularza, elementy uniesione nad tło |
| `--ink` | `#121212` | tekst, przyciski główne |
| `--ink-2` | `#5F5F67` | tekst pomocniczy (kontrast 5,5:1 na tle) |
| `--ink-3` | `#66666E` | numeracja, metadane (kontrast 4,8:1) |
| `--line` | `rgba(18,18,18,.12)` | linie podziału |
| `--accent` | `#F0401E` ogień **lub** `#2F4BDA` kobalt | jeden mocny akcent, decyzja po zrzutach |
| `--accent-tlo` | `#D9360F` dla ognia, `#2F4BDA` dla kobaltu | wypełnienie przycisków akcentowych: biały tekst ma na nim 4,5:1 |
| `--dark` | `#121212` | ciemne pasy: wycena, stopka |

Dlaczego `#EDEDEF`, a nie `#FAFAFA`: cztery z pięciu miniatur są ciemne, a jedna (Grań) jest kremowa.
Na czystej bieli kremowa miniatura zlewa się z tłem, na chłodnej szarości każda miniatura ma
widoczną krawędź, a karty i formularz w `#FAFAFA` dostają własną warstwę.

Zasady akcentu: słowo kursywą w haśle, przycisk „Napisz do nas” w nawigacji, kropka przy
etykietach, obrys fokusu, hover przycisków. Nigdzie indziej. Tekst na akcencie zawsze biały
i tylko w przyciskach, które używają `--accent-tlo` (kontrast 4,7:1 dla ognia i 6,5:1 dla kobaltu).
Sam `--accent` na jasnym tle ma 3,3:1, więc służy tylko do dużego tekstu i elementów graficznych.

## 3. Typografia

Fonty hostowane lokalnie z pakietów `@fontsource-variable`, wszystkie z polskimi znakami.

| Rola | Font | Ustawienia |
|---|---|---|
| Nagłówki, nazwa, liczby | **Bricolage Grotesque** (variable: wght, wdth, opsz) | wght 500–600, `font-stretch: 92–94%`, `letter-spacing: -0.03em`, `line-height: 0.92–0.98` |
| Jedno słowo w haśle | **Fraunces Italic** (variable: opsz, wght, SOFT, WONK) | wght 380, `SOFT 40`, `WONK 1`, kolor akcentu |
| Tekst, interfejs, formularz | **Hanken Grotesk** (variable: wght) | 400 dla tekstu, 500 dla przycisków i etykiet |

Skala (tokeny `--text-*`): hero `clamp(3rem, 1rem + 10.2vw, 10.75rem)`, h2 `clamp(2.25rem, 1.4rem + 3.6vw, 5rem)`,
h3 `clamp(1.375rem, 1.1rem + 1vw, 2rem)`, lead `clamp(1.125rem, 1rem + .4vw, 1.375rem)`, tekst `1rem`,
mały `0.875rem`, mikro `0.75rem`. Szerokość akapitu do 60 znaków, leadu do 34.

Kursywa Fraunces pojawia się w jednym słowie hasła i nigdzie więcej. Nagłówki sekcji są
w samym Bricolage.

## 4. Siatka i odstępy

- Skala 4 px: tokeny `--space-1` (4) do `--space-10` (144).
- Kontener 1440 px, marginesy boczne `clamp(16px, 1rem + 1.6vw, 40px)`.
- Sekcje oddzielone `--section` = `clamp(72px, 6vw + 40px, 144px)`.
- Siatka realizacji: 3 kolumny powyżej 1024 px, 2 do 1024 px, 1 do 600 px. Przy 5 kafelkach
  ostatni rząd zostaje niepełny i to jest w porządku; przy 15 siatka jest pełna 5×3.
- Progi: 600 px (telefon), 760 px (menu zwinięte), 1024 px (tablet).

## 5. Komponenty

- **Przyciski**: pigułki, wysokość 48 px (40 px wersja mała), `btn--ink` (główny), `btn--ghost`
  (drugorzędny, obrys), `btn--accent` (tylko w nawigacji). Hover zmienia kolor, bez skalowania.
- **Etykieta sekcji** (`.eyebrow`): mały tekst z kropką w kolorze akcentu.
- **Kafel realizacji**: miniatura 16:10, promień 6 px, cień `--shadow-tile`; pod spodem numer,
  nazwa, branża i dopisek „Projekt koncepcyjny · Blanka”. Klik otwiera stronę na żywo w nowej karcie.
- **Nawigacja**: stała, 64 px, tło półprzezroczyste z rozmyciem. Na telefonie zostają nazwa i przycisk.
- **Formularz**: pola na `--surface`, obrys `--line`, fokus akcentem, etykiety nad polami.
- **Ciemne pasy** (wycena, stopka): `--dark` z tekstem `--dark-ink`, bez zmiany fontów.

## 6. Miniatury realizacji

Robi je `npm run zrzuty` (Playwright + sharp), zapis do `public/realizacje/`:

| Plik | Rozmiar | Użycie |
|---|---|---|
| `<slug>.webp` | 1200×750, viewport 1440×900 | kafel w siatce, tekstura we wstędze |
| `<slug>-pelna.webp` | 900 px szer., do 4800 px wys. | podgląd przesuwany na hover |
| `<slug>-telefon.webp` | 780×1688, viewport 390×844 @2x | wersja mobilna kafla (opcjonalnie) |

Kolor `kolor` z danych realizacji jest tłem kafla, zanim wczyta się obraz.

## 7. Ruch

- Easing `--ease-out` = `cubic-bezier(.16, 1, .3, 1)`, czasy 180 / 420 / 900 ms.
- Wstęga w hero: pełny obieg ok. 40 s, przeciąganie z bezwładnością, pauza przyciskiem.
- Przy scrollu hero jest przypięte na ok. 200vh, kafelki przelatują ze wstęgi do siatki (scrub).
- Hover kafla: falowanie jak tkanina (shader) i powolne przesuwanie pełnego zrzutu w dół.
- Brak marquee, brak animowanych kroków, brak parallaxów w sekcjach tekstowych.
- `prefers-reduced-motion`: wstęga stoi w pozycji końcowej, brak przypięcia, Lenis wyłączony,
  hover tylko zmienia kolor podpisu.
- Telefon: zamiast WebGL płaska karuzela CSS przesuwana palcem; siatka jednokolumnowa bez shadera.

## 8. Dostępność

- Cel: WCAG 2.2 AA. Tekst pomocniczy minimum 4,5:1, elementy interaktywne 3:1.
- Każdy kafel to zwykły link `<a>` z opisowym tekstem, także we wstędze 3D (warstwa DOM pod sceną).
- Cele dotykowe minimum 44×44 px. Fokus widoczny obrysem akcentu, `outline-offset: 3px`.
- Obrazy: `alt` opisowy, `width`/`height` zawsze podane, `loading="lazy"` poza pierwszym ekranem.
- Formularz: etykiety powiązane z polami, komunikaty błędów tekstem, nie samym kolorem.
- Skip link do treści, `lang="pl"`, jeden `<h1>`.

## 9. Ton tekstów

Po polsku, krótko, w pierwszej osobie liczby mnogiej („robimy”, „napisz do nas”). Bez żargonu,
bez obietnic terminów i bez cen. Nazwa zespołu i hasło są stałymi w `src/config/site.ts`.

## 10. Decyzje otwarte

- Akcent: ogień `#F0401E` czy kobalt `#2F4BDA` (oba tokeny są w kodzie, przełącznik `?accent=`).
- Hasło: na razie „Strony, które *pracują* na firmę”, do dopracowania.
- Nazwa zespołu: robocza „Studio Konin”.
