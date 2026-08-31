import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

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
