import { Router } from 'express';
import { listSubjects } from '../controllers/subjectController.js';
import { validate } from '../middleware/validate.js';
import { subjectsQuerySchema } from '../validators/paperValidators.js';

const router = Router();

router.get('/subjects', validate(subjectsQuerySchema, 'query'), listSubjects);

export default router;
