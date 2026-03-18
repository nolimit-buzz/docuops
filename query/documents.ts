import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

const resolveEndpoint = (id: string, type: string) =>
  type === 'MarketReport' ? ENDPOINTS.MARKET_REPORTS.GET(id) : ENDPOINTS.NBC_PAPERS.GET(id);

export const deleteDocument = (id: string, type: string) =>
  apiClient.delete(resolveEndpoint(id, type));

export const updateDocument = (id: string, type: string, data: any) =>
  apiClient.put(resolveEndpoint(id, type), data);
