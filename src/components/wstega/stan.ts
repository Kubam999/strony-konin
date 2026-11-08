// Stan wstęgi współdzielony przez obie warstwy sceny (za tekstem i przed tekstem).
// Zwykły obiekt mutowany w useFrame, bez re-renderów Reacta.

export const stan = {
  /** Przesunięcie wzdłuż pętli, 0..1 (modulo) */
  offset: 0,
  /** Prędkość z przeciągania, w jednostkach offsetu na sekundę */
  bezwladnosc: 0,
  pauza: false,
  przeciaganie: false,
  /** Czy od pointerdown ruszono wskaźnikiem (wtedy puszczenie nie jest kliknięciem) */
  przesunieto: false,
  /** Indeks kafla pod kursorem albo -1 */
  hover: -1,
  /** Czy odczytano parametry startowe */
  gotowy: false,
};

/** Jeden obieg pętli trwa tyle sekund przy autoodtwarzaniu. */
export const CZAS_OBIEGU = 44;

/** Z płaszczyzny tekstu: kafle dalej są rysowane za nagłówkiem, bliżej przed nim. */
export const Z_TEKSTU = -1.6;
