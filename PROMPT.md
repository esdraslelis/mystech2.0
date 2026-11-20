# Nubo: software house com o balão de pensamento que abre com o céu dentro e cresce até a tela inteira

## Antes de começar: pergunte

Antes de escrever qualquer código, faça estas perguntas, uma por vez e em linguagem simples (a pessoa pode não ser programadora):

1. **O que você quer fazer com este site?**
   - **Montar a demo como ela é**, para ver funcionando e trocar depois.
   - **Fazer o site da minha empresa** (software house, agência digital, estúdio, consultoria) com esta estrutura e este movimento.
   - **Usar só algumas peças** (o balão do topo que cresce até a tela inteira, os cards de serviço empilhando, a faixa lateral de valores com retratos, o carrossel de fotos, o formulário em grade) num site que já tenho.
2. Se for o negócio dela: o nome, o que ela faz (os serviços), os valores ou o jeito de trabalhar, os contatos e **que material já tem** (logo, fotos do time e do escritório, um vídeo ou foto para o balão do topo). Avise desde já:
   - o balão do topo mostra um vídeo (o céu com o avião de papel da demo); com um vídeo dela em paisagem, ou só uma foto, ele funciona igual (o guia explica);
   - os retratos dos painéis, a foto do time e as fotos do escritório são da demo; com as dela, ficam iguais no formato que o guia pede, e `arquivos/receitas/LEIA.md` tem os prompts para gerar.
3. Se forem peças: quais, e onde está o site que vai recebê-las.

Depois, em qualquer caminho, **monte primeiro a demo completa como descrita abaixo** e confira que ela roda: é o caminho testado e fica de referência. Só então aplique a marca ou extraia as peças, seguindo a seção "Personalizar" do guia. Termine com uma lista curta do que ainda é da demo e do que falta a pessoa mandar.

## A demo

Construa a landing page de uma **software house chamada Nubo** (marca fictícia): "sites, sistemas e apps sob medida, do rabisco ao produto no ar". Leia antes o guia do projeto desta pasta (`CLAUDE.md`, ou `AGENTS.md` no Codex e outros agentes: arquitetura, design system, regras de movimento e do celular, como conferir e como personalizar) e olhe as imagens em `arquivos/conceito/`: são prints do site pronto, o alvo de cada momento, em `-desktop` e `-mobile` (`01-abertura`, `02-hero`, `03-nuvem-crescendo`, `04-frase-deitada`, `05-servicos`, `06-nosso-jeito`, `07-painel-time`, `08-estudio`, `09-contato`, `10-rodape`).

**Tudo o que o site usa já vem pronto em `arquivos/`:** o `index.html`, o `vite.config.js` (com o plugin que monta as seções), o código inteiro em `arquivos/src/` (seções em HTML e CSS e os módulos de movimento) e o vídeo e as fotos em `arquivos/public/`. Use tudo isso como está: não gere imagem nova, não reescreva os módulos e não troque nada por uma versão "mais simples". O trabalho é montar o projeto, instalar as dependências com as versões certas, copiar os arquivos para o lugar e conferir.

A ideia da página: **o símbolo da marca, um balão de pensamento, é uma janela para a ideia do cliente**. Ele abre com o céu e um avião de papel dentro (o rascunho de um app a lápis nas asas) e, na rolagem, cresce até a tela inteira; aí "NADA FICA NO PAPEL" sobe deitada sobre o céu. Depois, a página é tipografia gorda em blocos justificados e cores chapadas que trocam a cada seção: creme, cobalto, girassol, tomate, rosa e marinho.

Nível de acabamento: site de premiação. Alegre e direto ("a gente faz software"), nada de "soluções inovadoras".

---

## Parte 1 — O site

### Marca e tom
- Marca **Nubo** (fictícia), de nuvem, em português do Brasil. O símbolo é o balão de pensamento: a nuvem de bolhas com duas bolinhas descendo até quem pensa (é o recorte do hero, o logo e o favicon; a forma está em `src/motion/forma.js`).
- Tom leve e direto, com "a gente": "A GENTE FAZ SOFTWARE", "Poucas regras, levadas a sério".
- Cores (`src/styles/tokens.css`, por papel): creme `#faf3e3` (fundo), creme claro `#fffaf0`, cobalto `#2340e0` (título do hero, logo, Serviços), tomate `#ff5a26` (subtítulo, botões), girassol `#ffd23d` (selo e "SERVIÇOS"), rosa `#ffc4dd` (card, painel, rodapé), marinho `#101a4a` (bordas, degrau, Contato).
- Tipos (livres para uso comercial, pelo Fontsource): **Lilita One** nos títulos, botões e rótulos (gorda, de cantos redondos, em caixa alta); **Bricolage Grotesque** condensada nos textos.
- Peças "adesivo": a nav em pílula creme com borda marinho, os botões e as setas, todos com um degrau chapado embaixo, sem sombra borrada.

### 01 — Abertura e hero
- **Abertura (~3 s, é o carregamento)**: no creme, as três linhas do título ("A GENTE / FAZ / SOFTWARE", em cobalto, num bloco justificado com "FAZ" enorme) sobem com máscara no meio da tela, seguram e o bloco desliza para a esquerda. Aí o pensamento se forma: a bolinha pequena, a média e a nuvem, que abre com o céu dentro; o selo "OI!" (girassol, texto cobalto) gira para o lugar, o subtítulo tomate sobe ("Sites, sistemas e apps / sob medida, do rabisco / ao produto no ar", em escada) e a nav desce. Qualquer gesto leva direto ao fim.
- **Hero**: o título à esquerda, a nuvem grande à direita com o vídeo do avião, as bolinhas no vão entre o subtítulo e a nuvem; nav em pílula no alto, centralizada, com o logo, "nubo", "CONTA SUA IDEIA" (tomate) e o menu.
- **Rolagem (palco preso, 3 telas)**: o título sai; a nuvem cresce em volta de um ponto fixo até a tela inteira caber dentro dela (as bolinhas estouram no começo); o vídeo só desliza até o centro, sem escalar. Com o céu em tela cheia e um véu azul, "NADA / FICA NO / PAPEL" sobe deitada em perspectiva e some no alto; o parágrafo entra e sobe junto com a seção cobalto, que cobre o céu.

### 02 — Serviços
- Seção cobalto presa: "SERVIÇOS" em girassol de margem a margem e o texto embaixo, à esquerda. Presos à rolagem, quatro cards sobem um por vez, cada um de um ângulo, e assentam tortos no miolo da palavra (o "OS" do fim aparece à direita): Sites & sistemas (creme, título tomate), Apps para celular (girassol), Nuvem & integrações (tomate) e Design de produto (rosa). Cada card tem título em duas linhas, uma frase e uma seta, e leva ao Contato com o serviço marcado. A seção sai pelo alto com os cantos de baixo redondos.

### 03 — Nosso jeito
- "NOSSO / JEITO" em cobalto no creme; a seção prende e a rolagem anda a faixa de lado: a frase de abertura em tomate e quatro painéis de tela cheia, cada um com uma frase em escada (pares de linhas cada vez mais para dentro, entrando quando o painel passa do meio) e uma forma que anda um pouco mais devagar que o painel:
  1. girassol, "A GENTE ESCUTA / ANTES DE PROGRAMAR", a moça de blazer cobalto numa cápsula creme;
  2. tomate, "UM TIME SÓ, / LADO A LADO / COM VOCÊ", a nuvem da marca recortando a foto do time, com bolinhas creme;
  3. rosa, "ENTREGA TODA SEMANA, / NÃO SÓ NO FIM", o rapaz rindo recortado na frente de um círculo creme (a cabeça passa da borda);
  4. creme, "QUEM FAZ RESPONDE / PELO QUE ENTREGA" em tomate, a moça de camisa rosa numa cápsula girassol.
- Um aviãozinho de papel (o mesmo do balão do topo, recortado) entra voando pela esquerda quando a faixa começa a andar e acompanha a rolagem numa linha perto do pé da tela, sob as frases e à esquerda das fotos (só passa por roupas e fundos, nunca por rostos ou letras): deriva devagar para a frente e sobe e desce de leve; a rolagem o empurra e ele baixa o bico, volta com mola quando ela para, vira quando a pessoa rola para trás e flutua parado. Quando o último painel entra, ele acelera, sobe e sai pela direita (e volta se a pessoa rolar de volta).

### 04 — Estúdio
- "ESTÚDIO" em tomate e seis fotos do escritório numa fila que passa das bordas (deitadas e em pé, cantos redondos), com rolagem lateral, encaixe por foto e duas setas tomate de degrau embaixo (apagam na ponta).

### 05 — Contato (o fecho)
- Marinho: "FALA COM / A GENTE" em girassol e um parágrafo à esquerda; à direita o formulário em grade de fios finos: "CONTA SUA IDEIA" (tomate), nome e sobrenome, e-mail e WhatsApp, o serviço em pílulas, a mensagem, o aviso e "ENVIAR". Valida nome, e-mail e mensagem com o erro no campo; mostra "VALEU!" ao enviar. Não envia nada (é uma demonstração).

### 06 — Rodapé
- Rosa: links grandes em cobalto (Serviços, Nosso jeito, Estúdio, Contato), o logo, os créditos e as redes; o fecho "SUA IDEIA NO AR / COM A NUBO" em cobalto de margem a margem, entrando linha a linha, com um rapaz de óculos espiando por trás das letras.

### Movimento e acessibilidade
- Rolagem suave (Lenis) com um teto de velocidade na roda; no toque, a rolagem é a nativa. Nenhuma parada que engole o gesto.
- Texto entra por marco (por tempo, com máscara), nunca preso à rolagem; o que anda com a rolagem são as peças (a nuvem, a frase deitada, os cards, a faixa lateral e o aviãozinho).
- **Cursor da marca** (só com mouse): uma seta gorda cobalto com contorno creme e o degrau marinho dos botões; fica tomate e inclina sobre o que é clicável, afunda no clique e mostra uma etiqueta em pílula tomate onde a ação não é óbvia ("QUERO ESSE" nos cards, "ARRASTA" nas fotos do estúdio, que também arrastam com o mouse). Em campo de texto, volta o cursor do sistema.
- Hover desligado enquanto a página rola (`html.is-scrolling`); hover só com mouse; foco por teclado com contorno; menu fecha com Esc.
- `prefers-reduced-motion`: sem abertura e entradas secas.

---

## Parte 2 — Como construir (stack)

- **Vite sem framework**: HTML, CSS e JS puros. Crie o `package.json` à mão (não use um template do `npm create`, que traz arquivos de exemplo), com `"type": "module"`, `"private": true` e os scripts `"dev": "vite"`, `"build": "vite build"` e `"preview": "vite preview"` (nome e versão à sua escolha), e instale com versão travada, escrito por extenso (`npm install`, não `npm i`), um comando por linha:
  - `npm install -E gsap@3.15.0 lenis@1.3.26 @fontsource-variable/bricolage-grotesque@5.3.0 @fontsource/lilita-one@5.3.0`;
  - `npm install -E -D vite@8.3.5` (dependência de desenvolvimento).
- **Copie os arquivos** com `cp -R` (as pastas inteiras de uma vez, um comando por linha, sem encadear com `&&`: em sessões com permissões restritas, comando composto pede aprovação):

  | de | para |
  |---|---|
  | `arquivos/index.html` | a raiz |
  | `arquivos/vite.config.js` | a raiz (o plugin `secoes` troca cada `<!-- @secao nome -->` do `index.html` por `src/sections/nome.html`; `base: './'`: o `dist/` abre em qualquer pasta da hospedagem) |
  | `arquivos/src/` (a pasta inteira) | `src/` |
  | `arquivos/public/` (a pasta inteira) | `public/` |

  Os comandos, da raiz do projeto: `cp arquivos/index.html .`, `cp arquivos/vite.config.js .`, `cp -R arquivos/src src` e `cp -R arquivos/public public` (sem barra no fim do nome da pasta). Copie antes de existir uma pasta `src/` ou `public/` na raiz (senão o `cp -R` cria `src/src/`). A pasta `arquivos/` continua onde está: não entra no site nem no `dist/`.

  Confira depois da cópia: `src/main.js`; `src/motion/` (`abertura.js`, `ancoras.js`, `contato.js`, `cursor.js`, `ease.js`, `estudio.js`, `forma.js`, `guia.js`, `hero.js`, `jeito.js`, `justifica.js`, `menu.js`, `rodape.js`, `rolando.js`, `scrollbar.js`, `servicos.js`, `smooth.js`); `src/sections/` (nav, hero, servicos, jeito, estudio, contato e rodape, cada um em `.html` e `.css`); `src/styles/` (`site.css`, `tokens.css`, `base.css`); `public/favicon.svg`; `public/video/` (`aviao.mp4` e a reserva `aviao.webm`); e `public/img/` com 13 imagens (`aviao`, `aviaozinho`, `retrato-1` a `retrato-4`, `time`, `estudio-1` a `estudio-6`, todas `.webp`).
- **CSS numa folha só, por `<link>`**: o `arquivos/index.html` já traz, no `<head>`, o script que liga a abertura (ou abre pronto) antes de qualquer arquivo, a cor de fundo e o "nada transiciona até assentar" inline, e depois `<link rel="stylesheet" href="/src/styles/site.css">` (fontes, tokens e seções por `@import`). Mantenha assim e nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página aparece crua por um instante a cada recarregamento.
- Leia o cabeçalho dos módulos antes de mexer em qualquer coisa: `src/main.js` liga a rolagem e, com a fonte de título carregada, o hero, as seções e a abertura. O mapa de cada arquivo está no guia.
- `arquivos/conceito/` e `arquivos/receitas/` não entram no site; `arquivos/fonte/` só serve para refazer as imagens e o símbolo (ver o guia).
- No fim:
  - `npm run build` passa sem aviso de arquivo faltando;
  - `npx vite preview` abre o site, a abertura roda inteira (linhas, deslize, bolinhas, nuvem com o vídeo, selo, subtítulo, nav), o console fica limpo e recarregar nunca mostra a página sem estilo; `?pronto` abre sem a abertura;
  - rolando: a nuvem cresce até a tela inteira sem sobra de creme, "NADA FICA NO PAPEL" sobe deitada, os quatro cards empilham no miolo de "SERVIÇOS", a faixa de Nosso jeito anda de lado com as frases entrando inteiras e o aviãozinho voando junto, as fotos do estúdio passam pelas setas, o formulário mostra os erros e o "VALEU!", e o rodapé sobe com a pessoa atrás das letras;
  - nada rola para o lado no celular (390 px), e lá o hero fica em coluna (texto em cima, nuvem embaixo);
  - o `dist/` sobe em qualquer hospedagem estática, inclusive numa subpasta. Confira com um servidor estático de verdade, não com o `vite preview` (ele devolve o `index.html` para qualquer caminho e esconde arquivo faltando): copie o `dist/` para uma pasta `nubo/` dentro de uma pasta de teste, rode `python3 -m http.server 8080` na pasta de teste, abra `http://localhost:8080/nubo/` e confira o console sem nenhum 404, o vídeo dentro da nuvem e as fotos das seções.
