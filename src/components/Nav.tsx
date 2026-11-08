import { useEffect, useState } from 'react';
import { BRAND } from '../config/site';
import './Nav.css';

const LINKI = [
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#co-robimy', label: 'Co robimy' },
  { href: '#jak-pracujemy', label: 'Jak pracujemy' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Nav() {
  const [otwarte, setOtwarte] = useState(false);

  useEffect(() => {
    if (!otwarte) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOtwarte(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [otwarte]);

  return (
    <header className={`nav${otwarte ? ' nav--otwarte' : ''}`}>
      <div className="container nav__row">
        <a className="nav__brand" href="#start" aria-label={`${BRAND}, strona główna`}>
          <span className="nav__znak" aria-hidden="true" />
          {BRAND}
        </a>
        <nav className="nav__linki" aria-label="Główna" id="menu">
          {LINKI.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOtwarte(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__akcje">
          <a className="btn btn--accent btn--sm nav__cta" href="#kontakt">
            Napisz do nas
          </a>
          <button
            type="button"
            className="nav__menu"
            aria-expanded={otwarte}
            aria-controls="menu"
            onClick={() => setOtwarte((o) => !o)}
          >
            <span className="nav__kreski" aria-hidden="true" />
            <span className="sr-only">{otwarte ? 'Zamknij menu' : 'Otwórz menu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
