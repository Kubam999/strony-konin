import { useState } from 'react';
import { stan } from './stan';

/** Przycisk pauzy wstęgi, renderowany w hero (poza sceną, żeby nie ładować three w głównym chunku). */
export default function PrzyciskPauzy() {
  const [pauza, setPauza] = useState(() => new URLSearchParams(location.search).get('pauza') === '1');
  const przelacz = () => {
    stan.pauza = !stan.pauza;
    setPauza(stan.pauza);
  };
  return (
    <button
      type="button"
      className="btn btn--ghost btn--sm wstega__pauza"
      onClick={przelacz}
      aria-pressed={pauza}
      aria-label={pauza ? 'Wznów ruch wstęgi realizacji' : 'Zatrzymaj ruch wstęgi realizacji'}
    >
      {pauza ? 'Wznów' : 'Pauza'}
    </button>
  );
}
