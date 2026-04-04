'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const createNbcPaper = async (data: {
  structuringLeads: string[];
  companyName: string;
  transactionType: string;
  sponsors: string[];
  projectDetails: {
    tenor?: number;
    location: string;
    debtNeed?: number;
    sdgGoals?: string;
  };
}) => apiJson(ENDPOINTS.NBC_PAPERS.CREATE, { method: 'POST', body: JSON.stringify(data) });

export const getNbcPaper = async (id: string) =>
  apiJson(ENDPOINTS.NBC_PAPERS.GET(id));

export const updateNbcPaper = async (id: string, data: any) =>
  apiJson(ENDPOINTS.NBC_PAPERS.UPDATE(id), { method: 'PUT', body: JSON.stringify(data) });

export const deleteNbcPaper = async (id: string) =>
  apiJson(ENDPOINTS.NBC_PAPERS.DELETE(id), { method: 'DELETE' });

export const submitNbcPaper = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.NBC_PAPERS.SUBMIT(id), { method: 'PUT', body: JSON.stringify(data ?? {}) });

export const updateNbcPaperSection = async (id: string, key: string, data: any) =>
  apiJson(ENDPOINTS.NBC_PAPERS.UPDATE_SECTION(id, key), { method: 'PUT', body: JSON.stringify(data) });

export const updateNbcPaperSubsection = async (
  id: string,
  sectionKey: string,
  subsectionKey: string,
  data: any
) =>
  apiJson(ENDPOINTS.NBC_PAPERS.UPDATE_SUBSECTION(id, sectionKey, subsectionKey), {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const regenerateNbcPaper = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.NBC_PAPERS.REGENERATE(id), { method: 'POST', body: JSON.stringify(data ?? {}) });

export const regenerateNbcPaperSubsection = async (id: string, data?: any) =>
  apiJson(ENDPOINTS.NBC_PAPERS.REGENERATE_SUBSECTION(id), {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  });
