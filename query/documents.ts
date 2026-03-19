import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

const resolveEndpoint = (id: string, type: string) =>
  type === 'MarketReport' ? ENDPOINTS.MARKET_REPORTS.GET(id) : ENDPOINTS.NBC_PAPERS.GET(id);

export const createDocument = (
  docType: string,
  data: { clientName: string; category: string; budget: string; timeline: string; processSummary: string }
) => {
  if (docType === 'Proposal') {
    return apiClient.post(ENDPOINTS.MARKET_REPORTS.CREATE, {
      countryName: data.clientName,
      year: String(new Date().getFullYear()),
    });
  }

  return apiClient.post(ENDPOINTS.NBC_PAPERS.CREATE, {
    companyName: data.clientName,
    transactionType: data.category,
    structuringLeads: [],
    sponsors: [],
    projectDetails: {
      location: data.timeline,
      sdgGoals: data.budget,
    },
  });
};

export const deleteDocument = (id: string, type: string) =>
  apiClient.delete(resolveEndpoint(id, type));

export const updateDocument = (id: string, type: string, data: any) =>
  apiClient.put(resolveEndpoint(id, type), data);
