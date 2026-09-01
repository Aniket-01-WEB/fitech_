import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { requireStaff } from '../middleware/requireStaff.js';
import { sendError } from '../lib/errorResponse.js';
import { getUploadUrl, getDownloadUrl, deleteObject, buildKey } from '../lib/r2.js';

const router = Router();

// GET /api/notes — RLS already narrows this to approved notes for a
// student, everything for staff. For any row backed by an R2 upload
// (r2_key set), overlay a freshly-minted, short-lived download URL onto
// file_url — the R2 object itself is never public, and this URL is never
// persisted, just handed to a caller RLS has already cleared to see it.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .select('*, uploaded_by_profile:profiles!notes_uploaded_by_fkey(email)')
    .order('created_at', { ascending: false });
  if (error) return sendError(res, error);

  const notes = await Promise.all(data.map(async (note) => {
    if (!note.r2_key) return note;
    try {
      return { ...note, file_url: await getDownloadUrl(note.r2_key) };
    } catch (err) {
      console.error('Failed to sign R2 download URL for note', note.id, err);
      return note;
    }
  }));

  res.json({ notes });
});

// POST /api/notes/upload-url — staff-only. Mints a presigned PUT URL the
// browser uploads the file bytes to directly; the backend never proxies
// them. RLS can't protect this (there's no row yet), so requireStaff
// checks the caller's role explicitly.
router.post('/upload-url', requireUser, requireStaff, async (req, res) => {
  const { fileName, contentType } = req.body ?? {};
  if (!fileName) return res.status(400).json({ error: 'fileName is required.' });

  const key = buildKey('notes', req.user.id, fileName);
  try {
    const uploadUrl = await getUploadUrl(key, contentType);
    res.json({ uploadUrl, key });
  } catch (err) {
    console.error('Failed to mint R2 upload URL', err);
    res.status(500).json({ error: 'Could not prepare the upload. Try again.' });
  }
});

// POST /api/notes — staff-only via RLS. Requires a file_url, an
// external_link, or an r2_key (an object already PUT to R2 via the
// presigned URL above) — the notes_has_source check constraint enforces
// this. New notes always start 'pending' (notes_force_pending trigger).
router.post('/', requireUser, async (req, res) => {
  const { title, domain, description, file_url, external_link, file_type, topics, r2_key } = req.body;

  if (!title) return res.status(400).json({ error: 'title is required.' });
  if (!file_url && !external_link && !r2_key) {
    return res.status(400).json({ error: 'Provide a file_url, an external_link, or upload a file first.' });
  }

  const { data, error } = await req.supabase
    .from('notes')
    .insert({ title, domain, description, file_url, external_link, file_type, topics, r2_key })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ note: data });
});

// POST /api/notes/:id/approve — the notes_guard_status trigger rejects
// this unless the caller is a superadmin.
router.post('/:id/approve', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .update({ status: 'approved' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ note: data });
});

// POST /api/notes/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .update({ status: 'rejected' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ note: data });
});

// POST /api/notes/:id/resubmit — the uploader can move a rejected note
// back to pending for another review.
router.post('/:id/resubmit', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .update({ status: 'pending' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ note: data });
});

// DELETE /api/notes/:id — staff-only via RLS. Best-effort cleanup of the
// R2 object; the row is the source of truth, so a failed R2 delete never
// blocks removing the row.
router.delete('/:id', requireUser, async (req, res) => {
  const { data: existing } = await req.supabase.from('notes').select('r2_key').eq('id', req.params.id).single();

  const { error } = await req.supabase.from('notes').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);

  if (existing?.r2_key) {
    deleteObject(existing.r2_key).catch(err => console.error('Failed to delete R2 object for note', req.params.id, err));
  }

  res.json({ ok: true });
});

export default router;
