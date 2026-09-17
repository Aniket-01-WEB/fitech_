import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the repo-root .env by resolved path (not Next's own default of
// frontend/.env.local) so this reads the same single shared file the
// backend does. Must happen before anything below reads process.env.
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '.env.local');

if (typeof process.loadEnvFile === 'function') {
  if (fs.existsSync(envPath)) {
    try { process.loadEnvFile(envPath); } catch {}
  }
  if (fs.existsSync(envLocalPath)) {
    try { process.loadEnvFile(envLocalPath); } catch {}
  }
} else {
  try {
    const dotenv = (await import('dotenv')).default;
    dotenv.config({ path: envPath });
    dotenv.config({ path: envLocalPath });
  } catch {}
}

const isDev = process.env.NODE_ENV !== 'production';

// Every external host this app actually talks to — nothing broader.
// Built from env vars (not hardcoded) so this keeps working if the
// Supabase project or deployed API URL ever changes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseWsUrl = supabaseUrl.replace(/^https:/, 'wss:');
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fitech-02.onrender.com';

const connectSrc = [
  "'self'",
  supabaseUrl,
  supabaseWsUrl,
  apiUrl,
  'https://fitech-02.onrender.com',
  'http://localhost:4000', // local backend when running `npm run dev`
  'http://127.0.0.1:4000',
  'https://*.r2.cloudflarestorage.com', // R2 presigned PUT/GET, called straight from the browser
  'https://script.google.com', // JoinModal's fire-and-forget backup-log webhook
].filter(Boolean).join(' ');

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' here is a deliberate trade-off, not an oversight:
  // Next.js injects its own inline bootstrap/hydration scripts (hashed,
  // framework-controlled) that a strict script-src blocks outright
  // without a full per-request nonce pipeline (App Router middleware +
  // threading the nonce through every render) — verified live, it broke
  // every page. What this directive still does: block any injected
  // <script src="https://attacker.example/x.js">, the actual delivery
  // vector if a stored-XSS payload ever got in. Since this app has zero
  // dangerouslySetInnerHTML/innerHTML/eval anywhere (verified) and every
  // staff-supplied URL is now scheme-validated at both the API and
  // database layers, there's no known injection point for this to be
  // covering regardless. Turbopack/webpack's dev-mode Fast Refresh also
  // needs eval() for HMR — 'unsafe-eval' is scoped to dev only.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // This app uses inline style={{...}} throughout (not a redesign target)
  // and globals.css @imports Google Fonts — both need 'unsafe-inline'/the
  // googleapis host on the style directives specifically. script-src stays
  // free of 'unsafe-inline' regardless.
  "style-src 'self' 'unsafe-inline'",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:", // admin-supplied event/note banners can be any https image URL
  `connect-src ${connectSrc}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  // Disables Next.js's own dev-mode indicator — the floating circular
  // "N" badge it renders in the bottom-left corner during `next dev`.
  // Framework-injected, not part of this app's own markup/CSS; already
  // absent from production builds regardless.
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Ignored by browsers over plain http:// (dev) — takes effect
          // automatically once this is actually served over https://.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
