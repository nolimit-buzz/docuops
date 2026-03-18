"use client";

import React, { useState } from "react";
import { Badge, Button, Input } from "../components/UIComponents";
import { useStore } from "../hooks/useStore";
import { KnowledgeChunk } from "../types";

export const KnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKnowledge } = useStore();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleUpload = () => {
    const newChunk: KnowledgeChunk = {
      id: `k-${Date.now()}`,
      title,
      content,
      tags: ["manual-upload"],
      uploadedBy: "u-1",
      createdAt: new Date().toISOString(),
    };

    addKnowledge(newChunk);
    setShowUpload(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500">
            Upload documents to power your AI drafts.
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>+ Add Knowledge</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Document
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Preview
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Tags
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {knowledgeBase.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.title}</div>
                </td>
                <td className="max-w-xs px-6 py-4">
                  <div className="truncate text-sm text-slate-500">
                    {item.content}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} color="blue">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {knowledgeBase.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No knowledge assets uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                Add Knowledge Asset
              </h3>
              <p className="text-sm text-slate-500">
                This content will be retrievable by the AI.
              </p>
            </div>
            <div className="space-y-4 p-6">
              <Input
                label="Title"
                placeholder="e.g. Employee Handbook 2024"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Content / Excerpt
                </label>
                <textarea
                  className="h-40 w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste text content here..."
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  In a real app, you would upload PDF or Docx files here.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 bg-slate-50 p-4">
              <Button variant="ghost" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!title || !content}>
                Save Asset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
