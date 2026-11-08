import './JakPracujemy.css';

const KROKI = [
  { nazwa: 'Rozmowa', opis: 'Pół godziny o firmie i o tym, co ma robić strona.' },
  { nazwa: 'Projekt', opis: 'Makieta do akceptacji, poprawiamy aż pasuje.' },
  { nazwa: 'Wdrożenie', opis: 'Strona pod Twoją domeną, szybka i na telefon.' },
  { nazwa: 'Opieka', opis: 'Poprawki, nowe treści i aktualizacje po starcie.' },
];

export default function JakPracujemy() {
  return (
    <section className="sekcja jak" id="jak-pracujemy" aria-labelledby="jak-tytul">
      <div className="container">
        <header className="sekcja__naglowek">
          <h2 className="h2" id="jak-tytul">
            Jak pracujemy
          </h2>
        </header>
        <ol className="jak__kroki">
          {KROKI.map((k, i) => (
            <li className="krok" key={k.nazwa}>
              <span className="krok__nr">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="krok__nazwa">{k.nazwa}</h3>
              <p className="krok__opis">{k.opis}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
