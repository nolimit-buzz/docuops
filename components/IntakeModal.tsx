"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from './UIComponents';
import { useStore } from '../hooks/useStore';
import { DocStatus } from '../types';

interface IntakeModalProps {
  onClose: () => void;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({ onClose }) => {
  const { addDocument, templates, user } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('Clean Energy');
  const [budget, setBudget] = useState('4-6M');
  const [timeline, setTimeline] = useState('4 weeks');

  const handleNext = () => {
    if (docType) setStep(2);
  };

  const handleSubmit = () => {
    // Standard Process Text Generation Logic
    const processText = `Since this is a ${category} project for ${clientName}, our ${timeline} execution protocol applies.`;
    
    // Find appropriate template
    const template = templates.find(t => t.name.includes(docType || '')) || templates[0];
    
    const newDocId = `d-${Date.now()}`;
    const newDoc = {
      id: newDocId,
      title: `${docType || 'Document'} - ${clientName}`,
      templateId: template.id,
      status: DocStatus.DRAFT,
      organizationId: user.organizationId,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [],
      projectContext: {
        clientName,
        category,
        budget,
        timeline,
        processSummary: processText
      }
    };

    addDocument(newDoc);
    onClose();
    router.push(`/documents/${newDocId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">
               {step === 1 ? 'Start New Document' : 'Project Parameters'}
             </h2>
             <p className="text-sm text-slate-500 mt-1">
               {step === 1 ? 'Select the type of document you need to generate.' : 'Define the constraints for the Governance Engine.'}
             </p>
           </div>
           {/* Step Indicator */}
           <div className="flex items-center space-x-2">
             <div className={`h-2.5 w-2.5 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
             <div className={`h-2.5 w-2.5 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
           </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto min-h-[400px]">
          {step === 1 ? (
            <div className="grid grid-cols-1 gap-4">
              <DocTypeOption 
                selected={docType === 'SOW'} 
                onClick={() => setDocType('SOW')}
                title="Statement of Work (SOW)"
                description="Formal document defining project scope, timeline, and deliverables."
                icon={<SowIcon />}
              />
              <DocTypeOption 
                selected={docType === 'Project Brief'} 
                onClick={() => setDocType('Project Brief')}
                title="Project Brief"
                description="High-level overview of goals and requirements."
                icon={<BriefIcon />}
              />
              <DocTypeOption 
                selected={docType === 'Proposal'} 
                onClick={() => setDocType('Proposal')}
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
                 <SelectGroup label="Project Category" value={category} onChange={setCategory} options={['Clean Energy', 'FinTech', 'E-commerce']} />
                 <SelectGroup label="Budget Range" value={budget} onChange={setBudget} options={['4-6M', '7-10M', '10M+']} />
              </div>

              <SelectGroup label="Timeline" value={timeline} onChange={setTimeline} options={['4 weeks', '8 weeks', '12 weeks']} />

              {/* Live Preview of Logic */}
              {clientName && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start space-x-3 animate-fade-in">
                   <div className="text-indigo-600 mt-1">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">Process Governance Match</p>
                     <p className="text-sm text-indigo-900 leading-relaxed">
                       "Since this is a <strong>{category}</strong> project for <strong>{clientName}</strong>, our <strong>{timeline}</strong> execution protocol applies."
                     </p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
           <Button variant="ghost" onClick={onClose}>Cancel</Button>
           {step === 1 ? (
             <Button onClick={handleNext} disabled={!docType}>Continue</Button>
           ) : (
             <Button onClick={handleSubmit} disabled={!clientName}>Create Document</Button>
           )}
        </div>

      </div>
    </div>
  );
};

// Sub-components for internal use
const DocTypeOption = ({ selected, onClick, title, description, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-colors ${selected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
      {icon}
    </div>
    <div>
      <h3 className={`font-bold transition-colors ${selected ? 'text-blue-900' : 'text-slate-900'}`}>{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
       {selected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
  </button>
);

const SelectGroup = ({ label, value, onChange, options }: any) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="relative">
      <select 
        className="w-full appearance-none pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium cursor-pointer hover:border-slate-400 transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

// Icons
const SowIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const BriefIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const ProposalIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
