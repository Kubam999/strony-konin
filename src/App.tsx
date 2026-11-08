import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Realizacje from './components/Realizacje';
import CoRobimy from './components/CoRobimy';
import JakPracujemy from './components/JakPracujemy';
import Wycena from './components/Wycena';
import Kontakt from './components/Kontakt';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import { wstega3D } from './lib/srodowisko';

// Scena WebGL ładuje się osobno i tylko tam, gdzie ma sens.
const Wstega = lazy(() => import('./components/wstega/Wstega'));

export default function App() {
  const hero = useRef<HTMLElement>(null);
  const [tryb3D, setTryb3D] = useState(false);
  // Tryb wybierany reaktywnie: panel podglądu albo okno mogą zmienić szerokość po starcie.
  useEffect(() => {
    let timer = 0;
    const ustaw = () => {
      const ma = wstega3D();
      setTryb3D(ma);
      document.documentElement.classList.toggle('ma-3d', ma);
    };
    const naZmiane = () => {
      clearTimeout(timer);
      timer = window.setTimeout(ustaw, 150);
    };
    ustaw();
    window.addEventListener('resize', naZmiane);
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', naZmiane);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', naZmiane);
      mq.removeEventListener('change', naZmiane);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#tresc">
        Przejdź do treści
      </a>
      <SmoothScroll />
      <Nav />
      <main id="tresc">
        <Hero ref={hero} tryb3D={tryb3D} />
        <Realizacje />
        <CoRobimy />
        <JakPracujemy />
        <Wycena />
        <Kontakt />
      </main>
      <Footer />
      {tryb3D && (
        <Suspense fallback={null}>
          <Wstega hero={hero} />
        </Suspense>
      )}
    </>
  );
}
