# MATRIX FinTech Club

The premier quantitative finance, computational economics, and financial engineering research society — club website, member portals, and the API/database behind them.

This is a two-app monorepo:

```
frontend/   Next.js app — the public site + student/admin/super-admin portals
backend/    Standalone Node/Express API — the only thing that talks to Supabase
```

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, TypeScript), Tailwind CSS v4, framer-motion, Lenis — deployed on Vercel |
| Backend | Node 22 + Express 5 (TypeScript via `tsx`), Zod validation, Helmet, express-rate-limit — deployed on Render |
| Database / Auth | Supabase Postgres + Supabase Auth; every table under Row Level Security; schema in `backend/supabase/migrations/` |
| File storage | Cloudflare R2 (private bucket, presigned URLs minted by the backend) |
| Tests | Vitest (backend unit), Playwright (frontend E2E, desktop + mobile) |
| CI | GitHub Actions — lint, types, unit tests, production build, E2E on every push/PR |

## Running locally

This is an npm workspace; run everything from the repository root.

1. Copy `.env.example` to `.env` and fill in the values. **One `.env` at the root serves both apps** — the backend and the frontend both read it (`backend/src/loadEnv.ts`, `frontend/next.config.mjs`). Never commit it.

   | Variable | Used by | Purpose |
   |---|---|---|
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | backend | Supabase project URL + anon (publishable) key. No service-role key is used anywhere. |
   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | frontend | Same two values, exposed to the browser for Supabase Auth. |
   | `PORT` | backend | API port (default 4000). Only the backend reads it — the root dev script strips it before starting Next. |
   | `FRONTEND_ORIGIN` | backend | Comma-separated CORS allowlist, e.g. `http://localhost:3000,https://fitech-eta.vercel.app`. |
   | `NEXT_PUBLIC_API_URL` | frontend | Base URL of the backend. |
   | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | backend | Cloudflare R2 credentials scoped to the one bucket. |
   | `NEXT_PUBLIC_ENABLE_DEMO_LOGIN` | frontend | Set to `true` to show the one-click demo login buttons. They are always shown in development and hidden in production builds unless this is set. |

2. Install everything: `npm install`
3. Start both apps: `npm run dev` — frontend on http://localhost:3000, backend on http://localhost:4000.

## Quality checks

```bash
npm run typecheck -w backend     # TypeScript
npm test -w backend              # Vitest unit tests (validation, error mapping, R2 keys, config)
npm run lint -w frontend         # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck -w frontend    # TypeScript
npm run build -w frontend        # production build
npm run test:e2e -w frontend     # Playwright: builds + serves the frontend, runs desktop and mobile
```

The E2E suite covers every public route (renders, no runtime errors, no horizontal overflow), the security headers, the FAQ, the 404 page and the signed-out redirects on all portals without needing a backend. The demo-login test additionally needs a running backend and the demo accounts; enable it with `E2E_DEMO_LOGIN=true`. `.github/workflows/ci.yml` runs all of the above on every push and pull request.

## Production build

```bash
npm run build -w frontend && npm run start -w frontend   # Next.js
npm run start -w backend                                  # Express (tsx)
```

Set the same variables as in `.env` on the host: Vercel for the `NEXT_PUBLIC_*` values, Render for the backend's. `FRONTEND_ORIGIN` on Render must include the deployed frontend origin or the browser's requests are rejected by CORS.

## Deployment

**Backend**: live on Render at **https://fitech-02.onrender.com**. **Frontend**: live on Vercel at **https://fitech-eta.vercel.app**. Both verified working together end-to-end — a real login round-trip against the deployed instances (not just a config review): Supabase connectivity, R2 presigned uploads, CORS, and security headers all confirmed live.

Render's free tier spins the backend down after 15 minutes of inactivity, and the very first request to a sleeping instance fails to connect outright rather than just being slow. [`.github/workflows/render-keepalive.yml`](.github/workflows/render-keepalive.yml) pings it every 5 minutes so it never actually goes idle — see [backend/README.md](backend/README.md) for details. This is separate from the scheduled Supabase keepalive job in the same file, which pings Supabase itself on a very different (5-day) cadence to stop the *database* project from auto-pausing — two different problems, two different timescales, two different workflows.

`PortalContext.tsx` is wired to the real stack end-to-end: it holds a Supabase Auth session, calls the backend for everything else (with the session's access token attached), and the backend enforces RLS — no more browser `localStorage`. Auth is real too: the login page's Student/Admin/Super Admin tabs sign in with a real email+password via Supabase Auth, then verify the account's actual role (from `profiles.role`) matches the tab picked. The Join form creates a real account (`supabase.auth.signUp`) and, with email confirmations turned off in the project's Auth settings, hands back a session immediately — the new student lands straight in the Student Portal with their full profile (name, department, school, etc.) already saved, no inbox step involved. A Super Admin can grant `admin` access separately (see "Admin access requests" below) — student signup itself is never gated. Admin note/recording uploads go straight to a private Cloudflare R2 bucket via a backend-minted presigned URL (see "File storage" below) — never Supabase Storage.

### Admin access requests

Admin accounts aren't self-registered from the login page's Admin Console tab. Instead: anyone signs up as a student first, then applies for admin access from their Student Portal → My Profile tab. That creates a row in `admin_requests` a Super Admin reviews from the Super Admin dashboard's "Admin Requests" tab — approving it actually grants `role = 'admin'` on the applicant's profile (enforced by a trigger, not just app code); rejecting it lets the applicant resubmit later.

Demo accounts (`student@matrix.club`, `admin@matrix.club`, `superadmin@matrix.club`, all with password `MatrixDemo-2026!`) are real, confirmed Supabase Auth users with their roles granted via SQL — the login page's Quick Demo buttons sign in through the same real flow. Because that password is public, the buttons are hidden in production builds unless `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true`; for a real launch, delete or re-password the demo accounts (see `SECURITY-AUDIT.md`). Grant `superadmin` to any other account via the SQL in "Security model" below.

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

Every table has Row Level Security enabled and forced. The backend never bypasses it — every route forwards the caller's own Supabase Auth access token, so Postgres itself is the actual enforcement point (checked against the Supabase security advisor — see `SECURITY-AUDIT.md` for the open items). There is no service-role key anywhere in this repo.

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

Requires four vars in your root `.env` file: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Get an access key/secret from the Cloudflare dashboard → R2 → Manage API Tokens, scoped to just this bucket. Live-verified working end-to-end (real upload, approval, and student read) against the `fitech` bucket.

**Bucket CORS**: the browser uploads straight to R2 with the presigned URL, so the bucket needs a CORS policy allowing the app's origin to `PUT`/`GET`/`HEAD` — R2 blocks cross-origin requests by default regardless of how valid the presigned URL's signature is. Currently set (via `PutBucketCorsCommand`, same S3 API the app already uses) to allow `http://localhost:3000` and `https://*.vercel.app`. **If the site deploys somewhere other than Vercel, add that real origin to the bucket's CORS rule** — Cloudflare dashboard → R2 → `fitech` → Settings → CORS Policy, or re-run `PutBucketCorsCommand` with the updated origin list.
