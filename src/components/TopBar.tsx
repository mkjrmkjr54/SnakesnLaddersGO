import { motion } from 'framer-motion';
import { formatMultiplier } from '../game/multiplier';
import { useGameStore } from '../game/store';

const formatMoney = (value: number) => value.toLocaleString();

export const TopBar = () => {
  const bankroll = useGameStore((state) => state.bankroll);
  const runStake = useGameStore((state) => state.runStake);
  const multiplier = useGameStore((state) => state.multiplier);
  const risk = useGameStore((state) => state.risk);

  return (
    <div className="glass-panel neon-border rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Bankroll</p>
        <motion.p className="text-2xl font-semibold" layout>{formatMoney(bankroll)} <span className="text-sm text-casino-200">chips</span></motion.p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Run Stake</p>
        <p className="text-2xl font-semibold">{formatMoney(runStake || 0)}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Multiplier</p>
        <p className="text-2xl font-semibold gradient-text">{formatMultiplier(multiplier)}</p>
      </div>
      <div className="px-4 py-2 rounded-full bg-casino-800/70 border border-neon-pink/30">
        <p className="text-xs uppercase tracking-[0.3em] text-neon-pink">Risk</p>
        <p className="text-lg font-semibold">{risk}</p>
      </div>
    </div>
  );
};
