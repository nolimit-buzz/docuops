import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export const createNbcPaper = (data: {
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
}) => apiClient.post(ENDPOINTS.NBC_PAPERS.CREATE, data);

export const getNbcPaper = (id: string) =>
  apiClient.get(ENDPOINTS.NBC_PAPERS.GET(id));

export const updateNbcPaper = (id: string, data: any) =>
  apiClient.put(ENDPOINTS.NBC_PAPERS.UPDATE(id), data);

export const deleteNbcPaper = (id: string) =>
  apiClient.delete(ENDPOINTS.NBC_PAPERS.DELETE(id));

export const submitNbcPaper = (id: string, data?: any) =>
  apiClient.put(ENDPOINTS.NBC_PAPERS.SUBMIT(id), data);

export const updateNbcPaperSection = (id: string, key: string, data: any) =>
  apiClient.put(ENDPOINTS.NBC_PAPERS.UPDATE_SECTION(id, key), data);

export const updateNbcPaperSubsection = (
  id: string,
  sectionKey: string,
  subsectionKey: string,
  data: any
) => apiClient.put(ENDPOINTS.NBC_PAPERS.UPDATE_SUBSECTION(id, sectionKey, subsectionKey), data);

export const regenerateNbcPaper = (id: string, data?: any) =>
  apiClient.post(ENDPOINTS.NBC_PAPERS.REGENERATE(id), data);

export const regenerateNbcPaperSubsection = (id: string, data?: any) =>
  apiClient.post(ENDPOINTS.NBC_PAPERS.REGENERATE_SUBSECTION(id), data);
