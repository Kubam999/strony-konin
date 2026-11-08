// Zrzuty realizacji do public/realizacje/: miniatura 1200 px, pełna strona do podglądu i widok z telefonu.
// Użycie: npm run zrzuty            (wszystkie)
//         npm run zrzuty gran syk   (tylko wybrane slugi)
// Wymaga Chromium Playwrighta: npx playwright install chromium (raz, na własnym komputerze).
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { REALIZACJE } from '../src/data/realizacje.ts';

const OUT = fileURLToPath(new URL('../public/realizacje/', import.meta.url));
const MAKS_WYSOKOSC_PELNEJ = 4800; // px przy szerokości 900, żeby plik nie urósł bez sensu

const wybrane = process.argv.slice(2);
const lista = wybrane.length ? REALIZACJE.filter((r) => wybrane.includes(r.slug)) : REALIZACJE;
if (!lista.length) {
  console.error('Nie znam takich slugów. Dostępne:', REALIZACJE.map((r) => r.slug).join(', '));
  process.exit(1);
}
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function zamknijCookies(page) {
  const przycisk = page.getByRole('button', { name: /zgadzam|akceptuj|accept|rozumiem|^ok/i }).first();
  if (await przycisk.isVisible().catch(() => false)) {
    await przycisk.click().catch(() => {});
    // komunikat „zapisano ustawienia” musi zdążyć zniknąć
    await page.waitForTimeout(3500);
  }
}

// Przewija stronę do końca i z powrotem, żeby elementy pokazywane przy scrollu zdążyły się pojawić.
async function przewinCalosc(page) {
  await page.evaluate(async () => {
    const krok = Math.max(300, Math.round(innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += krok) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
}

async function zrzut(r) {
  const uwagi = new Set();
  const sledz = (page) => {
    page.on('requestfailed', (q) => uwagi.add(`${new URL(q.url()).host} nie odpowiada`));
    page.on('response', (q) => { if (q.status() >= 400) uwagi.add(`${new URL(q.url()).host} ${q.status()}`); });
  };

  // Desktop: miniatura i pełna strona
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'pl-PL' });
  const page = await ctx.newPage();
  sledz(page);
  await page.goto(r.url, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForTimeout(3500);
  await zamknijCookies(page);
  const ekran = await page.screenshot({ type: 'png' });
  await sharp(ekran).resize({ width: 1200 }).webp({ quality: 82 }).toFile(`${OUT}${r.slug}.webp`);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await przewinCalosc(page);
  const cala = await page.screenshot({ type: 'png', fullPage: true });
  const zmniejszona = sharp(cala).resize({ width: 900 });
  const { height = 0 } = await sharp(await zmniejszona.toBuffer()).metadata();
  const przycieta = height > MAKS_WYSOKOSC_PELNEJ
    ? sharp(await zmniejszona.toBuffer()).extract({ left: 0, top: 0, width: 900, height: MAKS_WYSOKOSC_PELNEJ })
    : zmniejszona;
  await przycieta.webp({ quality: 78 }).toFile(`${OUT}${r.slug}-pelna.webp`);
  await ctx.close();

  // Telefon
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pl-PL' });
  const mpage = await mctx.newPage();
  sledz(mpage);
  await mpage.goto(r.url, { waitUntil: 'load', timeout: 90_000 });
  await mpage.waitForTimeout(3500);
  await zamknijCookies(mpage);
  const telefon = await mpage.screenshot({ type: 'png' });
  await sharp(telefon).webp({ quality: 82 }).toFile(`${OUT}${r.slug}-telefon.webp`);
  await mctx.close();

  console.log(`${r.slug}: gotowe${uwagi.size ? `  (uwaga: ${[...uwagi].join(', ')})` : ''}`);
}

for (const r of lista) {
  try {
    await zrzut(r);
  } catch (e) {
    console.error(`${r.slug}: błąd: ${e.message.split('\n')[0]}`);
    process.exitCode = 1;
  }
}
await browser.close();
