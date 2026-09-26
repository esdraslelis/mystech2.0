import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const STOPS = [
  { camera: [7.2, 7.4, 14.5], target: [0, 0.4, -2] },
  { camera: [6.2, 6.2, 2.5], target: [0, 0.5, -14] },
  { camera: [5.2, 5.5, -10.5], target: [0, 0.7, -26] },
  { camera: [4.5, 5.2, -23.5], target: [0, 0.7, -38] },
  { camera: [3.8, 5.6, -36.5], target: [0, 0.8, -50] },
]

const DISTRICTS = [0, -12.5, -25, -37.5, -50]

function seeded(n) {
  const x = Math.sin(n * 7231.217) * 43758.5453
  return x - Math.floor(x)
}

function City() {
  const blocks = useMemo(() => {
    const items = []
    let id = 0
    DISTRICTS.forEach((z, district) => {
      for (let row = -3; row <= 3; row++) {
        for (let col = -5; col <= 5; col++) {
          const a = seeded(id + 19)
          const b = seeded(id + 71)
          const c = seeded(id + 173)
          if (Math.abs(col) < 2 || a < .18) { id++; continue }
          items.push({
            key: `${district}-${row}-${col}`,
            x: col * 1.55 + (b - .5) * .18,
            z: z + row * 1.5,
            w: .5 + b * .9,
            d: .5 + c * .9,
            h: .2 + Math.pow(a, 2.15) * 3.1,
          })
          id++
        }
      }
    })
    return items
  }, [])

  return (
    <group>
      {blocks.map((b) => (
        <mesh key={b.key} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.d]}>
          <boxGeometry />
          <meshStandardMaterial color="#111827" roughness={.78} metalness={.08} />
        </mesh>
      ))}
    </group>
  )
}

function Route() {
  return (
    <group>
      <mesh position={[0, .015, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 64]} />
        <meshStandardMaterial color="#09111e" roughness={1} />
      </mesh>
      <mesh position={[0, .032, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[.055, 64]} />
        <meshBasicMaterial color="#2f81ff" />
      </mesh>

      {DISTRICTS.map((z, i) => (
        <group key={z} position={[0, .04, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 64]} />
            <meshStandardMaterial color={i === 2 ? '#0c1d38' : '#0a1423'} roughness={.88} />
          </mesh>
          <mesh position={[0, .025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.54, 1.59, 64]} />
            <meshBasicMaterial color="#2f81ff" transparent opacity={.72} />
          </mesh>
          <mesh position={[0, .06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[.09, 24]} />
            <meshBasicMaterial color="#66a7ff" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function AccentStructures() {
  return (
    <group>
      {DISTRICTS.map((z, i) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[2.2, .95 + (i % 2) * .35, 0]} scale={[1.5, 1.9 + (i % 2) * .7, 1.1]}>
            <boxGeometry />
            <meshStandardMaterial color="#17243a" roughness={.55} metalness={.15} />
          </mesh>
          <mesh position={[2.2, 1.95 + (i % 2) * .7, .57]}>
            <planeGeometry args={[1.0, .06]} />
            <meshBasicMaterial color="#2f81ff" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function MystechScene() {
  const { camera, scene } = useThree()
  const progress = useRef(0)
  const smooth = useRef(0)

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
    smooth.current = THREE.MathUtils.lerp(smooth.current, progress.current, .07)
    const p = smooth.current * (STOPS.length - 1)
    const i = Math.min(Math.floor(p), STOPS.length - 2)
    const t = THREE.MathUtils.smoothstep(p - i, 0, 1)
    const from = STOPS[i]
    const to = STOPS[i + 1]

    const pos = new THREE.Vector3(...from.camera).lerp(new THREE.Vector3(...to.camera), t)
    const target = new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), t)

    camera.position.lerp(pos, .12)
    camera.lookAt(target)
    scene.background = new THREE.Color('#05070b')
  })

  return (
    <>
      <fog attach="fog" args={['#05070b', 13, 34]} />
      <ambientLight intensity={.62} />
      <directionalLight position={[7, 12, 8]} intensity={1.9} color="#cfe3ff" />
      <pointLight position={[0, 3, -18]} intensity={12} distance={14} color="#2f81ff" />
      <pointLight position={[0, 3, -42]} intensity={10} distance={14} color="#1a68d8" />

      <mesh position={[0, -.06, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[38, 68]} />
        <meshStandardMaterial color="#070b12" roughness={1} />
      </mesh>

      <Route />
      <City />
      <AccentStructures />
    </>
  )
}
