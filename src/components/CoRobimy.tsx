import './CoRobimy.css';

const OFERTA = [
  {
    nazwa: 'Wizytówka',
    dlaKogo: 'Dla jednoosobowych firm i gabinetów, które chcą być w Google i mieć gdzie odesłać klienta.',
    opis: 'Jedna strona: kim jesteś, co robisz, jak się umówić. Oferta, opinie, kontakt i mapa.',
    zestaw: ['Projekt i teksty', 'Domena i hosting', 'Mapa i formularz', 'Opieka po starcie'],
  },
  {
    nazwa: 'Strona firmowa',
    dlaKogo: 'Dla firm, które mają więcej do pokazania i chcą zbierać zapytania przez stronę.',
    opis: 'Kilka podstron: oferta, cennik, zespół, realizacje, pytania i formularz zgłoszenia.',
    zestaw: ['Do 6 podstron', 'Formularze i zapisy', 'Galeria realizacji', 'Wpięcie w Google'],
  },
  {
    nazwa: 'Strona rozbudowana',
    dlaKogo: 'Dla lokali, klubów i firm, które żyją z rezerwacji albo sprzedają przez internet.',
    opis: 'Rezerwacje, menu, kalendarz zajęć, sklep albo system zapisów. Rozwijana razem z firmą.',
    zestaw: ['Rezerwacje lub sklep', 'Podstrony bez limitu', 'Integracje z narzędziami', 'Stała opieka'],
  },
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
            Trzy rodzaje stron, jeden zespół
          </h2>
          <p className="lead">
            Projektujemy, piszemy teksty, wdrażamy i opiekujemy się stroną po starcie. Ty zajmujesz się firmą.
          </p>
        </header>

        <ul className="co__lista" role="list">
          {OFERTA.map((o, i) => (
            <li className="karta" key={o.nazwa}>
              <span className="karta__nr">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="karta__nazwa">{o.nazwa}</h3>
              <p className="karta__dla">{o.dlaKogo}</p>
              <p className="karta__opis">{o.opis}</p>
              <ul className="karta__zestaw" role="list">
                {o.zestaw.map((z) => (
                  <li key={z}>{z}</li>
                ))}
              </ul>
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
          <p className="co__dla-opis">Lokalne firmy z Konina i okolic, które chcą dobrze wyglądać w internecie i mieć stronę, która realnie przynosi klientów.</p>
        </div>
      </div>
    </section>
  );
}
