import { DocumentTemplate, DocumentTemplateField, Template, TemplateSection } from "@/types";

export const mapApiTemplateToLocal = (apiTemplate: DocumentTemplate): Template => {
  return {
    id: apiTemplate.id || "",
    name: apiTemplate.title || "Untitled",
    description: apiTemplate.description,
    category: apiTemplate.category,
    createdBy: apiTemplate.company, // Using company as creator for now
    updatedAt: apiTemplate.updatedAt,
    isDraft: false,
    sections: Array.isArray(apiTemplate.fields) 
      ? apiTemplate.fields.map((field, index) => mapApiFieldToSection(field, index))
      : [],
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
  return {
    title: t.name,
    category: t.category,
    description: t.description,
    status: "active",
    fields: t.sections.map((s) => {
      const isInput = s.type.startsWith("input_");
      const base: any = {
        label: s.title,
        type: s.type,
        prompt: s.systemPrompt || null,
        required: s.required,
      };
      
      if (!isInput) {
        base.field_content = s.content ?? null;
      } else {
        base.placeholder = s.placeholder ?? null;
      }

      if (s.type === "heading") {
        base.heading_level = s.config?.level ?? "h2";
      }
      
      if (s.type === "text") {
        base.variant = s.config?.variant ?? "body";
      }

      if (s.type === "input_textarea") {
        base.rows = s.config?.rows ?? null;
      }
      
      if (s.type === "input_number") {
        base.min = s.config?.min ?? null;
        base.max = s.config?.max ?? null;
      }
      
      if (["input_dropdown", "input_single_select", "input_multi_select"].includes(s.type)) {
        base.options = s.options ?? [];
      }

      return base;
    }),
  };
};
