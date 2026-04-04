'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';

export interface PaperType {
  id: string;
  name: string;
  description: string;
  template_id: string | null;
  companyId: string | null;
}

export async function getPaperTypes(): Promise<PaperType[]> {
  try {
    const res = await apiJson<{ docs: PaperType[] }>(ENDPOINTS.PAPER_TYPES.LIST);
    return res?.docs ?? [];
  } catch {
    return [];
  }
}
