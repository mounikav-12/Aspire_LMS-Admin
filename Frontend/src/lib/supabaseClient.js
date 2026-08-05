import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iaeldznsedqjedyetmnv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZWxkem5zZWRxamVkeWV0bW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDAwMzMsImV4cCI6MjEwMTQ3NjAzM30.A7anl7cCSkXRPThP44LWezE17qMwYB1Ux8-h2FTnyQY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
