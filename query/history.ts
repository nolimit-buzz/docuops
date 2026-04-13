'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const getHistory = async (params?: Record<string, string | number>) => {
  let path = ENDPOINTS.HISTORY.LIST;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    path += `?${qs}`;
  }
  try {
    return await apiJson(path);
  } catch {
    return null;
  }
};
