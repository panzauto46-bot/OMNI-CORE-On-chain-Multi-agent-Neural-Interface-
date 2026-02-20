import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Hand, X } from 'lucide-react';

interface OverrideButtonProps {
  onOverride: () => void;
}

export function OverrideButton({ onOverride }: OverrideButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);

  const handleOverride = () => {
    setIsOverriding(true);
    setTimeout(() => {
      onOverride();
      setIsOverriding(false);
      setShowConfirm(false);
    }, 2000);
  };

  return (
    <>
      <motion.button
        onClick={() => setShowConfirm(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 px-6 rounded-xl bg-danger-red/10 border-2 border-danger-red text-danger-red font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-danger-red/20 transition-colors glow-red"
      >
        <Hand className="w-5 h-5" />
        Human Override
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-void-gray border border-danger-red/50 rounded-2xl p-6 max-w-md mx-4 relative glow-red"
            >
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-danger-red/20">
                  <AlertTriangle className="w-8 h-8 text-danger-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Human Override</h3>
                  <p className="text-gray-500 text-sm">Emergency Control Transfer</p>
                </div>
              </div>

              <p className="text-gray-400 mb-6">
                This will immediately halt all OMNI-CORE operations and transfer full control to you. 
                All pending Cortensor delegations will be cancelled.
              </p>

              <div className="space-y-3">
                <motion.button
                  onClick={handleOverride}
                  disabled={isOverriding}
                  whileHover={{ scale: isOverriding ? 1 : 1.02 }}
                  whileTap={{ scale: isOverriding ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl bg-danger-red text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isOverriding ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Taking Control...
                    </>
                  ) : (
                    <>
                      <Hand className="w-5 h-5" />
                      Confirm Override
                    </>
                  )}
                </motion.button>
                
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 rounded-xl bg-gray-800 text-gray-400 font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
