import { Router } from 'express';
import { getInventory, equipItem, unequipItem } from '../controllers/inventoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getInventory);
router.post('/:id/equip', equipItem);
router.post('/:id/unequip', unequipItem);

export default router;
