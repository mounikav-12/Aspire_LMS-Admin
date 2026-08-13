const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Aspire LMS] SUPABASE_URL and SUPABASE_ANON_KEY must be set in backend/.env\n' +
    'Copy backend/.env.example to backend/.env and fill in your new Supabase project credentials.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
