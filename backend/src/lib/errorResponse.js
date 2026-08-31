/**
 * Maps a Postgres/PostgREST error to an HTTP response. RLS policy and
 * trigger rejections both surface here (e.g. "Only a super admin can
 * approve or reject an event.") — the database's own message is already
 * written to be a safe, user-facing explanation, so we forward it as-is.
 */
export function sendError(res, error, fallbackStatus = 400) {
  const message = error?.message || String(error) || 'Unexpected error';
  // Postgres permission/RLS denials surface as 42501; treat those as 403.
  const status = error?.code === '42501' ? 403 : fallbackStatus;
  return res.status(status).json({ error: message });
}
