import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Copy, ExternalLink, Check, AlertTriangle, Unplug } from 'lucide-react';
import {
  connectWallet,
  isMetaMaskInstalled,
  getExplorerLink,
  setupWalletListeners,
  WalletData
} from '../services/web3Client';

interface WalletConnectProps {
  onConnect?: (data: WalletData) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMetaMask = isMetaMaskInstalled();

  // Listen for wallet events
  useEffect(() => {
    if (!hasMetaMask) return;

    const cleanup = setupWalletListeners(
      (accounts) => {
        const accts = accounts as string[];
        if (accts.length === 0) {
          setWallet(null);
          onDisconnect?.();
        } else {
          // Re-connect to get updated data
          handleConnect();
        }
      },
      () => {
        // Chain changed, re-connect to get updated data
        if (wallet) handleConnect();
      }
    );

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMetaMask]);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectWallet();
      setWallet(data);
      onConnect?.(data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    onDisconnect?.();
  };

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // No MetaMask installed
  if (!hasMetaMask) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-orange-500/25"
      >
        <AlertTriangle className="w-5 h-5" />
        Install MetaMask
      </a>
    );
  }

  // Not connected
  if (!wallet) {
    return (
      <div className="space-y-2">
        <motion.button
          onClick={handleConnect}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cortensor-purple to-cortensor-orange text-white font-medium transition-all hover:shadow-lg hover:shadow-cortensor-purple/25 disabled:opacity-50"
        >
          <Wallet className="w-5 h-5" />
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </motion.button>
        {error && (
          <div className="text-danger-red text-xs text-center font-mono animate-pulse">{error}</div>
        )}
      </div>
    );
  }

  // Connected state
  return (
    <div className="glass-purple rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cortensor-purple to-cortensor-orange flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-sm">{wallet.shortAddress}</span>
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-white transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4 text-success-green" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={getExplorerLink(wallet.address, wallet.chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
              <span className="text-xs text-gray-500">{wallet.chainName}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-gray-600 hover:text-danger-red transition-colors"
          title="Disconnect"
        >
          <Unplug className="w-4 h-4" />
        </button>
      </div>

      {/* Balance */}
      <div className="glass rounded-lg p-3 flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Balance</span>
        <span className="text-white font-mono font-bold text-lg">{wallet.balance} BNB</span>
      </div>
    </div>
  );
}
