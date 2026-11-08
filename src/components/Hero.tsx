import type { RefObject } from 'react';
import { HASLO, PODTYTUL } from '../config/site';
import WstegaMobilna from './wstega/WstegaMobilna';
import './Hero.css';

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

interface Props {
  ref: RefObject<HTMLElement | null>;
  /** Czy działa wstęga WebGL (wtedy bez taśmy CSS) */
  tryb3D: boolean;
}

export default function Hero({ ref, tryb3D }: Props) {
  return (
    <section className={`hero${tryb3D ? ' hero--3d' : ''}`} id="start" ref={ref}>
      <div className="container hero__wrap">
        <p className="eyebrow hero__eyebrow">Zespół z Konina · strony dla lokalnych firm</p>

        <h1 className="display hero__h">
          <Haslo tekst={HASLO} />
        </h1>

        {!tryb3D && <WstegaMobilna />}

        <div className="hero__dol">
          <p className="lead hero__lead">{PODTYTUL}</p>
          <a className="btn btn--ink" href="#kontakt">
            Napisz do nas
          </a>
        </div>
      </div>
    </section>
  );
}
