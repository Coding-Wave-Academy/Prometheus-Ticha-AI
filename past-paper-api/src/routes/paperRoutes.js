import { Router } from 'express';
import { listPapers, getPaperDetails, downloadPaper } from '../controllers/paperController.js';
import { validate } from '../middleware/validate.js';
import { papersQuerySchema, uuidParamSchema } from '../validators/paperValidators.js';

const router = Router();

router.get('/papers', validate(papersQuerySchema, 'query'), listPapers);
router.get('/papers/:id', validate(uuidParamSchema, 'params'), getPaperDetails);
router.get('/papers/:id/download', validate(uuidParamSchema, 'params'), downloadPaper);

export default router;
