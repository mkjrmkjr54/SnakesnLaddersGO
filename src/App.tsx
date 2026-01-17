import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Board } from './components/Board';
import { EventFeed } from './components/EventFeed';
import { IntroOverlay } from './components/IntroOverlay';
import { ResultModal } from './components/ResultModal';
import { RightPanel } from './components/RightPanel';
import { TopBar } from './components/TopBar';
import { FairnessPanel } from './components/FairnessPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { HowToPlay } from './components/HowToPlay';
import { useSound } from './components/useSound';
import { useGameStore } from './game/store';

const tabs = ['Play', 'How to Play', 'Fairness', 'Settings'] as const;

type Tab = (typeof tabs)[number];

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Play');
  const claimDailyBonus = useGameStore((state) => state.claimDailyBonus);
  const status = useGameStore((state) => state.status);
  const actions = useGameStore((state) => state.actions);
  const reducedMotionSetting = useGameStore((state) => state.reducedMotion);
  const { playSound } = useSound();
  const prefersReducedMotion = useReducedMotion();

  const reducedMotion = useMemo(() => reducedMotionSetting || prefersReducedMotion, [prefersReducedMotion, reducedMotionSetting]);

  useEffect(() => {
    if (actions.length === 0) return;
    const lastAction = actions[actions.length - 1];
    if (lastAction.event === 'ladder') playSound('ladder');
    if (lastAction.event === 'snake') playSound('snake');
    if (lastAction.to === 100) playSound('win');
  }, [actions, playSound]);

  useEffect(() => {
    if (status === 'lost') playSound('snake');
  }, [status, playSound]);

  return (
    <div className="min-h-screen text-white font-display">
      <IntroOverlay />
      <ResultModal />
      <div className="relative px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold gradient-text">Dice Ladder Casino</h1>
            <p className="text-casino-200">Premium play-money dice progression table.</p>
          </div>
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full border ${
                  activeTab === tab ? 'border-neon-blue text-neon-blue' : 'border-white/10 text-casino-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-full border border-neon-gold text-neon-gold"
              onClick={claimDailyBonus}
            >
              Daily Chips +5000
            </button>
          </div>
        </div>
        {activeTab === 'Play' && (
          <motion.div
            className="space-y-6"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          >
            <TopBar />
            <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
              <div className="space-y-6">
                <Board />
                <EventFeed />
              </div>
              <RightPanel />
            </div>
          </motion.div>
        )}
        {activeTab === 'How to Play' && <HowToPlay />}
        {activeTab === 'Fairness' && <FairnessPanel />}
        {activeTab === 'Settings' && <SettingsPanel />}
        <div className="mt-8 text-xs text-casino-400">
          Play money only. No real currency, deposits, or cashout.
        </div>
      </div>
    </div>
  );
};

export default App;
