import { useCallback, useRef } from 'react';
import { useGameStore } from '../game/store';

const SOUND_MAP: Record<string, { frequency: number; duration: number }> = {
  roll: { frequency: 240, duration: 0.12 },
  ladder: { frequency: 520, duration: 0.2 },
  snake: { frequency: 110, duration: 0.18 },
  win: { frequency: 720, duration: 0.25 },
  cash: { frequency: 640, duration: 0.22 }
};

export const useSound = () => {
  const enabled = useGameStore((state) => state.soundEnabled);
  const contextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(
    (type: keyof typeof SOUND_MAP) => {
      if (!enabled) return;
      const settings = SOUND_MAP[type];
      if (!settings) return;
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
      }
      const ctx = contextRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = settings.frequency;
      gain.gain.value = 0.12;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + settings.duration);
      oscillator.stop(ctx.currentTime + settings.duration + 0.05);
    },
    [enabled]
  );

  return { playSound };
};
