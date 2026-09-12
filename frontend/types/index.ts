export type Category =
  | 'STRENGTH'
  | 'INTELLIGENCE'
  | 'HEALTH'
  | 'DISCIPLINE'
  | 'CREATIVITY'
  | 'CHARISMA';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';

export type QuestStatus = 'ACTIVE' | 'COMPLETED';

export type ItemCategory = 'THEME' | 'FRAME' | 'BADGE' | 'TITLE' | 'EFFECT';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  level: number;
  currentXp: number;
  totalXp: number;
  gold: number;
  strength: number;
  intelligence: number;
  health: number;
  discipline: number;
  creativity: number;
  charisma: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  requiredXpForNextLevel?: number;
  equippedCosmetics?: Item[];
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: Category;
  difficulty: Difficulty;
  xpReward: number;
  goldReward: number;
  attributeReward: number;
  dueDate?: string | null;
  status: QuestStatus;
  createdAt: string;
  completedAt?: string | null;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category?: Category | null;
  reqType: string;
  reqValue: number;
  rewardXp: number;
  rewardGold: number;
  isUnlocked?: boolean;
  unlockedAt?: string | null;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  description: string;
  category: ItemCategory;
  priceGold: number;
  icon: string;
  rarity: string;
  isOwned?: boolean;
  isEquipped?: boolean;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  isEquipped: boolean;
  acquiredAt: string;
  item: Item;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'QUEST_REWARD' | 'SHOP_PURCHASE';
  description: string;
  createdAt: string;
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  questCount: number;
  xpEarned: number;
}

export interface UserStats {
  totalXpEarned: number;
  totalQuestsCompleted: number;
  totalQuestsCreated: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  gold: {
    current: number;
    totalEarned: number;
    totalSpent: number;
  };
  attributes: {
    strength: number;
    intelligence: number;
    health: number;
    discipline: number;
    creativity: number;
    charisma: number;
  };
  categoryBreakdown: Record<Category, number>;
  activityCalendar: DailyActivity[];
  recentTransactions: Transaction[];
}

export interface QuestCompletionResponse {
  quest: Quest;
  character: Character;
  rewards: {
    xpGained: number;
    goldGained: number;
    attributeGained: number;
    attributeType: Category;
  };
  levelUp: {
    didLevelUp: boolean;
    levelsGained: number;
    oldLevel: number;
    newLevel: number;
  };
  unlockedAchievements: Array<{
    id: string;
    code: string;
    title: string;
    rewardXp: number;
    rewardGold: number;
  }>;
}
