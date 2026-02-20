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

export function Panel({ title, subtitle, icon, children, className = '', variant = 'default' }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variantStyles[variant]} rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
        {icon && (
          <div className={`${variant === 'cyan' ? 'text-neon-cyan' : variant === 'purple' ? 'text-cortensor-purple' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className={`font-semibold text-sm ${variant === 'cyan' ? 'text-neon-cyan' : variant === 'purple' ? 'text-cortensor-purple' : 'text-white'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
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
