import { Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const PATH = [
  new THREE.Vector3(-7, 0.55, 9),
  new THREE.Vector3(-3, 0.55, 2),
  new THREE.Vector3(1, 0.6, -5),
  new THREE.Vector3(4, 0.6, -13),
  new THREE.Vector3(0, 0.7, -21),
  new THREE.Vector3(-5, 0.7, -29),
  new THREE.Vector3(-1, 0.7, -38),
  new THREE.Vector3(5, 0.75, -47),
  new THREE.Vector3(1, 0.8, -57),
]

function terrainGeometry() {
  const geo = new THREE.PlaneGeometry(48, 82, 90, 150)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const valley = Math.exp(-Math.pow(x / 9, 2))
    const noise =
      Math.sin(x * 0.43) * 0.6 +
      Math.cos(y * 0.2) * 0.52 +
      Math.sin((x + y) * 0.15) * 0.48
    const ridge = Math.pow(Math.abs(x) / 20, 2.1) * 6
    pos.setZ(i, ridge + noise * (1.2 - valley * 0.55))
  }
  geo.computeVertexNormals()
  return geo
}

function Terrain() {
  const geo = useMemo(() => terrainGeometry(), [])
  return (
    <group>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, -24]}>
        <meshStandardMaterial color="#07172d" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.95, -24]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 72]} />
        <meshPhysicalMaterial color="#071b35" roughness={0.28} metalness={0.1} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

function RoadNetwork() {
  const curves = useMemo(() => {
    const list = []
    const base = new THREE.CatmullRomCurve3(PATH, false, 'catmullrom', 0.15)
    list.push({ curve: base, width: 0.055, color: '#2da1ff', opacity: 1 })

    const sideSets = [
      [[-6,4],[-8,-5],[-4,-15],[-8,-23],[-3,-32]],
      [[6,6],[8,-2],[5,-12],[9,-21],[4,-33],[8,-43]],
      [[-1,4],[4,-3],[-2,-11],[4,-18],[-1,-27],[3,-36],[-2,-46]],
      [[-9,0],[-6,-8],[-10,-18],[-6,-29],[-9,-40]],
    ]

    sideSets.forEach((set, idx) => {
      const pts = set.map(([x,z]) => new THREE.Vector3(x, 0.35 + idx * 0.03, z))
      list.push({
        curve: new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2),
        width: idx === 2 ? 0.035 : 0.024,
        color: idx === 2 ? '#3eb4ff' : '#0f69b8',
        opacity: idx === 2 ? 0.85 : 0.52,
      })
    })

    return list
  }, [])

  return (
    <group>
      {curves.map((item, index) => {
        const geo = new THREE.TubeGeometry(item.curve, 180, item.width, 8, false)
        return (
          <mesh key={index} geometry={geo}>
            <meshBasicMaterial color={item.color} transparent opacity={item.opacity} />
          </mesh>
        )
      })}
    </group>
  )
}

function Node({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.58, 48]} />
        <meshBasicMaterial color="#62c2ff" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color="#b6e5ff" />
      </mesh>
      <pointLight position={[0, 0.55, 0]} intensity={5.5} distance={4.5} color="#2da1ff" />
    </group>
  )
}

function CityCluster({ position, radius = 2.2, seed = 1 }) {
  const towers = useMemo(() => {
    const out = []
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + seed
      const r = 0.45 + ((i * 17) % 10) / 10 * radius
      const h = 0.45 + ((i * 13) % 11) / 11 * 1.8
      out.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h,
        w: 0.12 + ((i * 7) % 5) * 0.035,
      })
    }
    return out
  }, [radius, seed])

  return (
    <group position={position}>
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, t.z]} scale={[t.w, t.h, t.w]}>
          <boxGeometry />
          <meshStandardMaterial color="#0b294c" emissive="#0c6dc2" emissiveIntensity={0.55} roughness={0.48} />
        </mesh>
      ))}
      <Node position={[0, 0.04, 0]} scale={0.82} />
    </group>
  )
}

function Landmarks() {
  return (
    <group>
      <CityCluster position={[-2.2, 0.05, -4]} radius={1.8} seed={1.2} />
      <CityCluster position={[4.2, 0.05, -15]} radius={2.1} seed={2.4} />
      <CityCluster position={[-4.8, 0.05, -27]} radius={2.0} seed={3.1} />
      <CityCluster position={[3.2, 0.05, -42]} radius={2.3} seed={4.2} />
      <CityCluster position={[0.4, 0.05, -55]} radius={2.2} seed={5.3} />

      <Node position={[-2.2, 0.06, -4]} />
      <Node position={[4.2, 0.06, -15]} />
      <Node position={[-4.8, 0.06, -27]} />
      <Node position={[3.2, 0.06, -42]} />
      <Node position={[0.4, 0.06, -55]} />
    </group>
  )
}

export default function MystechScene() {
  const { camera, scene, pointer } = useThree()
  const scroll = useRef(0)
  const smooth = useRef(0)
  const route = useMemo(() => new THREE.CatmullRomCurve3(PATH, false, 'catmullrom', 0.15), [])

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
    smooth.current = THREE.MathUtils.lerp(smooth.current, scroll.current, 0.055)
    const p = smooth.current
    const focus = route.getPointAt(p)
    const tangent = route.getTangentAt(Math.min(0.998, p + 0.002)).normalize()
    const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize()

    const desired = focus.clone()
      .add(tangent.clone().multiplyScalar(-8.6))
      .add(new THREE.Vector3(0, 7.3, 0))
      .add(right.multiplyScalar(5.8 + pointer.x * 0.9))

    const target = focus.clone()
      .add(tangent.clone().multiplyScalar(3.8))
      .add(new THREE.Vector3(0, 0.8 + pointer.y * 0.3, 0))

    camera.position.lerp(desired, 0.065)
    camera.lookAt(target)
    scene.background = new THREE.Color('#031027')
  })

  return (
    <>
      <fog attach="fog" args={['#031027', 20, 48]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.72} color="#58a8ff" groundColor="#020716" />
      <directionalLight position={[10, 16, 8]} intensity={1.7} color="#d4e8ff" />
      <pointLight position={[0, 9, -20]} intensity={22} distance={26} color="#0c65d8" />

      <Terrain />
      <RoadNetwork />
      <Landmarks />
      <Sparkles count={180} scale={[42, 18, 88]} size={1.1} speed={0.12} opacity={0.28} color="#70baff" />
    </>
  )
}
