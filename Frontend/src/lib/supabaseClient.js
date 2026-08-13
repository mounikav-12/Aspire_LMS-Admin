import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Aspire LMS] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in Frontend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

