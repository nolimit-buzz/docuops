'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { DocumentTemplate, DocumentTemplatesResponse } from '@/types';

export const fetchDocumentTemplates = async (): Promise<DocumentTemplatesResponse> =>
  apiJson<DocumentTemplatesResponse>(ENDPOINTS.DOCUMENT_TEMPLATES.LIST);

export const fetchDocumentTemplateById = async (id: string): Promise<DocumentTemplate> =>
  apiJson<DocumentTemplate>(ENDPOINTS.DOCUMENT_TEMPLATES.GET(id));

export const createDocumentTemplate = async (data: {
  company: string;
  title: string;
  category: string;
  description: string;
  fields: DocumentTemplate['fields'];
}): Promise<DocumentTemplate> =>
  apiJson<DocumentTemplate>(ENDPOINTS.DOCUMENT_TEMPLATES.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateDocumentTemplate = async (
  id: string,
  data: {
    title?: string;
    category?: string;
    description?: string;
    fields?: DocumentTemplate['fields'];
  }
): Promise<DocumentTemplate> =>
  apiJson<DocumentTemplate>(ENDPOINTS.DOCUMENT_TEMPLATES.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
