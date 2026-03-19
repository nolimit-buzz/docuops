"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useStore } from "../hooks/useStore";
import { Template, TemplateSection } from "../types";

export const TemplateEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { templates, updateTemplate } = useStore();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = templates.find((item) => item.id === id);
    if (found) {
      setTemplate(JSON.parse(JSON.stringify(found)) as Template);
    }
    setIsLoading(false);
  }, [id, templates]);

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!template) {
    return <div className="p-10">Template not found.</div>;
  }

  const handleSave = () => {
    updateTemplate({
      ...template,
      updatedAt: new Date().toISOString(),
    });
    router.push("/templates");
  };

  const addSection = () => {
    const newSection: TemplateSection = {
      id: `s-${Date.now()}`,
      title: "New Section",
      systemPrompt: "",
      required: true,
    };
    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
    });
  };

  const removeSection = (sectionId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.filter((section) => section.id !== sectionId),
    });
  };

  const updateSection = (
    sectionId: string,
    field: keyof TemplateSection,
    value: string | boolean,
  ) => {
    setTemplate({
      ...template,
      sections: template.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section,
      ),
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-8 pb-20">
      <header className="sticky top-0 z-10 mb-8 flex items-center justify-between border-b border-slate-200 bg-slate-50 py-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/templates")}
            className="mr-4"
          >
            &lt;- Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Template</h1>
            <p className="text-slate-500">
              Configure the structure and AI prompts.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="sticky top-32 p-6">
            <h3 className="mb-4 font-bold text-slate-800">Template Settings</h3>
            <div className="space-y-4">
              <Input
                label="Template Name"
                value={template.name}
                onChange={(event) =>
                  setTemplate({ ...template, name: event.target.value })
                }
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={template.description}
                  onChange={(event) =>
                    setTemplate({ ...template, description: event.target.value })
                  }
                />
              </div>
              <Input
                label="Category"
                value={template.category}
                onChange={(event) =>
                  setTemplate({ ...template, category: event.target.value })
                }
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">
              Document Sections
            </h3>
            <Button size="sm" onClick={addSection}>
              + Add Section
            </Button>
          </div>

          {template.sections.map((section, index) => (
            <Card
              key={section.id}
              className="group relative border-l-4 border-l-blue-500 p-6"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-blue-500">
                Section {index + 1}
              </div>

              <div className="space-y-4">
                <Input
                  label="Section Title"
                  placeholder="e.g. Executive Summary"
                  value={section.title}
                  onChange={(event) =>
                    updateSection(section.id, "title", event.target.value)
                  }
                />

                <div>
                  <div className="mb-1 flex justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      System Prompt
                    </label>
                    <span className="text-xs text-slate-400">
                      What should the AI write?
                    </span>
                  </div>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Instruct the AI on tone, content, and format..."
                    value={section.systemPrompt}
                    onChange={(event) =>
                      updateSection(
                        section.id,
                        "systemPrompt",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id={`req-${section.id}`}
                    checked={section.required}
                    onChange={(event) =>
                      updateSection(section.id, "required", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`req-${section.id}`}
                    className="ml-2 block text-sm text-slate-900"
                  >
                    Required Section
                  </label>
                </div>
              </div>
            </Card>
          ))}

          {template.sections.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <p className="text-slate-500">No sections yet. Add one to start.</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={addSection}
          >
            + Add Another Section
          </Button>
        </div>
      </div>
    </div>
  );
};
