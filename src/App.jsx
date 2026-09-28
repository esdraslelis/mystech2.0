import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import World from './experience/World'

const stages = [
  { id: 'intro', from: 0, to: 0.18, label: '01 / INTRO', title: 'Um mundo, não uma homepage.', note: 'Role para se aproximar do monitor.' },
  { id: 'screen', from: 0.18, to: 0.36, label: '02 / SCREEN', title: 'A tela deixa de ser plana.', note: 'A interface ganha profundidade e a câmera atravessa o painel.' },
  { id: 'globe', from: 0.36, to: 0.56, label: '03 / ORBIT', title: 'O scroll vira trajetória.', note: 'A câmera orbita o globo enquanto a orientação do mundo começa a mudar.' },
  { id: 'gravity', from: 0.56, to: 0.72, label: '04 / GRAVITY', title: 'A parede vira chão.', note: 'Peças passam a cair lateralmente. Volte o scroll e tudo retorna.' },
  { id: 'horizontal', from: 0.72, to: 1.001, label: '05 / HORIZONTAL', title: 'O scroll continua vertical. A viagem, não.', note: 'Agora a câmera percorre uma composição tridimensional lateral.' },
]

function getStage(progress) {
  const index = stages.findIndex((stage) => progress >= stage.from && progress < stage.to)
  return index === -1 ? stages.length - 1 : index
}

export default function App() {
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const stageRef = useRef(0)
  const [stageIndex, setStageIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.35 : 0.72,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.84,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const trigger = ScrollTrigger.create({
      trigger: '.prototype-scroll',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
        document.documentElement.style.setProperty('--progress', self.progress)

        const next = getStage(self.progress)
        if (next !== stageRef.current) {
          stageRef.current = next
          setStageIndex(next)
        }
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reducedMotion])

  useEffect(() => {
    const move = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    const leave = () => {
      pointerRef.current.x = 0
      pointerRef.current.y = 0
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  const stage = stages[stageIndex]

  return (
    <main className="prototype">
      <div className="viewport" aria-hidden="true">
        <Canvas
          dpr={[1, 1.45]}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: 4,
            toneMappingExposure: 0.88,
          }}
        >
          <Suspense fallback={null}>
            <World
              progressRef={progressRef}
              pointerRef={pointerRef}
              reducedMotion={reducedMotion}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="cinema-vignette" />

      <header className="minimal-nav">
        <a href="#intro" className="brand">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>

        <div className="progress">
          <span>{stage.label}</span>
          <i><b /></i>
          <span>PROTOTYPE / PHYSICS</span>
        </div>

        <span className="prototype-tag">WEBGL FOUNDATION</span>
      </header>

      <section className={'hud hud-' + stage.id} key={stage.id}>
        <span>{stage.label}</span>
        <h1>{stage.title}</h1>
        <p>{stage.note}</p>
      </section>

      {stageIndex === 0 && (
        <div className="scroll-cue">
          <span>SCROLL</span>
          <i />
        </div>
      )}

      <div className="prototype-scroll">
        {stages.map((item) => (
          <section id={item.id} key={item.id} className="scroll-segment" />
        ))}
      </div>
    </main>
  )
}
