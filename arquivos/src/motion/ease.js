// Curvas da marca e o que a página sabe do aparelho.
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// as mesmas do tokens.css: saída longa e macia, entrada seca, ida e volta para os deslizes
CustomEase.create('nb-out', '0.22, 1, 0.36, 1');
CustomEase.create('nb-in', '0.64, 0, 0.78, 0');
CustomEase.create('nb-io', '0.76, 0, 0.24, 1');

export const REDUZIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const TOQUE = matchMedia('(hover: none)').matches;
export const CELULAR = () => innerWidth <= 760;

// a altura das cenas presas é 100svh (a tela com as barras do navegador abertas). O innerHeight cresce quando a barra
// do Safari some no meio da rolagem: medir por ele mudaria o tamanho das peças em pleno movimento.
const regua = document.createElement('div');
regua.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
document.body.append(regua);
export const alturaTela = () => regua.offsetHeight || innerHeight;

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** onde v está entre a e b, de 0 a 1 */
export const faixa = (v, a, b) => clamp((v - a) / (b - a));
export const suave = (t) => t * t * (3 - 2 * t);
