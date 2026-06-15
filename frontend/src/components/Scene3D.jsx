import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

export default function Scene3D({ className }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 3, 4]} intensity={2} />
        <directionalLight position={[-3, -2, -3]} intensity={0.6} color="#ec4899" />

        <Float speed={1.5} rotationIntensity={1.1} floatIntensity={1.4}>
          <mesh>
            <icosahedronGeometry args={[1.3, 1]} />
            <MeshDistortMaterial color="#a5b4fc" distort={0.4} speed={2} roughness={0.25} metalness={0.1} />
          </mesh>
        </Float>

        <Float speed={2.2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[2.2, -1.1, -0.5]} scale={0.5}>
            <torusGeometry args={[0.6, 0.25, 16, 100]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.3} metalness={0.2} />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2}>
          <mesh position={[-2.1, 1.4, -0.5]} scale={0.35}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.05} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  )
}
