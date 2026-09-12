import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const character = await prisma.character.findUnique({ where: { userId } });
    if (!character) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHARACTER_NOT_FOUND', message: 'Character not found.' },
      });
    }

    const totalQuests = await prisma.quest.count({ where: { userId } });
    const completedQuests = await prisma.quest.count({
      where: { userId, status: 'COMPLETED' },
    });

    const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

    // Category breakdown
    const categoryCounts = await prisma.quest.groupBy({
      by: ['category'],
      where: { userId, status: 'COMPLETED' },
      _count: { id: true },
    });

    const categoryBreakdown: Record<string, number> = {
      STRENGTH: 0,
      INTELLIGENCE: 0,
      HEALTH: 0,
      DISCIPLINE: 0,
      CREATIVITY: 0,
      CHARISMA: 0,
    };
    categoryCounts.forEach((item) => {
      categoryBreakdown[item.category] = item._count.id;
    });

    // Gold stats from transactions
    const rewardTransactions = await prisma.transaction.aggregate({
      where: { userId, type: 'QUEST_REWARD' },
      _sum: { amount: true },
    });
    const purchaseTransactions = await prisma.transaction.aggregate({
      where: { userId, type: 'SHOP_PURCHASE' },
      _sum: { amount: true },
    });

    const totalGoldEarned = rewardTransactions._sum.amount || 0;
    const totalGoldSpent = Math.abs(purchaseTransactions._sum.amount || 0);

    // Daily activity calendar entries (last 365 days or all entries)
    const dailyActivities = await prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalXpEarned: character.totalXp,
        totalQuestsCompleted: completedQuests,
        totalQuestsCreated: totalQuests,
        completionRate,
        currentStreak: character.currentStreak,
        longestStreak: character.longestStreak,
        gold: {
          current: character.gold,
          totalEarned: totalGoldEarned,
          totalSpent: totalGoldSpent,
        },
        attributes: {
          strength: character.strength,
          intelligence: character.intelligence,
          health: character.health,
          discipline: character.discipline,
          creativity: character.creativity,
          charisma: character.charisma,
        },
        categoryBreakdown,
        activityCalendar: dailyActivities,
        recentTransactions,
      },
    });
  } catch (error: any) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch statistics.' },
    });
  }
}
