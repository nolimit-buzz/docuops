"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/hooks/useStore";
import { getHistory } from "@/query/history";

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

interface HistoryStats {
  totalDocs: number;
  inReview: number;
  approved: number;
}

export function DashboardStats() {
  const { templates } = useStore();
  const [stats, setStats] = useState<HistoryStats>({ totalDocs: 0, inReview: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory({ params: { limit: 1000 } } as any)
      .then((res: any) => {
        const docs: any[] = Array.isArray(res) ? res : (res?.docs ?? res?.data ?? []);
        const totalDocs: number = res?.totalDocs ?? docs.length;
        const inReview = docs.filter((d) => d?.status === "review" || d?.status === "Review").length;
        const approved = docs.filter((d) => d?.status === "approved" || d?.status === "Approved").length;
        setStats({ totalDocs, inReview, approved });
      })
      .catch(() => setStats({ totalDocs: 0, inReview: 0, approved: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Total Documents" value={stats.totalDocs} />
      <StatCard label="Active Templates" value={templates.length} />
      <StatCard
        label="In Review"
        value={stats.inReview}
        sub={stats.totalDocs > 0 ? `of ${stats.totalDocs}` : undefined}
        subColor="text-amber-600"
      />
      <StatCard label="Approved" value={stats.approved} subColor="text-green-600" />
    </div>
  );
}
