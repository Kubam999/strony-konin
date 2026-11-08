import { useMemo, useState } from 'react';
import { REALIZACJE, type Kategoria } from '../data/realizacje';
import { FILTR_BRANZ_OD } from '../config/site';
import { stan } from './wstega/stan';
import './Realizacje.css';

const BASE = import.meta.env.BASE_URL;

export default function Realizacje() {
  const [kategoria, setKategoria] = useState<Kategoria | 'wszystkie'>('wszystkie');
  const kategorie = useMemo(() => [...new Set(REALIZACJE.map((r) => r.kategoria))], []);
  const filtrWidoczny = REALIZACJE.length >= FILTR_BRANZ_OD;
  const widoczne = kategoria === 'wszystkie' ? REALIZACJE : REALIZACJE.filter((r) => r.kategoria === kategoria);

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
            strona dla firmy z tej branży. Najedź, żeby zobaczyć podgląd, kliknij, żeby otworzyć stronę.
          </p>
        </header>

        {filtrWidoczny && (
          <div className="real__filtr" role="group" aria-label="Filtruj według branży">
            <button
              type="button"
              className={`chip${kategoria === 'wszystkie' ? ' chip--aktywny' : ''}`}
              aria-pressed={kategoria === 'wszystkie'}
              onClick={() => setKategoria('wszystkie')}
            >
              Wszystkie <span>{REALIZACJE.length}</span>
            </button>
            {kategorie.map((k) => (
              <button
                key={k}
                type="button"
                className={`chip${kategoria === k ? ' chip--aktywny' : ''}`}
                aria-pressed={kategoria === k}
                onClick={() => setKategoria(k)}
              >
                {k} <span>{REALIZACJE.filter((r) => r.kategoria === k).length}</span>
              </button>
            ))}
          </div>
        )}

        <ul
          className="real__siatka"
          role="list"
          ref={(el) => {
            stan.siatka = el;
          }}
        >
          {REALIZACJE.map((r, i) => {
            const pokaz = widoczne.includes(r);
            return (
              <li className="kafel" key={r.slug} hidden={!pokaz}>
                <a
                  className="kafel__link"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.querySelector('.kafel__ramka')!.getBoundingClientRect();
                    stan.hoverSiatka = i;
                    stan.punkt.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                    stan.punkt.y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
                  }}
                  onPointerLeave={() => {
                    if (stan.hoverSiatka === i) stan.hoverSiatka = -1;
                  }}
                  onFocus={() => {
                    stan.hoverSiatka = i;
                  }}
                  onBlur={() => {
                    if (stan.hoverSiatka === i) stan.hoverSiatka = -1;
                  }}
                >
                  <span
                    className="kafel__ramka"
                    style={{ background: r.kolor }}
                    ref={(el) => {
                      stan.cele[i] = pokaz ? el : null;
                    }}
                  >
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
                    <span className="kafel__otworz">Otwórz na żywo ↗</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
