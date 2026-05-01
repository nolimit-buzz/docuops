import { DocumentSection, DocumentTemplate, DocumentTemplateField, Template, TemplateSection } from "@/types";

export const mapApiTemplateToLocal = (apiTemplate: DocumentTemplate): Template => {
  const allFields = Array.isArray(apiTemplate.fields) ? apiTemplate.fields : [];
  const formFields = allFields
    .filter((f) => f.type.startsWith("input_"))
    .map((field, index) => mapApiFieldToSection(field, index));
  const documentStructure: DocumentSection[] = allFields
    .filter((f) => !f.type.startsWith("input_"))
    .map((field, index) => ({
      id: `s-api-struct-${index}-${Date.now()}`,
      title: field.label,
      systemPrompt: field.prompt || undefined,
    }));

  return {
    id: apiTemplate.id || "",
    name: apiTemplate.title || "Untitled",
    description: apiTemplate.description,
    category: apiTemplate.category,
    createdBy: apiTemplate.company,
    updatedAt: apiTemplate.updatedAt,
    isDraft: false,
    documentStructure,
    formFields,
  };
};

export const mapApiFieldToSection = (field: DocumentTemplateField, index: number): TemplateSection => {
  const isInput = field.type.startsWith("input_");
  
  const section: TemplateSection = {
    id: `s-api-${index}-${Date.now()}`,
    type: field.type,
    title: field.label,
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

  return section;
};

export const mapLocalTemplateToApiPayload = (t: Template) => {
  const formFieldPayload = (t.formFields ?? []).map((s) => {
    const base: any = {
      label: s.title,
      type: s.type,
      prompt: s.systemPrompt || null,
      required: s.required,
      placeholder: s.placeholder ?? null,
    };
    if (s.type === "input_textarea") base.rows = s.config?.rows ?? null;
    if (s.type === "input_number") {
      base.min = s.config?.min ?? null;
      base.max = s.config?.max ?? null;
    }
    if (["input_dropdown", "input_single_select", "input_multi_select"].includes(s.type)) {
      base.options = s.options ?? [];
    }
    return base;
  });

  return {
    title: t.name,
    category: t.category,
    description: t.description,
    status: "active",
    documentStructure: t.documentStructure ?? [],
    formFields: t.formFields ?? [],
    // combined fields array kept for future API integration
    fields: formFieldPayload,
  };
};
