import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const getAllUsers = (query?: string) => {
  const url = query
    ? `${ENDPOINTS.USERS.ALL}?query=${encodeURIComponent(query)}`
    : ENDPOINTS.USERS.ALL;
  return apiClient.get(url);
};
