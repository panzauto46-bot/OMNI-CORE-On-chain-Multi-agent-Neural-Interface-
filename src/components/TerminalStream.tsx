import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  timestamp: string;
}

const typeColors = {
  info: 'text-neon-cyan',
  success: 'text-success-green',
  warning: 'text-warning-yellow',
  error: 'text-danger-red',
  system: 'text-cortensor-purple',
};

const typeLabels = {
  info: '[INFO]',
  success: '[OK]',
  warning: '[WARN]',
  error: '[ERR]',
  system: '[SYS]',
};

interface TerminalStreamProps {
  logs: LogEntry[];
}

export function TerminalStream({ logs }: TerminalStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayedLogs, setDisplayedLogs] = useState<(LogEntry & { displayedText: string })[]>([]);

  useEffect(() => {
    const lastLog = logs[logs.length - 1];
    if (!lastLog) return;

    const existingLog = displayedLogs.find(l => l.id === lastLog.id);
    if (existingLog) return;

    // Add new log with typewriter effect
    let currentText = '';
    const fullText = lastLog.text;
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        currentText += fullText[charIndex];
        setDisplayedLogs(prev => {
          const existing = prev.find(l => l.id === lastLog.id);
          if (existing) {
            return prev.map(l =>
              l.id === lastLog.id ? { ...l, displayedText: currentText } : l
            );
          }
          return [...prev.slice(-50), { ...lastLog, displayedText: currentText }];
        });
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [logs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  return (
    <div
      ref={scrollRef}
      className="h-[400px] overflow-y-auto font-mono text-sm p-4 space-y-2 scrollbar-thin scrollbar-thumb-neon-cyan/20 scrollbar-track-transparent"
    >
      <AnimatePresence>
        {displayedLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <span className="text-gray-600 shrink-0">{log.timestamp}</span>
            <span className={`${typeColors[log.type]} shrink-0`}>
              {typeLabels[log.type]}
            </span>
            <span className="text-gray-300">{log.displayedText}</span>
            <motion.span
              className="text-neon-cyan"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ▌
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
      {displayedLogs.length === 0 && (
        <div className="text-gray-600 flex items-center gap-2">
          <span>OMNI-CORE v1.0.0 initialized</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-neon-cyan"
          >
            ▌
          </motion.span>
        </div>
      )}
    </div>
  );
}

export type { LogEntry };
