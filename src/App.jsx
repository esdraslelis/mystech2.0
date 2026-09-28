import { useEffect, useMemo, useRef, useState } from 'react'

const projects = [
  {
    name: 'AirBroker',
    type: 'Plataforma de aviação',
    tag: 'Estratégia · UI/UX · Desenvolvimento',
    tone: 'light',
    className: 'project-air',
    description: 'Catálogo de aeronaves com foco em clareza, descoberta e uma presença digital premium.',
  },
  {
    name: 'Oston Cambuí',
    type: 'Ortopedia especializada',
    tag: 'Direção visual · Site institucional',
    tone: 'paper',
    className: 'project-oston',
    description: 'Uma experiência sóbria, humana e objetiva para uma clínica que precisa transmitir confiança.',
  },
  {
    name: 'Mys System',
    type: 'Produto digital',
    tag: 'Produto · Interface · Automação',
    tone: 'dark',
    className: 'project-system',
    description: 'Interfaces para transformar operação complexa em fluxos simples, claros e acionáveis.',
  },
]

const services = [
  ['01', 'Sites institucionais', 'Para apresentar sua empresa, seus serviços e transformar visita em oportunidade de contato.'],
  ['02', 'Landing pages', 'Uma mensagem forte, uma proposta clara e um caminho direto para a conversão.'],
  ['03', 'Sites interativos', 'Movimento, profundidade e identidade para marcas que precisam causar uma impressão diferente.'],
  ['04', 'Reformulação de sites', 'Nova estrutura, nova experiência e uma presença mais madura para empresas que cresceram.'],
]

const process = [
  ['01', 'Conversa', 'Entendemos sua empresa, seu público, referências e o que o site precisa resolver.'],
  ['02', 'Direção visual', 'Definimos estrutura, linguagem visual e experiência antes de avançar na construção.'],
  ['03', 'Criação', 'Design e desenvolvimento ganham forma com espaço para acompanhar, validar e revisar.'],
  ['04', 'Publicação', 'Revisamos desktop, mobile, formulários, performance e colocamos tudo no ar.'],
]

const faqs = [
  ['Meu site vai funcionar bem no celular?', 'Sim. O mobile é tratado como uma composição própria, não como uma versão espremida do desktop.'],
  ['Posso contratar mesmo sem ter todos os textos?', 'Sim. Podemos estruturar o conteúdo junto com você e indicar o que precisa ser produzido antes da publicação.'],
  ['Já tenho domínio. Posso usar?', 'Sim. Configuramos o domínio existente ou orientamos a contratação de um novo, conforme o projeto.'],
  ['Como acompanho a criação?', 'Você acompanha as etapas, recebe versões para revisão e valida os principais pontos antes da publicação.'],
  ['É possível atualizar o site depois?', 'Sim. A estrutura pode receber evoluções, novos conteúdos e ajustes conforme sua empresa cresce.'],
  ['Como funciona o suporte após a entrega?', 'O suporte pode incluir hospedagem, manutenção e pequenas atualizações conforme o plano contratado.'],
]

function Arrow({ direction = 'ne' }) {
  return <span className="arrow" aria-hidden="true">{direction === 'down' ? '↘' : '↗'}</span>
}

function MonitorPreview() {
  return (
    <div className="monitor-scene" aria-hidden="true">
      <div className="chrome-ribbon ribbon-a" />
      <div className="chrome-ribbon ribbon-b" />
      <div className="monitor-shadow" />
      <div className="monitor">
        <div className="monitor-bezel">
          <div className="monitor-screen">
            <div className="screen-topbar">
              <span className="screen-brand">MYS</span>
              <span>WORK / 2026</span>
            </div>
            <div className="screen-hero">
              <div>
                <span className="eyebrow">DIGITAL PRESENCE</span>
                <h3>Design que<br />se move.</h3>
              </div>
              <div className="screen-orb">
                <span />
                <i />
              </div>
            </div>
            <div className="screen-footer">
              <span>Brand experience</span>
              <span>Scroll to explore</span>
            </div>
          </div>
        </div>
        <div className="monitor-neck" />
        <div className="monitor-base" />
      </div>
    </div>
  )
}

function App() {
  const heroRef = useRef(null)
  const [activeDetail, setActiveDetail] = useState('visual')
  const [activeService, setActiveService] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * 1.05
      const p = Math.min(window.scrollY / max, 1)
      document.documentElement.style.setProperty('--hero-progress', p.toFixed(3))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const items = [...document.querySelectorAll('[data-reveal]')]
    if (!items.length) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: 0.12 })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Mys Tech - início">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
          <a href="#estudio" onClick={() => setMenuOpen(false)}>Estúdio</a>
          <a href="#processo" onClick={() => setMenuOpen(false)}>Como funciona</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Vamos conversar <Arrow /></a>
        </nav>

        <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="kicker">MYS TECH — DESIGN E DESENVOLVIMENTO WEB</div>
            <h1>
              <span>Seu negócio.</span>
              <span>Outra <em>presença.</em></span>
            </h1>
            <p>Criamos sites com identidade, movimento e atenção a cada detalhe. Feitos para apresentar sua empresa e aproximar novos clientes.</p>
            <div className="hero-actions">
              <a href="#projetos">Conheça os projetos <Arrow direction="down" /></a>
              <a href="#contato">Vamos criar seu site <Arrow /></a>
            </div>
          </div>

          <div className="hero-visual">
            <MonitorPreview />
          </div>
        </div>

        <div className="hero-bottom">
          <span>Sites institucionais / Experiências interativas / Landing pages</span>
          <span>Explore com o scroll ↓</span>
        </div>
      </section>

      <section className="screen-transition" aria-hidden="true">
        <div className="transition-frame">
          <div className="transition-ui">
            <span>PROJECT / 01</span>
            <h2>Uma interface que deixa de ser só tela.</h2>
            <div className="transition-line" />
            <div className="transition-grid">
              <span>Estratégia</span><span>Design</span><span>Desenvolvimento</span>
            </div>
          </div>
        </div>
      </section>

      <section className="projects section" id="projetos">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">PROJETOS SELECIONADOS</span>
          <h2>Cada negócio tem uma história.<br />O site precisa mostrar a sua.</h2>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <article className={'project-block ' + project.className} key={project.name} data-reveal>
              <div className="project-media">
                <div className="project-browser">
                  <div className="browser-top">
                    <span /><span /><span />
                    <i>{project.name.toLowerCase().replaceAll(' ', '')}.com.br</i>
                  </div>
                  <div className="browser-body">
                    <div className="browser-label">{project.type.toUpperCase()}</div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="browser-art">
                      <span className="art-line line-1" />
                      <span className="art-line line-2" />
                      <span className="art-card card-1" />
                      <span className="art-card card-2" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-meta">
                <div>
                  <span className="project-index">0{index + 1}</span>
                  <h3>{project.name}</h3>
                  <p>{project.tag}</p>
                </div>
                <a href="#contato">Explorar projeto <Arrow /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-section" id="estudio">
        <div className="dark-intro" data-reveal>
          <span className="eyebrow">NOSSO JEITO DE PENSAR</span>
          <h2>Bonito no primeiro olhar.<br />Bem pensado em cada clique.</h2>
        </div>

        <div className="principles">
          <article data-reveal>
            <span>01</span>
            <h3>Identidade</h3>
            <p>Um site que combina com a sua empresa, do primeiro título ao último detalhe.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>Clareza</h3>
            <p>Informações organizadas para o visitante entender, confiar e entrar em contato.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>Experiência</h3>
            <p>Navegação fluida, leitura confortável e atenção especial ao celular.</p>
          </article>
        </div>
      </section>

      <section className="detail-lab section">
        <div className="detail-copy" data-reveal>
          <span className="eyebrow">VEJA A DIFERENÇA NOS DETALHES</span>
          <h2>Uma interface pode orientar sem precisar gritar.</h2>
          <p>Explore os três pilares. A composição muda, mas a ideia continua a mesma: cada efeito precisa ter uma função.</p>

          <div className="detail-tabs" role="tablist">
            {[
              ['visual', 'Visual'],
              ['navigation', 'Navegação'],
              ['motion', 'Movimento'],
            ].map(([id, label]) => (
              <button key={id} className={activeDetail === id ? 'active' : ''} onClick={() => setActiveDetail(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={'detail-demo demo-' + activeDetail} data-reveal>
          <div className="demo-window">
            <div className="demo-nav">
              <span>MYS / LAB</span>
              <span>Menu</span>
            </div>
            <div className="demo-stage">
              <span className="demo-kicker">DIGITAL EXPERIENCES</span>
              <h3>{activeDetail === 'visual' ? 'Hierarquia que dá ritmo.' : activeDetail === 'navigation' ? 'Navegação que parece óbvia.' : 'Movimento com começo e fim.'}</h3>
              <p>{activeDetail === 'visual' ? 'Tipografia, respiro e contraste organizam o conteúdo.' : activeDetail === 'navigation' ? 'O visitante encontra o próximo passo sem precisar pensar onde clicar.' : 'As transições ajudam a conduzir a atenção e depois saem de cena.'}</p>
              <div className="demo-object"><i /><b /></div>
            </div>
            <div className="demo-footer"><span>01</span><span>Scroll / Tap</span></div>
          </div>
        </div>
      </section>

      <section className="services section">
        <div className="section-heading small" data-reveal>
          <span className="eyebrow">O QUE CRIAMOS</span>
          <h2>O formato certo para<br />a sua próxima etapa.</h2>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <button key={service[1]} className={activeService === index ? 'service-row active' : 'service-row'} onClick={() => setActiveService(index)} data-reveal>
              <span className="service-number">{service[0]}</span>
              <span className="service-title">{service[1]}</span>
              <span className="service-description">{service[2]}</span>
              <span className="service-arrow">↘</span>
            </button>
          ))}
        </div>
      </section>

      <section className="process section" id="processo">
        <div className="process-intro" data-reveal>
          <span className="eyebrow">COMO FUNCIONA</span>
          <h2>Você conhece seu negócio.<br />Nós damos forma à presença dele.</h2>
        </div>

        <div className="process-grid">
          <div className="process-rail"><span /></div>
          <div className="process-list">
            {process.map((item) => (
              <article key={item[0]} data-reveal>
                <span>{item[0]}</span>
                <div>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about section">
        <div className="about-visual" data-reveal>
          <div className="about-frame">
            <div className="about-noise" />
            <span>MYS TECH / STUDIO</span>
            <strong>Design<br />×<br />Tecnologia</strong>
          </div>
        </div>

        <div className="about-copy" data-reveal>
          <span className="eyebrow">SOBRE A MYS TECH</span>
          <h2>Design com intenção.<br />Tecnologia com fundamento.</h2>
          <p>A Mys Tech une criação visual e conhecimento técnico para construir sites bem apresentados, bem executados e preparados para funcionar no mundo real.</p>
          <a href="#contato">Conhecer a Mys Tech <Arrow /></a>
        </div>
      </section>

      <section className="faq section">
        <div className="section-heading small" data-reveal>
          <span className="eyebrow">DÚVIDAS ANTES DE COMEÇAR</span>
          <h2>O essencial, sem enrolação.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <button className={openFaq === index ? 'faq-item open' : 'faq-item'} key={item[0]} onClick={() => setOpenFaq(openFaq === index ? null : index)} data-reveal>
              <span>{item[0]}</span>
              <i>{openFaq === index ? '−' : '+'}</i>
              <p>{item[1]}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="cta section" id="contato">
        <div className="cta-ribbon" aria-hidden="true" />
        <span className="eyebrow" data-reveal>PRONTO PARA COMEÇAR?</span>
        <h2 data-reveal>Vamos criar<br />o seu próximo site?</h2>
        <p data-reveal>Conte um pouco sobre a sua empresa e o que você imagina para ela.</p>
        <div className="cta-actions" data-reveal>
          <a href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20site." target="_blank" rel="noreferrer">Conversar sobre meu projeto <Arrow /></a>
          <button onClick={() => setBriefOpen(true)}>Prefiro preencher um briefing</button>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div>
            <img src="/mys-logo.svg" alt="" />
            <strong>Mys Tech</strong>
            <p>Sites com identidade. Experiências bem construídas.</p>
          </div>
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <Arrow /></a>
            <a href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">WhatsApp <Arrow /></a>
            <a href="mailto:contato@mystech.com.br">E-mail <Arrow /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} MYS TECH</span>
          <span>Política de privacidade</span>
        </div>
        <div className="footer-word">MYS</div>
      </footer>

      <aside className={briefOpen ? 'brief-panel open' : 'brief-panel'}>
        <button className="brief-close" onClick={() => setBriefOpen(false)} aria-label="Fechar briefing">×</button>
        <span className="eyebrow">BRIEFING RÁPIDO</span>
        <h2>Conte o básico.<br />A gente começa daqui.</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Nome<input placeholder="Seu nome" /></label>
          <label>Empresa<input placeholder="Nome da empresa" /></label>
          <label>WhatsApp ou e-mail<input placeholder="Como podemos falar com você?" /></label>
          <label>Tipo de projeto<select defaultValue=""><option value="" disabled>Selecione</option><option>Site institucional</option><option>Landing page</option><option>Site interativo</option><option>Reformulação</option></select></label>
          <label>O que você precisa?<textarea placeholder="Conte um pouco sobre o projeto" rows="5" /></label>
          <button type="submit">Enviar briefing <Arrow /></button>
        </form>
      </aside>
      {briefOpen && <button className="panel-backdrop" onClick={() => setBriefOpen(false)} aria-label="Fechar briefing" />}
    </main>
  )
}

export default App
