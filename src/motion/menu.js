// O menu: o cartão creme que cai da pílula. Abre e fecha pelo botão, fecha com Esc, com um clique fora e ao
// escolher um link (que rola até a seção).
export function menu({ lenis }) {
  const botao = document.querySelector('.nav__menu');
  const painel = document.getElementById('menu');
  if (!botao || !painel) return;

  const aberto = () => botao.getAttribute('aria-expanded') === 'true';
  function abre(v) {
    botao.setAttribute('aria-expanded', String(v));
    botao.setAttribute('aria-label', v ? 'Fechar o menu' : 'Abrir o menu');
    painel.hidden = !v;
    if (v) painel.querySelector('a')?.focus({ preventScroll: true });
  }
  botao.addEventListener('click', () => abre(!aberto()));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aberto()) { abre(false); botao.focus(); }
  });
  addEventListener('pointerdown', (e) => {
    if (aberto() && !painel.contains(e.target) && !botao.contains(e.target)) abre(false);
  });
  painel.addEventListener('click', (e) => {
    if (e.target.closest('a')) abre(false);
  });
}
