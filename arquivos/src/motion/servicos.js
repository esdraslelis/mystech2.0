// Serviços: o título sobe por marco quando a seção verde chega; os cards sobem presos à rolagem (lineares), um por
// vez, e empilham à direita, cada um num ângulo, o de trás aparecendo por cima como um maço.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faixa, lerp } from './ease.js';

// onde cada card assenta (y em fração da altura do card, ângulo em graus) e de que ângulo ele vem
const POSE = [
  { y: -0.13, r: 4, de: 12 },
  { y: -0.065, r: -3, de: -10 },
  { y: 0, r: 2.5, de: 11 },
  { y: 0.06, r: -2, de: -9 },
];
// janela de cada card na rolagem, em telas, contando de quando o palco prende no alto (a seção tem 250svh)
const JANELA = [[-0.08, 0.3], [0.3, 0.64], [0.64, 0.98], [0.98, 1.32]];

export function servicos() {
  const secao = document.querySelector('.servicos');
  if (!secao) return;
  const palco = secao.querySelector('.servicos__palco');
  const titulo = secao.querySelectorAll('.servicos__titulo .linha__t');
  const texto = secao.querySelectorAll('.servicos__texto .linha__t');
  const lista = secao.querySelector('.cards');
  const cards = [...secao.querySelectorAll('.card')];
  let vh = 1, ch = 1, topo = 0;

  function medir() {
    vh = palco.clientHeight;
    ch = lista.offsetHeight;
    topo = lista.offsetTop;
  }

  function desenha(y) {
    cards.forEach((c, i) => {
      const p = faixa(y, ...JANELA[i]);
      const de = vh - topo + ch * 0.12; // começa inteiro abaixo da tela
      const yy = lerp(de, POSE[i].y * ch, p);
      const r = lerp(POSE[i].de, POSE[i].r, p);
      c.style.transform = `translate3d(0,${yy.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg)`;
      c.style.visibility = p > 0 ? 'visible' : 'hidden';
    });
  }

  // marcos de texto: o título e o parágrafo sobem quando a seção verde já cobriu boa parte do filme
  let tituloDentro = false, textoDentro = false;
  function marcos(y) {
    const t = y > -0.5;
    if (t !== tituloDentro) {
      tituloDentro = t;
      gsap.to(titulo, t
        ? { yPercent: 0, duration: 1, ease: 'nb-out', overwrite: true }
        : { yPercent: 160, duration: 0.4, ease: 'power2.in', overwrite: true });
    }
    const x = y > -0.3;
    if (x !== textoDentro) {
      textoDentro = x;
      gsap.to(texto, x
        ? { yPercent: 0, duration: 0.9, ease: 'nb-out', stagger: 0.07, overwrite: true }
        : { yPercent: 160, duration: 0.35, ease: 'power2.in', stagger: 0.03, overwrite: true });
    }
  }

  gsap.set(titulo, { yPercent: 160 });
  gsap.set(texto, { yPercent: 160 });
  cards.forEach((c) => { c.style.transformOrigin = '50% 60%'; });
  medir();
  desenha(-1);

  ScrollTrigger.create({
    trigger: secao,
    start: 'top bottom',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const y = (self.scroll() - self.start) / vh - 1; // 0 quando o palco prende no alto
      desenha(y);
      marcos(y);
    },
    onRefresh: (self) => {
      medir();
      const y = (self.scroll() - self.start) / vh - 1;
      desenha(y);
    },
  });
}
