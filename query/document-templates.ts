'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { DocumentTemplate, DocumentTemplatesResponse } from '@/types';

export const fetchDocumentTemplates = async (): Promise<DocumentTemplatesResponse> =>
  apiJson<DocumentTemplatesResponse>(ENDPOINTS.DOCUMENT_TEMPLATES.LIST);

export const fetchDocumentTemplateById = async (id: string): Promise<DocumentTemplate> =>
  apiJson<DocumentTemplate>(ENDPOINTS.DOCUMENT_TEMPLATES.GET(id));

export const createDocumentTemplate = async (data: {
  name: string;
  category: string;
  description: string;
  prompt?: string;
  structure?: any[];
  fields: any[];
  status?: string;
}): Promise<DocumentTemplate> => {
  const res = await apiJson<{ data: DocumentTemplate }>(ENDPOINTS.DOCUMENT_TEMPLATES.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateDocumentTemplate = async (
  id: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
    prompt?: string;
    structure?: any[];
    fields?: any[];
    status?: string;
  }
): Promise<DocumentTemplate> => {
  const res = await apiJson<{ data: DocumentTemplate }>(ENDPOINTS.DOCUMENT_TEMPLATES.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteDocumentTemplate = async (id: string): Promise<void> =>
  apiJson<void>(ENDPOINTS.DOCUMENT_TEMPLATES.DELETE(id), {
    method: 'DELETE',
  });
