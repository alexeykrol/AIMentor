import { createClient } from '@supabase/supabase-js';
import { Database } from './db_types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Security: Only log status in development, never expose actual keys
if (import.meta.env.DEV) {
  console.log('🔗 Supabase URL:', supabaseUrl ? 'Configured' : 'Missing');
  console.log('🔑 Supabase Key:', supabaseAnonKey ? 'Loaded' : 'Missing');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

