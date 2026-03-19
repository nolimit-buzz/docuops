import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      {children}
    </div>
  );
}
