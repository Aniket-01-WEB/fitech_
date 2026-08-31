import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

/**
 * Calls the backend API, attaching the current Supabase session's access
 * token so the request carries the caller's real identity — the backend
 * forwards it straight through to Postgres, which is what actually
 * enforces who can see or change what (RLS), not this function.
 */
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Request to ${path} failed (${res.status})`);
  }
  return json;
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
};
