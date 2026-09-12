import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getInventory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const inventory = await prisma.inventory.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { acquiredAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error: any) {
    console.error('getInventory error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch inventory.' },
    });
  }
}

export async function equipItem(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params; // Inventory ID or Item ID

    // Find inventory entry either by inventory ID or itemId
    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        userId,
        OR: [{ id }, { itemId: id }],
      },
      include: { item: true },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        error: { code: 'ITEM_NOT_FOUND', message: 'Item not found in inventory.' },
      });
    }

    const category = inventoryItem.item.category;

    // Execute atomic equip transaction: unequip other items in same category, then equip this item
    const updatedItem = await prisma.$transaction(async (tx) => {
      // Unequip all items of the same category for this user
      const categoryItems = await tx.inventory.findMany({
        where: { userId },
        include: { item: true },
      });

      const sameCategoryInventoryIds = categoryItems
        .filter((inv) => inv.item.category === category)
        .map((inv) => inv.id);

      if (sameCategoryInventoryIds.length > 0) {
        await tx.inventory.updateMany({
          where: { id: { in: sameCategoryInventoryIds } },
          data: { isEquipped: false },
        });
      }

      // Equip target item
      return await tx.inventory.update({
        where: { id: inventoryItem.id },
        data: { isEquipped: true },
        include: { item: true },
      });
    });

    return res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    console.error('equipItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to equip item.' },
    });
  }
}

export async function unequipItem(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        userId,
        OR: [{ id }, { itemId: id }],
      },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        error: { code: 'ITEM_NOT_FOUND', message: 'Item not found in inventory.' },
      });
    }

    const updatedItem = await prisma.inventory.update({
      where: { id: inventoryItem.id },
      data: { isEquipped: false },
      include: { item: true },
    });

    return res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    console.error('unequipItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to unequip item.' },
    });
  }
}
