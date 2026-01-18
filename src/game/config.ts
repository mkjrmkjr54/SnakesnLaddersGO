import { RiskPreset } from './types';

export const MAX_POSITION = 100;

export const RISK_PRESETS: Record<RiskPreset, number> = {
  Safe: 15,
  Balanced: 35,
  Risky: 60,
  Insane: 85,
  Custom: 50
};

export const STAKE_PRESETS = [50, 100, 250, 500, 1000];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getSnakeProbability = (position: number, risk: number) => {
  const progress = position / MAX_POSITION;
  const riskFactor = risk / 100;
  const lateSpike = progress > 0.6 ? Math.pow((progress - 0.6) / 0.4, 1.4) : 0;
  const base = 0.02 + progress * 0.08 + lateSpike * 0.18;
  return clamp(base + riskFactor * (0.08 + progress * 0.2), 0.01, 0.65);
};

export const getLadderProbability = (position: number, risk: number) => {
  const progress = position / MAX_POSITION;
  const riskFactor = risk / 100;
  const base = 0.12 - progress * 0.08;
  const adjusted = base - riskFactor * 0.08 - progress * riskFactor * 0.04;
  return clamp(adjusted, 0.01, 0.2);
};

export const getLadderJump = (position: number, risk: number, roll: number) => {
  const progress = position / MAX_POSITION;
  const riskFactor = risk / 100;
  const baseJump = 6 + Math.round((1 - progress) * 10);
  const riskPenalty = Math.round(riskFactor * 4);
  return Math.max(4, baseJump - riskPenalty + roll);
};

export const getMultiplierCaps = (risk: number) => {
  if (risk <= 20) {
    return { min: 1.05, max: 28 };
  }
  if (risk <= 45) {
    return { min: 1.1, max: 45 };
  }
  if (risk <= 70) {
    return { min: 1.15, max: 70 };
  }
  return { min: 1.2, max: 110 };
};
