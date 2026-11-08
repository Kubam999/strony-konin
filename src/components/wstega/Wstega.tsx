import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Cache } from 'three';
import { REALIZACJE } from '../../data/realizacje';
import Kafle from './Kafle';
import { stan } from './stan';
import './Wstega.css';

Cache.enabled = true;

const MIN_KAFLI = 10;
const KAMERA = { position: [0, 0.2, 6.2] as [number, number, number], fov: 38 };

interface Props {
  /** Element, z którego scena bierze zdarzenia wskaźnika (cała sekcja hero) */
  zrodloZdarzen: React.RefObject<HTMLElement | null>;
}

/**
 * Wstęga realizacji w dwóch warstwach WebGL: jedna za nagłówkiem, druga przed nim.
 * Obie rysują te same kafle, ale każda tylko te po swojej stronie płaszczyzny tekstu,
 * więc kafle wjeżdżają zza napisu i wychodzą przed niego.
 */
export default function Wstega({ zrodloZdarzen }: Props) {
  const liczbaKafli = Math.max(MIN_KAFLI, REALIZACJE.length);
  const [pauza, setPauza] = useState(() => new URLSearchParams(location.search).get('pauza') === '1');
  const [hover, setHover] = useState(-1);
  const etykieta = useRef<HTMLDivElement>(null);

  const onHover = useCallback((i: number, x: number, y: number) => {
    setHover(i);
    const el = etykieta.current;
    if (el && i >= 0) el.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
  }, []);

  // Przeciąganie wstęgi palcem lub myszką po całym hero (poza linkami i przyciskami)
  useEffect(() => {
    const el = zrodloZdarzen.current;
    if (!el) return;
    let x0 = 0;
    let ostatniX = 0;
    let ostatniCzas = 0;
    let predkosc = 0;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select')) return;
      stan.przeciaganie = true;
      stan.przesunieto = false;
      stan.bezwladnosc = 0;
      x0 = ostatniX = e.clientX;
      ostatniCzas = performance.now();
      predkosc = 0;
      el.classList.add('wstega-przeciaganie');
    };
    const move = (e: PointerEvent) => {
      if (!stan.przeciaganie) return;
      const dx = e.clientX - ostatniX;
      const teraz = performance.now();
      const dt = Math.max(1, teraz - ostatniCzas) / 1000;
      const skala = 1 / (innerWidth * 1.4); // pełna szerokość ekranu ≈ 0,7 obiegu
      stan.offset += dx * skala;
      predkosc = (dx * skala) / dt;
      ostatniX = e.clientX;
      ostatniCzas = teraz;
      if (Math.abs(e.clientX - x0) > 4) stan.przesunieto = true;
    };
    const up = () => {
      if (!stan.przeciaganie) return;
      stan.przeciaganie = false;
      stan.bezwladnosc = Math.max(-0.6, Math.min(0.6, predkosc));
      el.classList.remove('wstega-przeciaganie');
      // kliknięcie w kafel sprawdza przesunieto; zerujemy chwilę później
      setTimeout(() => {
        stan.przesunieto = false;
      }, 0);
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [zrodloZdarzen]);

  const przelaczPauze = () => {
    stan.pauza = !stan.pauza;
    setPauza(stan.pauza);
  };

  const wspolne = {
    camera: KAMERA,
    dpr: [1, 1.5] as [number, number],
    gl: { antialias: true, alpha: true, powerPreference: 'high-performance' as const },
    eventSource: zrodloZdarzen as React.RefObject<HTMLElement>,
    eventPrefix: 'client' as const,
    flat: true,
  };
  const aktywna = hover >= 0 ? REALIZACJE[hover % REALIZACJE.length] : null;

  return (
    <>
      <div className="wstega wstega--za" aria-hidden="true">
        <Canvas {...wspolne}>
          <Suspense fallback={null}>
            <Kafle realizacje={REALIZACJE} liczbaKafli={liczbaKafli} warstwa="za" prowadzi={false} onHover={onHover} />
          </Suspense>
        </Canvas>
      </div>
      <div className="wstega wstega--przed" aria-hidden="true">
        <Canvas {...wspolne}>
          <Suspense fallback={null}>
            <Kafle realizacje={REALIZACJE} liczbaKafli={liczbaKafli} warstwa="przed" prowadzi onHover={onHover} />
          </Suspense>
        </Canvas>
      </div>

      <div ref={etykieta} className={`wstega__etykieta${aktywna ? ' jest' : ''}`} aria-hidden="true">
        {aktywna && (
          <>
            <strong>{aktywna.nazwa}</strong> {aktywna.branza} <span>otwórz ↗</span>
          </>
        )}
      </div>

      <button
        type="button"
        className="btn btn--ghost btn--sm wstega__pauza"
        onClick={przelaczPauze}
        aria-pressed={pauza}
        aria-label={pauza ? 'Wznów ruch wstęgi realizacji' : 'Zatrzymaj ruch wstęgi realizacji'}
      >
        {pauza ? 'Wznów' : 'Pauza'}
      </button>
    </>
  );
}
