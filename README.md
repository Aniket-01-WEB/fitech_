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

`PortalContext.js` is wired to the real stack end-to-end: it holds a Supabase Auth session, calls the backend for everything else (with the session's access token attached), and the backend enforces RLS — no more browser `localStorage`. Auth is real too: the login page's Student/Admin/Super Admin tabs sign in with a real email+password via Supabase Auth, then verify the account's actual role (from `profiles.role`) matches the tab picked. The Join form creates a real account (`supabase.auth.signUp`); if the project requires email confirmation, the UI tells the applicant to check their inbox before their first login. Admin note uploads go straight to a public `notes` Storage bucket (RLS-gated to staff for writes), and the resulting URL is what students read/download.

Demo accounts (`student@matrix.club` / `admin@matrix.club`, password `MatrixDemo-2026!`) are real, confirmed Supabase Auth users with `admin`/`student` roles granted via SQL — the login page's Quick Demo buttons sign in through the same real flow. A shared `superadmin@matrix.club` demo account isn't created (Supabase's built-in email sender hit its rate limit), so that Quick Demo button won't work — a real superadmin account exists instead (a personal login, not wired into the public demo button on purpose). Grant `superadmin` to any other account via the SQL in "Security model" above.

See each app's own README ([frontend](frontend/README.md), [backend](backend/README.md)) for app-specific details.

## Forgot password (email OTP)

The login page has a full "Forgot password?" flow, entirely client-side against Supabase Auth (no service-role key, no custom backend endpoint needed — this is the standard recovery flow):

1. Enter your registered email → `supabase.auth.resetPasswordForEmail(email)` sends a 6-digit code.
2. Enter that code → `supabase.auth.verifyOtp({ email, token, type: 'recovery' })` proves you own the inbox and opens a temporary session.
3. Set a new password → `supabase.auth.updateUser({ password })` on that session.

**This needs two one-time settings in the Supabase dashboard before it can actually deliver mail** — I can't configure either from here, they require dashboard access:

- **Authentication → Settings → SMTP Settings**: turn on custom SMTP using `fitech.soet@gmail.com`'s credentials (an [App Password](https://myaccount.google.com/apppasswords), not the regular Gmail password — Gmail SMTP is `smtp.gmail.com`, port `587`). Without this, all auth email (signup confirmation *and* password reset) goes through Supabase's shared test sender, which is heavily rate-limited — this project already hit that limit today.
- **Authentication → Email Templates → Reset Password**: the default template only shows a "Reset Password" link. Add `{{ .Token }}` to the template body so the email actually displays the 6-digit code the UI asks the user to type in.

Until both are set, "Forgot password?" will show a "email rate limit exceeded" (or similar) error — that's Supabase's own sender, not a bug in the flow itself; I verified the code path is correct and fails cleanly.

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
