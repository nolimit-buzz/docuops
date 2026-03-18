"use client";

import Link from "next/link";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%)]" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between bg-slate-950 px-8 py-10 text-white md:px-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400 font-bold text-slate-950">
                D
              </span>
              <span className="text-lg font-semibold tracking-tight">DigiCred</span>
            </Link>

            <div className="mt-14 max-w-md">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Secure Workspace Access
              </p>
              <h1 className="text-4xl font-bold leading-tight">
                Document workflows with governed access built in.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Sign in to continue drafting, collaborating, and reviewing from a
                single controlled workspace.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="mt-1 text-sm text-slate-300">team access</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold">AES</div>
              <div className="mt-1 text-sm text-slate-300">session encryption</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-bold">AI</div>
              <div className="mt-1 text-sm text-slate-300">draft assistance</div>
            </div>
          </div>
        </section>

        <section className="flex items-center bg-white px-6 py-10 md:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>

            {children}

            <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
