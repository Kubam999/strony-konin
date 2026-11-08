// Stan wstęgi współdzielony przez obie warstwy sceny (za tekstem i przed tekstem)
// oraz przez sekcję realizacji. Zwykły obiekt mutowany w useFrame, bez re-renderów Reacta.

export const stan = {
  /** Przesunięcie wzdłuż pętli, 0..1 (modulo) */
  offset: 0,
  /** Prędkość z przeciągania, w jednostkach offsetu na sekundę */
  bezwladnosc: 0,
  pauza: false,
  przeciaganie: false,
  /** Czy od pointerdown ruszono wskaźnikiem (wtedy puszczenie nie jest kliknięciem) */
  przesunieto: false,
  /** Indeks kafla pod kursorem we wstędze albo -1 */
  hover: -1,
  /** Indeks realizacji pod kursorem w siatce DOM albo -1 */
  hoverSiatka: -1,
  /** Punkt kursora na kaflu w siatce (uv 0..1) */
  punkt: { x: 0.5, y: 0.5 },
  /** Postęp przejścia wstęga -> siatka, 0..1, sterowany scrollem */
  postep: 0,
  /** Czas sceny w sekundach */
  czas: 0,
  /** Czy odczytano parametry startowe */
  gotowy: false,
  /** Komórki siatki DOM, indeks = indeks realizacji; null gdy odfiltrowana */
  cele: [] as (HTMLElement | null)[],
  /** Element siatki (do sprawdzenia, czy już przewinięto poza nią) */
  siatka: null as HTMLElement | null,
  /** Sekcja hero (pętla przesuwa się razem z nią) */
  hero: null as HTMLElement | null,
};

/** Jeden obieg pętli trwa tyle sekund przy autoodtwarzaniu. */
export const CZAS_OBIEGU = 44;

/** Z płaszczyzny tekstu: kafle dalej są rysowane za nagłówkiem, bliżej przed nim. */
export const Z_TEKSTU = -1.6;

/** Kamera sceny; te same wartości w obu warstwach. */
export const KAMERA = { position: [0, 0, 6.2] as [number, number, number], fov: 38 };
