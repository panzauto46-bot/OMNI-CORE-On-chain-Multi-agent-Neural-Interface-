import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface NodeData {
  id: string;
  position: [number, number, number];
  type: 'worker' | 'validator' | 'groq';
  status: 'active' | 'busy' | 'idle';
  task?: string;
}

interface ConnectionData {
  from: string;
  to: string;
  dataFlow: boolean;
}

// Mock data for nodes
const NODES: NodeData[] = [
  // Groq Central Node
  { id: 'groq-core', position: [0, 0, 0], type: 'groq', status: 'active', task: 'Delegating' },

  // Worker Nodes (inner ring)
  { id: 'worker-1', position: [4, 2, 0], type: 'worker', status: 'busy', task: 'Validation' },
  { id: 'worker-2', position: [3, 3, 2], type: 'worker', status: 'active', task: 'Inference' },
  { id: 'worker-3', position: [0, 4, 1], type: 'worker', status: 'busy', task: 'Compute' },
  { id: 'worker-4', position: [-3, 3, 2], type: 'worker', status: 'idle', task: 'Standby' },
  { id: 'worker-5', position: [-4, 1, -1], type: 'worker', status: 'active', task: 'Audit' },
  { id: 'worker-6', position: [-2, -3, 0], type: 'worker', status: 'busy', task: 'Verify' },
  { id: 'worker-7', position: [2, -3, 1], type: 'worker', status: 'idle', task: 'Standby' },
  { id: 'worker-8', position: [4, -1, -2], type: 'worker', status: 'active', task: 'Process' },

  // Validator Nodes (outer ring)
  { id: 'validator-1', position: [7, 4, 2], type: 'validator', status: 'active', task: 'Consensus' },
  { id: 'validator-2', position: [6, -4, -1], type: 'validator', status: 'busy', task: 'PoI Check' },
  { id: 'validator-3', position: [-6, 4, 3], type: 'validator', status: 'active', task: 'Verify' },
  { id: 'validator-4', position: [-7, -3, -2], type: 'validator', status: 'idle', task: 'Standby' },
];

// Connections between nodes
const CONNECTIONS: ConnectionData[] = [
  { from: 'groq-core', to: 'worker-1', dataFlow: true },
  { from: 'groq-core', to: 'worker-2', dataFlow: true },
  { from: 'groq-core', to: 'worker-3', dataFlow: false },
  { from: 'groq-core', to: 'worker-4', dataFlow: true },
  { from: 'groq-core', to: 'worker-5', dataFlow: true },
  { from: 'groq-core', to: 'worker-6', dataFlow: false },
  { from: 'groq-core', to: 'worker-7', dataFlow: true },
  { from: 'groq-core', to: 'worker-8', dataFlow: true },
  { from: 'worker-1', to: 'validator-1', dataFlow: true },
  { from: 'worker-2', to: 'validator-1', dataFlow: false },
  { from: 'worker-5', to: 'validator-3', dataFlow: true },
  { from: 'worker-6', to: 'validator-4', dataFlow: false },
  { from: 'worker-8', to: 'validator-2', dataFlow: true },
  { from: 'validator-1', to: 'validator-2', dataFlow: true },
  { from: 'validator-3', to: 'validator-4', dataFlow: false },
];

// Color scheme
const COLORS = {
  groq: '#00F0FF',
  worker: '#9D4EDD',
  validator: '#FF6B35',
  connection: '#00F0FF',
  dataFlow: '#FFFFFF',
};

// Glow Sphere Component
function GlowSphere({ position, color, scale = 1, pulse = false }: {
  position: [number, number, number];
  color: string;
  scale?: number;
  pulse?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (pulse) {
        const s = scale + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.set(s, s, s);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1 : 0.5}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

// Core Node with Ring Effect
function CoreNode({ node }: { node: NodeData }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const color = node.type === 'groq' ? COLORS.groq :
    node.type === 'worker' ? COLORS.worker : COLORS.validator;

  useFrame((state) => {
    if (ringRef.current && node.type === 'groq') {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (groupRef.current && node.status === 'busy') {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={node.position}>
      {/* Main Sphere */}
      <GlowSphere
        position={[0, 0, 0]}
        color={color}
        scale={node.type === 'groq' ? 1.5 : 1}
        pulse={node.status === 'active'}
      />

      {/* Ring for Groq Core */}
      {node.type === 'groq' && (
        <mesh ref={ringRef}>
          <torusGeometry args={[2.2, 0.05, 16, 100]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      )}

      {/* Status Indicator Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[node.type === 'groq' ? 1.8 : 1.2, node.type === 'groq' ? 2 : 1.3, 32]} />
        <meshBasicMaterial
          color={node.status === 'active' ? '#00FF00' : node.status === 'busy' ? '#FFA500' : '#808080'}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Html distanceFactor={10}>
        <div className="pointer-events-none whitespace-nowrap">
          <div className={`text-xs font-mono font-bold px-2 py-1 rounded ${node.type === 'groq' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' :
            node.type === 'worker' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
              'bg-orange-500/30 text-orange-300 border border-orange-500/50'
            }`}>
            {node.id}
          </div>
          {node.task && (
            <div className="text-[10px] text-center text-gray-400 mt-1">
              {node.task}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Data Flow Particle
function DataParticle({ start, end, speed = 1 }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random());

  useFrame((_, delta) => {
    if (meshRef.current) {
      progress.current += delta * speed * 0.5;
      if (progress.current > 1) progress.current = 0;

      meshRef.current.position.lerpVectors(start, end, progress.current);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color={COLORS.dataFlow} />
    </mesh>
  );
}

// Connection Line
function ConnectionLine({ from, to, dataFlow }: {
  from: NodeData;
  to: NodeData;
  dataFlow: boolean;
}) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from.position);
    const end = new THREE.Vector3(...to.position);
    return [start, end];
  }, [from.position, to.position]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group>
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
        color: COLORS.connection,
        transparent: true,
        opacity: 0.3,
        linewidth: 1
      }))} />

      {/* Glow effect line */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
        color: COLORS.connection,
        transparent: true,
        opacity: 0.1,
        linewidth: 3
      }))} />

      {/* Data flow particles */}
      {dataFlow && (
        <>
          <DataParticle start={points[0]} end={points[1]} speed={1} />
          <DataParticle start={points[0]} end={points[1]} speed={1} />
        </>
      )}
    </group>
  );
}

// Animated Grid Floor
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <>
      <gridHelper
        ref={gridRef}
        args={[30, 30, '#00F0FF', '#1a1a2e']}
        position={[0, -8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#0A0A0A" opacity={0.8} transparent />
      </mesh>
    </>
  );
}

// Main Scene Component
function Scene() {
  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeData>();
    NODES.forEach(node => map.set(node.id, node));
    return map;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={COLORS.groq} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.validator} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color={COLORS.worker} />

      {/* Background Stars */}
      <Stars
        radius={50}
        depth={50}
        count={500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Grid Floor */}
      <GridFloor />

      {/* Connection Lines */}
      {CONNECTIONS.map((conn, idx) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;
        return (
          <ConnectionLine
            key={`conn-${idx}`}
            from={fromNode}
            to={toNode}
            dataFlow={conn.dataFlow}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => (
        <CoreNode key={node.id} node={node} />
      ))}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Component Export
export default function NodeGraph3D() {
  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-black/50 relative">
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00F0FF]" />
            <span className="text-cyan-300">Groq Core</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-purple-300">Workers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-orange-300">Validators</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-xs text-gray-500 font-mono pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="cursor-move"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
