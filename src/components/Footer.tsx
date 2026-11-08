import { BRAND, DEMO_SCIEZKA, KONTAKT, POLITYKA_SCIEZKA } from '../config/site';
import './Footer.css';

const BASE = import.meta.env.BASE_URL;

export default function Footer() {
  return (
    <footer className="stopka" id="kontakt">
      <div className="container stopka__row">
        <div>
          <p className="stopka__brand">{BRAND}</p>
          <p className="stopka__info">
            {KONTAKT.miejsce} · {KONTAKT.email} · {KONTAKT.telefon}
          </p>
        </div>
        <nav className="stopka__linki" aria-label="Stopka">
          <a href={`${BASE}${DEMO_SCIEZKA}`}>15 demo dla firm z Konina</a>
          <a href={`${BASE}${POLITYKA_SCIEZKA}`}>Polityka prywatności</a>
        </nav>
      </div>
      <div className="container stopka__dol">
        <p>
          Projekty koncepcyjne to własne koncepty naszej projektantki Blanki, nie wdrożenia dla istniejących firm.
        </p>
        <p>© {new Date().getFullYear()} {BRAND}</p>
      </div>
    </footer>
  );
}
