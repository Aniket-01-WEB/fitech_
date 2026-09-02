import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 1500;

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

/**
 * Calls the backend API, attaching the current Supabase session's access
 * token so the request carries the caller's real identity — the backend
 * forwards it straight through to Postgres, which is what actually
 * enforces who can see or change what (RLS), not this function.
 *
 * A network-level failure (not an HTTP error response — the connection
 * itself failing, or timing out) gets ONE silent retry after a short
 * delay before giving up. This exists for one specific, real scenario:
 * the live backend runs on Render's free tier, which sleeps after 15
 * minutes idle — a keepalive job pings it every 5 minutes specifically
 * to make that rare (see .github/workflows/render-keepalive.yml), but
 * "rare" isn't "never", and the first request to a still-waking instance
 * fails to connect outright. A short pause and one retry very likely
 * lands after it's finished waking up, so a user who happens to click a
 * button in that narrow window just sees a slightly slower click instead
 * of an error. (This does mean a create-style POST could in principle
 * run twice if the first attempt's response was lost after the server
 * already processed it — a real but very narrow edge case; the routes
 * with a natural uniqueness constraint, like registrations and admin
 * requests, are fully protected from it regardless.)
 *
 * Every failure path here — unreachable, timeout, malformed response, an
 * actual HTTP error — always throws a plain, short, user-safe Error.
 * Nothing here ever surfaces a raw TypeError, stack trace, or
 * network-internals message to a caller.
 */
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const fetchOptions = { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined };
  const url = `${API_BASE}${path}`;

  let res;
  try {
    res = await fetchWithTimeout(url, fetchOptions);
  } catch (firstErr) {
    console.warn(`[api] ${method} ${path} first attempt failed (${firstErr?.message || firstErr}), retrying once`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    try {
      res = await fetchWithTimeout(url, fetchOptions);
    } catch (secondErr) {
      console.warn(`[api] ${method} ${path} network failure after retry: ${secondErr?.message || secondErr}`);
      if (secondErr?.name === 'AbortError') {
        throw new Error('The server took too long to respond. Please try again.');
      }
      throw new Error("Can't reach the server right now. Check your connection and try again.");
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // The backend's own error messages are already written to be safe,
    // user-facing text (see backend/src/lib/errorResponse.js) — this is
    // the one case where forwarding `json.error` is intentional, not a
    // leak. Anything unexpected (a non-JSON response, a proxy/gateway
    // error page) falls back to a generic message instead.
    throw new Error(json.error || 'Something went wrong. Please try again.');
  }
  return json;
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
};
