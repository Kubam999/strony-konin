import './CoRobimy.css';

const OFERTA = [
  { nazwa: 'Wizytówka', dlaKogo: 'Jedna strona: oferta, opinie, kontakt i mapa.' },
  { nazwa: 'Strona firmowa', dlaKogo: 'Kilka podstron, realizacje, formularz zapytań.' },
  { nazwa: 'Strona rozbudowana', dlaKogo: 'Rezerwacje, menu, zapisy albo sklep.' },
];

const DLA_KOGO = [
  'gabinety',
  'warsztaty',
  'salony',
  'restauracje',
  'sklepy',
  'kluby sportowe',
  'firmy usługowe',
  'kancelarie',
  'pracownie',
];

export default function CoRobimy() {
  return (
    <section className="sekcja co" id="co-robimy" aria-labelledby="co-tytul">
      <div className="container">
        <header className="sekcja__naglowek">
          <p className="eyebrow">Co robimy</p>
          <h2 className="h2" id="co-tytul">
            Trzy rodzaje stron
          </h2>
        </header>

        <ul className="co__lista" role="list">
          {OFERTA.map((o, i) => (
            <li className="karta" key={o.nazwa}>
              <span className="karta__nr">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="karta__nazwa">{o.nazwa}</h3>
              <p className="karta__dla">{o.dlaKogo}</p>
            </li>
          ))}
        </ul>

        <div className="co__dla">
          <p className="co__dla-tytul">Dla kogo</p>
          <p className="co__dla-lista">
            {DLA_KOGO.map((d, i) => (
              <span key={d}>
                {d}
                {i < DLA_KOGO.length - 1 && <span aria-hidden="true"> · </span>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
