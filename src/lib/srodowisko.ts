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

/**
 * Wstęga 3D tylko tam, gdzie ma sens: szeroki ekran, WebGL, bez prośby o mniej ruchu.
 * `?3d=1` wymusza scenę (gdy jest WebGL), `?3d=0` wymusza wersję zastępczą.
 */
export function wstega3D(): boolean {
  const wymus = new URLSearchParams(location.search).get('3d');
  if (wymus === '0') return false;
  if (wymus === '1') return maWebGL();
  return !ruchOgraniczony() && !waskiEkran() && maWebGL();
}
