"use client";

import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { getHistory } from "@/query/history";
import { useStore } from "@/hooks/useStore";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ChartPoint {
  name: string;
  docs: number;
  tokens: number;
}

function buildLast7Days(): ChartPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { name: DAY_LABELS[d.getDay()], docs: 0, tokens: 0 };
  });
}

function toChartData(items: any[]): ChartPoint[] {
  const points = buildLast7Days();
  const today = new Date();

  for (const item of items) {
    const raw = item?.createdAt ?? item?.updatedAt ?? item?.date;
    if (!raw) continue;
    const date = new Date(raw);
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / 86_400_000);
    if (daysAgo < 0 || daysAgo > 6) continue;
    const idx = 6 - daysAgo;
    points[idx].docs += 1;
    points[idx].tokens += Number(item?.tokenCount ?? item?.tokens ?? 0);
  }

  return points;
}

const AXIS_STYLE = { stroke: "#94a3b8", fontSize: 12 };
const TOOLTIP_STYLE = {
  contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
};

function ChartSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <Card key={i} className="p-6 animate-pulse">
          <div className="mb-6 h-5 w-40 rounded bg-slate-200" />
          <div className="h-64 w-full rounded bg-slate-100" />
        </Card>
      ))}
    </div>
  );
}

export function DashboardCharts() {
  const userId = useStore((s) => s.user.id);
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getHistory({ params: { userId } } as any)
      .then((res: any) => {
        const items = Array.isArray(res) ? res : (res?.data ?? []);
        setData(toChartData(items));
      })
      .catch(() => setData(buildLast7Days()))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <ChartSkeleton />;

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">Document Volume</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...AXIS_STYLE} tickLine={false} axisLine={false} />
              <YAxis {...AXIS_STYLE} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} {...TOOLTIP_STYLE} />
              <Bar dataKey="docs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">Token Usage Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...AXIS_STYLE} tickLine={false} axisLine={false} />
              <YAxis {...AXIS_STYLE} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
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
  );
}
