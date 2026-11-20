// Links internos (#secao): com o Lenis, a rolagem até a seção é animada; perto anda inteira, longe salta para uma
// tela antes e anda o resto (passar por todas as cenas presas em 1 s seria um borrão).
export function ancoras({ lenis }) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const alvo = id ? document.getElementById(id) : document.body;
    if (!alvo) return;
    e.preventDefault();
    const destino = id === 'topo' || !id ? 0 : alvo.getBoundingClientRect().top + scrollY;
    if (!lenis) { scrollTo({ top: destino, behavior: 'smooth' }); return; }
    const distancia = Math.abs(destino - lenis.scroll);
    if (distancia > innerHeight * 2.5) lenis.scrollTo(destino - Math.sign(destino - lenis.scroll) * innerHeight, { immediate: true, force: true });
    lenis.scrollTo(destino, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3), force: true });
    history.replaceState(null, '', id ? `#${id}` : location.pathname);
  });
}
