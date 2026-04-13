"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Eye, Save, Send } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useStore } from "../hooks/useStore";
import { Template, TemplateSection, TemplateSectionType } from "../types";
import { SidebarTabs, SidebarPanel, SidebarTab, TabSummaryBar } from "../components/editor/Sidebar";
import { EditorBlock } from "../components/editor/EditorBlock";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { cn } from "@/lib/utils";

export const TemplateEditor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { templates, updateTemplate } = useStore();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("form");

  useEffect(() => {
    const found = templates.find((item) => item.id === id);
    if (found) {
      setTemplate(JSON.parse(JSON.stringify(found)) as Template);
    }
    setIsLoading(false);
  }, [id, templates]);

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

  const handleSave = () => {
    if (!template) return;
    updateTemplate({
      ...template,
      updatedAt: new Date().toISOString(),
    });
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
    
    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
    });
    setSelectedSectionId(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.filter((s) => s.id !== sectionId),
    });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    setTemplate({
      ...template,
      sections: template.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
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
          <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-50">
            <Eye className="mr-2 h-4 w-4" />
            Preview
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
          <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-200">
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
            onClose={() => setSelectedSectionId(null)}
            onDelete={() => removeSection(selectedSectionId!)}
          />
        </div>
      </div>
    </div>
  );
};
