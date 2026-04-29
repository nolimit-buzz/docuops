'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { Document } from '@/types';

export interface CreateDocumentPayload {
  templateId: string;
  companyId: string;
  createdBy: string;
  title: string;
  projectContext: Record<string, unknown>;
  sections: unknown[];
  collaborators: Record<string, unknown>;
}

// Fetches server-persisted documents. Local paperDrafts are managed separately via useStore.setPaperDraft.
export const listDocuments = async (): Promise<Document[]> => {
  const result = await apiJson<{ docs?: Document[] } | Document[]>(ENDPOINTS.DOCUMENTS.LIST);
  if (Array.isArray(result)) return result;
  return result.docs ?? [];
};

// Called on sign — backend auto-assigns real ID. Draft ID is never sent in payload.
export const createNewDocument = async (data: CreateDocumentPayload): Promise<Document> => {
  const result = await apiJson<{ docs: Document[] }>(ENDPOINTS.DOCUMENTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const doc = result.docs?.[0];
  if (!doc?.id) throw new Error('Document created but response did not include an ID.');
  return doc;
};
