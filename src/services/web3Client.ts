// Web3 Client - MetaMask Integration for BSC
// Uses native window.ethereum (no heavy wagmi/ethers dependency needed)

export interface WalletData {
    address: string;
    shortAddress: string;
    balance: string; // BNB balance
    chainId: number;
    chainName: string;
    isConnected: boolean;
}

// BSC Chain config
const BSC_CHAIN = {
    chainId: '0x38', // 56 in hex
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
};

const CHAIN_NAMES: Record<number, string> = {
    1: 'Ethereum Mainnet',
    56: 'BNB Smart Chain',
    97: 'BSC Testnet',
    137: 'Polygon',
    42161: 'Arbitrum One',
    10: 'Optimism',
    8453: 'Base',
    11155111: 'Sepolia Testnet',
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Connect to MetaMask
export const connectWallet = async (): Promise<WalletData> => {
    if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask not installed. Please install MetaMask extension.');
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        }) as string[];

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock MetaMask.');
        }

        const address = accounts[0];

        // Get chain ID
        const chainIdHex = await window.ethereum.request({
            method: 'eth_chainId'
        }) as string;
        const chainId = parseInt(chainIdHex, 16);

        // Get balance
        const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        }) as string;

        // Convert wei to ether (BNB)
        const balanceWei = BigInt(balanceHex);
        const balanceEth = Number(balanceWei) / 1e18;

        return {
            address,
            shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
            balance: balanceEth.toFixed(4),
            chainId,
            chainName: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
            isConnected: true,
        };
    } catch (error: unknown) {
        const err = error as { code?: number; message?: string };
        if (err.code === 4001) {
            throw new Error('Connection rejected by user.');
        }
        throw new Error(err.message || 'Failed to connect wallet.');
    }
};

// Switch to BSC network
export const switchToBSC = async (): Promise<void> => {
    if (!isMetaMaskInstalled()) return;

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_CHAIN.chainId }],
        });
    } catch (error: unknown) {
        const err = error as { code?: number };
        // If chain not added, add it
        if (err.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [BSC_CHAIN],
            });
        }
    }
};

// Get BscScan explorer link
export const getExplorerLink = (address: string, chainId: number): string => {
    const explorers: Record<number, string> = {
        1: 'https://etherscan.io',
        56: 'https://bscscan.com',
        97: 'https://testnet.bscscan.com',
        137: 'https://polygonscan.com',
    };
    const base = explorers[chainId] || 'https://bscscan.com';
    return `${base}/address/${address}`;
};

// Listen for account/chain changes
export const setupWalletListeners = (
    onAccountChange: (accounts: string[]) => void,
    onChainChange: (chainId: string) => void
) => {
    if (!isMetaMaskInstalled()) return;

    const handleAccounts = (...args: unknown[]) => onAccountChange(args[0] as string[]);
    const handleChain = (...args: unknown[]) => onChainChange(args[0] as string);

    window.ethereum.on('accountsChanged', handleAccounts);
    window.ethereum.on('chainChanged', handleChain);

    // Return cleanup function
    return () => {
        window.ethereum.removeListener('accountsChanged', handleAccounts);
        window.ethereum.removeListener('chainChanged', handleChain);
    };
};

// Declare window.ethereum type
declare global {
    interface Window {
        ethereum: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            on: (event: string, handler: (...args: unknown[]) => void) => void;
            removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
            isMetaMask?: boolean;
        };
    }
}
