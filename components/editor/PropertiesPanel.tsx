"use client";

import React from "react";
import { 
  X, 
  Settings2, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentSection, TemplateSection } from "@/types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SidebarTab } from "./Sidebar";

interface PropertiesPanelProps {
  section: TemplateSection | null;
  documentSection: DocumentSection | null;
  activeTab?: SidebarTab;
  onUpdate: (updates: Partial<TemplateSection>) => void;
  onUpdateDocumentSection: (updates: Partial<DocumentSection>) => void;
  onClose: () => void;
  onDelete: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  section,
  documentSection,
  activeTab,
  onUpdate,
  onUpdateDocumentSection,
  onClose,
  onDelete,
}) => {
  const hasContent = activeTab === "sections" ? !!documentSection : !!section;
  if (!hasContent) return null;

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(section?.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    onUpdate({ options: [...(section?.options || []), `Option ${(section?.options?.length || 0) + 1}`] });
  };

  const removeOption = (index: number) => {
    const newOptions = section?.options?.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="flex h-full w-80 flex-col border-l border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h3 className="flex items-center text-sm font-semibold text-slate-800">
          <Settings2 className="mr-2 h-4 w-4 text-blue-500" />
          {activeTab === "sections" ? "Section Properties" : "Field Options"}
        </h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Document Structure Section Properties */}
            {activeTab === "sections" && documentSection && (
              <>
                <Input
                  label="Section Name"
                  value={documentSection.title}
                  onChange={(e) => onUpdateDocumentSection({ title: e.target.value })}
                />
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-300"
                    rows={3}
                    placeholder="Briefly describe what this section covers..."
                    value={documentSection.description || ""}
                    onChange={(e) => onUpdateDocumentSection({ description: e.target.value })}
                  />
                </div>
                <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-50">
                  <h4 className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
                    <AlertCircle className="mr-2 h-3.5 w-3.5" />
                    AI Instruction
                  </h4>
                  <textarea
                    className="w-full rounded-lg border border-blue-100 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 font-mono"
                    rows={4}
                    placeholder="Tell the AI how to generate content for this section..."
                    value={documentSection.sectionPrompt || ""}
                    onChange={(e) => onUpdateDocumentSection({ sectionPrompt: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Form Field Settings */}
            {activeTab === "form" && section && (
              <>
                {section.type === "heading" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600">Heading Level</label>
                    <div className="flex space-x-1">
                      {['h1', 'h2', 'h3', 'h4', 'h5'].map((level) => (
                        <button
                          key={level}
                          onClick={() => onUpdate({ config: { ...section.config, level } })}
                          className={cn(
                            "flex-1 rounded-md border py-2 text-xs font-bold transition-all",
                            (section.config?.level || 'h2') === level
                              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                              : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                          )}
                        >
                          {level.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === "text" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600">Text Variant</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'body', label: 'Body' },
                        { id: 'caption', label: 'Caption' },
                        { id: 'small', label: 'Small' },
                        { id: 'mono', label: 'Monospace' }
                      ].map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => onUpdate({ config: { ...section.config, variant: variant.id } })}
                          className={cn(
                            "rounded-md border p-2 text-xs font-medium transition-all text-left",
                            (section.config?.variant || 'body') === variant.id
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {variant.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === "icon" && (
                  <div className="space-y-2">
                    <Input
                      label="Icon Name (Lucide)"
                      placeholder="e.g. Heart, Star, Smile..."
                      value={section.config?.iconName || ""}
                      onChange={(e) => onUpdate({ config: { ...section.config, iconName: e.target.value } })}
                    />
                    <p className="text-[10px] text-slate-400">Enter a Lucide icon name to change the icon.</p>
                  </div>
                )}

                <Input
                  label="Field Label"
                  value={section.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                />

                {section.type === "text" ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Content</label>
                    <textarea
                      className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      rows={4}
                      value={section.content || ""}
                      onChange={(e) => onUpdate({ content: e.target.value })}
                    />
                  </div>
                ) : section.type.startsWith("input_") && (
                  <div className="space-y-4">
                    <Input
                      label="Placeholder"
                      value={section.placeholder || ""}
                      onChange={(e) => onUpdate({ placeholder: e.target.value })}
                    />
                    
                    {section.type === "input_textarea" && (
                      <Input
                        label="Rows"
                        type="number"
                        value={section.config?.rows || 4}
                        onChange={(e) => onUpdate({ config: { ...section.config, rows: parseInt(e.target.value) } })}
                      />
                    )}

                    {section.type === "input_number" && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Min"
                          type="number"
                          value={section.config?.min || ""}
                          onChange={(e) => onUpdate({ config: { ...section.config, min: e.target.value } })}
                        />
                        <Input
                          label="Max"
                          type="number"
                          value={section.config?.max || ""}
                          onChange={(e) => onUpdate({ config: { ...section.config, max: e.target.value } })}
                        />
                      </div>
                    )}

                    {section.type === "input_file" && (
                      <div className="space-y-3">
                        <div>
                          <Input
                            label="Accepted File Types"
                            placeholder="e.g. .pdf,.docx,image/*"
                            value={section.config?.accept || ""}
                            onChange={(e) => onUpdate({ config: { ...section.config, accept: e.target.value } })}
                          />
                          <p className="mt-1 text-[11px] text-slate-400">Comma-separated MIME types or extensions</p>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600"
                            checked={section.config?.multiple ?? false}
                            onChange={(e) => onUpdate({ config: { ...section.config, multiple: e.target.checked } })}
                          />
                          <span className="text-sm text-slate-700">Allow multiple files</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Options for Selects */}
                {(section.type === "input_single_select" || section.type === "input_multi_select" || section.type === "input_dropdown") && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600">Options</label>
                    <div className="space-y-2">
                      {(section.options || []).map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/20"
                            value={opt}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                          />
                          <button 
                            onClick={() => removeOption(i)}
                            className="text-slate-300 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addOption}
                        className="text-[10px] font-bold uppercase tracking-wider text-blue-500 hover:text-blue-600"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onClose}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
