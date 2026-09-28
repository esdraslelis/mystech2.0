import { useMemo, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const introPoints = [
  { t: 0.00, pos: [0.1, 0.1, 15.4], target: [0, 0, 0.1], fov: 44, roll: 0 },
  { t: 0.08, pos: [0.05, 0.05, 14.2], target: [0, 0, 0], fov: 44, roll: 0 },
  { t: 0.17, pos: [0.02, 0.02, 8.1], target: [0, 0, -0.3], fov: 42, roll: 0 },
  { t: 0.255, pos: [0, 0, 1.25], target: [0, 0, -4], fov: 46, roll: 0 },
  { t: 0.34, pos: [0, 0, -14], target: [0, 0, -29], fov: 50, roll: 0.02 },
  { t: 0.40, pos: [0, 0.25, -24], target: [0, 0, -34], fov: 45, roll: 0.05 },
]

const exitCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(8.7, 2.4, -38.5),
    new THREE.Vector3(11.5, 1.3, -43),
    new THREE.Vector3(14.8, 0.2, -47),
    new THREE.Vector3(18.4, 0, -50),
    new THREE.Vector3(24.5, 0, -51),
    new THREE.Vector3(33, 0, -51),
    new THREE.Vector3(42, 0, -51),
  ],
  false,
  'catmullrom',
  0.5,
)

const exitTargetCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, -34),
    new THREE.Vector3(12, 0, -47),
    new THREE.Vector3(18, 0, -51),
    new THREE.Vector3(26, 0, -51),
    new THREE.Vector3(35, 0, -51),
    new THREE.Vector3(47, 0, -51),
  ],
  false,
  'catmullrom',
  0.5,
)

function clamp01(v) {
  return THREE.MathUtils.clamp(v, 0, 1)
}

function smooth(v) {
  const x = clamp01(v)
  return x * x * (3 - 2 * x)
}

function smoother(v) {
  const x = clamp01(v)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

function sampleIntro(progress) {
  let a = introPoints[0]
  let b = introPoints[introPoints.length - 1]

  for (let i = 0; i < introPoints.length - 1; i += 1) {
    if (progress >= introPoints[i].t && progress <= introPoints[i + 1].t) {
      a = introPoints[i]
      b = introPoints[i + 1]
      break
    }
  }

  const local = smoother((progress - a.t) / Math.max(0.0001, b.t - a.t))
  return {
    position: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.pos), new THREE.Vector3(...b.pos), local),
    target: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.target), new THREE.Vector3(...b.target), local),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, local),
    roll: THREE.MathUtils.lerp(a.roll, b.roll, local),
  }
}

function sampleCamera(progress) {
  if (progress <= 0.4) return sampleIntro(progress)

  if (progress <= 0.655) {
    const p = smoother((progress - 0.4) / 0.255)
    const angle = THREE.MathUtils.degToRad(110) * p
    const radius = 10
    const center = new THREE.Vector3(0, 0, -34)
    const position = new THREE.Vector3(
      Math.sin(angle) * radius,
      THREE.MathUtils.lerp(0.25, 2.4, Math.sin(p * Math.PI)),
      center.z + Math.cos(angle) * radius,
    )

    return {
      position,
      target: center,
      fov: THREE.MathUtils.lerp(45, 39, smooth(Math.sin(p * Math.PI))),
      roll: THREE.MathUtils.lerp(0.05, Math.PI / 2, smooth((p - 0.18) / 0.82)),
    }
  }

  const p = smoother((progress - 0.655) / 0.345)
  const position = exitCurve.getPointAt(p)
  const target = exitTargetCurve.getPointAt(Math.min(p, 0.999))

  return {
    position,
    target,
    fov: THREE.MathUtils.lerp(42, 48, smooth((p - 0.35) / 0.45)) - THREE.MathUtils.lerp(0, 8, smooth((p - 0.82) / 0.18)),
    roll: THREE.MathUtils.lerp(Math.PI / 2, 0, smooth(p / 0.56)),
  }
}

export default function CameraRig({ progressRef, pointerRef, reducedMotion = false }) {
  const positionGroup = useRef()
  const rotationGroup = useRef()
  const microGroup = useRef()
  const cameraRef = useRef()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    if (!positionGroup.current || !rotationGroup.current || !microGroup.current || !cameraRef.current) return

    const sampled = sampleCamera(progressRef.current)
    desired.copy(sampled.position)
    target.copy(sampled.target)

    const alpha = 1 - Math.exp(-delta * 9)
    positionGroup.current.position.lerp(desired, alpha)

    dummy.position.copy(positionGroup.current.position)
    dummy.up.set(0, 1, 0)
    dummy.lookAt(target)
    dummy.rotateZ(reducedMotion ? sampled.roll * 0.15 : sampled.roll)
    rotationGroup.current.quaternion.slerp(dummy.quaternion, 1 - Math.exp(-delta * 11))

    const pointer = pointerRef.current
    const pointerStrength = reducedMotion ? 0.08 : 0.22
    microGroup.current.position.x = THREE.MathUtils.lerp(microGroup.current.position.x, pointer.x * pointerStrength, 0.08)
    microGroup.current.position.y = THREE.MathUtils.lerp(microGroup.current.position.y, pointer.y * pointerStrength * 0.6, 0.08)
    microGroup.current.rotation.y = THREE.MathUtils.lerp(microGroup.current.rotation.y, -pointer.x * 0.009, 0.08)
    microGroup.current.rotation.x = THREE.MathUtils.lerp(microGroup.current.rotation.x, pointer.y * 0.005, 0.08)

    cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, reducedMotion ? 43 : sampled.fov, 1 - Math.exp(-delta * 8))
    cameraRef.current.updateProjectionMatrix()
  })

  return (
    <group ref={positionGroup}>
      <group ref={rotationGroup}>
        <group ref={microGroup}>
          <PerspectiveCamera ref={cameraRef} makeDefault near={0.05} far={220} fov={44} />
        </group>
      </group>
    </group>
  )
}
