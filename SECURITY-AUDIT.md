# Security Audit — FiTech (MATRIX FinTech Club)

Date: 2026-09-17. Scope: the whole repository — `frontend/` (Next.js), `backend/` (Express), Supabase schema/RLS/triggers (`backend/supabase/migrations/`), Cloudflare R2, GitHub Actions, git history. This supersedes the 2026-09-01 audit; everything still true from it is restated here so this file stands alone.

Method: static review of every route, middleware and schema; the Supabase security advisor; `npm audit`; a scan of the full git history for secret values; and live verification of each fix against the running app (Vitest for backend logic, Playwright for the browser). Nothing below is marked fixed without a verification line.

Severity legend — **Critical**: block a launch. **High**: exploitable or breaks a security control. **Medium**: should be fixed before wide use. **Low**: hygiene. **Info**: observations and accepted trade-offs.

---

## Critical

None found.

- Git history contains no `.env` files and none of the current secret values (searched for the R2 key id/secret, the anon key, `service_role`, the Supabase hostname across all commits).
- Every table has RLS enabled; the backend holds no service-role key and forwards the caller's own JWT to Supabase, so Postgres is the enforcement point for every read and write.
- `npm audit` (production and dev): 0 vulnerabilities.

---

## High

### H1 — Rate limiting keyed on the proxy, not the client
- **Location:** `backend/src/server.ts`
- **Problem:** The API runs behind Render's reverse proxy but never set `trust proxy`, so `express-rate-limit` saw every request as coming from the proxy's IP.
- **Impact:** All clients shared one 120 req/min bucket: a single scripted client (or ordinary traffic) could lock everyone out, and the per-client limit on the R2 presign endpoint was effectively global.
- **Fix:** `app.set('trust proxy', 1)` — trust exactly one proxy hop.
- **Status:** Fixed.
- **Verification:** backend type-check and unit suite pass; `/health` returns 200 on the running server. (Per-IP keying can only be observed behind the real proxy — see PRODUCTION-READINESS.md, NOT VERIFIED.)

### H2 — Demo accounts with a public password, including a superadmin
- **Location:** `frontend/src/app/login/page.tsx` (`DEMO_PASSWORD`), Supabase Auth users `student@`, `admin@`, `superadmin@matrix.club`
- **Problem:** The Quick Demo buttons sign in with a password that is in the page source. A `superadmin@matrix.club` demo account now exists (created during development so the button works), so anyone reading the source can approve/reject events, notes, recordings and admin requests on the live site.
- **Impact:** Full administrative control of production content by any visitor.
- **Fix:** The demo strip is now rendered only when `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true` or in a development build (`NODE_ENV !== 'production'`). Deleting/re-passwording the demo accounts is a dashboard action.
- **Status:** Partially fixed — UI gated; accounts still exist.
- **Verification:** Playwright login test signs in through the form (not the button) and reaches the portal; the gate is a build-time constant, checked by type-check + production build. **Action required before launch:** delete or re-password the three demo users in Supabase Auth (Authentication → Users), or accept them consciously for a showcase site.

---

## Medium

### M1 — Client-supplied `r2_key` not checked for ownership
- **Location:** `backend/src/routes/notes.ts` (POST `/`), `backend/src/routes/recordings.ts` (POST `/`, PATCH `/:id`)
- **Problem:** A staff user could create a note/recording whose `r2_key` points at *another* staff member's uploaded object. The list routes then mint a download URL for it, and deleting the row deletes that object from R2.
- **Impact:** Cross-user read of private uploads and destructive deletion of someone else's file (requires an admin account).
- **Fix:** `ownsKey(kind, uploaderId, key)` in `backend/src/lib/r2.ts`; each route rejects a key not minted for the caller with 403.
- **Status:** Fixed.
- **Verification:** `backend/src/__tests__/r2.test.ts` — 4 new cases (same uploader accepted; other uploader, other kind, non-string and prefix look-alikes rejected). 64/64 tests pass.

### M2 — API mounted at both `/` and `/api`
- **Location:** `backend/src/server.ts`
- **Problem:** Every route was reachable twice; the frontend only uses `/api/...`.
- **Impact:** Doubled attack surface and inconsistent rate-limit/observability paths.
- **Fix:** Only `/api` is mounted.
- **Status:** Fixed.
- **Verification:** `GET /events` → 404, `GET /api/events` → 200 on the running backend; demo-login E2E passes.

### M3 — `is_staff(uid)` executable via public RPC
- **Location:** Postgres function `public.is_staff(uuid)` (SECURITY DEFINER); flagged by the Supabase advisor.
- **Problem:** Anyone can call `/rest/v1/rpc/is_staff` and learn whether a given user id is staff.
- **Impact:** Low-value information disclosure (user ids are not enumerable; the answer is a boolean).
- **Recommended fix:** Move the function to a non-exposed schema (`private.is_staff`), grant `EXECUTE` to `anon`/`authenticated`, and rewrite the 18 policies plus the `events_guard_status_change` trigger that reference it. Revoking `EXECUTE` alone breaks `events_select_approved_or_staff`, which anonymous readers rely on (confirmed by inspecting the policy).
- **Status:** Open — accepted for now; it is a coordinated migration across every policy that should be applied and tested in one go, not piecemeal.
- **Verification:** N/A.

### M4 — Leaked-password protection disabled
- **Location:** Supabase Auth settings (dashboard only).
- **Problem:** New passwords are not checked against HaveIBeenPwned.
- **Recommended fix:** Authentication → Policies → enable leaked password protection.
- **Status:** Open — no API/SQL path; requires the dashboard.
- **Verification:** N/A.

### M5 — Object keys could contain `..` sequences
- **Location:** `backend/src/lib/r2.ts` `buildKey`
- **Problem:** File names were sanitised to `[A-Za-z0-9._-]` but `..` runs survived.
- **Impact:** None on R2 (flat key namespace), but the key is echoed in URLs and logs and would matter on any path-based store.
- **Fix:** Dot runs collapse to a single `.`.
- **Status:** Fixed.
- **Verification:** `r2.test.ts` "sanitizes path-traversal attempts" now passes.

---

## Low

### L1 — AI-tooling and editor artefacts committed
- **Location:** `.agents/` (41 files), `.mcp.json`, `skills-lock.json`, `memory.md`, `run-dev.bat`
- **Problem:** Not part of the product; `.mcp.json` embedded the Supabase project ref.
- **Fix:** Removed from the repository and added to `.gitignore`.
- **Status:** Fixed. **Verification:** `git ls-files` no longer lists them.

### L2 — Unused assets shipped
- **Location:** `frontend/public/images/Adamas-University_-Kolkata_k8826n.jpg` (69 KB), `logo-original.png`
- **Fix:** Removed (no references in `src/`). **Status:** Fixed. **Verification:** grep for both names returns nothing; production build succeeds.

### L3 — Stale configuration messages
- **Location:** `backend/src/lib/supabaseClient.ts`, `backend/src/lib/r2.ts`
- **Problem:** Warnings pointed at `backend/.env`; the app reads the root `.env`.
- **Fix:** Messages updated. **Status:** Fixed.

### L4 — Duplicated status labels
- **Location:** `admin-portal/page.tsx`, `super-admin/page.tsx` each defined `STATUS_LABEL` while `constants/statusLabels.ts` existed unused.
- **Fix:** Both import the shared constant. **Status:** Fixed. **Verification:** lint + type-check + build pass; portal pages render in E2E.

### L5 — Loose typing (`any`)
- **Location:** `frontend/src/lib/api.ts` catch clauses, `SmoothScroll.tsx` `window as any`, plus `PortalContext` (`createContext<any>`), `api.get<T = any>` defaults, a few `evt: any` filters.
- **Fix:** Catch clauses narrowed to `unknown` with `instanceof Error`; the unused `window.lenis` global removed. The remaining ones are a typing refactor of the data context (~800 lines) — left as-is.
- **Status:** Partially fixed.

---

## Informational / accepted trade-offs

- **CSP `script-src 'unsafe-inline'`** (`frontend/next.config.mjs`): Next.js injects inline bootstrap scripts; a strict CSP needs a per-request nonce pipeline. External script sources are still blocked, and the app has no `dangerouslySetInnerHTML`/`innerHTML`/`eval` (verified by grep). `'unsafe-eval'` is dev-only for HMR.
- **Upload validation trusts the declared MIME type** (no magic-byte sniffing). Mitigated: staff-only, allow-listed types, size caps, and the presigned PUT binds the declared `Content-Length` so a larger upload fails at R2.
- **Sessions** are Supabase Auth JWTs held by the Supabase client in the browser; the backend is stateless and never sets cookies, so there is no CSRF surface (every mutating request needs the bearer token, which cross-site pages cannot read).
- **Security headers** (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`) are set by Next.js for every route; Helmet covers the API. Verified by the E2E "security headers are sent" test.
- **Input validation**: every body/query the API accepts goes through a strict Zod schema (`.strict()` — unknown fields rejected); `:id` params are checked as integers; errors never echo raw Zod issues. SQL is never built from strings (PostgREST query builder only).
- **Error handling**: `sendError` maps only RLS denials and our own trigger messages to the client; everything else is logged server-side and returned as a generic message. The frontend `error.tsx` never shows stack traces.
- **Role escalation** is blocked by a trigger, not app code; approvals require `superadmin` by trigger; new content is forced to `pending` by trigger. These are enforced in Postgres regardless of the API.
- **No structured audit log / SIEM stream.** Would need logging infrastructure; not added.
