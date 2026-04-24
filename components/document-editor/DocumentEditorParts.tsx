"use client";

import React from "react";
import { Button } from "../ui/Button";
import {
  DocStatus,
  DocumentSectionContent,
  KnowledgeChunk,
  TemplateSection,
} from "../../types";

export const SourceViewerModal: React.FC<{
  source: KnowledgeChunk;
  onClose: () => void;
}> = ({ source, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      <div
        className="ring-slate-900/5 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 animate-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 text-yellow-700">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{source.title}</h3>
              <p className="text-xs text-slate-500">Source ID: {source.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto whitespace-pre-wrap bg-white p-6 text-sm leading-relaxed text-slate-600">
          {source.content}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Verified Knowledge Asset
          </span>
          <span>Added {new Date(source.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export const StatusStepper: React.FC<{ status: DocStatus }> = ({ status }) => {
  const steps = [
    { id: DocStatus.DRAFT, label: "Draft", desc: "Authoring content" },
    { id: DocStatus.REVIEW, label: "In Review", desc: "Pending approval" },
    { id: DocStatus.APPROVED, label: "Approved", desc: "Signed & Sealed" },
  ];

  const getStatusState = (stepId: DocStatus) => {
    if (status === stepId) return "current";
    if (status === DocStatus.APPROVED) return "completed";
    if (status === DocStatus.REVIEW && stepId === DocStatus.DRAFT) {
      return "completed";
    }
    return "pending";
  };

  return (
    <div className="relative space-y-8 pl-1">
      <div className="absolute bottom-8 left-[10px] top-3 -z-0 w-0.5 -translate-x-1/2 transform bg-slate-200" />

      {steps.map((step) => {
        const state = getStatusState(step.id);
        const isCurrent = state === "current";
        const isCompleted = state === "completed";

        return (
          <div key={step.id} className="relative z-10 flex items-start gap-4">
            <div
              className={`mt-0.5 box-border h-5 w-5 flex-shrink-0 rounded-full border-[3px] transition-all duration-300 ${isCurrent
                ? "border-blue-600 bg-white ring-4 ring-blue-50"
                : isCompleted
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 bg-white"
                }`}
            >
              {isCompleted && (
                <div className="flex h-full w-full items-center justify-center text-white">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {isCurrent && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                </div>
              )}
            </div>
            <div>
              <p
                className={`text-sm font-bold transition-colors ${isCurrent
                  ? "text-blue-600"
                  : isCompleted
                    ? "text-slate-800"
                    : "text-slate-400"
                  }`}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DocumentOutline: React.FC<{
  sections: { id: string; title: string }[];
  activeSectionId: string | null;
  onNavigate: (id: string) => void;
}> = ({ sections, activeSectionId, onNavigate }) => {
  return (
    <div className="mt-10 border-t border-slate-100 pt-8">
      <h3 className="mb-6 px-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        Outline
      </h3>
      <div className="relative px-6">
        <div className="absolute bottom-3 left-[30px] top-3 w-px bg-slate-200" />

        <ul className="space-y-6">
          {sections.map((section, idx) => {
            const isActive = activeSectionId === section.id;
            return (
              <li key={section.id} className="relative z-10 pl-1">
                <button
                  onClick={() => onNavigate(section.id)}
                  className="group flex w-full items-center gap-4 text-left transition-colors"
                >
                  <div
                    className={`h-3 w-3 shrink-0 rounded-full ring-4 ring-white transition-all duration-300 ${isActive
                      ? "scale-125 bg-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
                      : "bg-slate-300 group-hover:bg-slate-400"
                      }`}
                  />

                  <span
                    className={`truncate text-sm transition-colors ${isActive
                      ? "font-bold text-blue-700"
                      : "font-medium text-slate-500 group-hover:text-slate-800"
                      }`}
                  >
                    <span className="mr-2 text-xs opacity-50">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

interface SectionCardProps {
  section: TemplateSection;
  idx: number;
  docSection?: DocumentSectionContent;
  isActive: boolean;
  isGenerating: boolean;
  activeSectionId: string | null;
  magicPrompt: string;
  knowledgeBase: KnowledgeChunk[];
  onContentUpdate: (id: string, val: string) => void;
  onMagicSubmit: (id: string, section: TemplateSection) => void;
  onRegenerate: (id: string, section: TemplateSection) => void;
  onFocus: (id: string) => void;
  onMagicPromptChange: (val: string) => void;
  onViewSource: (source: KnowledgeChunk) => void;
  onFeedback: (id: string, rating: "positive" | "negative" | null) => void;
  onFeedbackComment: (id: string, comment: string) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  idx,
  docSection,
  isActive,
  isGenerating,
  activeSectionId,
  magicPrompt,
  knowledgeBase,
  onContentUpdate,
  onMagicSubmit,
  onRegenerate,
  onFocus,
  onMagicPromptChange,
  onViewSource,
  onFeedback,
  onFeedbackComment,
}) => {
  const hasContent = !!docSection?.content;
  const contentText = docSection?.content || "";
  const charCount = contentText.length;
  const feedback = docSection?.feedback;
  const isAiGenerated = docSection?.isAiGenerated;

  return (
    <div id={section.id} className="group relative scroll-mt-32">
      <div className="mb-4 flex items-center justify-between pl-1">
        <div className="flex items-baseline gap-4">
          <span className="select-none text-2xl font-bold text-slate-300">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
          {section.required && (
            <span className="self-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500">
              Required
            </span>
          )}
        </div>

        {hasContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRegenerate(section.id, section)}
            className="text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="Regenerate Section"
            disabled={isGenerating}
          >
            <svg
              className={`mr-1.5 h-4 w-4 ${isGenerating && isActive ? "animate-spin" : ""
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Regenerate
          </Button>
        )}
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isActive
          ? "border-blue-200 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100"
          : "border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md"
          }`}
      >
        <div className="p-1">
          {section.type.startsWith("input_") ? (
            <div className="p-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                {section.title} Data Entry
              </label>
              {section.type === "input_textarea" ? (
                <textarea
                  className="w-full min-h-[120px] bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  value={contentText}
                  onChange={(e) => onContentUpdate(section.id, e.target.value)}
                  placeholder={section.placeholder || "Enter details..."}
                  onFocus={() => onFocus(section.id)}
                />
              ) : section.type === "input_dropdown" || section.type === "input_single_select" ? (
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                  value={contentText}
                  onChange={(e) => onContentUpdate(section.id, e.target.value)}
                  onFocus={() => onFocus(section.id)}
                >
                  <option value="">Select an option...</option>
                  {section.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    section.type === "input_number"
                      ? "number"
                      : section.type === "input_date_picker"
                        ? "date"
                        : "text"
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  value={contentText}
                  onChange={(e) => onContentUpdate(section.id, e.target.value)}
                  placeholder={section.placeholder || `Enter ${section.title.toLowerCase()}...`}
                  onFocus={() => onFocus(section.id)}
                />
              )}
            </div>
          ) : (
            <textarea
              className="min-h-[160px] w-full resize-y bg-transparent p-8 text-base leading-relaxed text-slate-600 outline-none placeholder-slate-300"
              value={contentText}
              onChange={(event) => onContentUpdate(section.id, event.target.value)}
              placeholder="Click here to start typing, or use the AI prompt below..."
              onFocus={() => onFocus(section.id)}
            />
          )}
        </div>

        <div className="px-8 pb-8 pt-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {docSection?.ragSourcesUsed?.map((sourceId: string) => {
                const source = knowledgeBase.find((item) => item.id === sourceId);
                if (!source) return null;

                return (
                  <button
                    key={sourceId}
                    onClick={() => onViewSource(source)}
                    className="group/source flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600"
                  >
                    <div className="rounded-full bg-white p-1 text-slate-400 group-hover/source:text-blue-500">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="max-w-[150px] truncate text-[11px] font-bold">
                      {source.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {isAiGenerated && hasContent && (
              <div className="ml-auto flex items-center gap-3 animate-in fade-in">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Rate AI:
                </span>
                <div className="relative flex rounded-lg border border-slate-100 bg-slate-50 p-1">
                  <button
                    onClick={() => onFeedback(section.id, "positive")}
                    className={`rounded p-1.5 transition-all ${feedback?.rating === "positive"
                      ? "bg-green-100 text-green-600"
                      : "text-slate-400 hover:bg-green-50 hover:text-green-600"
                      }`}
                    title="Good generation"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                  </button>
                  <div className="mx-1 my-1 w-px bg-slate-200" />
                  <button
                    onClick={() => onFeedback(section.id, "negative")}
                    className={`rounded p-1.5 transition-all ${feedback?.rating === "negative"
                      ? "bg-red-100 text-red-500"
                      : "text-slate-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                    title="Needs improvement"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {feedback?.rating === "negative" && !feedback.comment && (
            <div className="relative mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What should be improved? (e.g., 'Too verbose', 'Inaccurate data')"
                  className="w-full rounded-lg border border-red-100 bg-red-50/50 p-3 pl-10 pr-8 text-xs text-red-800 outline-none placeholder-red-300 focus:ring-1 focus:ring-red-200"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onFeedbackComment(section.id, event.currentTarget.value);
                    }
                  }}
                  autoFocus
                />
                <div className="absolute left-3 top-3 text-red-300">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => onFeedback(section.id, null)}
                  className="absolute right-2 top-2 rounded-full p-1 text-red-300 transition-colors hover:bg-red-100 hover:text-red-500"
                  title="Dismiss feedback"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 font-mono text-[10px] font-medium text-slate-300">
              {charCount} chars
            </div>

            <div className="group/magic relative flex-1">
              <div
                className={`flex items-center rounded-full border bg-slate-50 transition-all duration-300 ${isActive
                  ? "border-purple-300 bg-white shadow-[0_0_0_4px_rgba(168,85,247,0.05)]"
                  : "border-slate-200 hover:border-purple-200 hover:bg-white"
                  }`}
              >
                <div
                  className={`pl-4 pr-3 transition-colors ${isActive ? "text-purple-500" : "text-slate-400"
                    }`}
                >
                  {isGenerating && isActive ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:ring-0 outline-none"
                  placeholder={
                    hasContent
                      ? "Tell AI to refine or expand..."
                      : "Tell AI what to write..."
                  }
                  value={activeSectionId === section.id ? magicPrompt : ""}
                  onFocus={() => onFocus(section.id)}
                  onChange={(event) => {
                    onMagicPromptChange(event.target.value);
                  }}
                  onKeyDown={(event) =>
                    event.key === "Enter" && onMagicSubmit(section.id, section)
                  }
                />
                <button
                  onClick={() => onMagicSubmit(section.id, section)}
                  className="mr-2 rounded-full border border-slate-100 bg-white p-1.5 text-purple-600 shadow-sm transition-colors hover:bg-purple-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
