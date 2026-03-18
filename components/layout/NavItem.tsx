"use client";

import Link from 'next/link';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={to}
      className={`flex items-center px-3 py-2.5 rounded-lg mb-1 transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
