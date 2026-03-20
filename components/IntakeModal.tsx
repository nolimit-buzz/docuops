"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useStore } from "../hooks/useStore";
import { DocStatus } from "../types";
import { DocTypeOption } from "./intake/DocTypeOption";
import { SelectGroup } from "./intake/SelectGroup";
import { SowIcon, BriefIcon, ProposalIcon } from "./intake/icons";
import { createDocument } from "../query/documents";

interface IntakeModalProps {
  onClose: () => void;
}

export function IntakeModal({ onClose }: IntakeModalProps) {
  const { addDocument, templates, user } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("Clean Energy");
  const [budget, setBudget] = useState("4-6M");
  const [timeline, setTimeline] = useState("4 weeks");

  const handleNext = () => {
    if (docType) setStep(2);
  };

  const handleSubmit = async () => {
    if (!docType) return;
    setLoading(true);
    try {
      const processText = `Since this is a ${category} project for ${clientName}, our ${timeline} execution protocol applies.`;
      const response: any = await createDocument(docType, {
        clientName,
        category,
        budget,
        timeline,
        processSummary: processText,
      });

      const docId = String(response?.doc?.id || response?.id || Date.now());
      const template = templates.find((t) => t.name.includes(docType)) || templates[0];

      addDocument({
        id: docId,
        title: `${docType} - ${clientName}`,
        templateId: template?.id || '',
        status: DocStatus.DRAFT,
        organizationId: user.organizationId,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: [],
        projectContext: { clientName, category, budget, timeline, processSummary: processText },
      });

      onClose();
      router.push(`/documents/${docId}`);
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setLoading(false);
    }
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
              <DocTypeOption
                selected={docType === "SOW"}
                onClick={() => setDocType("SOW")}
                title="Statement of Work (SOW)"
                description="Formal document defining project scope, timeline, and deliverables."
                icon={<SowIcon />}
              />
              <DocTypeOption
                selected={docType === "Project Brief"}
                onClick={() => setDocType("Project Brief")}
                title="Project Brief"
                description="High-level overview of goals and requirements."
                icon={<BriefIcon />}
              />
              <DocTypeOption
                selected={docType === "Proposal"}
                onClick={() => setDocType("Proposal")}
                title="Commercial Proposal"
                description="Pitch document including pricing and value proposition."
                icon={<ProposalIcon />}
              />
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
                      "Since this is a <strong>{category}</strong> project for{" "}
                      <strong>{clientName}</strong>, our{" "}
                      <strong>{timeline}</strong> execution protocol applies."
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
            <Button onClick={handleNext} disabled={!docType}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!clientName || loading} className="flex items-center gap-2">
              {loading && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? "Creating..." : "Create Document"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
