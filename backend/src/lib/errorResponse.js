/**
 * Maps a Postgres/PostgREST error to an HTTP response. Only two kinds of
 * Postgres error are safe to forward verbatim to the client:
 *  - 42501 (insufficient_privilege): an RLS policy denied the row.
 *  - P0001 (raise_exception): one of our own trigger-raised exceptions,
 *    whose messages are deliberately written to be safe, user-facing
 *    explanations (e.g. "Only a super admin can approve or reject...").
 * Everything else — constraint violations, malformed input that reached
 * Postgres, unexpected error shapes — can echo back column/table/
 * constraint names, so those are logged in full server-side and the
 * client gets a generic, safe message instead.
 */
export function sendError(res, error, fallbackStatus = 400) {
  const code = error?.code;

  if (code === '42501') {
    return res.status(403).json({ error: 'Not authorized to perform this action.' });
  }
  if (code === 'P0001') {
    return res.status(fallbackStatus).json({ error: error.message });
  }
  if (code === '23505') { // unique_violation
    return res.status(409).json({ error: 'This already exists.' });
  }
  if (code === 'PGRST116') { // PostgREST: no row found for .single()
    return res.status(404).json({ error: 'Not found.' });
  }

  console.error('[db error]', error);
  return res.status(fallbackStatus).json({ error: 'Request could not be completed.' });
}
