import { useGameStore } from '../game/store';

export const FairnessPanel = () => {
  const seeds = useGameStore((state) => state.seeds);
  const status = useGameStore((state) => state.status);
  const resetFairness = useGameStore((state) => state.resetFairness);

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
      <h2 className="text-xl font-semibold gradient-text">Fairness & Replay</h2>
      <p className="text-casino-200">
        Each run uses a server seed and client seed to generate a combined hash. Dice rolls and tile events are
        derived from the combined seed using deterministic RNG. At the end of a run you can replay the sequence
        to verify the outcomes.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Combined Hash</p>
          <p className="text-sm text-casino-300 break-all">{seeds?.combinedHash ?? '—'}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Run Status</p>
          <p className="text-sm text-casino-300">{status}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Server Seed</p>
          <p className="text-sm text-casino-300 break-all">{status === 'running' ? 'hidden until run ends' : seeds?.serverSeed ?? '—'}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Client Seed</p>
          <p className="text-sm text-casino-300 break-all">{status === 'running' ? 'hidden until run ends' : seeds?.clientSeed ?? '—'}</p>
        </div>
      </div>
      <button
        className="glow-button px-4 py-2 rounded-xl border border-neon-pink text-neon-pink"
        onClick={resetFairness}
      >
        Reset fairness seeds
      </button>
    </div>
  );
};
