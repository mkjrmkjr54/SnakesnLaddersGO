export const hashString = (input: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const hashToHex = (hash: number): string =>
  hash.toString(16).padStart(8, '0');

export const mulberry32 = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export interface Rng {
  nextFloat: () => number;
  nextInt: (min: number, max: number) => number;
}

export const createRng = (seed: string): Rng => {
  const seedHash = hashString(seed);
  const rand = mulberry32(seedHash);
  return {
    nextFloat: () => rand(),
    nextInt: (min: number, max: number) => {
      const low = Math.ceil(min);
      const high = Math.floor(max);
      return Math.floor(rand() * (high - low + 1)) + low;
    }
  };
};
