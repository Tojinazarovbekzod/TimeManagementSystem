import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'

function Shape() {
  const mesh = useRef()
  useFrame((_, delta) => {
    mesh.current.rotation.x += delta * 0.4
    mesh.current.rotation.y += delta * 0.6
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.1, 1]} />
      <MeshDistortMaterial color="#c7d2fe" distort={0.4} speed={2} roughness={0.2} metalness={0.2} />
    </mesh>
  )
}

export default function Scene3DMini({ className }) {
  return (
    <Canvas className={className} camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 2, 3]} intensity={2} />
      <directionalLight position={[-2, -1, -2]} intensity={0.6} color="#ec4899" />
      <Shape />
    </Canvas>
  )
}
