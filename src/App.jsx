import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const zones = [
  {
    id: 'inicio',
    number: '01',
    label: 'MYS WORLD',
    title: 'Explore a MysTech',
    text: 'Role para avançar pelo nosso mundo digital.',
    action: null,
  },
  {
    id: 'websites',
    number: '02',
    label: 'WEBSITES',
    title: 'Web District',
    text: 'Sites institucionais, landing pages e experiências interativas.',
    action: 'Explorar websites',
  },
  {
    id: 'sistemas',
    number: '03',
    label: 'SISTEMAS + IA',
    title: 'AI Core',
    text: 'Sistemas sob medida, dashboards, automações e inteligência artificial.',
    action: 'Conhecer sistemas',
  },
  {
    id: 'projetos',
    number: '04',
    label: 'PROJETOS',
    title: 'Project Valley',
    text: 'Projetos digitais construídos para resolver problemas reais.',
    action: 'Ver projetos',
  },
  {
    id: 'contato',
    number: '05',
    label: 'CONTATO',
    title: 'Launch Point',
    text: 'Chegou até aqui. Agora vamos construir o seu.',
    action: 'Iniciar projeto',
  },
]

export default function App() {
  const [activeZone, setActiveZone] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.08, smoothWheel: true, syncTouch: false })
    let raf
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections = [...document.querySelectorAll('[data-zone]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveZone(Number(visible.target.dataset.zone))
    }, { threshold: [0.42, 0.58, 0.72] })

    sections.forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const zone = zones[activeZone]
  const progressPct = useMemo(() => Math.round(progress * 100), [progress])

  return (
    <main className="world-shell">
      <div className="world-canvas">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 4, 10], fov: 48 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <MystechScene />
          </Suspense>
        </Canvas>
      </div>

      <header className="hud-top">
        <a className="hud-brand" href="#inicio">
          <span className="brand-core">M</span>
          <span>MYS TECH</span>
        </a>

        <nav className="hud-nav">
          <a href="#websites">Websites</a>
          <a href="#sistemas">Sistemas</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="hud-location">
          <b>{zone.number}</b>
          <span>{zone.label}</span>
        </div>
      </header>

      <aside className="zone-card" key={activeZone}>
        <div className="zone-kicker"><span>{zone.number}</span>{zone.label}</div>
        <h1>{zone.title}</h1>
        <p>{zone.text}</p>

        {activeZone === 0 && (
          <div className="scroll-quest">
            <span className="mouse-icon"><i /></span>
            role para explorar
          </div>
        )}

        {activeZone === 4 && (
          <a
            className="zone-action"
            href="https://wa.me/5535997541933"
            target="_blank"
            rel="noreferrer"
          >
            {zone.action} <span>↗</span>
          </a>
        )}
      </aside>

      <div className="route-progress" aria-hidden="true">
        <span className="route-number">00</span>
        <div className="route-track"><i style={{ height: `${progressPct}%` }} /></div>
        <span className="route-number">05</span>
      </div>

      <div className="world-hint">
        <span className="blue-dot" />
        SCROLL = MOVE
      </div>

      <div className="scroll-space">
        {zones.map((item, index) => (
          <section key={item.id} id={item.id} data-zone={index} className="world-zone" />
        ))}
      </div>
    </main>
  )
}
