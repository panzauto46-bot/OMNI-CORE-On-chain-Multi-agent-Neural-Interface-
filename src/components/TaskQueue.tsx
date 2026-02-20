import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

interface Task {
  id: string;
  delegatedTo: string;
  status: 'pending' | 'verified' | 'failed' | 'processing';
  poiHash: string;
  taskType: string;
}

interface TaskQueueProps {
  tasks: Task[];
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-warning-yellow',
    bgColor: 'bg-warning-yellow/10',
    label: 'Pending',
  },
  processing: {
    icon: Loader2,
    color: 'text-neon-cyan',
    bgColor: 'bg-neon-cyan/10',
    label: 'Processing',
  },
  verified: {
    icon: CheckCircle,
    color: 'text-success-green',
    bgColor: 'bg-success-green/10',
    label: 'Verified',
  },
  failed: {
    icon: XCircle,
    color: 'text-danger-red',
    bgColor: 'bg-danger-red/10',
    label: 'Failed',
  },
};

export function TaskQueue({ tasks }: TaskQueueProps) {
  return (
    <div className="overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-cortensor-purple/20 scrollbar-track-transparent">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="text-left py-2 px-3">Task ID</th>
            <th className="text-left py-2 px-3">Type</th>
            <th className="text-left py-2 px-3">Node</th>
            <th className="text-left py-2 px-3">Status</th>
            <th className="text-left py-2 px-3">PoI Hash</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const config = statusConfig[task.status];
            const Icon = config.icon;

            return (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t border-gray-800 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-3 text-gray-400">
                  {task.id}
                </td>
                <td className="py-3 px-3 text-cortensor-purple">
                  {task.taskType}
                </td>
                <td className="py-3 px-3 text-gray-400">
                  {task.delegatedTo}
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                    <Icon className={`w-3 h-3 ${task.status === 'processing' ? 'animate-spin' : ''}`} />
                    {config.label}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-600 text-xs">
                  {task.poiHash.slice(0, 20)}...
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-600 font-mono">
          No tasks delegated yet
        </div>
      )}
    </div>
  );
}

export type { Task };
