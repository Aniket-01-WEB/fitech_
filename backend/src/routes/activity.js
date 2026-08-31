import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';

const router = Router();

// GET /api/activity — the caller's own tracked time. Returns zeros if no
// row exists yet (a student who has never triggered a PATCH).
router.get('/', requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from('student_activity')
    .select('*')
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) return sendError(res, error);

  res.json({
    activity: data || {
      user_id: req.user.id,
      total_seconds: 0,
      website_seconds: 0,
      recording_seconds: 0,
      sessions_watched: 0,
      last_active: null,
    },
  });
});

// PATCH /api/activity — increment the caller's own tracked time atomically
// via the increment_activity() RPC (avoids read-then-write races from a
// client polling this once a second).
// Body: { deltaWebSec?: number, deltaRecSec?: number, watchedSessionIncrement?: boolean }
router.patch('/', requireUser, async (req, res) => {
  const deltaWebSec = Number(req.body.deltaWebSec) || 0;
  const deltaRecSec = Number(req.body.deltaRecSec) || 0;
  const watchedSessionIncrement = Boolean(req.body.watchedSessionIncrement);

  const { data, error } = await req.supabase.rpc('increment_activity', {
    delta_web: deltaWebSec,
    delta_rec: deltaRecSec,
    increment_session: watchedSessionIncrement,
  });

  if (error) return sendError(res, error);
  res.json({ activity: data });
});

export default router;
