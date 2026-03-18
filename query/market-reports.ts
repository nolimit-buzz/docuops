import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const createMarketReport = (data: { countryName: string; year: string }) =>
  apiClient.post(ENDPOINTS.MARKET_REPORTS.CREATE, data);

export const getMarketReport = (id: string) =>
  apiClient.get(ENDPOINTS.MARKET_REPORTS.GET(id));

export const updateMarketReport = (id: string, data: any) =>
  apiClient.put(ENDPOINTS.MARKET_REPORTS.UPDATE(id), data);

export const deleteMarketReport = (id: string) =>
  apiClient.delete(ENDPOINTS.MARKET_REPORTS.DELETE(id));

export const submitMarketReport = (id: string, data?: any) =>
  apiClient.put(ENDPOINTS.MARKET_REPORTS.SUBMIT(id), data);

export const updateMarketReportSection = (id: string, key: string, data: any) =>
  apiClient.put(ENDPOINTS.MARKET_REPORTS.UPDATE_SECTION(id, key), data);

export const updateMarketReportSubsection = (
  id: string,
  sectionKey: string,
  subsectionKey: string,
  data: any
) => apiClient.put(ENDPOINTS.MARKET_REPORTS.UPDATE_SUBSECTION(id, sectionKey, subsectionKey), data);

export const regenerateMarketReport = (id: string, data?: any) =>
  apiClient.post(ENDPOINTS.MARKET_REPORTS.REGENERATE(id), data);

export const regenerateMarketReportSubsection = (id: string, data?: any) =>
  apiClient.post(ENDPOINTS.MARKET_REPORTS.REGENERATE_SUBSECTION(id), data);
