import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const REQUEST_TIMEOUT_MS = 15000;

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

/**
 * Calls the backend API, attaching the current Supabase session's access
 * token so the request carries the caller's real identity — the backend
 * forwards it straight through to Postgres, which is what actually
 * enforces who can see or change what (RLS), not this function.
 *
 * Every failure path here — the backend unreachable, a timeout, a
 * malformed response, an actual HTTP error — always throws a plain,
 * short, user-safe Error. Nothing here ever surfaces a raw TypeError,
 * stack trace, or network-internals message to a caller; those go to
 * the console for developers, not into anything a user could see (and
 * not as a raw Error object either, so Next's dev overlay doesn't
 * flag an expected, handled failure as a crash).
 */
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    console.warn(`[api] ${method} ${path} network failure: ${err?.message || err}`);
    if (err?.name === 'AbortError') {
      throw new Error('The server took too long to respond. Please try again.');
    }
    throw new Error("Can't reach the server right now. Check your connection and try again.");
  } finally {
    clearTimeout(timeoutId);
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
