"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Eye, Save, Send, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import toast from "react-hot-toast";
import { useStore } from "../hooks/useStore";
import { DocumentSection, Template, TemplateSection, TemplateSectionType } from "../types";
import { SidebarTabs, SidebarPanel, SidebarTab, TabSummaryBar } from "../components/editor/Sidebar";
import { EditorBlock } from "../components/editor/EditorBlock";
import { DocumentSectionCard } from "../components/editor/DocumentSectionCard";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { cn } from "@/lib/utils";
import { fetchDocumentTemplateById, updateDocumentTemplate, deleteDocumentTemplate, createDocumentTemplate, fetchDocumentTemplates } from "@/query/document-templates";
import { mapApiTemplateToLocal, mapLocalTemplateToApiPayload } from "@/lib/template-mapper";

export const TemplateEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { templates, documents, updateTemplate, addTemplate, deleteTemplate, setTemplates } = useStore();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("form");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedDocCount, setBlockedDocCount] = useState(0);

  useEffect(() => {
    const found = templates.find((item) => item.id === id);
    if (found) {
      setTemplate(JSON.parse(JSON.stringify(found)) as Template);
      setIsLoading(false);
    } else if (id) {
      // Try fetching from API
      setIsLoading(true);
      fetchDocumentTemplateById(id)
        .then((apiTemp) => {
          const mapped = mapApiTemplateToLocal(apiTemp);
          setTemplate(mapped);
          addTemplate(mapped); // Save to store as requested
        })
        .catch((err) => {
          console.error("Failed to fetch template:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id, templates, addTemplate]);

  useEffect(() => {
    if (activeTab === "sections" && (template?.documentStructure ?? []).length && !selectedSectionId) {
      setSelectedSectionId(template!.documentStructure[0].id);
    }
  }, [activeTab, template?.documentStructure, selectedSectionId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!template) {
    return <div className="p-10 text-center">Template not found.</div>;
  }

  const handleSave = async () => {
    const updatedTemplate: Template = {
      ...template,
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };

    const payload = mapLocalTemplateToApiPayload(updatedTemplate, "draft");

    console.log("\n" + "=".repeat(50));
    console.log("[DocuOps] TEMPLATE SAVE PAYLOAD (BROWSER)");
    console.log("=".repeat(50));
    console.log(JSON.stringify(payload, null, 2));
    console.log("=".repeat(50) + "\n");

    setIsLoading(true);
    try {
      const isNew = updatedTemplate.id.startsWith("t-");
      let saved: Template;

      if (isNew) {
        const result = await createDocumentTemplate(payload);
        saved = mapApiTemplateToLocal(result);
        deleteTemplate(updatedTemplate.id);
        addTemplate(saved);
        setTemplate(saved);
        router.replace(`/templates/${saved.id}`);
      } else {
        const result = await updateDocumentTemplate(updatedTemplate.id, payload);
        saved = mapApiTemplateToLocal(result);
        updateTemplate(saved);
        setTemplate(saved);
      }

      await fetch("/api/log-payload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Draft saved successfully");
    } catch (err) {
      console.error("Failed to save template:", err);
      toast.error("Failed to save template");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!template || !id || id === "undefined" || template.id === "undefined") {
      toast.error("Invalid template ID. Cannot publish.");
      return;
    }

    const payload = mapLocalTemplateToApiPayload(template, "published");

    console.log("\n" + "=".repeat(50));
    console.log("[DocuOps] TEMPLATE PUBLISH PAYLOAD (BROWSER)");
    console.log("=".repeat(50));
    console.log(JSON.stringify(payload, null, 2));
    console.log("=".repeat(50) + "\n");

    setIsLoading(true);
    try {
      const isNew = template.id.startsWith("t-");
      let saved: Template;

      if (isNew) {
        const result = await createDocumentTemplate(payload);
        saved = mapApiTemplateToLocal(result);
        deleteTemplate(template.id);
        addTemplate(saved);
        setTemplate(saved);
        router.replace(`/templates/${saved.id}`);
      } else {
        const result = await updateDocumentTemplate(template.id, payload);
        saved = mapApiTemplateToLocal(result);
        updateTemplate(saved);
        setTemplate(saved);
      }

      await fetch("/api/log-payload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Template published successfully");
    } catch (err) {
      console.error("Failed to publish template:", err);
      toast.error("Failed to publish template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!template || !id || id === "undefined" || template.id === "undefined") {
      toast.error("Invalid template ID. Cannot delete.");
      return;
    }

    const linkedDocs = documents.filter((d) => d.templateId === template.id);
    if (linkedDocs.length > 0) {
      setBlockedDocCount(linkedDocs.length);
      setShowBlockedModal(true);
      setShowDeleteModal(false);
      return;
    }

    setIsLoading(true);
    try {
      const isApiTemplate = template.id && !template.id.startsWith("t-");
      
      if (isApiTemplate) {
        await deleteDocumentTemplate(template.id);
      }
      
      deleteTemplate(template.id);
      toast.success("Template deleted");
      router.push("/templates");
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.toLowerCase().includes("not found")) {
        deleteTemplate(template.id);
        toast.success("Template deleted");
        router.push("/templates");
      } else if (msg.toLowerCase().includes("templateid") || msg.toLowerCase().includes("not-null")) {
        setShowBlockedModal(true);
      } else {
        toast.error("Failed to delete template");
      }
      console.error("Failed to delete template:", err);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const addFormField = (type: TemplateSectionType) => {
    const newField: TemplateSection = {
      id: `s-${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')}`,
      systemPrompt: "",
      required: true,
      options: type.includes('select') || type === 'input_dropdown' ? ["Option 1", "Option 2"] : undefined,
    };
    const updated = {
      ...template,
      formFields: [...(template.formFields ?? []), newField],
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    updateTemplate(updated);
    setSelectedSectionId(newField.id);
  };

  const removeFormField = (fieldId: string) => {
    const updated = {
      ...template,
      formFields: (template.formFields ?? []).filter((s) => s.id !== fieldId),
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    updateTemplate(updated);
    if (selectedSectionId === fieldId) setSelectedSectionId(null);
  };

  const updateFormField = (fieldId: string, updates: Partial<TemplateSection>, syncToStore = false) => {
    const updated = {
      ...template,
      formFields: (template.formFields ?? []).map((s) => s.id === fieldId ? { ...s, ...updates } : s),
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    if (syncToStore) updateTemplate(updated);
  };

  const addDocumentSection = () => {
    const newSection: DocumentSection = {
      id: `ds-${Date.now()}`,
      title: "New Section",
    };
    const updated = {
      ...template,
      documentStructure: [...(template.documentStructure ?? []), newSection],
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    updateTemplate(updated);
    setSelectedSectionId(newSection.id);
  };

  const removeDocumentSection = (sectionId: string) => {
    const updated = {
      ...template,
      documentStructure: (template.documentStructure ?? []).filter((s) => s.id !== sectionId),
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    updateTemplate(updated);
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  };

  const updateDocumentSection = (sectionId: string, updates: Partial<DocumentSection>, syncToStore = false) => {
    const updated = {
      ...template,
      documentStructure: (template.documentStructure ?? []).map((s) => s.id === sectionId ? { ...s, ...updates } : s),
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    if (syncToStore) updateTemplate(updated);
  };

  const updateTemplatePrompt = (value: string) => {
    const updated = { ...template, prompt: value };
    setTemplate(updated);
    updateTemplate(updated);
  };

  const selectedFormField = (template.formFields ?? []).find(s => s.id === selectedSectionId) || null;
  const selectedDocSection = (template.documentStructure ?? []).find(s => s.id === selectedSectionId) || null;

  return (
    <div className="flex h-screen flex-col bg-slate-50/50">
      {/* Top Bar (Primary Header) */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push("/templates")}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{template.name || "Untitled Template"}</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{template.category || "General"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            size="sm" 
            onClick={handlePublish}
            className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-200"
          >
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </header>

      {/* Tab Summary Bar */}
      <TabSummaryBar
        name={template.name}
        description={template.description}
        category={template.category}
        sectionCount={(template.documentStructure ?? []).length}
      />

      {/* Secondary Bar (Tabs - Full Width) */}
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Panel (Toolbox) */}
        {activeTab !== "prompt" && (
          <SidebarPanel
            activeTab={activeTab}
            template={template}
            selectedSectionId={selectedSectionId}
            onUpdateTemplate={(updates) => setTemplate({ ...template, ...updates })}
            onAddElement={addFormField}
            onSelectSection={setSelectedSectionId}
            onAddSection={addDocumentSection}
          />
        )}

        {/* Canvas (Center) */}
        <main 
          className="flex-1 overflow-y-auto p-12 bg-slate-50/20"
          onClick={() => setSelectedSectionId(null)}
        >
          <div className="mx-auto max-w-2xl space-y-6">
            {activeTab === "prompt" ? (
              <div className="flex flex-col" style={{ minHeight: "60vh" }}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Template Prompt</h2>
                  <p className="text-sm text-slate-500">
                    Write instructions for the AI to follow when generating document sections
                    from this template's form fields and document structure.
                  </p>
                </div>
                <textarea
                  className="flex-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  rows={16}
                  placeholder="e.g. Generate a professional NDA agreement using the company names, effective date, and confidentiality terms provided in the form fields. Structure the document using the sections defined in the document structure..."
                  value={template.prompt ?? ""}
                  onChange={(e) => updateTemplatePrompt(e.target.value)}
                />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {(template.prompt ?? "").length} characters
                  </p>
                  <Button size="sm" onClick={handleSave}>Save Prompt</Button>
                </div>
              </div>
            ) : activeTab === "sections" ? (
              <>
                {(template.documentStructure ?? []).length > 0 ? (
                  (template.documentStructure ?? []).map((section, index) => (
                    <DocumentSectionCard
                      key={section.id}
                      section={section}
                      index={index}
                      isSelected={selectedSectionId === section.id}
                      onSelect={() => setSelectedSectionId(section.id)}
                      onDelete={() => removeDocumentSection(section.id)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-20 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4">
                      <Send className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">No sections yet</h3>
                    <p className="max-w-[240px] text-sm text-slate-400">
                      Click "Add Section" in the outline panel to define your document structure.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {(template.formFields ?? []).map((field) => (
                  <EditorBlock
                    key={field.id}
                    section={field}
                    isSelected={selectedSectionId === field.id}
                    onSelect={() => setSelectedSectionId(field.id)}
                    onDelete={() => removeFormField(field.id)}
                    onUpdate={(updates) => updateFormField(field.id, updates)}
                  />
                ))}
                {(template.formFields ?? []).length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-20 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4">
                      <Send className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Your canvas is empty</h3>
                    <p className="max-w-[240px] text-sm text-slate-400">
                      Select an element from the Form Fields panel to start building your template.
                    </p>
                  </div>
                )}
              </>
            )}
            <div className="h-32" />
          </div>
        </main>

        {/* Right Side Panel (Properties) */}
        <div className={cn(
          "transition-all duration-300 ease-in-out shrink-0 overflow-hidden border-l border-slate-200 bg-white",
          selectedSectionId && activeTab !== "prompt" ? "w-80" : "w-0"
        )}>
          <PropertiesPanel
            section={selectedFormField}
            documentSection={selectedDocSection}
            activeTab={activeTab}
            onUpdate={(updates) => updateFormField(selectedSectionId!, updates)}
            onUpdateDocumentSection={(updates) => updateDocumentSection(selectedSectionId!, updates)}
            onClose={() => {
              if (activeTab === "sections") {
                updateDocumentSection(selectedSectionId!, {}, true);
              } else {
                updateFormField(selectedSectionId!, {}, true);
              }
              setSelectedSectionId(null);
              toast.success("Updated", { icon: "⚙️", duration: 2000 });
            }}
            onDelete={() => {
              if (activeTab === "sections") {
                removeDocumentSection(selectedSectionId!);
              } else {
                removeFormField(selectedSectionId!);
              }
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTemplate}
        isLoading={isLoading}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action will permanently remove it from your workspace and cannot be undone."
        confirmText="Permanently Delete"
        variant="danger"
      />

      <ConfirmModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        onConfirm={() => router.push("/documents")}
        variant="warning"
        title="This Template Is Still In Use"
        message={`${blockedDocCount} document${blockedDocCount !== 1 ? "s are" : " is"} still using this template. You'll need to delete ${blockedDocCount !== 1 ? "them" : "it"} before you can remove the template.`}
        confirmText="View Documents"
        cancelText="Got it"
      />
    </div>
  );
};
