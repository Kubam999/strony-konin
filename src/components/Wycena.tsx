import './Wycena.css';

export default function Wycena() {
  return (
    <section className="sekcja wycena" id="wycena" aria-labelledby="wycena-tytul">
      <div className="container wycena__wrap">
        <h2 className="h2 wycena__tytul" id="wycena-tytul">
          Nie mamy cennika.
        </h2>
        <div className="wycena__bok">
          <p className="wycena__tekst">Napisz, czym się zajmujesz, a szybko przygotujemy wycenę.</p>
          <a className="btn btn--accent wycena__btn" href="#kontakt">
            Napisz do nas
          </a>
        </div>
      </div>
    </section>
  );
}
