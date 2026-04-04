"use client";

import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { CompanyStats } from "@/query/stats";

interface ChartPoint {
  name: string;
  docs: number;
  tokens: number;
}

function toChartPoints(chartData: CompanyStats["chartData"]): ChartPoint[] {
  return chartData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en", { weekday: "short" }),
    docs: item.docs,
    tokens: item.tokens,
  }));
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

interface DashboardChartsProps {
  chartData: CompanyStats["chartData"] | null;
  loading: boolean;
}

export function DashboardCharts({ chartData, loading }: DashboardChartsProps) {
  if (loading) return <ChartSkeleton />;

  const data = chartData ? toChartPoints(chartData) : [];

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
