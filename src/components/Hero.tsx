import { HASLO, PODTYTUL } from '../config/site';
import { REALIZACJE } from '../data/realizacje';
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

export default function Hero() {
  return (
    <section className="hero" id="start">
      <div className="container hero__wrap">
        <p className="eyebrow hero__eyebrow">Zespół z Konina · strony dla lokalnych firm</p>

        <h1 className="display hero__h">
          <Haslo tekst={HASLO} />
        </h1>

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

        {/* Miejsce na wstęgę 3D z realizacjami (etap 2) */}
        <div className="hero__scena" aria-hidden="true" />
      </div>
    </section>
  );
}
