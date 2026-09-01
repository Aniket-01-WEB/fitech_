import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { requireStaff } from '../middleware/requireStaff.js';
import { sendError } from '../lib/errorResponse.js';
import { getUploadUrl, getDownloadUrl, deleteObject, buildKey } from '../lib/r2.js';
import { sensitiveActionLimiter } from '../lib/rateLimit.js';
import {
  validateBody,
  validateIdParam,
  recordingCreateSchema,
  recordingUpdateSchema,
  uploadUrlSchema,
  ALLOWED_RECORDING_MIME_TYPES,
  MAX_RECORDING_BYTES,
} from '../lib/validation.js';

const router = Router();

// GET /api/recordings — RLS narrows this to approved recordings for a
// student, everything for staff. Same R2 overlay as notes: a row backed
// by an uploaded file (r2_key set) gets a freshly-minted, short-lived
// video URL instead of whatever's stored in video_url.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('recordings').select('*').order('created_at', { ascending: false });
  if (error) return sendError(res, error);

  const recordings = await Promise.all(data.map(async (rec) => {
    if (!rec.r2_key) return rec;
    try {
      return { ...rec, video_url: await getDownloadUrl(rec.r2_key) };
    } catch (err) {
      console.error('Failed to sign R2 download URL for recording', rec.id, err);
      return rec;
    }
  }));

  res.json({ recordings });
});

// POST /api/recordings/upload-url — staff-only. Same presigned-PUT
// pattern as notes (allowlisted MIME type, size cap bound into the
// signature); the browser uploads the video bytes straight to R2.
router.post('/upload-url', requireUser, requireStaff, sensitiveActionLimiter, validateBody(uploadUrlSchema), async (req, res) => {
  const { fileName, contentType, fileSize } = req.body;

  if (contentType && !ALLOWED_RECORDING_MIME_TYPES.has(contentType)) {
    return res.status(400).json({ error: `File type "${contentType}" isn't allowed for recordings.` });
  }
  if (fileSize && fileSize > MAX_RECORDING_BYTES) {
    return res.status(400).json({ error: 'File is too large (750MB max for recordings).' });
  }

  const key = buildKey('recordings', req.user.id, fileName);
  try {
    const uploadUrl = await getUploadUrl(key, contentType, fileSize);
    res.json({ uploadUrl, key });
  } catch (err) {
    console.error('Failed to mint R2 upload URL', err);
    res.status(500).json({ error: 'Could not prepare the upload. Try again.' });
  }
});

// POST /api/recordings — staff-only via RLS. video_url (an external
// link, https only) and r2_key (an uploaded file) are both optional and
// independent — either, both, or neither may be set. New recordings
// always start 'pending' (recordings_force_pending trigger).
router.post('/', requireUser, validateBody(recordingCreateSchema), async (req, res) => {
  const { data, error } = await req.supabase.from('recordings').insert(req.body).select().single();
  if (error) return sendError(res, error, 403);
  res.status(201).json({ recording: data });
});

// PATCH /api/recordings/:id — staff-only via RLS.
router.patch('/:id', requireUser, validateIdParam, validateBody(recordingUpdateSchema), async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No editable fields supplied.' });
  }

  const { data, error } = await req.supabase.from('recordings').update(req.body).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ recording: data });
});

// POST /api/recordings/:id/approve — the recordings_guard_status trigger
// rejects this unless the caller is a superadmin.
router.post('/:id/approve', requireUser, validateIdParam, async (req, res) => {
  const { data, error } = await req.supabase
    .from('recordings')
    .update({ status: 'approved' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ recording: data });
});

// POST /api/recordings/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, validateIdParam, async (req, res) => {
  const { data, error } = await req.supabase
    .from('recordings')
    .update({ status: 'rejected' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ recording: data });
});

// POST /api/recordings/:id/resubmit — the uploader can move a rejected
// recording back to pending for another review.
router.post('/:id/resubmit', requireUser, validateIdParam, async (req, res) => {
  const { data, error } = await req.supabase
    .from('recordings')
    .update({ status: 'pending' })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return sendError(res, error, 403);
  res.json({ recording: data });
});

// DELETE /api/recordings/:id — staff-only via RLS. Best-effort cleanup of
// the R2 object; a failed R2 delete never blocks removing the row.
router.delete('/:id', requireUser, validateIdParam, async (req, res) => {
  const { data: existing } = await req.supabase.from('recordings').select('r2_key').eq('id', req.params.id).single();

  const { error } = await req.supabase.from('recordings').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);

  if (existing?.r2_key) {
    deleteObject(existing.r2_key).catch(err => console.error('Failed to delete R2 object for recording', req.params.id, err));
  }

  res.json({ ok: true });
});

export default router;
