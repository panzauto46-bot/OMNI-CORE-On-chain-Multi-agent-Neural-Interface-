// Simulated Cortensor Network Client
// In a real dApp, this would connect to the Cortensor decentralized network nodes.

export interface NetworkNode {
    id: string;
    type: 'validator' | 'worker';
    reputation: number; // 0-100
    status: 'idle' | 'busy' | 'offline';
    specialization: 'Security' | 'Yield' | 'Audit' | 'General';
}

export interface ProofOfInference {
    taskId: string;
    nodeId: string;
    hash: string;
    timestamp: number;
    score: number;
}

// Mock Active Nodes
const MOCK_NODES: NetworkNode[] = [
    { id: 'Node #42', type: 'validator', reputation: 98, status: 'idle', specialization: 'Security' },
    { id: 'Node #18', type: 'worker', reputation: 85, status: 'busy', specialization: 'Yield' },
    { id: 'Node #73', type: 'worker', reputation: 92, status: 'idle', specialization: 'Audit' },
    { id: 'Node #09', type: 'validator', reputation: 99, status: 'idle', specialization: 'General' },
    { id: 'Node #55', type: 'worker', reputation: 78, status: 'offline', specialization: 'Yield' },
];

export const CortensorNetwork = {
    // Select the best node for a specific task type
    selectOptimalNode: async (taskType: string): Promise<NetworkNode> => {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Priority 1: Find specialist nodes that match the exact task type
        const specialists = MOCK_NODES.filter(n =>
            n.status !== 'offline' &&
            n.specialization === taskType
        );

        if (specialists.length > 0) {
            // Pick highest reputation specialist
            return specialists.sort((a, b) => b.reputation - a.reputation)[0];
        }

        // Priority 2: Fallback to General-purpose nodes
        const generalNodes = MOCK_NODES.filter(n =>
            n.status !== 'offline' &&
            n.specialization === 'General'
        );

        return generalNodes.length > 0
            ? generalNodes[0]
            : MOCK_NODES[0];
    },

    // Generate a cryptographically styled Proof of Inference
    generatePoI: async (taskId: string, nodeId: string): Promise<ProofOfInference> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate hash generation
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)];

        return {
            taskId,
            nodeId,
            hash,
            timestamp: Date.now(),
            score: Math.floor(Math.random() * (100 - 85) + 85) // Random score 85-100
        };
    },

    // Get network status
    getNetworkStats: () => {
        return {
            activeNodes: 127,
            totalStaked: '$4.2M',
            dailyInference: 14592
        };
    }
};
