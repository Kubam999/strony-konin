import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HASLO, PODTYTUL } from '../config/site';
import { REALIZACJE } from '../data/realizacje';
import { wstega3D } from '../lib/srodowisko';
import WstegaMobilna from './wstega/WstegaMobilna';
import './Hero.css';

// Scena WebGL ładuje się osobno i tylko tam, gdzie ma sens.
const Wstega = lazy(() => import('./wstega/Wstega'));

/** Składa hasło: `|` łamie wiersz, `*słowo*` jest kursywą Fraunces w kolorze akcentu. */
function Haslo({ tekst }: { tekst: string }) {
  return (
    <>
      {tekst.split('|').map((wiersz, i) => (
        <span className="hero__wiersz" key={i}>
          {wiersz.split(/(\*[^*]+\*)/).map((czesc, j) =>
            czesc.startsWith('*') ? (
              <em className="hero__akcent" key={j}>
                {czesc.slice(1, -1)}
              </em>
            ) : (
              <span key={j}>{czesc}</span>
            ),
          )}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const sekcja = useRef<HTMLElement>(null);
  const [tryb3D, setTryb3D] = useState(false);
  useEffect(() => {
    setTryb3D(wstega3D());
  }, []);

  return (
    <section className={`hero${tryb3D ? ' hero--3d' : ''}`} id="start" ref={sekcja}>
      <div className="container hero__wrap">
        <p className="eyebrow hero__eyebrow">Zespół z Konina · strony dla lokalnych firm</p>

        <h1 className="display hero__h">
          <Haslo tekst={HASLO} />
        </h1>

        {!tryb3D && <WstegaMobilna />}

        <div className="hero__dol">
          <p className="lead hero__lead">{PODTYTUL}</p>
          <div className="hero__cta">
            <a className="btn btn--ink" href="#realizacje">
              Zobacz realizacje
            </a>
            <a className="btn btn--ghost" href="#kontakt">
              Napisz do nas
            </a>
          </div>
          <p className="hero__meta">
            <span>{REALIZACJE.length} realizacji</span>
            <span>Projekt, wdrożenie, opieka</span>
            <span>Konin i okolice</span>
          </p>
        </div>
      </div>

      {tryb3D && (
        <Suspense fallback={null}>
          <Wstega zrodloZdarzen={sekcja} />
        </Suspense>
      )}
    </section>
  );
}
