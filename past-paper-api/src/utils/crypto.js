import crypto from 'crypto';

export function hashApiKey(key) {
  if (!key || typeof key !== 'string') return '';
  return crypto.createHash('sha256').update(key.trim()).digest('hex');
}
