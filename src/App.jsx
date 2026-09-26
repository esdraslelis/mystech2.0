import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import MystechScene from './scene/MystechScene'

const sections = [
  { eyebrow: 'MYS TECH / DIGITAL STUDIO', title: <>Sites que <span>invadem a tela.</span></>, body: 'Experiências digitais com profundidade, movimento e tecnologia para transformar atenção em percepção de marca.' },
  { eyebrow: '01 / EXPERIÊNCIA', title: <>Não é uma página. <span>É uma cena.</span></>, body: 'Cada scroll move câmera, luz, profundidade e narrativa. O conteúdo deixa de ser bloco e passa a fazer parte do ambiente.' },
  { eyebrow: '02 / ESTRUTURA', title: <>Design, código e movimento <span>na mesma arquitetura.</span></>, body: 'UI, performance, SEO, responsividade, automação e interação trabalhando como camadas de um mesmo produto.' },
  { eyebrow: '03 / PORTFÓLIO', title: <>Projetos que merecem <span>ser explorados.</span></>, body: 'O portfólio entra como parte do cenário, com telas, objetos e transições que respondem ao movimento do usuário.' },
  { eyebrow: '04 / RESPONSIVO', title: <>Uma experiência. <span>Qualquer tela.</span></>, body: 'Desktop, notebook, tablet e mobile tratados como parte da experiência — sem sacrificar impacto ou fluidez.' },
  { eyebrow: '05 / MYS TECH', title: <>Seu próximo site pode <span>parecer impossível.</span></>, body: 'Sites institucionais, landing pages e experiências digitais premium construídas para não parecerem genéricas.' },
]

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <main>
      <div className="grain" />
      <header className="nav">
        <a className="brand" href="#top" aria-label="Mys Tech">
          <span className="brand-mark">M</span>
          <span>MYS TECH</span>
        </a>
        <div className="nav-meta">
          <span>WEB / 3D / INTERACTION</span>
          <a href="#contact">INICIAR PROJETO ↗</a>
        </div>
      </header>

      <div className="scene-wrap" aria-hidden="true">
        <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 8], fov: 42 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <MystechScene />
          </Suspense>
        </Canvas>
      </div>

      <div id="top" className="scroll-story">
        {sections.map((section, index) => (
          <section className={`story-section s-${index + 1}`} data-scene={index} key={section.eyebrow}>
            <div className="copy">
              <p className="eyebrow">{section.eyebrow}</p>
              <h1>{section.title}</h1>
              <p className="body">{section.body}</p>
              {index === 0 && <div className="scroll-hint"><i /> SCROLL TO ENTER</div>}
              {index === sections.length - 1 && (
                <a id="contact" className="cta" href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">
                  CRIAR MEU PROJETO <b>↗</b>
                </a>
              )}
            </div>
            <div className="chapter">{String(index + 1).padStart(2, '0')}</div>
          </section>
        ))}
      </div>
    </main>
  )
}
