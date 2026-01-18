import { create } from 'zustand';
import { MAX_POSITION, RISK_PRESETS, STAKE_PRESETS, clamp, getLadderJump, getLadderProbability, getSnakeProbability } from './config';
import { createRng, hashString, hashToHex } from './rng';
import { formatMultiplier, getMultiplier } from './multiplier';
import { LastRunSnapshot, RiskPreset, RollAction, RunSeeds, RunStatus, TileEvent } from './types';

interface ModalState {
  type: 'win' | 'loss' | null;
  title?: string;
  message?: string;
  winnings?: number;
}

interface GameState {
  bankroll: number;
  stake: number;
  runStake: number;
  risk: number;
  riskPreset: RiskPreset;
  position: number;
  status: RunStatus;
  multiplier: number;
  lastRoll: number | null;
  eventLog: string[];
  seeds: RunSeeds | null;
  rngSeed: string | null;
  actions: RollAction[];
  lastRun: LastRunSnapshot | null;
  modal: ModalState;
  soundEnabled: boolean;
  reducedMotion: boolean;
  introVisible: boolean;
  replayMode: boolean;
  setStake: (stake: number) => void;
  setRiskPreset: (preset: RiskPreset) => void;
  setRisk: (risk: number) => void;
  startRun: () => void;
  rollDice: () => void;
  cashOut: () => void;
  closeModal: () => void;
  claimDailyBonus: () => void;
  replayLastRun: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  resetBankroll: () => void;
  resetFairness: () => void;
  dismissIntro: () => void;
}

const BANKROLL_KEY = 'dlc_bankroll';
const SOUND_KEY = 'dlc_sound';
const REDUCED_KEY = 'dlc_reduced';
const BONUS_KEY = 'dlc_bonus';

const getStoredNumber = (key: string, fallback: number) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const getStoredBoolean = (key: string, fallback: boolean) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  return raw === 'true';
};

const generateSeed = (label: string) => {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return `${label}-${Array.from(array).map((value) => value.toString(16)).join('')}`;
};

const buildSeeds = (): RunSeeds => {
  const serverSeed = generateSeed('server');
  const clientSeed = generateSeed('client');
  const combinedSeed = `${serverSeed}:${clientSeed}`;
  const combinedHash = hashToHex(hashString(combinedSeed));
  return { serverSeed, clientSeed, combinedSeed, combinedHash };
};

const addLogEntry = (log: string[], entry: string) => {
  const next = [entry, ...log];
  return next.slice(0, 18);
};

export const useGameStore = create<GameState>((set, get) => ({
  bankroll: getStoredNumber(BANKROLL_KEY, 10000),
  stake: STAKE_PRESETS[1],
  runStake: 0,
  risk: RISK_PRESETS.Balanced,
  riskPreset: 'Balanced',
  position: 0,
  status: 'idle',
  multiplier: 1,
  lastRoll: null,
  eventLog: ['Welcome to Dice Ladder Casino. Choose your stake and risk.'],
  seeds: null,
  rngSeed: null,
  actions: [],
  lastRun: null,
  modal: { type: null },
  soundEnabled: getStoredBoolean(SOUND_KEY, true),
  reducedMotion: getStoredBoolean(REDUCED_KEY, false),
  introVisible: true,
  replayMode: false,
  setStake: (stake) => set({ stake }),
  setRiskPreset: (preset) => set({
    riskPreset: preset,
    risk: RISK_PRESETS[preset]
  }),
  setRisk: (risk) => set({
    riskPreset: 'Custom',
    risk
  }),
  startRun: () => {
    const state = get();
    if (state.status === 'running') return;
    const stake = clamp(state.stake, 10, 5000);
    if (stake > state.bankroll) {
      set({ eventLog: addLogEntry(state.eventLog, 'Not enough chips to start this run.') });
      return;
    }
    const seeds = buildSeeds();
    set({
      bankroll: state.bankroll - stake,
      runStake: stake,
      stake,
      position: 0,
      status: 'running',
      multiplier: getMultiplier(0, state.risk),
      lastRoll: null,
      seeds,
      rngSeed: seeds.combinedSeed,
      actions: [],
      modal: { type: null },
      eventLog: addLogEntry(state.eventLog, `Run started with stake ${stake}. Hash ${seeds.combinedHash}.`)
    });
  },
  rollDice: () => {
    const state = get();
    if (state.status !== 'running' || !state.rngSeed) return;
    const rng = createRng(state.rngSeed + `:${state.actions.length}`);
    const roll = rng.nextInt(1, 6);
    const start = state.position;
    let nextPosition = clamp(start + roll, 0, MAX_POSITION);
    let event: TileEvent = 'neutral';
    let ladderTo: number | undefined;

    if (nextPosition < MAX_POSITION) {
      const snakeProb = getSnakeProbability(nextPosition, state.risk);
      const ladderProb = getLadderProbability(nextPosition, state.risk);
      const draw = rng.nextFloat();
      if (draw < snakeProb) {
        event = 'snake';
      } else if (draw < snakeProb + ladderProb) {
        event = 'ladder';
        const jump = getLadderJump(nextPosition, state.risk, roll);
        ladderTo = clamp(nextPosition + jump, 0, MAX_POSITION);
        nextPosition = ladderTo;
      }
    }

    const multiplier = getMultiplier(nextPosition, state.risk);
    const action: RollAction = {
      roll,
      from: start,
      to: nextPosition,
      event,
      ladderTo,
      timestamp: Date.now()
    };

    let status: RunStatus = state.status;
    let modal: ModalState = { type: null };
    let bankroll = state.bankroll;
    let logEntry = `Rolled ${roll}. Advanced to ${nextPosition}.`;

    if (event === 'ladder' && ladderTo !== undefined) {
      logEntry = `Ladder hit! Jumped to ${ladderTo}.`;
    }

    if (event === 'snake') {
      status = 'lost';
      modal = {
        type: 'loss',
        title: 'Snake Bite! Run Ended',
        message: 'The pit boss collects your stake.'
      };
      logEntry = `Snake at ${nextPosition}. Run ended.`;
    }

    if (nextPosition >= MAX_POSITION && status === 'running') {
      status = 'won';
      const winnings = Math.round(state.runStake * multiplier);
      bankroll += winnings;
      modal = {
        type: 'win',
        title: 'Grand Prize!',
        message: `You reached 100 for ${formatMultiplier(multiplier)}.` ,
        winnings
      };
      logEntry = `Grand prize hit! ${formatMultiplier(multiplier)} payout.`;
    }

    set({
      position: nextPosition,
      lastRoll: roll,
      multiplier,
      status,
      bankroll,
      actions: [...state.actions, action],
      modal,
      eventLog: addLogEntry(state.eventLog, logEntry)
    });

    if (status !== 'running') {
      const snapshot: LastRunSnapshot = {
        stake: state.runStake,
        risk: state.risk,
        preset: state.riskPreset,
        seeds: state.seeds!,
        actions: [...state.actions, action],
        result: status,
        winnings: status === 'lost' ? 0 : Math.round(state.runStake * multiplier)
      };
      set({ lastRun: snapshot });
    }
  },
  cashOut: () => {
    const state = get();
    if (state.status !== 'running') return;
    const winnings = Math.round(state.runStake * state.multiplier);
    const bankroll = state.bankroll + winnings;
    set({
      bankroll,
      status: 'cashed',
      modal: {
        type: 'win',
        title: 'Cash Out Secured',
        message: `You locked in ${formatMultiplier(state.multiplier)}.`,
        winnings
      },
      eventLog: addLogEntry(state.eventLog, `Cashed out at ${formatMultiplier(state.multiplier)}.`)
    });
    const snapshot: LastRunSnapshot = {
      stake: state.runStake,
      risk: state.risk,
      preset: state.riskPreset,
      seeds: state.seeds!,
      actions: state.actions,
      result: 'cashed',
      winnings
    };
    set({ lastRun: snapshot });
  },
  closeModal: () => set({ modal: { type: null } }),
  claimDailyBonus: () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastClaim = localStorage.getItem(BONUS_KEY);
    if (lastClaim === today) {
      set({ eventLog: addLogEntry(get().eventLog, 'Daily chips already claimed.') });
      return;
    }
    localStorage.setItem(BONUS_KEY, today);
    set({
      bankroll: get().bankroll + 5000,
      eventLog: addLogEntry(get().eventLog, 'Daily bonus: +5,000 chips.')
    });
  },
  replayLastRun: () => {
    const snapshot = get().lastRun;
    if (!snapshot) return;
    const applyReplay = async () => {
      set({
        position: 0,
        status: 'running',
        runStake: snapshot.stake,
        risk: snapshot.risk,
        riskPreset: snapshot.preset,
        seeds: snapshot.seeds,
        rngSeed: snapshot.seeds.combinedSeed,
        actions: [],
        lastRoll: null,
        replayMode: true,
        modal: { type: null },
        eventLog: addLogEntry(get().eventLog, 'Replaying last run...')
      });
      for (const action of snapshot.actions) {
        const delay = get().reducedMotion ? 200 : 800;
        await new Promise((resolve) => setTimeout(resolve, delay));
        set({
          position: action.to,
          lastRoll: action.roll,
          multiplier: getMultiplier(action.to, snapshot.risk),
          actions: [...get().actions, action],
          eventLog: addLogEntry(get().eventLog, `Replay: rolled ${action.roll}.`) 
        });
        if (action.event === 'snake') {
          set({ status: 'lost' });
          break;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, get().reducedMotion ? 200 : 800));
      set({ status: snapshot.result, replayMode: false });
    };
    void applyReplay();
  },
  setSoundEnabled: (enabled) => {
    localStorage.setItem(SOUND_KEY, String(enabled));
    set({ soundEnabled: enabled });
  },
  setReducedMotion: (enabled) => {
    localStorage.setItem(REDUCED_KEY, String(enabled));
    set({ reducedMotion: enabled });
  },
  resetBankroll: () => {
    localStorage.removeItem(BANKROLL_KEY);
    set({ bankroll: 10000 });
  },
  resetFairness: () => {
    set({ seeds: null, rngSeed: null, eventLog: addLogEntry(get().eventLog, 'Fairness seeds reset.') });
  },
  dismissIntro: () => set({ introVisible: false })
}));

useGameStore.subscribe((state) => {
  localStorage.setItem(BANKROLL_KEY, String(state.bankroll));
});
