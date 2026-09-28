import { useEffect, useMemo, useState } from 'react'

const projects = [
  {
    name: 'AirBroker',
    type: 'Plataforma de aviação',
    description: 'Estratégia, UX/UI e desenvolvimento para uma experiência de compra e venda de aeronaves mais clara e sofisticada.',
    theme: 'air',
  },
  {
    name: 'Oston Cambuí',
    type: 'Ortopedia especializada',
    description: 'Site institucional pensado para transmitir confiança, organização e leitura confortável.',
    theme: 'oston',
  },
  {
    name: 'Mys System',
    type: 'Produto digital',
    description: 'Interface operacional para concentrar informações técnicas e facilitar decisões no dia a dia.',
    theme: 'system',
  },
]

const services = [
  ['Sites institucionais', 'Para apresentar sua empresa com clareza, autoridade e uma identidade própria.'],
  ['Landing pages', 'Páginas objetivas para campanhas, produtos ou serviços específicos.'],
  ['Sites interativos', 'Movimento e interação usados com critério, sem comprometer a navegação.'],
  ['Reformulação', 'Para marcas que cresceram e precisam de uma presença digital mais madura.'],
]

const process = [
  ['01', 'Conversa', 'Entendemos o negócio, o público e o que precisa ser resolvido.'],
  ['02', 'Direção', 'Definimos estrutura, linguagem visual e prioridades.'],
  ['03', 'Criação', 'Design e desenvolvimento avançam juntos, com revisões ao longo do processo.'],
  ['04', 'Publicação', 'Ajustamos conteúdo, responsividade, performance e colocamos tudo no ar.'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function ProjectMockup({ theme }) {
  return (
    <div className={"project-mockup " + theme} aria-hidden="true">
      <div className="mock-browser">
        <div className="mock-top">
          <div className="mock-dots"><i/><i/><i/></div>
          <span>mystech.project</span>
        </div>
        <div className="mock-content">
          <div className="mock-nav"><strong>MYS</strong><span>Work&nbsp;&nbsp;&nbsp; Studio&nbsp;&nbsp;&nbsp; Contact</span></div>
          <div className="mock-copy">
            <small>{theme === 'air' ? 'AVIATION MARKETPLACE' : theme === 'oston' ? 'HEALTH & CARE' : 'OPERATIONS PLATFORM'}</small>
            <h3>{theme === 'air' ? <>Explore<br/>without noise.</> : theme === 'oston' ? <>Clarity<br/>builds trust.</> : <>See more.<br/>Decide faster.</>}</h3>
          </div>
          <div className="mock-shape shape-one"/>
          <div className="mock-shape shape-two"/>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Mys Tech">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
          <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato <Arrow /></a>
        </nav>

        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menu">
          <i/><i/>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-left" data-reveal>
          <span className="eyebrow">MYS TECH · DESIGN E DESENVOLVIMENTO WEB</span>
          <h1>Sites que parecem<br/>ter sido feitos<br/><em>para a sua marca.</em></h1>
          <p>Design, desenvolvimento e movimento na medida certa. Criamos sites claros, bonitos e bem construídos — sem cara de template.</p>
          <div className="hero-actions">
            <a className="button primary" href="#projetos">Ver projetos <Arrow /></a>
            <a className="button ghost" href="#contato">Criar meu site <Arrow /></a>
          </div>
        </div>

        <div className="hero-right" data-reveal>
          <div className="hero-panel">
            <div className="panel-top"><span>MYS / SELECTED WORK</span><span>2026</span></div>
            <div className="panel-body">
              <span className="panel-kicker">DIGITAL EXPERIENCE</span>
              <strong>Digital work<br/>with intention.</strong>
              <div className="panel-orbit">
                <i className="ring ring-a"/>
                <i className="ring ring-b"/>
                <b/>
              </div>
              <div className="panel-bottom"><span>Strategy · Design · Build</span><span>Scroll ↓</span></div>
            </div>
          </div>
        </div>

        <div className="hero-meta">
          <span>Sites institucionais</span>
          <span>Landing pages</span>
          <span>Experiências interativas</span>
        </div>
      </section>

      <section className="intro" data-reveal>
        <div className="section-label">01 — ABORDAGEM</div>
        <div className="intro-copy">
          <h2>Design profissional não precisa parecer complicado.</h2>
          <p>Um bom site precisa ter hierarquia, ritmo e personalidade. A interação entra quando ajuda. O espaço vazio entra quando melhora a leitura. E cada detalhe precisa parecer intencional.</p>
        </div>
      </section>

      <section className="projects" id="projetos">
        <div className="section-head" data-reveal>
          <span className="section-label">02 — PROJETOS</span>
          <h2>Trabalhos selecionados.</h2>
          <p>Projetos com linguagens diferentes, construídos para necessidades diferentes.</p>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <article className="project" key={project.name} data-reveal>
              <div className="project-visual"><ProjectMockup theme={project.theme}/></div>
              <div className="project-info">
                <span>0{index + 1}</span>
                <div>
                  <h3>{project.name}</h3>
                  <small>{project.type}</small>
                </div>
                <p>{project.description}</p>
                <a href="#contato">Ver projeto <Arrow /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="statement" data-reveal>
        <p>Bonito sem exagero.<br/>Claro sem parecer comum.<br/><span>Interativo sem atrapalhar.</span></p>
      </section>

      <section className="services" id="servicos">
        <div className="section-head compact" data-reveal>
          <span className="section-label">03 — SERVIÇOS</span>
          <h2>O que sua empresa precisa.<br/>Sem adicionar o que não precisa.</h2>
        </div>

        <div className="service-list">
          {services.map((item, index) => (
            <article key={item[0]} data-reveal>
              <span>0{index + 1}</span>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about" data-reveal>
        <div className="about-card">
          <div className="about-mark"><img src="/mys-logo.svg" alt=""/><span>MYS TECH</span></div>
          <div className="about-lines"><i/><i/><b/></div>
        </div>
        <div className="about-copy">
          <span className="section-label">04 — MYS TECH</span>
          <h2>Design com intenção.<br/>Tecnologia com fundamento.</h2>
          <p>A Mys Tech combina direção visual e desenvolvimento para criar sites que apresentam melhor a empresa, funcionam bem no dia a dia e continuam bons depois que a novidade passa.</p>
        </div>
      </section>

      <section className="process" id="processo">
        <div className="section-head compact" data-reveal>
          <span className="section-label">05 — PROCESSO</span>
          <h2>Simples de acompanhar.</h2>
        </div>

        <div className="process-list">
          {process.map((item) => (
            <article key={item[0]} data-reveal>
              <span>{item[0]}</span>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="contact-copy" data-reveal>
          <span className="section-label">06 — CONTATO</span>
          <h2>Seu próximo site pode começar daqui.</h2>
          <p>Conte um pouco sobre a sua empresa. A gente organiza o resto com você.</p>
        </div>
        <div className="contact-actions" data-reveal>
          <a className="button primary" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20site." target="_blank" rel="noreferrer">Conversar no WhatsApp <Arrow /></a>
          <button className="button ghost" onClick={() => setBriefOpen(true)}>Preencher briefing</button>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <div className="footer-brand"><img src="/mys-logo.svg" alt=""/><div><strong>Mys Tech</strong><span>Design & desenvolvimento web</span></div></div>
          <div className="footer-links">
            <a href="#projetos">Projetos</a>
            <a href="#servicos">Serviços</a>
            <a href="#processo">Processo</a>
            <a href="mailto:contato@mystech.com.br">E-mail <Arrow /></a>
          </div>
        </div>
        <div className="footer-bottom"><span>© {year} MYS TECH</span><span>Pouso Alegre · MG</span></div>
      </footer>

      <aside className={briefOpen ? 'brief open' : 'brief'}>
        <button className="brief-close" onClick={() => setBriefOpen(false)}>×</button>
        <span className="section-label">BRIEFING RÁPIDO</span>
        <h2>Conte o essencial.</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Nome<input placeholder="Seu nome"/></label>
          <label>Empresa<input placeholder="Nome da empresa"/></label>
          <label>Contato<input placeholder="WhatsApp ou e-mail"/></label>
          <label>Tipo de projeto
            <select defaultValue="">
              <option value="" disabled>Selecione</option>
              <option>Site institucional</option>
              <option>Landing page</option>
              <option>Site interativo</option>
              <option>Reformulação</option>
            </select>
          </label>
          <label>O que você precisa?<textarea rows="5" placeholder="Explique em poucas linhas"/></label>
          <button type="submit">Enviar briefing <Arrow /></button>
        </form>
      </aside>
      {briefOpen && <button className="backdrop" onClick={() => setBriefOpen(false)} aria-label="Fechar"/>}
    </main>
  )
}
