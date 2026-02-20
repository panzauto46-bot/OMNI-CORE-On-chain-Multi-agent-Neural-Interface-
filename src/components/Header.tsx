import { motion } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="glass border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 240, 255, 0.3)',
                '0 0 40px rgba(0, 240, 255, 0.5)',
                '0 0 20px rgba(0, 240, 255, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan via-cortensor-purple to-cortensor-orange p-[2px]">
              <div className="w-full h-full rounded-xl bg-void-black flex items-center justify-center">
                <Cpu className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              OMNI-<span className="text-neon-cyan">CORE</span>
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              On-chain Multi-agent Neural Interface
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-success-green" />
            <span className="text-gray-400">Groq API</span>
            <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-cortensor-purple" />
            <span className="text-gray-400">Cortensor</span>
            <span className="w-2 h-2 rounded-full bg-cortensor-purple animate-pulse" />
          </div>

          <div className="h-8 w-px bg-gray-800" />

          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Network</div>
            <div className="text-sm text-cortensor-orange font-mono">BNB Chain</div>
          </div>
        </div>
      </div>
    </header>
  );
}
