import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Prefer service role key if available for administrative signed URLs and RPCs, else fallback to anon key
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

export const supabase = createClient(env.SUPABASE_URL, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
