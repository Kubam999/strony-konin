import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import { Mesh, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3, type BufferAttribute, type Texture } from 'three';

const bezRaycastu = () => {};
import type { Realizacja } from '../../data/realizacje';
import { stan, CZAS_OBIEGU, Z_TEKSTU, KAMERA } from './stan';
import { zbudujKrzywa, SZER_KAFLA, WYS_KAFLA, SRODEK_Y } from './krzywa';
import { stworzMaterial } from './material';

export type Warstwa = 'za' | 'przed';

interface Props {
  realizacje: Realizacja[];
  /** Ile kafli ma być na pętli (realizacje powtarzają się, gdy jest ich mało) */
  liczbaKafli: number;
  warstwa: Warstwa;
  /** Tylko jedna warstwa przesuwa offset i czas */
  prowadzi: boolean;
  onHover: (i: number, x: number, y: number) => void;
}

const SEG_X = 24;
const SEG_Y = 12;
const BASE = import.meta.env.BASE_URL;
const KAM = new Vector3(...KAMERA.position);

interface StanKafla {
  pelna: Texture | null;
  laduje: boolean;
  amp: number;
  mix: number;
  przesuw: number;
  alpha: number;
  /** Podświetlenie po najechaniu na pętli, 0..1, wygładzane */
  podswietl: number;
}

/** Jaka część przejścia to opóźnienie ostatniego kafla względem pierwszego */
const OPOZNIENIE = 0.55;
/** Ile obiegu pętli kafel robi dodatkowo, schodząc po spirali */
const OBROT_SPIRALI = 0.6;
const gladkiProg = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const wygladz = (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - (1 - p) ** 3);
const dazy = (a: number, cel: number, krok: number, tempo: number) => a + (cel - a) * (1 - Math.exp(-krok * tempo));

/**
 * Kafle wstęgi. Każdy ma dwie pozy: na pętli (wygięty wzdłuż krzywej) i w komórce siatki DOM
 * (płaski prostokąt na płaszczyźnie z = 0). Między nimi przechodzi według stan.postep.
 */
export default function Kafle({ realizacje, liczbaKafli, warstwa, prowadzi, onHover }: Props) {
  const n = realizacje.length;
  const tekstury = useLoader(TextureLoader, realizacje.map((r) => `${BASE}realizacje/${r.slug}.webp`)) as Texture[];
  useEffect(() => {
    tekstury.forEach((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [tekstury]);

  const krzywa = useMemo(() => zbudujKrzywa(liczbaKafli), [liczbaKafli]);
  const dlugosc = useMemo(() => krzywa.getLength(), [krzywa]);
  const geometrie = useMemo(() => Array.from({ length: liczbaKafli }, () => new PlaneGeometry(1, 1, SEG_X, SEG_Y)), [liczbaKafli]);
  const materialy = useMemo(() => Array.from({ length: liczbaKafli }, (_, i) => stworzMaterial(tekstury[i % n])), [liczbaKafli, tekstury, n]);
  useEffect(
    () => () => {
      geometrie.forEach((g) => g.dispose());
      materialy.forEach((m) => m.dispose());
    },
    [geometrie, materialy],
  );
  const kafle = useRef<StanKafla[]>([]);
  if (kafle.current.length !== liczbaKafli) {
    kafle.current = Array.from({ length: liczbaKafli }, () => ({ pelna: null, laduje: false, amp: 0, mix: 0, przesuw: 0, alpha: 1, podswietl: 0 }));
  }
  const loader = useMemo(() => new TextureLoader(), []);

  const meshe = useRef<(Mesh | null)[]>([]);
  const tmp = useMemo(() => ({ p: new Vector3(), v: new Vector3(), t: new Vector3(), nrm: new Vector3(), doKam: new Vector3() }), []);
  const recty = useMemo(() => new Array<DOMRect | null>(n), [n]);

  useFrame((_, dt) => {
    const krok = Math.min(dt, 0.05);
    if (!stan.gotowy) {
      // parametry startowe (do zrzutów i testów): ?offset=0.3&pauza=1
      const q = new URLSearchParams(location.search);
      const o = parseFloat(q.get('offset') ?? '');
      if (!Number.isNaN(o)) stan.offset = o;
      if (q.get('pauza') === '1') stan.pauza = true;
      stan.gotowy = true;
    }
    if (prowadzi) {
      stan.czas += krok;
      if (!stan.pauza && !stan.przeciaganie) stan.offset += krok / CZAS_OBIEGU;
      if (!stan.przeciaganie) {
        stan.offset += stan.bezwladnosc * krok;
        stan.bezwladnosc *= Math.exp(-krok * 2.6);
        if (Math.abs(stan.bezwladnosc) < 1e-4) stan.bezwladnosc = 0;
      }
      stan.offset = ((stan.offset % 1) + 1) % 1;
    }

    // Geometria ekranu: jednostki świata na piksel na płaszczyźnie z = 0
    const u = (2 * KAMERA.position[2] * Math.tan((KAMERA.fov * Math.PI) / 360)) / innerHeight;
    // Pętla jest wyśrodkowana na hero i skalowana do jego wysokości (nie do wysokości okna),
    // więc przy niższym hero nie wychodzi na nagłówek ani poza sekcję.
    const heroRect = stan.hero?.getBoundingClientRect();
    const heroH = heroRect?.height ?? innerHeight;
    const heroTop = heroRect?.top ?? 0;
    const przesunHero = -(heroTop + heroH / 2 - innerHeight / 2) * u;
    const f = Math.min(1, heroH / innerHeight);
    const siatkaRect = stan.siatka?.getBoundingClientRect();
    const poza = !!siatkaRect && siatkaRect.bottom < -40;
    const p = wygladz(stan.postep);
    for (let r = 0; r < n; r++) recty[r] = stan.cele[r]?.getBoundingClientRect() ?? null;

    const polSzer = SZER_KAFLA / 2 / dlugosc;
    for (let i = 0; i < liczbaKafli; i++) {
      const mesh = meshe.current[i];
      if (!mesh) continue;
      const r = i % n;
      const kopia = i >= n;
      // Kopie (powtórzenia realizacji na pętli) schodzą po spirali razem z resztą, ale nie
      // wsuwają się do siatki: znikają pod koniec zejścia
      const rect = recty[r];
      const k = kafle.current[i];
      const mat = materialy[i];

      // Każdy kafel ma własny postęp, opóźniony według miejsca na pętli: schodzą jeden za drugim,
      // więc pętla rozwija się w spiralę zamiast opadać naraz.
      const pi = Math.min(1, Math.max(0, (stan.postep - (i / liczbaKafli) * OPOZNIENIE) / (1 - OPOZNIENIE)));
      const e = pi * pi * (3 - 2 * pi); // zejście po spirali
      const bl = kopia || !rect ? 0 : gladkiProg(0.45, 1, pi); // wsuwanie się do komórki siatki
      // W trakcie zejścia kafel dalej krąży po pętli (dodatkowe pół obiegu)
      const tc = (((i / liczbaKafli + stan.offset + OBROT_SPIRALI * e) % 1) + 1) % 1;
      krzywa.getPointAt(tc, tmp.p);
      const ringY = tmp.p.y * f + przesunHero;
      let gx = tmp.p.x * f;
      let gy = ringY;
      let gw = SZER_KAFLA * f;
      let gh = WYS_KAFLA * f;
      if (rect) {
        gx = (rect.left + rect.width / 2 - innerWidth / 2) * u;
        gy = KAMERA.position[1] - (rect.top + rect.height / 2 - innerHeight / 2) * u;
        gw = rect.width * u;
        gh = rect.height * u;
      }
      // O ile cała pętla opada dla tego kafla: od środka pętli do wysokości jego komórki
      const opad = (gy - (SRODEK_Y * f + przesunHero)) * e;
      const zc = tmp.p.z * f * (1 - bl);
      const zaTekstem = zc < Z_TEKSTU * f;

      // Kopie i odfiltrowane kafle znikają w miarę składania siatki
      const celAlpha = kopia || !rect ? 1 - gladkiProg(0.3, 0.8, pi) : 1;
      k.alpha = dazy(k.alpha, celAlpha, krok, 14);
      mesh.visible = !poza && (warstwa === 'za' ? zaTekstem : !zaTekstem) && k.alpha > 0.01;
      // Kafel niewidoczny w tej warstwie nie łapie kursora: jego geometria nie jest odświeżana
      mesh.raycast = mesh.visible ? Mesh.prototype.raycast : bezRaycastu;
      if (!mesh.visible) continue;

      // Hover: na pętli z raycastu sceny, w siatce z DOM
      const hov = p < 0.5 ? stan.hover === i : stan.hoverSiatka === r && !kopia;
      k.podswietl = dazy(k.podswietl, hov && p < 0.5 ? 1 : 0, krok, hov ? 12 : 6);
      const skala = 1 + 0.03 * k.podswietl;
      if (hov && p >= 0.5 && !k.pelna && !k.laduje) {
        k.laduje = true;
        loader.load(`${BASE}realizacje/${realizacje[r].slug}-pelna.webp`, (t) => {
          t.colorSpace = SRGBColorSpace;
          k.pelna = t;
          mat.uniforms.uPelna.value = t;
          mat.uniforms.uF.value = Math.min(1, (WYS_KAFLA / SZER_KAFLA) / (t.image.height / t.image.width));
        });
      }
      k.amp = dazy(k.amp, hov && p >= 0.5 ? 0.07 : 0, krok, hov ? 6 : 2.5);
      k.mix = dazy(k.mix, hov && k.pelna ? 1 : 0, krok, 5);
      k.przesuw = hov && k.pelna ? Math.min(1, k.przesuw + krok / 7) : dazy(k.przesuw, 0, krok, 3);
      mat.uniforms.uAmp.value = k.amp;
      mat.uniforms.uMix.value = k.mix;
      mat.uniforms.uPrzesuw.value = k.przesuw;
      // na pętli kafle za nagłówkiem są przygaszone, żeby tekst był czytelny; najechany się rozjaśnia
      const przygaszenie = warstwa === 'za' ? 0.45 + 0.55 * Math.max(e, k.podswietl) : 1;
      mat.uniforms.uAlpha.value = k.alpha * przygaszenie;
      // półprzezroczysty kafel nie zasłania głębią tych, które są za nim
      mat.depthWrite = k.alpha > 0.98;
      mat.uniforms.uJasnosc.value = 0.1 * k.podswietl;
      mat.uniforms.uWiatr.value = bl;
      mat.uniforms.uCzas.value = stan.czas + i * 1.7;
      if (hov) mat.uniforms.uPunkt.value.set(stan.punkt.x, stan.punkt.y);

      // Kierunek szerokości na pętli: tak, żeby tekst czytał się od lewej z przodu i z tyłu
      krzywa.getTangentAt(tc, tmp.t);
      tmp.nrm.set(tmp.t.z, 0, -tmp.t.x);
      tmp.doKam.copy(KAM).sub(tmp.p);
      const znak = tmp.nrm.dot(tmp.doKam) < 0 ? 1 : -1;

      const pos = mesh.geometry.attributes.position as BufferAttribute;
      const liczba = pos.count;
      for (let v = 0; v < liczba; v++) {
        const x = (v % (SEG_X + 1)) / SEG_X - 0.5;
        const y = 0.5 - Math.floor(v / (SEG_X + 1)) / SEG_Y;
        // poza na spirali: punkt pętli opuszczony o `opad`
        const t = (((tc + znak * x * 2 * polSzer * skala) % 1) + 1) % 1;
        krzywa.getPointAt(t, tmp.v);
        const rx = tmp.v.x * f;
        const ry = (tmp.v.y + y * WYS_KAFLA * skala) * f + przesunHero + opad;
        const rz = tmp.v.z * f;
        // poza w siatce
        const sx = gx + x * gw;
        const sy = gy + y * gh;
        pos.setXYZ(v, rx + (sx - rx) * bl, ry + (sy - ry) * bl, rz * (1 - bl));
      }
      pos.needsUpdate = true;
      mesh.geometry.computeBoundingSphere();
    }
  });

  const klik = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (stan.przesunieto || stan.postep > 0.5) return;
    window.open(realizacje[i % n].url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {geometrie.map((geo, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshe.current[i] = m;
          }}
          geometry={geo}
          material={materialy[i]}
          frustumCulled={false}
          onClick={klik(i)}
          onPointerMove={(e) => {
            if (stan.postep > 0.5) return;
            stan.hover = i;
            onHover(i, e.clientX, e.clientY);
          }}
          onPointerOut={() => {
            if (stan.hover === i) {
              stan.hover = -1;
              onHover(-1, 0, 0);
            }
          }}
        />
      ))}
    </>
  );
}
