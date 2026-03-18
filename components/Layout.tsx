"use client";

import { Sidebar } from './layout/Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
}
