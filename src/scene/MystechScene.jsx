import { Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const PATH_POINTS = [
  new THREE.Vector3(0, 0.65, 10),
  new THREE.Vector3(0.5, 0.85, -6),
  new THREE.Vector3(-1.2, 1.1, -23),
  new THREE.Vector3(1.4, 0.9, -41),
  new THREE.Vector3(0, 1.2, -59),
]

const ZONES = [
  { p: [0, 0, 5], kind: 'origin' },
  { p: [0.5, 0, -10], kind: 'web' },
  { p: [-1.2, 0, -27], kind: 'ai' },
  { p: [1.4, 0, -45], kind: 'projects' },
  { p: [0, 0, -61], kind: 'contact' },
]

function createTerrainGeometry() {
  const geometry = new THREE.PlaneGeometry(54, 92, 70, 120)
  const pos = geometry.attributes.position

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const centerFade = THREE.MathUtils.clamp(Math.abs(x) / 12, 0, 1)
    const wave =
      Math.sin(x * 0.34) * 0.7 +
      Math.cos(y * 0.18) * 0.55 +
      Math.sin((x + y) * 0.12) * 0.65
    const ridge = Math.pow(centerFade, 1.6) * 2.4
    pos.setZ(i, wave * 0.55 + ridge)
  }

  geometry.computeVertexNormals()
  return geometry
}

function Terrain() {
  const geometry = useMemo(() => createTerrainGeometry(), [])
  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -26]} receiveShadow>
        <meshStandardMaterial color="#08111f" roughness={0.95} metalness={0.02} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -26]}>
        <planeGeometry args={[120, 160]} />
        <meshStandardMaterial color="#020711" roughness={1} />
      </mesh>
    </group>
  )
}

function Route({ curve }) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 220, 0.055, 12, false),
    [curve]
  )

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#2f8cff" />
      </mesh>
      <mesh geometry={geometry} scale={1.9}>
        <meshBasicMaterial color="#0b3769" transparent opacity={0.26} />
      </mesh>
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.4, 8]} />
        <meshStandardMaterial color="#18263a" />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <coneGeometry args={[0.62, 1.35, 8]} />
        <meshStandardMaterial color="#0d3650" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Crystal({ position, scale = 1, color = '#2f8cff' }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.1, 0.4, 0.2]}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.7}
        roughness={0.18}
        metalness={0.2}
      />
    </mesh>
  )
}

function WebGate() {
  return (
    <group position={[0.5, 0.5, -10]}>
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[2.1, 0.14, 18, 80]} />
        <meshStandardMaterial color="#10294b" emissive="#2f8cff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <ringGeometry args={[1.48, 1.54, 64]} />
        <meshBasicMaterial color="#69b1ff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <Crystal position={[-2.2, 0.6, 1]} scale={1.1} />
      <Crystal position={[2.3, 0.55, -0.7]} scale={0.8} color="#6a5cff" />
    </group>
  )
}

function AICore() {
  return (
    <group position={[-1.2, 0.7, -27]}>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshPhysicalMaterial color="#0b1b33" metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.55, 0]} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#2f8cff" wireframe transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.62, 64]} />
        <meshBasicMaterial color="#2f8cff" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function ProjectShrine() {
  return (
    <group position={[1.4, 0.2, -45]}>
      {[-2.2, 0, 2.2].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.25 + index * 0.2, 0]}>
            <boxGeometry args={[1.45, 2.5 + index * 0.4, 1.45]} />
            <meshStandardMaterial color="#101b2d" roughness={0.5} metalness={0.18} />
          </mesh>
          <mesh position={[0, 2.55 + index * 0.38, 0.73]}>
            <planeGeometry args={[0.9, 0.08]} />
            <meshBasicMaterial color="#2f8cff" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ContactBeacon() {
  return (
    <group position={[0, 0.2, -61]}>
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.55, 1.45, 4.6, 12]} />
        <meshStandardMaterial color="#10213a" roughness={0.36} metalness={0.28} />
      </mesh>
      <mesh position={[0, 4.9, 0]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshPhysicalMaterial color="#6cb3ff" emissive="#2f8cff" emissiveIntensity={2.4} />
      </mesh>
      <pointLight position={[0, 5, 0]} intensity={32} distance={12} color="#2f8cff" />
    </group>
  )
}

function Scenery() {
  const trees = useMemo(() => {
    const result = []
    for (let i = 0; i < 52; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const z = 7 - i * 1.35
      const x = side * (4.8 + ((i * 1.73) % 5))
      result.push({ p: [x, 0.2 + (i % 3) * 0.06, z], s: 0.72 + (i % 5) * 0.08 })
    }
    return result
  }, [])

  return (
    <>
      {trees.map((tree, i) => <Tree key={i} position={tree.p} scale={tree.s} />)}
      <WebGate />
      <AICore />
      <ProjectShrine />
      <ContactBeacon />
    </>
  )
}

function Player({ curve, progress }) {
  const ref = useRef()
  const ring = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    const p = progress.current
    const pos = curve.getPointAt(p)
    const tangent = curve.getTangentAt(Math.min(0.999, p + 0.001))

    ref.current.position.copy(pos)
    ref.current.position.y += 0.15 + Math.sin(state.clock.elapsedTime * 5) * 0.05
    ref.current.rotation.y = Math.atan2(tangent.x, tangent.z)

    if (ring.current) ring.current.rotation.z += delta * 1.4
  })

  return (
    <group ref={ref}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color="#dfefff" emissive="#2f8cff" emissiveIntensity={2.2} />
      </mesh>
      <mesh ref={ring} position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.025, 10, 48]} />
        <meshBasicMaterial color="#79bbff" transparent opacity={0.85} />
      </mesh>
      <pointLight position={[0, 0.7, 0]} intensity={7} distance={4} color="#2f8cff" />
    </group>
  )
}

export default function MystechScene() {
  const { camera, scene, pointer } = useThree()
  const progress = useRef(0)
  const smooth = useRef(0)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.15), [])

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
    smooth.current = THREE.MathUtils.lerp(smooth.current, progress.current, 0.075)
    const p = smooth.current

    const pos = curve.getPointAt(p)
    const tangent = curve.getTangentAt(Math.min(0.999, p + 0.002)).normalize()
    const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize()

    const target = pos.clone().add(tangent.clone().multiplyScalar(4.8)).add(new THREE.Vector3(0, 1.05, 0))
    const desired = pos
      .clone()
      .add(tangent.clone().multiplyScalar(-7.2))
      .add(new THREE.Vector3(0, 4.1, 0))
      .add(right.multiplyScalar(pointer.x * 1.2))

    desired.y += pointer.y * 0.45

    camera.position.lerp(desired, 0.085)
    camera.lookAt(target)
    scene.background = new THREE.Color('#02050a')
  })

  return (
    <>
      <fog attach="fog" args={['#02050a', 13, 38]} />
      <ambientLight intensity={0.48} />
      <hemisphereLight intensity={0.55} color="#6faeff" groundColor="#02050a" />
      <directionalLight position={[6, 12, 8]} intensity={1.55} color="#cbe3ff" />

      <Terrain />
      <Route curve={curve} />
      <Scenery />
      <Player curve={curve} progress={smooth} />

      <Sparkles count={110} scale={[34, 16, 78]} size={1.25} speed={0.16} opacity={0.38} color="#6fb4ff" />
    </>
  )
}
