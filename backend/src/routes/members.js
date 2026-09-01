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

export default router;
