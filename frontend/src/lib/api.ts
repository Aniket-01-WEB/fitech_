import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://fitech-02.onrender.com';
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 1500;

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

export interface ApiFetchOptions {
  method?: string;
  body?: unknown;
}

export async function apiFetch<T = any>(path: string, { method = 'GET', body }: ApiFetchOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  const url = `${API_BASE}${path}`;

  let res: Response;
  try {
    res = await fetchWithTimeout(url, fetchOptions);
  } catch (firstErr: unknown) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    try {
      res = await fetchWithTimeout(url, fetchOptions);
    } catch (secondErr: unknown) {
      if (secondErr instanceof Error && secondErr.name === 'AbortError') {
        throw new Error('The server took too long to respond. Please try again.');
      }
      throw new Error("Can't reach the server right now. Check your connection and try again.");
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || 'Something went wrong. Please try again.');
  }
  return json as T;
}

export const api = {
  get: <T = any>(path: string) => apiFetch<T>(path),
  post: <T = any>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'POST', body }),
  patch: <T = any>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PATCH', body }),
  delete: <T = any>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
