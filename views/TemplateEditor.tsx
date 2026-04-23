"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Eye, Save, Send, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import toast from "react-hot-toast";
import { useStore } from "../hooks/useStore";
import { Template, TemplateSection, TemplateSectionType } from "../types";
import { SidebarTabs, SidebarPanel, SidebarTab, TabSummaryBar } from "../components/editor/Sidebar";
import { EditorBlock } from "../components/editor/EditorBlock";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { cn } from "@/lib/utils";
import { fetchDocumentTemplateById, updateDocumentTemplate, deleteDocumentTemplate, createDocumentTemplate, fetchDocumentTemplates } from "@/query/document-templates";
import { mapApiTemplateToLocal, mapLocalTemplateToApiPayload } from "@/lib/template-mapper";

export const TemplateEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { templates, updateTemplate, addTemplate, deleteTemplate, setTemplates, organization } = useStore();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("form");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    if (activeTab === "sections" && template?.sections.length && !selectedSectionId) {
      setSelectedSectionId(template.sections[0].id);
    }
  }, [activeTab, template?.sections, selectedSectionId]);

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
    
    updateTemplate(updatedTemplate);
    setTemplate(updatedTemplate);
    toast.success("Draft saved successfully");
  };

  const handlePublish = async () => {
    if (!template || !id || id === "undefined" || template.id === "undefined") {
      toast.error("Invalid template ID. Cannot publish.");
      return;
    }
    
    setIsLoading(true);
    try {
      const isApiTemplate = template.id && !template.id.startsWith("t-");
      const payload = mapLocalTemplateToApiPayload(template);
      
      const companyId = organization.id?.length > 10 
        ? organization.id 
        : "00000000-0000-0000-0000-000000000001"; // Fallback to provided valid UUID
      
      let publishedTemplate: Template;
      let finalId = template.id;
      
      // Determine if we should PATCH or POST
      let shouldCreate = !isApiTemplate;
      
      if (shouldCreate) {
        // Double check if a template with the same title already exists as an API template
        const existingApiTemplate = templates.find(t => 
          t.id && !t.id.startsWith("t-") && 
          t.name?.toLowerCase() === template.name?.toLowerCase()
        );
        
        if (existingApiTemplate) {
          console.log("Found existing API template with same title. Switching to update mode.", existingApiTemplate.id);
          finalId = existingApiTemplate.id;
          shouldCreate = false;
        }
      }

      if (!shouldCreate) {
        // Update existing (PATCH)
        await updateDocumentTemplate(finalId, payload);
        publishedTemplate = {
          ...template,
          id: finalId, // Ensure we use the correct ID if we matched by name
          isDraft: false,
          updatedAt: new Date().toISOString(),
        };
        
        // If the ID was local, we need to replace it in the store
        if (template.id && template.id.startsWith("t-")) {
          deleteTemplate(template.id);
          addTemplate(publishedTemplate);
        } else {
          updateTemplate(publishedTemplate);
        }
        
        setTemplate(publishedTemplate);
        
        // If we switched IDs, redirect to the new correct URL
        if (template.id !== finalId) {
          router.replace(`/templates/${finalId}`);
        }
      } else {
        // Create new template (POST)
        // We ensure company is strictly from organization.id
        const apiResponse = await createDocumentTemplate({
          title: template.name,
          category: template.category,
          description: template.description || "",
          fields: payload.fields,
          status: "active",
          company: organization.id, 
        });
        
        publishedTemplate = mapApiTemplateToLocal(apiResponse);
        
        // Replace the local template with the API one
        deleteTemplate(template.id);
        addTemplate(publishedTemplate);
        setTemplate(publishedTemplate);
        
        // Redirect to the new API-backed URL
        // router.replace(`/templates/${publishedTemplate.id}`);
      }

      // 1. Refetch the entire list from backend
      const { docs } = await fetchDocumentTemplates();
      const apiMapped = docs.map(mapApiTemplateToLocal);
      
      // 2. Remove the CURRENT local template from state (it's now in the API list)
      // and keep other local drafts (starting with t- but NOT the current one)
      setTemplates((prev) => {
        const validPrev = Array.isArray(prev) ? prev.filter(t => t && t.id) : [];
        const others = validPrev.filter(t => t.id !== template.id);
        const localDrafts = others.filter(t => t.id && t.id.startsWith("t-"));
        return [...localDrafts, ...apiMapped.filter(t => t && t.id)];
      });

      toast.success("Template published correctly!");
      
      // 3. Redirect back to templates list as requested
      router.push("/templates");
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
    
    setIsLoading(true);
    try {
      const isApiTemplate = template.id && !template.id.startsWith("t-");
      
      if (isApiTemplate) {
        await deleteDocumentTemplate(template.id);
      }
      
      deleteTemplate(template.id);
      toast.success("Template deleted");
      router.push("/templates");
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error("Failed to delete template");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const addElement = (type: TemplateSectionType) => {
    const newSection: TemplateSection = {
      id: `s-${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')}`,
      systemPrompt: "",
      required: true,
      options: type.includes('select') || type === 'input_dropdown' ? ["Option 1", "Option 2"] : undefined,
    };
    
    const newTemplate = {
      ...template,
      sections: [...template.sections, newSection],
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    
    setTemplate(newTemplate);
    updateTemplate(newTemplate);
    setSelectedSectionId(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    const newTemplate = {
      ...template,
      sections: template.sections.filter((s) => s.id !== sectionId),
      isDraft: true, // Mark as draft on change
      updatedAt: new Date().toISOString(),
    };
    setTemplate(newTemplate);
    updateTemplate(newTemplate); // Sync to store
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>, syncToStore = false) => {
    if (!template) return;
    const newTemplate = {
      ...template,
      sections: template.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
      isDraft: true,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(newTemplate);
    if (syncToStore) {
      updateTemplate(newTemplate);
    }
  };

  const selectedSection = template.sections.find(s => s.id === selectedSectionId) || null;

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
        sectionCount={template.sections.length}
      />

      {/* Secondary Bar (Tabs - Full Width) */}
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Panel (Toolbox) */}
        <SidebarPanel 
          activeTab={activeTab}
          template={template}
          selectedSectionId={selectedSectionId}
          onUpdateTemplate={(updates) => setTemplate({ ...template, ...updates })}
          onAddElement={addElement}
          onSelectSection={setSelectedSectionId}
        />

        {/* Canvas (Center) */}
        <main 
          className="flex-1 overflow-y-auto p-12 bg-slate-50/20"
          onClick={() => setSelectedSectionId(null)}
        >
          <div className="mx-auto max-w-2xl space-y-6">
            {activeTab === "sections" ? (
              selectedSectionId ? (
                <EditorBlock
                  key={selectedSectionId}
                  section={template.sections.find(s => s.id === selectedSectionId)!}
                  isSelected={true}
                  isStructureView={true}
                  onSelect={() => setSelectedSectionId(selectedSectionId)}
                  onDelete={() => removeSection(selectedSectionId)}
                  onUpdate={(updates) => updateSection(selectedSectionId, updates)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm text-slate-400">Select a section from the outline to view it.</p>
                </div>
              )
            ) : (
              template.sections.map((section) => (
                <EditorBlock
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => setSelectedSectionId(section.id)}
                  onDelete={() => removeSection(section.id)}
                  onUpdate={(updates) => updateSection(section.id, updates)}
                />
              ))
            )}

            {template.sections.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-20 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4">
                  <Send className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Your canvas is empty</h3>
                <p className="max-w-[240px] text-sm text-slate-400">
                  Select an element from the "Form" tab to start building your template.
                </p>
              </div>
            )}
            <div className="h-32" />
          </div>
        </main>

        {/* Right Side Panel (Properties) */}
        <div className={cn(
          "transition-all duration-300 ease-in-out shrink-0 overflow-hidden border-l border-slate-200 bg-white",
          selectedSectionId && activeTab !== "sections" ? "w-80" : "w-0"
        )}>
          <PropertiesPanel
            section={selectedSection}
            activeTab={activeTab}
            onUpdate={(updates) => updateSection(selectedSectionId!, updates)}
            onClose={() => {
              updateSection(selectedSectionId!, {}, true); // Sync to store when closing/updating
              setSelectedSectionId(null);
              toast.success("Field configuration updated", {
                icon: "⚙️",
                duration: 2000,
              });
            }}
            onDelete={() => removeSection(selectedSectionId!)}
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
    </div>
  );
};
