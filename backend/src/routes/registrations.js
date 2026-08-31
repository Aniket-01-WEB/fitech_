import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

// GET /api/registrations — RLS decides scope: a student sees only their
// own registrations; admin/superadmin sees everyone's. Pass ?event_id=123
// to inspect who's registered for a specific event (the "Inspector" view).
router.get('/', requireUser, async (req, res) => {
  const { event_id } = req.query;

  let query = req.supabase
    .from('event_registrations')
    .select('*, events(*), profiles(*)')
    .order('registered_at', { ascending: false });

  if (event_id) query = query.eq('event_id', event_id);

  const { data, error } = await query;
  if (error) return sendError(res, error);
  res.json({ registrations: data });
});

// POST /api/registrations — join an event. A student can only register
// themselves (their own uid), and only for an already-approved event —
// both enforced by the registrations_insert_own_approved_event RLS policy.
router.post('/', requireUser, async (req, res) => {
  const { event_id } = req.body;
  if (!event_id) return res.status(400).json({ error: 'event_id is required.' });

  const { data, error } = await req.supabase
    .from('event_registrations')
    .insert({ event_id, user_id: req.user.id })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ registration: data });
});

// DELETE /api/registrations/:eventId — leave an event. RLS only allows a
// student to delete their own registration row.
router.delete('/:eventId', requireUser, async (req, res) => {
  const { error } = await req.supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', req.params.eventId)
    .eq('user_id', req.user.id);

  if (error) return sendError(res, error);
  res.json({ ok: true });
});

export default router;
