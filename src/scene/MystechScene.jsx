import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const DISTRICTS = [
  { z: 0, x: 0, label: 'START' },
  { z: -12, x: -1.5, label: 'STRATEGY' },
  { z: -24, x: 1.8, label: 'DESIGN' },
  { z: -36, x: -1.2, label: 'BUILD' },
  { z: -48, x: 1.2, label: 'DELIVER' },
  { z: -60, x: 0, label: 'MYS TECH' },
]

function seeded(n) {
  const x = Math.sin(n * 9127.17) * 43758.5453
  return x - Math.floor(x)
}

function CityBlocks() {
  const blocks = useMemo(() => {
    const result = []
    let id = 0

    DISTRICTS.forEach((district, d) => {
      for (let row = -3; row <= 3; row++) {
        for (let col = -4; col <= 4; col++) {
          const r1 = seeded(id + 11)
          const r2 = seeded(id + 97)
          const r3 = seeded(id + 211)
          const nearCenter = Math.abs(row) < 1 && Math.abs(col) < 2

          if (nearCenter || r1 < 0.16) {
            id++
            continue
          }

          const w = 0.55 + r2 * 0.9
          const dpth = 0.55 + r3 * 0.9
          const h = 0.18 + Math.pow(r1, 2.1) * 2.8

          result.push({
            key: `${d}-${row}-${col}`,
            x: district.x + col * 1.75 + (r2 - 0.5) * 0.22,
            z: district.z + row * 1.55 + (r3 - 0.5) * 0.18,
            w,
            d: dpth,
            h,
          })
          id++
        }
      }
    })

    return result
  }, [])

  return (
    <group>
      {blocks.map((b) => (
        <mesh key={b.key} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.d]}>
          <boxGeometry />
          <meshStandardMaterial color="#f7f6f2" roughness={0.82} metalness={0.02} />
        </mesh>
      ))}
    </group>
  )
}

function Roads() {
  return (
    <group>
      <mesh position={[0, 0.012, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1, 72]} />
        <meshStandardMaterial color="#deddd7" roughness={1} />
      </mesh>

      {DISTRICTS.map((d, i) => (
        <mesh key={i} position={[d.x, 0.016, d.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 1.35]} />
          <meshStandardMaterial color="#deddd7" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function ScreenGate({ position, rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[5.4, 3.25, 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>

      <mesh position={[0, 2.15, 0.045]}>
        <planeGeometry args={[4.9, 2.75]} />
        <meshBasicMaterial color="#f1f0eb" />
      </mesh>

      <mesh position={[-1.72, 3.15, 0.08]}>
        <boxGeometry args={[0.9, 0.08, 0.025]} />
        <meshBasicMaterial color="#161616" />
      </mesh>

      <mesh position={[0, 1.75, 0.08]}>
        <boxGeometry args={[3.15, 0.045, 0.025]} />
        <meshBasicMaterial color="#c9c8c1" />
      </mesh>

      <mesh position={[0, 1.42, 0.08]}>
        <boxGeometry args={[2.4, 0.045, 0.025]} />
        <meshBasicMaterial color="#d8d7d0" />
      </mesh>
    </group>
  )
}

function Gates() {
  return (
    <group>
      <ScreenGate position={[0, 0, -5]} rotation={[0, 0, 0]} />
      <ScreenGate position={[-1.5, 0, -17]} rotation={[0, 0.08, 0]} scale={0.94} />
      <ScreenGate position={[1.8, 0, -29]} rotation={[0, -0.08, 0]} scale={1.03} />
      <ScreenGate position={[-1.2, 0, -41]} rotation={[0, 0.05, 0]} scale={0.96} />
      <ScreenGate position={[1.2, 0, -53]} rotation={[0, -0.05, 0]} scale={1.05} />
    </group>
  )
}

function DistrictPads() {
  return (
    <group>
      {DISTRICTS.map((d, i) => (
        <group key={d.label} position={[d.x, 0.026, d.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.15, 64]} />
            <meshStandardMaterial
              color={i === DISTRICTS.length - 1 ? '#dbe7d1' : '#ebeae5'}
              roughness={0.9}
            />
          </mesh>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.25, 2.28, 64]} />
            <meshBasicMaterial color="#aeadab" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function MystechScene() {
  const progress = useRef(0)
  const smooth = useRef(0)
  const world = useRef()
  const { camera } = useThree()

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useFrame(() => {
    smooth.current = THREE.MathUtils.lerp(smooth.current, progress.current, 0.045)
    const p = smooth.current
    const travel = p * 60
    const sway = Math.sin(p * Math.PI * 5) * 1.4

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 7.6 + sway, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 8.4 - p * 1.2, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 12.5 - travel, 0.04)

    const target = new THREE.Vector3(
      Math.sin(p * Math.PI * 5) * 0.8,
      0.7,
      -4.2 - travel
    )
    camera.lookAt(target)

    if (world.current) {
      world.current.rotation.y = Math.sin(p * Math.PI * 4) * 0.015
    }
  })

  return (
    <>
      <color attach="background" args={['#ecebe6']} />
      <fog attach="fog" args={['#ecebe6', 16, 34]} />

      <ambientLight intensity={2.3} />
      <directionalLight position={[8, 14, 10]} intensity={2.1} />
      <directionalLight position={[-8, 8, -6]} intensity={0.8} />

      <group ref={world}>
        <mesh position={[0, -0.05, -30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[34, 78]} />
          <meshStandardMaterial color="#ecebe6" roughness={1} />
        </mesh>

        <Roads />
        <DistrictPads />
        <CityBlocks />
        <Gates />
      </group>
    </>
  )
}
