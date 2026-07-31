import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { getApiClientByKey } from '../services/apiClientService.js';
import { errorResponse } from '../utils/response.js';

// Tier limit definitions (requests per 1 minute window)
const TIER_LIMITS = {
  free: 100,
  pro: 1000,
  enterprise: 5000,
};

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: async (req) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      const client = await getApiClientByKey(apiKey);
      if (client && TIER_LIMITS[client.tier]) {
        req.apiClient = client;
        return TIER_LIMITS[client.tier];
      }
    }
    return env.RATE_LIMIT_MAX; // Fallback default (60 req/min)
  },
  keyGenerator: (req) => {
    // If a valid API client was found, group by client ID, otherwise group by IP
    const apiKey = req.headers['x-api-key'];
    if (apiKey && req.apiClient) {
      return `client_${req.apiClient.id}`;
    }
    return req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  },
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many requests from this IP or API key. Please slow down.',
      429,
      'TOO_MANY_REQUESTS'
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});
