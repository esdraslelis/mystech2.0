// Refaz o símbolo da marca (o balão de pensamento) depois de mudar a forma em src/motion/forma.js (NUVEM e BOLINHAS).
// Rode da raiz do projeto: node arquivos/fonte/marca.mjs
// Grava public/favicon.svg e imprime o caminho (d="...") para colar no <svg class="marca"> da nav, do menu e do rodapé.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { forma, caminho, amostra, caixa } = await import(pathToFileURL(resolve('src/motion/forma.js')).href);
const partes = forma();
const bb = caixa(partes.flatMap((p) => amostra(p)));
const L = 100; // o símbolo cabe num quadrado de 100
const s = L / Math.max(bb.w, bb.h);
const tx = (L - bb.w * s) / 2 - bb.x0 * s, ty = (L - bb.h * s) / 2 - bb.y0 * s;
const d = caminho(partes, s, tx, ty);
// as cores do favicon: o círculo na cor do título (--titulo-cor) e o balão no claro (--claro) do tokens.css
const [circulo, balao] = ['#2340e0', '#fffaf0'];
writeFileSync('public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 136 136"><circle cx="50" cy="50" r="68" fill="${circulo}"/><path fill="${balao}" d="${d}"/></svg>\n`);
console.log(`public/favicon.svg refeito. Caminho para o <svg class="marca" viewBox="0 0 100 100">:\n${d}`);
