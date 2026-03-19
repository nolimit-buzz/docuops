"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useStore';
import { UserRole } from '@/types';
import { sessionHelper } from '@/lib/session';
import { NavItem } from './NavItem';

export function Sidebar() {
  const { user, organization } = useStore();
  const p = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionHelper.clearSession();
    useStore.persist.clearStorage();
    router.replace('/auth/login');
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">DigiCred</span>
        </div>

        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Organization</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-800">{organization.name}</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
              {organization.plan}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>

        <NavItem
          to="/dashboard"
          active={p === '/dashboard'}
          label="Dashboard"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />

        <NavItem
          to="/documents"
          active={p.startsWith('/documents')}
          label="Documents"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />

        <NavItem
          to="/knowledge"
          active={p === '/knowledge'}
          label="Knowledge Base"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        {user.role === UserRole.ADMIN && (
          <>
            <p className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</p>
            <NavItem
              to="/templates"
              active={p === '/templates'}
              label="Templates"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 01-2-2V5a2 2 0 012-2h3" />
                </svg>
              }
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center">
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-200" />
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
