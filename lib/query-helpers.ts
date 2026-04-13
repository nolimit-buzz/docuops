import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = (await cookies()).get('accessToken')?.value;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' });
}

export async function apiJson<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const body = await res.json();
  if (!res.ok) {
    const msg =
      body?.errors?.[0]?.message ?? body?.message ?? body?.error ?? 'Request failed';
    throw new Error(msg);
  }
  return body as T;
}
