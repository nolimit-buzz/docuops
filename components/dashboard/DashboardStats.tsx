"use client";

import { Card } from "@/components/ui/Card";
import type { CompanyStats } from "@/query/stats";

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

interface DashboardStatsProps {
  stats: CompanyStats["stats"] | null;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Total Documents" value={stats?.totalDocuments ?? 0} />
      <StatCard label="Active Templates" value={stats?.activeTemplates ?? 0} />
      <StatCard
        label="In Review"
        value={stats?.inReview ?? 0}
        sub={stats && stats.totalDocuments > 0 ? `of ${stats.totalDocuments}` : undefined}
        subColor="text-amber-600"
      />
      <StatCard label="Approved" value={stats?.approved ?? 0} subColor="text-green-600" />
    </div>
  );
}
