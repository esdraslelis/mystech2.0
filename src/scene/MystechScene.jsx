import { Float, Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function CoreObject({ progress }) {
  const group = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const shardRefs = useRef([])

  const shards = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * Math.PI * 2,
    radius: 2.2 + (i % 4) * 0.24,
    y: ((i % 6) - 2.5) * 0.34,
    scale: 0.18 + (i % 3) * 0.05,
  })), [])

  useFrame((state, delta) => {
    const p = progress.current
    const t = state.clock.elapsedTime
    if (!group.current) return

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p * Math.PI * 2.4 + t * 0.08, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(p * Math.PI * 2) * 0.28, 0.04)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, Math.sin(p * Math.PI * 3) * 1.25, 0.035)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 1.4 - p * 4.8, 0.035)

    if (ringA.current) ringA.current.rotation.z += delta * 0.28
    if (ringB.current) ringB.current.rotation.x -= delta * 0.18

    shardRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const s = shards[i]
      const burst = 1 + Math.sin(p * Math.PI) * 1.8
      mesh.position.x = Math.cos(s.angle + t * 0.08) * s.radius * burst
      mesh.position.z = Math.sin(s.angle + t * 0.08) * s.radius * burst
      mesh.position.y = s.y + Math.sin(t * 0.6 + i) * 0.18
      mesh.rotation.x += delta * (0.1 + i * 0.003)
      mesh.rotation.y += delta * 0.15
    })
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.34, 5]} />
        <meshPhysicalMaterial color="#f4f4f0" roughness={0.15} metalness={0.2} transmission={0.18} thickness={0.9} clearcoat={1} />
      </mesh>
      <mesh scale={1.02}>
        <icosahedronGeometry args={[1.34, 2]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.17} />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.03, 0.025, 16, 180]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[0.3, 0, Math.PI / 2]}>
        <torusGeometry args={[2.5, 0.012, 12, 180]} />
        <meshBasicMaterial color="#9f9f9f" transparent opacity={0.42} />
      </mesh>

      {shards.map((s, i) => (
        <mesh key={i} ref={(el) => (shardRefs.current[i] = el)} scale={[s.scale, s.scale * 2.6, s.scale * 0.35]}>
          <boxGeometry />
          <meshPhysicalMaterial color={i % 2 ? '#d7d7d2' : '#ffffff'} roughness={0.28} metalness={0.65} />
        </mesh>
      ))}
    </group>
  )
}

export default function MystechScene() {
  const progress = useRef(0)
  const { camera } = useThree()

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((state) => {
    const p = progress.current
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - p * 2.4, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.sin(p * Math.PI * 2) * 0.8, 0.035)
    camera.lookAt(0, 0, 0)
    state.scene.rotation.z = Math.sin(p * Math.PI * 3) * 0.05
  })

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 5, 7]} intensity={4.2} />
      <pointLight position={[-4, -2, 4]} intensity={18} distance={12} />
      <Float speed={1.25} rotationIntensity={0.24} floatIntensity={0.45}>
        <CoreObject progress={progress} />
      </Float>
      <Sparkles count={80} scale={[11, 7, 7]} size={1.15} speed={0.18} opacity={0.26} />
    </>
  )
}
