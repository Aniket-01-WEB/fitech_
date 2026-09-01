import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

// GET /api/admin-requests — a student sees only their own request (RLS);
// admin/superadmin see every request.
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('admin_requests')
    .select('*, profiles!admin_requests_user_id_fkey(name, email, role)')
    .order('requested_at', { ascending: false });

  if (error) return sendError(res, error);
  res.json({ adminRequests: data });
});

// POST /api/admin-requests — apply for admin access. One row per user
// (unique constraint); resubmitting after rejection uses PATCH below.
router.post('/', requireUser, async (req, res) => {
  const { reason } = req.body ?? {};
  const { data, error } = await req.supabase
    .from('admin_requests')
    .insert({ user_id: req.user.id, reason: reason || null })
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.status(201).json({ adminRequest: data });
});

// POST /api/admin-requests/:id/approve — the admin_requests_guard_status
// trigger rejects this unless the caller is a superadmin, and grants the
// admin role on the target profile as part of the same transaction.
router.post('/:id/approve', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('admin_requests')
    .update({ status: 'approved' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.json({ adminRequest: data });
});

// POST /api/admin-requests/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('admin_requests')
    .update({ status: 'rejected' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.json({ adminRequest: data });
});

// POST /api/admin-requests/:id/resubmit — the request's own owner can move
// a rejected request back to pending (guarded by the same trigger).
router.post('/:id/resubmit', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('admin_requests')
    .update({ status: 'pending' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return sendError(res, error, 403);
  res.json({ adminRequest: data });
});

export default router;
