// Centralised environment configuration — every env var the backend reads
// is imported from here, so nothing is scattered across random files.

const PORT = process.env.PORT || 4000;

// Origins allowed to call this API from a browser. The deployed frontend
// and local dev are always allowed, so a stale or missing FRONTEND_ORIGIN
// on the host can never take the live site down (it did once: the Render
// value pointed at an old Vercel URL and every request was CORS-blocked).
// FRONTEND_ORIGIN adds more, comma-separated. Never a wildcard — this API
// is credentialed (Authorization header), so the list stays explicit.
const PRODUCTION_FRONTEND = 'https://fitech-eta.vercel.app';
const LOCAL_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const configuredOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const ALLOWED_ORIGINS = Array.from(new Set([PRODUCTION_FRONTEND, ...LOCAL_ORIGINS, ...configuredOrigins]));

export { PORT, ALLOWED_ORIGINS };
