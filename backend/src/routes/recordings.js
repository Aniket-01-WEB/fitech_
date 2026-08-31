import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

const EDITABLE_FIELDS = [
  'title',
  'type',
  'speaker',
  'banner',
  'recording_date',
  'duration_label',
  'duration_seconds',
  'video_url',
  'description',
  'takeaways',
];

// GET /api/recordings — any authenticated member (student or staff).
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('recordings').select('*').order('created_at', { ascending: false });
  if (error) return sendError(res, error);
  res.json({ recordings: data });
});

// POST /api/recordings — staff-only via RLS.
router.post('/', requireUser, async (req, res) => {
  const { title, type, speaker, banner, recording_date, duration_label, duration_seconds, video_url, description, takeaways } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required.' });

  const { data, error } = await req.supabase
    .from('recordings')
    .insert({ title, type, speaker, banner, recording_date, duration_label, duration_seconds, video_url, description, takeaways })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ recording: data });
});

// PATCH /api/recordings/:id — staff-only via RLS.
router.patch('/:id', requireUser, async (req, res) => {
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in req.body) updates[field] = req.body[field];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No editable fields supplied.' });
  }

  const { data, error } = await req.supabase.from('recordings').update(updates).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ recording: data });
});

// DELETE /api/recordings/:id — staff-only via RLS.
router.delete('/:id', requireUser, async (req, res) => {
  const { error } = await req.supabase.from('recordings').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);
  res.json({ ok: true });
});

export default router;
