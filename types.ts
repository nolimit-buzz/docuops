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

export type TemplateSectionType = 
  | 'heading' 
  | 'text' 
  | 'image' 
  | 'icon'
  | 'section' 
  | 'columns' 
  | 'separator' 
  | 'page_break'
  | 'input_text' 
  | 'input_textarea' 
  | 'input_number' 
  | 'input_email' 
  | 'input_phone' 
  | 'input_dropdown' 
  | 'input_single_select' 
  | 'input_multi_select' 
  | 'input_date_picker' 
  | 'input_date_time';

export interface TemplateSection {
  id: string;
  type: TemplateSectionType;
  title: string;
  description?: string;
  content?: string; // For text/heading blocks
  placeholder?: string; // For input blocks
  systemPrompt: string; // The instruction to the AI
  userPromptPlaceholder?: string; // Hint for the user
  required: boolean;
  options?: string[]; // For select/dropdown blocks
  config?: Record<string, any>; // For extra settings like font, color, etc.
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  createdBy: string;
  updatedAt: string;
  isDraft?: boolean;
}

export interface DocumentTemplateField {
  label: string;
  type: TemplateSectionType;
  prompt: string | null;
  required: boolean;
  placeholder?: string | null;
  field_content?: string;
  heading_level?: string;
  options?: string[];
  rows?: number | null;
}

export interface DocumentTemplate {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  title: string;
  category: string;
  description: string;
  fields: DocumentTemplateField[];
}

export interface DocumentTemplatesResponse {
  docs: DocumentTemplate[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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
