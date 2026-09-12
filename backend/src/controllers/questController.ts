import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { Category, Difficulty, QuestStatus } from '../types/enums';
import { processXpGain } from '../services/xpEngine';
import { calculateStreak } from '../services/streakEngine';
import { checkAndUnlockAchievements } from '../services/achievementEngine';

const createQuestSchema = z.object({
  title: z.string().min(1, 'Quest title is required').max(100, 'Title is too long'),
  description: z.string().optional().nullable(),
  category: z.nativeEnum(Category).default(Category.INTELLIGENCE),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.EASY),
  xpReward: z.number().int().min(1).optional(),
  goldReward: z.number().int().min(0).optional(),
  attributeReward: z.number().int().min(1).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateQuestSchema = createQuestSchema.partial();

function getDefaultRewards(difficulty: Difficulty) {
  switch (difficulty) {
    case Difficulty.EASY:
      return { xp: 30, gold: 15, attribute: 1 };
    case Difficulty.MEDIUM:
      return { xp: 60, gold: 30, attribute: 2 };
    case Difficulty.HARD:
      return { xp: 100, gold: 50, attribute: 3 };
    case Difficulty.EPIC:
      return { xp: 200, gold: 100, attribute: 5 };
  }
}

export async function getQuests(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { status, category, difficulty } = req.query;

    const where: any = { userId };
    if (status && Object.values(QuestStatus).includes(status as QuestStatus)) {
      where.status = status as string;
    }
    if (category && Object.values(Category).includes(category as Category)) {
      where.category = category as string;
    }
    if (difficulty && Object.values(Difficulty).includes(difficulty as Difficulty)) {
      where.difficulty = difficulty as string;
    }

    const quests = await prisma.quest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: quests,
    });
  } catch (error: any) {
    console.error('getQuests error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch quests.' },
    });
  }
}

export async function createQuest(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const parseResult = createQuestSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0].message,
        },
      });
    }

    const data = parseResult.data;
    const defaults = getDefaultRewards(data.difficulty);

    const quest = await prisma.quest.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        xpReward: data.xpReward || defaults.xp,
        goldReward: data.goldReward !== undefined ? data.goldReward : defaults.gold,
        attributeReward: data.attributeReward || defaults.attribute,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return res.status(201).json({
      success: true,
      data: quest,
    });
  } catch (error: any) {
    console.error('createQuest error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create quest.' },
    });
  }
}

export async function updateQuest(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingQuest = await prisma.quest.findUnique({ where: { id } });
    if (!existingQuest) {
      return res.status(404).json({
        success: false,
        error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found.' },
      });
    }

    if (existingQuest.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED_ACCESS', message: 'You do not own this quest.' },
      });
    }

    const parseResult = updateQuestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0].message,
        },
      });
    }

    const data = parseResult.data;
    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.xpReward !== undefined && { xpReward: data.xpReward }),
        ...(data.goldReward !== undefined && { goldReward: data.goldReward }),
        ...(data.attributeReward !== undefined && { attributeReward: data.attributeReward }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedQuest,
    });
  } catch (error: any) {
    console.error('updateQuest error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update quest.' },
    });
  }
}

export async function deleteQuest(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingQuest = await prisma.quest.findUnique({ where: { id } });
    if (!existingQuest) {
      return res.status(404).json({
        success: false,
        error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found.' },
      });
    }

    if (existingQuest.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED_ACCESS', message: 'You do not own this quest.' },
      });
    }

    await prisma.quest.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      data: { id, message: 'Quest deleted successfully.' },
    });
  } catch (error: any) {
    console.error('deleteQuest error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete quest.' },
    });
  }
}

export async function completeQuest(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) {
      return res.status(404).json({
        success: false,
        error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found.' },
      });
    }

    if (quest.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED_ACCESS', message: 'You do not own this quest.' },
      });
    }

    if (quest.status === QuestStatus.COMPLETED) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_COMPLETED', message: 'This quest has already been completed.' },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const completedQuest = await tx.quest.update({
        where: { id },
        data: {
          status: QuestStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      await tx.questCompletion.create({
        data: {
          questId: quest.id,
          userId,
          xpGained: quest.xpReward,
          goldGained: quest.goldReward,
        },
      });

      const character = await tx.character.findUnique({ where: { userId } });
      if (!character) {
        throw new Error('Character not found for user');
      }

      const xpResult = processXpGain(character.level, character.currentXp, quest.xpReward);

      const streakResult = calculateStreak(
        character.lastActiveDate,
        character.currentStreak,
        character.longestStreak
      );

      const categoryFieldMap: Record<string, string> = {
        STRENGTH: 'strength',
        INTELLIGENCE: 'intelligence',
        HEALTH: 'health',
        DISCIPLINE: 'discipline',
        CREATIVITY: 'creativity',
        CHARISMA: 'charisma',
      };
      const attrField = categoryFieldMap[quest.category] || 'intelligence';

      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          level: xpResult.newLevel,
          currentXp: xpResult.newCurrentXp,
          totalXp: { increment: quest.xpReward },
          gold: { increment: quest.goldReward },
          [attrField]: { increment: quest.attributeReward },
          currentStreak: streakResult.newCurrentStreak,
          longestStreak: streakResult.newLongestStreak,
          lastActiveDate: new Date(),
        },
      });

      if (quest.goldReward > 0) {
        await tx.transaction.create({
          data: {
            userId,
            amount: quest.goldReward,
            type: 'QUEST_REWARD',
            description: `Quest Reward: ${quest.title}`,
          },
        });
      }

      const todayStr = streakResult.todayDateStr;
      await tx.dailyActivity.upsert({
        where: {
          userId_date: {
            userId,
            date: todayStr,
          },
        },
        update: {
          questCount: { increment: 1 },
          xpEarned: { increment: quest.xpReward },
        },
        create: {
          userId,
          date: todayStr,
          questCount: 1,
          xpEarned: quest.xpReward,
        },
      });

      const newlyUnlockedAchievements = await checkAndUnlockAchievements(tx, userId);

      return {
        quest: completedQuest,
        character: updatedCharacter,
        rewards: {
          xpGained: quest.xpReward,
          goldGained: quest.goldReward,
          attributeGained: quest.attributeReward,
          attributeType: quest.category,
        },
        levelUp: {
          didLevelUp: xpResult.didLevelUp,
          levelsGained: xpResult.levelsGained,
          oldLevel: character.level,
          newLevel: xpResult.newLevel,
        },
        unlockedAchievements: newlyUnlockedAchievements,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('completeQuest error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to complete quest.' },
    });
  }
}
