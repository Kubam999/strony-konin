// Po `vite build` dokłada do dist/ to, czego Vite nie zna: 15 stron demo i politykę prywatności.
import { cpSync, existsSync } from 'node:fs';

const DO_SKOPIOWANIA = ['demo', 'screenshots', 'polityka-prywatnosci.html'];
for (const sciezka of DO_SKOPIOWANIA) {
  if (!existsSync(sciezka)) continue;
  cpSync(sciezka, `dist/${sciezka}`, { recursive: true });
  console.log(`skopiowano ${sciezka} -> dist/${sciezka}`);
}
