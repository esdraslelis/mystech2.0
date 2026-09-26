import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const chapters = [
  {
    number: '01',
    label: 'MYS TECH',
    title: <>Sites com <em>presença.</em></>,
    body: 'Design, tecnologia e movimento em uma experiência digital feita para ser lembrada.',
    theme: 'light',
  },
  {
    number: '02',
    label: 'ESTRATÉGIA',
    title: <>Primeiro, o <em>caminho.</em></>,
    body: 'Entendemos sua marca, sua proposta e o que o site precisa fazer.',
    theme: 'light',
  },
  {
    number: '03',
    label: 'DESIGN',
    title: <>Depois, a <em>forma.</em></>,
    body: 'Criamos uma interface limpa, exclusiva e pensada para conduzir.',
    theme: 'dark',
  },
  {
    number: '04',
    label: 'DESENVOLVIMENTO',
    title: <>Então, tudo <em>ganha vida.</em></>,
    body: 'Interações, 3D, responsividade e performance trabalhando como uma só experiência.',
    theme: 'dark',
  },
  {
    number: '05',
    label: 'ENTREGA',
    title: <>Pronto para <em>existir.</em></>,
    body: 'Publicação, SEO, velocidade e estrutura preparada para crescer.',
    theme: 'light',
  },
  {
    number: '06',
    label: 'MYS TECH',
    title: <>Seu próximo site <em>começa aqui.</em></>,
    body: 'Sites institucionais e experiências digitais desenvolvidos do zero.',
    theme: 'dark',
  },
]

export default function App() {
  const [activeTheme, setActiveTheme] = useState('light')
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false })
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

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-chapter]')]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const index = Number(visible.target.dataset.chapter)
        setActiveChapter(index)
        setActiveTheme(chapters[index].theme)
      },
      { threshold: [0.35, 0.5, 0.65] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="site-shell" data-theme={activeTheme}>
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">M</span>
          <span>MYS TECH</span>
        </a>

        <div className="nav-center">
          <span>{chapters[activeChapter].number}</span>
          <span>{chapters[activeChapter].label}</span>
        </div>

        <a className="nav-contact" href="#contact">CONTATO ↗</a>
      </header>

      <div className="map-stage" aria-hidden="true">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [7.8, 7.2, 13.5], fov: 34 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <MystechScene theme={activeTheme} />
          </Suspense>
        </Canvas>
      </div>

      <div id="top" className="story">
        {chapters.map((chapter, index) => (
          <section
            className={`chapter chapter-${index}`}
            data-chapter={index}
            data-theme={chapter.theme}
            key={chapter.number}
          >
            <div className="chapter-copy">
              <div className="chapter-meta">
                <span>{chapter.number}</span>
                <span>{chapter.label}</span>
              </div>

              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>

              {index === 0 && (
                <div className="scroll-note">
                  <span />
                  ROLE PARA NAVEGAR
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
                  CRIAR MEU SITE <span>↗</span>
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
