import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const chapters = [
  {
    number: '00',
    kicker: 'MYS TECH — DIGITAL STUDIO',
    title: <>Criamos sites que <em>viram espaço.</em></>,
    body: 'Uma experiência contínua, limpa e tridimensional. Role para atravessar o projeto.',
  },
  {
    number: '01',
    kicker: 'ESTRATÉGIA',
    title: <>Tudo começa pelo <em>território.</em></>,
    body: 'Marca, público e objetivo definem a arquitetura. Antes da interface, desenhamos o caminho.',
  },
  {
    number: '02',
    kicker: 'DESIGN',
    title: <>Uma tela nasce <em>dentro da outra.</em></>,
    body: 'O conteúdo não troca de seção. Ele se transforma, encaixa e continua no próximo capítulo.',
  },
  {
    number: '03',
    kicker: 'DESENVOLVIMENTO',
    title: <>Interface com <em>profundidade real.</em></>,
    body: 'WebGL, motion e performance trabalhando juntos — sem excesso visual e sem cara de template.',
  },
  {
    number: '04',
    kicker: 'ENTREGA',
    title: <>Do mapa ao <em>site publicado.</em></>,
    body: 'Responsivo, rápido, otimizado para busca e preparado para crescer junto com a empresa.',
  },
  {
    number: '05',
    kicker: 'MYS TECH',
    title: <>Vamos construir seu <em>próximo espaço digital.</em></>,
    body: 'Sites institucionais e experiências digitais premium desenvolvidos do zero.',
  },
]

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, syncTouch: false })
    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <main className="site-shell">
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-dot" />
          <span>MYS TECH</span>
        </a>
        <div className="nav-right">
          <span>WEB DESIGN & DEVELOPMENT</span>
          <a href="#contact">FALE COM A GENTE ↗</a>
        </div>
      </header>

      <div className="map-stage" aria-hidden="true">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [8.5, 9.5, 15], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <MystechScene />
          </Suspense>
        </Canvas>
      </div>

      <div id="top" className="story">
        {chapters.map((chapter, index) => (
          <section className={`chapter chapter-${index}`} key={chapter.number}>
            <div className="chapter-copy">
              <div className="chapter-meta">
                <span>{chapter.number}</span>
                <span>{chapter.kicker}</span>
              </div>
              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>

              {index === 0 && (
                <div className="scroll-note">
                  <span className="scroll-line" />
                  SCROLL TO EXPLORE
                </div>
              )}

              {index === chapters.length - 1 && (
                <a
                  id="contact"
                  className="project-link"
                  href="https://wa.me/5535997541933"
                  target="_blank"
                  rel="noreferrer"
                >
                  INICIAR UM PROJETO <span>↗</span>
                </a>
              )}
            </div>

            <div className="chapter-index">
              {String(index + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
