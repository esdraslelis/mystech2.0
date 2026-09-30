'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const mix = (a, b, t) => a + (b - a) * t
const smooth = (t) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

const chapters = [
  {
    kicker: 'MYS TECH · EXPERIÊNCIAS DIGITAIS',
    title: <>Tecnologia que parece <em>um lugar.</em></>,
    text: 'Uma experiência digital construída para ser explorada. Websites, sistemas, automação e infraestrutura conectados em uma única narrativa.',
    align: 'left',
  },
  {
    kicker: '01 · WEBSITES',
    title: <>Presença que cria <em>memória.</em></>,
    text: 'Design autoral, movimento e conteúdo trabalhando juntos para transformar a primeira impressão em percepção de valor.',
    align: 'right',
  },
  {
    kicker: '02 · SISTEMAS',
    title: <>Complexidade por trás. <em>Clareza na frente.</em></>,
    text: 'Produtos e dashboards que organizam dados reais, reduzem ruído e ajudam equipes a tomar decisões mais rápidas.',
    align: 'left',
  },
  {
    kicker: '03 · AUTOMAÇÃO & IA',
    title: <>Menos tarefas. <em>Mais fluxo.</em></>,
    text: 'Integrações, IA e automações operando em segundo plano para conectar processos sem aumentar a fricção.',
    align: 'right',
  },
  {
    kicker: '04 · INFRAESTRUTURA',
    title: <>Do pixel à rede. <em>Tudo conectado.</em></>,
    text: 'Telecom, observabilidade e infraestrutura sustentando a experiência com a mesma precisão do design.',
    align: 'left',
  },
]

const services = [
  ['01', 'Websites', 'Experiências digitais responsivas, rápidas e construídas sem cara de template.'],
  ['02', 'Sistemas', 'Produtos, dashboards e ferramentas internas desenhados para processos reais.'],
  ['03', 'Automação & IA', 'Fluxos inteligentes e integrações que reduzem etapas e trabalho manual.'],
  ['04', 'Telecom & infraestrutura', 'Redes, observabilidade e operação técnica com visão de ponta a ponta.'],
]

const projects = [
  {
    number: '01',
    title: 'Mys Monitoring',
    label: 'Produto próprio',
    text: 'Monitoramento multiempresa reunindo PPPoE, ONUs, eventos, alarmes e operação em uma visão única.',
  },
  {
    number: '02',
    title: 'Experiências web',
    label: 'Websites interativos',
    text: 'Sites com narrativa, movimento e direção visual pensados para marcas que não querem parecer iguais.',
  },
  {
    number: '03',
    title: 'Fluxos inteligentes',
    label: 'Automação',
    text: 'Sistemas e integrações conectando atendimento, dados, IA e operação sem criar mais ferramentas para a equipe.',
  },
]

function seeded(seed) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function mountainPath(ctx, width, base, amplitude, roughness, seed, offset = 0) {
  const rand = seeded(seed)
  ctx.beginPath()
  ctx.moveTo(0, base)
  const step = roughness
  for (let x = -step; x <= width + step; x += step) {
    const major = Math.sin((x + offset) * 0.0016) * amplitude * 0.28
    const minor = Math.sin((x + offset) * 0.0047) * amplitude * 0.13
    const random = (rand() - 0.5) * amplitude * 0.72
    ctx.lineTo(x, base - amplitude * 0.52 - major - minor - random)
  }
  ctx.lineTo(width, 2160)
  ctx.lineTo(0, 2160)
  ctx.closePath()
}

function drawFog(ctx, rand, y, count, alpha, spread = 760) {
  for (let i = 0; i < count; i += 1) {
    const x = rand() * 3840
    const yy = y + (rand() - 0.5) * 280
    const rx = 240 + rand() * spread
    const ry = 70 + rand() * 150
    const gradient = ctx.createRadialGradient(x, yy, 0, x, yy, rx)
    gradient.addColorStop(0, `rgba(238,244,238,${alpha * (0.52 + rand() * 0.35)})`)
    gradient.addColorStop(0.56, `rgba(217,228,221,${alpha * 0.22})`)
    gradient.addColorStop(1, 'rgba(210,225,218,0)')
    ctx.save()
    ctx.scale(1, ry / rx)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, yy * (rx / ry), rx, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawStructure(ctx, x, y, scale, warm = true) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.shadowColor = 'rgba(0,0,0,.36)'
  ctx.shadowBlur = 55
  ctx.fillStyle = 'rgba(12,24,25,.94)'
  ctx.beginPath()
  ctx.roundRect(-270, -95, 540, 190, 22)
  ctx.fill()
  ctx.shadowBlur = 0

  const glass = ctx.createLinearGradient(-200, -90, 250, 80)
  glass.addColorStop(0, 'rgba(31,51,56,.88)')
  glass.addColorStop(0.48, 'rgba(19,36,40,.88)')
  glass.addColorStop(1, 'rgba(11,25,29,.95)')
  ctx.fillStyle = glass
  ctx.beginPath()
  ctx.roundRect(-240, -70, 480, 135, 14)
  ctx.fill()

  for (let i = 0; i < 9; i += 1) {
    const xx = -210 + i * 52
    ctx.strokeStyle = 'rgba(210,229,229,.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(xx, -65)
    ctx.lineTo(xx, 58)
    ctx.stroke()
  }

  if (warm) {
    const glow = ctx.createRadialGradient(55, 0, 0, 55, 0, 210)
    glow.addColorStop(0, 'rgba(255,194,108,.42)')
    glow.addColorStop(1, 'rgba(255,180,88,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(55, 0, 210, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(235,246,243,.22)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(-270, -95, 540, 190, 22)
  ctx.stroke()
  ctx.restore()
}

function renderLandscape(canvas, variant = 0) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const rand = seeded(9301 + variant * 733)

  const palettes = [
    ['#d8d0ba', '#8ca198', '#173229', '#071712'],
    ['#c7d2d0', '#718d8b', '#183236', '#07171a'],
    ['#dccfbf', '#8a9889', '#263629', '#10170f'],
  ]
  const [skyTop, skyBottom, middle, deep] = palettes[variant % palettes.length]

  const sky = ctx.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, skyTop)
  sky.addColorStop(0.5, skyBottom)
  sky.addColorStop(1, deep)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)

  const sunX = variant === 1 ? 3020 : variant === 2 ? 780 : 2720
  const sunY = variant === 2 ? 390 : 460
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 820)
  sun.addColorStop(0, 'rgba(255,245,207,.98)')
  sun.addColorStop(0.08, 'rgba(255,224,160,.68)')
  sun.addColorStop(0.42, 'rgba(250,207,133,.15)')
  sun.addColorStop(1, 'rgba(255,205,130,0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, W, H)

  // distant mountain ranges
  const distant = ['rgba(83,103,94,.28)', 'rgba(51,76,70,.42)', 'rgba(28,59,52,.58)']
  ;[
    [1390, 260, 150, 11],
    [1530, 390, 190, 29],
    [1680, 520, 230, 47],
  ].forEach(([base, amp, rough, seed], index) => {
    mountainPath(ctx, W, base, amp, rough, seed + variant * 61, variant * 420)
    ctx.fillStyle = distant[index]
    ctx.fill()
  })

  drawFog(ctx, rand, 1160, 22, 0.42, 620)

  // canyon walls
  mountainPath(ctx, W, 1860, 680, 165, 94 + variant * 17, -430)
  const foreground = ctx.createLinearGradient(0, 1050, 0, 2160)
  foreground.addColorStop(0, middle)
  foreground.addColorStop(1, deep)
  ctx.fillStyle = foreground
  ctx.fill()

  // river / valley opening
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const river = ctx.createLinearGradient(1840, 1100, 2130, 2160)
  river.addColorStop(0, 'rgba(193,219,211,.2)')
  river.addColorStop(0.44, 'rgba(104,166,155,.48)')
  river.addColorStop(1, 'rgba(55,113,103,.78)')
  ctx.fillStyle = river
  ctx.beginPath()
  ctx.moveTo(1830 + variant * 120, 1180)
  ctx.bezierCurveTo(2030, 1400, 1670, 1630, 1900, 2160)
  ctx.lineTo(2600, 2160)
  ctx.bezierCurveTo(2340, 1650, 2520, 1420, 2240 + variant * 90, 1180)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // waterfalls
  const falls = variant === 0
    ? [[1080, 1135, 92], [2860, 1230, 116], [3080, 1320, 54]]
    : variant === 1
      ? [[720, 1280, 70], [2440, 1180, 120], [3180, 1370, 72]]
      : [[990, 1240, 110], [2740, 1190, 88], [3260, 1450, 58]]
  falls.forEach(([x, y, width], i) => {
    const len = 390 + i * 110
    const g = ctx.createLinearGradient(x, y, x, y + len)
    g.addColorStop(0, 'rgba(238,246,240,.78)')
    g.addColorStop(0.5, 'rgba(184,217,209,.38)')
    g.addColorStop(1, 'rgba(202,231,226,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(x - width / 2, y)
    ctx.bezierCurveTo(x - width * .6, y + len * .32, x - width * .32, y + len * .68, x - width * .18, y + len)
    ctx.lineTo(x + width * .18, y + len)
    ctx.bezierCurveTo(x + width * .28, y + len * .66, x + width * .6, y + len * .28, x + width / 2, y)
    ctx.closePath()
    ctx.fill()
  })

  // forests / light speckles
  for (let i = 0; i < 420; i += 1) {
    const x = rand() * W
    const y = 980 + rand() * 1180
    const radius = 3 + rand() * 14
    ctx.fillStyle = rand() > .76 ? 'rgba(129,154,121,.38)' : 'rgba(21,48,35,.5)'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  if (variant === 0) {
    drawStructure(ctx, 2910, 1140, 1.22)
    drawStructure(ctx, 3190, 900, .72)
  } else if (variant === 1) {
    drawStructure(ctx, 970, 1260, 1.05)
    drawStructure(ctx, 3070, 1060, 1.25)
  } else {
    drawStructure(ctx, 2270, 1110, 1.35)
  }

  drawFog(ctx, rand, 1560, 18, 0.30, 540)

  // bridge / route
  ctx.strokeStyle = 'rgba(209,219,207,.23)'
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.moveTo(1320, 1410)
  ctx.bezierCurveTo(1710, 1300, 2050, 1350, 2510, 1450)
  ctx.stroke()

  // cinematic vignette
  const vignette = ctx.createRadialGradient(W * .52, H * .45, H * .24, W * .52, H * .48, H * 1.05)
  vignette.addColorStop(0, 'rgba(4,14,11,0)')
  vignette.addColorStop(.7, 'rgba(4,14,11,.18)')
  vignette.addColorStop(1, 'rgba(2,9,7,.72)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, W, H)

  // subtle grain
  ctx.globalAlpha = .05
  for (let i = 0; i < 8000; i += 1) {
    const v = Math.floor(rand() * 255)
    ctx.fillStyle = `rgb(${v},${v},${v})`
    ctx.fillRect(rand() * W, rand() * H, 1 + rand() * 2, 1 + rand() * 2)
  }
  ctx.globalAlpha = 1
}

function SceneCanvas({ progress }) {
  const canvasRef = useRef(null)
  const sourceRef = useRef([])
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    sourceRef.current = Array.from({ length: 3 }, (_, index) => {
      const canvas = document.createElement('canvas')
      canvas.width = 3840
      canvas.height = 2160
      renderLandscape(canvas, index)
      return canvas
    })

    const onPointer = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointerRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => window.removeEventListener('pointermove', onPointer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const sources = sourceRef.current
    if (!canvas || sources.length !== 3) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const scaled = progress * 2
    const index = Math.min(1, Math.floor(scaled))
    const local = scaled - index
    const eased = smooth(local)
    const px = pointerRef.current.x
    const py = pointerRef.current.y

    const draw = (source, alpha, layerIndex) => {
      const sourceRatio = source.width / source.height
      const viewportRatio = width / height
      let sw = source.width
      let sh = source.height
      if (viewportRatio > sourceRatio) {
        sh = source.width / viewportRatio
      } else {
        sw = source.height * viewportRatio
      }

      const zoom = 1 + progress * .08 + layerIndex * .018
      sw /= zoom
      sh /= zoom

      const baseX = (source.width - sw) / 2
      const baseY = (source.height - sh) / 2
      const parallaxX = px * 34 * (1 + layerIndex * .25)
      const parallaxY = py * 20 * (1 + layerIndex * .2)

      ctx.globalAlpha = alpha
      ctx.drawImage(
        source,
        clamp(baseX + parallaxX, 0, source.width - sw),
        clamp(baseY + parallaxY + progress * 48, 0, source.height - sh),
        sw,
        sh,
        0,
        0,
        width,
        height,
      )
    }

    draw(sources[index], 1 - eased, index)
    draw(sources[index + 1], eased, index + 1)
    ctx.globalAlpha = 1
  }, [progress])

  return <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label="Mys Tech">
      <span className="brand-mark"><img src="/mys-logo.svg" alt="" /></span>
      <span>Mys Tech</span>
    </a>
  )
}

function HeroExperience() {
  const rootRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let raf = 0
    const update = () => {
      const rect = root.getBoundingClientRect()
      const total = Math.max(1, root.offsetHeight - window.innerHeight)
      const next = clamp(-rect.top / total)
      setProgress(next)
      setStage(Math.min(chapters.length - 1, Math.floor(next * chapters.length)))
      raf = 0
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={rootRef} className="experience" id="inicio">
      <div className="experience-sticky">
        <SceneCanvas progress={progress} />
        <div className="scene-overlay" aria-hidden="true" />
        <div className="scene-grid" aria-hidden="true" />

        <header className="topbar">
          <Brand />
          <nav className="nav-pill" aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#servicos">Serviços</a>
            <a href="#projetos">Projetos</a>
            <a href="#processo">Processo</a>
            <a href="#contato">Contato</a>
          </nav>
          <a className="top-cta" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
            Criar projeto <Arrow />
          </a>
        </header>

        <div className="chapter-stage">
          {chapters.map((chapter, index) => {
            const center = index / (chapters.length - 1)
            const distance = Math.abs(progress - center)
            const visibility = clamp(1 - distance / .21)
            return (
              <article
                className={`chapter chapter-${chapter.align}`}
                key={chapter.kicker}
                style={{
                  opacity: visibility,
                  transform: `translate3d(0,${(1 - visibility) * 28}px,0)`,
                  pointerEvents: visibility > .78 ? 'auto' : 'none',
                }}
              >
                <span className="chapter-kicker">{chapter.kicker}</span>
                <h1>{chapter.title}</h1>
                <p>{chapter.text}</p>
                <div className="chapter-actions">
                  <a className="btn btn-light" href="#servicos">Explorar <Arrow /></a>
                  <a className="link-line" href="#projetos">Ver projetos</a>
                </div>
              </article>
            )
          })}
        </div>

        <div className="world-marker marker-a" style={{ opacity: clamp(1 - Math.abs(progress - .28) / .2) }}>
          <i />
          <span>Presença digital</span>
        </div>
        <div className="world-marker marker-b" style={{ opacity: clamp(1 - Math.abs(progress - .52) / .2) }}>
          <i />
          <span>Operação inteligente</span>
        </div>
        <div className="world-marker marker-c" style={{ opacity: clamp(1 - Math.abs(progress - .76) / .2) }}>
          <i />
          <span>Infraestrutura real</span>
        </div>

        <aside className="experience-index">
          <span>JORNADA</span>
          <strong>0{stage + 1}</strong>
          <div className="index-track">
            {chapters.map((_, index) => <i className={index === stage ? 'active' : ''} key={index} />)}
          </div>
          <small>05</small>
        </aside>

        <aside className="hero-footnote">
          <span className="pulse-dot" />
          <div>
            <strong>Imagens 4K geradas em tempo real</strong>
            <span>3840 × 2160 · scroll + parallax</span>
          </div>
        </aside>

        <div className="bottom-progress"><i style={{ transform: `scaleX(${Math.max(.01, progress)})` }} /></div>
      </div>
    </section>
  )
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('visible')
        observer.unobserve(node)
      }
    }, { threshold: .14 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <main className="site">
      <HeroExperience />

      <section className="light-section services-section" id="servicos">
        <Reveal className="section-intro">
          <span className="eyebrow">CAPACIDADES</span>
          <h2>Do visual à operação.<br /><em>Sem quebrar a experiência.</em></h2>
          <p>A Mys Tech une criação, software e infraestrutura para construir soluções que funcionam como um sistema único — bonitas na frente e sólidas por trás.</p>
        </Reveal>

        <div className="service-list">
          {services.map(([number, title, text]) => (
            <Reveal className="service-item" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Arrow />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="dark-section projects-section" id="projetos">
        <Reveal className="projects-title">
          <span className="eyebrow eyebrow-light">PROJETOS / PRODUTOS</span>
          <h2>Construído para ser usado.<br /><em>Não só visto.</em></h2>
        </Reveal>

        <div className="project-grid">
          {projects.map((project) => (
            <Reveal className="project-card" key={project.number}>
              <div className="project-image">
                <span>{project.number}</span>
                <div className="orbital">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project-copy">
                <small>{project.label}</small>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <a href="#contato">Conversar sobre isso <Arrow /></a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="light-section process-section" id="processo">
        <Reveal className="process-head">
          <span className="eyebrow">NOSSO PROCESSO</span>
          <h2>Uma direção.<br />Quatro movimentos.</h2>
        </Reveal>
        <div className="process-grid">
          {[
            ['01', 'Entender', 'Objetivo, público, processo e contexto real.'],
            ['02', 'Desenhar', 'Arquitetura, linguagem visual e comportamento.'],
            ['03', 'Construir', 'Código, integrações, performance e responsividade.'],
            ['04', 'Evoluir', 'Medição, melhoria e novas camadas quando fizer sentido.'],
          ].map(([n, t, p]) => (
            <Reveal className="process-card" key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contato">
        <Reveal className="contact-wrap">
          <span className="eyebrow eyebrow-light">PRÓXIMA EXPERIÊNCIA</span>
          <h2>Tem uma ideia?<br /><em>Vamos dar forma a ela.</em></h2>
          <div className="contact-row">
            <p>Conte o que você quer transformar. A gente desenha a experiência e a tecnologia necessária para colocar isso de pé.</p>
            <a className="btn btn-light contact-btn" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
              Falar com a Mys Tech <Arrow />
            </a>
          </div>
        </Reveal>

        <footer>
          <Brand />
          <span>© {year} Mys Tech</span>
          <span>Pouso Alegre · MG</span>
        </footer>
      </section>
    </main>
  )
}
