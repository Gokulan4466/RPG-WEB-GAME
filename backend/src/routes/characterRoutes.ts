import { Router } from 'express';
import { getCharacter } from '../controllers/characterController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getCharacter);

export default router;
