# MATRIX Backend

Standalone Node.js/Express API for the MATRIX FinTech Club app. Talks to Supabase Postgres, forwarding each caller's own access token so Postgres Row Level Security is the real enforcement point — this service holds no service-role key and never bypasses RLS.

## Getting Started

```bash
npm install
cp .env.example .env   # already filled in for this project — edit if you point at a different Supabase project
npm run dev            # http://localhost:4000, auto-restarts on file changes
```

`GET /health` is a quick liveness check.

**Live**: https://fitech-02.onrender.com (Render). Frontend is live at https://fintechclub-phi.vercel.app — both verified working together end-to-end (a real login round-trip against the deployed instances, not just a config check): Supabase connectivity, R2 presigned uploads, CORS, and security headers all confirmed live. Render's free tier sleeps after 15 minutes idle — see "Keeping Render awake" below for how that's handled.

## Structure

```
src/
  server.js              Express app entry — helmet, CORS allowlist, JSON body parsing, rate limiting, error handler
  lib/
    supabaseClient.js     builds a request-scoped Supabase client from the caller's Bearer token
    errorResponse.js      maps Postgres/RLS errors to HTTP responses (only pre-approved error codes are ever forwarded verbatim)
    r2.js                  Cloudflare R2 client — mints presigned PUT/GET URLs, never proxies file bytes
    validation.js          Zod schemas + validateBody/validateQuery/validateIdParam middleware, upload MIME/size allowlists
    rateLimit.js            general (120/min) and sensitive-action (10/min: R2 upload-url, admin-requests) limiters
  middleware/
    requireUser.js        401-gates a route; attaches req.supabase / req.user
    requireStaff.js        403-gates a route RLS can't protect (e.g. minting an R2 upload URL); attaches req.profile
  routes/
    profile.js, events.js, registrations.js, recordings.js, notes.js, activity.js, members.js, adminRequests.js
scripts/
  keepalive.js            one real Supabase read, so a free-tier project never auto-pauses (see below)
supabase/
  migrations/              the SQL that defines the schema, RLS policies, and triggers this API relies on
```

See [`SECURITY_AUDIT.md`](../SECURITY_AUDIT.md) at the repo root for the full security posture — what's enforced where, what was tested live, and the honestly-disclosed remaining trade-offs.

## Keeping Supabase awake

A free-tier Supabase project pauses itself after 7 days with no activity. `npm run keepalive` (`scripts/keepalive.js`) does one trivial, RLS-respecting read — same anon client every other route uses, no service-role key — which counts as activity.

This deliberately does **not** run as a timer inside the long-running Express process: nothing guarantees this server stays up continuously for 5 days straight (it doesn't, in local dev), so a `setInterval`/`node-cron` in here wouldn't reliably fire. Instead, [`.github/workflows/supabase-keepalive.yml`](../.github/workflows/supabase-keepalive.yml) runs it on a schedule (every 5 days) via GitHub Actions — that fires regardless of whether anyone's server or machine is running.

**One-time setup**: add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as repo secrets (GitHub → Settings → Secrets and variables → Actions) — same values as `backend/.env`. Without them the scheduled run fails (visible in the Actions tab, doesn't affect anything else). You can also trigger it manually from the Actions tab (`workflow_dispatch`) to test it right away.

## Keeping Render awake

A different problem from the one above, on a completely different timescale: Render's free tier spins the backend process itself down after 15 minutes with no traffic, and the first request after that fails to connect outright (not just slow) while the container wakes back up — a real user hitting the live site during that window sees a clean "can't reach the server" error rather than the app crashing (see `frontend/src/lib/api.js`), but it's still a bad first impression.

[`.github/workflows/render-keepalive.yml`](../.github/workflows/render-keepalive.yml) pings `/health` every 10 minutes — comfortably under the 15-minute threshold — so the instance never actually goes idle. No secrets needed (it's just a public health check); nothing to configure. Trigger it manually from the Actions tab to test it, or just watch it run on schedule.

## API routes

All routes expect `Authorization: Bearer <supabase access token>` except the public `GET` reads.

| Route | Method | Who |
|---|---|---|
| `/api/profile` | GET / PATCH | self |
| `/api/events` | GET (public sees approved only; staff sees all) / POST (admin/superadmin) | |
| `/api/events/:id` | PATCH / DELETE | admin/superadmin |
| `/api/events/:id/approve`, `/reject` | POST | superadmin |
| `/api/events/:id/resubmit` | POST | the event's creator, or superadmin |
| `/api/registrations` | GET (own, or `?event_id=` for staff) / POST (join) | self / staff |
| `/api/registrations/:eventId` | DELETE (leave) | self |
| `/api/recordings`, `/api/notes` | GET (student sees approved only, staff sees all) / POST (admin/superadmin, starts `pending`) | |
| `/api/recordings/:id` | PATCH / DELETE | admin/superadmin |
| `/api/notes/:id` | DELETE | admin/superadmin |
| `/api/recordings/upload-url`, `/api/notes/upload-url` | POST — mints a presigned R2 PUT URL | admin/superadmin |
| `/api/recordings/:id/approve`, `/reject` · `/api/notes/:id/approve`, `/reject` | POST | superadmin |
| `/api/recordings/:id/resubmit` · `/api/notes/:id/resubmit` | POST | the uploader, or superadmin |
| `/api/activity` | GET / PATCH (increment) | self |
| `/api/members` | GET (full directory) | admin/superadmin (RLS narrows a student's call to just their own row) |
| `/api/admin-requests` | GET (own, or all for staff) / POST (apply) | self |
| `/api/admin-requests/:id/approve`, `/reject` | POST — approval grants `role = 'admin'` | superadmin |
| `/api/admin-requests/:id/resubmit` | POST | the applicant, or superadmin |

See the [root README](../README.md) for the full data model and the security model.
