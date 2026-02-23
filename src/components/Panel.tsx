import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'cyan' | 'purple';
}

const variantStyles = {
  default: 'glass',
  cyan: 'glass-cyan',
  purple: 'glass-purple',
};

const accentLine = {
  default: 'from-slate-400/40 to-transparent',
  cyan: 'from-neon-cyan/60 to-transparent',
  purple: 'from-cortensor-purple/60 to-transparent',
};

export function Panel({ title, subtitle, icon, children, className = '', variant = 'default' }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`${variantStyles[variant]} rounded-2xl overflow-hidden panel-border ${className}`}
    >
      <div className={`h-px bg-gradient-to-r ${accentLine[variant]}`} />

      {/* Header */}
      <div className="px-4 py-3 border-b panel-border flex items-center gap-3">
        {icon && (
          <div className={`${variant === 'cyan' ? 'text-neon-cyan' : variant === 'purple' ? 'text-cortensor-purple' : 'text-app-secondary'}`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className={`font-semibold text-sm ${variant === 'cyan' ? 'text-neon-cyan' : variant === 'purple' ? 'text-cortensor-purple' : 'text-app-primary'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-app-muted">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </motion.div>
  );
}
