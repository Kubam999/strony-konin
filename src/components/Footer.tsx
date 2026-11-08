import { BRAND, DEMO_SCIEZKA, KONTAKT, POLITYKA_SCIEZKA } from '../config/site';
import './Footer.css';

const BASE = import.meta.env.BASE_URL;

export default function Footer() {
  return (
    <footer className="stopka">
      <div className="container stopka__row">
        <p>
          © {new Date().getFullYear()} {BRAND} · {KONTAKT.miejsce}
        </p>
        <nav className="stopka__linki" aria-label="Stopka">
          <a href={`${BASE}${DEMO_SCIEZKA}`}>15 demo dla firm z Konina</a>
          <a href={`${BASE}${POLITYKA_SCIEZKA}`}>Polityka prywatności</a>
        </nav>
      </div>
    </footer>
  );
}
