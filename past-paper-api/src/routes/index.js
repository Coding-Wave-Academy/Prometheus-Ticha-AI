import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import levelRoutes from './levelRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import paperRoutes from './paperRoutes.js';

const router = Router();

// Versioned /api/v1 routes
router.use('/v1', healthRoutes);
router.use('/v1', levelRoutes);
router.use('/v1', subjectRoutes);
router.use('/v1', paperRoutes);

export default router;
