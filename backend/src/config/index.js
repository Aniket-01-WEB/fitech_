// Centralised environment configuration — every env var the backend reads
// is imported from here, so nothing is scattered across random files.

const PORT = process.env.PORT || 4000;

// Comma-separated for prod + local dev at once, e.g.
// "https://fitech.club,http://localhost:3000". Never a wildcard — this API
// is credentialed (Authorization header), so the allowed origin list must
// be explicit.
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export { PORT, ALLOWED_ORIGINS };
