import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { BRAND, META_OPIS } from './src/config/site';

// Podstawia nazwę zespołu i opis do index.html, żeby nazwa była tylko w src/config/site.ts.
const marka = (): Plugin => ({
  name: 'marka',
  transformIndexHtml: (html) => html.replaceAll('%BRAND%', BRAND).replaceAll('%OPIS%', META_OPIS),
});

export default defineConfig({
  // Strona działa pod https://kubam999.github.io/strony-konin/
  base: '/strony-konin/',
  plugins: [react(), marka()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
