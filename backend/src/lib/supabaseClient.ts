import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase config missing: set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

/**
 * Builds a request-scoped Supabase client that forwards the caller's own
 * access token (`Authorization: Bearer <token>`), so every query runs
 * through Postgres Row Level Security exactly as if the browser had
 * called Supabase directly. This backend holds no service-role key and
 * never bypasses RLS.
 */
export function supabaseFromRequest(req) {
  const authHeader = req.headers['authorization'] || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Resolves the authenticated user for a request-scoped client, or null. */
export async function getRequestUser(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}
