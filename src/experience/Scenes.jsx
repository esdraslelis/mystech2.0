import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const BLUE = '#5477ff'
const BLUE_SOFT = '#8ea6ff'
const WHITE = '#eef2ff'
const DARK = '#05070b'

function range(progress, start, end) {
  return THREE.MathUtils.clamp((progress - start) / Math.max(0.0001, end - start), 0, 1)
}

function smooth(value) {
  const x = THREE.MathUtils.clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function Cable({ points, color = BLUE, radius = 0.035, opacity = 0.7 }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
    [points],
  )

  return (
    <mesh>
      <tubeGeometry args={[curve, 72, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        transparent
        opacity={opacity}
        roughness={0.35}
        metalness={0.25}
      />
    </mesh>
  )
}

function SectionText({ children, position, rotation = [0, 0, 0], size = 1, color = WHITE, maxWidth = 12, align = 'center' }) {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={size}
      maxWidth={maxWidth}
      textAlign={align}
      anchorX="center"
      anchorY="middle"
      letterSpacing={-0.045}
      color={color}
    >
      {children}
    </Text>
  )
}

export function LogoGate({ progressRef }) {
  const refs = useRef([])
  const arcOffsets = [
    [5.5, 4, 4, 0.7, 0.4],
    [-5.5, 3, 2, -0.6, -0.4],
    [-4.5, -4.5, 5, 0.8, 0.5],
    [4.5, -4, 3, -0.7, -0.3],
  ]
  const barBases = [
    [-1.45, 0.35, 0.72],
    [1.45, 0.35, -0.72],
    [-0.7, -1.55, -0.72],
    [0.7, -1.55, 0.72],
  ]
  const barOffsets = [
    [-5, 2.5, 5, 0.9, -0.5],
    [5, 2.5, 3, -0.8, 0.45],
    [-4, -3, 4, 0.6, 0.7],
    [4, -3, 5, -0.6, -0.7],
  ]

  useFrame(() => {
    const p = smooth(range(progressRef.current, 0.018, 0.102))
    refs.current.forEach((mesh, index) => {
      if (!mesh) return
      const isArc = index < 4
      const barIndex = index - 4
      const config = isArc ? arcOffsets[index] : barOffsets[barIndex]
      const baseX = isArc ? 0 : barBases[barIndex][0]
      const baseY = isArc ? 0 : barBases[barIndex][1]
      const baseRz = isArc ? index * Math.PI / 2 : barBases[barIndex][2]
      mesh.position.x = baseX + config[0] * p
      mesh.position.y = baseY + config[1] * p
      mesh.position.z = config[2] * p
      mesh.rotation.x = config[3] * p
      mesh.rotation.y = config[4] * p
      mesh.rotation.z = baseRz + (isArc ? 0.7 : -0.8) * p
      const scale = 1 - p * 0.18
      mesh.scale.setScalar(scale)
      if (mesh.material) {
        mesh.material.opacity = 1 - smooth(range(p, 0.72, 1))
      }
    })
  })

  return (
    <group>
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={'arc-' + index}
          ref={(node) => { refs.current[index] = node }}
          rotation={[0, 0, index * Math.PI / 2]}
        >
          <torusGeometry args={[3.35, 0.16, 12, 52, Math.PI / 2]} />
          <meshStandardMaterial color={WHITE} metalness={0.72} roughness={0.2} transparent />
        </mesh>
      ))}

      {[
        [-1.45, 0.35, 0.72],
        [1.45, 0.35, -0.72],
        [-0.7, -1.55, -0.72],
        [0.7, -1.55, 0.72],
      ].map(([x, y, rz], index) => (
        <mesh
          key={'bar-' + index}
          ref={(node) => { refs.current[index + 4] = node }}
          position={[x, y, 0]}
          rotation={[0, 0, rz]}
        >
          <boxGeometry args={[2.65, 0.28, 0.28]} />
          <meshStandardMaterial color={WHITE} metalness={0.7} roughness={0.22} transparent />
        </mesh>
      ))}

      <pointLight position={[0, 0, 3]} color={BLUE_SOFT} intensity={18} distance={24} decay={2} />
    </group>
  )
}

export function Megastructure({ progressRef, pointerRef }) {
  const floating = useRef([])

  const frames = useMemo(
    () => Array.from({ length: 9 }, (_, index) => ({
      z: -12 - index * 5.7,
      w: 12 + (index % 3) * 2.4,
      h: 7.4 + ((index + 1) % 3) * 1.3,
      twist: (index % 2 ? 1 : -1) * (0.06 + index * 0.01),
    })),
    [],
  )

  const debris = useMemo(
    () => Array.from({ length: 14 }, (_, index) => ({
      position: [
        ((index * 2.17) % 11) - 5.5,
        ((index * 3.31) % 7) - 3.5,
        -22 - index * 3.15,
      ],
      scale: [0.9 + (index % 3) * 0.45, 0.35 + (index % 2) * 0.3, 0.22],
      phase: index * 0.73,
    })),
    [],
  )

  useFrame((state) => {
    const p = smooth(range(progressRef.current, 0.12, 0.31))
    const time = state.clock.elapsedTime
    floating.current.forEach((mesh, index) => {
      if (!mesh) return
      const item = debris[index]
      const gravity = smooth(range(p, 0.38, 0.92))
      mesh.position.x = item.position[0] - gravity * (5.5 + (index % 5) * 0.85)
      mesh.position.y = item.position[1] + Math.sin(time * 0.45 + item.phase) * 0.14 * (1 - gravity)
      mesh.rotation.z = item.phase * 0.25 + gravity * 1.3
      mesh.rotation.x = gravity * 0.65
    })
  })

  return (
    <group>
      {frames.map((frame, index) => (
        <group key={frame.z} position={[0, 0, frame.z]} rotation={[0, 0, frame.twist]}>
          <mesh position={[-frame.w / 2, 0, 0]}>
            <boxGeometry args={[0.22, frame.h, 0.3]} />
            <meshStandardMaterial color="#1a2232" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[frame.w / 2, 0, 0]}>
            <boxGeometry args={[0.22, frame.h, 0.3]} />
            <meshStandardMaterial color="#1a2232" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, frame.h / 2, 0]}>
            <boxGeometry args={[frame.w, 0.22, 0.3]} />
            <meshStandardMaterial color="#1a2232" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, -frame.h / 2, 0]}>
            <boxGeometry args={[frame.w, 0.22, 0.3]} />
            <meshStandardMaterial color="#1a2232" metalness={0.7} roughness={0.28} />
          </mesh>
          <pointLight
            position={[index % 2 ? frame.w / 2 : -frame.w / 2, 0, 1.2]}
            color={index % 3 === 0 ? BLUE_SOFT : '#2849b8'}
            intensity={8}
            distance={13}
          />
        </group>
      ))}

      {debris.map((item, index) => (
        <mesh
          key={'debris-' + index}
          ref={(node) => { floating.current[index] = node }}
          position={item.position}
          scale={item.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={index % 4 === 0 ? BLUE : '#202632'}
            emissive={index % 4 === 0 ? '#193fb8' : '#000000'}
            emissiveIntensity={index % 4 === 0 ? 1.5 : 0}
            metalness={0.62}
            roughness={0.28}
          />
        </mesh>
      ))}

      <Cable
        points={[
          [-5.8, 2.2, -15],
          [-4.2, 3.2, -25],
          [2.8, 2.6, -35],
          [5.2, -1.3, -48],
          [1.4, -2.4, -59],
        ]}
        color="#4268ff"
        radius={0.055}
      />
      <Cable
        points={[
          [5.7, -2.7, -18],
          [3.2, -3.5, -29],
          [-4.3, -2.2, -42],
          [-5.6, 1.2, -54],
        ]}
        color="#243d85"
        radius={0.03}
        opacity={0.8}
      />

    </group>
  )
}

export function PhysicalWords() {
  return (
    <group>
      <SectionText position={[-1.1, 2.3, -52]} rotation={[0.02, 0.1, 0]} size={2.7} maxWidth={15}>
        CONSTRUÍMOS
      </SectionText>
      <SectionText position={[1.1, 0.1, -59]} rotation={[0.02, -0.12, 0]} size={2.35} color={BLUE_SOFT} maxWidth={16}>
        EXPERIÊNCIAS
      </SectionText>
      <SectionText position={[-0.2, -2.2, -66]} rotation={[-0.04, 0.06, 0]} size={3.05} maxWidth={14}>
        DIGITAIS
      </SectionText>

      <mesh position={[-4.8, 0.2, -57]}>
        <boxGeometry args={[0.5, 8, 2]} />
        <meshStandardMaterial color="#080b10" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[5.2, -0.4, -63]}>
        <boxGeometry args={[0.65, 7.4, 2.6]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.72} roughness={0.25} />
      </mesh>
    </group>
  )
}

export function SitesUniverse({ progressRef }) {
  const fragments = useRef([])
  const configs = useMemo(
    () => [
      [-4.4, 2.1, -78, -1],
      [-2.1, -1.8, -80, 1],
      [4.2, 2.8, -82, 1],
      [3.4, -2.3, -84, -1],
      [-0.8, 3.4, -86, 1],
      [0.7, -3.4, -88, -1],
    ],
    [],
  )

  useFrame(() => {
    const p = smooth(range(progressRef.current, 0.255, 0.355))
    fragments.current.forEach((group, index) => {
      if (!group) return
      const base = configs[index]
      const dir = base[3]
      group.position.x = base[0] + dir * p * (4.8 + index * 0.35)
      group.position.y = base[1] + dir * p * 1.2
      group.rotation.z = dir * p * 0.75
      group.rotation.y = dir * p * 0.45
    })
  })

  return (
    <group>
      <SectionText position={[0, 4.7, -88]} size={0.72} color={BLUE_SOFT} maxWidth={14}>
        SEU SITE NÃO É UMA PÁGINA.
      </SectionText>
      <SectionText position={[0, 3.55, -88.2]} size={1.02} maxWidth={14}>
        É UMA ARQUITETURA.
      </SectionText>

      <group position={[0, -0.5, -89]}>
        <mesh>
          <boxGeometry args={[10.5, 6.3, 0.28]} />
          <meshStandardMaterial color="#10141d" metalness={0.72} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[9.9, 5.7]} />
          <meshStandardMaterial color="#0b1020" emissive="#0d1d58" emissiveIntensity={0.75} roughness={0.5} />
        </mesh>

        <mesh position={[-2.6, 0.7, 0.45]}>
          <boxGeometry args={[3.6, 2.6, 0.16]} />
          <meshStandardMaterial color="#1c2e74" emissive="#1f47c8" emissiveIntensity={1.15} />
        </mesh>
        <mesh position={[2.4, 1.05, 0.55]}>
          <boxGeometry args={[3.1, 1.35, 0.18]} />
          <meshStandardMaterial color="#e9ecf5" />
        </mesh>
        <mesh position={[2.25, -1.15, 0.6]}>
          <boxGeometry args={[3.45, 2.1, 0.22]} />
          <meshStandardMaterial color="#1a1f2b" metalness={0.4} />
        </mesh>
        <pointLight position={[0, 0, 2]} color={BLUE} intensity={22} distance={13} />
      </group>

      {configs.map((base, index) => (
        <group
          key={'fragment-' + index}
          ref={(node) => { fragments.current[index] = node }}
          position={[base[0], base[1], base[2]]}
        >
          <mesh>
            <boxGeometry args={[1.6 + (index % 2) * 0.7, 0.9 + (index % 3) * 0.35, 0.18]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? BLUE : '#d7dbe4'}
              emissive={index % 3 === 0 ? '#173caf' : '#000'}
              emissiveIntensity={index % 3 === 0 ? 0.9 : 0}
              metalness={0.35}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const LAYERS = [
  ['FRONT-END', '#5577ff'],
  ['UX / UI', '#dfe5ff'],
  ['BACKEND', '#6f83d7'],
  ['INTEGRAÇÕES', '#43549c'],
  ['INFRAESTRUTURA', '#273359'],
  ['SEGURANÇA', '#141b2d'],
]

export function LayerExplosion({ progressRef }) {
  const refs = useRef([])

  useFrame(() => {
    const p = smooth(range(progressRef.current, 0.345, 0.485))
    refs.current.forEach((group, index) => {
      if (!group) return
      group.position.z = -98 - index * (0.75 + p * 4.15)
      group.position.x = (index - 2.5) * 0.22 * p
      group.rotation.y = (index % 2 ? -1 : 1) * 0.045 * p
      group.rotation.z = (index - 2.5) * 0.012 * p
    })
  })

  return (
    <group>
      {LAYERS.map(([label, color], index) => (
        <group
          key={label}
          ref={(node) => { refs.current[index] = node }}
          position={[0, 0, -98 - index * 0.75]}
        >
          <mesh>
            <boxGeometry args={[10.5, 6.1, 0.12]} />
            <meshStandardMaterial
              color="#0a0d13"
              emissive={color}
              emissiveIntensity={0.18 + index * 0.03}
              metalness={0.58}
              roughness={0.28}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[9.9, 5.5]} />
            <meshBasicMaterial color={color} transparent opacity={0.045 + index * 0.012} />
          </mesh>
          <Text position={[0, 0, 0.18]} fontSize={0.58} letterSpacing={0.03} color={color}>
            {String(index + 1).padStart(2, '0')} / {label}
          </Text>
          <mesh position={[0, -2.45, 0.18]}>
            <boxGeometry args={[7.5 - index * 0.7, 0.045, 0.04]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function FiberTransition({ progressRef }) {
  const packetRefs = useRef([])
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.3, -123),
      new THREE.Vector3(3.5, -1.2, -131),
      new THREE.Vector3(-3.2, 1.7, -140),
      new THREE.Vector3(1.8, 0.5, -150),
      new THREE.Vector3(0, 0, -158),
    ]),
    [],
  )

  useFrame(() => {
    const p = range(progressRef.current, 0.44, 0.59)
    packetRefs.current.forEach((mesh, index) => {
      if (!mesh) return
      const t = THREE.MathUtils.clamp((p * 1.45 + index * 0.16) % 1, 0, 1)
      const pos = curve.getPointAt(t)
      mesh.position.copy(pos)
    })
  })

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.085, 10, false]} />
        <meshStandardMaterial color="#a8c6ff" emissive={BLUE} emissiveIntensity={2.8} roughness={0.2} />
      </mesh>
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh key={index} ref={(node) => { packetRefs.current[index] = node }}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

export function TelecomWorld({ progressRef, pointerRef }) {
  const group = useRef()
  const packets = useRef([])

  const nodes = useMemo(
    () => [
      { label: 'BNG', pos: [0, 1.5, -158], scale: [3.6, 5.4, 3.8], color: '#1d2c52' },
      { label: 'OLT', pos: [-7.2, 0.4, -164], scale: [3, 3.9, 3], color: '#172747' },
      { label: 'BACKBONE', pos: [7.4, 0.9, -166], scale: [3.2, 4.8, 3.2], color: '#1b315a' },
      { label: 'CTO', pos: [-4.3, -2.2, -172], scale: [2.1, 2.1, 2.1], color: '#203a69' },
      { label: 'CTO', pos: [4.8, -2, -174], scale: [2.1, 2.1, 2.1], color: '#203a69' },
    ],
    [],
  )

  const links = useMemo(
    () => [
      [[0, 1.5, -158], [-7.2, 0.4, -164]],
      [[0, 1.5, -158], [7.4, 0.9, -166]],
      [[-7.2, 0.4, -164], [-4.3, -2.2, -172]],
      [[7.4, 0.9, -166], [4.8, -2, -174]],
      [[-4.3, -2.2, -172], [4.8, -2, -174]],
    ],
    [],
  )

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = pointerRef.current.x * 0.018
      group.current.rotation.x = -pointerRef.current.y * 0.012
    }

    const p = range(progressRef.current, 0.49, 0.66)
    packets.current.forEach((mesh, index) => {
      if (!mesh) return
      const link = links[index % links.length]
      const a = new THREE.Vector3(...link[0])
      const b = new THREE.Vector3(...link[1])
      const t = (p * 6.5 + index * 0.23) % 1
      mesh.position.lerpVectors(a, b, t)
    })
  })

  return (
    <group ref={group}>
      {nodes.map((node) => (
        <group key={node.label + node.pos.join('-')} position={node.pos}>
          <mesh scale={node.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={node.color}
              emissive="#173d94"
              emissiveIntensity={0.45}
              metalness={0.72}
              roughness={0.24}
            />
          </mesh>
          <Text position={[0, node.scale[1] * 0.58, 0.6]} fontSize={0.48} color={BLUE_SOFT} letterSpacing={0.08}>
            {node.label}
          </Text>
          <pointLight position={[0, 0, 2.4]} color={BLUE} intensity={12} distance={12} />
        </group>
      ))}

      {links.map((link, index) => (
        <Cable key={index} points={link} radius={0.045} color={index === 0 ? '#a7bbff' : BLUE} opacity={0.85} />
      ))}

      {Array.from({ length: 10 }).map((_, index) => (
        <mesh key={'packet-' + index} ref={(node) => { packets.current[index] = node }}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshBasicMaterial color={index % 2 ? '#ffffff' : '#6f93ff'} />
        </mesh>
      ))}

      {Array.from({ length: 16 }).map((_, index) => {
        const x = ((index * 3.1) % 14) - 7
        const y = ((index * 2.3) % 7) - 3.5
        const z = -160 - ((index * 4.7) % 15)
        return (
          <mesh key={'city-' + index} position={[x, y, z]} scale={[0.55, 0.55 + (index % 4) * 0.48, 0.55]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0e1727" metalness={0.66} roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

export function ScalePortal() {
  return (
    <group position={[0, 0, -181]}>
      <mesh position={[-6.7, 0, 0]}><boxGeometry args={[1.2, 11, 4]} /><meshStandardMaterial color="#16233b" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[6.7, 0, 0]}><boxGeometry args={[1.2, 11, 4]} /><meshStandardMaterial color="#16233b" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 5.1, 0]}><boxGeometry args={[12.4, 1.1, 4]} /><meshStandardMaterial color="#16233b" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, -5.1, 0]}><boxGeometry args={[12.4, 1.1, 4]} /><meshStandardMaterial color="#16233b" metalness={0.8} roughness={0.2} /></mesh>

      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[-4 + index, 5.65, 1.9]}>
          <boxGeometry args={[0.5, 0.16, 0.22]} />
          <meshBasicMaterial color={index % 2 ? BLUE : '#8ed1ff'} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 3]} color="#5c8cff" intensity={40} distance={22} />
    </group>
  )
}

const FLOW_NODES = [
  ['LEAD', [-7, 2.7, -195]],
  ['CRM', [-3.5, -1.8, -199]],
  ['WHATSAPP', [0.4, 2.2, -202]],
  ['AUTOMAÇÃO', [3.5, -1.3, -205]],
  ['BANCO', [7.2, 2.1, -208]],
  ['DASHBOARD', [4.4, 4.9, -211]],
]

export function AutomationCity({ progressRef, pointerRef }) {
  const packets = useRef([])
  const nodeRefs = useRef([])

  const links = useMemo(
    () => FLOW_NODES.slice(0, -1).map((node, index) => [node[1], FLOW_NODES[index + 1][1]]),
    [],
  )

  useFrame(() => {
    const p = range(progressRef.current, 0.61, 0.74)
    nodeRefs.current.forEach((node, index) => {
      if (!node) return
      node.rotation.y = pointerRef.current.x * 0.06 * (index % 2 ? -1 : 1)
      node.position.y = FLOW_NODES[index][1][1] + pointerRef.current.y * 0.16 * (index % 3)
    })

    packets.current.forEach((mesh, index) => {
      if (!mesh) return
      const link = links[index % links.length]
      const a = new THREE.Vector3(...link[0])
      const b = new THREE.Vector3(...link[1])
      const t = (p * 8 + index * 0.17) % 1
      mesh.position.lerpVectors(a, b, t)
    })
  })

  return (
    <group>
      {FLOW_NODES.map(([label, position], index) => (
        <group key={label} position={position} ref={(node) => { nodeRefs.current[index] = node }}>
          <mesh>
            <octahedronGeometry args={[1.15 + (index % 2) * 0.2, 0]} />
            <meshStandardMaterial
              color={index === 3 ? '#597cff' : '#17243d'}
              emissive={index === 3 ? '#2d55df' : '#0b1b45'}
              emissiveIntensity={1.05}
              metalness={0.72}
              roughness={0.2}
            />
          </mesh>
          <Text position={[0, -1.85, 0]} fontSize={0.34} color={index === 3 ? '#cbd6ff' : '#8195be'} letterSpacing={0.05}>
            {label}
          </Text>
          <pointLight position={[0, 0, 1.5]} color={index === 3 ? BLUE_SOFT : '#315abe'} intensity={8} distance={8} />
        </group>
      ))}

      {links.map((link, index) => (
        <Cable key={'flow-' + index} points={link} radius={0.035} color={index === 2 ? '#a8bcff' : '#315fd2'} opacity={0.8} />
      ))}

      {Array.from({ length: 14 }).map((_, index) => (
        <mesh key={'flow-packet-' + index} ref={(node) => { packets.current[index] = node }}>
          <sphereGeometry args={[0.11, 10, 10]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#ffffff' : '#7197ff'} />
        </mesh>
      ))}

      <SectionText position={[0, -5.3, -204]} size={0.7} color="#5f75a8" maxWidth={14}>
        LEADS → CRM → WHATSAPP → AUTOMAÇÃO → DADOS
      </SectionText>
    </group>
  )
}

function Hangar() {
  return (
    <group position={[8, 0, -224]}>
      {[-5.5, 0, 5.5].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 2.8, 0]}><boxGeometry args={[0.25, 6, 5]} /><meshStandardMaterial color="#111a2b" metalness={0.6} /></mesh>
        </group>
      ))}
      <mesh position={[0, -3, 0]}><boxGeometry args={[12, 0.25, 8]} /><meshStandardMaterial color="#101727" /></mesh>
      <Text position={[0, 3.8, -0.5]} fontSize={1.2} color="#f2f5ff" letterSpacing={-0.04}>AIRBROKER</Text>
      <mesh position={[0, 0, 0]} rotation={[0, 0.25, -0.12]}>
        <coneGeometry args={[1.3, 5.5, 3]} />
        <meshStandardMaterial color="#d8e0ef" metalness={0.65} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 2, 2]} color="#4a76ff" intensity={30} distance={16} />
    </group>
  )
}

function MedicalWorld() {
  return (
    <group position={[-7, 0.5, -244]}>
      <mesh position={[0, -2.8, 0]}><boxGeometry args={[12, 0.25, 8]} /><meshStandardMaterial color="#dfe4e3" /></mesh>
      {[-4, 0, 4].map((x, index) => (
        <mesh key={x} position={[x, 0, 0]} scale={[1.6, 5 + index * 0.7, 1.6]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={index === 1 ? '#a9c1c3' : '#eef1ec'} roughness={0.22} />
        </mesh>
      ))}
      <Text position={[0, 4.6, 0]} fontSize={1.05} color="#eff4ef" letterSpacing={-0.04}>OSTON CAMBUÍ</Text>
      <pointLight position={[0, 1.5, 3]} color="#dff7ff" intensity={26} distance={15} />
    </group>
  )
}

function OpsWorld() {
  return (
    <group position={[7, 0, -262]}>
      {Array.from({ length: 12 }).map((_, index) => (
        <mesh
          key={index}
          position={[
            ((index * 2.9) % 10) - 5,
            ((index * 1.7) % 6) - 2.8,
            ((index * 2.3) % 5) - 2.5,
          ]}
          scale={[0.7, 0.7 + (index % 4) * 0.55, 0.7]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#101c33" emissive="#0e2f7a" emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
      <Text position={[0, 4.7, 0]} fontSize={0.9} color="#9db7ff" letterSpacing={-0.03}>MYS MONITORING</Text>
      <pointLight position={[0, 0, 2]} color={BLUE} intensity={36} distance={17} />
    </group>
  )
}

function AutoWorld() {
  return (
    <group position={[-5, 0, -280]}>
      <mesh position={[0, -2.7, 0]}><boxGeometry args={[12, 0.2, 7]} /><meshStandardMaterial color="#391013" /></mesh>
      <mesh position={[-4.6, 0, 0]}><boxGeometry args={[0.5, 6, 5]} /><meshStandardMaterial color="#7b161e" metalness={0.5} /></mesh>
      <mesh position={[4.6, 0, 0]}><boxGeometry args={[0.5, 6, 5]} /><meshStandardMaterial color="#7b161e" metalness={0.5} /></mesh>
      <Text position={[0, 4.1, 0]} fontSize={1} color="#ffb4b7" letterSpacing={-0.04}>VILA VEÍCULOS</Text>
      <mesh position={[0, -0.5, 0]} scale={[3.4, 0.8, 1.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b41f29" metalness={0.45} roughness={0.25} />
      </mesh>
      <pointLight position={[0, 0.5, 2.4]} color="#ff3b45" intensity={30} distance={15} />
    </group>
  )
}

export function ProjectWorlds() {
  return (
    <group>
      <Cable
        points={[
          [0, -4.4, -210],
          [8, -3.8, -224],
          [-7, -3.8, -244],
          [7, -3.8, -262],
          [-5, -3.8, -280],
        ]}
        radius={0.055}
        color="#506fff"
        opacity={0.65}
      />
      <Hangar />
      <MedicalWorld />
      <OpsWorld />
      <AutoWorld />
    </group>
  )
}


export function TimeFreezeField({ progressRef }) {
  const refs = useRef([])
  const shards = useMemo(
    () => Array.from({ length: 24 }, (_, index) => {
      const lane = (index % 6) - 2.5
      const row = Math.floor(index / 6) - 1.5
      return {
        start: [lane * 1.7, row * 1.5, -284 - (index % 4) * 1.4],
        end: [
          lane * 2.35 + (index % 2 ? 1.4 : -1.4),
          row * 2.0 + (index % 3 - 1) * 0.9,
          -292 - (index % 5) * 2.1,
        ],
        rotation: [
          (index % 4) * 0.7,
          (index % 5) * 0.48,
          (index % 3) * 0.8,
        ],
        scale: 0.18 + (index % 4) * 0.08,
      }
    }),
    [],
  )

  useFrame(() => {
    const p = smooth(range(progressRef.current, 0.86, 0.93))
    refs.current.forEach((mesh, index) => {
      if (!mesh) return
      const shard = shards[index]
      mesh.position.x = THREE.MathUtils.lerp(shard.start[0], shard.end[0], p)
      mesh.position.y = THREE.MathUtils.lerp(shard.start[1], shard.end[1], p)
      mesh.position.z = THREE.MathUtils.lerp(shard.start[2], shard.end[2], p)
      mesh.rotation.x = shard.rotation[0] * p
      mesh.rotation.y = shard.rotation[1] * p
      mesh.rotation.z = shard.rotation[2] * p
      mesh.scale.setScalar(shard.scale * (0.72 + p * 0.65))
    })
  })

  return (
    <group>
      <SectionText position={[0, 4.3, -289]} size={0.58} color="#7286bd" maxWidth={14}>
        SCROLL FORWARD = TIME FORWARD
      </SectionText>
      {shards.map((shard, index) => (
        <mesh
          key={'time-' + index}
          ref={(node) => { refs.current[index] = node }}
          position={shard.start}
        >
          {index % 3 === 0 ? <octahedronGeometry args={[1, 0]} /> : <boxGeometry args={[1.4, 0.32, 0.52]} />}
          <meshStandardMaterial
            color={index % 4 === 0 ? BLUE_SOFT : '#2a344b'}
            emissive={index % 4 === 0 ? '#274fce' : '#071127'}
            emissiveIntensity={index % 4 === 0 ? 1.2 : 0.35}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
      <pointLight position={[0, 0, -288]} color="#6688ff" intensity={18} distance={18} />
    </group>
  )
}

export function ManifestoWorld() {
  return (
    <group>
      <SectionText position={[0, 2.3, -299]} size={1.5} maxWidth={14}>
        TECNOLOGIA DEVERIA
      </SectionText>
      <SectionText position={[0, 0.1, -300]} size={1.65} color={BLUE_SOFT} maxWidth={14}>
        PARECER IMPOSSÍVEL.
      </SectionText>
      <SectionText position={[0, -2.1, -301]} size={1.45} maxWidth={14}>
        ATÉ FUNCIONAR.
      </SectionText>
    </group>
  )
}

export function FinalMark({ progressRef }) {
  const ring = useRef()
  const core = useRef()
  const terminal = useRef()

  useFrame(() => {
    const p = smooth(range(progressRef.current, 0.945, 1))
    if (terminal.current) {
      const terminalP = smooth(range(p, 0, 0.72))
      terminal.current.position.z = 10 + terminalP * 4
      terminal.current.rotation.x = -0.06 + terminalP * 0.24
      terminal.current.scale.setScalar(1 - terminalP * 0.5)
      terminal.current.visible = p < 0.9
    }
    if (ring.current) {
      ring.current.scale.setScalar(0.72 + p * 0.28)
      ring.current.rotation.z = (1 - p) * 0.45
      ring.current.material.opacity = p
    }
    if (core.current) {
      core.current.scale.setScalar(1 - p * 0.45)
      core.current.rotation.z = p * Math.PI * 0.5
    }
  })

  return (
    <group position={[0, 0, -329]}>
      <group ref={terminal} position={[0, 0, 10]} rotation={[-0.06, 0, 0]}>
        <mesh>
          <boxGeometry args={[11, 6.7, 0.55]} />
          <meshStandardMaterial color="#0a0f19" emissive="#10275f" emissiveIntensity={0.45} metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.31]}>
          <planeGeometry args={[10.2, 5.9]} />
          <meshStandardMaterial color="#080c14" emissive="#173b9d" emissiveIntensity={0.35} />
        </mesh>
        <Text position={[-3.9, 2.35, 0.4]} fontSize={0.32} color="#6f8fff" letterSpacing={0.12}>
          MYS / TERMINAL
        </Text>
        <Text position={[0, 0.45, 0.42]} fontSize={0.78} color="#eef2ff" letterSpacing={-0.045}>
          WHAT DO WE BUILD NEXT?
        </Text>
        <mesh position={[0, -1.05, 0.42]}>
          <boxGeometry args={[5.6, 0.04, 0.03]} />
          <meshBasicMaterial color="#4f70ee" />
        </mesh>
        <pointLight position={[0, 0, 2]} color={BLUE} intensity={24} distance={13} />
      </group>

      <mesh ref={ring}>
        <torusGeometry args={[5.8, 0.21, 16, 96]} />
        <meshStandardMaterial color={WHITE} emissive="#3154db" emissiveIntensity={0.35} metalness={0.76} roughness={0.16} transparent opacity={0} />
      </mesh>

      <group ref={core}>
        <mesh position={[-2.15, 0.4, 0]} rotation={[0, 0, 0.72]}><boxGeometry args={[4.2, 0.35, 0.35]} /><meshStandardMaterial color={WHITE} metalness={0.72} roughness={0.18} /></mesh>
        <mesh position={[2.15, 0.4, 0]} rotation={[0, 0, -0.72]}><boxGeometry args={[4.2, 0.35, 0.35]} /><meshStandardMaterial color={WHITE} metalness={0.72} roughness={0.18} /></mesh>
        <mesh position={[-1.05, -2.3, 0]} rotation={[0, 0, -0.72]}><boxGeometry args={[3.6, 0.35, 0.35]} /><meshStandardMaterial color={WHITE} metalness={0.72} roughness={0.18} /></mesh>
        <mesh position={[1.05, -2.3, 0]} rotation={[0, 0, 0.72]}><boxGeometry args={[3.6, 0.35, 0.35]} /><meshStandardMaterial color={WHITE} metalness={0.72} roughness={0.18} /></mesh>
      </group>

      <Text position={[0, -7.3, 0]} fontSize={0.55} color="#7b8fca" letterSpacing={0.13}>
        EVERYTHING WAS INSIDE THE MARK.
      </Text>
      <pointLight position={[0, 0, 3]} color={BLUE} intensity={32} distance={20} />
    </group>
  )
}
