import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const KEYFRAMES = [
  { t: 0.00, pos: [0, 0, 14], target: [0, 0, 0], roll: 0, fov: 42 },
  { t: 0.055, pos: [0, 0, 5.5], target: [0, 0, -8], roll: 0, fov: 42 },
  { t: 0.105, pos: [0, 0, -5], target: [0, 0, -20], roll: 0.02, fov: 43 },
  { t: 0.165, pos: [4.5, 2.5, -24], target: [0, 0, -39], roll: 0.34, fov: 44 },
  { t: 0.225, pos: [1.2, 5.3, -44], target: [0, 0, -59], roll: Math.PI / 2, fov: 45 },
  { t: 0.285, pos: [-3.2, 1.1, -62], target: [0, 0, -78], roll: Math.PI / 2, fov: 44 },
  { t: 0.345, pos: [-5.5, 0.5, -82], target: [0, 0, -98], roll: 0.9, fov: 42 },
  { t: 0.425, pos: [0, 0, -105], target: [0, 0, -122], roll: 0.35, fov: 42 },
  { t: 0.505, pos: [1.5, 0.4, -132], target: [0, 0, -153], roll: 0.08, fov: 43 },
  { t: 0.575, pos: [0, 0, -157], target: [0, 0, -179], roll: 0, fov: 46 },
  { t: 0.645, pos: [0, -0.8, -183], target: [0, 0, -202], roll: -0.18, fov: 47 },
  { t: 0.715, pos: [8.5, 3.4, -211], target: [8, 0, -226], roll: 0.08, fov: 43 },
  { t: 0.775, pos: [-7.2, 2.2, -232], target: [-7, 0.5, -245], roll: -0.1, fov: 42 },
  { t: 0.835, pos: [7.4, 1.4, -250], target: [7, 0, -263], roll: 0.08, fov: 42 },
  { t: 0.885, pos: [-5.5, 0.4, -269], target: [-5, 0, -281], roll: -0.06, fov: 43 },
  { t: 0.925, pos: [0, 0, -286], target: [0, 0, -301], roll: 0, fov: 40 },
  { t: 0.965, pos: [0, 0, -308], target: [0, 0, -329], roll: 0, fov: 39 },
  { t: 1.00, pos: [0, 0, -302], target: [0, 0, -329], roll: 0, fov: 40 },
]

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const aPos = new THREE.Vector3()
const bPos = new THREE.Vector3()
const aTarget = new THREE.Vector3()
const bTarget = new THREE.Vector3()

function smoothstep01(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function sample(progress) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  let a = KEYFRAMES[0]
  let b = KEYFRAMES[KEYFRAMES.length - 1]

  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    if (p >= KEYFRAMES[i].t && p <= KEYFRAMES[i + 1].t) {
      a = KEYFRAMES[i]
      b = KEYFRAMES[i + 1]
      break
    }
  }

  const span = Math.max(0.0001, b.t - a.t)
  const local = smoothstep01((p - a.t) / span)

  aPos.set(...a.pos)
  bPos.set(...b.pos)
  aTarget.set(...a.target)
  bTarget.set(...b.target)

  tmpPos.lerpVectors(aPos, bPos, local)
  tmpTarget.lerpVectors(aTarget, bTarget, local)

  return {
    pos: tmpPos,
    target: tmpTarget,
    roll: THREE.MathUtils.lerp(a.roll, b.roll, local),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, local),
  }
}

export default function CameraRig({ progressRef, pointerRef }) {
  const { camera } = useThree()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const progress = progressRef.current
    const pointer = pointerRef.current
    const sampled = sample(progress)

    desiredPosition.copy(sampled.pos)
    desiredTarget.copy(sampled.target)

    const pointerWeight = progress < 0.08 || progress > 0.93 ? 0.18 : 0.55
    desiredPosition.x += pointer.x * pointerWeight
    desiredPosition.y += pointer.y * pointerWeight * 0.65
    desiredTarget.x += pointer.x * pointerWeight * 0.18
    desiredTarget.y += pointer.y * pointerWeight * 0.12

    const positionAlpha = 1 - Math.exp(-delta * 6.2)
    const rotationAlpha = 1 - Math.exp(-delta * 7.4)

    camera.position.lerp(desiredPosition, positionAlpha)

    dummy.position.copy(camera.position)
    dummy.up.set(0, 1, 0)
    dummy.lookAt(desiredTarget)
    dummy.rotateZ(sampled.roll)
    camera.quaternion.slerp(dummy.quaternion, rotationAlpha)

    camera.fov = THREE.MathUtils.lerp(camera.fov, sampled.fov, 1 - Math.exp(-delta * 5))
    camera.updateProjectionMatrix()
  })

  return null
}
