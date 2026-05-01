import { Document, Template, GeneratorPayload, GeneratorSection, ProjectContext } from '../types';

/**
 * Assembles a comprehensive payload for the backend generator engine.
 * Maps current document state and template definitions into a single structure for CJ's endpoint.
 */
export function createGeneratorPayload(doc: Document, template: Template): GeneratorPayload {
  const sections: GeneratorSection[] = (template.formFields ?? template.sections ?? []).map((ts) => {
    const docSection = doc.sections.find((s) => s.sectionId === ts.id);
    
    return {
      sectionId: ts.id, // Using template section ID as the primary ID for the generation context
      templateSectionId: ts.id,
      title: ts.title,
      type: ts.type,
      content: docSection?.content || '',
      isAiGenerated: docSection?.isAiGenerated || false,
      systemPrompt: ts.systemPrompt,
      required: ts.required,
      config: ts.config,
      ragSourcesUsed: docSection?.ragSourcesUsed || [],
    };
  });

  const defaultContext: ProjectContext = {
    clientName: 'N/A',
    category: 'General',
    budget: 'N/A',
    timeline: 'N/A',
    processSummary: '',
  };

  return {
    documentId: doc.id,
    title: doc.title,
    templateId: template.id,
    templateName: template.name,
    organizationId: doc.organizationId,
    createdBy: doc.createdBy,
    projectContext: doc.projectContext || defaultContext,
    sections,
    collaborators: doc.collaborators || [],
    comments: doc.globalComments || [],
    timestamp: new Date().toISOString(),
  };
}
