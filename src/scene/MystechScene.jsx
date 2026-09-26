import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const STOPS = [
  { camera: [7.6, 6.7, 13.2], target: [0, 1.2, -2] },
  { camera: [-5.4, 5.0, 1.4], target: [-1.3, 1.3, -14] },
  { camera: [5.0, 4.4, -12.8], target: [1.5, 1.25, -26] },
  { camera: [-4.6, 4.0, -26.8], target: [-1.0, 1.25, -38] },
  { camera: [0.7, 5.0, -41.8], target: [0, 1.1, -51] },
]

const DISTRICTS = [
  { z: 0, x: 0 },
  { z: -12.5, x: -1.3 },
  { z: -25, x: 1.5 },
  { z: -37.5, x: -1.0 },
  { z: -50, x: 0 },
]

function seeded(n) {
  const x = Math.sin(n * 9127.17) * 43758.5453
  return x - Math.floor(x)
}

function City({ darkMix }) {
  const blocks = useMemo(() => {
    const items = []
    let id = 0

    DISTRICTS.forEach((district, districtIndex) => {
      for (let row = -3; row <= 3; row++) {
        for (let col = -4; col <= 4; col++) {
          const a = seeded(id + 13)
          const b = seeded(id + 101)
          const c = seeded(id + 233)
          const reserved = Math.abs(row) <= 1 && Math.abs(col) <= 1

          if (reserved || a < 0.2) {
            id++
            continue
          }

          items.push({
            key: `${districtIndex}-${row}-${col}`,
            x: district.x + col * 1.7,
            z: district.z + row * 1.48,
            width: 0.48 + b * 0.95,
            depth: 0.48 + c * 0.95,
            height: 0.18 + Math.pow(a, 2) * 2.4,
          })
          id++
        }
      }
    })

    return items
  }, [])

  const color = new THREE.Color('#f8f7f3').lerp(new THREE.Color('#1e1e1e'), darkMix)

  return (
    <group>
      {blocks.map((block) => (
        <mesh
          key={block.key}
          position={[block.x, block.height / 2, block.z]}
          scale={[block.width, block.height, block.depth]}
        >
          <boxGeometry />
          <meshStandardMaterial color={color} roughness={0.88} />
        </mesh>
      ))}
    </group>
  )
}

function Paths({ darkMix }) {
  const color = new THREE.Color('#d8d7d1').lerp(new THREE.Color('#303030'), darkMix)

  return (
    <group>
      <mesh position={[0, 0.012, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 64]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>

      {DISTRICTS.map((district, index) => (
        <mesh key={index} position={[district.x, 0.016, district.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[17.5, 1.15]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function InstitutionalScreen() {
  return (
    <div className="screen-ui screen-institutional">
      <div className="screen-top"><b>MYS TECH</b><span>Digital Studio</span></div>
      <div className="screen-hero">
        <small>DESIGN + TECNOLOGIA</small>
        <h3>Experiências digitais que fazem sentido.</h3>
        <p>Sites, sistemas e automações criados para transformar operação e percepção de marca.</p>
      </div>
      <div className="screen-footer"><span>Websites</span><span>Sistemas</span><span>IA</span></div>
    </div>
  )
}

function WebsiteScreen() {
  return (
    <div className="screen-ui screen-website">
      <div className="website-bar"><b>MYS / WEB</b><span>Projeto 01</span><i>↗</i></div>
      <div className="website-layout">
        <div>
          <small>EXPERIÊNCIA DIGITAL</small>
          <h3>Um site que reage ao usuário.</h3>
          <p>Movimento, profundidade e conteúdo trabalhando juntos.</p>
          <button>Explorar projeto</button>
        </div>
        <div className="website-card">
          <span>INTERACTIVE</span>
          <strong>01</strong>
          <div className="website-orbit" />
        </div>
      </div>
    </div>
  )
}

function SystemScreen() {
  return (
    <div className="screen-ui screen-system">
      <div className="system-sidebar">
        <b>MY SYSTEM</b>
        <span className="active">Visão geral</span>
        <span>Operação</span>
        <span>Clientes</span>
        <span>IA</span>
      </div>
      <div className="system-main">
        <div className="system-head"><div><small>ASSISTENTE OPERACIONAL</small><h3>O que precisa de atenção hoje?</h3></div><i>● online</i></div>
        <div className="ai-box">
          <div className="ai-user">Mostre os pontos críticos da operação.</div>
          <div className="ai-answer">
            <b>3 pontos merecem atenção</b>
            <span>• SLA acima do normal em duas regiões</span>
            <span>• 14 chamados concentrados no mesmo setor</span>
            <span>• Tendência de aumento no tempo médio</span>
          </div>
        </div>
        <div className="mini-kpis"><span><b>97.8%</b> SLA</span><span><b>24h</b> suporte</span><span><b>4.85</b> nota</span></div>
      </div>
    </div>
  )
}

function ProjectsScreen() {
  return (
    <div className="screen-ui screen-projects">
      <div className="projects-head"><small>PROJETOS SELECIONADOS</small><b>Construímos para diferentes contextos.</b></div>
      <div className="project-grid">
        <article><span>01</span><h4>Website institucional</h4><p>Marca, conteúdo e presença digital.</p></article>
        <article><span>02</span><h4>Sistema operacional</h4><p>Dados, fluxos e gestão em tempo real.</p></article>
        <article><span>03</span><h4>Automação com IA</h4><p>Atendimento e análise conectados.</p></article>
      </div>
    </div>
  )
}

function ContactScreen() {
  return (
    <div className="screen-ui screen-contact">
      <small>PRÓXIMO PROJETO</small>
      <h3>Conte a ideia.<br/>A gente constrói.</h3>
      <div className="contact-row"><span>WhatsApp</span><b>(35) 9 9754-1933 ↗</b></div>
      <div className="contact-row"><span>E-mail</span><b>contato@mystech.com.br ↗</b></div>
    </div>
  )
}

const screenContent = [
  <InstitutionalScreen key="inst" />,
  <WebsiteScreen key="web" />,
  <SystemScreen key="sys" />,
  <ProjectsScreen key="proj" />,
  <ContactScreen key="contact" />,
]

function Portal({ position, darkMix, index, scale = 1 }) {
  const frame = new THREE.Color('#ffffff').lerp(new THREE.Color('#111111'), darkMix)

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[5.65, 3.45, 0.1]} />
        <meshStandardMaterial color={frame} roughness={0.35} />
      </mesh>

      <Html
        transform
        center
        position={[0, 2.05, 0.065]}
        distanceFactor={1.05}
        style={{ width: '640px', height: '390px', pointerEvents: 'auto' }}
      >
        {screenContent[index]}
      </Html>
    </group>
  )
}

function SceneContent({ darkMix }) {
  const ground = new THREE.Color('#ecebe6').lerp(new THREE.Color('#141414'), darkMix)

  return (
    <>
      <mesh position={[0, -0.05, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 66]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>

      <Paths darkMix={darkMix} />
      <City darkMix={darkMix} />

      <Portal position={[0, 0, -5.6]} darkMix={darkMix} index={0} />
      <Portal position={[-1.3, 0, -18.1]} darkMix={darkMix} index={1} scale={0.98} />
      <Portal position={[1.5, 0, -30.6]} darkMix={darkMix} index={2} scale={1.03} />
      <Portal position={[-1, 0, -43.1]} darkMix={darkMix} index={3} />
      <Portal position={[0, 0, -55.6]} darkMix={darkMix} index={4} scale={1.02} />
    </>
  )
}

export default function MystechScene({ theme }) {
  const { camera, scene } = useThree()
  const progress = useRef(0)
  const smoothProgress = useRef(0)
  const darkMix = useRef(theme === 'dark' ? 1 : 0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useFrame(() => {
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, progress.current, 0.072)
    darkMix.current = THREE.MathUtils.lerp(darkMix.current, theme === 'dark' ? 1 : 0, 0.055)

    const p = smoothProgress.current * (STOPS.length - 1)
    const current = Math.min(Math.floor(p), STOPS.length - 2)
    const local = THREE.MathUtils.smoothstep(p - current, 0, 1)

    const from = STOPS[current]
    const to = STOPS[current + 1]
    const cameraPosition = new THREE.Vector3(...from.camera).lerp(new THREE.Vector3(...to.camera), local)
    const target = new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), local)

    camera.position.lerp(cameraPosition, 0.11)
    camera.lookAt(target)

    const background = new THREE.Color('#ecebe6').lerp(new THREE.Color('#111111'), darkMix.current)
    scene.background = background
    if (scene.fog) scene.fog.color.copy(background)
  })

  return (
    <>
      <fog attach="fog" args={[theme === 'dark' ? '#111111' : '#ecebe6', 14, 31]} />
      <ambientLight intensity={theme === 'dark' ? 1.3 : 2.1} />
      <directionalLight position={[8, 14, 10]} intensity={theme === 'dark' ? 1.5 : 2.0} />
      <directionalLight position={[-7, 8, -6]} intensity={0.55} />
      <SceneContent darkMix={darkMix.current} />
    </>
  )
}
