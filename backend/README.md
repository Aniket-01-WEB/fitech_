# MATRIX Backend

Standalone Node.js/Express API for the MATRIX FinTech Club app. Talks to Supabase Postgres, forwarding each caller's own access token so Postgres Row Level Security is the real enforcement point — this service holds no service-role key and never bypasses RLS.

## Getting Started

```bash
npm install
cp .env.example .env   # already filled in for this project — edit if you point at a different Supabase project
npm run dev            # http://localhost:4000, auto-restarts on file changes
```

`GET /health` is a quick liveness check.

## Structure

```
src/
  server.js              Express app entry — CORS, JSON body parsing, error handler
  lib/
    supabaseClient.js     builds a request-scoped Supabase client from the caller's Bearer token
    errorResponse.js      maps Postgres/RLS errors to HTTP responses
    r2.js                  Cloudflare R2 client — mints presigned PUT/GET URLs, never proxies file bytes
  middleware/
    requireUser.js        401-gates a route; attaches req.supabase / req.user
    requireStaff.js        403-gates a route RLS can't protect (e.g. minting an R2 upload URL); attaches req.profile
  routes/
    profile.js, events.js, registrations.js, recordings.js, notes.js, activity.js, members.js, adminRequests.js
supabase/
  migrations/              the SQL that defines the schema, RLS policies, and triggers this API relies on
```

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
