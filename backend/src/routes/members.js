import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

// GET /api/members — the full member directory. RLS only returns every
// row to admin/superadmin; a student calling this only ever gets their
// own row back (the profiles_select_own_or_staff policy), which is safe.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendError(res, error);
  res.json({ members: data });
});

// POST /api/members/:id/approve — the guard_membership_status_change
// trigger rejects this unless the caller's role is 'superadmin', so no
// extra role check is needed here — same pattern as event approval.
router.post('/:id/approve', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('profiles')
    .update({ membership_status: 'approved' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.json({ member: data });
});

// POST /api/members/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('profiles')
    .update({ membership_status: 'rejected' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.json({ member: data });
});

export default router;
