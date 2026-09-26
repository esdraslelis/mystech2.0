import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const chapters = [
  {
    id: 'institucional',
    number: '01',
    label: 'INSTITUCIONAL',
    kicker: 'MYS TECH / DIGITAL EXPERIENCE',
    lines: ['Tecnologia', 'que ganha', 'forma.'],
    body: 'Criamos websites, sistemas e experiências digitais com design, movimento e tecnologia.',
  },
  {
    id: 'websites',
    number: '02',
    label: 'WEBSITES',
    kicker: 'WEB EXPERIENCE',
    lines: ['Sites que', 'prendem', 'atenção.'],
    body: 'Interfaces rápidas, responsivas e interativas, construídas para transformar presença em percepção.',
  },
  {
    id: 'sistemas',
    number: '03',
    label: 'SISTEMAS',
    kicker: 'SYSTEMS + AI',
    lines: ['Dados que', 'viram', 'decisão.'],
    body: 'Sistemas sob medida, dashboards, automações e inteligência artificial aplicados à operação.',
  },
  {
    id: 'projetos',
    number: '04',
    label: 'PROJETOS',
    kicker: 'SELECTED WORK',
    lines: ['Projetos', 'feitos para', 'funcionar.'],
    body: 'Do site institucional ao sistema operacional: cada projeto nasce de um objetivo real.',
  },
  {
    id: 'contato',
    number: '05',
    label: 'CONTATO',
    kicker: 'START A PROJECT',
    lines: ['Vamos criar', 'algo que', 'se destaque.'],
    body: 'Conte sua ideia. A MysTech transforma em uma experiência digital completa.',
  },
]

function WebsiteDemo() {
  const [mode, setMode] = useState('desktop')
  return (
    <div className="demo-shell website-demo">
      <div className="demo-top">
        <div className="demo-dots"><i/><i/><i/></div>
        <div className="demo-address">mystech.com.br / experience</div>
        <div className="device-toggle">
          <button className={mode === 'desktop' ? 'active' : ''} onClick={() => setMode('desktop')}>Desktop</button>
          <button className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')}>Mobile</button>
        </div>
      </div>
      <div className={`site-preview ${mode}`}>
        <div className="preview-nav"><b>MYS.</b><span>Studio</span><span>Work</span><span>Contact</span></div>
        <div className="preview-content">
          <small>DIGITAL EXPERIENCE</small>
          <h3>Interfaces que respondem ao movimento.</h3>
          <p>Design, interação e performance no mesmo produto.</p>
          <button>Explorar experiência ↗</button>
        </div>
        <div className="preview-object"><span/><span/><span/></div>
      </div>
    </div>
  )
}

function SystemDemo() {
  const [tab, setTab] = useState('ia')
  return (
    <div className="demo-shell system-demo">
      <aside>
        <b>MYS SYSTEM</b>
        <button onClick={() => setTab('overview')} className={tab === 'overview' ? 'active' : ''}>Visão geral</button>
        <button onClick={() => setTab('ia')} className={tab === 'ia' ? 'active' : ''}>Assistente IA</button>
        <button onClick={() => setTab('ops')} className={tab === 'ops' ? 'active' : ''}>Operação</button>
      </aside>
      <div className="system-view">
        <div className="system-bar"><span>Operação em tempo real</span><i>● online</i></div>
        {tab === 'ia' && (
          <div className="ai-view">
            <small>ASSISTENTE OPERACIONAL</small>
            <h3>O que precisa de atenção?</h3>
            <div className="message user">Analise os principais riscos de hoje.</div>
            <div className="message ai">
              <b>Encontrei 3 pontos críticos</b>
              <span>02 regiões acima do SLA esperado</span>
              <span>14 chamados concentrados no mesmo setor</span>
              <span>Tendência de aumento no tempo médio</span>
            </div>
          </div>
        )}
        {tab === 'overview' && (
          <div className="metric-grid">
            <article><small>SLA</small><b>97.8%</b><span>+2.4%</span></article>
            <article><small>SUPORTE</small><b>24h</b><span>-31%</span></article>
            <article><small>NOTA</small><b>4.85</b><span>estável</span></article>
            <article className="wide"><small>OPERAÇÃO</small><div className="chart-bars"><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
          </div>
        )}
        {tab === 'ops' && (
          <div className="ops-list">
            <div><span>Massiva / Centro</span><b>Em análise</b></div>
            <div><span>Fila técnica / Sul</span><b>06 chamados</b></div>
            <div><span>Backbone / Norte</span><b>Normal</b></div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsDemo() {
  return (
    <div className="demo-shell projects-demo">
      <div className="projects-title"><small>SELECTED PROJECTS</small><b>Digital products built to work.</b></div>
      <div className="projects-list">
        <article><span>01</span><h4>Website institucional</h4><p>Identidade, presença e conversão.</p><i>↗</i></article>
        <article><span>02</span><h4>Sistema operacional</h4><p>Dados, processos e gestão.</p><i>↗</i></article>
        <article><span>03</span><h4>Automação com IA</h4><p>Decisão e atendimento conectados.</p><i>↗</i></article>
      </div>
    </div>
  )
}

function Showcase({ activeChapter }) {
  if (activeChapter === 1) return <WebsiteDemo />
  if (activeChapter === 2) return <SystemDemo />
  if (activeChapter === 3) return <ProjectsDemo />
  return null
}

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
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
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveChapter(Number(visible.target.dataset.chapter))
    }, { threshold: [0.42, 0.55, 0.7] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const active = chapters[activeChapter]

  return (
    <main className="site-shell">
      <header className="nav">
        <a className="brand" href="#institucional"><span className="brand-orb">M</span><span>MYS TECH</span></a>
        <nav className="nav-menu">
          {chapters.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label[0] + item.label.slice(1).toLowerCase()}</a>)}
        </nav>
        <div className="nav-status"><b>{active.number}</b><span>{active.label}</span></div>
      </header>

      <div className="map-stage">
        <Canvas dpr={[1, 1.65]} camera={{ position: [7.2, 7.4, 14.5], fov: 33 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <MystechScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="fixed-content" key={activeChapter}>
        <div className="copy-panel">
          <div className="copy-meta"><span>{active.number}</span><span>{active.kicker}</span></div>
          <h1>
            {active.lines.map((line, i) => <span className="reveal-line" style={{ '--delay': `${i * 90}ms` }} key={line}><b>{line}</b></span>)}
          </h1>
          <p className="reveal-body">{active.body}</p>
          {activeChapter === 0 && <div className="scroll-note"><span/>SCROLL TO EXPLORE</div>}
          {activeChapter === 4 && (
            <div className="contact-actions">
              <a className="project-link" href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">INICIAR PROJETO <span>↗</span></a>
              <a className="text-link" href="mailto:contato@mystech.com.br">contato@mystech.com.br</a>
            </div>
          )}
        </div>
        <div className="showcase-wrap"><Showcase activeChapter={activeChapter} /></div>
      </div>

      <div className="story">
        {chapters.map((chapter, index) => <section id={chapter.id} data-chapter={index} className="scroll-stop" key={chapter.id} />)}
      </div>
    </main>
  )
}
