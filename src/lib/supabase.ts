import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe debug logging (only shows presence and first few chars)
console.log('--- Supabase Config Debug ---');
console.log('URL Present:', !!supabaseUrl);
if (supabaseUrl) console.log('URL Starts with:', supabaseUrl.substring(0, 10) + '...');
console.log('Key Present:', !!supabaseAnonKey);
if (supabaseAnonKey) console.log('Key Starts with:', supabaseAnonKey.substring(0, 10) + '...');
console.log('-----------------------------');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'MISSING SUPABASE CREDENTIALS: ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables. ' +
    'If you are using Vercel, add them in the Project Settings > Environment Variables.'
  );
}

// Initialize with placeholder if missing to prevent crash, but log error
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
