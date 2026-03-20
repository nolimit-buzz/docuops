import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { AxiosRequestConfig } from 'axios';

export const getHistory = (config?: AxiosRequestConfig) =>
  apiClient.get(ENDPOINTS.HISTORY.LIST, config);
