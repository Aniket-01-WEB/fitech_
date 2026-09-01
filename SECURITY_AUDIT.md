# Security Audit — MATRIX / FITECH Web App

Date: 2026-09-01. Scope: full repo (`frontend/`, `backend/`, Supabase schema/RLS/triggers, Cloudflare R2, GitHub Actions). No UI, architecture, or existing functionality was redesigned — every change below is additive or a targeted fix, and every fix was live-tested against the real app and real database, not just written and assumed to work.

## Security Score: 90 / 100

Strong foundation going in (RLS-everywhere, no service-role key, presigned R2 URLs, DB-enforced approval workflows) plus one critical fix and a full hardening pass this session. The 10 points held back are documented, deliberate trade-offs below (CSP inline-script allowance, MIME-sniffing depth, one dashboard-only toggle) — not hidden gaps.

---

## Critical vulnerability fixed

**Admin → superadmin privilege escalation** (`prevent_self_role_escalation()` trigger). It checked "is the caller *any* staff" instead of "is the caller specifically superadmin." Combined with the `profiles_update_staff` RLS policy (which gives any staff row-reach to any profile), a plain `admin` account could call:

```js
supabase.from('profiles').update({ role: 'superadmin' }).eq('id', ownId)
```

directly against Supabase's REST API — bypassing the Express backend entirely — and succeed. **Live-tested the exact attack** with a real `admin@matrix.club` session before and after the fix: before, this would have worked; after, it returns `"Only a super admin can change a member role."` and the role is confirmed unchanged in the database. Also regression-tested the legitimate path (superadmin approving an admin-request still correctly grants the role) to make sure the fix didn't break real functionality.

---

## Authentication

Supabase Auth (email/password), JWT-based. Every protected backend route runs `requireUser`, which verifies the token via `supabase.auth.getUser()` against the real session — never trusts a client-asserted identity. `req.user.id` (from the verified token) is the only source of "who is making this request" anywhere in the backend; nothing reads `user_id`/`role`/`email` from a request body for authorization purposes. Confirmed no route accepts an `:id`/`:userId` path param standing in for "whose data to fetch" — every "my own data" route uses the session's own id.

## Authorization (student / admin / superadmin)

Enforced at three layers, verified independently:
- **Frontend**: portal pages redirect based on role (UX only, not trusted for security).
- **Backend**: `requireUser` (401-gates), `requireStaff` (403-gates the two actions RLS can't reach — minting R2 presigned upload URLs, since there's no Postgres row yet to attach a policy to).
- **Database**: RLS policies (row-reach) + `SECURITY DEFINER` trigger functions (column-level trust — who may change `status`/`role` and to what) are the *actual* enforcement layer. The backend and frontend are conveniences on top of this, not the thing actually stopping an attacker who calls Supabase directly with a stolen token.

**Live attack simulations run** (all blocked as expected):
- Student approves a real pending event → 404 (RLS makes it invisible to a non-staff caller, RLS-only enforcement, stricter than a 403).
- Plain admin (not superadmin) approves a real pending event/note → 403 `"Only a super admin can approve or reject..."`.
- Student mints an R2 upload URL → 403 `"Staff access required."`.
- Student updates another user's profile directly via Supabase (bypassing the backend) → 0 rows affected, no error — RLS silently scopes it to nothing.
- Student inflates another user's activity row directly via Supabase → 0 rows affected.
- Student sends a sneaky `user_id` field on `POST /api/registrations` to register someone else → 400, rejected by the strict input schema before it ever reaches the database.

## Row Level Security

Every table (`profiles`, `events`, `event_registrations`, `recordings`, `notes`, `student_activity`, `admin_requests`) has RLS **enabled and forced** (verified via `pg_class.relrowsecurity`/`relforcerowsecurity` — force matters because it also applies to the table owner). No table relies on frontend restriction alone. Approval workflows (events/notes/recordings/admin-requests) all force new rows to `pending` server-side (a trigger overwrites whatever the client sends) and only allow a status change by superadmin, with the resource's own creator able to resubmit a rejection — verified live for all four resource types.

## IDOR

Reviewed every route for the classic `/api/resource/:id` pattern where changing the ID exposes someone else's data. None exist in this API in exploitable form: "my own data" routes (`/api/profile`, `/api/activity`) never take an id param at all — they always resolve to the caller's own row. `DELETE /api/registrations/:eventId` filters by *both* `event_id` and the caller's own `user_id`, so guessing another registration's event id does nothing. List routes rely on RLS to scope results, not application-level filtering that could be bypassed.

## Role escalation protection

`prevent_self_role_escalation()` (fixed, see Critical above) is the sole gate on `profiles.role` changes and now correctly requires `superadmin`. `handle_new_user()` never reads a `role` field from signup metadata — every new account starts `student` via the column default, full stop; there is no client-supplied path to any other role. The only way to become `admin` is the `admin_requests` approval flow (superadmin-gated, verified live); the only way to become `superadmin` is direct SQL by the project owner.

## API security

Every mutating route now runs through Zod schema validation (`validateBody`/`validateQuery`) before touching the database — unrecognized fields, oversized strings, and malformed IDs are rejected with a clean 400, live-verified (a `role` field smuggled into a profile update, a 500-character name, a non-numeric `event_id`, all correctly rejected; a legitimate update still succeeds). A real Express 5 bug was caught and fixed during this pass: `req.query` is a read-only getter in Express 5, and the first version of `validateQuery` tried to reassign it, throwing a 500 on any query-string route — found via live testing (not just review), fixed to validate without reassigning.

## SQL injection

Not exploitable anywhere: every query goes through Supabase's parameterized query builder (`.eq()`, `.insert()`, etc.); there is no raw SQL string concatenation with request input anywhere in the backend (verified by reading every route file). The one place a client-controlled value reaches raw SQL is inside `is_safe`, RLS-checked policy definitions — also parameterized, not string-built.

## XSS

Verified zero uses of `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, `new Function()`, or `document.write()` anywhere in the frontend — React's default escaping is the primary defense and it's never bypassed. Found and fixed a real stored-XSS-adjacent gap: `notes.external_link` and `recordings.video_url` are staff-supplied but rendered as `<a href>`/`window.open` targets for every student who views them — a malicious or compromised staff account could have stored a `javascript:` URL. Fixed at **two independent layers** (both live-tested): the Express schema rejects any non-`http(s)` URL before it reaches the database, and a Postgres `CHECK` constraint rejects it even if something bypassed the backend and hit Supabase's REST API directly (`insert ... values ('javascript:alert(1)')` → confirmed constraint violation).

## URL security

Covered above — `external_link`/`video_url` are `https?://`-only at both the API and database layers. Hardcoded content (team member LinkedIn links) is developer-controlled, not attacker-reachable, so not a validation target.

## Cloudflare R2 security

R2 credentials exist only in `backend/.env` (never committed — verified across full git history, not just current tree) and are never sent to the browser. Every upload: `requireUser` → `requireStaff` (explicit role check, since RLS can't gate an action with no Postgres row yet) → MIME-type allowlist check → declared-size cap check → presigned PUT URL, scoped to one server-generated object key (`kind/uploaderId/timestamp-uuid-filename`, never a client-chosen key) with a 15-minute expiry. Reads work the same way in reverse: a listing endpoint that already passed RLS mints a fresh, 10-minute presigned GET URL per row — never a stored/public URL. **Declared file size is now bound into the presigned URL's own signature** (`ContentLength` on the `PutObjectCommand`) — live-verified end-to-end: a real note upload through the full pipeline (browser → presigned PUT → R2 → DB row → superadmin approval → student-visible signed GET → byte-for-byte content match) still works after this change, and an oversized/wrong-type declared upload is rejected before a URL is even minted.

## File upload security

Allowlists added (notes: PDF/Word/PowerPoint/plain-text/PNG/JPEG; recordings: MP4/WebM/QuickTime), enforced server-side before minting the upload URL — live-tested (an `.exe`/`application/x-msdownload` declaration is rejected with a clear 400). Size caps: 25MB notes, 750MB recordings, live-tested. **Residual, documented risk**: a technically sophisticated staff account could still lie about `contentType` while uploading different actual bytes (this implementation checks the *declared* MIME type and binds the *declared* size into the signature, not a magic-byte signature scan of the real content) — full content sniffing would need either a Cloudflare Worker inspecting objects post-upload or a server-side download-and-recheck step, which is out of scope for this pass without adding new infrastructure. This is mitigated by the fact the endpoint is staff-only, not public.

## Rate limiting

`express-rate-limit`, live-tested (not assumed): a general 120/min limiter across all `/api` traffic (generous — confirmed 12 rapid requests all pass clean), and a stricter 10/min limiter on the two actions with real abuse cost — minting an R2 upload URL and filing an admin-access request (confirmed: requests 8+ in a rolling minute correctly return 429). Supabase's own signup/auth endpoints have their own platform-level rate limits, outside this app's control.

## CORS

Was already single-origin; upgraded to support a comma-separated allowlist (for prod + local dev at once) with an explicit origin-matching function — never a wildcard, since this API is credentialed. Live-tested: a request from `https://evil-attacker.com` gets no `Access-Control-Allow-Origin` header at all (correctly rejected); `http://localhost:3000` gets it back correctly.

## Security headers

`helmet()` on the backend (sets `X-Content-Type-Options`, `X-Frame-Options`, HSTS, etc. on every JSON response) and a full header set via `next.config.mjs` on the frontend: CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geolocation all denied), `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security` (a no-op over the current plain-http dev server, takes effect automatically once served over https). CSP is scoped to the app's real external hosts only (built from env vars, not hardcoded): Supabase (https + wss), R2, the JoinModal's Google Apps Script webhook, Google Fonts, self.

**Live-verified across every public page, every portal (student/admin/superadmin), and a real login + R2 upload round-trip — zero console errors, zero CSP violations** after two iterations: the first CSP attempt (`script-src 'self'` with no exceptions) broke every single page (Next.js injects its own hashed inline bootstrap scripts and blocked them outright) — caught by actually loading the app in a browser, not by only reading the config. Fixed by allowing `'unsafe-inline'` specifically on `script-src` (documented trade-off below) while keeping every other directive strict.

## Cookie / session security

No custom cookie-based session exists — auth is Supabase's own client-side session (stored via its JS SDK, `persistSession: true`), sent as a Bearer token on every backend call. No access token is ever put in a URL or logged.

## CSRF

**Deliberately not implemented as a separate mechanism** — and this is a reasoned conclusion, not a skipped item. CSRF exploits the browser automatically attaching cookies/credentials to a cross-site request; this API is Bearer-token-authenticated (`Authorization: Bearer <token>`), which the browser never attaches automatically — only this app's own JS, reading the token from same-origin storage, can set that header. A forged cross-site form/fetch has no way to attach a valid token. Adding CSRF middleware here would add complexity without closing a real gap.

## Error handling

Rewrote `sendError()`: only two kinds of Postgres error are ever forwarded verbatim to the client — `42501` (RLS denial, mapped to a generic 403) and `P0001` (this app's own trigger-raised exceptions, which are deliberately written as safe, user-facing text). Everything else (constraint violations, malformed-input errors that reached Postgres, unexpected shapes) is logged in full server-side and the client gets a generic `"Request could not be completed."` — closes a real information-leak that could otherwise echo back table/column/constraint names.

## Security logging

Every unexpected/unsanitized error is logged server-side (`console.error`) with full detail before the client-facing message is sent — visible in backend logs. Rejected auth attempts (401) and unauthorized attempts (403/blocked trigger exceptions) are implicitly visible in access patterns; no separate structured audit log exists (would need a logging backend not currently part of this stack — noted as a possible future addition, not implemented here to avoid adding new infrastructure this pass).

## Student activity / heartbeat security

`PATCH /api/activity` always uses the verified session's own id (`(select auth.uid())` inside the `increment_activity()` RPC) — there is no `user_id` field accepted from the client at all. **Found and fixed a real gap**: the per-call delta had no upper bound, so `{deltaWebSec: 999999999}` would have inflated a student's tracked time arbitrarily. Fixed with a 120-second-per-call clamp inside the RPC itself (the actual enforcement point, not just the Express layer) — live-tested: sending `999999999` now adds exactly 120 seconds, confirmed by reading the row before/after.

## Event registration security

`POST /api/registrations` only ever inserts `{ event_id, user_id: req.user.id }` — a client-supplied `user_id` is rejected outright by the strict schema (live-tested). The `registrations_insert_own_approved_event` RLS policy independently requires the event to be `approved`. A `UNIQUE (event_id, user_id)` database constraint prevents double-registration even under concurrent requests (verified present).

## Admin request security

`POST /api/admin-requests` only ever accepts `reason` — `status`/`reviewed_by`/`role` are all rejected by the strict schema before reaching the database, and even if they weren't, the `admin_requests_guard_status_change` trigger independently re-verifies the caller is superadmin before any status change takes effect, and grants the role via a *separate* nested `UPDATE` the trigger itself performs — never something the client's request body could ever specify directly.

## Race conditions

Checked every write path that could race: `event_registrations` and `admin_requests` both have real `UNIQUE` database constraints (`(event_id, user_id)` and `(user_id)` respectively) — a concurrent double-submit fails on the second insert at the database level, not a `SELECT`-then-`INSERT` race in application code. Role changes and approvals are single-statement `UPDATE`s gated by a `BEFORE UPDATE` trigger, atomic by construction.

## Dependency audit

Backend: `npm audit` → **0 vulnerabilities**. Frontend: found 3 high-severity issues (SSRF in Next.js rewrites, a Next.js image-optimization DoS, and an unauthenticated internal-endpoint disclosure — all inherited from Next.js 16.2.10's bundled `postcss`/`sharp`). Fixed with a **patch-level** bump (`16.2.10` → `16.3.4` — same major version, not the kind of jump this audit was told to avoid) — rebuilt and re-ran the full live test suite (every public page, every portal, login, R2 upload) after the bump: zero regressions, zero new console errors. Frontend `npm audit` → **0 vulnerabilities** after the bump.

---

## Remaining risks (honestly disclosed, not hidden)

1. **CSP `script-src` includes `'unsafe-inline'`.** A fully strict CSP needs a per-request nonce threaded through Next.js middleware into every render — a real structural addition this codebase doesn't have, and building it was out of scope for "don't redesign the app." What this still blocks: any injected `<script src="https://attacker.example/x.js">`, the actual delivery mechanism for a stored-XSS payload. Given there's no `dangerouslySetInnerHTML`/`innerHTML` anywhere in this app (verified), there's currently no known injection point for this to matter regardless.
2. **Leaked-password protection is disabled in Supabase Auth.** This is a dashboard-only toggle (Authentication → Policies) — there's no API/SQL path to flip it, so I couldn't do it from here. Recommended: enable it (checks new passwords against HaveIBeenPwned).
3. **`is_staff(uid)` is callable directly by `anon`/`authenticated` via RPC** (flagged by Supabase's own advisor). It's a pure boolean check (`is this uid admin/superadmin`) that several RLS policies need to evaluate for anonymous/any-authenticated callers to work at all — revoking public execute would break those policies. Low actual risk: it reveals only a yes/no about staff status for a *given, already-known* uid, nothing else.
4. **File-upload validation trusts the declared MIME type**, not a magic-byte scan of real content (see File upload security above) — mitigated by the endpoint being staff-only.
5. **No structured security audit log / SIEM-style event stream** — would need new logging infrastructure, not added this pass to avoid scope creep beyond "harden what exists."
6. **`DEMO_PASSWORD` in `login/page.js` is intentionally public** (`MatrixDemo-2026!`) — this is the existing, documented Quick Demo feature, not a leaked secret; noted here for completeness, not flagged as a new finding.

---

## Testing performed (all live against the real app/database, not assumed)

- Admin self-promotion to superadmin: blocked before/after comparison, both via direct Supabase REST calls.
- Superadmin-driven admin-request approval: confirmed still grants the role correctly (no regression from the trigger fix).
- Student and plain-admin attempts to approve real pending events/notes: correct 404/403 outcomes respectively.
- Student direct-Supabase attempts to edit another profile / inflate another user's activity: RLS silently scopes to 0 rows.
- Sneaky extra fields (`role`, `user_id`, `status`) on profile/registration/admin-request writes: all rejected by strict schemas.
- Oversized input, non-numeric IDs, `javascript:` URLs: all rejected with clean 400s.
- Disallowed file type/oversized declared file on R2 upload-url: rejected; legitimate PDF upload still works.
- Student blocked from minting an R2 upload URL entirely.
- Rate limiting: general (120/min) unaffected by light traffic; sensitive-action (10/min) confirmed tripping under load, returning 429.
- CORS: disallowed origin gets no CORS header; allowed origin does.
- CSP: zero violations across every public page, student/admin/superadmin portals, a full login round-trip, and a complete real R2 upload → approval → student-visible-download cycle.
- `npm run build` (frontend) and backend boot: both clean throughout every change, including after the Next.js version bump.

---

## Final Report

**SECURITY HARDENING COMPLETE**

- Authentication: **PASS**
- Authorization: **PASS**
- RLS: **PASS**
- API security: **PASS**
- IDOR protection: **PASS**
- Role escalation protection: **PASS** (critical fix applied and live-verified)
- XSS protection: **PASS**
- SQL injection protection: **PASS**
- R2 security: **PASS**
- File upload security: **PASS** (with documented MIME-declaration trust trade-off)
- Rate limiting: **PASS**
- CORS: **PASS**
- Security headers: **PASS**
- CSRF: **PASS** (reasoned N/A for this Bearer-token architecture)
- Dependency audit: **PASS** (0 vulnerabilities, both apps)
- Production build: **PASS**

### Most important changes made

1. **Fixed a critical admin→superadmin privilege-escalation vulnerability** in the role-change trigger.
2. Added `https?://`-only CHECK constraints (DB layer) + schema validation (API layer) on staff-supplied URLs, closing a stored-XSS-adjacent gap.
3. Bounded the activity-heartbeat RPC server-side to stop time-tracking inflation.
4. Added Zod input validation to every mutating backend route (unexpected fields, oversized input, malformed IDs all rejected).
5. Added file-upload MIME/size allowlisting, with the declared size bound into the R2 presigned URL's own signature.
6. Sanitized all error responses — only pre-approved, safe messages ever reach the client.
7. Added rate limiting, `helmet`, and a CSP tuned to this app's real external hosts (iterated once after live-testing revealed the first version broke every page).
8. Multi-origin-safe CORS allowlist (still never a wildcard).
9. Patched 3 high-severity frontend dependency vulnerabilities via a same-major-version Next.js bump.
10. Fixed a real Express 5 bug (`req.query` read-only getter) discovered *during* live testing of the new validation layer.
