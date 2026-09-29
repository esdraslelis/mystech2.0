import { useEffect, useState } from 'react'

const services = [
  ['Sites', 'Experiências digitais rápidas, responsivas e feitas para valorizar a marca.'],
  ['Automação', 'Fluxos inteligentes que conectam ferramentas e reduzem trabalho manual.'],
  ['Telecom', 'Projetos, integrações e infraestrutura para operações mais estáveis e escaláveis.'],
]

const projects = [
  ['AirBroker', 'Marketplace de aviação', 'Plataforma pensada para descoberta, catálogo e conversão.'],
  ['Mys System', 'Sistema operacional', 'Dados, processos e equipes reunidos em uma interface objetiva.'],
  ['Oston Cambuí', 'Presença digital', 'Site institucional com leitura limpa, confiança e desempenho.'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="MysTech - início">
      <img src="/mys-logo.svg" alt="MysTech" />
      <span>MysTech</span>
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="site">
      <section className="hero" id="inicio">
        <video className="hero-video" autoPlay muted loop playsInline preload="auto">
          <source src="/hero-mystech.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />

        <header className="header">
          <Brand />
          <nav className={menuOpen ? 'nav open' : 'nav'}>
            <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
            <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          </nav>
          <a className="header-cta" href="#contato">Falar com a MysTech <Arrow /></a>
          <button className="menu" aria-label="Abrir menu" onClick={() => setMenuOpen(v => !v)}>
            <i /><i />
          </button>
        </header>

        <div className="hero-content" data-reveal>
          <span className="eyebrow">DESIGN · TECNOLOGIA · AUTOMAÇÃO</span>
          <h1>Tecnologia que<br/>parece <em>simples.</em></h1>
          <p>Sites, sistemas, automações e infraestrutura criados para funcionar bem, parecer melhor e crescer junto com o negócio.</p>
          <div className="hero-actions">
            <a className="button primary" href="#projetos">Ver projetos <Arrow /></a>
            <a className="button ghost" href="#solucoes">Conhecer soluções</a>
          </div>
        </div>

        <div className="hero-foot" data-reveal>
          <span>01</span>
          <p>Da ideia à entrega, com foco em experiência, clareza e performance.</p>
          <i />
        </div>
      </section>

      <section className="intro" id="solucoes">
        <div className="section-title" data-reveal>
          <span className="eyebrow dark">O QUE A MYSTECH FAZ</span>
          <h2>Menos ruído.<br/>Mais resultado.</h2>
        </div>
        <p className="intro-copy" data-reveal>
          A tecnologia pode ser avançada sem parecer complicada. A MysTech une design, desenvolvimento e conhecimento técnico para criar soluções que são fáceis de usar e fortes por dentro.
        </p>
      </section>

      <section className="services">
        {services.map(([title, text], index) => (
          <article className="service" key={title} data-reveal>
            <span>0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            <Arrow />
          </article>
        ))}
      </section>

      <section className="projects" id="projetos">
        <div className="projects-head" data-reveal>
          <div>
            <span className="eyebrow">PROJETOS SELECIONADOS</span>
            <h2>Projetos que mostram<br/>o que sabemos fazer.</h2>
          </div>
          <a href="#contato">Quero um projeto assim <Arrow /></a>
        </div>

        <div className="project-list">
          {projects.map(([name, type, text], index) => (
            <article className="project" key={name} data-reveal>
              <div className={"project-visual visual-" + (index + 1)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
                <small>{type}</small>
              </div>
              <div className="project-info">
                <p>{text}</p>
                <Arrow />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="sobre">
        <div className="about-mark" data-reveal>
          <img src="/mys-logo.svg" alt="" />
        </div>
        <div className="about-copy" data-reveal>
          <span className="eyebrow dark">MYSTECH</span>
          <h2>Digital por fora.<br/>Engenharia por dentro.</h2>
          <p>
            Criamos presença digital, sistemas, automações e soluções de infraestrutura com a mesma lógica: entender o problema, eliminar excessos e construir algo que realmente funcione.
          </p>
        </div>
      </section>

      <section className="contact" id="contato">
        <div data-reveal>
          <span className="eyebrow">PRÓXIMO PASSO</span>
          <h2>Tem uma ideia?<br/><em>Vamos construir.</em></h2>
        </div>
        <div className="contact-side" data-reveal>
          <p>Conte o que você precisa. A gente transforma em direção, interface e tecnologia.</p>
          <a className="button primary" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20projeto%20com%20a%20MysTech." target="_blank" rel="noreferrer">Falar com um especialista <Arrow /></a>
        </div>
      </section>

      <footer>
        <Brand />
        <span>© {new Date().getFullYear()} MysTech</span>
        <span>Pouso Alegre · MG</span>
      </footer>
    </main>
  )
}
