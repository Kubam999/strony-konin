import { useState, type FormEvent } from 'react';
import { BRAND, KONTAKT } from '../config/site';
import './Kontakt.css';

const RODZAJE = ['Wizytówka', 'Strona firmowa', 'Strona rozbudowana', 'Jeszcze nie wiem'];

export default function Kontakt() {
  const [komunikat, setKomunikat] = useState('');

  // Formularz na razie tylko wizualny: nic nie wysyła.
  const wyslij = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKomunikat(`Formularz nie jest jeszcze podłączony. Na razie napisz do nas na ${KONTAKT.email}.`);
  };

  return (
    <section className="sekcja kontakt" id="kontakt" aria-labelledby="kontakt-tytul">
      <div className="container kontakt__wrap">
        <div className="kontakt__info">
          <p className="eyebrow">Kontakt</p>
          <h2 className="h2" id="kontakt-tytul">
            Napisz do nas
          </h2>
          <p className="lead">Odpowiadamy w dzień roboczy.</p>
          <dl className="kontakt__dane">
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={`tel:${KONTAKT.telefon.replace(/\s/g, '')}`}>{KONTAKT.telefon}</a>
              </dd>
            </div>
            <div>
              <dt>Gdzie</dt>
              <dd>{KONTAKT.miejsce}</dd>
            </div>
          </dl>
        </div>

        <form className="formularz" onSubmit={wyslij} noValidate>
          <div className="pole">
            <label htmlFor="f-imie">Imię</label>
            <input id="f-imie" name="imie" type="text" autoComplete="given-name" placeholder="Jak się do Ciebie zwracać" />
          </div>
          <div className="pole">
            <label htmlFor="f-kontakt">E-mail lub telefon</label>
            <input id="f-kontakt" name="kontakt" type="text" autoComplete="email" inputMode="email" placeholder="Gdzie odpisać" />
          </div>
          <div className="pole">
            <label htmlFor="f-rodzaj">Rodzaj strony</label>
            <select id="f-rodzaj" name="rodzaj" defaultValue={RODZAJE[3]}>
              {RODZAJE.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="pole pole--pelne">
            <label htmlFor="f-wiadomosc">Wiadomość</label>
            <textarea id="f-wiadomosc" name="wiadomosc" rows={5} placeholder="Czym się zajmujesz i co ma robić strona?" />
          </div>
          <label className="zgoda pole--pelne">
            <input type="checkbox" name="zgoda" />
            <span>Zgadzam się na kontakt w sprawie wyceny ({BRAND}).</span>
          </label>
          <div className="formularz__dol pole--pelne">
            <button type="submit" className="btn btn--ink">
              Wyślij wiadomość
            </button>
            <p className="formularz__status" role="status" aria-live="polite">
              {komunikat}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
