// O cursor da Nubo, no estilo dos botões: uma seta gorda cobalto com contorno claro e o degrau chapado embaixo.
// Sobre o que é clicável ela fica tomate e inclina; no clique afunda até a base, como o botão; onde a ação não é óbvia,
// aparece a etiqueta em pílula ([data-cursor="texto"]: "Quero esse" nos cards, "Arrasta" nas fotos do estúdio).
// Em campo de texto, volta o cursor de texto do sistema. Só com mouse (nada no toque); a seta segue o mouse com um
// pouco de embalo (sem embalo com movimento reduzido). Enquanto a página rola sem o mouse mexer, a etiqueta some
// (o que passa embaixo do cursor parado não "acende").
import { REDUZIDO } from './ease.js';
import { rolando } from './rolando.js';

const CLICAVEL = 'a, button, [role="button"], label, .pilula, .card__link, .seta';
const TEXTO = 'input, textarea, select, [contenteditable]';

export function cursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const html = document.documentElement;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<svg class="cursor__seta" viewBox="0 0 26 32"><path d="M3.5 3.2v21.3c0 .9 1.1 1.4 1.8.8l5-4.6 3.6 8.1c.3.7 1.1 1 1.8.7l2.7-1.2c.7-.3 1-1.1.7-1.8l-3.6-8h6.8c.9 0 1.4-1.1.8-1.8L5.3 2.4c-.7-.6-1.8-.1-1.8.8z"/></svg><span class="cursor__rotulo"></span>`;
  document.body.append(el);
  const rotulo = el.querySelector('.cursor__rotulo');
  html.classList.add('cursor-on');

  let x = -100, y = -100, cx = x, cy = y, visivel = false, raf = 0;
  const segue = REDUZIDO ? 1 : 0.38; // fração do caminho por quadro

  function quadro() {
    cx += (x - cx) * segue;
    cy += (y - cy) * segue;
    el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(quadro) : 0;
  }
  function estado(alvo) {
    const texto = alvo?.closest(TEXTO);
    const etiqueta = alvo?.closest('[data-cursor]')?.dataset.cursor || '';
    const clicavel = !!alvo?.closest(CLICAVEL) || !!etiqueta;
    el.classList.toggle('is-texto', !!texto);
    el.classList.toggle('is-clicavel', clicavel && !texto);
    if (etiqueta && !texto) rotulo.textContent = etiqueta;
    el.classList.toggle('is-rotulo', !!etiqueta && !texto);
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!visivel) { visivel = true; cx = x; cy = y; el.classList.add('is-on'); }
    estado(e.target);
    if (!raf) raf = requestAnimationFrame(quadro);
  }, { passive: true });
  addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') el.classList.add('is-baixo'); }, { passive: true });
  addEventListener('pointerup', () => el.classList.remove('is-baixo'), { passive: true });
  html.addEventListener('mouseleave', () => { visivel = false; el.classList.remove('is-on'); });
  addEventListener('blur', () => { visivel = false; el.classList.remove('is-on'); });
  // rolando com o mouse parado: o que passa embaixo não muda o cursor; a etiqueta sai até o mouse mexer de novo
  rolando.sub((on) => { if (on) el.classList.remove('is-rotulo', 'is-clicavel'); });
}
