# Receitas das imagens e do vídeo da Nubo

Tudo o que o site mostra foi gerado a partir destes prompts. Use-os para refazer as imagens com o produto, o time e o
escritório da sua empresa. Qualquer gerador de imagem com bom fotorrealismo serve (ChatGPT/GPT Image, Midjourney,
Ideogram, Flux); para o vídeo, qualquer gerador de vídeo a partir de imagem que aceite **primeiro e último quadro**
(Kling, Runway, Luma, Higgsfield).

## A ordem

1. **O quadro do balão** (`prompts/quadro-aviao.txt`): a foto que aparece dentro da nuvem do topo. Paisagem, com o
   assunto um pouco à esquerda do meio e cor viva (céu, cor de marca); evite imagem escura: ela vira uma mancha dentro
   do recorte. Na demo: um avião de papel com o rascunho de um app nas asas, num céu azul.
2. **O vídeo do balão** (`prompts/video-aviao.txt`): na demo, ele saiu da própria foto, feito em código: o céu, sem o
   avião e com as bordas emendadas, passa da direita para a esquerda (como uma câmera acompanhando o avião), e o
   avião, recortado, sobe e desce de leve. É um loop de 10 s sem emenda. Para o seu, o caminho mais simples é um
   gerador de vídeo a partir da foto, 5 a 10 s, sem som, com a câmera acompanhando o assunto e o fundo passando (o
   prompt é um ponto de partida). **Não use o mesmo quadro no começo e no fim** para fechar o loop: o vídeo sai quase
   parado. Feche o loop emendando o fim no começo com uma fusão curta (a IA faz com o ffmpeg) ou use um vídeo que já
   nasce em loop (bancos de vídeo têm céus, mares e cidades assim). O vídeo gerado costuma sair um pouco mais quente e
   mais macio que a foto: se incomodar, ajuste a cor até ficar igual à foto.
   Exporte em H.264 (MP4) sem áudio, na proporção em que ele saiu (3:2 ou 16:9; a demo tem 1536 × 1024), até ~4 MB,
   e salve como `public/video/aviao.mp4`. O 1º quadro do vídeo vira `public/img/aviao.webp`: é o pôster, e o vídeo
   começa dele. Se não for exatamente o 1º quadro, a imagem dá um pulo quando o vídeo começa.
3. **Retratos** (`prompts/retrato-1.txt` a `retrato-4.txt`): meio corpo, sorrindo, em **fundo cinza liso** (o fundo
   liso é o que deixa recortar a pessoa sozinho). Mantenha as cores da roupa na paleta da marca: é o que faz os
   painéis parecerem um conjunto.
4. **O time** (`prompts/time.txt`) e **o escritório** (`prompts/estudio-1.txt` a `estudio-6.txt`): fotos do dia a
   dia, com a luz natural e as cores da marca aparecendo na decoração. Fotos reais do seu escritório funcionam melhor
   que geradas.
5. **Converter**: salve os PNG em `arquivos/fonte/bruto/` com os mesmos nomes (`retrato-1.png`, `time.png`,
   `estudio-1.png`, `aviao.png`...) e rode, da raiz do projeto, `npm install -D sharp` e depois
   `node arquivos/fonte/imagens.mjs`: ele recorta os retratos (no macOS, pelo Vision) e grava os WebP em `public/img/`.

## Sem vídeo

Só a foto já funciona: apague a tag `<video>` do `src/sections/hero.html` e o balão fica com a foto e um zoom lento
(o recorte, o crescimento e a frase deitada continuam iguais).

## Adaptar ao seu negócio

- Troque o avião de papel pelo que conta a sua ideia: o produto em uso, o time trabalhando, o lugar. Ele precisa ler
  bem pequeno (dentro da nuvem) e grande (em tela cheia, com a frase por cima).
- Nos retratos e nas fotos, diga a roupa e as cores da decoração na paleta da sua marca.
- Nada de texto legível, logo ou marca de terceiros nas imagens.
