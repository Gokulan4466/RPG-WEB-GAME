import { processXpGain, getRequiredXpForLevel } from '../services/xpEngine';
import { calculateStreak } from '../services/streakEngine';

describe('LifeRPG Game Engine Unit Tests', () => {
  describe('XP & Non-Linear Level Engine', () => {
    test('Calculates non-linear required XP formula correctly', () => {
      // Level 1 = Math.floor(100 * 1^1.5) = 100
      expect(getRequiredXpForLevel(1)).toBe(100);
      // Level 2 = Math.floor(100 * 2^1.5) = 282
      expect(getRequiredXpForLevel(2)).toBe(282);
      // Level 3 = Math.floor(100 * 3^1.5) = 519
      expect(getRequiredXpForLevel(3)).toBe(519);
    });

    test('Handles normal XP gain without leveling up', () => {
      const result = processXpGain(1, 0, 50);
      expect(result.didLevelUp).toBe(false);
      expect(result.newLevel).toBe(1);
      expect(result.newCurrentXp).toBe(50);
      expect(result.levelsGained).toBe(0);
    });

    test('Handles single level-up transition', () => {
      const result = processXpGain(1, 50, 60); // Total 110 XP -> Level 1 requires 100 XP
      expect(result.didLevelUp).toBe(true);
      expect(result.newLevel).toBe(2);
      expect(result.newCurrentXp).toBe(10); // 110 - 100 = 10
      expect(result.levelsGained).toBe(1);
    });

    test('Handles multi-level-up jump for large XP gains', () => {
      // Level 1 requires 100, Level 2 requires 282, Level 3 requires 519. Total = 901 XP for Level 4.
      const result = processXpGain(1, 0, 1000);
      expect(result.didLevelUp).toBe(true);
      expect(result.newLevel).toBe(4);
      expect(result.levelsGained).toBe(3);
    });
  });

  describe('Streak Engine', () => {
    test('Starts streak at 1 for first completion', () => {
      const result = calculateStreak(null, 0, 0);
      expect(result.newCurrentStreak).toBe(1);
      expect(result.newLongestStreak).toBe(1);
      expect(result.isNewDay).toBe(true);
    });

    test('Does not increment streak for multiple completions on the same day', () => {
      const today = new Date();
      const result = calculateStreak(today, 5, 5);
      expect(result.newCurrentStreak).toBe(5);
      expect(result.isNewDay).toBe(false);
    });

    test('Increments streak by 1 for consecutive calendar day completion', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = calculateStreak(yesterday, 5, 5);
      expect(result.newCurrentStreak).toBe(6);
      expect(result.newLongestStreak).toBe(6);
      expect(result.isNewDay).toBe(true);
    });

    test('Resets current streak to 1 if a day was missed', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = calculateStreak(threeDaysAgo, 10, 10);
      expect(result.newCurrentStreak).toBe(1);
      expect(result.newLongestStreak).toBe(10); // Longest streak preserved!
      expect(result.isNewDay).toBe(true);
    });
  });
});
