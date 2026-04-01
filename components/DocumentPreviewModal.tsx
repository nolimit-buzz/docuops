"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { DocStatus, Document, Template } from "../types";
import { Button } from "./ui/Button";

interface DocumentPreviewModalProps {
  doc: Document;
  template: Template;
  mode: "internal" | "client";
  onClose: () => void;
  onUpdate: (doc: Document) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  doc,
  template,
  mode,
  onClose,
  onUpdate,
}) => {
  const [localDoc, setLocalDoc] = useState(doc);
  const [viewMode, setViewMode] = useState<"internal" | "client">(mode);
  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState("");

  const handlePrint = () => {
    const content = document.getElementById("print-document-content");
    if (!content) return;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${localDoc.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Outfit', sans-serif; padding: 60px; color: #0f172a; font-size: 15px; line-height: 1.7; }
      h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
      h2 { font-size: 22px; font-weight: 700; margin: 28px 0 10px; }
      h3 { font-size: 18px; font-weight: 600; margin: 24px 0 10px; border-left: 4px solid #2563eb; padding-left: 16px; color: #1e293b; }
      h4 { font-size: 15px; font-weight: 600; margin: 18px 0 6px; }
      p { margin-bottom: 12px; text-align: justify; }
      strong { font-weight: 700; }
      em { font-style: italic; }
      ul { list-style: disc; padding-left: 28px; margin-bottom: 12px; }
      ol { list-style: decimal; padding-left: 28px; margin-bottom: 12px; }
      li { margin-bottom: 6px; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
      blockquote { border-left: 4px solid #cbd5e1; padding-left: 16px; color: #64748b; font-style: italic; margin: 16px 0; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; }
      header { border-bottom: 1px solid #e2e8f0; padding-bottom: 28px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-start; }
      .space-y-10 > div { margin-bottom: 40px; }
    </style>
  </head>
  <body>${content.innerHTML}</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (!printWindow) { URL.revokeObjectURL(url); return; }

    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      URL.revokeObjectURL(url);
    }, 500);
  };

  const handleSign = () => {
    const updated = { ...localDoc, status: DocStatus.APPROVED };
    setLocalDoc(updated);
    onUpdate(updated);
    setSigning(false);

    setTimeout(() => {
      alert(
        `Document signed successfully.\n\n` +
        `System notification sent:\n` +
        `- To Admin: Signature collected for "${localDoc.title}"\n` +
        `- To Client: Copy of signed agreement attached.`,
      );
    }, 500);
  };

  const scrollToSignature = () => {
    document
      .getElementById("signature-block")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      <div className="no-print z-50 flex shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex items-center gap-2 border border-slate-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Editor
          </Button>

          <div className="mx-2 hidden h-8 w-px bg-white/20 md:block" />

          <h2 className="hidden items-center gap-2 font-semibold text-white md:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              D
            </span>
            <span className="tracking-wide">DigiCred Presentation</span>
          </h2>

          {mode === "internal" && (
            <div className="ml-4 flex rounded-lg bg-slate-800 p-1">
              <button
                onClick={() => setViewMode("internal")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${viewMode === "internal"
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Internal View
              </button>
              <button
                onClick={() => setViewMode("client")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${viewMode === "client"
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Client View
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handlePrint}
            className="text-slate-300 hover:text-white"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </Button>
          {localDoc.status !== DocStatus.APPROVED ? (
            <Button
              onClick={scrollToSignature}
              className="border-none bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-700"
            >
              Sign Document
            </Button>
          ) : (
            <span className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Signed &amp; Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-900/50 p-8">
        <div id="print-document-content" className="mx-auto w-full max-w-[850px] bg-white p-[60px] text-slate-900 shadow-2xl shadow-black/50">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-slate-900">
                  {localDoc.title}
                </h1>
                <p className="text-slate-500">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  DigiCred
                </div>
                <div className="text-sm uppercase tracking-wider text-slate-400">
                  Secure Document
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-10">
            {localDoc.sections.map((section, index) => {
              const sectionDef = template.sections.find(
                (item) => item.id === section.sectionId,
              );
              return (
                <div key={section.sectionId} className="prose max-w-none">
                  <h3 className="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-bold text-slate-800">
                    {index + 1}. {sectionDef?.title || "Section"}
                  </h3>
                  <div className="text-justify leading-relaxed text-slate-600">
                    {section.content ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold text-slate-800 mt-5 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">{children}</h3>,
                          h4: ({ children }) => <h4 className="text-base font-semibold text-slate-700 mt-3 mb-1">{children}</h4>,
                          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-slate-800">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-500 my-3">{children}</blockquote>,
                          hr: () => <hr className="my-6 border-slate-200" />,
                          code: ({ children }) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700">{children}</code>,
                        }}
                      >
                        {section.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="italic text-slate-300">No content generated yet.</span>
                    )}
                  </div>

                  {viewMode === "internal" && section.ragSourcesUsed.length > 0 && (
                    <div className="no-print mt-4 rounded border border-yellow-100 bg-yellow-50 p-3 text-xs text-yellow-800">
                      <strong>Sources:</strong> {section.ragSourcesUsed.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            id="signature-block"
            className="mt-20 break-inside-avoid border-t border-slate-200 pt-10"
          >
            <h3 className="mb-8 text-lg font-bold text-slate-900">
              Authorization
            </h3>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="mb-16 text-sm font-bold uppercase text-slate-400">
                  For Client
                </p>
                <div className="mb-2 flex h-12 items-end border-b-2 border-slate-300">
                  {localDoc.status === DocStatus.APPROVED && (
                    <span className="-mb-2 block px-2 text-3xl italic text-blue-900 transform-[rotate(-2deg)]">
                      {signature || "Jane Doe"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">Authorized Signature</p>
              </div>
              <div>
                <p className="mb-16 text-sm font-bold uppercase text-slate-400">
                  For DigiCred Inc.
                </p>
                <div className="mb-2 flex h-12 items-end border-b-2 border-slate-300">
                  <img
                    src="https://placehold.co/150x50/transparent/222222?text=John+Smith"
                    alt="Signature"
                    className="opacity-70"
                  />
                </div>
                <p className="text-sm text-slate-600">John Smith, CEO</p>
              </div>
            </div>

            {localDoc.status !== DocStatus.APPROVED && !signing && (
              <div className="no-print mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="mb-4 text-slate-500">
                  Please review the document carefully before signing.
                </p>
                <Button onClick={() => setSigning(true)} size="lg" className="w-full sm:w-auto">
                  Click to Sign
                </Button>
              </div>
            )}

            {signing && (
              <div className="no-print mt-10 rounded-xl border border-blue-100 bg-blue-50 p-6 animate-in fade-in slide-in-from-bottom-4">
                <label className="mb-2 block text-sm font-medium text-blue-900">
                  Type your full name to sign
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    className="flex-1 rounded-lg border border-blue-200 px-4 py-3 outline-none"
                    placeholder="e.g. Jane Doe"
                    value={signature}
                    onChange={(event) => setSignature(event.target.value)}
                  />
                  <Button onClick={handleSign} disabled={!signature}>
                    Confirm Signature
                  </Button>
                </div>
                <p className="mt-2 text-xs text-blue-400">
                  By clicking confirm, you agree to the terms and conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
