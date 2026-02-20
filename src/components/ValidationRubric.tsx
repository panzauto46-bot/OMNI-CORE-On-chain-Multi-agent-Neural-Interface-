import { motion } from 'framer-motion';
import { Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface Agent {
  name: string;
  score: number;
  status: 'agreed' | 'disputed';
  argument: string;
}

interface ValidationRubricProps {
  agents: Agent[];
  consensus: number;
}

export function ValidationRubric({ agents, consensus }: ValidationRubricProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Consensus Meter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Network Consensus</span>
          <span className={`text-sm font-mono ${consensus >= 80 ? 'text-success-green' : consensus >= 50 ? 'text-warning-yellow' : 'text-danger-red'}`}>
            {consensus}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${consensus >= 80 ? 'bg-success-green' : consensus >= 50 ? 'bg-warning-yellow' : 'bg-danger-red'}`}
            initial={{ width: 0 }}
            animate={{ width: `${consensus}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Agent Votes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <Users className="w-3 h-3" />
          Validator Agents
        </div>
        
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${agent.status === 'agreed' ? 'bg-success-green/20' : 'bg-danger-red/20'} flex items-center justify-center`}>
                  {agent.status === 'agreed' ? (
                    <CheckCircle2 className="w-4 h-4 text-success-green" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-danger-red" />
                  )}
                </div>
                <span className="text-white text-sm font-medium">{agent.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-4 rounded-full ${i <= Math.ceil(agent.score / 20) ? 'bg-cortensor-purple' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-cortensor-purple">{agent.score}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">"{agent.argument}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export type { Agent };
