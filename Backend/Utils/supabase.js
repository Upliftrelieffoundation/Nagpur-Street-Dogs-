import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); // Load .env before reading process.env values

// We use the SERVICE ROLE key here (backend only - never expose to the browser!)
// This key bypasses Row Level Security so our Express server can do admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase environment variables missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are added to Vercel.');
  
  // Safe mock client to prevent the Express application from crashing at import time
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }) }) }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
      getUser: () => Promise.resolve({ data: null, error: new Error('Supabase variables not set') }),
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export default supabase;
