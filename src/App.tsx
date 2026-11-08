import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Realizacje from './components/Realizacje';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import { wstega3D } from './lib/srodowisko';

// Scena WebGL ładuje się osobno i tylko tam, gdzie ma sens.
const Wstega = lazy(() => import('./components/wstega/Wstega'));

export default function App() {
  const hero = useRef<HTMLElement>(null);
  const [tryb3D, setTryb3D] = useState(false);
  useEffect(() => {
    const ma = wstega3D();
    setTryb3D(ma);
    document.documentElement.classList.toggle('ma-3d', ma);
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
