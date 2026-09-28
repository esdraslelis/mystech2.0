import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import World from './experience/World'

gsap.registerPlugin(ScrollTrigger)

const scenes = [
  {
    id: 'awakening',
    label: '00 / WAKE',
    range: [0, 0.105],
    eyebrow: 'MYS TECH / INITIALIZING',
    title: 'O mundo acorda.',
    copy: 'Role para atravessar a marca.',
  },
  {
    id: 'impact',
    label: '01 / WORLD',
    range: [0.105, 0.255],
    eyebrow: 'SCROLL ≠ PÁGINA',
    title: 'Agora o scroll move a câmera.',
    copy: 'Avanço, rotação, profundidade e gravidade passam a fazer parte da navegação.',
  },
  {
    id: 'sites',
    label: '02 / SITES',
    range: [0.255, 0.385],
    eyebrow: 'DIGITAL ARCHITECTURE',
    title: 'Seu site não é uma página.',
    copy: 'Interface, movimento e estrutura passam a existir em camadas físicas.',
  },
  {
    id: 'layers',
    label: '03 / LAYERS',
    range: [0.385, 0.5],
    eyebrow: 'FRONT → SECURITY',
    title: 'Atravessamos cada camada.',
    copy: 'Front-end, UX/UI, backend, integrações, infraestrutura e segurança.',
  },
  {
    id: 'telecom',
    label: '04 / TELECOM',
    range: [0.5, 0.615],
    eyebrow: 'INFRASTRUCTURE',
    title: 'A interface vira fibra.',
    copy: 'BNG, OLT, backbone e conexões formam uma cidade de dados.',
  },
  {
    id: 'automation',
    label: '05 / FLOW',
    range: [0.615, 0.715],
    eyebrow: 'MYS SYSTEM',
    title: 'Dados começam a circular.',
    copy: 'Lead, CRM, WhatsApp, automação, banco e dashboard como fluxo vivo.',
  },
  {
    id: 'projects',
    label: '06 / WORLDS',
    range: [0.715, 0.9],
    eyebrow: 'SELECTED WORLDS',
    title: 'Projetos viram lugares.',
    copy: 'AirBroker, Oston, Mys Monitoring e Vila Veículos existem como ambientes, não cards.',
  },
  {
    id: 'final',
    label: '07 / MYS',
    range: [0.9, 1.001],
    eyebrow: 'THE LOOP CLOSES',
    title: 'Tecnologia deveria parecer impossível.',
    copy: 'Até funcionar.',
  },
]

function findScene(progress) {
  const found = scenes.findIndex((scene) => progress >= scene.range[0] && progress < scene.range[1])
  return found === -1 ? scenes.length - 1 : found
}

function SceneHud({ activeScene }) {
  const scene = scenes[activeScene]
  const isIntro = activeScene === 0
  const isFinal = activeScene === scenes.length - 1

  return (
    <>
      <div className={'scene-hud ' + (isIntro ? 'scene-hud-intro' : '')} key={scene.id}>
        <div className="scene-hud-rule" />
        <span className="scene-hud-eyebrow">{scene.eyebrow}</span>
        <h1>{scene.title}</h1>
        <p>{scene.copy}</p>
      </div>

      {isIntro && (
        <div className="wake-hint">
          <span>SCROLL TO WAKE</span>
          <i />
        </div>
      )}

      {isFinal && (
        <div className="contact-terminal">
          <small>TERMINAL / MYS TECH</small>
          <div className="terminal-actions">
            <a href="https://wa.me/5535997541933?text=Ol%C3%A1%2C%20quero%20criar%20um%20projeto%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
              <span>Criar um projeto</span><b>↗</b>
            </a>
            <a href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">
              <span>Falar com a Mys Tech</span><b>↗</b>
            </a>
            <a href="#journey-projects">
              <span>Conhecer nosso trabalho</span><b>↑</b>
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const activeSceneRef = useRef(0)
  const [activeScene, setActiveScene] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.82,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const trigger = ScrollTrigger.create({
      trigger: '.scroll-journey',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress

        const nextScene = findScene(self.progress)
        if (nextScene !== activeSceneRef.current) {
          activeSceneRef.current = nextScene
          setActiveScene(nextScene)
        }

        document.documentElement.style.setProperty('--journey-progress', self.progress)
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const onPointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    const onPointerLeave = () => {
      pointerRef.current.x *= 0.25
      pointerRef.current.y *= 0.25
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  const showHeader = activeScene > 0

  return (
    <main className="cinematic-site">
      <div className="webgl-stage" aria-hidden="true">
        <Canvas
          dpr={[1, 1.45]}
          camera={{ position: [0, 0, 14], fov: 42, near: 0.05, far: 180 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <World progressRef={progressRef} pointerRef={pointerRef} />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="film-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className={'world-nav ' + (showHeader ? 'visible' : '')}>
        <a className="world-brand" href="#journey-start" aria-label="Mys Tech">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>
        <div className="world-status">
          <span>{scenes[activeScene].label}</span>
          <i><b /></i>
          <span>{String(activeScene + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}</span>
        </div>
        <a className="world-contact" href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">CONTATO ↗</a>
      </header>

      <aside className={'scene-index ' + (showHeader ? 'visible' : '')}>
        {scenes.map((scene, index) => (
          <a key={scene.id} className={index === activeScene ? 'active' : ''} href={'#journey-' + scene.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{scene.id}</b>
          </a>
        ))}
      </aside>

      <SceneHud activeScene={activeScene} />

      <div className="scroll-journey">
        {scenes.map((scene, index) => (
          <section
            id={'journey-' + scene.id}
            className="journey-marker"
            key={scene.id}
            data-scene={index}
          />
        ))}
        <section id="journey-projects" className="journey-project-anchor" />
      </div>
    </main>
  )
}
