import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CameraRig from './CameraRig'
import {
  MonitorWorld,
  ScreenDepthTunnel,
  GlobeWorld,
  LateralGravity,
  HorizontalPrototype,
} from './Scenes'

function NarrativeLights({ progressRef, pointerRef }) {
  const key = useRef()
  const rim = useRef()
  const { camera } = useThree()
  const keyOffset = useMemo(() => new THREE.Vector3(), [])
  const rimOffset = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!key.current || !rim.current) return

    const p = progressRef.current
    const pointer = pointerRef.current

    keyOffset
      .set(pointer.x * 2.2, 2.2 + pointer.y * 1.15, 5)
      .applyQuaternion(camera.quaternion)
    key.current.position.copy(camera.position).add(keyOffset)
    key.current.intensity = THREE.MathUtils.lerp(2.2, 10, Math.min(1, p / 0.23))

    rimOffset
      .set(-4.5, 1.2, 1.4)
      .applyQuaternion(camera.quaternion)
    rim.current.position.copy(camera.position).add(rimOffset)
    rim.current.intensity =
      p < 0.16
        ? THREE.MathUtils.lerp(1, 7, p / 0.16)
        : p < 0.68
          ? 7
          : THREE.MathUtils.lerp(7, 3, (p - 0.68) / 0.32)
  })

  return (
    <>
      <pointLight ref={key} color="#ecf2ff" intensity={2.2} distance={26} decay={2} />
      <pointLight ref={rim} color="#496eff" intensity={1} distance={34} decay={2} />
    </>
  )
}

export default function World({ progressRef, pointerRef, reducedMotion }) {
  return (
    <>
      <color attach="background" args={['#010205']} />
      <fog attach="fog" args={['#010205', 14, 72]} />

      <ambientLight intensity={0.055} />
      <hemisphereLight args={['#6f86bd', '#010205', 0.11]} />
      <NarrativeLights progressRef={progressRef} pointerRef={pointerRef} />

      <CameraRig progressRef={progressRef} pointerRef={pointerRef} reducedMotion={reducedMotion} />

      <MonitorWorld progressRef={progressRef} pointerRef={pointerRef} />
      <ScreenDepthTunnel progressRef={progressRef} />
      <GlobeWorld progressRef={progressRef} pointerRef={pointerRef} />
      <LateralGravity progressRef={progressRef} />
      <HorizontalPrototype />
    </>
  )
}
