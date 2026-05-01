"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useStore } from "../hooks/useStore";
import { DocumentTemplate, DocumentTemplateField, Template } from "../types";
import { fetchDocumentTemplates } from "@/query/document-templates";
import { mapApiTemplateToLocal } from "@/lib/template-mapper";

export const Templates: React.FC = () => {
  const { templates, addTemplate, setTemplates } = useStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [newTempName, setNewTempName] = useState("");
  const [newTempDesc, setNewTempDesc] = useState("");
  const [newTempCat, setNewTempCat] = useState("General");
  const [loading, setLoading] = useState(true);

  // Filter templates: only show those that are NOT in draft IF there's a corresponding API template?
  // Actually, we should just show the store's templates as the source of truth.
  // We'll merge API templates into the store.

  useEffect(() => {
    setLoading(true);
    fetchDocumentTemplates().then((data) => {
      // Mapping API results to local format
      const apiMapped = data.docs.map(mapApiTemplateToLocal).filter(t => t && t.id);
      
      setTemplates((prevTemplates) => {
        const validPrev = Array.isArray(prevTemplates) ? prevTemplates.filter(t => t && t.id) : [];
        
        // Create a map of existing drafts by ID
        const draftMap = new Map(
          validPrev.filter(t => t.isDraft).map(t => [t.id, t])
        );

        // Merge logic:
        // 1. Keep all local templates (IDs starting with 't-')
        const localTemplates = validPrev.filter(t => t.id && t.id.startsWith('t-'));
        
        // 2. For each API template, use the draft from store if it exists, otherwise use fresh API data
        const mergedApiTemplates = apiMapped.map(apiT => draftMap.get(apiT.id) || apiT);

        // 3. Keep any API templates that are drafts but were NOT in the new API response (maybe deleted, but we keep the local draft)
        const apiIdsInResponse = new Set(apiMapped.map(t => t.id));
        const danglingDrafts = validPrev.filter(t => t.id && !t.id.startsWith('t-') && t.isDraft && !apiIdsInResponse.has(t.id));

        return [...localTemplates, ...mergedApiTemplates, ...danglingDrafts];
      });
    }).catch((err) => {
      console.error("Failed to fetch document templates:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    if (!newTempName.trim()) {
      return;
    }

    const newTemplate: Template = {
      id: `t-${Date.now()}`,
      name: newTempName,
      description: newTempDesc,
      category: newTempCat,
      documentStructure: [],
      formFields: [],
      createdBy: "u-1",
      updatedAt: new Date().toISOString(),
    };

    addTemplate(newTemplate);
    setShowModal(false);
    setNewTempName("");
    setNewTempDesc("");
    router.push(`/templates/${newTemplate.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-slate-500">
            Standardize your documents with smart templates.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Create Template</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No templates found.
          </div>
        ) : (
          templates.map((template) => (
            <Card
              key={template.id}
              className="group flex h-full flex-col transition-colors hover:border-blue-300"
            >
              <div
                className="flex-1 cursor-pointer p-6"
                onClick={() => router.push(`/templates/${template.id}`)}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-100">
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
                  <div className="flex items-center space-x-2">
                    {template.isDraft && (
                      <span className="rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                        Draft
                      </span>
                    )}
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {template.category}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  {template.name}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-slate-500">
                  {template.description}
                </p>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>{(template.documentStructure ?? template.sections ?? []).length} Sections</span>
                  <span>&middot;</span>
                  <span>
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-end rounded-b-xl border-t border-slate-100 bg-slate-50 p-4">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/templates/${template.id}`);
                  }}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit Structure <span className="ml-1">-&gt;</span>
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl animate-in zoom-in-95">
            <div className="border-b border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900">New Template</h3>
            </div>
            <div className="space-y-4 p-6">
              <Input
                label="Template Name"
                placeholder="e.g. Sales Contract"
                value={newTempName}
                onChange={(event) => setNewTempName(event.target.value)}
              />
              <Input
                label="Category"
                placeholder="e.g. Legal"
                value={newTempCat}
                onChange={(event) => setNewTempCat(event.target.value)}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={newTempDesc}
                  onChange={(event) => setNewTempDesc(event.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 bg-slate-50 p-4">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create &amp; Edit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
