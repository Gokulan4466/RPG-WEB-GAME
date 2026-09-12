import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getShopItems(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const items = await prisma.item.findMany();
    const userInventory = await prisma.inventory.findMany({
      where: { userId },
      select: { itemId: true, isEquipped: true },
    });

    const ownedItemIds = new Set(userInventory.map((inv) => inv.itemId));
    const equippedItemIds = new Set(
      userInventory.filter((inv) => inv.isEquipped).map((inv) => inv.itemId)
    );

    const itemsWithOwned = items.map((item) => ({
      ...item,
      isOwned: ownedItemIds.has(item.id),
      isEquipped: equippedItemIds.has(item.id),
    }));

    return res.status(200).json({
      success: true,
      data: itemsWithOwned,
    });
  } catch (error: any) {
    console.error('getShopItems error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch shop items.' },
    });
  }
}

export async function purchaseItem(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'ITEM_NOT_FOUND', message: 'Shop item not found.' },
      });
    }

    const existingInventory = await prisma.inventory.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId: id,
        },
      },
    });

    if (existingInventory) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_OWNED', message: 'You already own this item.' },
      });
    }

    const character = await prisma.character.findUnique({ where: { userId } });
    if (!character) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHARACTER_NOT_FOUND', message: 'Character not found.' },
      });
    }

    if (character.gold < item.priceGold) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_GOLD',
          message: `Not enough Gold. Required: ${item.priceGold} Gold, Available: ${character.gold} Gold.`,
        },
      });
    }

    // Execute atomic shop purchase transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct Gold
      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          gold: { decrement: item.priceGold },
        },
      });

      // 2. Add to Inventory
      const newInventory = await tx.inventory.create({
        data: {
          userId,
          itemId: item.id,
          isEquipped: false,
        },
        include: { item: true },
      });

      // 3. Create Transaction record
      await tx.transaction.create({
        data: {
          userId,
          amount: -item.priceGold,
          type: 'SHOP_PURCHASE',
          description: `Purchased item: ${item.name}`,
        },
      });

      return {
        character: updatedCharacter,
        inventoryItem: newInventory,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('purchaseItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to complete item purchase.' },
    });
  }
}
