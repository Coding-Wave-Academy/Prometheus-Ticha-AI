import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('past-papers'),
  SIGNED_URL_EXPIRES_IN: z.string().default('60').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('60').transform((val) => parseInt(val, 10)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  // In non-test environments, throw error to prevent startup with bad config
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Invalid environment configuration');
  }
}

export const env = parsed.success ? parsed.data : {
  PORT: 4000,
  NODE_ENV: 'test',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://mock.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'mock-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
  SUPABASE_STORAGE_BUCKET: 'past-papers',
  SIGNED_URL_EXPIRES_IN: 60,
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX: 60,
};
