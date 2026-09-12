import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getAchievements(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const allAchievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    const userAchMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]));

    const achievementsWithStatus = allAchievements.map((ach) => {
      const unlockedAt = userAchMap.get(ach.id);
      return {
        ...ach,
        isUnlocked: !!unlockedAt,
        unlockedAt: unlockedAt || null,
      };
    });

    return res.status(200).json({
      success: true,
      data: achievementsWithStatus,
    });
  } catch (error: any) {
    console.error('getAchievements error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch achievements.' },
    });
  }
}
