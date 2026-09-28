import { useMemo, useRef } from 'react'
import { Edges, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WHITE = '#edf2ff'
const BLUE = '#5578ff'
const BLUE_SOFT = '#9cb2ff'
const BLACK = '#030407'

function range(progress, start, end) {
  return THREE.MathUtils.clamp((progress - start) / Math.max(0.0001, end - start), 0, 1)
}

function smooth(v) {
  const x = THREE.MathUtils.clamp(v, 0, 1)
  return x * x * (3 - 2 * x)
}

function smoother(v) {
  const x = THREE.MathUtils.clamp(v, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

function makeRockGeometry(radius, detail, seed) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail)
  const position = geometry.attributes.position
  const vector = new THREE.Vector3()

  for (let i = 0; i < position.count; i += 1) {
    vector.fromBufferAttribute(position, i)
    const n =
      Math.sin(vector.x * 1.93 + seed) * 0.45 +
      Math.sin(vector.y * 2.37 + seed * 1.7) * 0.3 +
      Math.sin(vector.z * 2.73 + seed * 2.1) * 0.25
    vector.normalize().multiplyScalar(radius * (1 + n * 0.018))
    position.setXYZ(i, vector.x, vector.y, vector.z)
  }

  geometry.computeVertexNormals()
  return geometry
}

function Planet({ position, radius, seed, progressRef, rotationFactor = 1, roughness = 0.84, rim = '#335ad7', drift = [0, 0, 0] }) {
  const group = useRef()
  const mesh = useRef()
  const geometry = useMemo(() => makeRockGeometry(radius, 5, seed), [radius, seed])

  useFrame(() => {
    if (!mesh.current || !group.current) return
    const p = progressRef.current
    const authoredRotation =
      p < 0.15
        ? THREE.MathUtils.lerp(0, THREE.MathUtils.degToRad(20), smooth(p / 0.15))
        : p < 0.3
          ? THREE.MathUtils.lerp(THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(70), smooth((p - 0.15) / 0.15))
          : THREE.MathUtils.lerp(THREE.MathUtils.degToRad(70), THREE.MathUtils.degToRad(86), smooth((p - 0.3) / 0.7))

    mesh.current.rotation.y = authoredRotation * rotationFactor
    mesh.current.rotation.x = authoredRotation * 0.15 * Math.sign(rotationFactor)

    const driftP = smoother(range(p, 0.07, 0.24))
    group.current.position.x = position[0] + drift[0] * driftP
    group.current.position.y = position[1] + drift[1] * driftP
    group.current.position.z = position[2] + drift[2] * driftP
  })

  return (
    <group ref={group} position={position}>
      <mesh ref={mesh} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#050608" roughness={roughness} metalness={0.18} />
      </mesh>
      <pointLight position={[radius * 0.92, radius * 0.45, radius * 0.72]} color={rim} intensity={radius * 2.4} distance={radius * 4} decay={2} />
    </group>
  )
}

function ScreenInterface({ progressRef }) {
  const layerRefs = useRef([])
  const title = useRef()
  const subtitle = useRef()

  const layers = [
    { xy: [-2.55, 1.34], size: [2.2, 0.16], color: '#6687ff', z: -1.4 },
    { xy: [-1.85, 0.68], size: [4.05, 0.55], color: '#e9efff', z: -2.7 },
    { xy: [-1.2, -0.2], size: [5.35, 0.14], color: '#324676', z: -4.2 },
    { xy: [1.7, -1.08], size: [2.55, 1.25], color: '#17213a', z: -5.9 },
    { xy: [-2.0, -1.12], size: [2.65, 1.25], color: '#101827', z: -7.6 },
  ]

  useFrame(() => {
    const p = smoother(range(progressRef.current, 0.19, 0.35))

    layerRefs.current.forEach((mesh, index) => {
      if (!mesh) return
      mesh.position.z = 0.415 + layers[index].z * p
      mesh.position.x = layers[index].xy[0] + (index % 2 ? -0.18 : 0.14) * p
      mesh.position.y = layers[index].xy[1] + (index - 2) * 0.06 * p
    })

    if (title.current) {
      title.current.position.z = 0.43 - 2.0 * p
      title.current.fillOpacity = 1 - smooth(range(p, 0.52, 0.9))
    }
    if (subtitle.current) {
      subtitle.current.position.z = 0.43 - 3.2 * p
      subtitle.current.fillOpacity = 1 - smooth(range(p, 0.45, 0.82))
    }
  })

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh
          key={index}
          ref={(node) => { layerRefs.current[index] = node }}
          position={[layer.xy[0], layer.xy[1], 0.415]}
        >
          <planeGeometry args={layer.size} />
          <meshBasicMaterial color={layer.color} transparent opacity={index === 1 ? 0.95 : 0.75} />
        </mesh>
      ))}

      <Text
        ref={title}
        position={[-1.0, 0.78, 0.43]}
        fontSize={0.66}
        maxWidth={5}
        anchorX="left"
        color={WHITE}
        letterSpacing={-0.04}
        fillOpacity={1}
      >
        EXPERIÊNCIAS DIGITAIS
      </Text>
      <Text
        ref={subtitle}
        position={[-1.0, 0.12, 0.43]}
        fontSize={0.26}
        maxWidth={4.2}
        anchorX="left"
        color={BLUE_SOFT}
        letterSpacing={0.04}
        fillOpacity={1}
      >
        MYS TECH / TECHNOLOGY WITHOUT LIMITS
      </Text>
    </group>
  )
}

export function MonitorWorld({ progressRef, pointerRef }) {
  const glass = useRef()
  const world = useRef()

  useFrame(() => {
    const p = progressRef.current
    const portal = smoother(range(p, 0.18, 0.315))
    const pointer = pointerRef.current

    if (glass.current) {
      glass.current.material.opacity = THREE.MathUtils.lerp(0.2, 0.015, portal)
      glass.current.material.roughness = THREE.MathUtils.lerp(0.1, 0.28, portal)
    }

    if (world.current) {
      world.current.rotation.y = pointer.x * 0.005
      world.current.rotation.x = -pointer.y * 0.003
    }
  })

  return (
    <group ref={world}>
      <group position={[0, 0, 0]}>
        <RoundedBox args={[8.9, 5.65, 0.7]} radius={0.18} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial color="#0a0c11" roughness={0.22} metalness={0.78} />
        </RoundedBox>

        <RoundedBox position={[0, 0.04, 0.385]} args={[8.25, 5.0, 0.09]} radius={0.11} smoothness={4}>
          <meshStandardMaterial color="#05070b" emissive="#091126" emissiveIntensity={0.65} roughness={0.18} metalness={0.3} />
        </RoundedBox>

        <RoundedBox ref={glass} position={[0, 0.04, 0.46]} args={[8.15, 4.9, 0.025]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#d8e3ff"
            transparent
            opacity={0.2}
            roughness={0.1}
            metalness={0}
            transmission={0.1}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </RoundedBox>

        <ScreenInterface progressRef={progressRef} />

        <mesh position={[0, -3.18, -0.05]} castShadow>
          <boxGeometry args={[0.52, 1.65, 0.48]} />
          <meshStandardMaterial color="#11141b" roughness={0.25} metalness={0.75} />
        </mesh>
        <RoundedBox position={[0, -4.05, 0]} args={[3.55, 0.18, 1.72]} radius={0.08} smoothness={3} castShadow>
          <meshStandardMaterial color="#0f1117" roughness={0.3} metalness={0.72} />
        </RoundedBox>

        <pointLight position={[0, 0, 3.2]} color="#527cff" intensity={9} distance={13} decay={2} />
      </group>

      <Planet position={[-9.8, -1.0, 5.0]} radius={6.4} seed={1.2} progressRef={progressRef} rotationFactor={0.4} rim="#223d92" drift={[-1.7, 0.2, 0]} />
      <Planet position={[7.6, 4.1, -6]} radius={4.6} seed={2.7} progressRef={progressRef} rotationFactor={0.7} rim="#3c5ad0" drift={[1.3, -0.55, 0.25]} />
      <Planet position={[-10.5, -4.8, -16]} radius={7.5} seed={4.4} progressRef={progressRef} rotationFactor={0.22} rim="#172a6a" roughness={0.93} drift={[0.2, 0.1, -0.15]} />
    </group>
  )
}

function WireGate({ z, width, height, opacity = 0.2 }) {
  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[width, 0.035, 0.04]} />
        <meshBasicMaterial color={BLUE} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -height, 0]}>
        <boxGeometry args={[width, 0.035, 0.04]} />
        <meshBasicMaterial color={BLUE} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-width / 2, -height / 2, 0]}>
        <boxGeometry args={[0.035, height, 0.04]} />
        <meshBasicMaterial color={BLUE} transparent opacity={opacity} />
      </mesh>
      <mesh position={[width / 2, -height / 2, 0]}>
        <boxGeometry args={[0.035, height, 0.04]} />
        <meshBasicMaterial color={BLUE} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

export function ScreenDepthTunnel({ progressRef }) {
  const group = useRef()
  const gates = useMemo(
    () => Array.from({ length: 10 }, (_, index) => ({
      z: -1.3 - index * 2.15,
      width: 7.45 - index * 0.24,
      height: 4.35 - index * 0.14,
    })),
    [],
  )

  useFrame(() => {
    if (!group.current) return
    const p = smoother(range(progressRef.current, 0.18, 0.35))
    group.current.scale.z = 0.03 + p * 0.97
  })

  return (
    <group ref={group} position={[0, 2.13, 0]}>
      {gates.map((gate, index) => (
        <WireGate key={index} z={gate.z} width={gate.width} height={gate.height} opacity={0.12 + index * 0.015} />
      ))}
    </group>
  )
}

function DigitalGlobe({ progressRef, pointerRef }) {
  const globe = useRef()
  const points = useMemo(() => {
    const items = []
    for (let lat = -70; lat <= 70; lat += 10) {
      for (let lon = -180; lon < 180; lon += 10) {
        const latR = THREE.MathUtils.degToRad(lat)
        const lonR = THREE.MathUtils.degToRad(lon)
        const noise =
          Math.sin(lonR * 2.7 + latR * 1.2) +
          Math.sin(lonR * 5.1 - latR * 3.2) * 0.55 +
          Math.cos(latR * 4.1) * 0.4

        if (noise > 0.35) {
          const r = 4.08
          items.push([
            r * Math.cos(latR) * Math.sin(lonR),
            r * Math.sin(latR),
            r * Math.cos(latR) * Math.cos(lonR),
          ])
        }
      }
    }
    return items
  }, [])

  useFrame(() => {
    if (!globe.current) return
    const progress = progressRef.current
    const reveal = smoother(range(progress, 0.16, 0.39))
    const orbit = smoother(range(progress, 0.36, 0.655))

    globe.current.position.x = THREE.MathUtils.lerp(5.4, 0, reveal)
    globe.current.position.y = THREE.MathUtils.lerp(-2.15, 0, reveal)
    globe.current.position.z = THREE.MathUtils.lerp(-3.2, -34, reveal)

    const scale = THREE.MathUtils.lerp(0.42, 1, reveal)
    globe.current.scale.setScalar(scale)

    globe.current.rotation.y = THREE.MathUtils.degToRad(8 + orbit * 54) + pointerRef.current.x * 0.012
    globe.current.rotation.x = -0.12 + pointerRef.current.y * 0.006
  })

  return (
    <group ref={globe} position={[5.4, -2.15, -3.2]} scale={0.42}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[4, 96, 96]} />
        <meshStandardMaterial color="#050914" roughness={0.66} metalness={0.26} />
      </mesh>
      <mesh scale={1.007}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#395ac2" wireframe transparent opacity={0.13} />
      </mesh>

      {points.map((point, index) => (
        <mesh key={index} position={point} scale={0.045 + (index % 4) * 0.008}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color={index % 7 === 0 ? '#bcd0ff' : '#5274de'} />
        </mesh>
      ))}

      <pointLight position={[5.2, 2.5, 4.5]} color="#6c8fff" intensity={18} distance={18} />
      <pointLight position={[-4, -1, 3]} color="#dbe7ff" intensity={5} distance={14} />
    </group>
  )
}

export function GlobeWorld({ progressRef, pointerRef }) {
  return (
    <group>
      <DigitalGlobe progressRef={progressRef} pointerRef={pointerRef} />

      <Text
        position={[-5.4, 3.9, -37.5]}
        rotation={[0, 0.24, 0]}
        fontSize={0.72}
        maxWidth={5}
        anchorX="left"
        color={WHITE}
        letterSpacing={-0.035}
      >
        CONSTRUÍMOS TECNOLOGIA
      </Text>
      <Text
        position={[-5.4, 3.0, -37.5]}
        rotation={[0, 0.24, 0]}
        fontSize={0.38}
        maxWidth={5}
        anchorX="left"
        color={BLUE_SOFT}
        letterSpacing={0.015}
      >
        PARA EMPRESAS QUE QUEREM IR ALÉM.
      </Text>

      <Planet position={[10.5, 1.5, -42]} radius={5.4} seed={8.2} progressRef={progressRef} rotationFactor={0.24} rim="#23346d" />
      <Planet position={[-13.5, 3.5, -50]} radius={8.4} seed={11.1} progressRef={progressRef} rotationFactor={-0.13} rim="#1d2c59" roughness={0.94} />
    </group>
  )
}

export function LateralGravity({ progressRef }) {
  const refs = useRef([])
  const pieces = useMemo(
    () => Array.from({ length: 13 }, (_, index) => ({
      start: [
        4.5 + (index % 5) * 1.35,
        -3.6 + ((index * 2.1) % 7),
        -42.5 - (index % 4) * 2.8,
      ],
      travel: 6.2 + (index % 4) * 1.15,
      rz: ((index % 3) - 1) * 0.7,
    })),
    [],
  )

  useFrame(() => {
    const p = smoother(range(progressRef.current, 0.55, 0.72))
    refs.current.forEach((mesh, index) => {
      if (!mesh) return
      const piece = pieces[index]
      mesh.position.x = piece.start[0] + piece.travel * p
      mesh.position.y = piece.start[1]
      mesh.position.z = piece.start[2]
      mesh.rotation.z = piece.rz * p
      mesh.rotation.y = (index % 2 ? 1 : -1) * 0.55 * p
    })
  })

  return (
    <group>
      {pieces.map((piece, index) => (
        <mesh key={index} ref={(node) => { refs.current[index] = node }} position={piece.start}>
          <boxGeometry args={[0.7 + (index % 3) * 0.35, 0.18 + (index % 2) * 0.16, 0.42]} />
          <meshStandardMaterial
            color={index % 4 === 0 ? '#5b7cff' : '#18202f'}
            emissive={index % 4 === 0 ? '#1c43c0' : '#000'}
            emissiveIntensity={index % 4 === 0 ? 1 : 0}
            metalness={0.68}
            roughness={0.24}
          />
        </mesh>
      ))}
    </group>
  )
}

function HorizontalWorld({ x, label, number, kind }) {
  return (
    <group position={[x, 0, -51]}>
      <group>
        <RoundedBox args={[8.7, 6.0, 0.7]} radius={0.24} smoothness={4}>
          <meshStandardMaterial
            color={kind === 'sites' ? '#0b1020' : kind === 'systems' ? '#11141a' : '#08101b'}
            roughness={0.28}
            metalness={0.62}
            emissive={kind === 'sites' ? '#102a83' : kind === 'systems' ? '#20222d' : '#0d3470'}
            emissiveIntensity={0.3}
          />
        </RoundedBox>
        <Edges color={kind === 'sites' ? '#526fff' : '#2c406e'} threshold={22} />

        <Text position={[0, 0.65, 0.45]} fontSize={0.78} color={WHITE} letterSpacing={-0.04}>
          {label}
        </Text>
        <Text position={[0, -0.35, 0.45]} fontSize={0.22} color={BLUE_SOFT} letterSpacing={0.12}>
          WORLD / {number}
        </Text>

        {Array.from({ length: 6 }).map((_, index) => (
          <mesh
            key={index}
            position={[
              -2.8 + (index % 3) * 2.8,
              -1.65 - Math.floor(index / 3) * 0.72,
              0.44 + index * 0.025,
            ]}
          >
            <boxGeometry args={[1.85, 0.12, 0.08]} />
            <meshBasicMaterial color={index === 1 || index === 4 ? BLUE : '#3a4356'} />
          </mesh>
        ))}

        <pointLight position={[0, 0, 4]} color={kind === 'telecom' ? '#73a4ff' : '#506eff'} intensity={14} distance={14} />
      </group>
    </group>
  )
}

export function HorizontalPrototype() {
  return (
    <group>
      <HorizontalWorld x={22} label="SITES" number="01" kind="sites" />
      <HorizontalWorld x={33} label="SISTEMAS" number="02" kind="systems" />
      <HorizontalWorld x={44} label="TELECOM" number="03" kind="telecom" />

      <mesh position={[33, -4.35, -51]}>
        <boxGeometry args={[35, 0.035, 0.04]} />
        <meshBasicMaterial color="#203569" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}
