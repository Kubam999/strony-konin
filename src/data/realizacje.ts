// Lista realizacji pokazywanych na stronie. Nową dodaje się jednym wpisem tutaj
// i poleceniem `npm run zrzuty <slug>`, które robi miniatury do public/realizacje/.

export type Kategoria = 'odzież' | 'motoryzacja' | 'rzemiosło' | 'sport' | 'gastronomia' | 'usługi' | 'zdrowie';

export interface Realizacja {
  /** Nazwa plików w public/realizacje/: <slug>.webp, <slug>-pelna.webp, <slug>-telefon.webp */
  slug: string;
  nazwa: string;
  /** Krótka etykieta branży pod nazwą */
  branza: string;
  /** Do filtra branż (włączany od FILTR_BRANZ_OD wpisów) */
  kategoria: Kategoria;
  /** Jedno zdanie o stronie */
  opis: string;
  /** Wersja na żywo, otwierana po kliknięciu */
  url: string;
  autor: string;
  rodzaj: 'koncept' | 'wdrożenie';
  /** Kolor dominujący strony: tło kafelka zanim wczyta się miniatura */
  kolor: string;
}

export const REALIZACJE: Realizacja[] = [
  {
    slug: 'gran',
    nazwa: 'Grań',
    branza: 'odzież outdoorowa',
    kategoria: 'odzież',
    opis: 'Sklep marki szyjącej odzież do biegania i chodzenia po górach, z kolekcjami, szlakami i naprawą.',
    url: 'https://syginorth.github.io/strona-4/strony/gran/',
    autor: 'Blanka',
    rodzaj: 'koncept',
    kolor: '#DED9CB',
  },
  {
    slug: 'noctis',
    nazwa: 'NOCTIS',
    branza: 'detailing aut',
    kategoria: 'motoryzacja',
    opis: 'Studio detailingu premium: korekta lakieru, powłoki ceramiczne i folie PPF w ciemnej, filmowej oprawie.',
    url: 'https://syginorth.github.io/detailing/',
    autor: 'Blanka',
    rodzaj: 'koncept',
    kolor: '#0B0B0B',
  },
  {
    slug: 'sloj',
    nazwa: 'Słój',
    branza: 'stolarnia',
    kategoria: 'rzemiosło',
    opis: 'Jednoosobowa pracownia stolarska: kuchnie, szafy i schody z litego drewna na wymiar.',
    url: 'https://syginorth.github.io/strona-3/strony/sloj/',
    autor: 'Blanka',
    rodzaj: 'koncept',
    kolor: '#111111',
  },
  {
    slug: 'forhend',
    nazwa: 'Forhend',
    branza: 'klub tenisowy',
    kategoria: 'sport',
    opis: 'Klub i akademia tenisowa: programy, trenerzy, wydarzenia i umawianie wizyt.',
    url: 'https://syginorth.github.io/strona-2/',
    autor: 'Blanka',
    rodzaj: 'koncept',
    kolor: '#0F2C6E',
  },
  {
    slug: 'syk',
    nazwa: 'Syk',
    branza: 'napój',
    kategoria: 'gastronomia',
    opis: 'Strona produktowa napoju gazowanego bez cukru, z obracaną puszką i dwoma smakami.',
    url: 'https://syginorth.github.io/larp-stronki/soda/',
    autor: 'Blanka',
    rodzaj: 'koncept',
    kolor: '#0D4A3C',
  },
];
