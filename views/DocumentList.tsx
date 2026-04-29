"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IntakeModal } from "../components/IntakeModal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { useStore } from "../hooks/useStore";
import { DocStatus, Document } from "../types";

const SummaryCard: React.FC<{
  title: string;
  count: number;
  desc: string;
  sub: string;
  colorClass: string;
  active: boolean;
  onClick: () => void;
  badgeClass: string;
}> = ({ title, count, desc, sub, colorClass, active, onClick, badgeClass }) => (
  <div
    onClick={onClick}
    className={`relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition-all ${
      active
        ? `${colorClass} ring-2 ring-blue-500 ring-offset-1 shadow-md`
        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
    }`}
  >
    <div
      className={`absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}
    >
      {title}
    </div>
    <div className="mt-8">
      <span className="text-4xl font-bold text-slate-900">{count}</span>
    </div>
    <h3 className="mb-2 mt-4 text-sm font-bold text-slate-900">{desc}</h3>
    <p className="text-xs leading-relaxed text-slate-500">{sub}</p>
  </div>
);

const DocumentCard: React.FC<{ doc: Document; onDelete: (id: string) => void }> = ({ doc, onDelete }) => {
  const { templates } = useStore();
  const router = useRouter();
  const template = templates.find((item) => item.id === doc.templateId);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={() => router.push(`/documents/${doc.id}`)}
      className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-sm ${
            doc.status === DocStatus.APPROVED
              ? "bg-green-100 text-green-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <div className="relative flex items-center gap-2">
          <Badge
            color={
              doc.status === DocStatus.APPROVED
                ? "green"
                : doc.status === DocStatus.REVIEW
                  ? "yellow"
                  : "gray"
            }
          >
            {doc.status}
          </Badge>

          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push(`/documents/${doc.id}`); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(doc.id); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
        {doc.title}
      </h3>
      <p className="mb-6 flex-1 text-sm text-slate-500">
        {template?.name || "Document"}
      </p>

      <div className="flex items-center border-t border-slate-100 pt-4 text-xs text-slate-400">
        <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const DocumentListItem: React.FC<{ doc: Document; onDelete: (id: string) => void }> = ({ doc, onDelete }) => {
  const { templates } = useStore();
  const router = useRouter();
  const template = templates.find((item) => item.id === doc.templateId);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={() => router.push(`/documents/${doc.id}`)}
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ${
            doc.status === DocStatus.APPROVED
              ? "bg-green-100 text-green-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {doc.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{template?.name || "Document"}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">Author</p>
          <p className="text-xs font-medium text-slate-700">Jane Doe</p>
        </div>
        <Badge
          color={
            doc.status === DocStatus.APPROVED
              ? "green"
              : doc.status === DocStatus.REVIEW
                ? "yellow"
                : "gray"
          }
        >
          {doc.status}
        </Badge>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className={`rounded-lg p-1.5 text-slate-400 transition-opacity hover:bg-slate-100 hover:text-slate-600 ${menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); router.push(`/documents/${doc.id}`); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(doc.id); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const DocumentList: React.FC = () => {
  const { documents, paperDrafts, deleteDocument, clearPaperDraft } = useStore();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    if (pendingDeleteId.startsWith('draft-')) {
      clearPaperDraft(pendingDeleteId);
    } else {
      deleteDocument(pendingDeleteId);
    }
    toast.success('Document deleted');
    setPendingDeleteId(null);
  };
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [filterStatus, setFilterStatus] = useState<DocStatus | "All">("All");
  const [showIntake, setShowIntake] = useState(false);

  const counts = useMemo(
    () => ({
      all: documents.length,
      draft: documents.filter((doc) => doc.status === DocStatus.DRAFT).length + Object.keys(paperDrafts).length,
      review: documents.filter((doc) => doc.status === DocStatus.REVIEW).length,
      approved: documents.filter((doc) => doc.status === DocStatus.APPROVED).length,
    }),
    [documents, paperDrafts],
  );

  const paperDraftDocs = useMemo<Document[]>(
    () =>
      Object.entries(paperDrafts).map(([id, draft]) => ({
        id,
        title: `${draft.paperTypeName} - ${draft.clientName}`,
        templateId: 't-1',
        status: DocStatus.DRAFT,
        organizationId: '',
        createdBy: '',
        createdAt: new Date(Number(id.replace('draft-', ''))).toISOString(),
        updatedAt: new Date(Number(id.replace('draft-', ''))).toISOString(),
        sections: [],
      })),
    [paperDrafts],
  );

  const filteredDocs = useMemo(() => {
    const documentIds = new Set(documents.map((d) => d.id));
    const uniquePaperDraftDocs = paperDraftDocs.filter((pd) => !documentIds.has(pd.id));
    const base = documents.filter((doc) =>
      filterStatus === "All" ? true : doc.status === filterStatus,
    );
    if (filterStatus === "All" || filterStatus === DocStatus.DRAFT) {
      return [...uniquePaperDraftDocs, ...base];
    }
    return base;
  }, [documents, paperDraftDocs, filterStatus]);

  return (
    <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Generate Documents
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Fill the information below to start generating business documents.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 transition-all ${
                viewMode === "list"
                  ? "bg-slate-100 text-blue-600 shadow-inner"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="List View"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 transition-all ${
                viewMode === "grid"
                  ? "bg-slate-100 text-blue-600 shadow-inner"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid View"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>

          <Button
            onClick={() => setShowIntake(true)}
            className="h-11 border-none bg-green-500 px-6 text-white shadow-lg shadow-green-100 hover:bg-green-600"
          >
            <span className="mr-2 text-lg leading-none">+</span> New Document
          </Button>
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="All Papers"
          count={counts.all}
          desc="Every business paper in your pipeline"
          sub="Track your progress from draft to approval"
          colorClass="border-sky-200 bg-sky-50"
          badgeClass="bg-sky-200 text-sky-800"
          active={filterStatus === "All"}
          onClick={() => setFilterStatus("All")}
        />
        <SummaryCard
          title="Drafts"
          count={counts.draft}
          desc="Papers being written or edited"
          sub="Keep refining your drafts for submission"
          colorClass="border-indigo-200 bg-indigo-50"
          badgeClass="bg-indigo-200 text-indigo-800"
          active={filterStatus === DocStatus.DRAFT}
          onClick={() => setFilterStatus(DocStatus.DRAFT)}
        />
        <SummaryCard
          title="Pending Review"
          count={counts.review}
          desc="Papers submitted for review"
          sub="Monitor feedback and approval status"
          colorClass="border-blue-200 bg-blue-50"
          badgeClass="bg-blue-200 text-blue-800"
          active={filterStatus === DocStatus.REVIEW}
          onClick={() => setFilterStatus(DocStatus.REVIEW)}
        />
        <SummaryCard
          title="Approved"
          count={counts.approved}
          desc="Papers ready for next steps"
          sub="These are ready to go"
          colorClass="border-emerald-200 bg-emerald-50"
          badgeClass="bg-emerald-200 text-emerald-800"
          active={filterStatus === DocStatus.APPROVED}
          onClick={() => setFilterStatus(DocStatus.APPROVED)}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {filterStatus === "All" ? "Recent Documents" : filterStatus}
        </h2>
        <span className="text-sm text-slate-500">
          {filteredDocs.length} documents found
        </span>
      </div>

      {filteredDocs.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {filteredDocs.map((doc) =>
            viewMode === "grid" ? (
              <DocumentCard key={doc.id} doc={doc} onDelete={setPendingDeleteId} />
            ) : (
              <DocumentListItem key={doc.id} doc={doc} onDelete={setPendingDeleteId} />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <p className="text-slate-400">No documents found in this category.</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setFilterStatus("All")}
          >
            Clear Filter
          </Button>
        </div>
      )}

      {showIntake && <IntakeModal onClose={() => setShowIntake(false)} />}

      <ConfirmModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="This document will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
