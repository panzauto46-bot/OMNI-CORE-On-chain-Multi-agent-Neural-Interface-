import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  active: boolean;
  type: 'core' | 'validator' | 'worker';
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

export function NodeGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Initialize nodes in a circular pattern
    const centerX = 150;
    const centerY = 120;
    const radius = 80;
    
    const initialNodes: Node[] = [
      { id: 'core', x: centerX, y: centerY, active: true, type: 'core' },
    ];

    // Add validator and worker nodes around the core
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      initialNodes.push({
        id: `node-${i}`,
        x,
        y,
        active: Math.random() > 0.3,
        type: i % 2 === 0 ? 'validator' : 'worker',
      });
    }

    setNodes(initialNodes);

    // Create connections from core to all nodes
    const conns: Connection[] = initialNodes
      .filter(n => n.id !== 'core')
      .map(n => ({
        from: 'core',
        to: n.id,
        active: n.active,
      }));

    setConnections(conns);

    // Simulate activity
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.id === 'core') return node;
        return {
          ...node,
          active: Math.random() > 0.2,
        };
      }));
      setConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.3,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative w-full h-60 overflow-hidden">
      <svg className="w-full h-full">
        {/* Grid pattern background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        {connections.map((conn, idx) => {
          const fromNode = getNodeById(conn.from);
          const toNode = getNodeById(conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={idx}>
              <motion.line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={conn.active ? '#9D4EDD' : '#333'}
                strokeWidth={conn.active ? 2 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              {conn.active && (
                <motion.circle
                  r={3}
                  fill="#00F0FF"
                  animate={{
                    cx: [fromNode.x, toNode.x],
                    cy: [fromNode.y, toNode.y],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {node.type === 'core' ? (
              <>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill="rgba(0, 240, 255, 0.1)"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  animate={{
                    r: [20, 25, 20],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  fill="#00F0FF"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + 40}
                  textAnchor="middle"
                  fill="#00F0FF"
                  fontSize="10"
                  fontFamily="Fira Code"
                >
                  GROQ CORE
                </text>
              </>
            ) : (
              <>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={12}
                  fill={node.active ? 'rgba(157, 78, 221, 0.2)' : 'rgba(50, 50, 50, 0.5)'}
                  stroke={node.active ? '#9D4EDD' : '#444'}
                  strokeWidth={1.5}
                  animate={node.active ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={4}
                  fill={node.active ? (node.type === 'validator' ? '#FF6B35' : '#9D4EDD') : '#444'}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cortensor-purple" />
          <span className="text-gray-500">Worker</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cortensor-orange" />
          <span className="text-gray-500">Validator</span>
        </div>
      </div>
    </div>
  );
}
