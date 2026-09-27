import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    index: '01',
    name: 'AIRBROKER',
    kind: 'Plataforma de aviação',
    line: 'Catálogo, busca e presença digital para aeronaves.',
    className: 'project-blue',
    mock: (
      <div className="air-ui">
        <div className="air-top"><span>AIRBROKER</span><span>EXPLORE AIRCRAFT ↗</span></div>
        <div className="air-copy">Find your<br />next aircraft.</div>
        <div className="air-plane">✦</div>
        <div className="air-meta"><span>MARKETPLACE</span><span>2026</span></div>
      </div>
    ),
  },
  {
    index: '02',
    name: 'OSTON CAMBUÍ',
    kind: 'Clínica especializada',
    line: 'Uma presença médica limpa, precisa e feita para transmitir confiança.',
    className: 'project-cream',
    mock: (
      <div className="clinic-ui">
        <div className="clinic-nav"><b>OSTON</b><span>Especialidades &nbsp; Médicos &nbsp; Contato</span></div>
        <div className="clinic-label">ORTOPEDIA ESPECIALIZADA</div>
        <div className="clinic-title">Cuidado preciso<br />para cada movimento.</div>
        <div className="clinic-chip">AGENDAR CONSULTA ↗</div>
        <div className="clinic-orb" />
      </div>
    ),
  },
  {
    index: '03',
    name: 'MYS MONITORING',
    kind: 'Produto digital',
    line: 'Dashboard operacional para transformar dado técnico em decisão rápida.',
    className: 'project-dark',
    mock: (
      <div className="monitor-ui">
        <div className="monitor-head"><span>NETWORK OVERVIEW</span><b>LIVE</b></div>
        <div className="monitor-grid">
          <div><small>DISPONIBILIDADE</small><strong>99.91%</strong><i /></div>
          <div><small>LINKS ATIVOS</small><strong>248</strong><i /></div>
          <div className="graph"><span /><span /><span /><span /><span /><span /></div>
        </div>
        <div className="monitor-foot">OPERAÇÃO EM TEMPO REAL</div>
      </div>
    ),
  },
  {
    index: '04',
    name: 'VILA VEÍCULOS',
    kind: 'Vitrine automotiva',
    line: 'Uma experiência direta para apresentar estoque sem poluição visual.',
    className: 'project-red',
    mock: (
      <div className="car-ui">
        <div className="car-brand">VILA<br />VEÍCULOS</div>
        <div className="car-shape">V</div>
        <div className="car-data"><b>ENCONTRE O SEU PRÓXIMO CARRO.</b><span>ESTOQUE ATUALIZADO ↗</span></div>
      </div>
    ),
  },
]

const steps = [
  ['01', 'Diagnóstico', 'Entendemos sua marca, seu público e o que o site precisa fazer — antes de pensar em efeito.'],
  ['02', 'Direção', 'Definimos linguagem visual, referências, hierarquia e a sensação que a experiência precisa transmitir.'],
  ['03', 'Construção', 'Design e código avançam juntos para que cada seção já nasça responsiva, rápida e consistente.'],
  ['04', 'Refinamento', 'Microinterações, movimento, tipografia, performance e detalhes são lapidados até tudo parecer intencional.'],
  ['05', 'Publicação', 'Entramos no ar com domínio, analytics, SEO técnico e estrutura pronta para evoluir.'],
]

const faq = [
  ['Quanto tempo leva?', 'Projetos institucionais costumam ser entregues em cerca de 15 dias após o início e o envio do material necessário.'],
  ['O site funciona bem no celular?', 'Sim. A experiência é pensada para desktop e mobile desde o começo, não adaptada às pressas no final.'],
  ['Vocês cuidam de hospedagem e domínio?', 'Sim. A Mys Tech pode manter a estrutura publicada, atualizada e acompanhada para você não precisar administrar a parte técnica.'],
  ['Eu consigo pedir ajustes?', 'Sim. O refinamento faz parte do processo. O objetivo é publicar somente quando a direção estiver aprovada e consistente com sua marca.'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export default function App() {
  const root = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis
    let rafId

    if (!reduceMotion) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      })

      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) return

      gsap.from('.hero-line > span', {
        yPercent: 110,
        duration: 1.15,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.15,
      })

      gsap.from('.hero-kicker, .hero-bottom, .hero-stage', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.45,
      })

      gsap.utils.toArray('.reveal').forEach((item) => {
        gsap.from(item, {
          y: 52,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 86%',
          },
        })
      })

      gsap.utils.toArray('.word-wipe').forEach((item) => {
        gsap.from(item, {
          yPercent: 105,
          duration: 1.05,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 84%',
          },
        })
      })

      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        const track = document.querySelector('.work-track')
        if (!track) return

        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 72)

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-pin',
            start: 'top top',
            end: () => '+=' + getDistance(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      })

      return () => mm.revert()
    }, root)

    const onPointer = (event) => {
      root.current?.style.setProperty('--mx', event.clientX + 'px')
      root.current?.style.setProperty('--my', event.clientY + 'px')
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointer)
      ctx.revert()
      if (rafId) cancelAnimationFrame(rafId)
      if (lenis) lenis.destroy()
    }
  }, [])

  return (
    <main ref={root} className="site-shell">
      <div className="pointer-glow" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="Mys Tech">
          <img src="/mys-logo.svg" alt="" />
          <span>MYS TECH</span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#trabalhos">Projetos</a>
          <a href="#processo">Processo</a>
          <a href="#sobre">Por que Mys</a>
        </nav>

        <a className="nav-cta" href="https://wa.me/5535997541933?text=Ol%C3%A1%2C%20quero%20criar%20um%20site%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
          Começar projeto <Arrow />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <p className="hero-kicker"><span>●</span> WEBSITES / EXPERIÊNCIAS DIGITAIS</p>

        <h1 className="hero-title" aria-label="Se o seu site parece com todos, ele não é seu.">
          <span className="hero-line"><span>SE O SEU SITE</span></span>
          <span className="hero-line"><span>PARECE COM TODOS,</span></span>
          <span className="hero-line accent"><span>ELE NÃO É SEU.</span></span>
        </h1>

        <div className="hero-bottom">
          <p>Sites sob medida para empresas que querem parecer tão boas online quanto são na vida real.</p>
          <div className="hero-actions">
            <a className="button button-solid" href="https://wa.me/5535997541933?text=Ol%C3%A1%2C%20quero%20criar%20um%20site%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">Criar meu site <Arrow /></a>
            <a className="text-link" href="#trabalhos">Ver projetos ↓</a>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <div className="stage-window">
            <div className="stage-bar"><i /><i /><i /><span>mystech.com.br</span></div>
            <div className="stage-body">
              <div className="stage-tag">DIGITAL / 2026</div>
              <div className="stage-word">MYS</div>
              <div className="stage-panel">
                <small>DESIGN THAT</small>
                <strong>FEELS<br />ALIVE.</strong>
              </div>
              <div className="stage-index">01 — 04</div>
            </div>
          </div>
          <div className="stage-note">MOVA O MOUSE / ROLE A PÁGINA</div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>DESIGN QUE NÃO PARECE TEMPLATE</span><b>✦</b>
          <span>CÓDIGO COM PROPÓSITO</span><b>✦</b>
          <span>EXPERIÊNCIA QUE FICA NA MEMÓRIA</span><b>✦</b>
          <span>DESIGN QUE NÃO PARECE TEMPLATE</span><b>✦</b>
          <span>CÓDIGO COM PROPÓSITO</span><b>✦</b>
          <span>EXPERIÊNCIA QUE FICA NA MEMÓRIA</span><b>✦</b>
        </div>
      </div>

      <section className="manifesto section-pad" id="sobre">
        <div className="section-label reveal"><span>01</span> NOSSA IDEIA</div>
        <div className="manifesto-copy">
          <div className="clip"><h2 className="word-wipe">Um site bonito</h2></div>
          <div className="clip"><h2 className="word-wipe muted">não é o objetivo.</h2></div>
          <div className="clip"><h2 className="word-wipe">Ser lembrado é.</h2></div>
        </div>
        <div className="manifesto-aside reveal">
          <p>A gente mistura direção de arte, interface, movimento e desenvolvimento para criar uma presença digital com personalidade real.</p>
          <span>SEM TEMPLATE GENÉRICO.<br />SEM EFEITO SÓ POR EFEITO.</span>
        </div>
      </section>

      <section className="work-pin" id="trabalhos">
        <div className="work-head section-pad">
          <div className="section-label"><span>02</span> PROJETOS SELECIONADOS</div>
          <p>Arraste com o scroll.</p>
        </div>

        <div className="work-track">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className={'project-visual ' + project.className}>{project.mock}</div>
              <div className="project-info">
                <span>{project.index}</span>
                <div><h3>{project.name}</h3><p>{project.kind}</p></div>
                <p>{project.line}</p>
                <b>↗</b>
              </div>
            </article>
          ))}
          <article className="project-card project-card-cta">
            <div className="project-end">
              <small>SEU PROJETO PODE SER O PRÓXIMO.</small>
              <h3>Vamos fazer algo<br />que não parece pronto.</h3>
              <a href="https://wa.me/5535997541933?text=Ol%C3%A1%2C%20quero%20criar%20um%20site%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">Conversar com a Mys <Arrow /></a>
            </div>
          </article>
        </div>
      </section>

      <section className="process section-pad" id="processo">
        <div className="process-intro reveal">
          <div className="section-label"><span>03</span> COMO A GENTE CONSTRÓI</div>
          <h2>Do primeiro rascunho<br />ao último detalhe.</h2>
          <p>Um processo simples de acompanhar, mas rigoroso no acabamento.</p>
        </div>

        <div className="steps">
          {steps.map(([number, title, copy]) => (
            <article className="step reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i>↘</i>
            </article>
          ))}
        </div>
      </section>

      <section className="proof section-pad">
        <div className="section-label reveal"><span>04</span> O QUE MUDA</div>
        <div className="proof-grid">
          <article className="proof-big reveal">
            <small>NÃO É SOBRE ENCHER A TELA.</small>
            <h2>É sobre dar uma<br /><em>razão para ficar.</em></h2>
            <p>Cada escolha visual precisa ajudar a marca a parecer mais clara, mais confiável e mais valiosa.</p>
          </article>

          <article className="proof-card reveal">
            <span>01</span><h3>Primeira impressão</h3><p>Uma direção visual própria, em vez de uma composição que poderia pertencer a qualquer empresa.</p>
          </article>
          <article className="proof-card reveal">
            <span>02</span><h3>Movimento com função</h3><p>Transições e microinterações usadas para guiar a leitura e aumentar a sensação de qualidade.</p>
          </article>
          <article className="proof-card reveal">
            <span>03</span><h3>Rápido por dentro</h3><p>Experiência leve, responsiva e preparada para busca, analytics e evolução contínua.</p>
          </article>
          <article className="proof-card proof-blue reveal">
            <span>04</span><h3>Feito para você</h3><p>O projeto nasce da sua marca. Não começa de um template procurando um logo para encaixar.</p>
          </article>
        </div>
      </section>

      <section className="statement">
        <div className="statement-line"><span>MYS TECH</span><b>✦</b><span>MYS TECH</span><b>✦</b></div>
        <div className="statement-copy section-pad">
          <p className="reveal">SITE INSTITUCIONAL / LANDING PAGE / PORTFÓLIO / PRODUTO DIGITAL</p>
          <h2 className="reveal">Design que parece<br /><span>caro porque é pensado.</span></h2>
        </div>
      </section>

      <section className="faq section-pad">
        <div className="faq-title reveal">
          <div className="section-label"><span>05</span> PERGUNTAS</div>
          <h2>Antes de começar.</h2>
        </div>
        <div className="faq-list">
          {faq.map(([question, answer], index) => (
            <details className="reveal" key={question}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span><b>{question}</b><i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta section-pad">
        <div className="final-top reveal">
          <p>VOCÊ JÁ TEM A EMPRESA.<br />AGORA ELA PRECISA PARECER DO TAMANHO CERTO.</p>
          <span>DISPONÍVEL PARA NOVOS PROJETOS ●</span>
        </div>

        <a className="final-link" href="https://wa.me/5535997541933?text=Ol%C3%A1%2C%20quero%20criar%20um%20site%20com%20a%20Mys%20Tech." target="_blank" rel="noreferrer">
          <span>VAMOS</span>
          <span>CRIAR <i>↗</i></span>
        </a>

        <footer>
          <a className="footer-brand" href="#top"><img src="/mys-logo.svg" alt="" /><b>MYS TECH</b></a>
          <p>WEBSITES • SISTEMAS • EXPERIÊNCIAS DIGITAIS</p>
          <p>© 2026 MYS TECH</p>
        </footer>
      </section>
    </main>
  )
}
