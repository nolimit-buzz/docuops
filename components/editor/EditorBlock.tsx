"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { 
  GripVertical, 
  Trash2, 
  Type, 
  FileText, 
  Image as ImageIcon, 
  Smile, 
  Layout, 
  Columns, 
  Minus, 
  Scissors,
  ALargeSmall,
  Quote,
  Hash,
  Mail,
  Phone,
  ListOrdered,
  CheckSquare,
  ChevronDown,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateSection, TemplateSectionType } from "@/types";

const TYPE_ICONS: Record<TemplateSectionType, any> = {
  heading: ALargeSmall,
  text: FileText,
  image: ImageIcon,
  icon: Smile,
  section: Layout,
  columns: Columns,
  separator: Minus,
  page_break: Scissors,
  input_text: Type,
  input_textarea: Quote,
  input_number: Hash,
  input_email: Mail,
  input_phone: Phone,
  input_dropdown: ListOrdered,
  input_single_select: CheckSquare,
  input_multi_select: ChevronDown,
  input_date_picker: Calendar,
  input_date_time: Clock,
};

interface EditorBlockProps {
  section: TemplateSection;
  isSelected: boolean;
  isStructureView?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate?: (updates: Partial<TemplateSection>) => void;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({ 
  section, 
  isSelected, 
  isStructureView,
  onSelect, 
  onDelete,
  onUpdate
}) => {
  const Icon = TYPE_ICONS[section.type] || Type;

  if (isStructureView) {
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={cn(
          "group relative flex flex-col rounded-2xl border bg-white p-6 transition-all cursor-pointer",
          isSelected 
            ? "border-blue-500 shadow-lg ring-1 ring-blue-500" 
            : "border-slate-100 hover:border-slate-300 hover:shadow-md"
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Name</label>
              <input
                type="text"
                className="w-full bg-transparent text-xl font-bold text-slate-800 outline-none focus:ring-0 placeholder:text-slate-200"
                value={section.title}
                onChange={(e) => onUpdate?.({ title: e.target.value })}
                placeholder="Section Title"
              />
            </div>
             <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-full p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-xl bg-slate-50/50 p-6 border border-slate-100 shadow-sm">
            <h4 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <LucideIcons.Settings2 className="mr-2 h-4 w-4 text-slate-400" />
              AI Behavior & Instructions
            </h4>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">System Prompt</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-slate-200 font-mono leading-relaxed transition-all focus:border-slate-300"
                rows={6}
                placeholder="Give the AI directions on how to generate the content for this section..."
                value={section.systemPrompt || ""}
                onChange={(e) => onUpdate?.({ systemPrompt: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 font-medium italic">This prompt guides how the AI will generate or process content for this field.</p>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute -left-0.5 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-blue-500" />
        )}
      </div>
    );
  }

  const renderPreview = () => {
    const config = section.config || {};

    switch (section.type) {
      case "heading": {
        const Level = (config.level || "h2") as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
        const fontClasses: Record<string, string> = {
          h1: "text-3xl font-extrabold tracking-tight",
          h2: "text-2xl font-bold",
          h3: "text-xl font-semibold",
          h4: "text-lg font-medium outline-none",
          h5: "text-base font-medium",
        };
        return <Level className={cn("text-slate-800", fontClasses[config.level as string] || fontClasses.h2)}>{section.title || "Heading Title"}</Level>;
      }
      case "text": {
        const variants: Record<string, string> = {
          body: "text-base text-slate-600",
          caption: "text-xs text-slate-400 font-medium tracking-wide",
          small: "text-sm text-slate-500",
          mono: "font-mono text-sm bg-slate-50 p-2 rounded border border-slate-100",
        };
        return <p className={cn(variants[config.variant as string] || variants.body)}>{section.content || "This is a text block. You can edit this content in the properties panel."}</p>;
      }
      case "icon": {
        const iconName = config.iconName || "Smile";
        const DynamicIcon = (LucideIcons as any)[iconName] || Smile;
        return (
          <div className="flex items-center space-x-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
              <DynamicIcon className="h-10 w-10 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-slate-500">{iconName}</span>
          </div>
        );
      }
      case "image":
      case "input_text":
      case "input_email":
      case "input_phone":
      case "input_number":
      case "input_date_picker":
      case "input_date_time":
      case "input_dropdown":
        return (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{section.title || "Field Label"}</label>
            <div className="flex items-center justify-between w-full rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-slate-400 text-sm italic">
              <span>{section.placeholder || "Enter value..."}</span>
              {section.type.includes("date") && <Calendar className="h-4 w-4 text-slate-300" />}
              {section.type === "input_dropdown" && <ChevronDown className="h-4 w-4 text-slate-300" />}
            </div>
          </div>
        );
      case "input_textarea":
        const rows = config.rows || 4;
        return (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{section.title || "Field Label"}</label>
            <div 
              className="w-full rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-slate-400 text-sm italic overflow-hidden"
              style={{ minHeight: `${rows * 24}px` }}
            >
              {section.placeholder || "Enter long text..."}
            </div>
          </div>
        );
      case "input_single_select":
      case "input_multi_select":
        return (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{section.title || "Select Option"}</label>
            <div className="space-y-2">
              {(section.options || ["Option 1", "Option 2"]).map((opt, i) => (
                <div key={i} className="flex items-center space-x-2 rounded-lg border border-slate-50 p-2 text-sm text-slate-600 bg-white/50">
                  <div className={cn("h-4 w-4 rounded-full border border-slate-300", section.type === "input_multi_select" && "rounded-sm")} />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "separator":
        return <hr className="my-4 border-slate-100" />;
      case "page_break":
        return (
          <div className="my-4 flex items-center justify-center border-t-2 border-dashed border-slate-200 py-2">
            <span className="bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Page Break</span>
          </div>
        );
      default:
        return <div className="text-sm text-slate-400 italic">Preview for {section.type} coming soon...</div>;
    }
  };

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white p-6 transition-all cursor-pointer",
        isSelected 
          ? "border-blue-500 shadow-lg ring-1 ring-blue-500" 
          : "border-slate-100 hover:border-slate-300 hover:shadow-md"
      )}
    >
      {/* Header Info */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="cursor-grab text-slate-300 hover:text-slate-400 active:cursor-grabbing">
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-slate-50 px-2 py-1 text-slate-500">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{section.type?.replace('_', ' ') || "element"}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-full p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Content Preview */}
      <div className="min-h-[40px]">
        {renderPreview()}
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -left-0.5 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-blue-500" />
      )}
    </div>
  );
};
