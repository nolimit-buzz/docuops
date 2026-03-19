import { ReactNode } from 'react';

interface DocTypeOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: ReactNode;
}

export function DocTypeOption({ selected, onClick, title, description, icon }: DocTypeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-colors ${
          selected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className={`font-bold transition-colors ${selected ? 'text-blue-900' : 'text-slate-900'}`}>
          {title}
        </h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div
        className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
