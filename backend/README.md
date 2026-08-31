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
  middleware/
    requireUser.js        401-gates a route; attaches req.supabase / req.user
  routes/
    profile.js, events.js, registrations.js, recordings.js, notes.js, activity.js
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
| `/api/recordings`, `/api/notes` | GET (any signed-in member) / POST (admin/superadmin) | |
| `/api/recordings/:id`, `/api/notes/:id` | PATCH / DELETE | admin/superadmin |
| `/api/activity` | GET / PATCH (increment) | self |
| `/api/members` | GET (full directory) | admin/superadmin (RLS narrows a student's call to just their own row) |

See the [root README](../README.md) for the full data model and the security model.
