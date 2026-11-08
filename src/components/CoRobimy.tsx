import './CoRobimy.css';

const OFERTA = [
  { nazwa: 'Wizytówka', opis: 'Jedna strona: oferta, opinie, kontakt i mapa.' },
  { nazwa: 'Strona firmowa', opis: 'Kilka podstron, realizacje, formularz zapytań.' },
  { nazwa: 'Strona rozbudowana', opis: 'Rezerwacje, menu, zapisy albo sklep.' },
];

const KROKI = [
  { nazwa: 'Rozmowa', opis: 'Pół godziny o firmie i o tym, co ma robić strona.' },
  { nazwa: 'Projekt', opis: 'Makieta do akceptacji, poprawiamy aż pasuje.' },
  { nazwa: 'Wdrożenie', opis: 'Strona pod Twoją domeną, szybka i na telefon.' },
  { nazwa: 'Opieka', opis: 'Poprawki, nowe treści i aktualizacje po starcie.' },
];

const DLA_KOGO = ['gabinety', 'warsztaty', 'salony', 'restauracje', 'sklepy', 'kluby sportowe', 'kancelarie', 'pracownie'];

export default function CoRobimy() {
  return (
    <section className="sekcja co" id="co-robimy" aria-labelledby="co-tytul">
      <div className="container co__wrap">
        <div className="co__kol">
          <p className="eyebrow">Co robimy</p>
          <h2 className="h2" id="co-tytul">
            Trzy rodzaje stron
          </h2>
          <ul className="co__lista" role="list">
            {OFERTA.map((o) => (
              <li className="co__poz" key={o.nazwa}>
                <h3 className="co__nazwa">{o.nazwa}</h3>
                <p className="co__opis">{o.opis}</p>
              </li>
            ))}
          </ul>
          <p className="co__dla">
            <span>Dla kogo</span> {DLA_KOGO.join(' · ')}
          </p>
        </div>

        <div className="co__kol" id="jak-pracujemy">
          <p className="eyebrow">Jak pracujemy</p>
          <h2 className="h2">Cztery kroki</h2>
          <ol className="co__kroki">
            {KROKI.map((k, i) => (
              <li className="krok" key={k.nazwa}>
                <span className="krok__nr">{i + 1}</span>
                <div>
                  <h3 className="co__nazwa">{k.nazwa}</h3>
                  <p className="co__opis">{k.opis}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
