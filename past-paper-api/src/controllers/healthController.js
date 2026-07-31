import { successResponse } from '../utils/response.js';

export function getHealth(req, res) {
  return successResponse(res, {
    status: 'ok',
    service: 'ticha-past-paper-api',
    version: 'v1',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
