import request from 'supertest';
import app from '../src/app.js';

describe('Ticha AI Past Paper API Endpoints', () => {

  describe('GET /api/v1/health', () => {
    it('should return 200 OK with liveness status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.service).toBe('ticha-past-paper-api');
    });
  });

  describe('GET /api/v1/levels', () => {
    it('should return 200 OK and levels array', async () => {
      const res = await request(app).get('/api/v1/levels');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/subjects', () => {
    it('should return 200 OK and subjects list', async () => {
      const res = await request(app).get('/api/v1/subjects?level=O/L');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/papers', () => {
    it('should return paginated list of papers with meta object', async () => {
      const res = await request(app)
        .get('/api/v1/papers?level=O/L&page=1&limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
    });

    it('should reject invalid year query parameter with 400 validation error', async () => {
      const res = await request(app).get('/api/v1/papers?year=invalid_year');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/papers/:id', () => {
    it('should return 400 for non-UUID id parameter', async () => {
      const res = await request(app).get('/api/v1/papers/12345-not-uuid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 for non-existent paper UUID', async () => {
      const nonExistentUuid = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(`/api/v1/papers/${nonExistentUuid}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Documentation Route', () => {
    it('should serve Swagger UI at /docs', async () => {
      const res = await request(app).get('/docs/');
      expect([200, 301, 302]).toContain(res.status);
    });
  });

});
