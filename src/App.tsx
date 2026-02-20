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

// AI Consciousness thoughts simulation
const aiThoughts = [
  { text: "Initializing neural pathways... Connection established.", type: "system" as const },
  { text: "Scanning BNB Smart Chain for active liquidity pools...", type: "info" as const },
  { text: "Detected 247 pools with TVL > $100k. Analyzing volatility patterns.", type: "info" as const },
  { text: "Anomaly detected in PancakeSwap BNB/USDT pool. Price deviation: 0.3%", type: "warning" as const },
  { text: "Delegating smart contract validation to Cortensor Network...", type: "system" as const },
  { text: "Cortensor Node #42 accepted task. Awaiting Proof of Inference.", type: "info" as const },
  { text: "PoI validated. Contract security score: 94/100. Proceeding.", type: "success" as const },
  { text: "Calculating optimal yield strategy for current portfolio allocation.", type: "info" as const },
  { text: "Recommended action: Reallocate 15% from CAKE staking to BNB-USDT LP.", type: "info" as const },
  { text: "Awaiting human confirmation for transaction execution.", type: "system" as const },
];

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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [agents] = useState<Agent[]>(initialAgents);
  const [auditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [logIndex, setLogIndex] = useState(0);

  // Simulate AI consciousness stream
  useEffect(() => {
    const interval = setInterval(() => {
      if (logIndex < aiThoughts.length) {
        const thought = aiThoughts[logIndex];
        const newLog: LogEntry = {
          id: Date.now(),
          text: thought.text,
          type: thought.type,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        };
        
        setLogs(prev => [...prev, newLog]);
        setLogIndex(prev => prev + 1);

        // Update status based on thought type
        if (thought.type === 'system' && thought.text.includes('Delegating')) {
          setStatus('delegating');
        } else if (thought.type === 'info') {
          setStatus('thinking');
        } else if (thought.type === 'success') {
          setStatus('idle');
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [logIndex]);

  // Handle user command
  const handleCommand = useCallback((message: string) => {
    setStatus('thinking');
    
    const userLog: LogEntry = {
      id: Date.now(),
      text: `USER COMMAND: "${message}"`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setLogs(prev => [...prev, userLog]);

    // Simulate AI processing
    setTimeout(() => {
      const responseLog: LogEntry = {
        id: Date.now() + 1,
        text: `Processing request... Analyzing "${message.slice(0, 30)}..."`,
        type: 'info',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };
      setLogs(prev => [...prev, responseLog]);
      setStatus('delegating');

      // Add new task
      const newTask: Task = {
        id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
        delegatedTo: `Node #${Math.floor(Math.random() * 100)}`,
        status: 'processing',
        poiHash: `0x${Math.random().toString(16).slice(2, 34)}`,
        taskType: 'User Request',
      };
      setTasks(prev => [newTask, ...prev]);

      setTimeout(() => {
        setStatus('idle');
        const doneLog: LogEntry = {
          id: Date.now() + 2,
          text: `Task delegated successfully. Awaiting Cortensor validation.`,
          type: 'success',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        };
        setLogs(prev => [...prev, doneLog]);
      }, 2000);
    }, 1500);
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
      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        
        {/* Main Content - 3 Panel Layout */}
        <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
          
          {/* LEFT PANEL: Consciousness Stream */}
          <motion.div 
            className="col-span-12 lg:col-span-4 flex flex-col gap-4"
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
              <div className="p-4 max-h-80 overflow-y-auto">
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
