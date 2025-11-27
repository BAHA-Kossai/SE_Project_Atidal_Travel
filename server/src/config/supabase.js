import { createClient } from '@supabase/supabase-js';
import config from './config.js';

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY ||!config.SUPABASE_SERVICE_ROLE_KEY ) {
  throw new Error('Missing Supabase environment variables - check your .env file');
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
// For admin actions (server-side)
export const supabaseAdmin = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
export default supabase;