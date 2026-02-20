import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, Check } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const mockAddress = '0x7a23...f842';
  const fullAddress = '0x7a23E9c1B4F9d8E5C2A6B3D4E5F6A7B8C9D0E1F2';

  const handleConnect = () => {
    setIsConnected(true);
    onConnect?.();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={handleConnect}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cortensor-purple to-cortensor-orange text-white font-medium transition-all hover:shadow-lg hover:shadow-cortensor-purple/25"
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </motion.button>
    );
  }

  return (
    <div className="glass-purple rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cortensor-purple to-cortensor-orange flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-sm">{mockAddress}</span>
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-success-green" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
              <span className="text-xs text-gray-500">BNB Smart Chain</span>
            </div>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
