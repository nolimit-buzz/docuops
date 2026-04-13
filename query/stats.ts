'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export interface CompanyStats {
  stats: {
    totalDocuments: number;
    activeTemplates: number;
    inReview: number;
    approved: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: string;
  }>;
  chartData: Array<{
    date: string;
    docs: number;
    tokens: number;
  }>;
}

export async function getCompanyStats(userId: string): Promise<CompanyStats | null> {
  try {
    return await apiJson<CompanyStats>(ENDPOINTS.COMPANY_STATS.GET(userId));
  } catch {
    return null;
  }
}
