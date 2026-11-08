import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Cache } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REALIZACJE } from '../../data/realizacje';
import Kafle from './Kafle';
import { stan, KAMERA } from './stan';
import './Wstega.css';

gsap.registerPlugin(ScrollTrigger);
Cache.enabled = true;

const MIN_KAFLI = 10;

interface Props {
  /** Sekcja hero: źródło zdarzeń wskaźnika dla sceny i punkt odniesienia pętli */
  hero: React.RefObject<HTMLElement | null>;
}

/**
 * Wstęga realizacji w dwóch stałych warstwach WebGL: jedna za treścią strony, druga przed nią.
 * Obie rysują te same kafle, ale każda tylko te po swojej stronie płaszczyzny tekstu,
 * więc na pętli kafle wjeżdżają zza nagłówka i wychodzą przed niego. Przy scrollu kafle
 * przelatują z pętli do komórek siatki w sekcji realizacji i tam zostają.
 */
export default function Wstega({ hero }: Props) {
  const liczbaKafli = Math.max(MIN_KAFLI, REALIZACJE.length);
  const [hover, setHover] = useState(-1);
  const etykieta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stan.hero = hero.current;
  }, [hero]);

  const onHover = useCallback(
    (i: number, x: number, y: number) => {
      setHover(i);
      hero.current?.classList.toggle('hero--nad-kaflem', i >= 0);
      const el = etykieta.current;
      if (el && i >= 0) el.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
    },
    [hero],
  );

  // Postęp przejścia pętla -> siatka: zaczyna się, gdy sekcja realizacji wjeżdża, i kończy
  // po pół ekranu scrolla, więc kafle są na miejscu, zanim siatka pokaże się w całości
  useEffect(() => {
    const st = ScrollTrigger.create({
      // od pierwszego piksela scrolla (hero zawsze zaczyna na górze), nie od pozycji sekcji,
      // bo przy niskim hero sekcja realizacji jest widoczna już przy wczytaniu
      trigger: '#start',
      start: 'top top',
      end: () => `+=${Math.round(innerHeight * 0.6)}`,
      onUpdate: (s) => {
        stan.postep = s.progress;
      },
    });
    return () => st.kill();
  }, []);

  // Przeciąganie wstęgi myszką po hero (poza linkami i przyciskami)
  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    let x0 = 0;
    let ostatniX = 0;
    let ostatniCzas = 0;
    let predkosc = 0;
    const down = (e: PointerEvent) => {
      if (stan.postep > 0.3) return;
      // tekst pod nagłówkiem da się zaznaczać; przeciąganie zaczyna się poza nim
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select, .hero__dol')) return;
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
  }, [hero]);

  const wspolne = {
    camera: KAMERA,
    dpr: [1, 1.5] as [number, number],
    gl: { antialias: true, alpha: true, powerPreference: 'high-performance' as const },
    eventSource: hero as React.RefObject<HTMLElement>,
    eventPrefix: 'client' as const,
    flat: true,
  };
  const aktywna = hover >= 0 && stan.postep < 0.5 ? REALIZACJE[hover % REALIZACJE.length] : null;

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
    </>
  );
}
