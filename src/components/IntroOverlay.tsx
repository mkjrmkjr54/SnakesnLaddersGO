import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../game/store';

export const IntroOverlay = () => {
  const introVisible = useGameStore((state) => state.introVisible);
  const dismissIntro = useGameStore((state) => state.dismissIntro);

  useEffect(() => {
    if (!introVisible) return;
    const timer = setTimeout(() => dismissIntro(), 1800);
    return () => clearTimeout(timer);
  }, [introVisible, dismissIntro]);

  return (
    <AnimatePresence>
      {introVisible && (
        <motion.div
          className="fixed inset-0 bg-casino-950 flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.6em] text-casino-200">Table opens</p>
            <h1 className="text-4xl font-semibold gradient-text mt-3">Dice Ladder Casino</h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
