import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Shield, Eye, Wallet } from 'lucide-react';
import type { WalletData } from '../services/web3Client';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: number;
}

interface Contract {
  name: string;
  address: string;
  status: 'guarded' | 'monitoring' | 'warning';
}

// Mock assets (shown when wallet not connected)
const mockAssets: Asset[] = [
  { symbol: 'BNB', name: 'BNB', balance: '12.5431', value: '$3,842.12', change: 2.34 },
  { symbol: 'CAKE', name: 'PancakeSwap', balance: '1,250.00', value: '$2,125.00', change: -1.23 },
  { symbol: 'USDT', name: 'Tether', balance: '5,000.00', value: '$5,000.00', change: 0.01 },
  { symbol: 'BTCB', name: 'Bitcoin BEP2', balance: '0.1500', value: '$9,450.00', change: 1.56 },
  { symbol: 'ETH', name: 'Ethereum', balance: '1.2000', value: '$3,890.00', change: 0.89 },
];

const contracts: Contract[] = [
  { name: 'LP-BNB/CAKE', address: '0x0eD7e...3c4F', status: 'guarded' },
  { name: 'Staking Pool', address: '0x7Bc9a...d2E1', status: 'monitoring' },
  { name: 'Yield Vault', address: '0x4Fd2c...a8B3', status: 'guarded' },
  { name: 'Router V2', address: '0x1A2b3...4C5d', status: 'guarded' },
  { name: 'Bridge Proxy', address: '0x9E8d7...6B5a', status: 'warning' },
];

const statusColors = {
  guarded: 'text-success-green',
  monitoring: 'text-warning-yellow',
  warning: 'text-danger-red',
};

interface TreasuryWatchProps {
  walletData?: WalletData | null;
}

export function TreasuryWatch({ walletData }: TreasuryWatchProps) {
  const isConnected = walletData?.isConnected;

  // Build assets list: if wallet connected, show real BNB balance first
  const assets = isConnected
    ? [
      {
        symbol: 'BNB',
        name: `BNB (${walletData.chainName})`,
        balance: walletData.balance,
        value: `~$${(parseFloat(walletData.balance) * 306.50).toFixed(2)}`,
        change: 2.34,
      },
      ...mockAssets.slice(1), // Keep the rest as simulated
    ]
    : mockAssets;

  const totalValue = isConnected
    ? `$${(parseFloat(walletData.balance) * 306.50 + 11125).toFixed(2)}`
    : '$10,967.12';

  return (
    <div className="space-y-4">
      {/* Wallet Status Banner */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-green/10 border border-success-green/30"
        >
          <Wallet className="w-4 h-4 text-success-green" />
          <span className="text-success-green text-xs font-mono">
            Live: {walletData.shortAddress}
          </span>
        </motion.div>
      )}

      {/* Total Value */}
      <div className="glass rounded-xl p-4">
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Treasury Value</div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold text-white font-mono">{totalValue}</span>
          <span className="text-success-green text-sm flex items-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4" />
            +3.42%
          </span>
        </div>
        {!isConnected && (
          <div className="text-gray-600 text-[10px] mt-1 font-mono">
            ⚠ Simulated data — connect wallet for live balance
          </div>
        )}
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        <div className="text-gray-500 text-xs uppercase tracking-wider px-1">Assets</div>
        {assets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-lg p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isConnected && index === 0
                  ? 'bg-gradient-to-br from-success-green to-emerald-700 ring-2 ring-success-green/30'
                  : 'bg-gradient-to-br from-cortensor-orange to-cortensor-purple'
                }`}>
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="text-white text-sm font-medium flex items-center gap-1">
                  {asset.symbol}
                  {isConnected && index === 0 && (
                    <span className="text-[9px] bg-success-green/20 text-success-green px-1.5 py-0.5 rounded-full font-mono">LIVE</span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">{asset.balance}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-mono">{asset.value}</div>
              <div className={`text-xs flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-success-green' : 'text-danger-red'}`}>
                {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(asset.change)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guarded Contracts */}
      <div className="space-y-2">
        <div className="text-gray-500 text-xs uppercase tracking-wider px-1 flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Guarded Contracts
        </div>
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.address}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <div className="text-white text-sm">{contract.name}</div>
              <div className="text-gray-600 text-xs font-mono">{contract.address}</div>
            </div>
            <div className={`flex items-center gap-1 ${statusColors[contract.status]}`}>
              <Eye className="w-4 h-4" />
              <span className="text-xs capitalize">{contract.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
