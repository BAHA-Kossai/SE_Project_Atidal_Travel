import { createClient } from '@supabase/supabase-js';
import config from './config.js';

// Check if environment variables exist
if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables - check your .env file');
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

export default supabase;