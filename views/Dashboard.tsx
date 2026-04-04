"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IntakeModal } from "../components/IntakeModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useStore } from "../hooks/useStore";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { getCompanyStats, type CompanyStats } from "../query/stats";

export function Dashboard() {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [showIntake, setShowIntake] = useState(false);
  const [statsData, setStatsData] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id || user.id === "u-1") {
      setLoading(false);
      return;
    }
    getCompanyStats(user.id)
      .then(setStatsData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

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

      <DashboardStats stats={statsData?.stats ?? null} loading={loading} />

      <DashboardCharts chartData={statsData?.chartData ?? null} loading={loading} />

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
            ))
          ) : statsData?.recentActivity && statsData.recentActivity.length > 0 ? (
            statsData.recentActivity.slice(0, 3).map((doc) => (
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
            ))
          ) : (
            <p className="p-6 text-sm text-slate-400">No recent activity.</p>
          )}
        </div>
      </Card>

      {showIntake && <IntakeModal onClose={() => setShowIntake(false)} />}
    </div>
  );
}
