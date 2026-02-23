import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="glass panel-border px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{
              boxShadow: [
                '0 0 0 rgba(0, 240, 255, 0.0)',
                '0 0 22px rgba(0, 240, 255, 0.32)',
                '0 0 0 rgba(0, 240, 255, 0.0)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan via-cortensor-purple to-cortensor-orange p-[2px]">
              <div className="w-full h-full rounded-xl bg-[var(--surface-strong)] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold text-app-primary tracking-tight">
              OMNI-<span className="text-neon-cyan">CORE</span>
            </h1>
            <p className="text-xs text-app-muted font-mono">
              On-chain Multi-agent Neural Interface
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleTheme}
            className="h-10 px-3 rounded-xl glass panel-border flex items-center gap-2 text-xs sm:text-sm text-app-secondary hover:text-app-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm px-3 h-10 rounded-xl glass panel-border">
            <Zap className="w-4 h-4 text-success-green" />
            <span className="text-app-secondary">Groq API</span>
            <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm px-3 h-10 rounded-xl glass panel-border">
            <Activity className="w-4 h-4 text-cortensor-purple" />
            <span className="text-app-secondary">Cortensor</span>
            <span className="w-2 h-2 rounded-full bg-cortensor-purple animate-pulse" />
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-500/30" />

          <div className="text-right min-w-[90px]">
            <div className="text-[11px] text-app-muted uppercase tracking-wider">Network</div>
            <div className="text-sm text-cortensor-orange font-mono">BNB Chain</div>
          </div>
        </div>
      </div>
    </header>
  );
}
