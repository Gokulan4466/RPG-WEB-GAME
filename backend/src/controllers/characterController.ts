import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { getRequiredXpForLevel } from '../services/xpEngine';

export async function getCharacter(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const character = await prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHARACTER_NOT_FOUND', message: 'Character not found for user.' },
      });
    }

    const requiredXp = getRequiredXpForLevel(character.level);

    // Fetch equipped cosmetics
    const equippedInventory = await prisma.inventory.findMany({
      where: { userId, isEquipped: true },
      include: { item: true },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...character,
        requiredXpForNextLevel: requiredXp,
        equippedCosmetics: equippedInventory.map((inv) => inv.item),
      },
    });
  } catch (error: any) {
    console.error('getCharacter error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch character details.' },
    });
  }
}
