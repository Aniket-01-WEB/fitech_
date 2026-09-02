import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/index.js';
import { generalLimiter } from './lib/rateLimit.js';

const app = express();
const PORT = process.env.PORT || 4000;
// Comma-separated for prod + local dev at once, e.g.
// "https://fitech.club,http://localhost:3000". Never a wildcard — this API
// is credentialed (Authorization header), so the allowed origin list must
// be explicit.
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // No Origin header (curl, server-to-server, same-origin) — allow.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // A disallowed origin is expected, routine traffic (bots, scanners,
    // a stray preview-deployment URL) — not an application error, so
    // callback(null, false) just omits the CORS headers (the browser
    // enforces the actual block) instead of throwing, which would
    // otherwise fall through to the generic error handler and log a
    // full stack trace for every single rejected request.
    console.warn(`[cors] rejected origin: ${origin}`);
    callback(null, false);
  },
  credentials: true,
}));
// Default 100kb is deliberately kept small — every real payload here is
// short JSON (titles, descriptions, ids); actual file bytes never pass
// through this body parser, they go straight to R2 via presigned URL.
app.use(express.json());
app.use(generalLimiter);

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'matrix-backend',
    status: 'online',
    health: '/health',
    api: '/api'
  });
});

app.get('/health', (req, res) => res.json({ ok: true, service: 'matrix-backend' }));

app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Express 5 forwards rejected promises from async route handlers here
// automatically, so this one place catches anything a route didn't
// already turn into a JSON error response itself.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`MATRIX backend listening on http://localhost:${PORT}`);
});
