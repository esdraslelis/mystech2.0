// O guia: o freio da rolagem na roda do mouse e do trackpad. A página sempre rola presa ao gesto e nunca para
// sozinha, mas o alvo da rolagem nunca fica mais que AVANCO telas à frente de onde a página está: por mais forte
// que seja o gesto, a página anda no máximo ~2 telas por segundo e cada cena tem tempo de tocar.
// Toque: a rolagem é a nativa do aparelho, sem freio e sem nada cancelado. (O Lenis chama este filtro também nos
// eventos de toque; cancelar o touchend aqui mataria o clique de todo botão no celular.)

const AVANCO = 0.32; // telas de folga entre o alvo e a página (com o lerp 0,12 do Lenis: ~2 telas/s no máximo)

export function criarGuia({ lenis }) {
  if (!lenis) return null;

  function roda(data) {
    const { deltaY, event } = data;
    if (event.ctrlKey || !deltaY) return true;
    const alvo = lenis.targetScroll;
    const dir = Math.sign(deltaY);
    const lim = lenis.animatedScroll + dir * AVANCO * innerHeight;
    const novo = dir > 0 ? Math.max(alvo, Math.min(alvo + deltaY, lim)) : Math.min(alvo, Math.max(alvo + deltaY, lim));
    data.deltaY = novo - alvo;
    if (Math.abs(data.deltaY) < 0.5) { if (event.cancelable) event.preventDefault(); return false; }
    return true;
  }

  lenis.options.virtualScroll = (data) => (data.event.type.includes('touch') ? true : roda(data));
  return {};
}
