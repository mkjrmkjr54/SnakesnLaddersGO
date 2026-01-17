import { MAX_POSITION, clamp, getMultiplierCaps } from './config';

export const getMultiplier = (position: number, risk: number) => {
  const progress = clamp(position / MAX_POSITION, 0, 1);
  const riskFactor = risk / 100;
  const curve = 1.2 + riskFactor * 1.4;
  const intensity = 14 + riskFactor * 26;
  const raw = 1 + Math.pow(progress, curve) * intensity;
  const caps = getMultiplierCaps(risk);
  return clamp(raw, caps.min, caps.max);
};

export const formatMultiplier = (value: number) => `${value.toFixed(2)}x`;
