import { Router } from 'express';
import { requireUser, attachSupabase } from '../middleware/requireUser.js';
import { sendError } from '../lib/errorResponse.js';
import { statusHandler } from '../lib/statusUpdater.js';
import { validateBody, validateIdParam, eventCreateSchema, eventUpdateSchema } from '../lib/validation.js';

const router = Router();

const FALLBACK_EVENTS = [
  {
    id: 'demo-evt-1',
    title: 'Adamas FinTech & Quantitative Research Summit',
    type: 'FLAGSHIP SUMMIT',
    banner: '/images/event-summit.jpg',
    image: '/images/event-summit.jpg',
    event_time_label: 'March 28, 2026 • 10:00 AM IST',
    venue: 'Adamas University Main Auditorium',
    description: 'Premier academic and industry gathering featuring quantitative researchers, fintech leaders, algorithmic labs, and student innovators.',
    status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-evt-2',
    title: 'DeFi Liquidity Pools & Invariant Modeling Summit',
    type: 'SUMMIT',
    banner: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    event_time_label: 'April 02, 2026 • 5:30 PM EST',
    venue: 'Main Auditorium & YouTube Live',
    description: 'Analyzing Uniswap v4 hook architecture, concentrated liquidity invariants, and MEV arbitrage searchers.',
    status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-evt-3',
    title: 'AI Transformer Volatility Forecasting Hackathon',
    type: 'HACKATHON',
    banner: 'linear-gradient(135deg, #064e3b, #047857)',
    event_time_label: 'April 20, 2026 • 10:00 AM EST',
    venue: 'Computational Finance Center',
    description: 'Build predictive volatility surfaces using domain-adapted LLMs and time-series transformer architectures.',
    status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-evt-4',
    title: '2025 Algorithmic Trading Architecture Symposium',
    type: 'PAST EVENT 2025',
    banner: 'linear-gradient(135deg, #334155, #475569)',
    event_time_label: 'December 12, 2025',
    venue: 'Archived Recording',
    description: 'Retrospective analysis of zero-copy network stacks and kernel-bypass TCP socket programming in trading systems.',
    status: 'approved',
    created_at: new Date('2025-12-12').toISOString()
  }
];

// GET /api/events — no auth required. RLS decides scope: an
// anonymous/student caller only ever sees status='approved' rows; an
// admin/superadmin sees every event, including pending and rejected ones.
router.get('/', attachSupabase, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('events')
      .select('*, created_by_profile:profiles!events_created_by_fkey(email), reviewed_by_profile:profiles!events_reviewed_by_fkey(email)')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return res.json({ events: data });
    }
    // If Supabase is paused, unreachable, or empty, return fallback approved events
    res.json({ events: FALLBACK_EVENTS });
  } catch (err) {
    res.json({ events: FALLBACK_EVENTS });
  }
});

// POST /api/events — create an event request. Only admin/superadmin may
// insert (enforced by RLS), and the events_force_pending trigger stamps
// status='pending' and created_by=auth.uid() server-side regardless of
// what's in the request body — an admin cannot self-approve by lying here.
router.post('/', requireUser, validateBody(eventCreateSchema), async (req, res) => {
  const { data, error } = await req.supabase.from('events').insert(req.body).select().single();
  if (error) return sendError(res, error, 403);
  res.status(201).json({ event: data });
});

// PATCH /api/events/:id — edit event content. Staff-only via RLS.
// (Deliberately excludes `status` — see /approve, /reject, /resubmit,
// which are the only paths that can change it.)
router.patch('/:id', requireUser, validateIdParam, validateBody(eventUpdateSchema), async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No editable fields supplied.' });
  }

  const { data, error } = await req.supabase.from('events').update(req.body).eq('id', req.params.id).select().single();
  if (error) return sendError(res, error, 403);
  res.json({ event: data });
});

// DELETE /api/events/:id — staff-only via RLS.
router.delete('/:id', requireUser, validateIdParam, async (req, res) => {
  const { error } = await req.supabase.from('events').delete().eq('id', req.params.id);
  if (error) return sendError(res, error, 403);
  res.json({ ok: true });
});

// POST /api/events/:id/approve — the events_guard_status_change trigger
// rejects this update unless the caller's profile role is 'superadmin',
// so this route needs no extra role check of its own — the database is
// the actual enforcement point.
router.post('/:id/approve', requireUser, validateIdParam, statusHandler('events', 'approved', 'event'));

// POST /api/events/:id/reject — same guard as /approve.
router.post('/:id/reject', requireUser, validateIdParam, statusHandler('events', 'rejected', 'event'));

// POST /api/events/:id/resubmit — an admin moving their own rejected
// event back to 'pending' for another look (or a super admin, via the
// same trigger's staff branch).
router.post('/:id/resubmit', requireUser, validateIdParam, statusHandler('events', 'pending', 'event'));

export default router;
