'use server';

import { ENDPOINTS } from '@/lib/sdk/endpoints';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}${ENDPOINTS.AUTH.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.message ?? data?.message ?? data?.error ?? 'Login failed';
    throw new Error(message);
  }

  // Login response shape: { data: { accessToken, ... } }
  const accessToken: string | undefined =
    data?.data?.accessToken ?? data?.accessToken;

  try {
    const infoRes = await fetch(`${API_URL}${ENDPOINTS.AUTH.USER_INFO}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: 'no-store',
    });
    if (infoRes.ok) {
      const company = await infoRes.json();
      return { ...data, company };
    }
  } catch {
    // /userinfo failure must never block login
  }

  return data;
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) {
  const res = await fetch(`${API_URL}${ENDPOINTS.AUTH.REGISTER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, collection: 'users' }),
    cache: 'no-store',
  });

  const body = await res.json();

  if (!res.ok) {
    const message =
      body?.errors?.[0]?.message ?? body?.message ?? body?.error ?? 'Registration failed';
    throw new Error(message);
  }

  return body;
}
