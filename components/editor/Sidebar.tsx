"use client";

import React from "react";
import {
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
  Clock,
  Search,
  Settings,
  Library,
  Layers,
  Tag,
  LayoutList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import { DocumentSection, Template } from "@/types";

export type SidebarTab = "form" | "sections" | "settings";

interface TabBarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const TAB_META = [
    {
    id: "form" as SidebarTab,
    label: "Form Fields",
    description: "Adding custom input fields",
    icon: Library,
  },
  {
    id: "sections" as SidebarTab,
    label: "Document Structure",
    description: "Setting up template document structure",
    icon: Layers,
  },

  // {
  //   id: "settings" as SidebarTab,
  //   label: "Form Settings",
  //   description: "Configure form settings",
  //   icon: Settings,
  // },
];


interface TabSummaryBarProps {
  name: string;
  description?: string;
  category?: string;
  sectionCount?: number;
}

export const TabSummaryBar: React.FC<TabSummaryBarProps> = ({
  name,
  description,
  category,
  sectionCount,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white px-8 py-5 shrink-0">
      <div className="flex items-start space-x-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {name || "Untitled Template"}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 leading-snug">{description}</p>
          )}
          <div className="mt-2 flex items-center space-x-4">
            {category && (
              <span className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Tag className="h-3.5 w-3.5" />
                <span>{category}</span>
              </span>
            )}
            <span className="flex items-center space-x-1.5 text-xs text-slate-500">
              <LayoutList className="h-3.5 w-3.5" />
              <span>{sectionCount ?? 0} {sectionCount === 1 ? "section" : "sections"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex h-14 w-full border-b border-slate-200 bg-slate-50/50 px-6 overflow-x-auto no-scrollbar">
      {TAB_META.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as SidebarTab)}
          className={cn(
            "flex items-center space-x-2 px-6 h-full text-xs font-semibold whitespace-nowrap transition-all border-b-2",
            activeTab === tab.id 
              ? "border-slate-900 text-slate-900" 
              : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
          )}
        >
          <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-slate-900" : "text-slate-400")} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

interface SidebarPanelProps {
  activeTab: SidebarTab;
  template: Template;
  selectedSectionId: string | null;
  onUpdateTemplate: (updates: Partial<Template>) => void;
  onAddElement: (type: any) => void;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
}

const ELEMENT_CATEGORIES = [
  {
    title: "Form Elements",
    items: [
      { type: "input_text", label: "Input Text", icon: Type },
      { type: "input_textarea", label: "Input Textarea", icon: Quote },
      { type: "input_number", label: "Input Number", icon: Hash },
      { type: "input_email", label: "Input Email", icon: Mail },
      { type: "input_phone", label: "Input Phone", icon: Phone },
      { type: "input_dropdown", label: "Input Dropdown", icon: ListOrdered },
      { type: "input_single_select", label: "Input Single-Select", icon: CheckSquare },
      { type: "input_multi_select", label: "Input Multi-Select", icon: ChevronDown },
      { type: "input_date_picker", label: "Input Date Picker", icon: Calendar },
      { type: "input_date_time", label: "Input Date & Time", icon: Clock },
    ],
  },
];

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  activeTab,
  template,
  selectedSectionId,
  onUpdateTemplate,
  onAddElement,
  onSelectSection,
  onAddSection,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCategories = ELEMENT_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex h-full w-80 flex-col border-r border-slate-200 bg-white overflow-y-auto p-4 shrink-0">
      {activeTab === "form" && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Form Fields"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredCategories.map((cat) => (
            <div key={cat.title}>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {cat.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onAddElement(item.type)}
                    className="group flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm"
                  >
                    <item.icon className="mb-2 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                    <span className="text-center text-[10px] font-medium text-slate-600">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "sections" && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Document Outline
          </h3>
          {(template.documentStructure ?? []).length > 0 ? (
            <div className="space-y-1">
              {(template.documentStructure ?? []).map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => onSelectSection(section.id)}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg border p-3 text-left transition-all group",
                    selectedSectionId === section.id
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-transparent hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-all",
                    selectedSectionId === section.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={cn(
                      "truncate text-xs font-semibold transition-colors",
                      selectedSectionId === section.id ? "text-blue-900" : "text-slate-800"
                    )}>
                      {section.title || "Untitled Section"}
                    </p>
                    {section.description && (
                      <p className={cn(
                        "truncate text-[10px] transition-colors",
                        selectedSectionId === section.id ? "text-blue-400" : "text-slate-400"
                      )}>
                        {section.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-xs text-slate-400">No sections yet. Add one below.</p>
            </div>
          )}
          <button
            onClick={onAddSection}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-semibold text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
          >
            <span>+ Add Section</span>
          </button>
        </div>
      )}

      {/* {activeTab === "settings" && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Template Settings
          </h3>
          <div className="space-y-4">
            <Input
              label="Template Name"
              placeholder="e.g. Customer Satisfaction Survey"
              value={template.name}
              onChange={(e) => onUpdateTemplate({ name: e.target.value })}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300"
                rows={4}
                placeholder="What is this template for?"
                value={template.description}
                onChange={(e) => onUpdateTemplate({ description: e.target.value })}
              />
            </div>
            <Input
              label="Category"
              placeholder="e.g. Feedback"
              value={template.category}
              onChange={(e) => onUpdateTemplate({ category: e.target.value })}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};
