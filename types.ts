export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  REVIEWER = 'Reviewer',
  GUEST = 'Guest'
}

export enum DocStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  APPROVED = 'Approved',
  ARCHIVED = 'Archived'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  systemPrompt: string; // The instruction to the AI
  userPromptPlaceholder?: string; // Hint for the user
  required: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  createdBy: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface DocumentSectionFeedback {
  rating: 'positive' | 'negative';
  comment?: string;
}

export interface DocumentSectionContent {
  sectionId: string;
  content: string;
  isAiGenerated: boolean;
  ragSourcesUsed: string[]; // IDs of KnowledgeChunks
  comments: Comment[];
  feedback?: DocumentSectionFeedback;
}

export interface ProjectContext {
  clientName: string;
  category: string;
  budget: string;
  timeline: string;
  processSummary: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
}

export interface DocumentCollaborator {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Document {
  id: string;
  title: string;
  templateId: string;
  status: DocStatus;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sections: DocumentSectionContent[];
  projectContext?: ProjectContext;
  versions?: DocumentVersion[];
  globalComments?: Comment[];
  collaborators?: DocumentCollaborator[];
}
