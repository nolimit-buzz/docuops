'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const getAllUsers = async (query?: string) => {
  const path = query
    ? `${ENDPOINTS.USERS.ALL}?query=${encodeURIComponent(query)}`
    : ENDPOINTS.USERS.ALL;
  return apiJson(path);
};
