import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  console.error('Unhandled API Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  return errorResponse(res, message, statusCode, code);
}

export function notFoundHandler(req, res) {
  return errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND');
}
