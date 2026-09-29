# Mys Tech 2.0

Site institucional e experiência cinematográfica da Mys Tech, construído com **Next.js**, React e animação sincronizada ao scroll.

## Stack

- Next.js (App Router)
- React 19
- GSAP
- Three.js / React Three Fiber
- Lenis
- Sequência cinematográfica de 1500 frames empacotada em `public/media`

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Produção

```bash
npm run build
npm start
```

Requer Node.js 20.9 ou superior.

## Estrutura principal

- `src/app/layout.jsx` — layout global e metadata
- `src/app/page.jsx` — rota inicial
- `src/App.jsx` — experiência principal
- `src/styles.css` — estilos globais
- `public/media` — mídia da experiência cinematográfica
