import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const chapters = [
  {
    id: 'visao',
    number: '01',
    label: 'VISÃO',
    eyebrow: 'TECNOLOGIA QUE CONSTRÓI O AMANHÃ',
    lines: ['Transformamos', 'ideias em', 'experiências digitais', 'e sistemas de alto impacto.'],
    body: 'Websites, sistemas e soluções sob medida para empresas que querem ir além. Design, tecnologia e estratégia para transformar potencial em resultado real.',
  },
  {
    id: 'servicos',
    number: '02',
    label: 'SERVIÇOS',
    eyebrow: 'WEBSITES + SISTEMAS + IA',
    lines: ['Experiências', 'digitais que', 'trabalham por você.'],
    body: 'Sites institucionais, landing pages, sistemas internos, dashboards e automações com IA em uma única estrutura digital.',
  },
  {
    id: 'projetos',
    number: '03',
    label: 'PROJETOS',
    eyebrow: 'PROJETOS SELECIONADOS',
    lines: ['Cada projeto', 'resolve um', 'problema real.'],
    body: 'Criamos experiências sob medida, com estratégia, interface, desenvolvimento e evolução contínua.',
  },
  {
    id: 'tecnologia',
    number: '04',
    label: 'TECNOLOGIA',
    eyebrow: 'INTERAÇÃO + PERFORMANCE',
    lines: ['3D, motion,', 'dados e IA', 'no mesmo produto.'],
    body: 'A tecnologia entra para simplificar, impressionar e gerar valor — não apenas para decorar a tela.',
  },
  {
    id: 'processo',
    number: '05',
    label: 'PROCESSO',
    eyebrow: 'DO BRIEFING À PUBLICAÇÃO',
    lines: ['Estratégia.', 'Design.', 'Construção.'],
    body: 'Um processo objetivo, com decisões rápidas, validações visuais e desenvolvimento orientado ao resultado.',
  },
  {
    id: 'contato',
    number: '06',
    label: 'CONTATO',
    eyebrow: 'PRÓXIMO PROJETO',
    lines: ['Vamos construir', 'algo que', 'se destaque.'],
    body: 'Conte sua ideia e vamos transformar em uma experiência digital completa.',
  },
]

const projects = [
  {
    index: '01',
    title: 'Website Institucional',
    subtitle: 'Design estratégico para marcas que querem crescer.',
    description: 'Arquitetura de conteúdo, identidade visual, experiência responsiva, SEO técnico e páginas pensadas para apresentação e conversão.',
    tags: ['UI/UX', 'SEO', 'Responsivo'],
  },
  {
    index: '02',
    title: 'Sistema com IA',
    subtitle: 'Automação e inteligência para processos mais eficientes.',
    description: 'Dashboards operacionais, fluxos internos, automações, assistentes com IA e integração com APIs e sistemas existentes.',
    tags: ['IA', 'Dashboard', 'Automação'],
  },
  {
    index: '03',
    title: 'Dashboard Operacional',
    subtitle: 'Dados em tempo real para decisões mais inteligentes.',
    description: 'Indicadores, alertas, comparativos, mapas, filtros e relatórios em uma experiência rápida e visual.',
    tags: ['Dados', 'BI', 'Tempo real'],
  },
]

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [selectedProject, setSelectedProject] = useState(0)
  const [progress, setProgress] = useState(0)

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
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections = [...document.querySelectorAll('[data-chapter]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveChapter(Number(visible.target.dataset.chapter))
    }, { threshold: [0.45, 0.58, 0.7] })

    sections.forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const chapter = chapters[activeChapter]
  const project = projects[selectedProject]
  const progressPct = useMemo(() => Math.round(progress * 100), [progress])

  return (
    <main className="site-shell">
      <div className="map-stage">
        <Canvas dpr={[1, 1.7]} camera={{ position: [7.8, 7.1, 14.5], fov: 35 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <MystechScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="frame" />

      <header className="topbar">
        <a className="brand" href="#visao">
          <img src="/mys-logo.svg" alt="Mys Tech" />
          <span>MYS TECH</span>
        </a>

        <nav className="topnav">
          <a href="#visao">Institucional</a>
          <a href="#servicos">Websites</a>
          <a href="#servicos">Sistemas</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>

        <a className="top-cta" href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">
          <span>→</span> VAMOS CONVERSAR
        </a>
      </header>

      <aside className="chapter-nav">
        {chapters.map((item, index) => (
          <a key={item.id} href={`#${item.id}`} className={index === activeChapter ? 'active' : ''}>
            <span>{item.number}</span>
            <b>{item.label}</b>
          </a>
        ))}
      </aside>

      <section className="hero-copy" key={activeChapter}>
        <div className="eyebrow"><span>{chapter.eyebrow}</span><i /></div>
        <h1>
          {chapter.lines.map((line, index) => (
            <span
              key={line}
              className={`headline-line ${index === 1 && activeChapter === 0 ? 'accent-line' : ''}`}
              style={{ '--delay': `${index * 90}ms` }}
            >
              <b>{line}</b>
            </span>
          ))}
        </h1>
        <p>{chapter.body}</p>

        {activeChapter === 0 && (
          <div className="hero-actions">
            <a href="#projetos" className="primary-btn"><span>→</span> CONHEÇA NOSSOS PROJETOS</a>
            <button type="button" className="video-btn" onClick={() => setSelectedProject((selectedProject + 1) % projects.length)}>
              <span className="play">▶</span>
              <span>ALTERNAR<br/>DESTAQUE</span>
            </button>
          </div>
        )}

        {activeChapter === 5 && (
          <div className="hero-actions">
            <a href="https://wa.me/5535997541933" target="_blank" rel="noreferrer" className="primary-btn">
              <span>→</span> INICIAR PROJETO
            </a>
          </div>
        )}
      </section>

      <div className="map-label label-web">
        <span className="label-dot" />
        <div><b>WEBSITES</b><small>MARCAS QUE CONECTAM</small></div>
      </div>
      <div className="map-label label-system">
        <span className="label-dot" />
        <div><b>SISTEMAS</b><small>PROCESSOS QUE EVOLUEM</small></div>
      </div>
      <div className="map-label label-strategy">
        <span className="label-dot" />
        <div><b>ESTRATÉGIA</b><small>IDEIAS QUE VIRAM RESULTADOS</small></div>
      </div>
      <div className="map-label label-innovation">
        <span className="label-dot" />
        <div><b>INOVAÇÃO</b><small>TECNOLOGIA PARA NOVAS POSSIBILIDADES</small></div>
      </div>

      <section className="featured-projects">
        <div className="featured-head">
          <div><span>PROJETOS EM DESTAQUE</span><i /></div>
          <div className="carousel-controls">
            <button type="button" onClick={() => setSelectedProject((selectedProject + projects.length - 1) % projects.length)}>←</button>
            <button type="button" onClick={() => setSelectedProject((selectedProject + 1) % projects.length)}>→</button>
          </div>
        </div>

        <div className="project-grid">
          {projects.map((item, index) => (
            <button
              type="button"
              key={item.index}
              className={`project-card ${selectedProject === index ? 'active' : ''}`}
              onClick={() => setSelectedProject(index)}
            >
              <span className="project-index">{item.index}</span>
              <div className="project-visual">
                <div className={`mini-ui mini-${index + 1}`}>
                  <span /><span /><span />
                </div>
              </div>
              <div className="project-copy">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <div className="project-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <span className="project-arrow">↗</span>
            </button>
          ))}
        </div>

        <div className="project-detail">
          <div>
            <span className="detail-index">{project.index}</span>
            <strong>{project.title}</strong>
          </div>
          <p>{project.description}</p>
        </div>
      </section>

      <div className="bottom-left">
        <div className="mini-grid">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>
        <div><span>SCROLL</span><i /></div>
      </div>

      <div className="bottom-right">
        <span>EXPLORAR<br/>O NOSSO MUNDO</span>
        <div className="radar"><i /><b /></div>
      </div>

      <div className="progress-meter">
        <span>{String(progressPct).padStart(2, '0')}%</span>
        <i><b style={{ height: `${progressPct}%` }} /></i>
      </div>

      <div className="scroll-space">
        {chapters.map((item, index) => (
          <section key={item.id} id={item.id} data-chapter={index} className="scroll-chapter" />
        ))}
      </div>
    </main>
  )
}
