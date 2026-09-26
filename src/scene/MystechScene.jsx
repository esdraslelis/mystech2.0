import { Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const CAMERA_STOPS = [
  { pos: [10.5, 7.2, 17], target: [0, 0.2, -4] },
  { pos: [9, 6.2, 5], target: [0.5, 0.4, -14] },
  { pos: [8.2, 5.8, -7], target: [-1.2, 0.5, -25] },
  { pos: [7.2, 5.4, -20], target: [1.2, 0.45, -37] },
  { pos: [6.2, 5.6, -33], target: [-0.8, 0.5, -49] },
  { pos: [5.2, 6.0, -46], target: [0, 0.6, -60] },
]

const NODE_POSITIONS = [
  [0, 0, -6],
  [1.8, 0, -17],
  [-1.4, 0, -29],
  [1.2, 0, -41],
  [-0.8, 0, -52],
  [0, 0, -62],
]

function buildTerrain() {
  const geo = new THREE.PlaneGeometry(58, 92, 120, 180)
  const pos = geo.attributes.position

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const nx = x / 29
    const valley = Math.exp(-Math.pow(x / 8, 2))
    const waves =
      Math.sin(x * 0.28) * 0.6 +
      Math.cos(y * 0.15) * 0.9 +
      Math.sin((x + y) * 0.09) * 0.7 +
      Math.cos((x - y) * 0.07) * 0.4
    const mountains = Math.pow(Math.abs(nx), 2.4) * 9.2
    pos.setZ(i, mountains + waves * (1.25 - valley * 0.5))
  }

  geo.computeVertexNormals()
  return geo
}

function Terrain() {
  const geometry = useMemo(() => buildTerrain(), [])

  return (
    <>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, -29]}>
        <meshStandardMaterial color="#0b1f3b" roughness={0.92} metalness={0.03} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, -30]}>
        <planeGeometry args={[30, 90]} />
        <meshPhysicalMaterial
          color="#061a35"
          roughness={0.18}
          metalness={0.18}
          transparent
          opacity={0.96}
        />
      </mesh>
    </>
  )
}

function Network() {
  const curves = useMemo(() => {
    const center = new THREE.CatmullRomCurve3(
      NODE_POSITIONS.map(([x, y, z]) => new THREE.Vector3(x, y + 0.16, z)),
      false,
      'catmullrom',
      0.2
    )

    const branches = [
      [[0,-6],[-5,-13],[-7,-21],[-4,-30],[-8,-38],[-5,-48],[-9,-58]],
      [[0,-7],[6,-13],[8,-23],[5,-31],[9,-41],[6,-53]],
      [[0,-5],[4,-10],[-1,-18],[5,-24],[0,-34],[5,-43],[1,-53]],
      [[-2,-10],[-8,-17],[-3,-25],[-9,-34],[-2,-44],[-7,-55]],
      [[3,-12],[9,-18],[4,-27],[10,-36],[3,-46],[8,-58]],
    ].map((pts) => new THREE.CatmullRomCurve3(
      pts.map(([x,z]) => new THREE.Vector3(x, 0.11, z)),
      false,
      'catmullrom',
      0.22
    ))

    return [center, ...branches]
  }, [])

  return (
    <group>
      {curves.map((curve, index) => {
        const core = new THREE.TubeGeometry(curve, 180, index === 0 ? 0.05 : 0.022, 8, false)
        const glow = new THREE.TubeGeometry(curve, 180, index === 0 ? 0.17 : 0.08, 8, false)
        return (
          <group key={index}>
            <mesh geometry={glow}>
              <meshBasicMaterial color="#0f5fb2" transparent opacity={index === 0 ? 0.26 : 0.13} />
            </mesh>
            <mesh geometry={core}>
              <meshBasicMaterial color={index === 0 ? '#41b5ff' : '#1e76c8'} transparent opacity={index === 0 ? 1 : 0.58} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function City({ position, seed = 1, scale = 1 }) {
  const towers = useMemo(() => {
    const arr = []
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + seed
      const ring = i % 3
      const radius = 0.55 + ring * 0.55 + ((i * 13) % 7) * 0.06
      arr.push({
        x: Math.cos(a) * radius,
        z: Math.sin(a) * radius,
        h: 0.28 + ((i * 17) % 13) * 0.13,
        w: 0.08 + ((i * 5) % 4) * 0.026,
      })
    }
    return arr
  }, [seed])

  return (
    <group position={position} scale={scale}>
      {towers.map((tower, index) => (
        <mesh
          key={index}
          position={[tower.x, tower.h / 2, tower.z]}
          scale={[tower.w, tower.h, tower.w]}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="#0d3159"
            emissive="#0b6bb8"
            emissiveIntensity={0.5}
            roughness={0.48}
          />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[2.0, 2.08, 64]} />
        <meshBasicMaterial color="#47b9ff" transparent opacity={0.68} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#b9e7ff" />
      </mesh>

      <pointLight position={[0, 1.2, 0]} intensity={9} distance={7} color="#2c9fff" />
    </group>
  )
}

function Monolith({ activeStage }) {
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.04
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.018
    ref.current.scale.setScalar(pulse)
  })

  const pos = NODE_POSITIONS[Math.min(activeStage, NODE_POSITIONS.length - 1)]

  return (
    <group ref={ref} position={[pos[0], 0.2, pos[2]]}>
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.85, 1.25, 4.5, 6]} />
        <meshPhysicalMaterial
          color="#112a4c"
          metalness={0.62}
          roughness={0.24}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[0, 4.8, 0]}>
        <octahedronGeometry args={[0.56, 0]} />
        <meshPhysicalMaterial
          color="#7fcbff"
          emissive="#2fa8ff"
          emissiveIntensity={2.3}
          roughness={0.12}
        />
      </mesh>

      <pointLight position={[0, 5, 0]} intensity={18} distance={11} color="#2fa8ff" />
    </group>
  )
}

function PulseDots() {
  const refs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((mesh, index) => {
      if (!mesh) return
      const p = (t * 0.08 + index * 0.17) % 1
      const z = 6 - p * 70
      const x = Math.sin(p * 13 + index) * 2.6
      mesh.position.set(x, 0.25, z)
    })
  })

  return (
    <group>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} ref={(el) => (refs.current[index] = el)}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#9ddcff" />
        </mesh>
      ))}
    </group>
  )
}

export default function MystechScene({ activeStage }) {
  const { camera, scene, pointer } = useThree()
  const scroll = useRef(0)
  const smooth = useRef(0)
  const pointerLight = useRef()

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
    smooth.current = THREE.MathUtils.lerp(smooth.current, scroll.current, 0.06)

    const p = smooth.current * (CAMERA_STOPS.length - 1)
    const index = Math.min(Math.floor(p), CAMERA_STOPS.length - 2)
    const local = THREE.MathUtils.smoothstep(p - index, 0, 1)

    const from = CAMERA_STOPS[index]
    const to = CAMERA_STOPS[index + 1]

    const pos = new THREE.Vector3(...from.pos).lerp(new THREE.Vector3(...to.pos), local)
    const target = new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), local)

    pos.x += pointer.x * 0.55
    pos.y += pointer.y * 0.18
    target.x += pointer.x * 0.35

    camera.position.lerp(pos, 0.085)
    camera.lookAt(target)

    if (pointerLight.current) {
      pointerLight.current.position.set(pointer.x * 8, 5 + pointer.y * 2, target.z + 4)
    }

    scene.background = new THREE.Color('#071b3b')
  })

  return (
    <>
      <fog attach="fog" args={['#071b3b', 19, 50]} />
      <ambientLight intensity={0.48} />
      <hemisphereLight intensity={0.7} color="#7bc5ff" groundColor="#020815" />
      <directionalLight position={[10, 15, 7]} intensity={1.45} color="#e1efff" />
      <pointLight ref={pointerLight} intensity={17} distance={16} color="#2d99ff" />

      <Terrain />
      <Network />

      {NODE_POSITIONS.map((position, index) => (
        <City
          key={index}
          position={[position[0], 0, position[2]]}
          seed={0.7 + index * 0.9}
          scale={index === activeStage ? 1.1 : 0.92}
        />
      ))}

      <Monolith activeStage={activeStage} />
      <PulseDots />

      <Sparkles
        count={180}
        scale={[44, 18, 92]}
        size={1.15}
        speed={0.12}
        opacity={0.3}
        color="#8ed2ff"
      />
    </>
  )
}
