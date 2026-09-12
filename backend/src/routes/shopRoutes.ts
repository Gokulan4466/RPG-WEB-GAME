import { Router } from 'express';
import { getShopItems, purchaseItem } from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getShopItems);
router.post('/:id/purchase', purchaseItem);

export default router;
