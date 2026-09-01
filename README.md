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

## Deployment

**Backend**: live on Render at **https://fitech-02.onrender.com** — verified working end-to-end (Supabase connectivity, R2 presigned uploads, CORS, security headers all live-tested against the deployed instance, not just assumed from config). Render's `FRONTEND_ORIGIN` env var is currently `http://localhost:3000`; update it to the real frontend origin the moment the frontend is deployed anywhere, or every browser request from that origin will be rejected by CORS.

**Frontend**: not deployed yet. When it is, set `NEXT_PUBLIC_API_URL=https://fitech-02.onrender.com` in that platform's environment variables (local dev keeps pointing at `http://localhost:4000` — see `frontend/.env.example`; both talk to the same Supabase project regardless, so there's no functional difference for local testing, and it avoids Render's free-tier cold-start delay on every first request after idle).

Render's free tier spins the backend down after 15 minutes of inactivity — the first request after that takes noticeably longer while it wakes up. The scheduled Supabase keepalive job (see [backend/README.md](backend/README.md)) doesn't prevent this — it only pings Supabase itself, on a very different (5-day) cadence, unrelated to Render's own sleep behavior.

`PortalContext.js` is wired to the real stack end-to-end: it holds a Supabase Auth session, calls the backend for everything else (with the session's access token attached), and the backend enforces RLS — no more browser `localStorage`. Auth is real too: the login page's Student/Admin/Super Admin tabs sign in with a real email+password via Supabase Auth, then verify the account's actual role (from `profiles.role`) matches the tab picked. The Join form creates a real account (`supabase.auth.signUp`) and, with email confirmations turned off in the project's Auth settings, hands back a session immediately — the new student lands straight in the Student Portal with their full profile (name, department, school, etc.) already saved, no inbox step involved. A Super Admin can grant `admin` access separately (see "Admin access requests" below) — student signup itself is never gated. Admin note uploads go straight to a public `notes` Storage bucket (RLS-gated to staff for writes), and the resulting URL is what students read/download.

### Admin access requests

Admin accounts aren't self-registered from the login page's Admin Console tab. Instead: anyone signs up as a student first, then applies for admin access from their Student Portal → My Profile tab. That creates a row in `admin_requests` a Super Admin reviews from the Super Admin dashboard's "Admin Requests" tab — approving it actually grants `role = 'admin'` on the applicant's profile (enforced by a trigger, not just app code); rejecting it lets the applicant resubmit later.

Demo accounts (`student@matrix.club` / `admin@matrix.club`, password `MatrixDemo-2026!`) are real, confirmed Supabase Auth users with `admin`/`student` roles granted via SQL — the login page's Quick Demo buttons sign in through the same real flow. A shared `superadmin@matrix.club` demo account isn't created (Supabase's built-in email sender hit its rate limit), so that Quick Demo button won't work — a real superadmin account exists instead (a personal login, not wired into the public demo button on purpose). Grant `superadmin` to any other account via the SQL in "Security model" above.

See each app's own README ([frontend](frontend/README.md), [backend](backend/README.md)) for app-specific details.

## Forgot password (email OTP)

The login page has a full "Forgot password?" flow, entirely client-side against Supabase Auth (no service-role key, no custom backend endpoint needed — this is the standard recovery flow):

1. Enter your registered email → `supabase.auth.resetPasswordForEmail(email)` sends a 6-digit code.
2. Enter that code → `supabase.auth.verifyOtp({ email, token, type: 'recovery' })` proves you own the inbox and opens a temporary session.
3. Set a new password → `supabase.auth.updateUser({ password })` on that session.

This needs two one-time settings in the Supabase dashboard — I can't configure either from here, they require dashboard access:

- **Authentication → Emails → SMTP Settings**: custom SMTP via [Resend](https://resend.com), sender on the verified `fitech.soet.com` domain (e.g. `noreply@fitech.soet.com`), host `smtp.resend.com`, port `465`, username literally `resend`, password = the Resend API key. (Signups no longer send mail at all — email confirmation is off — so this SMTP config now only matters for password-reset OTP.)
- **Authentication → Email Templates → Reset Password**: the default template only shows a "Reset Password" link. Add `{{ .Token }}` to the template body so the email actually displays the 6-digit code the UI asks the user to type in.

## Database

Supabase Postgres, project id `cpainkjljrjjwzdgdewz`. Schema, RLS policies, and triggers live entirely in SQL migrations under `backend/supabase/migrations/`, applied directly to the project.

### Data model

| Table | Purpose |
|---|---|
| `profiles` | One row per Supabase Auth user. `role` is `student` / `admin` / `superadmin`, plus academic details (name, reg/roll number, school, department, section, year, contact, interested domain). Auto-created by a trigger on signup, always starting as `student`. |
| `events` | Club events. `status` is `pending` / `approved` / `rejected`. New events are always forced to `pending` server-side (a trigger overwrites whatever the client sends), and only a `superadmin` can flip the status — the event's own creator (`admin`) may additionally resubmit a `rejected` event back to `pending`. |
| `event_registrations` | A student joining an event. RLS only allows registering for an already-`approved` event, and only as yourself. |
| `recordings` | Masterclass recording library. Writable by `admin`/`superadmin`; a student only ever sees `approved` rows. Same forced-`pending`-on-insert + superadmin-only-approval pattern as events. A recording's video is either an `external_link`-style `video_url`, a file uploaded to R2 (`r2_key`), or both. |
| `notes` | Study material. Same read/write split, approval workflow, and R2 upload option as recordings; each note needs an `external_link` or an `r2_key` — no raw client-supplied file URL is ever accepted, a note's file either lives in this app's own R2 bucket or is a link the admin points to. |
| `admin_requests` | Self-service "make me an admin" applications, filed by any signed-in member from their Student Portal profile. Same `pending`/`approved`/`rejected` shape; approving one actually grants `role = 'admin'` on the applicant's profile (a trigger, not just app code). |
| `student_activity` | Per-student time tracking, updated via the `increment_activity()` RPC (atomic upsert, avoids races from a client polling once a second). |

### Security model

Every table has Row Level Security enabled and forced. The backend never bypasses it — every route forwards the caller's own Supabase Auth access token, so Postgres itself is the actual enforcement point (verified clean by the Supabase security/performance advisors). There is no service-role key anywhere in this repo.

A member cannot self-promote to `admin`/`superadmin` — that's blocked by a trigger and is expected to be done deliberately via SQL/the Supabase dashboard:

```sql
update public.profiles set role = 'admin' where email = 'someone@example.com';
```

Full API route table is in [backend/README.md](backend/README.md).

### File storage (Cloudflare R2)

Uploaded notes and recording videos live in a private Cloudflare R2 bucket, not Supabase Storage. The backend is the only thing that ever holds R2 credentials — the same trust boundary this project already keeps around Supabase's service key, just applied to a second external store:

1. An admin picks a file → the backend (staff-only, checked explicitly since there's no Postgres row yet for RLS to gate) mints a short-lived **presigned PUT URL** and hands it back.
2. The browser uploads the file bytes straight to R2 with that URL — the backend never proxies or buffers them.
3. The browser then creates the note/recording row with the resulting object key (`r2_key`); it starts `pending` like every other upload here.
4. Once a Super Admin approves it, any request that lists notes/recordings and finds an `r2_key` gets a freshly-minted, short-lived **presigned GET URL** in its place — minted only for a caller RLS already cleared to see that row, never stored, never public.

Requires four vars in `backend/.env` (see `backend/.env.example`): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Get an access key/secret from the Cloudflare dashboard → R2 → Manage API Tokens, scoped to just this bucket. Live-verified working end-to-end (real upload, approval, and student read) against the `fitech` bucket.

**Bucket CORS**: the browser uploads straight to R2 with the presigned URL, so the bucket needs a CORS policy allowing the app's origin to `PUT`/`GET`/`HEAD` — R2 blocks cross-origin requests by default regardless of how valid the presigned URL's signature is. Currently set (via `PutBucketCorsCommand`, same S3 API the app already uses) to allow `http://localhost:3000` and `https://*.vercel.app`. **If the site deploys somewhere other than Vercel, add that real origin to the bucket's CORS rule** — Cloudflare dashboard → R2 → `fitech` → Settings → CORS Policy, or re-run `PutBucketCorsCommand` with the updated origin list.
