import { Router } from 'express';
import { getAchievements } from '../controllers/achievementController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getAchievements);

export default router;
