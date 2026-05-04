"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useStore } from "../hooks/useStore";
import { DocTypeOption } from "./intake/DocTypeOption";
import { SelectGroup } from "./intake/SelectGroup";
import { SowIcon, BriefIcon, ProposalIcon } from "./intake/icons";

const ICONS = [<SowIcon key="sow" />, <BriefIcon key="brief" />, <ProposalIcon key="proposal" />];

interface IntakeModalProps {
  onClose: () => void;
}

export function IntakeModal({ onClose }: IntakeModalProps) {
  const { templates, setPaperDraft } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docTypeId, setDocTypeId] = useState<string | null>(null);
  const [docTypeName, setDocTypeName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("Clean Energy");
  const [budget, setBudget] = useState("4-6M");
  const [timeline, setTimeline] = useState("4 weeks");

  // Only show published templates (non-drafts) 
  const filteredTemplates = templates.filter(t => 
    !t.isDraft && (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedTemplate = templates.find(t => t.id === docTypeId);

  const handleNext = () => {
    if (docTypeId) setStep(2);
  };

  const handleSubmit = () => {
    if (!docTypeId || !docTypeName) return;
    const draftId = `draft-${Date.now()}`;
    setPaperDraft(draftId, {
      paperTypeId: docTypeId,
      paperTypeName: docTypeName,
      clientName,
      category,
      budget,
      timeline,
    });
    router.push(`/documents/${draftId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-y-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? "Start New Document" : "Project Parameters"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1
                ? "Select a template for your new document."
                : "Define the constraints for the Governance Engine."}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-colors ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`}
            />
            <div
              className={`h-2.5 w-2.5 rounded-full transition-colors ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar min-h-[450px]">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="relative">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Select Template
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search or select a template..."
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    value={searchQuery || (selectedTemplate?.name ? selectedTemplate.name : "")}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (docTypeId) setDocTypeId(null); // Clear selection if typing
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((type, idx) => (
                          <button
                            key={type.id}
                            onClick={() => { 
                              setDocTypeId(type.id); 
                              setDocTypeName(type.name); 
                              setSearchQuery(""); 
                              setIsDropdownOpen(false); 
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                              docTypeId === type.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              docTypeId === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {ICONS[idx % ICONS.length]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-bold truncate ${
                                docTypeId === type.id ? 'text-blue-900' : 'text-slate-900'
                              }`}>
                                {type.name}
                              </h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">
                                {type.description}
                              </p>
                            </div>
                            {docTypeId === type.id && (
                              <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-500">
                          <p className="text-sm font-medium">No results found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedTemplate && !isDropdownOpen && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Selected Template</p>
                      <p className="text-sm text-blue-700 font-medium">Using the &quot;{selectedTemplate.name}&quot; blueprint.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                label="Client Name"
                placeholder="e.g. Acme Solar Dynamics"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                autoFocus
              />

              <div className="grid grid-cols-2 gap-6">
                <SelectGroup
                  label="Project Category"
                  value={category}
                  onChange={setCategory}
                  options={["Clean Energy", "FinTech", "E-commerce"]}
                />
                <SelectGroup
                  label="Budget Range"
                  value={budget}
                  onChange={setBudget}
                  options={["4-6M", "7-10M", "10M+"]}
                />
              </div>

              <SelectGroup
                label="Timeline"
                value={timeline}
                onChange={setTimeline}
                options={["4 weeks", "8 weeks", "12 weeks"]}
              />

              {clientName && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start space-x-3">
                  <div className="text-indigo-600 mt-1">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">
                      Process Governance Match
                    </p>
                    <p className="text-sm text-indigo-900 leading-relaxed">
                      &quot;Since this is a <strong>{category}</strong> project for{" "}
                      <strong>{clientName}</strong>, our{" "}
                      <strong>{timeline}</strong> execution protocol applies.&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 animate-in fade-in slide-in-from-bottom-2 duration-200 absolute bottom-0 left-0 right-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={handleNext} disabled={!docTypeId}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!clientName}>
              Create Document
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
