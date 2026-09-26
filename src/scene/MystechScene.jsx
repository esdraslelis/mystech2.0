import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const STOPS = [
  { camera: [7.8, 7.2, 13.5], target: [0, 0.6, -1.5] },
  { camera: [-5.8, 5.6, 2.2], target: [-1.4, 0.7, -11.5] },
  { camera: [5.4, 4.7, -10.8], target: [1.6, 0.9, -23.6] },
  { camera: [-4.6, 4.0, -22.6], target: [-1.0, 1.0, -35.4] },
  { camera: [4.4, 5.3, -35.2], target: [1.2, 0.7, -47.6] },
  { camera: [0.2, 6.4, -49.5], target: [0, 0.8, -60] },
]

const DISTRICTS = [
  { z: 0, x: 0 },
  { z: -12, x: -1.4 },
  { z: -24, x: 1.6 },
  { z: -36, x: -1.0 },
  { z: -48, x: 1.2 },
  { z: -60, x: 0 },
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

          if (reserved || a < 0.18) {
            id++
            continue
          }

          const width = 0.48 + b * 0.95
          const depth = 0.48 + c * 0.95
          const height = 0.18 + Math.pow(a, 2) * 2.5

          items.push({
            key: `${districtIndex}-${row}-${col}`,
            x: district.x + col * 1.7,
            z: district.z + row * 1.48,
            width,
            depth,
            height,
          })
          id++
        }
      }
    })

    return items
  }, [])

  const light = new THREE.Color('#f8f7f3')
  const dark = new THREE.Color('#202020')
  const color = light.clone().lerp(dark, darkMix)

  return (
    <group>
      {blocks.map((block) => (
        <mesh
          key={block.key}
          position={[block.x, block.height / 2, block.z]}
          scale={[block.width, block.height, block.depth]}
        >
          <boxGeometry />
          <meshStandardMaterial color={color} roughness={0.88} metalness={0.01} />
        </mesh>
      ))}
    </group>
  )
}

function Paths({ darkMix }) {
  const light = new THREE.Color('#d8d7d1')
  const dark = new THREE.Color('#323232')
  const color = light.clone().lerp(dark, darkMix)

  return (
    <group>
      <mesh position={[0, 0.012, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 73]} />
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

function Portal({ position, darkMix, scale = 1 }) {
  const frameLight = new THREE.Color('#ffffff')
  const frameDark = new THREE.Color('#111111')
  const panelLight = new THREE.Color('#f2f1ec')
  const panelDark = new THREE.Color('#292929')

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[5.2, 3.1, 0.08]} />
        <meshStandardMaterial color={frameLight.clone().lerp(frameDark, darkMix)} roughness={0.42} />
      </mesh>

      <mesh position={[0, 2.05, 0.05]}>
        <planeGeometry args={[4.7, 2.6]} />
        <meshBasicMaterial color={panelLight.clone().lerp(panelDark, darkMix)} />
      </mesh>

      <mesh position={[-1.58, 2.84, 0.085]}>
        <boxGeometry args={[1.05, 0.055, 0.03]} />
        <meshBasicMaterial color={darkMix > 0.5 ? '#f2f2ef' : '#171717'} />
      </mesh>
    </group>
  )
}

function SceneContent({ darkMix }) {
  const groundLight = new THREE.Color('#ecebe6')
  const groundDark = new THREE.Color('#141414')
  const ground = groundLight.clone().lerp(groundDark, darkMix)

  return (
    <>
      <mesh position={[0, -0.05, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 78]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>

      <Paths darkMix={darkMix} />
      <City darkMix={darkMix} />

      <Portal position={[0, 0, -5.5]} darkMix={darkMix} />
      <Portal position={[-1.4, 0, -17.4]} darkMix={darkMix} scale={0.95} />
      <Portal position={[1.6, 0, -29.4]} darkMix={darkMix} scale={1.02} />
      <Portal position={[-1, 0, -41.4]} darkMix={darkMix} scale={0.97} />
      <Portal position={[1.2, 0, -53.4]} darkMix={darkMix} scale={1.03} />
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
    smoothProgress.current = THREE.MathUtils.lerp(smoothProgress.current, progress.current, 0.075)
    darkMix.current = THREE.MathUtils.lerp(darkMix.current, theme === 'dark' ? 1 : 0, 0.06)

    const p = smoothProgress.current * (STOPS.length - 1)
    const current = Math.min(Math.floor(p), STOPS.length - 2)
    const local = THREE.MathUtils.smoothstep(p - current, 0, 1)

    const from = STOPS[current]
    const to = STOPS[current + 1]

    const cameraPosition = new THREE.Vector3(...from.camera).lerp(new THREE.Vector3(...to.camera), local)
    const target = new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), local)

    camera.position.lerp(cameraPosition, 0.12)
    camera.lookAt(target)

    const bgLight = new THREE.Color('#ecebe6')
    const bgDark = new THREE.Color('#111111')
    const background = bgLight.clone().lerp(bgDark, darkMix.current)

    scene.background = background
    if (scene.fog) {
      scene.fog.color.copy(background)
    }
  })

  const fogColor = theme === 'dark' ? '#111111' : '#ecebe6'

  return (
    <>
      <fog attach="fog" args={[fogColor, 14, 31]} />
      <ambientLight intensity={theme === 'dark' ? 1.3 : 2.1} />
      <directionalLight position={[8, 14, 10]} intensity={theme === 'dark' ? 1.5 : 2.0} />
      <directionalLight position={[-7, 8, -6]} intensity={0.55} />

      <SceneContent darkMix={darkMix.current} />
    </>
  )
}
