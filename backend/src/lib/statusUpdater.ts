import { sendError } from './errorResponse.js';

/**
 * Returns an Express route handler that updates a row's status in the given
 * table. The actual authorization check is enforced by Postgres triggers/RLS,
 * not this helper — it just writes the status change and lets the database
 * accept or reject it.
 *
 * @param {string} table      Supabase table name (e.g. 'events', 'notes')
 * @param {string} newStatus  Target status ('approved' | 'rejected' | 'pending')
 * @param {string} responseKey JSON key to wrap the returned row in
 */
export function statusHandler(table, newStatus, responseKey) {
  return async (req, res) => {
    const { data, error } = await req.supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return sendError(res, error, 403);
    res.json({ [responseKey]: data });
  };
}
