"use client";

import { useState } from "react";
import { Calendar, Download, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { useWebsiteAnalytics, useRefreshAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsOverviewCards } from "@/features/analytics/website/OverviewCards";
import { TrafficChart, VisitorTrendChart, RevenueChart } from "@/components/analytics/Charts";

export default function GoogleAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useWebsiteAnalytics(dateRange);
  const { refreshWebsite } = useRefreshAnalytics();

  const handleRefresh = () => {
    refreshWebsite(dateRange);
    refetch();
  };

  return (
    <DashboardLayout title="Google Analytics">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 custom-font mb-2">
              Google Analytics
            </h1>
            <p className="text-gray-600 custom-font">
              Track real website performance and audience behavior using Google
              Analytics-style reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border-none outline-none text-gray-700 custom-font"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="custom-font">Refresh</span>
            </button>

            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span className="custom-font">Export</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load analytics data</p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <SkeletonGrid count={4} />
        ) : (
          <>
            <AnalyticsOverviewCards data={analyticsData?.overview} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 custom-font mb-4">
                  Traffic Overview
                </h2>
                <TrafficChart data={analyticsData?.traffic || []} title="Traffic" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 custom-font mb-4">
                  Visitor Trends
                </h2>
                <VisitorTrendChart data={analyticsData?.visitors || []} title="Visitors" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 custom-font mb-4">
                  Revenue Trend
                </h2>
                <RevenueChart data={analyticsData?.revenue || []} title="Revenue" />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
