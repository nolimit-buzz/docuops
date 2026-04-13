'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const createMarketReport = async (data: { countryName: string; year: string }) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.CREATE, { method: 'POST', body: JSON.stringify(data) });

export const getMarketReport = async (id: string) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.GET(id));

export const updateMarketReport = async (id: string, data: any) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.UPDATE(id), { method: 'PUT', body: JSON.stringify(data) });

export const deleteMarketReport = async (id: string) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.DELETE(id), { method: 'DELETE' });

export const submitMarketReport = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.SUBMIT(id), { method: 'PUT', body: JSON.stringify(data ?? {}) });

export const updateMarketReportSection = async (id: string, key: string, data: any) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.UPDATE_SECTION(id, key), { method: 'PUT', body: JSON.stringify(data) });

export const updateMarketReportSubsection = async (
  id: string,
  sectionKey: string,
  subsectionKey: string,
  data: any
) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.UPDATE_SUBSECTION(id, sectionKey, subsectionKey), {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const regenerateMarketReport = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.REGENERATE(id), { method: 'POST', body: JSON.stringify(data ?? {}) });

export const regenerateMarketReportSubsection = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.MARKET_REPORTS.REGENERATE_SUBSECTION(id), {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  });
