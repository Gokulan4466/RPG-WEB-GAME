export interface StreakResult {
  newCurrentStreak: number;
  newLongestStreak: number;
  isNewDay: boolean;
  todayDateStr: string;
}

/**
 * Formats a Date object to YYYY-MM-DD string format (UTC / localized)
 */
export function formatDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates updated streak state based on completion timestamp.
 */
export function calculateStreak(
  lastActiveDate: Date | null,
  currentStreak: number,
  longestStreak: number
): StreakResult {
  const now = new Date();
  const todayStr = formatDateStr(now);

  if (!lastActiveDate) {
    return {
      newCurrentStreak: 1,
      newLongestStreak: Math.max(longestStreak, 1),
      isNewDay: true,
      todayDateStr: todayStr,
    };
  }

  const lastActiveStr = formatDateStr(lastActiveDate);

  if (lastActiveStr === todayStr) {
    // Already active today, streak count doesn't increment
    return {
      newCurrentStreak: Math.max(currentStreak, 1),
      newLongestStreak: Math.max(longestStreak, currentStreak, 1),
      isNewDay: false,
      todayDateStr: todayStr,
    };
  }

  // Calculate difference in calendar days
  const todayDateObj = new Date(todayStr);
  const lastActiveDateObj = new Date(lastActiveStr);
  const diffTime = Math.abs(todayDateObj.getTime() - lastActiveDateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newCurrent = currentStreak;
  if (diffDays === 1) {
    // Consecutive day
    newCurrent += 1;
  } else {
    // Streak broken
    newCurrent = 1;
  }

  const newLongest = Math.max(longestStreak, newCurrent);

  return {
    newCurrentStreak: newCurrent,
    newLongestStreak: newLongest,
    isNewDay: true,
    todayDateStr: todayStr,
  };
}
