// O hero: o balão de pensamento com o céu e o avião de papel dentro.
// Parada, a nuvem pousa na caixa .hero__nuvem. Na rolagem ela cresce (um zoom em volta de um ponto fixo, a escala
// andando em progressão geométrica) até a tela inteira caber dentro do contorno; o filme só desliza até o centro, sem
// escalar (na tela em pé ele também cresce: ali o quadro deitado seria maior que a nuvem). Com o filme em tela cheia, "Nada fica no papel" sobe deitada em perspectiva e some no alto; o
// parágrafo entra por marco e sobe junto com a seção verde, que cobre o filme.
// O recorte é um clip-path: path() refeito a cada quadro (curvas cúbicas da forma.js levadas para a tela): fica
// nítido em qualquer escala e não depende de máscara rasterizada.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forma, caminho, amostra, caixa, dentro } from './forma.js';
import { clamp, faixa, lerp, CELULAR } from './ease.js';

let PARTES = forma();
let BBS = PARTES.map((p) => caixa(amostra(p, 4))); // caixa de cada parte, em coordenadas de desenho
const POLI = amostra(PARTES[0], 6);
const BB = caixa(POLI); // a nuvem sem as bolinhas, em coordenadas de desenho

// trechos da rolagem do hero, em telas (a seção tem 400svh: 3 telas de rolagem com o palco preso)
const T = {
  cresce: [0, 0.85], // a nuvem cresce até cobrir a tela
  veu: [0.55, 0.95], // o véu escurece o céu para a frase branca
  frase: [0.8, 1.9], // "Nada fica no papel" sobe deitada (só com a tela coberta)
  paragrafo: 1.86, // marco: o parágrafo entra
  sobe: 2, // a seção verde começa a subir (cobre tudo em 3)
};
const ANGULO = 34; // inclinação da frase (graus)
const DESLIZE = gsap.parseEase('power2.inOut');

export function criarHero() {
  const secao = document.querySelector('.hero');
  const palco = secao.querySelector('.hero__palco');
  const midia = palco.querySelector('.hero__midia');
  const filme = palco.querySelector('.hero__filme');
  const veu = palco.querySelector('.hero__veu');
  const caixaNuvem = palco.querySelector('.hero__nuvem');
  const texto = palco.querySelector('.hero__texto');
  const crawl = palco.querySelector('.crawl');
  const frase = palco.querySelector('.hero__frase');
  const fraseLinhas = frase.querySelectorAll('.linha__t');
  const video = palco.querySelector('.hero__video');

  let vw = 1, vh = 1, s0 = 1, s1 = 1, t0 = [0, 0], A = [0, 0], F = [0, 0];
  // o filme: tamanho que cobre a tela (fw × fh, na proporção do quadro), posição final centrada e o estado do hero
  let fw = 1, fh = 1, fim = [0, 0], ini = { x: 0, y: 0, z: 1 };
  const foco = (filme.dataset.foco || '0.5 0.5').split(' ').map(Number);
  const still = filme.querySelector('.hero__still');
  let y = 0; // rolagem do hero, em telas
  let ultimo = '';
  let vivo = false; // os marcos só valem depois da abertura
  // a abertura faz a nuvem e as bolinhas nascerem (1 = no lugar)
  const nasce = { nuvem: 1, b1: 1, b2: 1 };

  // A menor escala em que a tela inteira cabe dentro do contorno, com o ponto A da nuvem no centro da tela. Só depende
  // da proporção da tela: em coordenadas de desenho, procura o maior retângulo dessa proporção centrado em A que cabe
  // na nuvem (meia altura hh) e a escala é (altura da tela / 2) / hh. Testa âncoras numa grade e guarda por proporção
  // (a conta antiga, em pixels e a cada refresh, travava a página por 0,6 s no notebook e 4 s no celular).
  const cache = new Map();
  function cobre() {
    const ar = vw / vh;
    const chave = ar.toFixed(3);
    let r = cache.get(chave);
    if (!r) {
      const pts = [];
      const N = 12;
      for (let i = 0; i <= N; i++) {
        const f = i / N - 0.5;
        pts.push([f, -0.5], [f, 0.5], [-0.5, f], [0.5, f]);
      }
      r = { hh: 0, A: [(BB.x0 + BB.x1) / 2, (BB.y0 + BB.y1) / 2] };
      for (let gx = 0.3; gx <= 0.701; gx += 0.067) {
        for (let gy = 0.3; gy <= 0.701; gy += 0.067) {
          const a = [BB.x0 + BB.w * gx, BB.y0 + BB.h * gy];
          if (!dentro(POLI, a[0], a[1])) continue;
          // meia altura em coordenadas de desenho: o retângulo tem (2·ar·hh) × (2·hh)
          const cabe = (hh) => pts.every(([fx, fy]) => dentro(POLI, a[0] + fx * 2 * ar * hh, a[1] + fy * 2 * hh));
          let lo = 0, hi = BB.h / 2;
          if (!cabe(1)) continue;
          for (let k = 0; k < 18; k++) {
            const m = (lo + hi) / 2;
            if (cabe(m)) lo = m; else hi = m;
          }
          if (lo > r.hh) r = { hh: lo, A: a };
        }
      }
      cache.set(chave, r);
    }
    return { s: vh / 2 / r.hh, A: r.A };
  }

  let medida = '';
  function medir() {
    const tam = `${palco.clientWidth}x${palco.clientHeight}`;
    if (tam === medida) return;
    medida = tam;
    PARTES = forma({ acima: CELULAR() });
    BBS = PARTES.map((p) => caixa(amostra(p, 4)));
    vw = palco.clientWidth;
    vh = palco.clientHeight;
    const pr = palco.getBoundingClientRect();
    const r = caixaNuvem.getBoundingClientRect();
    const bx = r.left - pr.left, by = r.top - pr.top;
    s0 = Math.min(r.width / BB.w, r.height / BB.h);
    t0 = [bx + r.width / 2 - (s0 * (BB.x0 + BB.x1)) / 2, by + r.height / 2 - (s0 * (BB.y0 + BB.y1)) / 2];
    // o filme no hero: o avião (foco) pousa no miolo da nuvem. Na tela em pé o quadro deitado ampliado para cobrir
    // seria maior que a nuvem; aí o filme encolhe no hero (z < 1) e volta a cobrir a tela no crescimento
    const W = still.naturalWidth || 1536, H = still.naturalHeight || 1024, ar = W / H;
    fw = Math.max(vw, vh * ar);
    fh = fw / ar;
    filme.style.width = `${fw}px`;
    filme.style.height = `${fh}px`;
    // no fim o filme cobre a tela; na tela em pé (sobra quadro dos lados) o avião fica à vista, a 40% da largura
    fim = [clamp(vw * 0.4 - foco[0] * fw, vw - fw, 0), (vh - fh) / 2];
    const bb = caixa(PARTES.flatMap((p) => amostra(p, 4)).map(([x, y]) => [t0[0] + s0 * x, t0[1] + s0 * y]));
    const z = clamp(Math.max((r.width * 1.75) / fw, bb.w / fw, bb.h / fh), 0, 1);
    ini = {
      z,
      x: clamp(bx + r.width * 0.4 - foco[0] * fw * z, bb.x1 - fw * z, bb.x0),
      y: clamp(by + r.height * 0.42 - foco[1] * fh * z, bb.y1 - fh * z, bb.y0),
    };
    const c = cobre();
    s1 = c.s * 1.05;
    A = c.A;
    const t1 = [vw / 2 - s1 * A[0], vh / 2 - s1 * A[1]];
    const k = s1 / s0;
    // ponto fixo do zoom: o que não sai do lugar enquanto a nuvem vai de (s0, t0) a (s1, t1)
    F = [(t1[0] - k * t0[0]) / (1 - k), (t1[1] - k * t0[1]) / (1 - k)];
    ultimo = '';
  }

  // a trava do filme: a escala e a posição mais perto das pedidas que deixam a caixa das partes visíveis (cada uma na
  // sua escala, recortada pela tela) inteira dentro do filme
  function trava(z, x, yv, s, tx, ty, escalas) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    PARTES.forEach((p, i) => {
      if (escalas[i] <= 0.001) return;
      const c = BBS[i];
      const cx = p.cx ?? 0, cy = p.cy ?? 0;
      x0 = Math.min(x0, tx + s * (cx + (c.x0 - cx) * escalas[i])); x1 = Math.max(x1, tx + s * (cx + (c.x1 - cx) * escalas[i]));
      y0 = Math.min(y0, ty + s * (cy + (c.y0 - cy) * escalas[i])); y1 = Math.max(y1, ty + s * (cy + (c.y1 - cy) * escalas[i]));
    });
    x0 = Math.max(x0, 0); y0 = Math.max(y0, 0); x1 = Math.min(x1, vw); y1 = Math.min(y1, vh);
    if (!(x1 > x0 && y1 > y0)) return { z, x, y: yv };
    const zz = Math.min(1, Math.max(z, (x1 - x0) / fw, (y1 - y0) / fh));
    return { z: zz, x: clamp(x, x1 - fw * zz, x0), y: clamp(yv, y1 - fh * zz, y0) };
  }

  function desenha() {
    const g = faixa(y, ...T.cresce);
    const some = 1 - faixa(g, 0.02, 0.3); // as bolinhas estouram enquanto a nuvem começa a crescer
    const e = g ** 1.35; // devagar enquanto o título sai, depois o mergulho
    const s = s0 * Math.pow(s1 / s0, e);
    const k = s / s0;
    const tx = F[0] + k * (t0[0] - F[0]);
    const ty = F[1] + k * (t0[1] - F[1]);
    const d = g >= 1 ? 'none' : `path('${caminho(PARTES, s, tx, ty, [nasce.nuvem, nasce.b1 * some, nasce.b2 * some])}')`;
    if (d !== ultimo) {
      midia.style.clipPath = d;
      midia.style.webkitClipPath = d;
      ultimo = d;
    }
    // o filme acompanha a nuvem: no hero o avião fica no miolo dela; no fim, cobre a tela centrado. No desktop ele só
    // desliza (z = 1); na tela em pé ele também cresce. A cada quadro, uma trava garante que a borda do filme nunca
    // apareça dentro do recorte (a caixa da nuvem recortada pela tela)
    const dd = DESLIZE(g);
    let z = ini.z * Math.pow(1 / ini.z, dd);
    let x = lerp(ini.x, fim[0], dd), yv = lerp(ini.y, fim[1], dd);
    if (g < 1) {
      // duas travas, só a nuvem e a nuvem com as bolinhas. Enquanto as bolinhas aparecem, vale a com as bolinhas
      // inteira (nada de bolinha cortada pela borda do filme); depois que estouram, ela sai aos poucos (g de 0,3 a
      // 0,6), com cada bolinha valendo como um ponto no centro dela. Tirar as bolinhas da trava de uma vez fazia o
      // filme dar um pulo de ~40 px no começo do mergulho. As duas travas cobrem a nuvem e a mistura é linear em x, y e
      // z: a nuvem segue coberta
      const so = trava(z, x, yv, s, tx, ty, [nasce.nuvem, 0, 0]);
      const t = faixa(g, 0.3, 0.6);
      const w = 1 - t * t * (3 - 2 * t);
      if (w > 0) {
        const ponto = (n) => (n > 0.001 ? Math.max(n * some, 0.002) : 0);
        const com = trava(z, x, yv, s, tx, ty, [nasce.nuvem, ponto(nasce.b1), ponto(nasce.b2)]);
        z = lerp(so.z, com.z, w); x = lerp(so.x, com.x, w); yv = lerp(so.y, com.y, w);
      } else ({ z, x, y: yv } = so);
    }
    filme.style.transform = `translate3d(${x.toFixed(1)}px,${yv.toFixed(1)}px,0) scale(${z.toFixed(4)})`;
    veu.style.opacity = faixa(y, ...T.veu).toFixed(3);

    // a frase deitada: anda ao longo do próprio plano (some no fundo enquanto sobe)
    const c = faixa(y, ...T.frase);
    const ativa = c > 0 && c < 1;
    crawl.style.visibility = ativa ? 'visible' : 'hidden';
    if (ativa) {
      const yy = lerp(vh * 0.95, -vh * 1.05, c);
      crawl.style.transform = `rotateX(${ANGULO}deg) translate3d(0,${yy.toFixed(1)}px,0)`;
      crawl.style.opacity = Math.min(faixa(c, 0, 0.12), 1 - faixa(c, 0.7, 0.96)).toFixed(3);
    }

    // o parágrafo sobe 1:1 com a seção verde
    frase.style.transform = `translate3d(0,${(-Math.max(0, y - T.sobe) * vh).toFixed(1)}px,0)`;

    // filme coberto pela seção verde: pausa
    if (video.currentSrc && !filme.classList.contains('sem-video')) {
      const coberto = y >= T.sobe + 0.99;
      if (coberto && !video.paused) video.pause();
      else if (!coberto && video.paused && vivo) video.play().catch(() => {});
    }
  }

  // marcos de texto (por tempo, nunca preso à rolagem): o título sai quando a rolagem começa; o parágrafo entra
  let tituloFora = false, paragrafoDentro = false;
  function marcos() {
    if (!vivo) return;
    const fora = y > 0.02;
    if (fora !== tituloFora) {
      tituloFora = fora;
      gsap.to(texto, fora
        ? { autoAlpha: 0, y: -0.035 * vh, scale: 0.96, duration: 0.5, ease: 'power2.in', overwrite: true }
        : { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'nb-out', overwrite: true });
    }
    const dentroP = y >= T.paragrafo && y < T.sobe + 1.2;
    if (dentroP !== paragrafoDentro) {
      paragrafoDentro = dentroP;
      if (dentroP) {
        gsap.set(frase, { visibility: 'visible' });
        gsap.fromTo(fraseLinhas, { yPercent: 160 }, { yPercent: 0, duration: 0.95, ease: 'nb-out', stagger: 0.08, overwrite: true });
      } else {
        gsap.to(fraseLinhas, { yPercent: 160, duration: 0.35, ease: 'power2.in', stagger: 0.03, overwrite: true,
          onComplete: () => { if (!paragrafoDentro) gsap.set(frase, { visibility: 'hidden' }); } });
      }
    }
  }

  gsap.set(texto, { transformOrigin: '0% 30%' });
  gsap.set(crawl, { transformOrigin: '50% 100%' });
  medir();
  desenha();

  const st = ScrollTrigger.create({
    trigger: secao,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      y = (self.scroll() - self.start) / vh;
      desenha();
      marcos();
    },
    onRefresh: (self) => {
      medir();
      y = clamp((self.scroll() - self.start) / vh, 0, 9);
      desenha();
    },
  });

  // o vídeo do balão: só baixa quando a abertura começa (a primeira carga fica com a foto). Até tocar, ele mostra o
  // pôster, que é a mesma foto e o 1º quadro do vídeo: o céu começa a andar de onde a foto está, sem troca nem fusão
  // (a fusão por cima da foto parada fazia o céu dar um pulo). Cai na foto com zoom lento se não houver vídeo ou o
  // navegador recusar o autoplay (MP4 para Chrome e Safari, WebM de reserva: o navegador fica com a primeira fonte
  // que consegue tocar)
  const fontes = [...video.querySelectorAll('source[data-src]')];
  let carregado = false;
  const semVideo = () => filme.classList.add('sem-video');
  if (!fontes.length || matchMedia('(prefers-reduced-motion: reduce)').matches) semVideo();
  fontes.at(-1)?.addEventListener('error', semVideo); // nenhuma fonte serviu
  function tocaVideo() {
    if (filme.classList.contains('sem-video')) return;
    if (!carregado) {
      carregado = true;
      fontes.forEach((f) => { f.src = f.dataset.src; });
      video.preload = 'auto';
      video.load();
    }
    video.play().catch(semVideo);
  }

  return {
    nasce,
    midia,
    video,
    pecas: { texto, titulo: texto.querySelector('.hero__titulo'), selo: texto.querySelector('.selo'), sub: texto.querySelector('.hero__sub') },
    redesenha: desenha,
    tocaVideo,
    liga() {
      vivo = true;
      y = (st.scroll() - st.start) / vh;
      marcos();
      tocaVideo();
    },
  };
}
