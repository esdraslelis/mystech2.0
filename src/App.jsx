import { useEffect, useMemo, useState } from 'react'

const projects = [
  {
    index: '01',
    name: 'AirBroker',
    category: 'Plataforma de aviação',
    role: 'Estratégia · UX/UI · Desenvolvimento',
    description: 'Uma experiência pensada para tornar a busca por aeronaves clara, sofisticada e fácil de explorar.',
    className: 'case-air',
  },
  {
    index: '02',
    name: 'Oston Cambuí',
    category: 'Ortopedia especializada',
    role: 'Direção visual · Site institucional',
    description: 'Informação médica organizada com sobriedade, confiança e uma leitura confortável em qualquer tela.',
    className: 'case-oston',
  },
  {
    index: '03',
    name: 'Mys System',
    category: 'Produto digital',
    role: 'Produto · Interface · Automação',
    description: 'Uma interface para operação técnica com foco em leitura rápida, contexto e tomada de decisão.',
    className: 'case-system',
  },
]

const services = [
  ['Sites institucionais', 'Presença digital clara, sólida e alinhada à forma como sua empresa quer ser percebida.'],
  ['Landing pages', 'Páginas com narrativa direta, hierarquia forte e foco em ação.'],
  ['Sites interativos', 'Movimento e profundidade aplicados com critério, sem atrapalhar a navegação.'],
  ['Reformulação', 'Uma nova estrutura para marcas que cresceram e precisam deixar a presença digital no mesmo nível.'],
]

const steps = [
  ['01', 'Conversa', 'Entendemos o negócio, o público e o que o site precisa resolver.'],
  ['02', 'Direção', 'Definimos linguagem visual, estrutura e prioridades antes de desenhar.'],
  ['03', 'Criação', 'Design e desenvolvimento avançam juntos, com revisão durante o processo.'],
  ['04', 'Publicação', 'Ajustamos desempenho, mobile, conteúdo e colocamos o projeto no ar.'],
]

const faqs = [
  ['O site funciona bem no celular?', 'Sim. O mobile é desenhado como uma experiência própria, não como uma versão espremida do desktop.'],
  ['Preciso ter todo o conteúdo pronto?', 'Não. Podemos organizar a estrutura e orientar o que precisa ser produzido antes da publicação.'],
  ['Já tenho domínio. Posso usar?', 'Sim. Podemos usar o domínio existente e ajustar a configuração necessária para publicação.'],
  ['É possível atualizar depois?', 'Sim. O projeto pode evoluir com novos conteúdos, páginas e melhorias ao longo do tempo.'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function SitePreview({ kind }) {
  return (
    <div className={"site-preview " + kind} aria-hidden="true">
      <div className="preview-bar">
        <div className="preview-dots"><i/><i/><i/></div>
        <span>mystech.project</span>
      </div>
      <div className="preview-canvas">
        <div className="preview-nav"><strong>MYS</strong><span>Work&nbsp;&nbsp; Studio&nbsp;&nbsp; Contact</span></div>
        <div className="preview-copy">
          <small>{kind === 'air' ? 'AVIATION MARKETPLACE' : kind === 'oston' ? 'HEALTH & CARE' : 'OPERATIONS PLATFORM'}</small>
          <h3>{kind === 'air' ? <>Explore<br/>without noise.</> : kind === 'oston' ? <>Clarity<br/>builds trust.</> : <>See more.<br/>Decide faster.</>}</h3>
        </div>
        <div className="preview-shape shape-a"/>
        <div className="preview-shape shape-b"/>
        <div className="preview-grid"/>
      </div>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [briefOpen, setBriefOpen] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <header className="topbar">
        <a href="#inicio" className="brand">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>

        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
          <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a href="#processo" onClick={() => setMenuOpen(false)}>Como funciona</a>
          <a className="nav-cta" href="#contato" onClick={() => setMenuOpen(false)}>Vamos conversar <Arrow /></a>
        </nav>

        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menu">
          <i/><i/>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy" data-reveal>
          <span className="meta">MYS TECH · DESIGN & DESENVOLVIMENTO WEB</span>
          <h1>Seu site<br/>precisa ter<br/><em>presença.</em></h1>
          <div className="hero-support">
            <p>Criamos experiências digitais com identidade, clareza e acabamento. Sem cara de template. Sem efeito por efeito.</p>
            <div className="hero-links">
              <a href="#projetos">Ver projetos <Arrow /></a>
              <a href="#contato">Criar meu site <Arrow /></a>
            </div>
          </div>
        </div>

        <div className="hero-art" data-reveal>
          <div className="hero-window">
            <div className="window-head">
              <span>MYS / WORK</span>
              <span>2026</span>
            </div>
            <div className="window-body">
              <div className="window-copy">
                <small>SELECTED EXPERIENCE</small>
                <strong>Digital work<br/>with intention.</strong>
              </div>
              <div className="window-object">
                <div className="orbit one"/>
                <div className="orbit two"/>
                <div className="core"/>
              </div>
              <div className="window-foot">
                <span>Strategy · Design · Build</span>
                <span>Scroll to explore ↓</span>
              </div>
            </div>
          </div>
          <div className="chrome-stroke stroke-a"/>
          <div className="chrome-stroke stroke-b"/>
        </div>

        <div className="hero-caption">
          <span>Sites institucionais</span>
          <span>Landing pages</span>
          <span>Experiências interativas</span>
        </div>
      </section>

      <section className="intro-flow">
        <div className="intro-index">01</div>
        <div className="intro-text" data-reveal>
          <p className="lead">Um bom site não precisa parecer um espetáculo o tempo inteiro.</p>
          <p className="body">Ele precisa ter ritmo, proporção e uma lógica visual clara. O movimento entra quando melhora a percepção; o silêncio entra quando ajuda o conteúdo a respirar.</p>
        </div>
        <div className="intro-note" data-reveal>
          <span>PROCESSO</span>
          <p>Primeiro estrutura.<br/>Depois estética.<br/>Por último, efeitos.</p>
        </div>
      </section>

      <section className="work" id="projetos">
        <div className="work-heading" data-reveal>
          <span className="meta">PROJETOS SELECIONADOS</span>
          <h2>Trabalhos que mudam de forma conforme a necessidade do negócio.</h2>
        </div>

        <div className="cases">
          <article className="case case-featured" data-reveal>
            <div className="case-visual case-air"><SitePreview kind="air"/></div>
            <div className="case-info">
              <span>01</span>
              <div>
                <h3>AirBroker</h3>
                <p>Plataforma de aviação</p>
              </div>
              <p className="case-description">Uma experiência pensada para tornar a busca por aeronaves clara, sofisticada e fácil de explorar.</p>
              <a href="#contato">Ver projeto <Arrow /></a>
            </div>
          </article>

          <div className="case-pair">
            <article className="case case-compact" data-reveal>
              <div className="case-visual case-oston"><SitePreview kind="oston"/></div>
              <div className="case-info">
                <span>02</span>
                <div>
                  <h3>Oston Cambuí</h3>
                  <p>Ortopedia especializada</p>
                </div>
                <a href="#contato">Ver projeto <Arrow /></a>
              </div>
            </article>

            <article className="case case-compact offset" data-reveal>
              <div className="case-visual case-system"><SitePreview kind="system"/></div>
              <div className="case-info">
                <span>03</span>
                <div>
                  <h3>Mys System</h3>
                  <p>Produto digital</p>
                </div>
                <a href="#contato">Ver projeto <Arrow /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-track">
          <span>Bonito sem exagero.</span>
          <span>Claro sem ser comum.</span>
          <span>Interativo sem virar brinquedo.</span>
        </div>
      </section>

      <section className="services" id="servicos">
        <div className="services-heading" data-reveal>
          <span className="meta">O QUE FAZEMOS</span>
          <h2>O formato certo, sem empilhar coisa que você não precisa.</h2>
        </div>
        <div className="services-list">
          {services.map((service, i) => (
            <article key={service[0]} data-reveal>
              <span className="service-index">0{i + 1}</span>
              <h3>{service[0]}</h3>
              <p>{service[1]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio">
        <div className="studio-visual" data-reveal>
          <div className="studio-mark">
            <img src="/mys-logo.svg" alt="" />
            <span>MYS TECH</span>
          </div>
          <div className="studio-line one"/>
          <div className="studio-line two"/>
          <div className="studio-dot"/>
        </div>
        <div className="studio-copy" data-reveal>
          <span className="meta">NOSSA FORMA DE TRABALHAR</span>
          <h2>Design com intenção.<br/>Tecnologia com fundamento.</h2>
          <p>A parte visual chama atenção. A estrutura faz o site continuar bom depois que a novidade passa. Por isso tratamos tipografia, conteúdo, performance, responsividade e interação como uma coisa só.</p>
        </div>
      </section>

      <section className="process" id="processo">
        <div className="process-heading" data-reveal>
          <span className="meta">DO BRIEFING AO AR</span>
          <h2>Um processo simples de acompanhar.</h2>
        </div>
        <div className="process-list">
          {steps.map(step => (
            <article key={step[0]} data-reveal>
              <span>{step[0]}</span>
              <h3>{step[1]}</h3>
              <p>{step[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq">
        <div className="faq-heading" data-reveal>
          <span className="meta">ANTES DE COMEÇAR</span>
          <h2>Algumas respostas rápidas.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <button key={item[0]} className={openFaq === i ? 'faq-item open' : 'faq-item'} onClick={() => setOpenFaq(openFaq === i ? null : i)} data-reveal>
              <div><span>0{i + 1}</span><strong>{item[0]}</strong><i>{openFaq === i ? '−' : '+'}</i></div>
              <p>{item[1]}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="contact-copy" data-reveal>
          <span className="meta">SE FIZER SENTIDO, A GENTE COMEÇA.</span>
          <h2>Vamos criar uma presença que combine com o nível do seu negócio.</h2>
        </div>
        <div className="contact-actions" data-reveal>
          <a className="primary" href="https://wa.me/5535997541933?text=Olá!%20Quero%20conversar%20sobre%20um%20site." target="_blank" rel="noreferrer">Conversar no WhatsApp <Arrow /></a>
          <button onClick={() => setBriefOpen(true)}>Preencher briefing</button>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <img src="/mys-logo.svg" alt="" />
            <div><strong>Mys Tech</strong><span>Design & desenvolvimento web</span></div>
          </div>
          <div className="footer-links">
            <a href="#projetos">Projetos</a>
            <a href="#servicos">Serviços</a>
            <a href="#processo">Processo</a>
            <a href="mailto:contato@mystech.com.br">E-mail <Arrow /></a>
          </div>
        </div>
        <div className="footer-meta"><span>© {year} MYS TECH</span><span>POUSO ALEGRE · MG</span></div>
      </footer>

      <aside className={briefOpen ? 'brief open' : 'brief'}>
        <button className="brief-close" onClick={() => setBriefOpen(false)}>×</button>
        <span className="meta">BRIEFING RÁPIDO</span>
        <h2>Conte o essencial.</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Nome<input placeholder="Seu nome"/></label>
          <label>Empresa<input placeholder="Sua empresa"/></label>
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
      {briefOpen && <button className="brief-backdrop" onClick={() => setBriefOpen(false)} aria-label="Fechar"/>}
    </main>
  )
}
