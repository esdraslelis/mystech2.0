// Rodapé: quando ele chega, as linhas do fecho sobem uma a uma e a pessoa sobe de trás das letras.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function rodape() {
  const el = document.querySelector('.rodape');
  if (!el) return;
  const linhas = el.querySelectorAll('.rodape__nome .linha__t');
  const pessoa = el.querySelector('.rodape__pessoa');
  gsap.set(linhas, { yPercent: 160 });
  gsap.set(pessoa, { yPercent: 40, opacity: 0 });
  ScrollTrigger.create({
    trigger: el.querySelector('.rodape__fecho'),
    start: 'top 94%', // no celular, no fim da página o fecho fica no pé da tela: dispara assim que ele aparece
    onEnter: () => {
      gsap.to(linhas, { yPercent: 0, duration: 1, ease: 'nb-out', stagger: 0.1, overwrite: true });
      gsap.to(pessoa, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'nb-out', delay: 0.25, overwrite: true });
    },
    onLeaveBack: () => {
      gsap.to(linhas, { yPercent: 160, duration: 0.4, ease: 'power2.in', overwrite: true });
      gsap.to(pessoa, { yPercent: 40, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true });
    },
  });
}
