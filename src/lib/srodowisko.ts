// Pomocnicze sprawdzenia środowiska: ruch ograniczony, telefon, WebGL.

export function ruchOgraniczony(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function waskiEkran(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(max-width: 760px)').matches;
}

export function dotykowy(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(hover: none) and (pointer: coarse)').matches;
}

let webgl: boolean | null = null;
export function maWebGL(): boolean {
  if (webgl !== null) return webgl;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  return webgl;
}

/** Wstęga 3D tylko tam, gdzie ma sens: duży ekran z myszką, WebGL, bez prośby o mniej ruchu. */
export function wstega3D(): boolean {
  return !ruchOgraniczony() && !waskiEkran() && maWebGL();
}
