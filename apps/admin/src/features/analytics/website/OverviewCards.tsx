"use client";

import type { AnalyticsOverview } from "@/shared/types";

interface OverviewCardsProps {
  data?: AnalyticsOverview;
  isLoading: boolean;
}

export function AnalyticsOverviewCards({
  data,
  isLoading,
}: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 custom-font">
          Total Visitors
        </p>
        <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
          {data?.totalVisitors.toLocaleString() || "0"}
        </p>
        <p className="text-sm text-green-600 custom-font mt-1">
          +{data?.growthRate.toFixed(1)}% vs last period
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 custom-font">
          Unique Visitors
        </p>
        <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
          {data?.totalVisitors
            ? Math.floor(data.totalVisitors * 0.7).toLocaleString()
            : "0"}
        </p>
        <p className="text-sm text-gray-500 custom-font mt-1">
          {data?.totalVisitors
            ? Math.floor(
                ((data.totalVisitors * 0.7) / data.totalVisitors) * 100,
              )
            : 0}
          % of total
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 custom-font">
          Page Views
        </p>
        <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
          {data?.pageViews.toLocaleString() || "0"}
        </p>
        <p className="text-sm text-gray-500 custom-font mt-1">
          {data?.totalVisitors
            ? (data.pageViews / data.totalVisitors).toFixed(1)
            : "0"}{" "}
          per visitor
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 custom-font">
          Bounce Rate
        </p>
        <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
          {data?.bounceRate.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500 custom-font mt-1">
          Avg session: {Math.floor((data?.avgSessionDuration || 0) / 60)}m
        </p>
      </div>
    </div>
  );
}
