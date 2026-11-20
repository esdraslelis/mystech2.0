# Guia do projeto — Nubo

(Salve como `CLAUDE.md` na raiz do projeto se você usa o Claude Code, ou como `AGENTS.md` se usa o Codex, o Cursor ou outro agente. O conteúdo é o mesmo.)

Landing page da Nubo, uma software house fictícia ("sites, sistemas e apps sob medida, do rabisco ao produto no ar"). Vite sem framework, GSAP com ScrollTrigger, Lenis, e duas fontes livres: Lilita One nos títulos e Bricolage Grotesque nos textos. **O símbolo da marca, um balão de pensamento, é uma janela: ele abre com o céu e um avião de papel dentro e, na rolagem, cresce até a tela inteira.** O código já vem pronto em `arquivos/src/`, a página no `arquivos/index.html`, e as fotos e o vídeo em `arquivos/public/`: o trabalho é montar, conferir e, depois, personalizar. A régua é site de premiação: se algo parece "ok", ainda não está pronto.

## Arquitetura
- **Uma seção por arquivo.** O `index.html` só tem o `<head>` e a ordem das seções (`<!-- @secao hero -->` etc.); o plugin `secoes` do `vite.config.js` troca cada marca pelo `src/sections/<nome>.html` no dev e no build. Os textos (títulos, serviços, valores, formulário, rodapé) estão nesses HTML; cada seção tem o seu CSS ao lado (`src/sections/<nome>.css`).
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`: as fontes, `tokens.css`, `base.css` e as seções na ordem da página), ligada por `<link>` no `<head>`. Antes dela, inline: o script que liga a abertura (ou abre pronto), a cor de fundo e o "nada transiciona até assentar". Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos**:

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | liga a rolagem (Lenis + freio), a barra, o menu e os links internos; com a fonte de título carregada, monta os blocos justificados, o hero, as seções e a abertura |
  | `src/motion/forma.js` | a forma da marca: bolhas (círculos) cujo contorno de fora vira curvas, mais as duas bolinhas. `caminho()` leva tudo para a tela com escala e posição |
  | `src/motion/hero.js` | o recorte (`clip-path: path()` refeito a cada quadro numa camada com o filme), o crescimento até cobrir a tela, o filme que acompanha a nuvem, a frase deitada e o parágrafo. Os trechos da rolagem ficam em `T`, no topo |
  | `src/motion/abertura.js` | a abertura por tempo (~3 s): linhas sobem, o bloco desliza, bolinhas e nuvem abrem, selo, subtítulo e nav |
  | `src/motion/justifica.js` | blocos justificados: cada linha de um `[data-justifica]` ganha o tamanho que a faz ocupar a largura do bloco (`data-justifica="0.3"` põe teto) |
  | `src/motion/servicos.js` | os quatro cards subindo presos à rolagem e empilhando (`POSE`: onde e em que ângulo cada um assenta; `JANELA`: quando sobe) |
  | `src/motion/jeito.js` | a seção que prende e anda de lado: segura o título, depois `fator` (rolagem vertical por px de faixa) e as entradas de cada painel. Em `criaVoo`, o aviãozinho: entra por tempo, o caminho preso à faixa (deriva e uma onda e meia), a mola da velocidade, a virada, a flutuação e a saída pela direita quando o último painel entra |
  | `src/motion/estudio.js`, `contato.js`, `rodape.js` | a fila de fotos com setas; o formulário (validação, envio simulado em `ENVIA`, o serviço marcado pelo card clicado); a entrada do fecho do rodapé |
  | `src/motion/cursor.js` | o cursor da marca (só com mouse): a seta com o degrau dos botões, o estado sobre o clicável, o clique e a etiqueta de `[data-cursor]` |
  | `src/motion/smooth.js`, `guia.js`, `rolando.js`, `scrollbar.js`, `ancoras.js`, `menu.js`, `ease.js` | Lenis + ScrollTrigger num relógio só; o teto de velocidade da roda (`AVANCO`); hover desligado ao rolar; barra de rolagem própria; links internos; o menu; curvas e utilidades |
- **Parâmetros de URL**: `?pronto` abre sem a abertura (útil para trabalhar nas seções de baixo).

## Design system
- **Cores são papéis, não nomes de cor** (`src/styles/tokens.css`), na paleta "cobalto": `--fundo` creme `#faf3e3`; `--claro` `#fffaf0` (pílula, menu, card claro); `--titulo-cor` cobalto `#2340e0` (título do hero, logo, fundo de Serviços); `--apoio` e `--cta` tomate `#ff5a26` (subtítulo, botões, links do menu); `--selo-fundo` girassol `#ffd23d` (selo "OI!", "SERVIÇOS"); `--c4-fundo` rosa `#ffc4dd` (card, painel, rodapé); `--escuro` marinho `#101a4a` (bordas, degrau, texto, Contato). Os quatro cards têm `--c1…c4-fundo/titulo/texto`. Trocar a cor da marca é mexer só aí.
- **Tipos**: Lilita One (títulos em caixa alta, botões, rótulos, menu), gorda e de cantos redondos, entrelinha 0,76; Bricolage Grotesque condensada (largura 75%, peso 500–600) nos textos e no subtítulo.
- **Blocos justificados**: o título do hero ("A GENTE / FAZ / SOFTWARE"), a frase deitada, "SERVIÇOS", "NOSSO / JEITO", "ESTÚDIO", os títulos dos cards e o fecho do rodapé têm as linhas do mesmo comprimento, cada uma no seu tamanho. No hero, os vãos entre linhas são acertados com `translate` em cada linha (a Lilita sobra mais em cima das maiúsculas que embaixo).
- **Peças "adesivo"**: a nav em pílula, os botões e as setas têm borda ou fundo chapado e um degrau escuro embaixo (`--degrau`), sem sombra borrada: sobem no hover, afundam no clique. O **cursor** segue o mesmo estilo: seta cobalto com contorno claro e degrau marinho, tomate e inclinada sobre o clicável, com a etiqueta em pílula tomate onde o elemento tem `data-cursor` ("Quero esse" nos cards, "Arrasta" nas fotos do estúdio). Em campo de texto volta o cursor do sistema; no toque não existe.
- **Escala**: o hero e as cenas presas usam `--u` (1 px numa tela de 1440 × 900, encolhe pelo lado que apertar); as seções comuns, `--su` (nunca passa de 1 px). Título de seção até 64 px (80 no Contato), corpo 16–18. Cada seção comum cabe numa tela de 1440 × 900.

## Regras de movimento
- **A abertura é por tempo** (~3 s), e é o carregamento: não há tela de loading. Qualquer gesto (roda, toque, tecla) leva direto ao fim e já solta a rolagem. Nada pesado pode rodar no começo: uma tarefa longa na carga faz o GSAP pular a animação (por isso a escala de cobertura da nuvem fica em cache por proporção de tela, em `cobre()`).
- **O recorte** é um `clip-path: path()` recalculado a cada quadro a partir das curvas de `forma.js`: fica nítido em qualquer tamanho. Não troque por `mask-image` com SVG (borra no zoom) nem por vídeo com fundo transparente.
- **O crescimento** é um zoom em volta de um ponto fixo, com a escala em progressão geométrica, até a tela inteira caber dentro do contorno; as bolinhas estouram no começo. O filme não escala no desktop, só desliza até o centro; na tela em pé ele encolhe no hero (o quadro deitado seria maior que a nuvem) e cresce junto. Uma trava a cada quadro impede a borda do filme de aparecer dentro do recorte.
- **Texto entra por marco** (por tempo, com máscara), nunca preso à rolagem: passar rápido nunca deixa meia palavra. O que anda com a rolagem são as peças: a nuvem, a frase deitada (é um plano em perspectiva, não uma máscara), os cards, a faixa lateral.
- **A rolagem nunca para sozinha**: o freio (`guia.js`) só limita a velocidade da roda (~2 telas/s); no toque, a rolagem é a nativa do aparelho. Nada de "parada" que engole o gesto.
- **Primeira pintura**: o `<head>` traz a cor de fundo e `html:not(.assentou) *` sem transição; o `main.js` marca `assentou` depois de dois quadros.
- `prefers-reduced-motion` e `?pronto`: sem abertura; com movimento reduzido, as entradas por marco viram troca seca.

## Celular: regras que não se quebram
- **Nunca rolar para o lado.** `overflow-x: clip` no `html` e no `body` é só a rede de segurança (`clip`, não `hidden`, que quebra o `sticky`); se algo vazar, conserte a origem.
- **Alturas em `svh`**, nunca `100vh` nem `dvh` (a barra do Safari some e volta e mudaria o tamanho das cenas no meio da rolagem). Conferir em 390 × 844, 393 × 659 e 375 × 553 (iPhone com as barras do Safari).
- Hero em coluna: o texto em cima, a nuvem embaixo e as bolinhas saindo do alto da nuvem para o texto (`forma({ acima: true })`). Serviços: título e texto em cima, a pilha de cards embaixo. Nosso jeito: a faixa lateral continua, com a frase no alto de cada painel, a pessoa embaixo e o aviãozinho perto do pé da tela, passando pelas roupas.
- Hover só dentro de `@media (hover: hover)`; alvos de toque de 40 px no mínimo; campos com fonte de 18 px (o iPhone dá zoom abaixo de 16).

## Como checar
- `npm run build` sem aviso de arquivo faltando.
- `npx vite preview`: console limpo; a abertura roda inteira em tempo real (linhas sobem, o bloco desliza, bolinhas e nuvem abrem com o céu, selo, subtítulo e nav); recarregar nunca mostra a página crua; `?pronto` abre direto.
- Rolando de cima a baixo devagar e depressa: a nuvem cresce até a tela inteira sem borda creme no fim, a frase deitada sobe e some, a seção cobalto cobre o céu, os cards empilham no miolo de "SERVIÇOS" (o "OS" fica à direita), a faixa de Nosso jeito anda de lado e cada frase entra inteira, o aviãozinho entra pela esquerda, voa junto e sai pela direita quando o último painel entra (rolando para trás, ele vira e volta), as fotos do estúdio entram, o fecho do rodapé sobe com a pessoa atrás.
- Clique num card de serviço (leva ao Contato com o serviço marcado), mande o formulário vazio (erros nos campos) e preenchido ("VALEU!"), use as setas do estúdio e o menu (abre, fecha com Esc e leva às seções).
- Celular (390 px) e o `dist/` numa subpasta, com um servidor estático de verdade (o prompt diz como): sem 404 e sem rolagem para o lado.

## Personalizar

Vale para qualquer mudança, agora ou depois.

### As três perguntas
1. É a demo, a empresa da pessoa (software house, agência digital, estúdio, consultoria) ou peças soltas?
2. Que material ela já tem (logo, fotos do time e do escritório, um vídeo ou foto para o balão do hero, serviços, contatos) e o que falta?
3. O que ela quer manter da demo (o balão que cresce com a frase deitada, os cards empilhados, a faixa lateral de valores, o carrossel, o formulário)?

### O que muda e onde

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome da marca | `nav.html` (`.nav__nome`, `aria-label`), `rodape.html` (o fecho "com a Nubo" e os créditos), `contato.html` (o aviso), `<title>`, `description` e as tags `og:` no `index.html` (ao publicar, acrescente `og:image` e `og:url` com o endereço completo do site) | não |
| Título e subtítulo do hero | `hero.html` (as três `.linha` do `h1` e o `.hero__sub`); o bloco justifica sozinho. Palavra curta no meio fica grande: é o efeito | não |
| Frase deitada e parágrafo | `hero.html` (`.crawl` e `.hero__frase`) | não |
| Serviços | os quatro `.card` em `servicos.html` (título em duas linhas de comprimento parecido, texto, `data-servico`) e as pílulas do formulário em `contato.html` (os `value` têm de bater com `data-servico`) | não |
| Valores (Nosso jeito) | os quatro `.painel` em `jeito.html` (frase em pares de linhas) e a frase de abertura | retratos e a foto do time, se for trocar as pessoas |
| Estúdio | as seis `.foto` em `estudio.html` (deitadas 3:2 e em pé 2:3, `alt` de cada uma) | fotos do escritório |
| Contato | `contato.html` (textos, campos); o envio em `ENVIA`, no topo de `src/motion/contato.js` | ligar a um serviço de formulário, e-mail ou WhatsApp |
| Rodapé | `rodape.html` (links, créditos, redes, o fecho) | o retrato que espia, se for trocar |
| Símbolo | a forma é a lista de bolhas `NUVEM` e `BOLINHAS` em `src/motion/forma.js` (vale para o recorte e o logo); depois rode, da raiz do projeto, `node arquivos/fonte/marca.mjs`: ele refaz o `public/favicon.svg` e imprime o caminho para colar no `<svg class="marca">` da nav, do menu e do rodapé | só se a pessoa quiser outra forma |
| Etiquetas do cursor | o atributo `data-cursor="texto"` em qualquer elemento (os cards em `servicos.html`, a fila em `estudio.html`); o estilo fica no fim de `base.css` | não |
| Cores e fontes | `src/styles/tokens.css` (papéis) e o `@import` das fontes em `site.css` | não |

### Material da pessoa

Para cada peça visual, do mais simples ao mais trabalhoso:

- **O balão do hero** (`public/video/aviao.mp4`, a reserva `aviao.webm` para navegador sem H.264, e o pôster `public/img/aviao.webp`): (1) manter o da demo (um loop de 10 s feito em código a partir da foto: o céu passa atrás do avião, que balança); (2) um vídeo dela em paisagem (3:2 ou 16:9: o código usa a proporção do quadro), de 5 a 10 s, com movimento contínuo (a câmera acompanhando o assunto, o fundo passando) e o assunto um pouco à esquerda do meio, em H.264 sem som (e, se quiser, a reserva em WebM VP9), fechando em loop (o fim emendado no começo por uma fusão curta no ffmpeg; gerado com o mesmo quadro no começo e no fim, ele sai quase parado). O primeiro quadro do vídeo, exatamente ele, vira `aviao.webp`: o vídeo fica sempre visível e começa do pôster, então qualquer diferença vira um pulo. Ajuste `data-foco` no `hero.html` (onde está o assunto, em fração da largura e da altura) para ele pousar no miolo da nuvem; (3) só uma foto, sem vídeo: apague a `<video>` do `hero.html` e o hero fica com a foto e um zoom lento (o código já sabe); (4) gerar com as receitas de `arquivos/receitas/` (o quadro no gerador de imagem, o vídeo num gerador de vídeo a partir dele). O vídeo e a foto da demo mostram o avião de papel da Nubo: não se editam por prompt.
- **O aviãozinho** (`public/img/aviaozinho.webp`, ~420 px de largura, fundo transparente): o objeto do balão do topo, recortado, que voa na faixa de Nosso jeito. Com outra foto no balão, recorte o objeto dela (`arquivos/fonte/bruto/aviaozinho.png` e o `imagens.mjs` abaixo, ou qualquer removedor de fundo) e mantenha o nome; o voo pede um objeto que faça sentido voando (um avião, um pássaro de papel, um balão). Sem um, apague o `<img class="jeito__aviao">` do `jeito.html`: o código fica sem ele.
- **Retratos** (`public/img/retrato-1…4.webp`, PNG/WebP com fundo transparente): fotos de meio corpo, de frente ou de três quartos, sorrindo, em fundo liso; recorte com o `arquivos/fonte/recorta.swift` (macOS: `swift recorta.swift foto.png recorte.png`) ou com qualquer removedor de fundo, e exporte em WebP com ~1100 px de altura. O 1 e o 3 ficam dentro de uma cápsula (o rosto no meio); o 2 passa da borda do círculo (cabeça e ombros com folga em cima); o 4 espia por trás do fecho do rodapé (a mão perto do queixo funciona bem).
- **Foto do time** (`public/img/time.webp`, paisagem 3:2, ~1400 px): o grupo no meio, recortado pela nuvem do painel tomate.
- **Estúdio** (`public/img/estudio-1…6.webp`): 3:2 deitadas (1200 px) e 2:3 em pé (760 px), na ordem do `estudio.html`. Fotos reais do escritório servem; todas na mesma luz deixam a fila coerente.
- Da raiz do projeto, `npm install -D sharp` e depois `node arquivos/fonte/imagens.mjs`: converte as fotos em PNG de `arquivos/fonte/bruto/` (com os nomes da lista no topo do script) para os WebP de `public/img/` nos tamanhos certos e recorta os retratos no macOS.

### Regras ao trocar
- Nada de dado inventado como se fosse da pessoa: telefone, e-mail, endereço, CNPJ, prazos e números que ela não mandou ficam `[preencher]` (nunca no título do hero nem no fecho do rodapé).
- Mantenha o que dá o efeito: o balão com algo vivo dentro (vídeo ou foto com cor e contraste, nunca uma imagem escura ou um logo), o bloco justificado com uma palavra curta no meio, os cards de cores chapadas, as frases curtas em escada nos painéis.
- O formulário é uma demonstração: não envia nada. Para valer, troque `ENVIA` em `src/motion/contato.js` por um `fetch` ao serviço de formulário da pessoa (Formspree, Getform, o e-mail dela por um serviço assim) ou por um link `wa.me` com a mensagem montada, e diga isso a ela.
- Nada de cidade real na demo; no site da pessoa, use o endereço dela.
- Termine com a lista do que ainda é da demo: vídeo do balão, retratos, foto do time, fotos do estúdio, textos, contatos.
