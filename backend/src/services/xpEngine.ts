import { config } from '../config';

export interface XpLevelResult {
  newLevel: number;
  newCurrentXp: number;
  levelsGained: number;
  didLevelUp: boolean;
  requiredXpForNextLevel: number;
}

/**
 * Returns XP required to complete the specified level
 */
export function getRequiredXpForLevel(level: number): number {
  return config.xpFormula(level);
}

/**
 * Calculates new level and current XP after gaining XP.
 * Handles multiple level-ups correctly if added XP is large.
 */
export function processXpGain(currentLevel: number, currentXp: number, addedXp: number): XpLevelResult {
  let level = currentLevel;
  let xp = currentXp + addedXp;
  let initialLevel = currentLevel;

  while (true) {
    const requiredForCurrent = getRequiredXpForLevel(level);
    if (xp >= requiredForCurrent) {
      xp -= requiredForCurrent;
      level += 1;
    } else {
      break;
    }
  }

  const levelsGained = level - initialLevel;
  return {
    newLevel: level,
    newCurrentXp: xp,
    levelsGained,
    didLevelUp: levelsGained > 0,
    requiredXpForNextLevel: getRequiredXpForLevel(level),
  };
}
