import { useEffect, useMemo, useRef, useState } from 'react'

const VIDEO_PARTS = Array.from({ length: 21 }, (_, index) => `/media/earth-${String(index).padStart(2, '0')}.b64`)

const chapters = [
  { start: 0.00, end: 0.22 },
  { start: 0.18, end: 0.43 },
  { start: 0.39, end: 0.64 },
  { start: 0.60, end: 0.83 },
  { start: 0.79, end: 1.00 },
]

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smooth = (t) => t * t * (3 - 2 * t)

function sceneVisibility(progress, start, end) {
  const fade = Math.min(0.055, (end - start) * 0.28)
  const fadeIn = smooth(clamp((progress - start) / fade))
  const fadeOut = 1 - smooth(clamp((progress - (end - fade)) / fade))
  return clamp(Math.min(fadeIn, fadeOut))
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Mys Tech — início">
      <img src="/mys-logo.svg" alt="" />
      <span>MYS TECH</span>
    </a>
  )
}

function CinematicScroll() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const sceneRefs = useRef([])
  const progressRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loadProgress, setLoadProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl = ''

    async function loadFilm() {
      try {
        const parts = []
        for (let i = 0; i < VIDEO_PARTS.length; i += 1) {
          const response = await fetch(VIDEO_PARTS[i], { cache: 'force-cache' })
          if (!response.ok) throw new Error(`Falha ao carregar parte ${i + 1}`)
          parts.push(await response.text())
          if (!cancelled) setLoadProgress(Math.round(((i + 1) / VIDEO_PARTS.length) * 100))
        }

        if (cancelled) return
        const base64 = parts.join('').replace(/\s/g, '')
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
        objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }))
        setVideoUrl(objectUrl)
      } catch (error) {
        console.error(error)
      }
    }

    loadFilm()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || !videoReady) return undefined

    let raf = 0
    let targetTime = 0
    let lastTime = -1

    const render = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = clamp(-rect.top / scrollable)
      const duration = Number.isFinite(video.duration) ? video.duration : 0
      targetTime = duration > 0 ? progress * Math.max(0, duration - 0.04) : 0

      if (Math.abs(targetTime - lastTime) > 0.025) {
        video.currentTime = targetTime
        lastTime = targetTime
      }

      sceneRefs.current.forEach((node, index) => {
        if (!node) return
        const visibility = sceneVisibility(progress, chapters[index].start, chapters[index].end)
        node.style.opacity = visibility.toFixed(3)
        node.style.transform = `translate3d(0, ${(1 - visibility) * 26}px, 0)`
        node.style.pointerEvents = visibility > 0.7 ? 'auto' : 'none'
      })

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${Math.max(0.012, progress)})`
      }
      raf = 0
    }

    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    return () => {
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [videoReady])

  const setSceneRef = (index) => (node) => {
    sceneRefs.current[index] = node
  }

  return (
    <section className="cinematic" id="inicio" ref={sectionRef}>
      <div className="cinematic-sticky">
        <div className="film" aria-hidden="true">
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={() => {
                if (videoRef.current) videoRef.current.currentTime = 0.01
                setVideoReady(true)
              }}
            />
          )}
          <div className="film-grade" />
          <div className="film-vignette" />
          <div className="film-noise" />
        </div>

        {!videoReady && (
          <div className="loader">
            <img src="/mys-logo.svg" alt="" />
            <div className="loader-line"><i style={{ width: `${loadProgress}%` }} /></div>
            <span>CARREGANDO EXPERIÊNCIA · {loadProgress}%</span>
          </div>
        )}

        <header className="topbar">
          <Brand />
          <nav>
            <a href="#capacidades">Capacidades</a>
            <a href="#manifesto">Método</a>
            <a href="#contato">Contato</a>
          </nav>
          <a className="nav-cta" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
            Iniciar projeto <Arrow />
          </a>
        </header>

        <div className="scroll-index" aria-hidden="true">
          <span>SCROLL</span>
          <div className="rail"><i ref={progressRef} /></div>
          <span>05</span>
        </div>

        <article className="scene scene-hero" ref={setSceneRef(0)}>
          <p className="kicker">DESIGN · DESENVOLVIMENTO · AUTOMAÇÃO · TELECOM</p>
          <h1>Construímos o digital<br />que move o <em>real.</em></h1>
          <p className="lead">Sites, sistemas, automações e infraestrutura técnica reunidos em uma única visão: tecnologia com presença, desempenho e propósito.</p>
          <div className="scene-actions">
            <a href="#capacidades" className="pill pill-light">Explorar a Mys Tech <Arrow /></a>
            <span>Role para navegar</span>
          </div>
        </article>

        <article className="scene scene-two" ref={setSceneRef(1)}>
          <span className="chapter">02 — UMA EMPRESA. VÁRIAS CAMADAS.</span>
          <h2>Não é só um site.<br />É o ecossistema inteiro.</h2>
          <p>Da primeira impressão do cliente à automação que trabalha por trás. Da interface ao dado. Da operação à rede.</p>
          <div className="mini-lines">
            <span><b>01</b> Web & experiência</span>
            <span><b>02</b> Sistemas & produto</span>
            <span><b>03</b> Automação & IA</span>
            <span><b>04</b> Telecom & infraestrutura</span>
          </div>
        </article>

        <article className="scene scene-three" ref={setSceneRef(2)}>
          <span className="chapter">03 — COMPLEXIDADE, SEM PESO</span>
          <h2>O avançado não precisa<br />parecer complicado.</h2>
          <p>A melhor tecnologia some da frente. Ela responde rápido, orienta a experiência e deixa o usuário pensar apenas no que importa.</p>
          <div className="metric-row">
            <div><strong>01</strong><small>Clareza</small></div>
            <div><strong>02</strong><small>Performance</small></div>
            <div><strong>03</strong><small>Escala</small></div>
          </div>
        </article>

        <article className="scene scene-four" ref={setSceneRef(3)}>
          <span className="chapter">04 — DA IDEIA À OPERAÇÃO</span>
          <h2>Uma linguagem para cada<br />problema. A mesma precisão.</h2>
          <p>Criamos experiências institucionais, produtos digitais e estruturas técnicas pensando no conjunto — não em peças soltas.</p>
          <a href="#capacidades" className="text-link">Ver o que construímos <Arrow /></a>
        </article>

        <article className="scene scene-five" ref={setSceneRef(4)}>
          <span className="chapter">05 — MYS TECH</span>
          <h2>Seu negócio já existe.<br /><em>Faça ele ser percebido.</em></h2>
          <p>Design com identidade. Engenharia por dentro. Movimento apenas quando ele tem função.</p>
          <a href="#contato" className="pill pill-light">Construir algo novo <Arrow /></a>
        </article>
      </div>
    </section>
  )
}

const capabilities = [
  ['01', 'Sites & experiências', 'Sites institucionais, landing pages, e-commerce e experiências interativas que apresentam a marca sem parecer template.'],
  ['02', 'Sistemas & produtos', 'Interfaces operacionais, dashboards e produtos digitais pensados para transformar processos em fluxo simples.'],
  ['03', 'Automação & IA', 'Integrações, agentes, WhatsApp e rotinas inteligentes para reduzir tarefas manuais e acelerar atendimento e operação.'],
  ['04', 'Telecom & infraestrutura', 'Projetos de rede, observabilidade, BGP, GPON, backbone e consultoria técnica com visão de operação real.'],
]

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <main className="site">
      <CinematicScroll />

      <section className="statement" id="manifesto">
        <div className="statement-mark"><img src="/mys-logo.svg" alt="" /></div>
        <div className="statement-copy">
          <span className="section-kicker">MYS TECH / MÉTODO</span>
          <h2>Primeiro entendemos.<br />Depois tiramos o excesso.</h2>
          <p>Uma boa solução não começa escolhendo animação, framework ou tendência. Começa entendendo o negócio. A partir daí, design e tecnologia entram apenas onde fazem diferença.</p>
        </div>
      </section>

      <section className="capabilities" id="capacidades">
        <div className="cap-head">
          <span className="section-kicker">CAPACIDADES</span>
          <h2>Da tela à infraestrutura.</h2>
          <p>Uma estrutura técnica ampla para construir presença, produto e operação sem perder coerência no caminho.</p>
        </div>
        <div className="cap-list">
          {capabilities.map(([index, title, description]) => (
            <article className="cap-item" key={title}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Arrow />
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <span className="section-kicker section-kicker-light">PRÓXIMO PROJETO</span>
        <div className="contact-grid">
          <h2>Vamos construir<br /><em>algo que fica.</em></h2>
          <div>
            <p>Conte o que você quer transformar. A gente organiza a ideia, define a experiência e constrói a tecnologia.</p>
            <a className="pill pill-light" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">Falar com a Mys Tech <Arrow /></a>
          </div>
        </div>
        <footer>
          <Brand />
          <span>© {year} Mys Tech</span>
          <span>Pouso Alegre · MG</span>
        </footer>
      </section>
    </main>
  )
}
