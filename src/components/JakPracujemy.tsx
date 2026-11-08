import './JakPracujemy.css';

const KROKI = [
  {
    nazwa: 'Rozmowa',
    opis: 'Pół godziny o Twojej firmie: dla kogo pracujesz, co ma robić strona i co już masz. Po rozmowie dostajesz wycenę.',
  },
  {
    nazwa: 'Projekt',
    opis: 'Makieta strony do akceptacji: układ, kolory, teksty. Poprawiamy, aż powiesz, że to jest to.',
  },
  {
    nazwa: 'Wdrożenie',
    opis: 'Strona pod Twoją domeną, szybka, działa dobrze na telefonie i w Google. Przed startem oglądasz ją w całości.',
  },
  {
    nazwa: 'Opieka',
    opis: 'Po starcie zostajemy: poprawki, nowe treści, aktualizacje i kopie zapasowe. Jeden kontakt, gdy coś potrzeba.',
  },
];

export default function JakPracujemy() {
  return (
    <section className="sekcja jak" id="jak-pracujemy" aria-labelledby="jak-tytul">
      <div className="container">
        <header className="sekcja__naglowek">
          <p className="eyebrow">Jak pracujemy</p>
          <h2 className="h2" id="jak-tytul">
            Od rozmowy do strony w czterech krokach
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
