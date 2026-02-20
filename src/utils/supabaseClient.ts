import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey;

if (!isConfigured) {
  console.warn(
    'Supabase environment variables are missing or invalid. The app will run in read-only/demo mode with mock data where possible.'
  );
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
    from: (_table: string) => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        then: (resolve: any) => resolve({ data: [], error: null }), // Make it thenable
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        upload: () => Promise.resolve({ data: null, error: null }),
      })
    }
  } as any;

// Mock data for development (when Supabase is not configured)
export const mockProjects: any[] = [];

export const mockEducation: any[] = [];

export const mockAchievements: any[] = [];

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return isConfigured;
};
