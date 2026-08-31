import { Router } from 'express';
import { requireUser, attachSupabase } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

const EDITABLE_FIELDS = ['title', 'type', 'banner', 'event_time', 'event_time_label', 'venue', 'description'];

// GET /api/events — no auth required. RLS decides scope: an
// anonymous/student caller only ever sees status='approved' rows; an
// admin/superadmin sees every event, including pending and rejected ones.
router.get('/', attachSupabase, async (req, res) => {
  const { data, error } = await req.supabase.from('events').select('*').order('created_at', { ascending: false });
  if (error) return sendError(res, error);
  res.json({ events: data });
});

// POST /api/events — create an event request. Only admin/superadmin may
// insert (enforced by RLS), and the events_force_pending trigger stamps
// status='pending' and created_by=auth.uid() server-side regardless of
// what's in the request body — an admin cannot self-approve by lying here.
router.post('/', requireUser, async (req, res) => {
  const { title, type, banner, event_time, event_time_label, venue, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required.' });

  const { data, error } = await req.supabase
    .from('events')
    .insert({ title, type, banner, event_time, event_time_label, venue, description })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ event: data });
});

// PATCH /api/events/:id — edit event content. Staff-only via RLS.
// (Deliberately excludes `status` — see /approve, /reject, /resubmit,
// which are the only paths that can change it.)
router.patch('/:id', requireUser, async (req, res) => {
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in req.body) updates[field] = req.body[field];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No editable fields supplied.' });
  }

  const { data, error } = await req.supabase.from('events').update(updates).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ event: data });
});

// DELETE /api/events/:id — staff-only via RLS.
router.delete('/:id', requireUser, async (req, res) => {
  const { error } = await req.supabase.from('events').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);
  res.json({ ok: true });
});

// POST /api/events/:id/approve — the events_guard_status_change trigger
// rejects this update unless the caller's profile role is 'superadmin',
// so this route needs no extra role check of its own — the database is
// the actual enforcement point.
router.post('/:id/approve', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('events').update({ status: 'approved' }).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ event: data });
});

// POST /api/events/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('events').update({ status: 'rejected' }).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ event: data });
});

// POST /api/events/:id/resubmit — an admin moving their own rejected
// event back to 'pending' for another look (or a super admin, via the
// same trigger's staff branch).
router.post('/:id/resubmit', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('events').update({ status: 'pending' }).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ event: data });
});

export default router;
