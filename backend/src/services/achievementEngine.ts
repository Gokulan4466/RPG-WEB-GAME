import { Prisma } from '@prisma/client';

export interface UnlockedAchievementInfo {
  id: string;
  code: string;
  title: string;
  rewardXp: number;
  rewardGold: number;
}

export async function checkAndUnlockAchievements(
  tx: Prisma.TransactionClient,
  userId: string
): Promise<UnlockedAchievementInfo[]> {
  const character = await tx.character.findUnique({ where: { userId } });
  if (!character) return [];

  const existingUserAchievements = await tx.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(existingUserAchievements.map((a) => a.achievementId));

  const allAchievements = await tx.achievement.findMany();
  const newlyUnlocked: UnlockedAchievementInfo[] = [];

  const totalCompletions = await tx.questCompletion.count({ where: { userId } });

  const categoryCounts = await tx.quest.groupBy({
    by: ['category'],
    where: {
      userId,
      status: 'COMPLETED',
    },
    _count: {
      id: true,
    },
  });

  const categoryMap: Record<string, number> = {};
  categoryCounts.forEach((c) => {
    categoryMap[c.category] = c._count.id;
  });

  for (const ach of allAchievements) {
    if (unlockedIds.has(ach.id)) continue;

    let qualifies = false;

    switch (ach.reqType) {
      case 'FIRST_QUEST':
        qualifies = totalCompletions >= 1;
        break;
      case 'QUEST_COUNT':
        qualifies = totalCompletions >= ach.reqValue;
        break;
      case 'CATEGORY_COUNT':
        if (ach.category) {
          const count = categoryMap[ach.category] || 0;
          qualifies = count >= ach.reqValue;
        }
        break;
      case 'STREAK':
        qualifies = Math.max(character.currentStreak, character.longestStreak) >= ach.reqValue;
        break;
      case 'LEVEL':
        qualifies = character.level >= ach.reqValue;
        break;
    }

    if (qualifies) {
      await tx.userAchievement.create({
        data: {
          userId,
          achievementId: ach.id,
        },
      });

      await tx.character.update({
        where: { userId },
        data: {
          gold: { increment: ach.rewardGold },
          totalXp: { increment: ach.rewardXp },
          currentXp: { increment: ach.rewardXp },
        },
      });

      if (ach.rewardGold > 0) {
        await tx.transaction.create({
          data: {
            userId,
            amount: ach.rewardGold,
            type: 'QUEST_REWARD',
            description: `Achievement Unlocked: ${ach.title}`,
          },
        });
      }

      newlyUnlocked.push({
        id: ach.id,
        code: ach.code,
        title: ach.title,
        rewardXp: ach.rewardXp,
        rewardGold: ach.rewardGold,
      });
    }
  }

  return newlyUnlocked;
}
