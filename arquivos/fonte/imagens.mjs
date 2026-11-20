// Prepara as fotos do site a partir de PNGs em arquivos/fonte/bruto/ (rode da raiz do projeto, com `npm install -D sharp`):
//   node arquivos/fonte/imagens.mjs
// Nomes esperados (só os que existirem são convertidos):
//   retrato-1.png … retrato-4.png  pessoas em fundo liso; sem fundo transparente, no macOS são recortadas pelo
//                                  recorta.swift (Vision); em outro sistema, mande já recortadas (PNG com transparência)
//   time.png                       a foto do time (paisagem 3:2), recortada pela nuvem no painel tomate
//   estudio-1.png … estudio-6.png  o escritório: 1, 3, 5 e 6 deitadas (3:2); 2 e 4 em pé (2:3)
//   aviao.png                      o quadro parado do balão do hero (o 1º quadro do vídeo, se houver vídeo)
//   aviaozinho.png                 o objeto do balão sozinho (na demo, o avião de papel), em fundo liso ou já
//                                  recortado: voa na faixa de Nosso jeito; recortado como os retratos
// Saída: public/img/*.webp nos tamanhos que o site usa.
import { existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const bruto = 'arquivos/fonte/bruto', recortes = 'arquivos/fonte/recortes', saida = 'public/img';
mkdirSync(recortes, { recursive: true });
mkdirSync(saida, { recursive: true });

const RECORTADOS = { 'retrato-1': { height: 1100 }, 'retrato-2': { height: 1100 }, 'retrato-3': { height: 1100 }, 'retrato-4': { height: 1100 }, aviaozinho: { width: 420 } };
for (const [n, tamanho] of Object.entries(RECORTADOS)) {
  const png = `${bruto}/${n}.png`;
  if (!existsSync(png)) continue;
  let fonte = png;
  const { hasAlpha } = await sharp(png).metadata();
  if (!hasAlpha && process.platform === 'darwin') {
    fonte = `${recortes}/${n}.png`;
    execFileSync('swift', ['arquivos/fonte/recorta.swift', png, fonte], { stdio: 'inherit' });
  } else if (!hasAlpha) {
    console.log(`${n}: sem fundo transparente e fora do macOS; recorte antes (removedor de fundo) e rode de novo`);
    continue;
  }
  await sharp(fonte).trim({ threshold: 1 }).resize({ ...tamanho, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 }).toFile(`${saida}/${n}.webp`);
  console.log(`ok ${saida}/${n}.webp`);
}
for (const [n, largura] of [['time', 1400], ['estudio-1', 1200], ['estudio-2', 760], ['estudio-3', 1200], ['estudio-4', 760], ['estudio-5', 1200], ['estudio-6', 1200], ['aviao', 1920]]) {
  const png = `${bruto}/${n}.png`;
  if (!existsSync(png)) continue;
  await sharp(png).resize({ width: largura, withoutEnlargement: true }).webp({ quality: n === 'aviao' ? 86 : 80 }).toFile(`${saida}/${n}.webp`);
  console.log(`ok ${saida}/${n}.webp`);
}
