import apiClient from '@/lib/sdk/api-client';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { Document, DocStatus } from '../types';

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

function mapNbcPaperToDocument(paper: any): Document {
  return {
    id: String(paper.id),
    title: `${paper.transactionType || 'NBC Paper'} - ${paper.companyName || ''}`.trim(),
    templateId: 't-1',
    status: paper.status === 'submitted' ? DocStatus.REVIEW : DocStatus.DRAFT,
    organizationId: paper.organizationId || '',
    createdBy: paper.createdBy || '',
    createdAt: paper.createdAt || new Date().toISOString(),
    updatedAt: paper.updatedAt || new Date().toISOString(),
    sections: [],
    projectContext: {
      clientName: paper.companyName || '',
      category: paper.transactionType || '',
      budget: paper.projectDetails?.sdgGoals || '',
      timeline: paper.projectDetails?.location || '',
      processSummary: '',
    },
  };
}

function mapMarketReportToDocument(report: any): Document {
  return {
    id: String(report.id),
    title: `Market Report - ${report.countryName || ''} ${report.year || ''}`.trim(),
    templateId: 't-1',
    status: report.status === 'submitted' ? DocStatus.REVIEW : DocStatus.DRAFT,
    organizationId: report.organizationId || '',
    createdBy: report.createdBy || '',
    createdAt: report.createdAt || new Date().toISOString(),
    updatedAt: report.updatedAt || new Date().toISOString(),
    sections: [],
    projectContext: {
      clientName: report.countryName || '',
      category: 'Market Report',
      budget: '',
      timeline: String(report.year || ''),
      processSummary: '',
    },
  };
}

export const fetchUserDocuments = async (): Promise<Document[]> => {
  const [nbcResult, mrResult] = await Promise.allSettled([
    apiClient.get<{ docs: any[] }>(ENDPOINTS.NBC_PAPERS.LIST),
    apiClient.get<{ docs: any[] }>(ENDPOINTS.MARKET_REPORTS.LIST),
  ]);

  const docs: Document[] = [];
  if (nbcResult.status === 'fulfilled') {
    const papers = Array.isArray((nbcResult.value as any)?.docs) ? (nbcResult.value as any).docs : [];
    docs.push(...papers.map(mapNbcPaperToDocument));
  }
  if (mrResult.status === 'fulfilled') {
    const reports = Array.isArray((mrResult.value as any)?.docs) ? (mrResult.value as any).docs : [];
    docs.push(...reports.map(mapMarketReportToDocument));
  }
  return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
