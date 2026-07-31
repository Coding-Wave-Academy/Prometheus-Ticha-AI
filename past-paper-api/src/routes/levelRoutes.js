import { Router } from 'express';
import { listLevels } from '../controllers/levelController.js';

const router = Router();

router.get('/levels', listLevels);

export default router;
