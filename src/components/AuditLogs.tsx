import { motion } from 'framer-motion';
import { FileJson, FileText, ExternalLink, Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  type: 'json' | 'pdf';
  title: string;
  timestamp: string;
  verified: boolean;
  hash: string;
}

interface AuditLogsProps {
  logs: AuditLog[];
}

export function AuditLogs({ logs }: AuditLogsProps) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className={`p-2 rounded-lg ${log.type === 'json' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-cortensor-orange/10 text-cortensor-orange'}`}>
            {log.type === 'json' ? <FileJson className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm truncate">{log.title}</span>
              {log.verified && (
                <Shield className="w-3 h-3 text-success-green shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{log.timestamp}</span>
              <span className="font-mono">{log.hash.slice(0, 12)}...</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}

      {logs.length === 0 && (
        <div className="text-center py-6 text-gray-600 font-mono text-sm">
          No audit logs yet
        </div>
      )}
    </div>
  );
}

export type { AuditLog };
