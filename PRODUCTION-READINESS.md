# Production Readiness — FiTech

Date: 2026-09-17. Companion to `SECURITY-AUDIT.md` (security findings live there; this file covers structure, quality, testing, build and operations). Every PASS below names how it was checked. NOT VERIFIED means it could not be exercised from this environment and says why.

## Findings

### Critical
None.

### High

**Demo accounts with a public password in production** — see SECURITY-AUDIT.md H2. UI gated; the accounts themselves must be deleted or re-passworded in the Supabase dashboard before a real launch. *Status: partially fixed.*

### Medium

**No continuous integration** — nothing ran lint, types, tests or the build on push.
- Location: `.github/workflows/` (only two keepalive workflows).
- Fix: `ci.yml` — backend type-check + Vitest, frontend lint + type-check + production build + Playwright E2E, on every push to `main` and every PR. Build uses placeholder `NEXT_PUBLIC_*` values (nothing in the build contacts a real service).
- Status: Fixed. Verification: identical commands pass locally; the workflow itself runs on the next push (NOT VERIFIED until then).

**No automated tests** — the frontend had none; the backend suite (Vitest) existed only as uncommitted work.
- Fix: Backend — 64 unit tests over validation schemas, error mapping, R2 key generation/ownership and config (`backend/src/__tests__/`). Frontend — Playwright E2E, desktop and mobile projects (`frontend/e2e/site.spec.ts`): every public route renders with no runtime errors and no horizontal overflow, security headers present, FAQ toggle behaviour, 404 page, signed-out redirects on all four dashboards, and (opt-in, `E2E_DEMO_LOGIN=true`) a real login round-trip to the student portal.
- Status: Fixed. Verification: `npm test -w backend` 64/64; `npm run test:e2e -w frontend` 24/24 including the login test against the running backend.

**Backend type error** — `registrations.ts` passed `string | string[]` where a string was required (surfaced by the newly typed `Request`).
- Fix: coerce and validate the param once. Status: Fixed. Verification: `tsc --noEmit` clean.

**Documentation out of date** — README referenced `run-dev.bat`, `PortalContext.js`, and said the superadmin demo did not exist; no env-var table, no test/CI/production-build instructions.
- Fix: README rewritten in those sections (stack table, env-var table, quality checks, production build). Status: Fixed.

### Low

**Repository clutter** — `.agents/` (41 files), `.mcp.json`, `skills-lock.json`, `memory.md`, `run-dev.bat`, two unused images. Removed and ignored. *Fixed.*

**Duplicated constants / loose typing** — see SECURITY-AUDIT.md L4/L5. *Fixed / partially fixed.*

**Large files** — `globals.css` (~5.4k lines, several historical "layers" overriding each other), `admin-portal/page.tsx` (836 lines), `PortalContext.tsx` (832 lines). They work and are internally documented; splitting them is a refactor with regression risk and no functional gain, so it was deliberately not done in an audit pass. *Open (informational).*

### Informational

- The Next.js dev server rewrites `frontend/AGENTS.md`/`CLAUDE.md` on each run; they are removed and ignored so the tree stays clean.
- Render's free tier sleeps the backend; `render-keepalive.yml` pings it every 5 minutes and `supabase-keepalive.yml` keeps the database project from pausing. Both are existing, working mitigations, not fixes.
- The landing hero renders a ~65k-glyph ASCII note with a 3D transform and per-strip wave; measured at 60 fps in headless (software) rendering, so it is not a performance concern on real hardware.

## Final status

### Codebase
| Item | Status | How checked |
|---|---|---|
| Structure (workspace: `frontend/`, `backend/`, migrations, scripts) | PASS | Reviewed; no duplicate folders/components |
| Dead code / unused files | PASS | Unreferenced-module scan; unused assets and tooling removed; ESLint `--max-warnings=0` |
| Duplication | PASS | `STATUS_LABEL` consolidated; API calls centralised in `lib/api.ts`; the one intentional duplicate (fallback events) is commented on both sides |
| Naming / style | PASS | ESLint clean; consistent TS/TSX conventions |
| Oversized files | NOT VERIFIED | Left as-is by decision (see Low) |

### Security
| Item | Status | How checked |
|---|---|---|
| Authentication (Supabase Auth, JWT forwarded) | PASS | Live login round-trip in E2E |
| Authorization (RLS + triggers, staff checks for R2) | PASS | Policy inspection; Supabase advisor shows no RLS-disabled tables |
| IDOR on uploads (`r2_key`) | PASS | Fixed + unit-tested |
| Injection (SQL / command) | PASS | No string-built SQL; no shell execution; Zod on all inputs |
| XSS | PASS | No `dangerouslySetInnerHTML`/`innerHTML`/`eval` (grep); CSP present |
| CSRF | NOT APPLICABLE | Bearer-token API, no cookies |
| CORS | PASS | Explicit allowlist from `FRONTEND_ORIGIN`; rejects are logged, not thrown |
| Secrets | PASS | `.env` ignored; history scanned clean; `.env.example` has names only |
| File uploads | PASS | Staff-only, MIME allowlist, size caps, signed `Content-Length` |
| Security headers | PASS | E2E asserts CSP, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| Rate limiting per client | NOT VERIFIED | `trust proxy` set; only observable behind Render |
| Demo accounts | FAIL (until actioned) | Accounts still exist with a public password |

### Testing
| Item | Status | How checked |
|---|---|---|
| Unit (backend) | PASS | 64/64 Vitest |
| Integration (API ↔ DB) | PASS | Demo-login E2E exercises `/api/profile`, `/api/events`, etc. against real Supabase |
| E2E | PASS | 24/24 Playwright, desktop + mobile |
| Security tests | PASS | Signed-out redirects, security headers, ownership unit tests, validation unit tests |
| Regression | PASS | Full E2E + unit suites after all changes |
| Performance | NOT VERIFIED | No Lighthouse run in this environment; hero measured at 60 fps |
| Accessibility | NOT VERIFIED | Semantics reviewed (labels on forms, `aria-expanded` on FAQ, alt text on images); no automated a11y scan |

### Production
| Item | Status | How checked |
|---|---|---|
| Frontend production build | PASS | `next build` — 14 static routes |
| Backend start | PASS | `tsx src/server.ts`; `/health` 200 |
| Environment variables | PASS | Single root `.env`, documented table, `.env.example` complete |
| Database migrations | PASS | 11 SQL migrations tracked under `backend/supabase/migrations/` |
| Deployment config | NOT VERIFIED | Vercel/Render env values are not accessible from here; `FRONTEND_ORIGIN` must include the Vercel origin |
| Monitoring / alerting | FAIL | None beyond keepalive pings; recommend Render/Vercel log drains or an uptime monitor |
| Error handling | PASS | Central `sendError`; generic client messages; `error.tsx`/`not-found.tsx` present |

## Remaining actions for the owner

1. Delete or re-password `student@`, `admin@`, `superadmin@matrix.club` in Supabase Auth (or knowingly keep them for a showcase).
2. Enable leaked-password protection in Supabase Auth (dashboard).
3. Set `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true` on Vercel only if the demo buttons should stay on the live site.
4. Optionally schedule the `is_staff` → private-schema migration (SECURITY-AUDIT.md M3).
5. Add an uptime monitor / log drain for the Render backend.
