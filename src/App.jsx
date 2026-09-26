import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const chapters = [
  {
    id: 'institucional',
    number: '01',
    label: 'INSTITUCIONAL',
    title: <>Tecnologia com <em>forma.</em></>,
    body: 'Criamos experiências digitais claras, rápidas e memoráveis.',
    theme: 'light',
  },
  {
    id: 'websites',
    number: '02',
    label: 'WEBSITES',
    title: <>Sites que <em>respondem.</em></>,
    body: 'Interfaces vivas, responsivas e pensadas para conduzir cada clique.',
    theme: 'light',
  },
  {
    id: 'sistemas',
    number: '03',
    label: 'SISTEMAS',
    title: <>Sistemas que <em>pensam junto.</em></>,
    body: 'Dashboards, automações e IA aplicados ao dia a dia da operação.',
    theme: 'dark',
  },
  {
    id: 'projetos',
    number: '04',
    label: 'PROJETOS',
    title: <>Projetos com <em>propósito.</em></>,
    body: 'Cada interface nasce de um problema real e termina em uma experiência simples.',
    theme: 'dark',
  },
  {
    id: 'contato',
    number: '05',
    label: 'CONTATO',
    title: <>Vamos criar <em>o próximo.</em></>,
    body: 'Conte o que você precisa. A gente transforma em experiência digital.',
    theme: 'light',
  },
]

export default function App() {
  const [activeTheme, setActiveTheme] = useState('light')
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.08, smoothWheel: true, syncTouch: false })
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
      { threshold: [0.38, 0.52, 0.68] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="site-shell" data-theme={activeTheme}>
      <header className="nav">
        <a className="brand" href="#institucional" aria-label="Mys Tech">
          <span className="brand-symbol"><span /></span>
          <span>MYS TECH</span>
        </a>

        <nav className="nav-menu" aria-label="Principal">
          <a href="#institucional">Institucional</a>
          <a href="#websites">Websites</a>
          <a href="#sistemas">Sistemas</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="nav-status">
          <span>{chapters[activeChapter].number}</span>
          <span>{chapters[activeChapter].label}</span>
        </div>
      </header>

      <div className="map-stage">
        <Canvas
          dpr={[1, 1.65]}
          camera={{ position: [7.6, 6.7, 13.2], fov: 34 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <MystechScene theme={activeTheme} activeChapter={activeChapter} />
          </Suspense>
        </Canvas>
      </div>

      <div className="story">
        {chapters.map((chapter, index) => (
          <section
            id={chapter.id}
            className={`chapter chapter-${index}`}
            data-chapter={index}
            data-theme={chapter.theme}
            key={chapter.id}
          >
            <div className="chapter-copy">
              <div className="chapter-meta">
                <span>{chapter.number}</span>
                <span>{chapter.label}</span>
              </div>

              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>

              {index === 0 && (
                <>
                  <div className="hero-tags">
                    <span>Websites</span>
                    <span>Sistemas</span>
                    <span>IA</span>
                    <span>3D</span>
                  </div>
                  <div className="scroll-note">
                    <span />
                    ROLE PARA EXPLORAR
                  </div>
                </>
              )}

              {chapter.id === 'contato' && (
                <div className="contact-actions">
                  <a
                    className="project-link"
                    href="https://wa.me/5535997541933"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FALAR NO WHATSAPP <span>↗</span>
                  </a>
                  <a className="text-link" href="mailto:contato@mystech.com.br">contato@mystech.com.br</a>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
