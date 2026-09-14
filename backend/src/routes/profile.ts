import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';
import { validateBody, profileUpdateSchema } from '../lib/validation.js';

const router = Router();

// GET /api/profile — the caller's own profile row.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase.from('profiles').select('*').eq('id', req.user.id).single();
  if (error) return sendError(res, error);
  res.json({ profile: data });
});

// PATCH /api/profile — update the caller's own academic details.
// `role` is intentionally never accepted here — the request schema
// rejects any field outside the allowlist, and it's also blocked by the
// prevent_self_role_escalation trigger at the database level regardless.
router.patch('/', requireUser, validateBody(profileUpdateSchema), async (req, res) => {
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No editable fields supplied.' });
  }

  const { data, error } = await req.supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return sendError(res, error);
  res.json({ profile: data });
});

export default router;
