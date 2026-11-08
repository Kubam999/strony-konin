import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ruchOgraniczony } from '../lib/srodowisko';

gsap.registerPlugin(ScrollTrigger);

/** Płynne przewijanie (Lenis) spięte z tickerem GSAP. Wyłączone przy prefers-reduced-motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (ruchOgraniczony()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (czas: number) => lenis.raf(czas * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis-aktywny');
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove('lenis-aktywny');
    };
  }, []);
  return null;
}
