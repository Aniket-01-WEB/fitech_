import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

// GET /api/notes — any authenticated member.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .select('*, uploaded_by_profile:profiles!notes_uploaded_by_fkey(email)')
    .order('created_at', { ascending: false });
  if (error) return sendError(res, error);
  res.json({ notes: data });
});

// POST /api/notes — staff-only via RLS. Requires a file_url (e.g. a
// Supabase Storage object URL) or an external_link — the
// notes_has_source check constraint rejects a note with neither.
router.post('/', requireUser, async (req, res) => {
  const { title, domain, description, file_url, external_link, file_type, topics } = req.body;

  if (!title) return res.status(400).json({ error: 'title is required.' });
  if (!file_url && !external_link) {
    return res.status(400).json({ error: 'Provide a file_url or an external_link.' });
  }

  const { data, error } = await req.supabase
    .from('notes')
    .insert({ title, domain, description, file_url, external_link, file_type, topics })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ note: data });
});

// DELETE /api/notes/:id — staff-only via RLS.
router.delete('/:id', requireUser, async (req, res) => {
  const { error } = await req.supabase.from('notes').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);
  res.json({ ok: true });
});

export default router;
