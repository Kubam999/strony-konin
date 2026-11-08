import { REALIZACJE } from '../data/realizacje';
import './Realizacje.css';

const BASE = import.meta.env.BASE_URL;

export default function Realizacje() {
  return (
    <section className="real" id="realizacje" aria-labelledby="real-tytul">
      <div className="container">
        <header className="real__naglowek">
          <p className="eyebrow">Realizacje</p>
          <h2 className="h2" id="real-tytul">
            Strony, które już zrobiliśmy
          </h2>
          <p className="lead">
            Każdy projekt oznaczony jako koncept to własna propozycja naszej projektantki Blanki: tak wyglądałaby
            strona dla firmy z tej branży.
          </p>
        </header>

        <ul className="real__siatka" role="list">
          {REALIZACJE.map((r, i) => (
            <li className="kafel" key={r.slug}>
              <a className="kafel__link" href={r.url} target="_blank" rel="noopener noreferrer">
                <span className="kafel__ramka" style={{ background: r.kolor }}>
                  <img
                    src={`${BASE}realizacje/${r.slug}.webp`}
                    alt={`Strona ${r.nazwa}, zrzut ekranu`}
                    width={1200}
                    height={750}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </span>
                <span className="kafel__podpis">
                  <span className="kafel__nr">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kafel__nazwa">{r.nazwa}</span>
                  <span className="kafel__branza">{r.branza}</span>
                  <span className="kafel__rodzaj">
                    {r.rodzaj === 'koncept' ? 'Projekt koncepcyjny' : 'Wdrożenie'} · {r.autor}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
