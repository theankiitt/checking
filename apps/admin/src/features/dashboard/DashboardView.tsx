"use client";

import { RefreshCw } from "lucide-react";
import { KPICards } from "./components/KPICards";
import { OverviewCards } from "./components/OverviewCards";
import { QuickInsights } from "./components/QuickInsights";
import { DashboardCharts } from "./components/DashboardCharts";
import type { DashboardStats, ChartData } from "@/shared/types";

interface DashboardViewProps {
  stats?: DashboardStats;
  chartData?: ChartData;
  isLoading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

export function DashboardView({
  stats,
  chartData,
  isLoading,
  error,
  onRefresh,
}: DashboardViewProps) {
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">
            Failed to load dashboard data
          </p>
          <p className="text-gray-500 text-sm mt-2 mb-4">{error.message}</p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KPICards data={stats} isLoading={isLoading} />
      <DashboardCharts data={chartData} isLoading={isLoading} />
      <OverviewCards data={stats} isLoading={isLoading} />
      <QuickInsights data={stats} isLoading={isLoading} />
    </div>
  );
}
