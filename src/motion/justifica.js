// Bloco justificado (o título do hero, a frase em perspectiva, o nome do rodapé): cada .linha de um [data-justifica]
// ganha o font-size que faz a palavra ocupar a largura inteira do bloco, como um letreiro montado à mão. O CSS já
// nasce com os tamanhos do texto da demo; aqui eles são medidos de novo com a fonte carregada (e a cada mudança de
// largura), então trocar o texto continua dando um bloco reto.
export function justifica(raiz = document) {
  const blocos = [...raiz.querySelectorAll('[data-justifica]')];
  const ajusta = () => {
    for (const b of blocos) {
      const largura = b.clientWidth;
      if (!largura) continue;
      const teto = parseFloat(b.dataset.justifica) * largura || Infinity; // palavra curta não vira letreiro
      for (const l of b.querySelectorAll(':scope > .linha')) {
        const t = l.querySelector('.linha__t');
        const w = t?.offsetWidth; // largura de layout: ignora o transform da entrada e a perspectiva
        if (!w) continue;
        const fs = parseFloat(getComputedStyle(l).fontSize);
        l.style.setProperty('--fs', `${Math.min(teto, (fs * largura) / w).toFixed(2)}px`);
      }
    }
  };
  ajusta();
  const ro = new ResizeObserver(() => ajusta());
  blocos.forEach((b) => ro.observe(b));
  return ajusta;
}
