"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { useSalesAnalytics, useRefreshAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/currency";
import type {
  SalesMetrics,
  TopSellingProduct,
  ConversionFunnel,
  OrderStatusBreakdown,
} from "@/shared/types";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function SalesAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useSalesAnalytics(selectedPeriod);
  const { refreshSales } = useRefreshAnalytics();

  const handleRefresh = () => {
    refreshSales(selectedPeriod);
    refetch();
  };

  const periods = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
  ];

  const metrics = analyticsData?.metrics;
  const salesTrend = analyticsData?.salesTrend || [];
  const topProducts = analyticsData?.topProducts || [];
  const conversionFunnel = analyticsData?.conversionFunnel || [];
  const orderStatusBreakdown = analyticsData?.orderStatusBreakdown || [];

  const getGrowthIcon = (growth: number) =>
    growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );

  const getGrowthColor = (growth: number) =>
    growth >= 0 ? "text-green-600" : "text-red-600";

  if (error) {
    return (
      <DashboardLayout title="Sales Analytics">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load sales data</p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sales Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sales Analytics
            </h1>
            <p className="text-gray-600">
              Track your sales performance and revenue metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metrics?.totalRevenue || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      {getGrowthIcon(metrics?.revenueGrowth || 0)}
                      <span
                        className={`text-sm font-medium ml-1 ${getGrowthColor(metrics?.revenueGrowth || 0)}`}
                      >
                        {metrics?.revenueGrowth && metrics.revenueGrowth > 0
                          ? "+"
                          : ""}
                        {metrics?.revenueGrowth?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(metrics?.totalOrders || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      {getGrowthIcon(metrics?.orderGrowth || 0)}
                      <span
                        className={`text-sm font-medium ml-1 ${getGrowthColor(metrics?.orderGrowth || 0)}`}
                      >
                        {metrics?.orderGrowth && metrics.orderGrowth > 0
                          ? "+"
                          : ""}
                        {metrics?.orderGrowth?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Customers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(metrics?.totalCustomers || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      {getGrowthIcon(metrics?.customerGrowth || 0)}
                      <span
                        className={`text-sm font-medium ml-1 ${getGrowthColor(metrics?.customerGrowth || 0)}`}
                      >
                        {metrics?.customerGrowth && metrics.customerGrowth > 0
                          ? "+"
                          : ""}
                        {metrics?.customerGrowth?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metrics?.averageOrderValue || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium ml-1 text-gray-600">
                        {metrics?.conversionRate?.toFixed(1)}% conversion
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Analytics Chart - Revenue & Orders */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sales Analytics
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Orders</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      yAxisId="revenue"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="orders"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <Legend />
                    <Bar
                      yAxisId="revenue"
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Revenue"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      yAxisId="orders"
                      type="monotone"
                      dataKey="orders"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Orders"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              {/* Online Store Sessions Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Online Store Sessions
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sessions</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conversion Funnel & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Conversion Funnel
                  </h3>
                  <span className="text-sm text-gray-600">
                    Session to purchase journey
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Funnel
                      dataKey="value"
                      data={conversionFunnel}
                      isAnimationActive
                    >
                      <LabelList
                        position="center"
                        fill="#fff"
                        fontSize={12}
                        dataKey="conversion"
                        formatter={(value) =>
                          `${Number(value || 0).toFixed(1)}%`
                        }
                      />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Add to Cart: {metrics?.addToCartRate?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Checkout: {metrics?.checkoutRate?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Abandoned:{" "}
                      {(metrics?.abandonedCarts || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Draft Orders:{" "}
                      {(metrics?.draftOrders || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Status Distribution
                  </h3>
                  <span className="text-sm text-gray-600">
                    Current order breakdown
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={orderStatusBreakdown.map((s) => ({
                        ...s,
                        name: s.status,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {orderStatusBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [String(value), "Orders"]} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Total Orders & Average Order Value */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Orders Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Total Orders Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <Bar
                      dataKey="orders"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              {/* Average Order Value Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Average Order Value
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">AOV</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      formatter={(value) => [
                        formatCurrency(Number(value) || 0),
                        "AOV",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageOrderValue"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Performing Products
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Products
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Sales
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Revenue
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product.sales}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatCurrency(product.revenue)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getGrowthIcon(product.growth)}
                            <span
                              className={`text-sm font-medium ml-1 ${getGrowthColor(product.growth)}`}
                            >
                              {product.growth > 0 ? "+" : ""}
                              {product.growth.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conversion Rate Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Conversion Rate Trend
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Conversion Rate (%)
                  </span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {salesTrend.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className="bg-purple-500 rounded-t w-8 transition-all duration-300 hover:bg-purple-600"
                      style={{
                        height: `${Math.min((data.conversion / 5) * 200, 200)}px`,
                      }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {new Date(data.period).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {data.conversion.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
