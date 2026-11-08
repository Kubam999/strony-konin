import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Mesh, PlaneGeometry, SRGBColorSpace, Vector3, type BufferAttribute, type Texture } from 'three';
import type { Realizacja } from '../../data/realizacje';
import { stan, CZAS_OBIEGU, Z_TEKSTU } from './stan';
import { zbudujKrzywa, SZER_KAFLA, WYS_KAFLA } from './krzywa';

export type Warstwa = 'za' | 'przed';

interface Props {
  realizacje: Realizacja[];
  /** Ile kafli ma być na pętli (realizacje powtarzają się, gdy jest ich mało) */
  liczbaKafli: number;
  warstwa: Warstwa;
  /** Tylko jedna warstwa przesuwa offset w czasie */
  prowadzi: boolean;
  onHover: (i: number, x: number, y: number) => void;
}

const SEGMENTY = 28;
const BASE = import.meta.env.BASE_URL;

/** Kafle wstęgi: płaszczyzny wyginane wzdłuż krzywej, teksturowane miniaturami realizacji. */
export default function Kafle({ realizacje, liczbaKafli, warstwa, prowadzi, onHover }: Props) {
  const { camera } = useThree();
  const tekstury = useTexture(realizacje.map((r) => `${BASE}realizacje/${r.slug}.webp`)) as Texture[];
  useEffect(() => {
    tekstury.forEach((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [tekstury]);

  const krzywa = useMemo(() => zbudujKrzywa(liczbaKafli), [liczbaKafli]);
  const dlugosc = useMemo(() => krzywa.getLength(), [krzywa]);
  const geometrie = useMemo(
    () => Array.from({ length: liczbaKafli }, () => new PlaneGeometry(1, 1, SEGMENTY, 1)),
    [liczbaKafli],
  );
  useEffect(() => () => geometrie.forEach((g) => g.dispose()), [geometrie]);

  const meshe = useRef<(Mesh | null)[]>([]);
  const tmp = useMemo(() => ({ p: new Vector3(), v: new Vector3(), t: new Vector3(), n: new Vector3(), doKam: new Vector3() }), []);

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
      if (!stan.pauza && !stan.przeciaganie) stan.offset += krok / CZAS_OBIEGU;
      if (!stan.przeciaganie) {
        stan.offset += stan.bezwladnosc * krok;
        stan.bezwladnosc *= Math.exp(-krok * 2.6);
        if (Math.abs(stan.bezwladnosc) < 1e-4) stan.bezwladnosc = 0;
      }
      stan.offset = ((stan.offset % 1) + 1) % 1;
    }

    const polSzer = SZER_KAFLA / 2 / dlugosc; // połowa szerokości kafla w parametrze krzywej
    for (let i = 0; i < liczbaKafli; i++) {
      const mesh = meshe.current[i];
      if (!mesh) continue;
      const tc = (i / liczbaKafli + stan.offset) % 1;
      krzywa.getPointAt(tc, tmp.p);
      const zaTekstem = tmp.p.z < Z_TEKSTU;
      mesh.visible = warstwa === 'za' ? zaTekstem : !zaTekstem;
      if (!mesh.visible) continue;

      const skala = stan.hover === i ? 1.06 : 1;
      // Kafle stoją pionowo jak zasłona wzdłuż toru. Kierunek szerokości dobieramy tak,
      // żeby tekst na miniaturze czytał się od lewej zarówno z przodu, jak i z tyłu pętli.
      krzywa.getTangentAt(tc, tmp.t);
      tmp.n.set(tmp.t.z, 0, -tmp.t.x);
      tmp.doKam.copy(camera.position).sub(tmp.p);
      const znak = tmp.n.dot(tmp.doKam) < 0 ? 1 : -1;
      const pos = mesh.geometry.attributes.position as BufferAttribute;
      const n = pos.count;
      for (let k = 0; k < n; k++) {
        // PlaneGeometry: dwa rzędy po SEGMENTY+1 wierzchołków, górny rząd pierwszy
        const x = (k % (SEGMENTY + 1)) / SEGMENTY - 0.5;
        const y = k <= SEGMENTY ? 0.5 : -0.5;
        const t = (((tc + znak * x * 2 * polSzer * skala) % 1) + 1) % 1;
        krzywa.getPointAt(t, tmp.v);
        tmp.v.y += y * WYS_KAFLA * skala;
        pos.setXYZ(k, tmp.v.x, tmp.v.y, tmp.v.z);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeBoundingSphere();
    }
  });

  const klik = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (stan.przesunieto) return;
    const r = realizacje[i % realizacje.length];
    window.open(r.url, '_blank', 'noopener,noreferrer');
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
          frustumCulled={false}
          onClick={klik(i)}
          onPointerMove={(e) => {
            stan.hover = i;
            onHover(i, e.clientX, e.clientY);
          }}
          onPointerOut={() => {
            if (stan.hover === i) {
              stan.hover = -1;
              onHover(-1, 0, 0);
            }
          }}
        >
          <meshBasicMaterial map={tekstury[i % realizacje.length]} toneMapped={false} side={2} />
        </mesh>
      ))}
    </>
  );
}
