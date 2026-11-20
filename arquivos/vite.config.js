import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Uma seção por arquivo: <!-- @secao hero --> no index.html vira o conteúdo de src/sections/hero.html
// (vale dentro das próprias seções: o hero inclui o painel).
const MARCA = /<!--\s*@secao\s+([\w-]+)\s*-->/g;
const inclui = (html) =>
  html.replace(MARCA, (_, nome) => inclui(readFileSync(resolve(import.meta.dirname, `src/sections/${nome}.html`), 'utf8')));
const secoes = () => ({
  name: 'secoes',
  transformIndexHtml: { order: 'pre', handler: inclui },
  handleHotUpdate({ file, server }) {
    if (file.includes('/src/sections/') && file.endsWith('.html')) server.ws.send({ type: 'full-reload' });
  },
});

export default defineConfig({
  plugins: [secoes()],
  // base relativa: o dist/ abre em qualquer pasta da hospedagem, não só na raiz do domínio
  base: './',
  build: { target: 'es2022', assetsInlineLimit: 0 },
});
