import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const login = (email: string, password: string) =>
  apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });

export const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) => apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
