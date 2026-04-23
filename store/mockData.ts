import { User, Organization, Document, Template, KnowledgeChunk, UserRole } from '../types';

export const MOCK_ORG: Organization = { id: 'org-1', name: 'Acme Corp', plan: 'Pro' };

export const MOCK_USER: User = {
  id: 'u-1',
  name: 'Jane Doe',
  email: 'jane@acme.com',
  role: UserRole.ADMIN,
  avatar: 'https://placehold.co/100x100?text=JD',
  organizationId: 'org-1',
};

export const MOCK_TEMPLATES: Template[] = [];

export const MOCK_KNOWLEDGE: KnowledgeChunk[] = [
  { id: 'k-1', title: 'Company Pricing Model 2024', content: 'Our standard hourly rate is $150/hr for engineering. Enterprise plans start at $50k/year.', tags: ['pricing', 'sales'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
  { id: 'k-2', title: 'Security Standards', content: 'We adhere to SOC2 Type II compliance. All data is encrypted at rest using AES-256.', tags: ['security', 'compliance'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
];

export const MOCK_DOCS: Document[] = [];
