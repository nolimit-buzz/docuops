"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IntakeModal } from "../components/IntakeModal";
import { Button, Card } from "../components/UIComponents";
import { useStore } from "../hooks/useStore";

const MOCK_STATS = [
  { name: "Mon", docs: 4, tokens: 2400 },
  { name: "Tue", docs: 7, tokens: 4500 },
  { name: "Wed", docs: 5, tokens: 3200 },
  { name: "Thu", docs: 12, tokens: 8900 },
  { name: "Fri", docs: 9, tokens: 6700 },
];

export const Dashboard: React.FC = () => {
  const { documents, templates } = useStore();
  const router = useRouter();
  const [showIntake, setShowIntake] = useState(false);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Overview of your organization&apos;s document activity.
          </p>
        </div>
        <Button onClick={() => setShowIntake(true)}>+ New Document</Button>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium uppercase text-slate-500">
            Total Documents
          </p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">
              {documents.length}
            </span>
            <span className="ml-2 text-sm font-medium text-green-600">+12%</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium uppercase text-slate-500">
            Active Templates
          </p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">
              {templates.length}
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium uppercase text-slate-500">
            AI Efficiency
          </p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">85%</span>
            <span className="ml-2 text-sm font-medium text-green-600">
              Drafts used
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium uppercase text-slate-500">
            Tokens Saved
          </p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">125k</span>
            <span className="ml-2 text-sm text-slate-400">vs Manual</span>
          </div>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Document Volume
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="docs"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            Token Usage Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {documents.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50"
              onClick={() => router.push(`/documents/${doc.id}`)}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-500">
                    Edited {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  doc.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {showIntake && <IntakeModal onClose={() => setShowIntake(false)} />}
    </div>
  );
};
