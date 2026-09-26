import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const zones = [
  { id: 'inicio', label: 'MYS WORLD' },
  { id: 'websites', label: 'WEBSITES' },
  { id: 'sistemas', label: 'SISTEMAS + IA' },
  { id: 'projetos', label: 'PROJETOS' },
  { id: 'contato', label: 'CONTATO' },
]

export default function App() {
  const [activeZone, setActiveZone] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false })
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
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })

    const sections = [...document.querySelectorAll('[data-zone]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveZone(Number(visible.target.dataset.zone))
    }, { threshold: [0.45, 0.6, 0.75] })

    sections.forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener('scroll', updateProgress)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="experience">
      <div className="world">
        <Canvas dpr={[1, 1.7]} camera={{ position: [0, 5.4, 12], fov: 46 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <MystechScene activeZone={activeZone} />
          </Suspense>
        </Canvas>
      </div>

      <header className="hud">
        <a href="#inicio" className="hud-brand">
          <img src="/mys-logo.svg" alt="Mys Tech" />
          <span>MYS TECH</span>
        </a>

        <nav className="hud-nav">
          <a href="#websites">Websites</a>
          <a href="#sistemas">Sistemas</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="hud-zone">
          <b>{String(activeZone + 1).padStart(2, '0')}</b>
          <span>{zones[activeZone].label}</span>
        </div>
      </header>

      <div className="journey">
        <div className="journey-line">
          <i style={{ height: `${progress * 100}%` }} />
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>

      {activeZone === 0 && (
        <div className="intro-copy">
          <span className="intro-kicker">MYS TECH / INTERACTIVE WORLD</span>
          <h1>
            <span><b>Entre.</b></span>
            <span><b>Explore.</b></span>
            <span><b>Descubra.</b></span>
          </h1>
          <p>Role o mouse. O site acontece dentro do mapa.</p>
          <div className="scroll-command"><i /> SCROLL PARA AVANÇAR</div>
        </div>
      )}

      <div className="scroll-space">
        {zones.map((zone, index) => (
          <section key={zone.id} id={zone.id} data-zone={index} className="zone-stop" />
        ))}
      </div>
    </main>
  )
}
