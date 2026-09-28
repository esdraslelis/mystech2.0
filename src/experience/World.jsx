import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CameraRig from './CameraRig'
import {
  LogoGate,
  Megastructure,
  PhysicalWords,
  SitesUniverse,
  LayerExplosion,
  FiberTransition,
  TelecomWorld,
  ScalePortal,
  AutomationCity,
  ProjectWorlds,
  TimeFreezeField,
  ManifestoWorld,
  FinalMark,
} from './Scenes'

function MovingKeyLight({ pointerRef }) {
  const light = useRef()
  const { camera } = useThree()
  const offset = new THREE.Vector3()

  useFrame(() => {
    if (!light.current) return
    const pointer = pointerRef.current
    offset.set(pointer.x * 3.2, pointer.y * 2.1, 5.5).applyQuaternion(camera.quaternion)
    light.current.position.copy(camera.position).add(offset)
  })

  return <pointLight ref={light} color="#8aa6ff" intensity={18} distance={32} decay={2} />
}

export default function World({ progressRef, pointerRef }) {
  return (
    <>
      <color attach="background" args={['#020306']} />
      <fog attach="fog" args={['#020306', 10, 72]} />

      <ambientLight intensity={0.18} />
      <hemisphereLight args={['#7f96d9', '#020306', 0.3]} />
      <MovingKeyLight pointerRef={pointerRef} />
      <CameraRig progressRef={progressRef} pointerRef={pointerRef} />

      <LogoGate progressRef={progressRef} />
      <Megastructure progressRef={progressRef} pointerRef={pointerRef} />
      <PhysicalWords />
      <SitesUniverse progressRef={progressRef} />
      <LayerExplosion progressRef={progressRef} />
      <FiberTransition progressRef={progressRef} />
      <TelecomWorld progressRef={progressRef} pointerRef={pointerRef} />
      <ScalePortal />
      <AutomationCity progressRef={progressRef} pointerRef={pointerRef} />
      <ProjectWorlds />
      <TimeFreezeField progressRef={progressRef} />
      <ManifestoWorld />
      <FinalMark progressRef={progressRef} />
    </>
  )
}
