import { REALIZACJE } from '../../data/realizacje';
import './WstegaMobilna.css';

const BASE = import.meta.env.BASE_URL;

/** Lżejsza wersja wstęgi bez WebGL: przewijana palcem taśma kafli z lekką perspektywą CSS. */
export default function WstegaMobilna() {
  return (
    <div className="tasma" aria-label="Realizacje, przewijana lista">
      <ul className="tasma__lista" role="list">
        {REALIZACJE.map((r, i) => (
          <li className="tasma__kafel" key={r.slug}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.nazwa}, ${r.branza}, otwórz stronę`}>
              <img
                src={`${BASE}realizacje/${r.slug}.webp`}
                alt=""
                width={1200}
                height={750}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ background: r.kolor }}
              />
              <span className="tasma__podpis">
                <strong>{r.nazwa}</strong> {r.branza}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
