import { describe, expect, it } from 'vitest';
import { createRng, hashString } from '../rng';

describe('rng', () => {
  it('creates deterministic sequences', () => {
    const rngA = createRng('seed');
    const rngB = createRng('seed');
    expect(rngA.nextInt(1, 6)).toBe(rngB.nextInt(1, 6));
    expect(rngA.nextFloat()).toBe(rngB.nextFloat());
  });

  it('hashes strings consistently', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abcd'));
  });
});
