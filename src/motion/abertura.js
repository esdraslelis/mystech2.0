// A abertura (a hero é o carregamento, sem tela de loading): as três linhas do título sobem no meio da tela,
// seguram, e o bloco desliza para o lugar dele à esquerda. Aí o pensamento se forma: a bolinha pequena, a média e a
// nuvem, que abre com o céu dentro; o selo gira para o lugar, o subtítulo sobe e a nav desce. ~3 s.
// Rolar, tocar ou usar o teclado no meio leva direto ao fim e solta a rolagem no mesmo gesto. Com movimento reduzido ou ?pronto, a página abre pronta.
import gsap from 'gsap';
import { alturaTela } from './ease.js';

export function abertura({ lenis, hero }) {
  const html = document.documentElement;
  const nav = document.querySelector('.nav__pilula');
  if (!html.classList.contains('abertura')) {
    hero.liga();
    return;
  }
  lenis?.stop();

  const { texto, titulo, selo, sub } = hero.pecas;
  const linhas = titulo.querySelectorAll('.linha__t');
  const subLinhas = sub.querySelectorAll('.linha__t');

  // o título começa no centro da tela (medido sem transform)
  const r = titulo.getBoundingClientRect();
  const dx = innerWidth / 2 - (r.left + r.width / 2);
  const dy = alturaTela() / 2 - (r.top + r.height / 2);
  gsap.set(texto, { x: dx, y: dy });
  gsap.set(linhas, { yPercent: 160 });
  gsap.set(subLinhas, { yPercent: 160 });
  gsap.set(selo, { scale: 0, rotation: -80 });
  gsap.set(nav, { yPercent: -170 });
  gsap.set(hero.midia, { opacity: 0 });
  Object.assign(hero.nasce, { nuvem: 0, b1: 0, b2: 0 });
  hero.redesenha();
  html.classList.add('abertura-viva');

  const redesenha = hero.redesenha;
  const tl = gsap.timeline({ delay: 0.1, onComplete: fim });
  tl.to(linhas, { yPercent: 0, duration: 0.85, ease: 'nb-out', stagger: 0.08 }, 0)
    .to(texto, { x: 0, y: 0, duration: 0.85, ease: 'nb-io' }, 1.0)
    // o pensamento se forma de quem pensa para fora: bolinha pequena, média, a nuvem
    .to(hero.midia, { opacity: 1, duration: 0.25, ease: 'none' }, 1.62)
    .to(hero.nasce, { b2: 1, duration: 0.45, ease: 'back.out(2.4)', onUpdate: redesenha }, 1.62)
    .to(hero.nasce, { b1: 1, duration: 0.5, ease: 'back.out(2.2)', onUpdate: redesenha }, 1.74)
    .to(hero.nasce, { nuvem: 1, duration: 1, ease: 'back.out(1.3)', onUpdate: redesenha }, 1.86)
    .add(() => hero.tocaVideo(), 1.62)
    .to(selo, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2.1)' }, 1.9)
    .to(subLinhas, { yPercent: 0, duration: 0.8, ease: 'nb-out', stagger: 0.06 }, 1.95)
    .to(nav, { yPercent: 0, duration: 0.85, ease: 'nb-out' }, 2.15);

  // quem já quer rolar não espera: a abertura vai direto ao fim e a rolagem solta no mesmo gesto
  const pula = () => { if (tl.progress() < 1) tl.progress(1); };
  const gatilhos = ['wheel', 'touchstart', 'keydown'];
  gatilhos.forEach((t) => addEventListener(t, pula, { passive: true, once: true }));

  function fim() {
    gatilhos.forEach((t) => removeEventListener(t, pula));
    gsap.set(texto, { clearProps: 'x,y' });
    lenis?.start();
    hero.liga();
  }
}
