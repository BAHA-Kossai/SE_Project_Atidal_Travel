import { createClient } from '@supabase/supabase-js';
import config from './config.js';

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables!\n' +
    'Please create a .env file in the server directory with the following variables:\n' +
    '  SUPABASE_URL=your_supabase_project_url\n' +
    '  SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    'You can find these values in your Supabase project dashboard:\n' +
    '  https://app.supabase.com -> Project Settings -> API'
  );
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

export default supabase;