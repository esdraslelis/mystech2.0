// O CSS não entra por aqui: vem em <link> no index.html (importado pelo JS, a página aparecia crua no recarregamento).
window.__nubo = true; // avisa a trava do index.html que o JS subiu (senão a abertura cai em 4 s)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REDUZIDO } from './motion/ease.js';
import { criarScroll } from './motion/smooth.js';
import { criarGuia } from './motion/guia.js';
import { scrollbar } from './motion/scrollbar.js';
import './motion/rolando.js';
import { justifica } from './motion/justifica.js';
import { criarHero } from './motion/hero.js';
import { abertura } from './motion/abertura.js';
import { servicos } from './motion/servicos.js';
import { jeito } from './motion/jeito.js';
import { estudio } from './motion/estudio.js';
import { contato } from './motion/contato.js';
import { rodape } from './motion/rodape.js';
import { menu } from './motion/menu.js';
import { ancoras } from './motion/ancoras.js';
import { cursor } from './motion/cursor.js';

// nada transiciona do estilo de antes do CSS: as transições voltam depois do primeiro quadro pintado
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('assentou')));
if (location.hash === '') scrollTo(0, 0);

// botões: o rótulo vira um span, que inclina no hover
for (const b of document.querySelectorAll('.botao')) {
  if (!b.querySelector('.botao__txt')) b.innerHTML = `<span class="botao__txt">${b.innerHTML}</span>`;
}

const lenis = criarScroll();
if (import.meta.env.DEV) {
  window.__lenis = lenis; // auditoria headless
  if (window.__lento) gsap.globalTimeline.timeScale(window.__lento); // quadros da abertura em câmera lenta
}
criarGuia({ lenis });
scrollbar({ lenis });
menu({ lenis });
ancoras({ lenis });
cursor();

// os blocos justificados e o hero precisam da fonte de verdade para medir (com teto de 1,5 s)
const titulo = getComputedStyle(document.documentElement);
const familia = titulo.getPropertyValue('--titulo').split(',')[0].trim();
const fonte = Promise.race([
  Promise.all([
    document.fonts.load(`${titulo.getPropertyValue('--titulo-peso').trim() || 400} 100px ${familia}`),
    document.fonts.load('600 20px "Bricolage Grotesque Variable"'),
  ]),
  new Promise((r) => setTimeout(r, 1500)),
]);
fonte.then(() => {
  justifica();
  const hero = criarHero();
  servicos();
  jeito();
  estudio();
  contato();
  rodape();
  abertura({ lenis, hero });
  ScrollTrigger.refresh();
  lenis?.resize();
  // movimento reduzido: sem abertura (index.html), e as entradas por marco viram troca seca; o que segue a rolagem
  // continua seguindo o gesto da pessoa
  if (REDUZIDO) gsap.globalTimeline.timeScale(1000);
});
