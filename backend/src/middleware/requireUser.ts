import { supabaseFromRequest, getRequestUser } from '../lib/supabaseClient.js';

/**
 * Attaches `req.supabase` (a request-scoped client carrying the caller's
 * token) and `req.user`, or responds 401 if no valid session was presented.
 * Use on any route that must be signed in.
 */
export async function requireUser(req, res, next) {
  const supabase = supabaseFromRequest(req);
  const user = await getRequestUser(supabase);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.supabase = supabase;
  req.user = user;
  next();
}

/**
 * Attaches `req.supabase` without requiring a session — for routes an
 * anonymous caller may also hit (e.g. browsing approved events). RLS still
 * applies; it just narrows what an anonymous caller can see.
 */
export function attachSupabase(req, res, next) {
  req.supabase = supabaseFromRequest(req);
  next();
}
