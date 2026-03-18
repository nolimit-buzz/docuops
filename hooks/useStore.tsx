"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Document, Template, KnowledgeChunk, UserRole, DocStatus } from '../types';
import { sessionHelper } from '@/lib/session';

// Mock Data
const MOCK_ORG: Organization = { id: 'org-1', name: 'Acme Corp', plan: 'Pro' };

const MOCK_USER: User = {
  id: 'u-1',
  name: 'Jane Doe',
  email: 'jane@acme.com',
  role: UserRole.ADMIN,
  avatar: 'https://placehold.co/100x100?text=JD',
  organizationId: 'org-1'
};

const MOCK_TEMPLATES: Template[] = [
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
      { id: 's-3', title: 'Budget & Timeline', systemPrompt: 'Outline the cost breakdown and estimated delivery schedule.', required: true }
    ]
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
      { id: 's-2', title: 'Obligations', systemPrompt: 'State the receiving party obligations regarding secrecy.', required: true }
    ]
  }
];

const MOCK_KNOWLEDGE: KnowledgeChunk[] = [
  { id: 'k-1', title: 'Company Pricing Model 2024', content: 'Our standard hourly rate is $150/hr for engineering. Enterprise plans start at $50k/year.', tags: ['pricing', 'sales'], uploadedBy: 'u-1', createdAt: new Date().toISOString() },
  { id: 'k-2', title: 'Security Standards', content: 'We adhere to SOC2 Type II compliance. All data is encrypted at rest using AES-256.', tags: ['security', 'compliance'], uploadedBy: 'u-1', createdAt: new Date().toISOString() }
];

const MOCK_DOCS: Document[] = [
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
        processSummary: 'Standard Agile Protocol applies.'
    },
    sections: [
      { 
          sectionId: 's-1', 
          content: '**Executive Summary**\n\nThis proposal outlines the strategic upgrade of the main marketing site for Global Tech Industries. Our primary objective is to enhance user engagement by 40% while modernizing the underlying tech stack to React 18.\n\nKey outcomes include:\n- Improved SEO performance\n- Mobile-first responsive design\n- Integrated CMS for marketing autonomy', 
          isAiGenerated: true, 
          ragSourcesUsed: [], 
          comments: [] 
      },
      { 
          sectionId: 's-2', 
          content: '**Scope of Work**\n\nPhase 1: Design & Discovery (Weeks 1-3)\n- Stakeholder interviews\n- UI/UX wireframing\n\nPhase 2: Development (Weeks 4-10)\n- Frontend implementation using Next.js\n- API integration with legacy ERP\n\nPhase 3: QA & Deployment (Weeks 11-12)\n- UAT testing cycle\n- Production rollout', 
          isAiGenerated: true, 
          ragSourcesUsed: [], 
          comments: [] 
      },
       { 
          sectionId: 's-3', 
          content: '**Budget Breakdown**\n\n- Design: $15,000\n- Development: $45,000\n- Project Management: $15,000\n\n**Total Investment: $75,000**\n\nPayment Schedule: 50% upfront, 50% upon completion.', 
          isAiGenerated: true, 
          ragSourcesUsed: ['k-1'], 
          comments: [] 
      }
    ],
    versions: [
        { id: 'v-1', versionNumber: '1.0', createdAt: new Date(Date.now() - 172800000).toISOString(), createdBy: 'Jane Doe', changesSummary: 'Initial draft created' },
        { id: 'v-2', versionNumber: '1.1', createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: 'Jane Doe', changesSummary: 'Updated budget section' }
    ],
    globalComments: [
        { id: 'c-1', userId: 'u-2', userName: 'Alex Brown', text: 'Can we check if the timeline includes QA?', timestamp: new Date(Date.now() - 40000000).toISOString() }
    ],
    collaborators: [
        { userId: 'u-2', name: 'Alex Brown', email: 'alex@acme.com', role: UserRole.EDITOR, avatar: 'https://placehold.co/100x100?text=AB' },
        { userId: 'u-3', name: 'Chris Evans', email: 'chris@acme.com', role: UserRole.REVIEWER, avatar: 'https://placehold.co/100x100?text=CE' }
    ]
  }
];

interface StoreContextType {
  user: User;
  organization: Organization;
  documents: Document[];
  templates: Template[];
  knowledgeBase: KnowledgeChunk[];
  setUser: (u: User) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (doc: Document) => void;
  addTemplate: (temp: Template) => void;
  updateTemplate: (temp: Template) => void;
  addKnowledge: (chunk: KnowledgeChunk) => void;
  deleteDocument: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function mapSessionUser(raw: Record<string, unknown>): User {
  const firstName = typeof raw.firstName === 'string' ? raw.firstName : '';
  const lastName = typeof raw.lastName === 'string' ? raw.lastName : '';
  const name = typeof raw.name === 'string' && raw.name
    ? raw.name
    : [firstName, lastName].filter(Boolean).join(' ') || 'User';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const roleStr = typeof raw.role === 'string' ? raw.role.toLowerCase() : '';
  const role =
    roleStr === 'admin' ? UserRole.ADMIN :
    roleStr === 'editor' ? UserRole.EDITOR :
    roleStr === 'reviewer' ? UserRole.REVIEWER :
    UserRole.GUEST;

  return {
    id: (typeof raw._id === 'string' ? raw._id : null) ?? (typeof raw.id === 'string' ? raw.id : '') ,
    name,
    email: typeof raw.email === 'string' ? raw.email : '',
    role,
    avatar: typeof raw.avatar === 'string' && raw.avatar
      ? raw.avatar
      : `https://placehold.co/100x100?text=${initials}`,
    organizationId: typeof raw.organizationId === 'string' ? raw.organizationId : '',
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [organization] = useState<Organization>(MOCK_ORG);

  useEffect(() => {
    const sessionUser = sessionHelper.getUser();
    if (sessionUser && typeof sessionUser === 'object') {
      setUser(mapSessionUser(sessionUser as Record<string, unknown>));
    }
  }, []);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCS);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeChunk[]>(MOCK_KNOWLEDGE);

  const addDocument = (doc: Document) => setDocuments(prev => [doc, ...prev]);
  const updateDocument = (updatedDoc: Document) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };
  const deleteDocument = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));
  
  const addTemplate = (temp: Template) => setTemplates(prev => [temp, ...prev]);
  const updateTemplate = (updatedTemplate: Template) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };
  const addKnowledge = (chunk: KnowledgeChunk) => setKnowledgeBase(prev => [chunk, ...prev]);

  return (
    <StoreContext.Provider value={{
      user,
      organization,
      documents,
      templates,
      knowledgeBase,
      setUser,
      addDocument,
      updateDocument,
      addTemplate,
      updateTemplate,
      addKnowledge,
      deleteDocument
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
