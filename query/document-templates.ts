'use server';

import { apiJson } from '@/lib/query-helpers';
import { ENDPOINTS } from '@/lib/sdk/endpoints';
import { DocumentTemplate, DocumentTemplatesResponse } from '@/types';

export const fetchDocumentTemplates = async (): Promise<DocumentTemplatesResponse> =>
  apiJson<DocumentTemplatesResponse>(ENDPOINTS.DOCUMENT_TEMPLATES.LIST);

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
