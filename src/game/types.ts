export type RiskPreset = 'Safe' | 'Balanced' | 'Risky' | 'Insane' | 'Custom';

export type RunStatus = 'idle' | 'running' | 'won' | 'lost' | 'cashed';

export type TileEvent = 'neutral' | 'ladder' | 'snake';

export interface RunSeeds {
  serverSeed: string;
  clientSeed: string;
  combinedSeed: string;
  combinedHash: string;
}

export interface RollAction {
  roll: number;
  from: number;
  to: number;
  event: TileEvent;
  ladderTo?: number;
  timestamp: number;
}

export interface LastRunSnapshot {
  stake: number;
  risk: number;
  preset: RiskPreset;
  seeds: RunSeeds;
  actions: RollAction[];
  result: RunStatus;
  winnings: number;
}
