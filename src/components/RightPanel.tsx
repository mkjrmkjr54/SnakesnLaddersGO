import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { RISK_PRESETS, STAKE_PRESETS } from '../game/config';
import { formatMultiplier } from '../game/multiplier';
import { useGameStore } from '../game/store';
import { useSound } from './useSound';

const formatMoney = (value: number) => value.toLocaleString();

export const RightPanel = () => {
  const {
    stake,
    setStake,
    risk,
    riskPreset,
    setRisk,
    setRiskPreset,
    status,
    rollDice,
    cashOut,
    startRun,
    lastRoll,
    multiplier,
    seeds,
    runStake,
    replayMode
  } = useGameStore();
  const [customStake, setCustomStake] = useState(stake.toString());
  const { playSound } = useSound();

  const diceFaces = useMemo(() => ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'], []);
  const canRoll = status === 'running' && !replayMode;

  const handleStart = () => {
    startRun();
    playSound('roll');
  };

  const handleRoll = () => {
    rollDice();
    playSound('roll');
  };

  const handleCashOut = () => {
    cashOut();
    playSound('cash');
  };

  const handleStakeChange = (value: string) => {
    setCustomStake(value);
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      setStake(numeric);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Dice</p>
          <p className="text-lg font-semibold">Roll to advance</p>
        </div>
        <motion.div
          className="w-16 h-16 rounded-2xl bg-casino-800/80 border border-neon-blue/30 flex items-center justify-center text-3xl"
          animate={{ rotate: canRoll ? [0, 15, -10, 0] : 0 }}
          transition={{ duration: 0.6 }}
        >
          {lastRoll ? diceFaces[lastRoll - 1] : '🎲'}
        </motion.div>
      </div>
      <div className="flex gap-3">
        <button
          className="glow-button flex-1 bg-neon-blue/80 text-casino-950 font-semibold py-3 rounded-xl disabled:opacity-50"
          onClick={handleRoll}
          disabled={!canRoll}
        >
          Roll Dice
        </button>
        <button
          className="glow-button flex-1 bg-neon-gold/80 text-casino-950 font-semibold py-3 rounded-xl disabled:opacity-50"
          onClick={handleCashOut}
          disabled={status !== 'running' || replayMode}
        >
          Cash Out
        </button>
      </div>
      <div className="glass-panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Stake</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {STAKE_PRESETS.map((value) => (
            <button
              key={value}
              className={`px-3 py-2 rounded-lg border ${
                stake === value ? 'border-neon-gold text-neon-gold' : 'border-white/10 text-casino-200'
              }`}
              onClick={() => {
                setStake(value);
                setCustomStake(value.toString());
              }}
            >
              {value}
            </button>
          ))}
          <input
            className="flex-1 min-w-[80px] bg-casino-900/70 border border-white/10 rounded-lg px-3 py-2 text-sm"
            value={customStake}
            onChange={(event) => handleStakeChange(event.target.value)}
            type="number"
            min={10}
            max={5000}
          />
        </div>
        <button
          className="mt-4 w-full bg-neon-pink/80 text-casino-950 font-semibold py-3 rounded-xl glow-button"
          onClick={handleStart}
          disabled={status === 'running'}
        >
          {status === 'running' ? 'Run Active' : 'Start Run'}
        </button>
      </div>
      <div className="glass-panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Risk</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(Object.keys(RISK_PRESETS) as Array<keyof typeof RISK_PRESETS>).filter((preset) => preset !== 'Custom').map((preset) => (
            <button
              key={preset}
              className={`px-3 py-2 rounded-lg border ${
                riskPreset === preset ? 'border-neon-blue text-neon-blue' : 'border-white/10 text-casino-200'
              }`}
              onClick={() => setRiskPreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          className="mt-4 w-full"
          type="range"
          min={0}
          max={100}
          value={risk}
          onChange={(event) => setRisk(Number(event.target.value))}
        />
        <div className="flex justify-between text-xs text-casino-200">
          <span>Safe</span>
          <span>Insane</span>
        </div>
      </div>
      <div className="glass-panel rounded-2xl p-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Run Status</p>
        <p className="text-sm text-casino-200">Stake locked: {formatMoney(runStake)} chips</p>
        <p className="text-sm">Current multiplier: <span className="text-neon-gold">{formatMultiplier(multiplier)}</span></p>
        <p className="text-xs text-casino-300">Grand Prize at 100</p>
      </div>
      <div className="glass-panel rounded-2xl p-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-casino-200">Fairness Snapshot</p>
        <p className="text-xs text-casino-300">Combined hash: {seeds?.combinedHash ?? '—'}</p>
        <p className="text-xs text-casino-300">Server seed: {status === 'running' ? 'hidden until run ends' : seeds?.serverSeed ?? '—'}</p>
        <p className="text-xs text-casino-300">Client seed: {status === 'running' ? 'hidden until run ends' : seeds?.clientSeed ?? '—'}</p>
      </div>
    </div>
  );
};
