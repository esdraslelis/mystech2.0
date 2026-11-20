// A forma da Nubo: o balão de pensamento (a nuvem de bolhas e as duas bolinhas que descem até quem pensa).
// É o recorte do hero, o recorte do painel do estúdio e o símbolo do logo. Fica em coordenadas de desenho (a nuvem
// cabe em ~1000 × 760, centro em 0,0, y para baixo) e vira curvas cúbicas, que um transform de escala e translação
// leva para a tela sem perder a forma (clip-path: path() recebe px).

// bolhas da nuvem [x, y, raio]; a ordem não importa, o contorno ordena pelo ângulo
export const NUVEM = [
  [-250, -200, 240],
  [150, -250, 260],
  [395, -40, 215],
  [275, 205, 205],
  [-10, 265, 215],
  [-300, 200, 200],
  [-430, 0, 195],
];
// as bolinhas do pensamento, da maior para a menor, descendo para a esquerda
export const BOLINHAS = [
  [-610, 430, 70],
  [-748, 556, 40],
];

const TAU = Math.PI * 2;

function centro(circs) {
  let x = 0, y = 0;
  for (const [cx, cy] of circs) { x += cx; y += cy; }
  return [x / circs.length, y / circs.length];
}

// as duas interseções de dois círculos; devolve a mais afastada de g (a de fora do contorno)
function cruza([x1, y1, r1], [x2, y2, r2], g) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const px = x1 + (a * dx) / d, py = y1 + (a * dy) / d;
  const p = [px + (h * -dy) / d, py + (h * dx) / d];
  const q = [px - (h * -dy) / d, py - (h * dx) / d];
  return Math.hypot(p[0] - g[0], p[1] - g[1]) > Math.hypot(q[0] - g[0], q[1] - g[1]) ? p : q;
}

// arco de círculo em cúbicas (trechos de até 90°), no sentido do ângulo crescente (horário na tela)
function arco(cx, cy, r, a0, delta, curvas) {
  const n = Math.max(1, Math.ceil(delta / (Math.PI / 2) - 1e-6));
  const passo = delta / n, k = (4 / 3) * Math.tan(passo / 4);
  for (let i = 0; i < n; i++) {
    const t0 = a0 + passo * i, t1 = t0 + passo;
    const c0 = Math.cos(t0), s0 = Math.sin(t0), c1 = Math.cos(t1), s1 = Math.sin(t1);
    curvas.push([
      cx + r * (c0 - k * s0), cy + r * (s0 + k * c0),
      cx + r * (c1 + k * s1), cy + r * (s1 - k * c1),
      cx + r * c1, cy + r * s1,
    ]);
  }
}

/** contorno de fora de uma roda de bolhas: { m: [x, y], c: [[x1, y1, x2, y2, x, y], ...] } */
export function contorno(circs) {
  const g = centro(circs);
  const roda = [...circs].sort((a, b) => Math.atan2(a[1] - g[1], a[0] - g[0]) - Math.atan2(b[1] - g[1], b[0] - g[0]));
  const n = roda.length;
  const pontos = roda.map((c, i) => cruza(c, roda[(i + 1) % n], g)); // pontos[i]: entre a bolha i e a seguinte
  const curvas = [];
  for (let i = 0; i < n; i++) {
    const [cx, cy, r] = roda[i];
    const ent = pontos[(i - 1 + n) % n], sai = pontos[i];
    const a0 = Math.atan2(ent[1] - cy, ent[0] - cx);
    let delta = (Math.atan2(sai[1] - cy, sai[0] - cx) - a0) % TAU;
    if (delta <= 0) delta += TAU;
    arco(cx, cy, r, a0, delta, curvas);
  }
  const ultimo = curvas[curvas.length - 1];
  return { m: [ultimo[4], ultimo[5]], c: curvas };
}

export function circulo(cx, cy, r) {
  const curvas = [];
  arco(cx, cy, r, -Math.PI / 2, TAU, curvas);
  return { m: [cx, cy - r], c: curvas };
}

const num = (v) => Math.round(v * 10) / 10;

/** o caminho na tela: cada parte escalada por s e deslocada por (tx, ty); escalas[i] encolhe a parte i no próprio centro */
export function caminho(partes, s, tx, ty, escalas) {
  let d = '';
  partes.forEach((p, i) => {
    const e = escalas ? escalas[i] : 1;
    if (e <= 0.001) return;
    const ox = p.cx ?? 0, oy = p.cy ?? 0;
    const X = (x) => num(tx + s * (ox + (x - ox) * e));
    const Y = (y) => num(ty + s * (oy + (y - oy) * e));
    d += `M${X(p.m[0])} ${Y(p.m[1])}`;
    for (const c of p.c) d += `C${X(c[0])} ${Y(c[1])} ${X(c[2])} ${Y(c[3])} ${X(c[4])} ${Y(c[5])}`;
    d += 'Z';
  });
  return d;
}

/** polígono de amostra do contorno (para saber se um ponto está dentro) */
export function amostra(parte, passos = 12) {
  const pts = [];
  let [x0, y0] = parte.m;
  for (const [x1, y1, x2, y2, x3, y3] of parte.c) {
    for (let i = 1; i <= passos; i++) {
      const t = i / passos, u = 1 - t;
      pts.push([
        u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      ]);
    }
    x0 = x3; y0 = y3;
  }
  return pts;
}

export function dentro(poli, x, y) {
  let d = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i], [xj, yj] = poli[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
}

/** caixa de um polígono */
export function caixa(poli) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of poli) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

/** as partes da forma: a nuvem e as bolinhas (cada uma sabe o próprio centro, para encolher no lugar).
 *  acima: as bolinhas saem do alto da nuvem (no celular, quem pensa fica em cima dela) */
export function forma({ acima = false } = {}) {
  const nuvem = contorno(NUVEM);
  const g = centro(NUVEM);
  return [
    { ...nuvem, cx: g[0], cy: g[1] },
    ...BOLINHAS.map(([x, y, r]) => (acima ? [x + 260, -y - 70, r * 0.8] : [x, y, r])).map(([x, y, r]) => ({ ...circulo(x, y, r), cx: x, cy: y })),
  ];
}
