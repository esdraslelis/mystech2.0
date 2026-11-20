# Mys Tech 2.0

Landing page em Vite sem framework (HTML, CSS e JS puros), com GSAP + ScrollTrigger e Lenis.
Montada a partir do kit "Nubo" (pasta `arquivos/`); o guia do projeto está em `CLAUDE.md` / `AGENTS.md`.

## Desenvolvimento

```bash
npm install
npm run dev
```

`?pronto` no endereço abre sem a abertura animada.

## Produção

```bash
npm run build
```

Suba o conteúdo de `dist/` em qualquer hospedagem estática (Hostinger: dentro de `public_html/`). Funciona também numa subpasta.

## Estrutura

- `index.html` — `<head>` e a ordem das seções (`<!-- @secao nome -->`)
- `src/sections/` — cada seção em `.html` + `.css`
- `src/motion/` — os módulos de movimento
- `src/styles/` — `site.css` (folha única), `tokens.css` (cores por papel), `base.css`
- `public/` — vídeo, fotos e favicon
- `arquivos/` — kit original (referência, prompts e scripts de imagem); não entra no site
