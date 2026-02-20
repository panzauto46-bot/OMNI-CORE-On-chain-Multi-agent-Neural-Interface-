import { motion } from 'framer-motion';

type Status = 'idle' | 'thinking' | 'delegating';

interface StatusOrbProps {
  status: Status;
}

const statusConfig = {
  idle: {
    color: '#00FF88',
    label: 'IDLE',
    pulseColor: 'rgba(0, 255, 136, 0.4)',
  },
  thinking: {
    color: '#00F0FF',
    label: 'GROQ PROCESSING',
    pulseColor: 'rgba(0, 240, 255, 0.4)',
  },
  delegating: {
    color: '#9D4EDD',
    label: 'DELEGATING TO CORTENSOR',
    pulseColor: 'rgba(157, 78, 221, 0.4)',
  },
};

export function StatusOrb({ status }: StatusOrbProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: config.pulseColor }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Middle pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: config.pulseColor }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
        {/* Core orb */}
        <motion.div
          className="relative w-4 h-4 rounded-full"
          style={{ backgroundColor: config.color }}
          animate={{
            boxShadow: [
              `0 0 10px ${config.color}, 0 0 20px ${config.color}`,
              `0 0 20px ${config.color}, 0 0 40px ${config.color}`,
              `0 0 10px ${config.color}, 0 0 20px ${config.color}`,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <span
        className="text-xs font-mono font-medium tracking-wider"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
}
