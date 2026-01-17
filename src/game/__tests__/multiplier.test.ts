import { describe, expect, it } from 'vitest';
import { getMultiplier } from '../multiplier';

describe('multiplier curve', () => {
  it('increases with position', () => {
    const low = getMultiplier(10, 30);
    const mid = getMultiplier(50, 30);
    const high = getMultiplier(90, 30);
    expect(low).toBeLessThan(mid);
    expect(mid).toBeLessThan(high);
  });

  it('increases with risk', () => {
    const safe = getMultiplier(70, 10);
    const risky = getMultiplier(70, 80);
    expect(safe).toBeLessThan(risky);
  });
});
