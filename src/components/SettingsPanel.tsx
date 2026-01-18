import { useGameStore } from '../game/store';

export const SettingsPanel = () => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const reducedMotion = useGameStore((state) => state.reducedMotion);
  const setSoundEnabled = useGameStore((state) => state.setSoundEnabled);
  const setReducedMotion = useGameStore((state) => state.setReducedMotion);
  const resetBankroll = useGameStore((state) => state.resetBankroll);

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
      <h2 className="text-xl font-semibold gradient-text">Settings</h2>
      <div className="flex items-center justify-between glass-panel rounded-2xl p-4">
        <div>
          <p className="font-semibold">Sound</p>
          <p className="text-sm text-casino-200">Toggle dice, ladder, and cashout audio.</p>
        </div>
        <button
          className={`px-4 py-2 rounded-xl ${soundEnabled ? 'bg-neon-blue text-casino-950' : 'bg-casino-800 text-casino-200'}`}
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? 'On' : 'Off'}
        </button>
      </div>
      <div className="flex items-center justify-between glass-panel rounded-2xl p-4">
        <div>
          <p className="font-semibold">Reduced Motion</p>
          <p className="text-sm text-casino-200">Override animations for a calmer experience.</p>
        </div>
        <button
          className={`px-4 py-2 rounded-xl ${reducedMotion ? 'bg-neon-pink text-casino-950' : 'bg-casino-800 text-casino-200'}`}
          onClick={() => setReducedMotion(!reducedMotion)}
        >
          {reducedMotion ? 'On' : 'Off'}
        </button>
      </div>
      <div className="flex items-center justify-between glass-panel rounded-2xl p-4">
        <div>
          <p className="font-semibold">Reset Bankroll</p>
          <p className="text-sm text-casino-200">Restore default 10,000 chips.</p>
        </div>
        <button
          className="px-4 py-2 rounded-xl border border-neon-gold text-neon-gold"
          onClick={resetBankroll}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
