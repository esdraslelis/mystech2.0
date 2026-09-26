import { Html, Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const PATH_POINTS = [
  new THREE.Vector3(0, 0.35, 8),
  new THREE.Vector3(1.8, 0.45, -6),
  new THREE.Vector3(-1.6, 0.65, -22),
  new THREE.Vector3(1.4, 0.55, -39),
  new THREE.Vector3(0, 0.8, -56),
]

function makeTerrain() {
  const g = new THREE.PlaneGeometry(58, 86, 100, 150)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const valley = Math.exp(-Math.pow(x / 8.5, 2))
    const wave =
      Math.sin(x * 0.31) * 0.8 +
      Math.cos(y * 0.19) * 0.72 +
      Math.sin((x + y) * 0.11) * 0.5
    const ridge = Math.pow(Math.abs(x) / 22, 2.25) * 8
    pos.setZ(i, ridge + wave * (1 - valley * 0.55))
  }
  g.computeVertexNormals()
  return g
}

function Terrain() {
  const geometry = useMemo(() => makeTerrain(), [])
  return (
    <>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, -24]}>
        <meshStandardMaterial color="#0b1830" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.86, -26]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 82]} />
        <meshPhysicalMaterial color="#061a34" roughness={0.18} metalness={0.15} transparent opacity={0.94} />
      </mesh>
    </>
  )
}

function Route({ curve }) {
  const core = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.055, 10, false), [curve])
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.16, 10, false), [curve])
  return (
    <group>
      <mesh geometry={glow}><meshBasicMaterial color="#063d7d" transparent opacity={0.34} /></mesh>
      <mesh geometry={core}><meshBasicMaterial color="#48b4ff" /></mesh>
    </group>
  )
}

function Tower({ position, height = 1.2, width = 0.22 }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} scale={[width, height, width]}>
      <boxGeometry />
      <meshStandardMaterial color="#102c4e" emissive="#0e5da0" emissiveIntensity={0.5} roughness={0.45} />
    </mesh>
  )
}

function City({ position, seed = 0 }) {
  const towers = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2 + seed
      const r = 0.7 + ((i * 13) % 11) * 0.17
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h: 0.35 + ((i * 17) % 12) * 0.16,
        w: 0.12 + ((i * 5) % 4) * 0.025,
      }
    })
  }, [seed])

  return (
    <group position={position}>
      {towers.map((t, i) => <Tower key={i} position={[t.x, 0, t.z]} height={t.h} width={t.w} />)}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.3, 64]} />
        <meshBasicMaterial color="#2c9df0" transparent opacity={0.75} />
      </mesh>
      <pointLight position={[0, 1.2, 0]} intensity={12} distance={8} color="#2b9cff" />
    </group>
  )
}

function WorldPanel({ active, position, side = 'right', title, eyebrow, children }) {
  return (
    <group position={position}>
      <Html
        transform
        distanceFactor={6.2}
        position={[side === 'right' ? 2.8 : -2.8, 2.0, 0]}
        style={{
          width: '340px',
          pointerEvents: active ? 'auto' : 'none',
          opacity: active ? 1 : 0,
          transform: `translate3d(0,${active ? 0 : 18}px,0)`,
          transition: 'opacity .55s ease, transform .55s ease',
        }}
      >
        <div className="world-panel">
          <small>{eyebrow}</small>
          <h2>{title}</h2>
          {children}
        </div>
      </Html>
    </group>
  )
}

function WebArea({ active }) {
  return (
    <group position={[1.8, 0, -8]}>
      <City position={[0, 0, 0]} seed={0.8} />
      <mesh position={[0, 1.7, 0]}>
        <torusGeometry args={[2.3, 0.12, 16, 80]} />
        <meshStandardMaterial color="#123d70" emissive="#2a8de6" emissiveIntensity={0.75} />
      </mesh>
      <WorldPanel active={active} position={[0,0,0]} title="Web District" eyebrow="02 / WEBSITES">
        <p>Sites institucionais, landing pages e experiências interativas.</p>
        <div className="world-list">
          <span>UI/UX estratégico</span>
          <span>SEO e performance</span>
          <span>Motion e 3D</span>
          <span>Responsivo</span>
        </div>
      </WorldPanel>
    </group>
  )
}

function SystemsArea({ active }) {
  return (
    <group position={[-1.6, 0, -24]}>
      <City position={[0,0,0]} seed={2.1} />
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[1.15, 40, 40]} />
        <meshPhysicalMaterial color="#0b2040" metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.0, 0]} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#45a9ff" wireframe transparent opacity={0.5} />
      </mesh>
      <WorldPanel active={active} position={[0,0,0]} side="left" title="AI Core" eyebrow="03 / SISTEMAS + IA">
        <p>Sistemas personalizados para operação, gestão e tomada de decisão.</p>
        <div className="world-list">
          <span>Dashboards em tempo real</span>
          <span>Automação de processos</span>
          <span>Assistentes com IA</span>
          <span>Integrações via API</span>
        </div>
      </WorldPanel>
    </group>
  )
}

function ProjectsArea({ active }) {
  const projects = [
    ['Website Institucional', 'Identidade, experiência, SEO e conversão.'],
    ['Sistema Operacional', 'Fluxos, indicadores e gestão em tempo real.'],
    ['Automação com IA', 'Análise, atendimento e processos inteligentes.'],
  ]

  return (
    <group position={[1.4, 0, -41]}>
      <City position={[0,0,0]} seed={3.4} />
      <WorldPanel active={active} position={[0,0,0]} title="Project Valley" eyebrow="04 / PROJETOS">
        <p>Projetos construídos para problemas reais.</p>
        <div className="project-world-list">
          {projects.map(([name, desc], i) => (
            <article key={name}>
              <b>0{i + 1}</b>
              <div><strong>{name}</strong><span>{desc}</span></div>
            </article>
          ))}
        </div>
      </WorldPanel>
    </group>
  )
}

function ContactArea({ active }) {
  return (
    <group position={[0, 0, -58]}>
      <City position={[0,0,0]} seed={4.7} />
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.45, 1.4, 5.4, 12]} />
        <meshStandardMaterial color="#0b2b50" roughness={0.38} metalness={0.25} />
      </mesh>
      <mesh position={[0, 6.0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial color="#8fd4ff" emissive="#2a9dff" emissiveIntensity={2.5} />
      </mesh>
      <WorldPanel active={active} position={[0,0,0]} side="left" title="Launch Point" eyebrow="05 / CONTATO">
        <p>Seu próximo projeto começa daqui.</p>
        <a className="world-cta" href="https://wa.me/5535997541933" target="_blank" rel="noreferrer">INICIAR PROJETO ↗</a>
      </WorldPanel>
    </group>
  )
}

function Player({ curve, progress }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const pos = curve.getPointAt(progress.current)
    ref.current.position.copy(pos)
    ref.current.position.y += 0.45 + Math.sin(state.clock.elapsedTime * 4) * 0.04
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshPhysicalMaterial color="#dff5ff" emissive="#4ab7ff" emissiveIntensity={2.4} />
      </mesh>
      <pointLight intensity={6} distance={4} color="#43aaff" />
    </group>
  )
}

export default function MystechScene({ activeZone }) {
  const { camera, scene, pointer } = useThree()
  const scroll = useRef(0)
  const smooth = useRef(0)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.12), [])

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll.current = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useFrame(() => {
    smooth.current = THREE.MathUtils.lerp(smooth.current, scroll.current, 0.07)
    const p = smooth.current
    const pos = curve.getPointAt(p)
    const tangent = curve.getTangentAt(Math.min(0.998, p + 0.002)).normalize()
    const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0,1,0)).normalize()

    const desired = pos.clone()
      .add(tangent.clone().multiplyScalar(-7.8))
      .add(new THREE.Vector3(0, 4.5, 0))
      .add(right.multiplyScalar(pointer.x * 1.25))

    const target = pos.clone()
      .add(tangent.clone().multiplyScalar(4.8))
      .add(new THREE.Vector3(0, 1.05 + pointer.y * 0.3, 0))

    camera.position.lerp(desired, 0.085)
    camera.lookAt(target)
    scene.background = new THREE.Color('#071226')
  })

  return (
    <>
      <fog attach="fog" args={['#071226', 16, 46]} />
      <ambientLight intensity={0.52} />
      <hemisphereLight intensity={0.72} color="#6db7ff" groundColor="#030814" />
      <directionalLight position={[8, 14, 8]} intensity={1.55} color="#d7eaff" />

      <Terrain />
      <Route curve={curve} />

      <City position={[0,0,5]} seed={0.2} />
      <WebArea active={activeZone === 1} />
      <SystemsArea active={activeZone === 2} />
      <ProjectsArea active={activeZone === 3} />
      <ContactArea active={activeZone === 4} />
      <Player curve={curve} progress={smooth} />

      <Sparkles count={150} scale={[44, 16, 86]} size={1.15} speed={0.14} opacity={0.3} color="#71bfff" />
    </>
  )
}
