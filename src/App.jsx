'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const FRAME_COUNT = 1500
const FPS = 30
const VIDEO_PARTS = Array.from(
  { length: 43 },
  (_, index) => `/media/fantasy-${String(index).padStart(2, '0')}.b64`,
)

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

const chapters = [
  {
    start: 0,
    end: 0.24,
    eyebrow: 'MYS TECH · EXPERIÊNCIAS DIGITAIS',
    title: <>Transformamos ideias em <em>experiências.</em></>,
    text: 'Sites, sistemas, automações e infraestrutura conectados em uma experiência digital clara, elegante e viva.',
    align: 'center',
  },
  {
    start: 0.19,
    end: 0.45,
    eyebrow: '01 · WEBSITES',
    title: <>Sites que não parecem <em>templates.</em></>,
    text: 'Interfaces autorais, movimento com propósito e uma navegação pensada para fazer a marca ser percebida — sem excesso visual.',
    align: 'left',
  },
  {
    start: 0.40,
    end: 0.66,
    eyebrow: '02 · SISTEMAS',
    title: <>Dados complexos.<br /><em>Decisões simples.</em></>,
    text: 'Dashboards, produtos digitais e ferramentas operacionais organizados para transformar informação em ação.',
    align: 'right',
  },
  {
    start: 0.61,
    end: 0.84,
    eyebrow: '03 · AUTOMAÇÃO & IA',
    title: <>Menos tarefa manual.<br /><em>Mais fluxo.</em></>,
    text: 'Integramos sistemas, inteligência artificial e automações para que a tecnologia trabalhe nos bastidores.',
    align: 'left',
  },
  {
    start: 0.79,
    end: 1,
    eyebrow: '04 · INFRAESTRUTURA',
    title: <>Do pixel à rede.<br /><em>Tudo conectado.</em></>,
    text: 'Design, software e telecom com a mesma lógica: performance, clareza e estrutura preparada para crescer.',
    align: 'right',
  },
]

const services = [
  {
    number: '01',
    title: 'Websites & experiências',
    text: 'Sites institucionais, landing pages e experiências interativas com identidade própria, performance e acabamento premium.',
  },
  {
    number: '02',
    title: 'Sistemas & produtos',
    text: 'Dashboards, portais, plataformas internas e produtos digitais construídos para processos reais.',
  },
  {
    number: '03',
    title: 'Automação & IA',
    text: 'Integrações, agentes, atendimento e fluxos inteligentes para reduzir trabalho manual e acelerar operação.',
  },
  {
    number: '04',
    title: 'Telecom & infraestrutura',
    text: 'Observabilidade, redes, BGP, GPON, backbone e consultoria técnica com visão de campo e operação.',
  },
]

const projects = [
  {
    tag: 'MONITORAMENTO',
    title: 'Mys Monitoring',
    text: 'Operação multiempresa com eventos, PPPoE, ONUs, alarmes, indicadores e inteligência operacional em uma única visão.',
  },
  {
    tag: 'WEBSITES',
    title: 'Experiências sob medida',
    text: 'Interfaces institucionais e comerciais com direção visual própria, responsividade e interações que acompanham a narrativa.',
  },
  {
    tag: 'AUTOMAÇÃO',
    title: 'Fluxos inteligentes',
    text: 'Integrações de atendimento, dados e IA para transformar processos fragmentados em uma jornada contínua.',
  },
]

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Logo({ dark = false }) {
  return (
    <a className={`brand ${dark ? 'brand-dark' : ''}`} href="#inicio" aria-label="Mys Tech — início">
      <span className="brand-mark">
        <img src="/mys-logo.svg" alt="" />
      </span>
      <span>Mys Tech</span>
    </a>
  )
}

function Chapter({ chapter, index, setRef }) {
  return (
    <article
      ref={setRef(index)}
      className={`chapter chapter-${chapter.align}`}
      aria-hidden={index === 0 ? undefined : true}
    >
      <span className="chapter-eyebrow">{chapter.eyebrow}</span>
      <h1>{chapter.title}</h1>
      <p>{chapter.text}</p>
      {index === 0 ? (
        <div className="hero-actions">
          <a className="button button-cream" href="#servicos">
            Explorar a Mys Tech <Arrow />
          </a>
          <span className="scroll-hint">
            <i />
            Role para navegar
          </span>
        </div>
      ) : (
        <a className="chapter-link" href="#servicos">
          Ver nossas capacidades <Arrow />
        </a>
      )}
    </article>
  )
}

function ImmersiveHero() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const chapterRefs = useRef([])
  const progressBarRef = useRef(null)
  const stageRef = useRef(null)
  const filmRef = useRef(null)
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
          if (!cancelled) {
            setLoadProgress(Math.round(((i + 1) / VIDEO_PARTS.length) * 100))
          }
        }

        if (cancelled) return

        const base64 = parts.join('').replace(/\s/g, '')
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)

        for (let i = 0; i < binary.length; i += 1) {
          bytes[i] = binary.charCodeAt(i)
        }

        objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }))
        setVideoUrl(objectUrl)
      } catch (error) {
        console.error('Não foi possível carregar a experiência:', error)
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

    let frameId = 0
    let lastFrame = -1

    const render = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = clamp(-rect.top / scrollable)
      const duration = Number.isFinite(video.duration) ? video.duration : 0
      const targetFrame = Math.round(progress * (FRAME_COUNT - 1))
      const targetTime = duration > 0
        ? Math.min(targetFrame / FPS, Math.max(0, duration - (1 / FPS)))
        : 0

      if (targetFrame !== lastFrame) {
        video.currentTime = targetTime
        lastFrame = targetFrame
      }

      chapterRefs.current.forEach((node, index) => {
        if (!node) return
        const chapter = chapters[index]
        const fadeWindow = Math.min(0.055, (chapter.end - chapter.start) * 0.28)
        const fadeIn = ease((progress - chapter.start) / fadeWindow)
        const fadeOut = 1 - ease((progress - (chapter.end - fadeWindow)) / fadeWindow)
        const visibility = clamp(Math.min(fadeIn, fadeOut))

        node.style.opacity = visibility.toFixed(3)
        node.style.transform = `translate3d(0, ${(1 - visibility) * 24}px, 0)`
        node.style.pointerEvents = visibility > 0.76 ? 'auto' : 'none'
      })

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.015, progress)})`
      }

      if (stageRef.current) {
        const stage = Math.min(chapters.length, Math.floor(progress * chapters.length) + 1)
        stageRef.current.textContent = String(stage).padStart(2, '0')
      }

      if (filmRef.current) {
        const zoom = 1.035 + progress * 0.035
        filmRef.current.style.transform = `scale(${zoom})`
      }

      frameId = 0
    }

    const requestRender = () => {
      if (!frameId) frameId = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)

    return () => {
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [videoReady])

  useEffect(() => {
    const hero = sectionRef.current
    const film = filmRef.current
    if (!hero || !film) return undefined

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      film.style.setProperty('--pointer-x', `${x * 8}px`)
      film.style.setProperty('--pointer-y', `${y * 5}px`)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  const setChapterRef = (index) => (node) => {
    chapterRefs.current[index] = node
  }

  return (
    <section className="immersive" id="inicio" ref={sectionRef}>
      <div className="immersive-sticky">
        <div className="film-shell" aria-hidden="true">
          {videoUrl && (
            <video
              ref={videoRef}
              className="film-video"
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
          <div className="film-motion" ref={filmRef} />
          <div className="film-wash" />
          <div className="film-vignette" />
          <div className="film-grain" />
        </div>

        {!videoReady && (
          <div className="loader">
            <div className="loader-logo"><img src="/mys-logo.svg" alt="" /></div>
            <span>Preparando experiência</span>
            <div className="loader-track"><i style={{ width: `${loadProgress}%` }} /></div>
            <small>{loadProgress}%</small>
          </div>
        )}

        <header className="hero-nav">
          <Logo dark />
          <nav className="nav-pill" aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#servicos">Capacidades</a>
            <a href="#projetos">Projetos</a>
            <a href="#contato">Contato</a>
          </nav>
          <a
            className="button button-dark nav-button"
            href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech."
            target="_blank"
            rel="noreferrer"
          >
            Criar projeto <Arrow />
          </a>
        </header>

        <div className="hero-copy">
          {chapters.map((chapter, index) => (
            <Chapter
              key={chapter.eyebrow}
              chapter={chapter}
              index={index}
              setRef={setChapterRef}
            />
          ))}
        </div>

        <aside className="hero-note">
          <div className="note-head">
            <span className="note-dot" />
            <strong>Mys Core™</strong>
          </div>
          <p>
            Um mesmo raciocínio conectando design, software, automação e infraestrutura
            para reduzir ruído e transformar tecnologia em resultado.
          </p>
          <div className="note-actions">
            <a className="button button-cream button-small" href="#servicos">Descobrir</a>
            <a className="text-button" href="#projetos">Ver projetos</a>
          </div>
        </aside>

        <aside className="hero-status">
          <div className="status-orb"><span /></div>
          <div className="status-copy">
            <span>Jornada interativa</span>
            <strong><b ref={stageRef}>01</b> / 05</strong>
          </div>
        </aside>

        <div className="scroll-progress" aria-hidden="true">
          <i ref={progressBarRef} />
        </div>
      </div>
    </section>
  )
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.16 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <main className="site">
      <ImmersiveHero />

      <section className="intro-section" id="servicos">
        <Reveal className="intro-grid">
          <div>
            <span className="section-label">O QUE FAZEMOS</span>
            <h2>Da primeira impressão<br />à operação por trás.</h2>
          </div>
          <div className="intro-copy">
            <p>
              Criamos tecnologia como uma experiência contínua. O visual apresenta,
              o sistema organiza, a automação acelera e a infraestrutura sustenta.
            </p>
            <a className="under-link" href="#projetos">Conhecer projetos <Arrow /></a>
          </div>
        </Reveal>

        <div className="service-list">
          {services.map((service) => (
            <Reveal className="service-row" key={service.number}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Arrow />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projetos">
        <Reveal className="projects-head">
          <span className="section-label section-label-light">PROJETOS / PRODUTOS</span>
          <h2>Construído para ser usado.<br /><em>Não só visto.</em></h2>
          <p>
            Produtos e experiências que misturam interface, dados e engenharia sem
            transformar a tecnologia no protagonista.
          </p>
        </Reveal>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal className="project-card" key={project.title}>
              <div className="project-visual">
                <span className="project-index">0{index + 1}</span>
                <div className="project-orbit">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project-content">
                <span>{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <a href="#contato">Conversar sobre algo assim <Arrow /></a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="method-section">
        <Reveal className="method-head">
          <span className="section-label">COMO TRABALHAMOS</span>
          <h2>Menos efeito.<br />Mais intenção.</h2>
        </Reveal>

        <div className="method-flow">
          <Reveal className="method-step">
            <span>01</span>
            <strong>Entender</strong>
            <p>Objetivo, público, processo e o que realmente precisa mudar.</p>
          </Reveal>
          <Reveal className="method-step">
            <span>02</span>
            <strong>Desenhar</strong>
            <p>Arquitetura, linguagem visual, experiência e comportamento.</p>
          </Reveal>
          <Reveal className="method-step">
            <span>03</span>
            <strong>Construir</strong>
            <p>Desenvolvimento, integrações, performance e responsividade.</p>
          </Reveal>
          <Reveal className="method-step">
            <span>04</span>
            <strong>Evoluir</strong>
            <p>Medição, melhoria contínua e novas camadas quando fizer sentido.</p>
          </Reveal>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <Reveal className="contact-inner">
          <span className="section-label section-label-light">PRÓXIMO PROJETO</span>
          <h2>Tem uma ideia?<br /><em>Vamos dar forma a ela.</em></h2>
          <div className="contact-bottom">
            <p>
              Conte onde você está e onde quer chegar. A gente desenha o caminho,
              a experiência e a tecnologia que conecta os dois pontos.
            </p>
            <a
              className="button button-cream contact-button"
              href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech."
              target="_blank"
              rel="noreferrer"
            >
              Falar com a Mys Tech <Arrow />
            </a>
          </div>
        </Reveal>

        <footer className="footer">
          <Logo />
          <span>© {year} Mys Tech</span>
          <span>Pouso Alegre · MG</span>
        </footer>
      </section>
    </main>
  )
}
