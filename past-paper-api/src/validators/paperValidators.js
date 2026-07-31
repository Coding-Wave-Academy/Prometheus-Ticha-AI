import { z } from 'zod';

export const papersQuerySchema = z.object({
  level: z.string().optional(),
  subject: z.string().optional(),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  q: z.string().trim().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform((v) => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
});

export const subjectsQuerySchema = z.object({
  level: z.string().optional(),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid paper UUID format'),
});

export const downloadQuerySchema = z.object({
  redirect: z.string().optional().transform((v) => v !== 'false'),
});
