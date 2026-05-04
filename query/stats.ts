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

export async function getCompanyStats(): Promise<CompanyStats | null> {
  try {
    const data = await apiJson<CompanyStats>(ENDPOINTS.COMPANY_STATS.GET);
    console.log("[Server] company_stats raw response:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("[Server] company_stats fetch failed:", err);
    return null;
  }
}
