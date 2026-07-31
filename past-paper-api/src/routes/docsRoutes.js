import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const openapiPath = path.join(__dirname, '../../openapi.yaml');
let swaggerDocument;

try {
  swaggerDocument = yaml.load(openapiPath);
} catch (e) {
  console.error('Failed to load openapi.yaml:', e.message);
  swaggerDocument = {
    openapi: '3.0.0',
    info: { title: 'Ticha AI — Past Paper API', version: '1.0.0' },
    paths: {},
  };
}

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
