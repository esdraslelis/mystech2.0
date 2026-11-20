// Contato: o título sobe por marco; o formulário valida no envio (nome, e-mail e mensagem), mostra o erro no campo e,
// sem servidor, simula o envio e mostra o "Valeu!". O card de serviço clicado já marca a pílula certa.
// Para receber de verdade, troque o envio simulado (ENVIA) por um fetch ao serviço de formulários (ver o guia).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ENVIA = (dados) => new Promise((r) => setTimeout(() => r(dados), 900));

export function contato() {
  const secao = document.querySelector('.contato');
  if (!secao) return;
  const titulo = secao.querySelectorAll('.contato__titulo .linha__t');
  const form = secao.querySelector('.form');
  const ok = form.querySelector('.form__ok');
  const enviar = form.querySelector('.form__enviar');

  gsap.set(titulo, { yPercent: 160 });
  ScrollTrigger.create({
    trigger: secao,
    start: 'top 70%',
    onEnter: () => gsap.to(titulo, { yPercent: 0, duration: 1, ease: 'nb-out', stagger: 0.08, overwrite: true }),
    onLeaveBack: () => gsap.to(titulo, { yPercent: 160, duration: 0.4, ease: 'power2.in', overwrite: true }),
  });

  // o card clicado em Serviços marca o serviço no formulário
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-servico]');
    if (!card) return;
    const r = form.querySelector(`input[name="servico"][value="${card.dataset.servico}"]`);
    if (r) r.checked = true;
  });

  const regras = {
    nome: (v) => (v.trim() ? '' : 'Conta pra gente seu nome.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Esse e-mail não parece completo.'),
    mensagem: (v) => (v.trim().length >= 10 ? '' : 'Escreve um pouco mais sobre a ideia.'),
  };
  function confere(campo) {
    const regra = regras[campo.name];
    if (!regra) return true;
    const erro = regra(campo.value);
    const caixa = campo.closest('.campo');
    caixa.classList.toggle('tem-erro', !!erro);
    campo.setAttribute('aria-invalid', erro ? 'true' : 'false');
    caixa.querySelector('.campo__erro').textContent = erro;
    return !erro;
  }
  // depois do primeiro erro, o campo confere enquanto a pessoa digita
  form.addEventListener('input', (e) => { if (e.target.closest('.tem-erro')) confere(e.target); });
  form.addEventListener('focusout', (e) => { if (e.target.value && regras[e.target.name]) confere(e.target); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const campos = ['nome', 'email', 'mensagem'].map((n) => form.elements[n]);
    const validos = campos.map(confere);
    const primeiro = campos[validos.indexOf(false)];
    if (primeiro) { primeiro.focus(); return; }
    enviar.classList.add('is-enviando');
    enviar.querySelector('.botao__txt').textContent = 'Enviando…';
    await ENVIA(Object.fromEntries(new FormData(form)));
    enviar.classList.remove('is-enviando');
    enviar.querySelector('.botao__txt').textContent = 'Enviar';
    ok.hidden = false;
    gsap.fromTo(ok.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'nb-out', stagger: 0.08 });
    ok.querySelector('.form__denovo').focus({ preventScroll: true });
  });
  ok.querySelector('.form__denovo').addEventListener('click', () => {
    form.reset();
    ok.hidden = true;
    form.elements.nome.focus({ preventScroll: true });
  });
}
