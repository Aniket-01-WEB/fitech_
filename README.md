# MATRIX FinTech Club

The premier quantitative finance, computational economics, and financial engineering research society — club website, member portals, and the API/database behind them.

This is a two-app monorepo:

```
frontend/   Next.js app — the public site + student/admin/super-admin portals
backend/    Standalone Node/Express API — the only thing that talks to Supabase
```

## Running locally

Each app runs independently, in its own terminal:

```bash
cd backend && npm install && npm run dev    # http://localhost:4000
cd frontend && npm install && npm run dev   # http://localhost:3000
```

The frontend's portal pages (`PortalContext.js`) currently still run on browser `localStorage`, not the backend yet — wiring them together is a natural next step. See each app's own README ([frontend](frontend/README.md), [backend](backend/README.md)) for app-specific details.

## Database

Supabase Postgres, project id `cpainkjljrjjwzdgdewz`. Schema, RLS policies, and triggers live entirely in SQL migrations under `backend/supabase/migrations/`, applied directly to the project.

### Data model

| Table | Purpose |
|---|---|
| `profiles` | One row per Supabase Auth user. `role` is `student` / `admin` / `superadmin`, plus academic details (name, reg/roll number, school, department, section, year, contact, interested domain). Auto-created by a trigger on signup, always starting as `student`. |
| `events` | Club events. `status` is `pending` / `approved` / `rejected`. New events are always forced to `pending` server-side (a trigger overwrites whatever the client sends), and only a `superadmin` can flip the status — the event's own creator (`admin`) may additionally resubmit a `rejected` event back to `pending`. |
| `event_registrations` | A student joining an event. RLS only allows registering for an already-`approved` event, and only as yourself. |
| `recordings` | Masterclass recording library — readable by any signed-in member, writable by `admin`/`superadmin`. |
| `notes` | Study material. Same read/write split as recordings; each note needs a `file_url` (e.g. a Supabase Storage link) or an `external_link`. |
| `student_activity` | Per-student time tracking, updated via the `increment_activity()` RPC (atomic upsert, avoids races from a client polling once a second). |

### Security model

Every table has Row Level Security enabled and forced. The backend never bypasses it — every route forwards the caller's own Supabase Auth access token, so Postgres itself is the actual enforcement point (verified clean by the Supabase security/performance advisors). There is no service-role key anywhere in this repo.

A member cannot self-promote to `admin`/`superadmin` — that's blocked by a trigger and is expected to be done deliberately via SQL/the Supabase dashboard:

```sql
update public.profiles set role = 'admin' where email = 'someone@example.com';
```

Full API route table is in [backend/README.md](backend/README.md).
