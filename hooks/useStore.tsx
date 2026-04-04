"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Organization, Document, Template, KnowledgeChunk } from '../types';
import { MOCK_USER, MOCK_ORG, MOCK_DOCS, MOCK_TEMPLATES, MOCK_KNOWLEDGE } from '../store/mockData';
import { getSessionUser, getSessionOrganization } from '../store/sessionUtils';
import type { PaperType } from '../query/paperTypes';

interface AppStore {
  user: User;
  organization: Organization;
  documents: Document[];
  templates: Template[];
  knowledgeBase: KnowledgeChunk[];
  paperTypes: PaperType[];

  setUser: (u: User) => void;
  initFromSession: () => void;

  setDocuments: (docs: Document[]) => void;
  loadDocuments: () => Promise<void>;
  addDocument: (doc: Document) => void;
  updateDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;

  addTemplate: (temp: Template) => void;
  updateTemplate: (temp: Template) => void;

  addKnowledge: (chunk: KnowledgeChunk) => void;

  loadPaperTypes: () => Promise<void>;
}

export const useStore = create<AppStore>()(persist((set, get) => ({
  user: MOCK_USER,
  organization: MOCK_ORG,
  documents: MOCK_DOCS,
  templates: MOCK_TEMPLATES,
  knowledgeBase: MOCK_KNOWLEDGE,
  paperTypes: [],

  setUser: (u) => set({ user: u }),

  initFromSession: () => {
    const user = getSessionUser();
    const org = getSessionOrganization();
    if (user) set({ user });
    if (org) set({ organization: org });
  },

  setDocuments: (docs) => set({ documents: docs }),

  loadDocuments: async () => {
    const userId = get().user.id;
    if (!userId || userId === 'u-1') return;
    const { fetchUserDocuments } = await import('../query/documents');
    try {
      const docs = await fetchUserDocuments();
      set({ documents: docs });
    } catch (e) {
      console.error('Failed to load documents:', e);
    }
  },

  addDocument: (doc) => set((s) => ({ documents: [doc, ...s.documents] })),
  updateDocument: (doc) => set((s) => ({ documents: s.documents.map((d) => (d.id === doc.id ? doc : d)) })),
  deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

  addTemplate: (temp) => set((s) => ({ templates: [temp, ...s.templates] })),
  updateTemplate: (temp) => set((s) => ({ templates: s.templates.map((t) => (t.id === temp.id ? temp : t)) })),

  addKnowledge: (chunk) => set((s) => ({ knowledgeBase: [chunk, ...s.knowledgeBase] })),

  loadPaperTypes: async () => {
    const { getPaperTypes } = await import('../query/paperTypes');
    try {
      const types = await getPaperTypes();
      if (types.length > 0) set({ paperTypes: types });
    } catch (e) {
      console.error('Failed to load paper types:', e);
    }
  },
}), {
  name: 'digicred-auth',
  partialize: (s) => ({ user: s.user }),
}));
