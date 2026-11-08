// Zrzuty kontrolne strony na 1440 i 390 px (ekran + cała strona).
// Użycie: node scripts/qa-shots.mjs <katalog-wyjściowy> [url] [sufiks]
// Domyślny url to podgląd z `npm run preview`.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [katalog = 'qa', url = 'http://localhost:4173/strony-konin/', sufiks = ''] = process.argv.slice(2);
await mkdir(katalog, { recursive: true });

const WIDOKI = [
  ['1440', { width: 1440, height: 900 }, false],
  ['390', { width: 390, height: 844 }, true],
];

const browser = await chromium.launch();
for (const [nazwa, viewport, mobile] of WIDOKI) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, locale: 'pl-PL' });
  const page = await ctx.newPage();
  const bledy = [];
  page.on('console', (m) => { if (m.type() === 'error') bledy.push(m.text()); });
  page.on('pageerror', (e) => bledy.push(e.message));
  page.on('requestfailed', (q) => bledy.push(`nie wczytano: ${q.url()}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  // przewiń całość, żeby obrazy lazy się wczytały, i poczekaj na dekodowanie
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
    // decode() obrazka lazy poza ekranem nigdy się nie kończy, stąd limit czasu
    const limit = new Promise((r) => setTimeout(r, 1500));
    await Promise.all([...document.images].map((i) => Promise.race([i.decode().catch(() => {}), limit])));
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${katalog}/${nazwa}${sufiks}-ekran.png` });
  await page.screenshot({ path: `${katalog}/${nazwa}${sufiks}-cala.png`, fullPage: true });
  console.log(`${nazwa}${sufiks}: ${bledy.length ? '\n  ' + bledy.join('\n  ') : 'bez błędów w konsoli'}`);
  await ctx.close();
}
await browser.close();
