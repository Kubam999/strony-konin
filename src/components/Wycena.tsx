import './Wycena.css';

export default function Wycena() {
  return (
    <section className="sekcja wycena" id="wycena" aria-labelledby="wycena-tytul">
      <div className="container wycena__wrap">
        <h2 className="h2 wycena__tytul" id="wycena-tytul">
          Nie mamy cennika. Każda firma potrzebuje czegoś innego.
        </h2>
        <div className="wycena__bok">
          <p className="wycena__tekst">
            Napisz, czym się zajmujesz i co ma robić Twoja strona. Szybko przygotujemy wycenę dopasowaną do
            tego, czego naprawdę potrzebujesz, bez pakietów na siłę.
          </p>
          <a className="btn btn--accent wycena__btn" href="#kontakt">
            Napisz do nas
          </a>
        </div>
      </div>
    </section>
  );
}
