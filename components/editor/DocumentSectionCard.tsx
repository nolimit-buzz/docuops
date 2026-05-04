"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentSection } from "@/types";

interface DocumentSectionCardProps {
  section: DocumentSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const DocumentSectionCard: React.FC<DocumentSectionCardProps> = ({
  section,
  index,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group relative flex items-start rounded-2xl border bg-white p-5 transition-all cursor-pointer",
        isSelected
          ? "border-blue-500 shadow-lg ring-1 ring-blue-500"
          : "border-slate-100 hover:border-slate-300 hover:shadow-md"
      )}
    >
      <div className={cn(
        "mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
        isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
      )}>
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-semibold truncate",
          isSelected ? "text-blue-900" : "text-slate-800"
        )}>
          {section.title || "Untitled Section"}
        </p>
        {section.description && (
          <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{section.description}</p>
        )}
        {section.sectionPrompt && (
          <p className="mt-1.5 text-[10px] font-mono text-slate-400 italic truncate">
            AI: {section.sectionPrompt}
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="ml-3 shrink-0 rounded-full p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {isSelected && (
        <div className="absolute -left-0.5 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-blue-500" />
      )}
    </div>
  );
};
