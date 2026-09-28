import { useEffect, useMemo, useState } from 'react'

const solutionItems = [
  {
    key: 'site',
    label: 'Site.',
    description: 'Presença digital clara, rápida e feita para valorizar a sua marca.',
  },
  {
    key: 'sistema',
    label: 'Sistema.',
    description: 'Interfaces sob medida para organizar operação, dados e processos.',
  },
  {
    key: 'automacao',
    label: 'Automação.',
    description: 'Fluxos inteligentes que reduzem tarefas repetitivas e conectam ferramentas.',
  },
  {
    key: 'infra',
    label: 'Infraestrutura.',
    description: 'Ambientes, redes e integrações pensados para funcionar com estabilidade.',
  },
]

const projects = [
  {
    name: 'AirBroker',
    type: 'Plataforma de aviação',
    kicker: 'Marketplace digital',
    copy: 'Uma experiência mais clara para navegar, comparar e apresentar aeronaves.',
    visual: 'air',
  },
  {
    name: 'Mys System',
    type: 'Sistema de gestão',
    kicker: 'Operação em tempo real',
    copy: 'Informação operacional organizada em uma interface objetiva e responsiva.',
    visual: 'system',
  },
  {
    name: 'Oston Cambuí',
    type: 'Site institucional',
    kicker: 'Saúde e confiança',
    copy: 'Arquitetura de informação e presença digital com leitura limpa e profissional.',
    visual: 'oston',
  },
]

const services = [
  ['Sites institucionais', 'Design, conteúdo e desenvolvimento para apresentar sua empresa com clareza.'],
  ['Sistemas web', 'Ferramentas sob medida para processos internos, clientes e operação.'],
  ['Automações', 'Integrações e fluxos para tirar trabalho manual do caminho.'],
  ['Dashboards', 'Dados organizados em telas realmente úteis para decisão.'],
  ['Infraestrutura', 'Projetos e integrações para redes, provedores e ambientes técnicos.'],
]

function Brand({ dark = true }) {
  return (
    <a className="brand" href="#inicio" aria-label="MysTech - início">
      <img src="/mys-logo.svg" alt="" />
      <span className={dark ? '' : 'brand-dark'}>MysTech</span>
      <i aria-hidden="true" />
    </a>
  )
}

function Arrow({ left = false }) {
  return <span aria-hidden="true">{left ? '←' : '→'}</span>
}

function HeroVisual() {
  return (
    <div className="hero-showcase" aria-hidden="true">
      <div className="hero-laptop">
        <div className="laptop-lid">
          <div className="laptop-screen">
            <div className="screen-nav">
              <span>MysTech</span>
              <span>Projetos&nbsp;&nbsp;&nbsp; Soluções&nbsp;&nbsp;&nbsp; Contato</span>
            </div>
            <div className="screen-copy">
              <small>SOLUÇÕES DIGITAIS</small>
              <strong>Soluções digitais<br />para grandes ideias.</strong>
              <span>Da estratégia à execução.</span>
            </div>
            <div className="arch-building">
              <i className="arch arch-a" />
              <i className="arch arch-b" />
              <i className="arch arch-c" />
            </div>
            <div className="screen-dot">↗</div>
          </div>
        </div>
        <div className="laptop-base" />
      </div>

      <div className="result-card">
        <span>Projetos digitais</span>
        <div className="mini-bars"><i/><i/><i/><i/><i/></div>
        <strong>Design + código</strong>
        <small>em uma única entrega</small>
      </div>

      <div className="hero-stone stone-a" />
      <div className="hero-stone stone-b" />
      <div className="hero-stone stone-c" />
    </div>
  )
}

function ProjectVisual({ project }) {
  if (project.visual === 'system') {
    return (
      <div className="project-ui system-ui" aria-hidden="true">
        <div className="ui-sidebar">
          <strong>M</strong>
          <i/><i/><i/><i/><i/>
        </div>
        <div className="ui-main">
          <div className="ui-top"><span>Visão geral</span><small>Últimos 30 dias</small></div>
          <div className="ui-title"><strong>Operação em movimento.</strong><span>Dados organizados para decidir mais rápido.</span></div>
          <div className="ui-stats"><i/><i/><i/></div>
          <div className="ui-chart"><b/><b/><b/><b/><b/><b/></div>
        </div>
      </div>
    )
  }

  if (project.visual === 'oston') {
    return (
      <div className="project-ui oston-ui" aria-hidden="true">
        <div className="oston-copy">
          <small>ORTOPEDIA ESPECIALIZADA</small>
          <strong>Cuidado preciso<br/>em cada movimento.</strong>
          <span>Informação clara. Presença profissional.</span>
          <button tabIndex="-1">Conheça</button>
        </div>
        <div className="oston-object"><i/><i/><i/></div>
      </div>
    )
  }

  return (
    <div className="project-ui air-ui" aria-hidden="true">
      <div className="air-nav"><strong>AirBroker</strong><span>Aeronaves&nbsp;&nbsp;&nbsp; Serviços&nbsp;&nbsp;&nbsp; Sobre</span></div>
      <div className="air-copy">
        <small>AVIAÇÃO · SEM RUÍDO</small>
        <strong>Explore novas<br/>possibilidades.</strong>
        <span>Catálogo, busca e descoberta em uma experiência direta.</span>
      </div>
      <div className="air-shape"><i/><b/></div>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSolution, setActiveSolution] = useState(1)
  const [activeProject, setActiveProject] = useState(0)
  const year = useMemo(() => new Date().getFullYear(), [])

  const orderedProjects = useMemo(() => (
    projects.map((_, i) => projects[(activeProject + i) % projects.length])
  ), [activeProject])

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    items.forEach((item) => observer.observe(item))

    const showcase = document.querySelector('.hero-showcase')
    const onMove = (event) => {
      if (!showcase || window.matchMedia('(pointer: coarse)').matches) return
      const rect = showcase.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      showcase.style.setProperty('--mx', x.toFixed(3))
      showcase.style.setProperty('--my', y.toFixed(3))
    }
    const onLeave = () => {
      if (!showcase) return
      showcase.style.setProperty('--mx', '0')
      showcase.style.setProperty('--my', '0')
    }
    showcase?.addEventListener('pointermove', onMove)
    showcase?.addEventListener('pointerleave', onLeave)

    return () => {
      observer.disconnect()
      showcase?.removeEventListener('pointermove', onMove)
      showcase?.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const nextProject = () => setActiveProject((current) => (current + 1) % projects.length)
  const prevProject = () => setActiveProject((current) => (current - 1 + projects.length) % projects.length)

  return (
    <main>
      <section className="hero" id="inicio">
        <header className="header">
          <Brand />
          <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegação principal">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
            <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </nav>
          <a className="header-cta" href="#contato">Fale com um especialista <Arrow /></a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <i/><i/>
          </button>
        </header>

        <div className="hero-inner">
          <div className="hero-copy" data-reveal>
            <span className="eyebrow">TECNOLOGIA QUE IMPULSIONA</span>
            <h1>Experiências<br/>digitais que<br/><em>fazem mais.</em></h1>
            <p>Sites, sistemas e automações sob medida para empresas que pensam no futuro.</p>
            <div className="hero-actions">
              <a className="btn btn-light" href="#contato">Começar um projeto <Arrow /></a>
              <a className="text-link" href="#solucoes">Conheça nossas soluções</a>
            </div>
            <div className="hero-tags" aria-label="Áreas de atuação">
              <span>Design</span>
              <span>Desenvolvimento</span>
              <span>Automação</span>
            </div>
          </div>
          <div className="hero-visual-wrap" data-reveal>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="solution-strip" id="solucoes" data-reveal>
        <div className="solution-left">
          <span className="eyebrow">NOSSAS SOLUÇÕES</span>
          <div className="solution-tabs" role="tablist" aria-label="Soluções MysTech">
            {solutionItems.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={activeSolution === index}
                className={activeSolution === index ? 'active' : ''}
                onClick={() => setActiveSolution(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="solution-description">
          <p>{solutionItems[activeSolution].description}</p>
          <a href="#servicos">Conheça nossas soluções <Arrow /></a>
        </div>
      </section>

      <section className="projects-section" id="projetos">
        <div className="section-top" data-reveal>
          <div>
            <span className="eyebrow eyebrow-light">PROJETOS EM DESTAQUE</span>
            <h2>Ideias reais.<br/>Resultados concretos.</h2>
          </div>
          <div className="section-top-side">
            <p>Alguns projetos criados para transformar presença digital em uma experiência melhor.</p>
            <div className="carousel-controls">
              <button type="button" onClick={prevProject} aria-label="Projeto anterior"><Arrow left /></button>
              <button type="button" onClick={nextProject} aria-label="Próximo projeto"><Arrow /></button>
            </div>
          </div>
        </div>

        <div className="project-grid" aria-live="polite">
          {orderedProjects.map((project, index) => (
            <article className={index === 0 ? 'project-card featured' : 'project-card'} key={project.name} data-reveal>
              <div className="project-visual"><ProjectVisual project={project} /></div>
              <div className="project-meta">
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.type}</span>
                </div>
                <button type="button" aria-label={`Ver ${project.name}`}><Arrow /></button>
              </div>
              <div className="project-hover-copy">
                <small>{project.kicker}</small>
                <p>{project.copy}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="project-index" aria-hidden="true">
          <span>{String(activeProject + 1).padStart(2, '0')}</span><i/><small>03</small>
        </div>
      </section>

      <section className="services-section" id="servicos">
        <div className="services-head" data-reveal>
          <div>
            <span className="eyebrow">O QUE FAZEMOS</span>
            <h2>Soluções completas<br/>para o seu negócio.</h2>
          </div>
          <div>
            <p>Unimos estratégia, design e tecnologia para criar soluções digitais com propósito.</p>
            <a href="#contato">Fale com um especialista <Arrow /></a>
          </div>
        </div>

        <div className="services-grid">
          {services.map(([title, description], index) => (
            <article className="service-card" key={title} data-reveal>
              <div className="service-icon" aria-hidden="true">
                {index === 0 && <><span className="icon-screen"/><span className="icon-base"/></>}
                {index === 1 && <><span className="icon-db"/><span className="icon-db second"/></>}
                {index === 2 && <span className="icon-bolt">↯</span>}
                {index === 3 && <span className="icon-bars"><i/><i/><i/></span>}
                {index === 4 && <span className="icon-cloud">⌁</span>}
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href="#contato" aria-label={`Saiba mais sobre ${title}`}><Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="about-copy" data-reveal>
          <span className="eyebrow">SOBRE A MYSTECH</span>
          <h2>Tecnologia simples.<br/>Estratégica.<br/><em>Feita para pessoas.</em></h2>
          <p>A MysTech transforma tecnologia em soluções claras para negócios. Cada projeto nasce com uma direção definida, interface objetiva e desenvolvimento pensado para durar.</p>
          <a className="outline-link" href="#contato">Nossa abordagem <Arrow /></a>
        </div>

        <div className="about-visual" data-reveal aria-hidden="true">
          <div className="office-mark">MysTech<i/></div>
          <div className="office-wall wall-one"/>
          <div className="office-wall wall-two"/>
          <div className="office-glass">
            <i/><i/><i/><i/>
          </div>
          <div className="office-desk"/>
        </div>

        <div className="about-values" data-reveal>
          <span>ESTRATÉGIA</span>
          <span>TECNOLOGIA</span>
          <span>RESULTADOS</span>
          <span>PESSOAS</span>
          <i/>
          <p>Mais do que projetos, construímos soluções que continuam fazendo sentido depois do lançamento.</p>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div data-reveal>
          <span className="eyebrow eyebrow-light">VAMOS CONVERSAR?</span>
          <h2>Pronto para tirar<br/><em>sua ideia do papel?</em></h2>
        </div>
        <div className="contact-side" data-reveal>
          <p>Converse com a gente e descubra como a MysTech pode transformar sua próxima ideia em uma solução real.</p>
          <a className="btn btn-blue" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20MysTech." target="_blank" rel="noreferrer">Falar com um especialista <Arrow /></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <Brand />
          <p>Soluções digitais para<br/>negócios que pensam no futuro.</p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <a href="#solucoes">Soluções</a>
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="footer-social">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
        </div>
        <div className="footer-copy">© {year} MysTech.<br/>Todos os direitos reservados.</div>
      </footer>
    </main>
  )
}
