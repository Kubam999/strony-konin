import { BRAND } from '../config/site';
import './Nav.css';

const LINKI = [
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#co-robimy', label: 'Co robimy' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__row">
        <a className="nav__brand" href="#start" aria-label={`${BRAND}, strona główna`}>
          <span className="nav__znak" aria-hidden="true" />
          {BRAND}
        </a>
        <nav className="nav__linki" aria-label="Główna">
          {LINKI.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--accent btn--sm nav__cta" href="#kontakt">
          Napisz do nas
        </a>
      </div>
    </header>
  );
}
