const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://iaeldznsedqjedyetmnv.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZWxkem5zZWRxamVkeWV0bW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDAwMzMsImV4cCI6MjEwMTQ3NjAzM30.A7anl7cCSkXRPThP44LWezE17qMwYB1Ux8-h2FTnyQY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
