import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../game/store';
import { formatMultiplier } from '../game/multiplier';
import { MoneyBurst } from './MoneyBurst';

const formatMoney = (value: number) => value.toLocaleString();

export const ResultModal = () => {
  const { modal, closeModal, runStake, multiplier, bankroll, replayLastRun } = useGameStore();

  return (
    <AnimatePresence>
      {modal.type && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative glass-panel neon-border rounded-3xl p-8 w-[90%] max-w-lg text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {modal.type === 'win' && <MoneyBurst />}
            <h2 className="text-2xl font-semibold mb-2 gradient-text">{modal.title}</h2>
            <p className="text-casino-200 mb-4">{modal.message}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-casino-200 mb-6">
              <div className="glass-panel rounded-xl p-3">
                <p className="uppercase tracking-[0.2em] text-xs text-casino-300">Stake</p>
                <p className="text-lg font-semibold text-white">{formatMoney(runStake)}</p>
              </div>
              <div className="glass-panel rounded-xl p-3">
                <p className="uppercase tracking-[0.2em] text-xs text-casino-300">Multiplier</p>
                <p className="text-lg font-semibold text-neon-gold">{formatMultiplier(multiplier)}</p>
              </div>
              <div className="glass-panel rounded-xl p-3">
                <p className="uppercase tracking-[0.2em] text-xs text-casino-300">Winnings</p>
                <p className="text-lg font-semibold text-white">{formatMoney(modal.winnings ?? 0)}</p>
              </div>
              <div className="glass-panel rounded-xl p-3">
                <p className="uppercase tracking-[0.2em] text-xs text-casino-300">Bankroll</p>
                <p className="text-lg font-semibold text-white">{formatMoney(bankroll)}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                className="glow-button px-5 py-3 rounded-xl bg-neon-gold/80 text-casino-950 font-semibold"
                onClick={closeModal}
              >
                Play Again
              </button>
              <button
                className="glow-button px-5 py-3 rounded-xl border border-neon-blue text-neon-blue"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Dice Ladder Casino: Stake ${runStake}, ${formatMultiplier(multiplier)} payout, winnings ${formatMoney(modal.winnings ?? 0)}.`
                  );
                }}
              >
                Share
              </button>
              <button
                className="glow-button px-5 py-3 rounded-xl border border-neon-pink text-neon-pink"
                onClick={replayLastRun}
              >
                Replay Last Run
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
