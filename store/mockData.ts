import { User, Organization, Document, Template, KnowledgeChunk, UserRole, DocStatus } from '../types';

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
      { id: 's-1', title: 'Executive Summary', systemPrompt: 'Summarize the project goals, timeline, and value proposition concisely.', required: true },
      { id: 's-2', title: 'Scope of Work', systemPrompt: 'Detail the specific deliverables, phases, and technical requirements.', required: true },
      { id: 's-3', title: 'Budget & Timeline', systemPrompt: 'Outline the cost breakdown and estimated delivery schedule.', required: true },
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
      { id: 's-1', title: 'Definitions', systemPrompt: 'Define Confidential Information and excluded information types.', required: true },
      { id: 's-2', title: 'Obligations', systemPrompt: 'State the receiving party obligations regarding secrecy.', required: true },
    ],
  },
];

export const MOCK_KNOWLEDGE: KnowledgeChunk[] = [
  { id: 'k-1', title: 'Company Pricing Model 2024', content: 'Our standard hourly rate is $150/hr for engineering. Enterprise plans start at $50k/year.', tags: ['pricing', 'sales'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
  { id: 'k-2', title: 'Security Standards', content: 'We adhere to SOC2 Type II compliance. All data is encrypted at rest using AES-256.', tags: ['security', 'compliance'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
];

export const MOCK_DOCS: Document[] = [
  {
    id: 'd-1',
    title: 'Q3 Web Upgrade Proposal',
    templateId: 't-1',
    status: DocStatus.DRAFT,
    organizationId: 'org-1',
    createdBy: 'u-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    projectContext: {
      clientName: 'Global Tech Industries',
      category: 'Software Development',
      budget: '$75,000',
      timeline: '12 Weeks',
      processSummary: 'Standard Agile Protocol applies.',
    },
    sections: [
      { sectionId: 's-1', content: '**Executive Summary**\n\nThis proposal outlines the strategic upgrade of the main marketing site for Global Tech Industries.', isAiGenerated: true, ragSourcesUsed: [], comments: [] },
      { sectionId: 's-2', content: '**Scope of Work**\n\nPhase 1: Design & Discovery (Weeks 1-3)', isAiGenerated: true, ragSourcesUsed: [], comments: [] },
      { sectionId: 's-3', content: '**Budget Breakdown**\n\n- Design: $15,000\n- Development: $45,000\n- Project Management: $15,000', isAiGenerated: true, ragSourcesUsed: ['k-1'], comments: [] },
    ],
    versions: [
      { id: 'v-1', versionNumber: '1.0', createdAt: new Date(Date.now() - 172800000).toISOString(), createdBy: 'Jane Doe', changesSummary: 'Initial draft created' },
      { id: 'v-2', versionNumber: '1.1', createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: 'Jane Doe', changesSummary: 'Updated budget section' },
    ],
    globalComments: [
      { id: 'c-1', userId: 'u-2', userName: 'Alex Brown', text: 'Can we check if the timeline includes QA?', timestamp: new Date(Date.now() - 40000000).toISOString() },
    ],
    collaborators: [
      { userId: 'u-2', name: 'Alex Brown', email: 'alex@acme.com', role: UserRole.EDITOR, avatar: 'https://placehold.co/100x100?text=AB' },
      { userId: 'u-3', name: 'Chris Evans', email: 'chris@acme.com', role: UserRole.REVIEWER, avatar: 'https://placehold.co/100x100?text=CE' },
    ],
  },
];
