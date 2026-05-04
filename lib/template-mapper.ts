import { DocumentSection, DocumentTemplate, DocumentTemplateField, Template, TemplateSection } from "@/types";

export const mapApiTemplateToLocal = (apiTemplate: DocumentTemplate): Template => {
  const allFields = Array.isArray(apiTemplate.fields) ? apiTemplate.fields : [];
  const formFields = allFields.map((field, index) => mapApiFieldToSection(field, index));

  let documentStructure: DocumentSection[] = [];
  if (apiTemplate.structure) {
    documentStructure = apiTemplate.structure.map((s, index) => ({
      id: s.id || `s-api-struct-${index}-${Date.now()}`,
      title: s.title || "",
      sectionPrompt: s.sectionPrompt || undefined,
    }));
  } else {
    // Legacy fallback for old templates that might have mixed structure inside fields
    documentStructure = allFields
      .filter((f) => f.type && !f.type.startsWith("input_"))
      .map((field, index) => ({
        id: field.id || `s-api-struct-legacy-${index}-${Date.now()}`,
        title: field.title || field.label || "",
        sectionPrompt: field.prompt || undefined,
      }));
  }

  return {
    id: apiTemplate.id || "",
    name: apiTemplate.name || apiTemplate.title || "Untitled",
    description: apiTemplate.description,
    category: apiTemplate.category,
    prompt: apiTemplate.prompt,
    createdBy: apiTemplate.company,
    updatedAt: apiTemplate.updatedAt,
    isDraft: apiTemplate.status === "draft",
    documentStructure,
    formFields,
  };
};

export const mapApiFieldToSection = (field: DocumentTemplateField, index: number): TemplateSection => {
  const section: TemplateSection = {
    id: field.id || `s-api-${index}-${Date.now()}`,
    type: field.type,
    title: field.title || field.label || "",
    systemPrompt: field.prompt || "",
    required: field.required,
    placeholder: field.placeholder || undefined,
    content: field.field_content || undefined,
    options: field.options || undefined,
    config: {},
  };

  if (field.heading_level) {
    section.config = { ...section.config, level: field.heading_level };
  }
  
  if (field.rows) {
    section.config = { ...section.config, rows: field.rows };
  }

  if (field.accept) {
    section.config = { ...section.config, accept: field.accept };
  }

  if (field.multiple != null) {
    section.config = { ...section.config, multiple: field.multiple };
  }

  return section;
};

export const mapLocalTemplateToApiPayload = (
  t: Template,
  status: "published" | "draft" = "published"
) => {
  const documentStructurePayload = (t.documentStructure ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    sectionPrompt: s.sectionPrompt ?? "",
  }));

  return {
    status,
    name: t.name,
    category: t.category ?? "",
    description: t.description ?? "",
    prompt: t.prompt ?? "",
    structure: documentStructurePayload,
    fields: (t.formFields ?? []).map(({ systemPrompt, config, ...rest }) => ({
      ...rest,
      title: rest.title || "Untitled Field",
      prompt: systemPrompt ?? "",
      heading_level: config?.level,
      rows: config?.rows,
      accept: config?.accept,
      multiple: config?.multiple,
    })),
  };
};
