import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function PromptInput({ onSubmit, disabled }: PromptInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
      <div className="flex items-center gap-3 glass-cyan rounded-lg px-4 py-3">
        <Terminal className="w-5 h-5 text-neon-cyan shrink-0" />
        <span className="text-neon-cyan font-mono shrink-0">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command for OMNI-CORE..."
          disabled={disabled}
          className="flex-1 bg-transparent text-gray-200 font-mono text-sm placeholder:text-gray-600 focus:outline-none"
        />
        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
      <div className="mt-2 flex gap-2 text-xs text-gray-600 font-mono">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => setInput('analyze BNB price movement')}
          className="text-neon-cyan/60 hover:text-neon-cyan transition-colors"
        >
          "analyze BNB price"
        </button>
        <span>|</span>
        <button
          type="button"
          onClick={() => setInput('scan PancakeSwap pools for anomalies')}
          className="text-neon-cyan/60 hover:text-neon-cyan transition-colors"
        >
          "scan pools"
        </button>
        <span>|</span>
        <button
          type="button"
          onClick={() => setInput('audit smart contract 0x...')}
          className="text-neon-cyan/60 hover:text-neon-cyan transition-colors"
        >
          "audit contract"
        </button>
      </div>
    </form>
  );
}
