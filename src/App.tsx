import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Wallet, FileText, Gauge } from 'lucide-react';

import { Header } from './components/Header';
import { Panel } from './components/Panel';
import { StatusOrb } from './components/StatusOrb';
import { TerminalStream, LogEntry } from './components/TerminalStream';
import { PromptInput } from './components/PromptInput';
import NodeGraph3D from './components/NodeGraph3D';
import { TaskQueue, Task } from './components/TaskQueue';
import { ValidationRubric, Agent } from './components/ValidationRubric';
import { WalletConnect } from './components/WalletConnect';
import { TreasuryWatch } from './components/TreasuryWatch';
import { AuditLogs, AuditLog } from './components/AuditLogs';
import { OverrideButton } from './components/OverrideButton';

// AI Consciousness & React Logic
import { generateAIThought, analyzeCommand } from './services/groqClient';
import { CortensorNetwork } from './services/cortensorClient';

const initialTasks: Task[] = [
  { id: 'TSK-001', delegatedTo: 'Node #42', status: 'verified', poiHash: '0x7f3c9a8b2e1d4f5c6a7b8d9e0f1a2b3c4d5e6f7a', taskType: 'Contract Audit' },
  { id: 'TSK-002', delegatedTo: 'Node #18', status: 'processing', poiHash: '0x2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', taskType: 'Price Analysis' },
  { id: 'TSK-003', delegatedTo: 'Node #73', status: 'pending', poiHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d', taskType: 'Yield Calc' },
];

const initialAgents: Agent[] = [
  { name: 'Security Validator', score: 94, status: 'agreed', argument: 'Contract bytecode verified. No reentrancy vulnerabilities detected.' },
  { name: 'Risk Assessor', score: 78, status: 'agreed', argument: 'Moderate risk level. Liquidity depth is sufficient for proposed transaction.' },
  { name: 'Yield Optimizer', score: 85, status: 'disputed', argument: 'Higher APY available on Venus Protocol, recommend reallocation.' },
];

const initialAuditLogs: AuditLog[] = [
  { id: 'AUD-001', type: 'json', title: 'Contract Audit - LP-BNB/CAKE', timestamp: '2 min ago', verified: true, hash: '0x7f3c9a8b2e1d4f5c6a7b8d9e0f1a2b3c' },
  { id: 'AUD-002', type: 'pdf', title: 'Yield Strategy Report', timestamp: '15 min ago', verified: true, hash: '0x2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' },
  { id: 'AUD-003', type: 'json', title: 'Price Analysis - BNB/USDT', timestamp: '1 hour ago', verified: true, hash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b' },
];

export function App() {
  const [status, setStatus] = useState<'idle' | 'thinking' | 'delegating'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, text: "System Initialized. OMNI-CORE v1.0.0 Online.", type: 'system', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [agents] = useState<Agent[]>(initialAgents);
  const [auditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Live Consciousness Stream - Real AI
  useEffect(() => {
    // Initial thought
    const sparkConsciousness = async () => {
      const thought = await generateAIThought(["System reboot complete. Status report?"]);
      addLog(thought.text, thought.type);
    };
    sparkConsciousness();

    // Periodic "Idle" thoughts (every 10-15 seconds) to save tokens but keep it alive
    const interval = setInterval(async () => {
      if (status === 'idle') {
        const randomContext = [
          "Scan the blockchain for arbitrage opportunities.",
          "Check Cortensor node health.",
          "Analyze gas price trends on BSC.",
          "Reviewing smart contract security protocols.",
          "Monitoring liquidity pool depth."
        ];
        const ctx = randomContext[Math.floor(Math.random() * randomContext.length)];
        const thought = await generateAIThought([`Current status: Idle. Context: ${ctx}`]);
        addLog(thought.text, thought.type);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [status]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev.slice(-19), {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }]);
  };

  // Handle user command with Real AI & Phase 3 Delegation
  const handleCommand = useCallback(async (message: string) => {
    setStatus('thinking');
    addLog(`USER COMMAND: "${message}"`, 'system');

    // 1. Analyze Command (Phase 2)
    const analysis = await analyzeCommand(message);

    let thought = "Processing request...";
    let taskType = "General";

    try {
      const parsed = JSON.parse(analysis.text);
      thought = parsed.thought;
      taskType = parsed.taskType;
      addLog(thought, 'info');
    } catch (e) {
      addLog(analysis.text, 'info'); // Fallback if not JSON
    }

    setStatus('delegating');

    // 2. Select Optimial Node (Phase 3)
    const targetNode = await CortensorNetwork.selectOptimalNode(taskType);
    addLog(`Delegating task [${taskType}] to ${targetNode.id} (${targetNode.specialization})`, 'warning');

    const newTaskId = `TSK-${String(tasks.length + 1).padStart(3, '0')}`;

    // 3. Create Pending Task
    const newTask: Task = {
      id: newTaskId,
      delegatedTo: targetNode.id,
      status: 'pending',
      poiHash: 'Waiting for Proof...',
      taskType: taskType,
    };
    setTasks(prev => [newTask, ...prev]);

    // 4. Simulate Cortensor Processing & PoI Generation
    setTimeout(async () => {
      setTasks(prev => prev.map(t => t.id === newTaskId ? { ...t, status: 'processing' } : t));

      const poi = await CortensorNetwork.generatePoI(newTaskId, targetNode.id);

      setTasks(prev => prev.map(t => t.id === newTaskId ? {
        ...t,
        status: 'verified',
        poiHash: poi.hash
      } : t));

      addLog(`Proof of Inference Verified: ${poi.hash.slice(0, 12)}...`, 'success');
      setStatus('idle');
    }, 3000);

  }, [tasks.length]);

  // Handle override
  const handleOverride = () => {
    const overrideLog: LogEntry = {
      id: Date.now(),
      text: 'HUMAN OVERRIDE ACTIVATED. All operations halted. Control transferred.',
      type: 'error',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setLogs(prev => [...prev, overrideLog]);
    setStatus('idle');
    setTasks(prev => prev.map(t => ({ ...t, status: 'failed' as const })));
  };

  return (
    <div className="min-h-screen bg-void-black text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main Content - 3 Panel Layout */}
        <main className="flex-1 p-4 grid grid-cols-12 gap-4">

          {/* LEFT PANEL: Consciousness Stream */}
          <motion.div
            className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-[600px] lg:h-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Panel
              title="The Consciousness Stream"
              subtitle="Powered by Groq"
              icon={<Brain className="w-5 h-5" />}
              variant="cyan"
              className="flex-1 flex flex-col"
            >
              <div className="p-4 border-b border-neon-cyan/20">
                <StatusOrb status={status} />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <TerminalStream logs={logs} />
              </div>
              <PromptInput onSubmit={handleCommand} disabled={status === 'thinking'} />
            </Panel>
          </motion.div>

          {/* CENTER PANEL: Delegation Matrix */}
          <motion.div
            className="col-span-12 lg:col-span-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Panel
              title="The Delegation Matrix"
              subtitle="Cortensor Network Visualization"
              icon={<Network className="w-5 h-5" />}
              variant="purple"
            >
              <NodeGraph3D />
            </Panel>

            <Panel
              title="Live Task Queue"
              subtitle="Cortensor Delegations"
              icon={<Gauge className="w-5 h-5" />}
              variant="purple"
              className="flex-1 overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                <TaskQueue tasks={tasks} />
              </div>
            </Panel>

            <Panel
              title="Validation Rubric"
              subtitle="Multi-Agent Consensus"
              icon={<FileText className="w-5 h-5" />}
              variant="purple"
            >
              <ValidationRubric agents={agents} consensus={86} />
            </Panel>
          </motion.div>

          {/* RIGHT PANEL: Action & Memory Hub */}
          <motion.div
            className="col-span-12 lg:col-span-3 flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Panel
              title="Web3 Connection"
              icon={<Wallet className="w-5 h-5" />}
            >
              <div className="p-4">
                <WalletConnect />
              </div>
            </Panel>

            <Panel
              title="Treasury Watch"
              subtitle="Portfolio & Guarded Contracts"
              className="flex-1 overflow-hidden"
            >
              <div className="p-4 flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neon-cyan/20 scrollbar-track-transparent">
                <TreasuryWatch />
              </div>
            </Panel>

            <Panel
              title="Audit & Receipt Logs"
              subtitle="Verified by Cortensor"
              icon={<FileText className="w-5 h-5" />}
            >
              <div className="p-4">
                <AuditLogs logs={auditLogs} />
              </div>
            </Panel>

            <div className="mt-auto">
              <OverrideButton onOverride={handleOverride} />
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="glass border-t border-white/5 px-6 py-3 flex items-center justify-between text-xs text-gray-600 font-mono">
          <div className="flex items-center gap-4">
            <span>OMNI-CORE v1.0.0-beta</span>
            <span className="text-gray-700">|</span>
            <span>Hackathon #4 Build</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Groq Latency: <span className="text-neon-cyan">42ms</span></span>
            <span className="text-gray-700">|</span>
            <span>Cortensor Nodes: <span className="text-cortensor-purple">127 active</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
