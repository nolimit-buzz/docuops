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
  const { paperTypes, setPaperDraft } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docTypeId, setDocTypeId] = useState<string | null>(null);
  const [docTypeName, setDocTypeName] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("Clean Energy");
  const [budget, setBudget] = useState("4-6M");
  const [timeline, setTimeline] = useState("4 weeks");

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-y-scroll custom-scrollbar">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? "Start New Document" : "Project Parameters"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1
                ? "Select the type of document you need to generate."
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
        <div className="p-8 overflow-y-auto min-h-[400px]">
          {step === 1 ? (
            <div className="grid grid-cols-1 gap-4">
              {paperTypes.length > 0 ? (
                paperTypes.map((type, idx) => (
                  <DocTypeOption
                    key={type.id}
                    selected={docTypeId === type.id}
                    onClick={() => { setDocTypeId(type.id); setDocTypeName(type.name); }}
                    title={type.name}
                    description={type.description}
                    icon={ICONS[idx % ICONS.length]}
                  />
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-400">
                  No document types available.
                </p>
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
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
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
