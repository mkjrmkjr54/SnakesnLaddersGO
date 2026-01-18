# Dice Ladder Casino

A premium casino-themed dice progression game using **play money only**. Roll the dice, climb the 0→100 track, hit rare ladders, dodge dangerous snakes, and cash out before the pit boss bites. No real gambling, no crypto, no deposits, and no cashouts—just a polished, local-run experience.

## Project Overview
Dice Ladder Casino is a Snakes-and-Ladders-inspired risk game with modern casino presentation. The game emphasizes tension and progression through a dynamic multiplier curve, probabilistic ladders/snakes, and a provably fair-style seed system—all while remaining strictly play money.

## Install & Run

### Prerequisites (Windows + macOS)
- **Node.js 18+** (recommended: 20 LTS). The game is local-only and works on both Windows and macOS.
- **npm** comes with Node.js.

If you use a Node version manager, you can add/use this repo’s `.nvmrc` file.

```bash
npm install
npm run dev
```

Then open the local URL printed in your terminal (usually `http://localhost:5173`).

### Windows Notes
- Use **PowerShell** or **Command Prompt** and run the same commands above.
- If you see “execution policy” warnings, they are unrelated to this project; just rerun `npm install` and `npm run dev`.

### macOS Notes
- If you see permission errors, ensure Node is installed correctly and rerun `npm install`.

Build:

```bash
npm run build
```

Test:

```bash
npm run test
```

## How to Play
1. **Choose stake**: Pick a quick chip or enter a custom stake.
2. **Choose risk**: Select a preset (Safe/Balanced/Risky/Insane) or use the custom slider.
3. **Start run**: Stake is locked and the fairness hash is revealed.
4. **Roll dice**: Advance 1–6 tiles on the 0→100 track.
5. **Decide cash out**: Cash out anytime to lock in the current multiplier.
6. **Ladders boost**: Rare ladders jump you forward.
7. **Snakes end**: Snakes end the run instantly.
8. **Reach 100**: Claim the grand prize multiplier at tile 100.

## Risk Slider & Multiplier Curve
Risk affects two systems:
- **Tile events**: Higher risk increases snake probability (especially after tile 60) and decreases ladder probability.
- **Multiplier curve**: Higher risk scales the curve upward for bigger late-stage payouts.

The multiplier is non-linear and accelerates as you approach tile 100, creating a rewarding but tense experience.

## Fairness & Replay
Each run generates:
- **Server seed** and **Client seed**
- **Combined seed hash** displayed at run start

All dice rolls and tile events are generated from a deterministic PRNG, allowing the sequence to be replayed locally. At run end, the seeds are revealed for transparency.

## Controls & Accessibility
- Keyboard accessible buttons and sliders.
- Reduced motion support via user setting.
- Sound toggle with a stored preference.

## File Structure
```
src/
  assets/          # SVG bills & coins
  components/      # UI components and panels
  game/            # Game logic, RNG, and configuration
  styles/          # Tailwind styles
```

## Customization
Adjust the odds and curve here:
- `src/game/config.ts` — snake/ladder odds and risk presets
- `src/game/multiplier.ts` — multiplier curve formula
- `src/game/rng.ts` — deterministic RNG and hash utilities

## Disclaimer
Dice Ladder Casino is **play money only**. It includes no real-world gambling, no deposits, no crypto, and no cashout functionality.
