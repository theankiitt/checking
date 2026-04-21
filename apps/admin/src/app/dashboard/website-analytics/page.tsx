"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Download, Filter, RefreshCw } from "lucide-react";
import { useWebsiteAnalytics, useRefreshAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/currency";
import {
  TrafficChart,
  VisitorTrendChart,
  RevenueChart,
  DeviceChart,
  TrafficSourceChart,
} from "@/components/analytics/Charts";

export default function WebsiteAnalyticsPage() {
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
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 custom-font mb-2">
              Website Analytics
            </h1>
            <p className="text-gray-600 custom-font">
              Monitor your website performance and user behavior
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Date Range Selector */}
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

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="custom-font">Refresh</span>
            </button>

            {/* Export Button */}
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span className="custom-font">Export</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="custom-font">Filter</span>
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
          <div className="space-y-6">
            {/* Skeleton Overview Cards */}
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
            {/* Skeleton Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 custom-font">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
                    {analyticsData?.overview.totalVisitors.toLocaleString() ||
                      "0"}
                  </p>
                  <p className="text-sm text-green-600 custom-font mt-1">
                    +{analyticsData?.overview.growthRate.toFixed(1)}% vs last
                    period
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 custom-font">
                    Unique Visitors
                  </p>
                  <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
                    {analyticsData?.overview.uniqueVisitors.toLocaleString() ||
                      "0"}
                  </p>
                  <p className="text-sm text-gray-500 custom-font mt-1">
                    {(
                      ((analyticsData?.overview?.uniqueVisitors || 0) /
                        (analyticsData?.overview?.totalVisitors || 1)) *
                        100 || 0
                    ).toFixed(0)}
                    % of total
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 custom-font">
                    Page Views
                  </p>
                  <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
                    {analyticsData?.overview.pageViews.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm text-gray-500 custom-font mt-1">
                    {(
                      (analyticsData?.overview?.pageViews || 0) /
                        (analyticsData?.overview?.totalVisitors || 1) || 0
                    ).toFixed(1)}{" "}
                    per visitor
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 custom-font">
                    Bounce Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 custom-font mt-1">
                    {analyticsData?.overview?.bounceRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 custom-font mt-1">
                    Avg session:{" "}
                    {Math.floor(
                      (analyticsData?.overview?.avgSessionDuration || 0) / 60,
                    )}
                    m
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Traffic Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <TrafficChart
                  data={analyticsData?.traffic || []}
                  title="Traffic Overview"
                />
              </motion.div>

              {/* Visitor Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <VisitorTrendChart
                  data={analyticsData?.visitors || []}
                  title="New vs Returning Visitors"
                />
              </motion.div>
            </div>

            {/* Revenue and Conversions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <RevenueChart
                  data={analyticsData?.revenue || []}
                  title="Revenue Trend"
                />
              </motion.div>

              {/* Top Pages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
                  <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4 flex items-center">
                    <span className="w-5 h-5 mr-2 text-blue-600" />
                    Top Pages
                  </h3>
                  <div className="space-y-3">
                    {analyticsData?.pages.slice(0, 5).map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 custom-font">
                            {page.title}
                          </p>
                          <p className="text-sm text-gray-500">{page.path}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 custom-font">
                            {page.views.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {page.uniqueViews.toLocaleString()} unique
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Device and Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <DeviceChart
                  data={analyticsData?.devices || []}
                  title="Device Breakdown"
                />
              </motion.div>

              {/* Traffic Sources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <TrafficSourceChart
                  data={analyticsData?.sources || []}
                  title="Traffic Sources"
                />
              </motion.div>
            </div>

            {/* Footer Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold custom-font text-gray-900 mb-2">
                    Data Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 custom-font">
                        Conversion Rate
                      </p>
                      <p className="font-bold text-gray-900 custom-font">
                        {analyticsData?.overview.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 custom-font">Growth Rate</p>
                      <p className="font-bold text-green-600 custom-font">
                        +{analyticsData?.overview.growthRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 custom-font">Avg Session</p>
                      <p className="font-bold text-gray-900 custom-font">
                        {Math.floor(
                          (analyticsData?.overview?.avgSessionDuration || 0) /
                            60,
                        )}
                        m{" "}
                        {(analyticsData?.overview?.avgSessionDuration || 0) %
                          60}
                        s
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 custom-font">Bounce Rate</p>
                      <p className="font-bold text-gray-900 custom-font">
                        {analyticsData?.overview?.bounceRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
