// Estúdio: o título sobe por marco; as fotos entram em fila quando a seção chega; as setas andam uma foto por vez
// (e apagam na ponta). A fila em si é rolagem lateral nativa, com encaixe por foto.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function estudio() {
  const secao = document.querySelector('.estudio');
  if (!secao) return;
  const titulo = secao.querySelectorAll('.estudio__titulo .linha__t');
  const fila = secao.querySelector('.estudio__fila');
  const fotos = [...secao.querySelectorAll('.foto')];
  const [volta, vai] = secao.querySelectorAll('.seta');

  gsap.set(titulo, { yPercent: 160 });
  gsap.set(fotos, { y: 60, opacity: 0 });
  ScrollTrigger.create({
    trigger: secao,
    start: 'top 70%',
    onEnter: () => {
      gsap.to(titulo, { yPercent: 0, duration: 1, ease: 'nb-out', overwrite: true });
      gsap.to(fotos, { y: 0, opacity: 1, duration: 0.9, ease: 'nb-out', stagger: 0.07, delay: 0.15, overwrite: true });
    },
    onLeaveBack: () => {
      gsap.to(titulo, { yPercent: 160, duration: 0.4, ease: 'power2.in', overwrite: true });
      gsap.to(fotos, { y: 60, opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: true });
    },
  });

  // anda até a próxima foto que ainda não começou (ou a anterior), contando da margem
  function anda(dir) {
    const margem = parseFloat(getComputedStyle(fila).scrollPaddingInlineStart) || 0;
    const x = fila.scrollLeft + margem;
    const inicios = fotos.map((f) => f.offsetLeft);
    const alvo = dir > 0 ? inicios.find((v) => v > x + 4) : [...inicios].reverse().find((v) => v < x - 4);
    fila.scrollTo({ left: (alvo ?? (dir > 0 ? fila.scrollWidth : 0)) - margem, behavior: 'smooth' });
  }
  function pontas() {
    volta.disabled = fila.scrollLeft < 4;
    vai.disabled = fila.scrollLeft > fila.scrollWidth - fila.clientWidth - 4;
  }
  // arrastar com o mouse (o dedo e o trackpad já rolam a fila nativos); sem encaixe durante o arrasto, que volta ao soltar
  let arrasto = null;
  fila.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrasto = { x: e.clientX, s: fila.scrollLeft };
    fila.setPointerCapture(e.pointerId);
    fila.classList.add('is-arrastando');
  });
  fila.addEventListener('pointermove', (e) => { if (arrasto) fila.scrollLeft = arrasto.s - (e.clientX - arrasto.x); });
  const solta = () => { if (!arrasto) return; arrasto = null; fila.classList.remove('is-arrastando'); };
  fila.addEventListener('pointerup', solta);
  fila.addEventListener('pointercancel', solta);
  volta.addEventListener('click', () => anda(-1));
  vai.addEventListener('click', () => anda(1));
  fila.addEventListener('scroll', pontas, { passive: true });
  fila.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); anda(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); anda(-1); }
  });
  addEventListener('resize', pontas);
  pontas();
}
