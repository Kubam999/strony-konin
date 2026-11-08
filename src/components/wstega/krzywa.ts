import { CatmullRomCurve3, Euler, MathUtils, Vector3 } from 'three';

export const SZER_KAFLA = 1.55;
export const WYS_KAFLA = SZER_KAFLA * 0.625; // 16:10
export const ODSTEP = 0.22;

/**
 * Pochylona pętla (elipsa) dopasowana długością do liczby kafli, żeby wstęga była
 * ciągła zarówno przy 5, jak i przy 15 realizacjach.
 */
export function zbudujKrzywa(liczbaKafli: number): CatmullRomCurve3 {
  const obwod = liczbaKafli * (SZER_KAFLA + ODSTEP);
  // elipsa o proporcji 1 : 0.55 i obwodzie ~ obwod (przybliżenie Ramanujana odwrócone iteracyjnie)
  let rx = obwod / (2 * Math.PI);
  for (let i = 0; i < 6; i++) {
    const ry = rx * 0.55;
    const h = ((rx - ry) / (rx + ry)) ** 2;
    const o = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    rx *= obwod / o;
  }
  const rz = rx * 0.55;
  // Pętla leży poziomo jak taśmociąg, lekko uniesiona z tyłu: przód przechodzi nisko
  // przed nagłówkiem i blisko kamery, tył wyżej, za nagłówkiem i dalej.
  const obrot = new Euler(MathUtils.degToRad(-38), MathUtils.degToRad(8), MathUtils.degToRad(-8));
  const srodek = new Vector3(0.9, 0.2, -3.2);
  const punkty: Vector3[] = [];
  const N = 64;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    punkty.push(new Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz).applyEuler(obrot).add(srodek));
  }
  const krzywa = new CatmullRomCurve3(punkty, true, 'centripetal');
  krzywa.arcLengthDivisions = 400;
  return krzywa;
}
