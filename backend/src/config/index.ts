// Centralised environment configuration — every env var the backend reads
// is imported from here, so nothing is scattered across random files.

const PORT = process.env.PORT || 4000;

// Comma-separated for prod + local dev at once, e.g.
// "https://fitech.club,http://localhost:3000". Never a wildcard — this API
// is credentialed (Authorization header), so the allowed origin list must
// be explicit.
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const configuredOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = Array.from(
  new Set([
    ...(process.env.NODE_ENV === 'production' ? [] : defaultOrigins),
    ...configuredOrigins,
    ...(configuredOrigins.length === 0 ? defaultOrigins : []),
  ])
);

export { PORT, ALLOWED_ORIGINS };
