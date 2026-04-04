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

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 't-1',
    name: 'Project Proposal',
    description: 'Standard software development proposal.',
    category: 'Sales',
    createdBy: 'u-1',
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 's-1', type: 'heading', title: 'Executive Summary', systemPrompt: 'Summarize the project goals, timeline, and value proposition concisely.', required: true },
      { id: 's-2', type: 'text', title: 'Scope of Work', systemPrompt: 'Detail the specific deliverables, phases, and technical requirements.', required: true },
      { id: 's-3', type: 'input_text', title: 'Budget Total', placeholder: 'e.g. $50,000', systemPrompt: 'Outline the cost breakdown and estimated delivery schedule.', required: true },
    ],
  },
  {
    id: 't-2',
    name: 'NDA Agreement',
    description: 'Mutual non-disclosure agreement.',
    category: 'Legal',
    createdBy: 'u-1',
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 's-1', type: 'heading', title: 'Definitions', systemPrompt: 'Define Confidential Information and excluded information types.', required: true },
      { id: 's-2', type: 'input_textarea', title: 'Obligations', systemPrompt: 'State the receiving party obligations regarding secrecy.', required: true },
    ],
  },
];

export const MOCK_KNOWLEDGE: KnowledgeChunk[] = [
  { id: 'k-1', title: 'Company Pricing Model 2024', content: 'Our standard hourly rate is $150/hr for engineering. Enterprise plans start at $50k/year.', tags: ['pricing', 'sales'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
  { id: 'k-2', title: 'Security Standards', content: 'We adhere to SOC2 Type II compliance. All data is encrypted at rest using AES-256.', tags: ['security', 'compliance'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
];

export const MOCK_DOCS: Document[] = [];
