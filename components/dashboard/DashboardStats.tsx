"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/UIComponents";
import { getHistory } from "@/query/history";
import { useStore } from "@/hooks/useStore";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}

function StatCard({ label, value, sub, subColor = "text-slate-400" }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium uppercase text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {sub && <span className={`text-sm font-medium ${subColor}`}>{sub}</span>}
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
    </Card>
  );
}

export function DashboardStats() {
  const { templates } = useStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((res: any) => {
        const items = Array.isArray(res) ? res : (res?.data ?? []);
        setHistory(items);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const total = history.length;
  const aiGenerated = history.filter((d) => d?.isAiGenerated === true).length;
  const submitted = history.filter((d) =>
    ["submitted", "approved", "published"].includes(String(d?.status).toLowerCase())
  ).length;

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Total Documents" value={total} sub="+12%" subColor="text-green-600" />
      <StatCard label="Active Templates" value={templates.length} />
      <StatCard
        label="AI Generated"
        value={aiGenerated}
        sub={total > 0 ? `of ${total}` : undefined}
        subColor="text-green-600"
      />
      <StatCard label="Submitted" value={submitted} sub="approved / published" />
    </div>
  );
}
