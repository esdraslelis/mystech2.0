// Nosso jeito: a seção prende no alto e a rolagem vertical anda a faixa de lado, contínua e presa ao gesto (scroll
// lateral comum, sem parada). O título entra por marco quando a seção sobe; a frase de abertura e o texto de cada
// painel entram por marco quando passam do meio da tela e saem se a pessoa volta. Cada forma anda um pouco mais devagar
// que o painel (profundidade leve).
// O aviãozinho (o mesmo avião de papel do balão do topo) entra pela esquerda quando a faixa começa a andar, voa junto
// e, quando o último painel entra, acelera, sobe e sai pela direita. No caminho, deriva devagar para a frente e sobe e
// desce de leve, preso à rolagem. Por cima disso, uma mola
// leva a velocidade: quanto mais rápida a rolagem, mais ele avança e baixa o bico, e volta quando ela para; rolando
// para trás, ele vira e voa para o outro lado; parado, flutua. Com movimento reduzido, fica só o caminho.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CELULAR, REDUZIDO, clamp, faixa, lerp } from './ease.js';

export function jeito() {
  const secao = document.querySelector('.jeito');
  if (!secao) return;
  const trilho = secao.querySelector('.jeito__trilho');
  const titulo = secao.querySelectorAll('.jeito__titulo .linha__t');
  const blocos = [secao.querySelector('.jeito__entrada'), ...secao.querySelectorAll('.painel')].map((el) => ({
    el,
    linhas: el.querySelectorAll('.linha__t'),
    formas: el.querySelectorAll('.painel__capsula, .painel__nuvem, .painel__circulo, .painel__recorte'),
    dentro: false,
  }));
  const aviao = secao.querySelector('.jeito__aviao');
  const voo = aviao ? criaVoo(aviao) : null;
  let percurso = 0;
  const medir = () => { percurso = Math.max(0, trilho.scrollWidth - innerWidth); };
  // quanto de rolagem vertical por px de faixa: no celular a tela é estreita, cada painel pede mais rolagem
  const fator = () => (CELULAR() ? 1.5 : 0.62);

  gsap.set(titulo, { yPercent: 160 });
  blocos.forEach((b) => gsap.set(b.linhas, { yPercent: 160 }));

  ScrollTrigger.create({
    trigger: secao,
    start: 'top 62%',
    onEnter: () => gsap.to(titulo, { yPercent: 0, duration: 1, ease: 'nb-out', stagger: 0.08, overwrite: true }),
    onLeaveBack: () => gsap.to(titulo, { yPercent: 160, duration: 0.4, ease: 'power2.in', overwrite: true }),
  });

  function marcos(p) {
    const vw = innerWidth;
    for (const b of blocos) {
      const x = b.el.offsetLeft - p * percurso;
      // forma com profundidade: atrasa até 7% da tela enquanto o painel atravessa
      if (b.formas.length) {
        const atraso = gsap.utils.clamp(-1, 1, x / vw) * vw * 0.07;
        b.formas.forEach((f) => { f.style.transform = `translate3d(${atraso.toFixed(1)}px,0,0)`; });
      }
      const dentro = b.dentro ? x < vw * 0.85 : x < vw * 0.55;
      if (dentro === b.dentro) continue;
      b.dentro = dentro;
      gsap.to(b.linhas, dentro
        ? { yPercent: 0, duration: 0.9, ease: 'nb-out', stagger: 0.07, overwrite: true }
        : { yPercent: 160, duration: 0.35, ease: 'power2.in', stagger: 0.02, overwrite: true });
    }
  }

  // o título segura um pouco no centro antes de a faixa andar; depois, 1 px de rolagem anda
  // 1/fator px de faixa
  const segura = () => innerHeight * 0.3;
  let p = 0;
  function desenha(self) {
    const d = self.scroll() - self.start;
    p = gsap.utils.clamp(0, 1, (d - segura()) / Math.max(1, percurso * fator()));
    trilho.style.transform = `translate3d(${(-p * percurso).toFixed(1)}px,0,0)`;
    marcos(p);
    voo?.posiciona(p, percurso);
  }
  medir();
  ScrollTrigger.create({
    trigger: secao,
    start: 'top top',
    end: () => { medir(); return `+=${percurso * fator() + segura()}`; },
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: desenha,
    onRefresh: (self) => { voo?.medir(); desenha(self); },
    onToggle: (self) => voo?.liga(self.isActive),
  });
  marcos(0);
}

// o voo do aviãozinho: o caminho sai do progresso da faixa (p, 0 a 1). A entrada é por tempo, como os textos: quando a
// faixa começa a andar, ele entra voando pela esquerda em 1,2 s, em qualquer velocidade de rolagem (presa à rolagem,
// numa rolagem rápida ele cruzava a tela em 0,2 s); de volta ao começo, sai por onde veio. A mola, a virada e a
// flutuação também andam por tempo, num ticker que só roda enquanto a seção está presa (e até tudo assentar)
function criaVoo(el) {
  let p = 0, pAnt = 0, total = 1, w = el.offsetWidth || 200;
  let vel = 0, lead = 0, vLead = 0, dir = 1, ativo = false, rodando = false, antes = 0, dentro = false, fora = false;
  const giro = { v: 0 }; // 0: bico para a direita; 1: virado para a esquerda
  const entrada = { v: 0 }; // 0: fora da tela, à esquerda; 1: no caminho
  const saida = { v: 0 }; // 0: no caminho; 1: saiu pela direita, mais alto e mais longe

  function entra() {
    const quer = p > 0.004;
    if (quer === dentro) return;
    dentro = quer;
    if (REDUZIDO) { entrada.v = quer ? 1 : 0; return; }
    gsap.to(entrada, quer
      ? { v: 1, duration: 1.2, ease: 'power3.out', overwrite: true }
      : { v: 0, duration: 0.6, ease: 'power2.in', overwrite: true });
    acorda();
  }

  // no fim da faixa (o último painel entrando), ele acelera, sobe e sai pela direita; se a pessoa volta, ele volta por
  // onde saiu (já virado, porque a rolagem inverteu). A folga entre 0,86 e 0,9 evita ir e voltar no limite
  function sai() {
    const quer = fora ? p > 0.86 : p > 0.9;
    if (quer === fora) return;
    fora = quer;
    if (REDUZIDO) { saida.v = quer ? 1 : 0; return; }
    gsap.to(saida, quer
      ? { v: 1, duration: 1.3, ease: 'power2.in', overwrite: true }
      : { v: 0, duration: 0.9, ease: 'power2.out', overwrite: true });
    acorda();
  }

  function acorda() {
    if (rodando || REDUZIDO) return;
    antes = performance.now() / 1000;
    pAnt = p;
    rodando = true;
    gsap.ticker.add(quadro);
  }

  function caminho() {
    const vw = innerWidth;
    const cel = CELULAR();
    const x0 = (cel ? 0.06 : 0.16) * vw, x1 = (cel ? 0.5 : 0.3) * vw;
    const entra = entrada.v;
    const x = lerp(-w * 1.3, x0, entra) + (x1 - x0) * p;
    // uma onda e meia ao longo da faixa; entra um pouco mais baixo e sobe para a linha
    const fase = Math.PI * 2 * 1.5 * p;
    const y = Math.sin(fase) * w * (cel ? 0.045 : 0.06) + (1 - entra) * w * 0.12;
    // a saída: do caminho até além da borda direita, subindo (no celular, pouco: o rosto do último painel fica acima).
    // Por tempo numa rolagem calma; numa rápida, a rolagem empurra o resto (a rampa do último 10% da faixa), para ele
    // nunca ficar para trás e subir junto com a seção quando ela solta
    const s = Math.max(saida.v, faixa(p, 0.9, 1) ** 1.6);
    return { x: lerp(x, vw + w * 0.4, s), y: y - s * w * (cel ? 0.4 : 0.5), inclina: Math.cos(fase), sobe: s };
  }

  function pinta(t) {
    const { x, y, inclina, sobe } = caminho();
    const cel = CELULAR();
    const vivo = !REDUZIDO;
    // flutua parado e a mola empurra no sentido do voo
    const flut = vivo ? Math.sin((t * Math.PI * 2) / 3.4) : 0;
    const dx = vivo ? lead * w * 0.22 : 0;
    const dy = vivo ? flut * w * (cel ? 0.012 : 0.02) + Math.abs(lead) * w * 0.05 : 0;
    // bico (no referencial do avião, negativo = para cima): segue a onda no sentido do voo, baixa quando a rolagem
    // empurra e balança de leve parado
    const bico = 3.5 * inclina * dir + (vivo ? lead * dir * 4 + Math.cos((t * Math.PI * 2) / 3.4 + 1) * 0.8 : 0) - sobe * 7;
    el.style.transform = `translate3d(${(x + dx).toFixed(1)}px,${(y + dy).toFixed(1)}px,0) perspective(900px) rotateY(${(giro.v * 180).toFixed(1)}deg) rotate(${bico.toFixed(2)}deg) scale(${(1 - sobe * 0.15).toFixed(3)})`;
  }

  function quadro() {
    const agora = performance.now() / 1000;
    const dt = clamp(agora - antes, 0.001, 0.05);
    antes = agora;
    // velocidade da faixa em px/s, alisada
    const v = ((p - pAnt) * total) / dt;
    pAnt = p;
    vel += (v - vel) * (1 - Math.exp(-dt * 8));
    // vira quando a rolagem muda de sentido de verdade (com folga, para não piscar)
    const quer = vel > 160 ? 1 : vel < -160 ? -1 : dir;
    if (quer !== dir) {
      dir = quer;
      gsap.to(giro, { v: dir < 0 ? 1 : 0, duration: 0.55, ease: 'power2.inOut', overwrite: true });
    }
    // mola com um pouco de embalo (passa um tico e volta)
    const alvo = clamp(vel / 2200, -1, 1);
    vLead += ((alvo - lead) * 70 - vLead * 10) * dt;
    lead += vLead * dt;
    pinta(agora);
    const assentou = Math.abs(lead) < 0.002 && Math.abs(vLead) < 0.002 && Math.abs(vel) < 5;
    if (!ativo && assentou && !gsap.isTweening(entrada) && !gsap.isTweening(saida) && !gsap.isTweening(giro)) {
      gsap.ticker.remove(quadro);
      rodando = false;
    }
  }

  if (import.meta.env.DEV) window.__voo = () => ({ p, vel: Math.round(vel), lead: +lead.toFixed(3), dir, ativo, rodando, entrada: +entrada.v.toFixed(3) });
  return {
    medir() { w = el.offsetWidth || w; },
    posiciona(np, nt) {
      p = np;
      total = nt || 1;
      entra();
      sai();
      if (!rodando) pinta(performance.now() / 1000);
    },
    liga(on) {
      ativo = on;
      if (on) acorda();
    },
  };
}
