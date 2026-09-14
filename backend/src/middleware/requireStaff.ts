/**
 * Use after `requireUser` on routes that reach an external service RLS
 * can't protect (e.g. minting an R2 presigned upload URL) — there's no
 * Postgres row for RLS to gate, so the staff check has to happen here
 * instead. Attaches `req.profile`.
 */
export async function requireStaff(req, res, next) {
  const { data, error } = await req.supabase.from('profiles').select('role').eq('id', req.user.id).single();
  if (error || !data || !['admin', 'superadmin'].includes(data.role)) {
    return res.status(403).json({ error: 'Staff access required.' });
  }
  req.profile = data;
  next();
}
