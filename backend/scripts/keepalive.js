import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase pauses a free-tier project after 7 days with no activity.
 * This makes one trivial, real read against Postgres — same
 * RLS-respecting anon client every other part of this backend uses, no
 * service-role key — so Supabase counts it as genuine activity and never
 * pauses the project. Meant to run on a schedule well inside that
 * 7-day window (see .github/workflows/supabase-keepalive.yml, every 5
 * days) rather than as part of the long-running Express process, since
 * nothing here guarantees the server itself stays up for 5 days straight.
 */
async function keepSupabaseAwake() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set (as env vars or in backend/.env).');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Any real query works — profiles is small and always exists. RLS still
  // applies (this uses the anon key, no session), so this returns zero
  // rows for an anonymous caller; the query still executing is what
  // counts as activity, not what it returns.
  const { error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    throw new Error(`Supabase keepalive query failed: ${error.message}`);
  }

  console.log(`[keepalive] Supabase ping OK at ${new Date().toISOString()}`);
}

keepSupabaseAwake().catch((err) => {
  console.error('[keepalive] FAILED:', err.message);
  process.exit(1);
});
