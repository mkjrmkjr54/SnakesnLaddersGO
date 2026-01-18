import { motion } from 'framer-motion';
import { MAX_POSITION } from '../game/config';
import { useGameStore } from '../game/store';

const tiles = Array.from({ length: MAX_POSITION + 1 }, (_, index) => index);

export const Board = () => {
  const position = useGameStore((state) => state.position);
  const status = useGameStore((state) => state.status);
  const progress = (position / MAX_POSITION) * 100;

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 animate-shimmer bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Board</p>
            <p className="text-lg font-semibold">0 → 100 Progress Track</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Grand Prize</p>
            <p className="text-lg font-semibold text-neon-gold">100</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-casino-800 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-gold"
            style={{ width: `${progress}%` }}
            layout
          />
        </div>
        <div className="grid grid-cols-10 gap-2 tile-grid">
          {tiles.map((tile) => {
            const isActive = tile === position;
            return (
              <motion.div
                key={tile}
                className={`relative rounded-xl border border-white/10 p-2 h-12 flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? 'bg-neon-blue/20 border-neon-blue text-white shadow-neon'
                    : 'bg-casino-900/70 text-casino-200'
                }`}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
              >
                {tile}
                {isActive && (
                  <motion.span
                    className="absolute -top-2 right-2 text-neon-gold"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ●
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-casino-200">
          {status === 'running' ? 'Token in play.' : 'Start a run to begin the climb.'}
        </div>
      </div>
    </div>
  );
};
