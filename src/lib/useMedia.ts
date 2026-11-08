import { useEffect, useState } from 'react';

/** Reaguje na media query, np. useMedia('(max-width: 760px)'). */
export function useMedia(query: string): boolean {
  const [pasuje, setPasuje] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const h = () => setPasuje(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [query]);
  return pasuje;
}
