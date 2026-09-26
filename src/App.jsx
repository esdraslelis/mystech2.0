import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const stages = [
  {
    id: 'visao',
    label: 'VISÃO',
    eyebrow: 'MYS TECH / DIGITAL FUTURE',
    title: ['Construímos', 'o próximo', 'nível digital.'],
    body: 'Experiências digitais que unem design, tecnologia e movimento para transformar marcas, operações e produtos.',
    cta: 'Explorar a Mys Tech',
  },
  {
    id: 'websites',
    label: 'WEBSITES',
    eyebrow: 'EXPERIÊNCIA',
    title: ['Sites que', 'não parecem', 'sites.'],
    body: 'Interfaces imersivas, responsivas e rápidas, pensadas para apresentar, envolver e converter.',
    cta: 'Conhecer websites',
  },
  {
    id: 'sistemas',
    label: 'SISTEMAS + IA',
    eyebrow: 'INTELIGÊNCIA',
    title: ['Sistemas que', 'entendem', 'a operação.'],
    body: 'Dashboards, automações, APIs e IA aplicados a processos reais, com informação clara e ação rápida.',
    cta: 'Explorar sistemas',
  },
  {
    id: 'projetos',
    label: 'PROJETOS',
    eyebrow: 'SELECTED WORK',
    title: ['Projetos que', 'saem da tela', 'e viram resultado.'],
    body: 'Website institucional, sistema operacional e automação com IA — cada projeto nasce de uma necessidade concreta.',
    cta: 'Ver projetos',
  },
  {
    id: 'tecnologia',
    label: 'TECNOLOGIA',
    eyebrow: 'WEBGL / MOTION / DATA',
    title: ['Tecnologia', 'com propósito,', 'não efeito.'],
    body: '3D, motion design, dados e inteligência artificial entram onde tornam a experiência mais útil, memorável e eficiente.',
    cta: 'Entender a tecnologia',
  },
  {
    id: 'contato',
    label: 'CONTATO',
    eyebrow: 'START A PROJECT',
    title: ['Seu próximo', 'projeto começa', 'aqui.'],
    body: 'Conte o que você precisa. A gente transforma em experiência digital completa.',
    cta: 'Vamos conversar',
  },
]

export default function App() {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.12, smoothWheel: true, syncTouch: false })
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
    const nodes = [...document.querySelectorAll('[data-stage]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveStage(Number(visible.target.dataset.stage))
    }, { threshold: [0.45, 0.6, 0.75] })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const stage = stages[activeStage]

  return (
    <main className="hub-experience">
      <div className="scene">
        <Canvas
          dpr={[1, 1.7]}
          camera={{ position: [9.5, 7.2, 17], fov: 36 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <MystechScene activeStage={activeStage} />
          </Suspense>
        </Canvas>
      </div>

      <div className="frame" />

      <header className="header">
        <a href="#visao" className="brand">
          <img src="/mys-logo.svg" alt="Mys Tech" />
          <span>MYS TECH</span>
        </a>

        <nav>
          <a href="#visao">Institucional</a>
          <a href="#websites">Websites</a>
          <a href="#sistemas">Sistemas</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>

        <a className="menu-btn" href="#contato">VAMOS CONVERSAR <b>↗</b></a>
      </header>

      <aside className="stage-rail">
        {stages.map((item, index) => (
          <a href={`#${item.id}`} key={item.id} className={index === activeStage ? 'active' : ''}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{item.label}</b>
          </a>
        ))}
      </aside>

      <section className="copy" key={activeStage}>
        <div className="copy-eyebrow">
          <span>{stage.eyebrow}</span>
          <i />
        </div>

        <h1>
          {stage.title.map((line, index) => (
            <span className="line" key={line} style={{ '--delay': `${index * 90}ms` }}>
              <b>{line}</b>
            </span>
          ))}
        </h1>

        <p>{stage.body}</p>

        {activeStage === 3 && (
          <div className="project-mini-list">
            <span><b>01</b> Website institucional</span>
            <span><b>02</b> Sistema operacional</span>
            <span><b>03</b> Automação com IA</span>
          </div>
        )}

        <a
          className="copy-cta"
          href={activeStage === stages.length - 1 ? 'https://wa.me/5535997541933' : `#${stages[Math.min(activeStage + 1, stages.length - 1)].id}`}
          target={activeStage === stages.length - 1 ? '_blank' : undefined}
          rel={activeStage === stages.length - 1 ? 'noreferrer' : undefined}
        >
          {stage.cta} <span>↗</span>
        </a>
      </section>

      <div className="scroll-label"><i /> SCROLL TO EXPLORE</div>

      <div className="chapter-indicator">
        <span>{String(activeStage + 1).padStart(2, '0')}</span>
        <i />
        <span>{String(stages.length).padStart(2, '0')}</span>
      </div>

      <div className="scroll-track">
        {stages.map((item, index) => (
          <section key={item.id} id={item.id} data-stage={index} />
        ))}
      </div>
    </main>
  )
}
