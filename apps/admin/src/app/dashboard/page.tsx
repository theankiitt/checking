"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  RefreshCcw,
} from "lucide-react";
import {
  SalesOverviewChart,
  OrdersChart,
  TotalSalesRevenueChart,
  RevenueBreakdownChart,
} from "@/components/charts/SalesOverviewChart";
import { manrope } from "@/lib/fonts";
import {
  useDashboardOverview,
  useRecentOrders,
  useTopProducts,
  useSalesChartData,
  useRevenueBreakdown,
  useOrdersChartData,
} from "@/features/dashboard/hooks";
import {
  StatsGridSkeleton,
  RecentOrdersTableSkeleton,
  TopProductsListSkeleton,
  ChartSkeleton,
} from "@/features/dashboard/components/Skeletons";

const QUICK_ACTIONS = [
  {
    icon: Package,
    label: "Products",
    href: "/dashboard/products",
    color: "bg-orange-600",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/dashboard/orders",
    color: "bg-orange-500",
  },
  {
    icon: Users,
    label: "Customers",
    href: "/dashboard/customers",
    color: "bg-orange-400",
  },
  {
    icon: DollarSign,
    label: "Sales",
    href: "/dashboard/discounts",
    color: "bg-orange-300",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/dashboard/analytics",
    color: "bg-orange-200",
  },
];

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  delivered: CheckCircle,
  processing: Clock,
  shipped: Truck,
  pending: RefreshCcw,
  cancelled: XCircle,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Fetch all data from API
  const { data: stats, isLoading: statsLoading } = useDashboardOverview(selectedPeriod);
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(5);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(4);
  const { data: salesChartData, isLoading: salesChartLoading } = useSalesChartData(selectedPeriod);
  const { data: revenueBreakdown, isLoading: revenueLoading } = useRevenueBreakdown();
  const { data: ordersChartData, isLoading: ordersChartLoading } = useOrdersChartData(selectedPeriod);

  const isLoading = statsLoading || ordersLoading || productsLoading;

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          <PageHeader
            title="Dashboard"
            description="Welcome back! Here's what's happening with your store."
          />

          {/* Time Period Selector */}
          <div className="flex gap-2">
            {["24h", "7d", "30d", "90d"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <StatsGridSkeleton />
          ) : stats ? (
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${manrope.className}`}>
              {[
                {
                  label: "Total Revenue",
                  value: formatCurrency(stats.totalRevenue),
                  change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
                  trend: stats.revenueChange >= 0 ? "up" : "down",
                  icon: DollarSign,
                  color: "bg-orange-600",
                },
                {
                  label: "Total Orders",
                  value: formatNumber(stats.totalOrders),
                  change: `${stats.ordersChange >= 0 ? "+" : ""}${stats.ordersChange}%`,
                  trend: stats.ordersChange >= 0 ? "up" : "down",
                  icon: ShoppingCart,
                  color: "bg-orange-500",
                },
                {
                  label: "New Customers",
                  value: formatNumber(stats.newCustomers),
                  change: `${stats.customersChange >= 0 ? "+" : ""}${stats.customersChange}%`,
                  trend: stats.customersChange >= 0 ? "up" : "down",
                  icon: Users,
                  color: "bg-orange-400",
                },
                {
                  label: "Low Stock",
                  value: formatNumber(stats.lowStock),
                  change: `${stats.stockChange >= 0 ? "+" : ""}${stats.stockChange}%`,
                  trend: stats.stockChange >= 0 ? "up" : "down",
                  icon: Package,
                  color: "bg-orange-300",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {salesChartLoading ? (
              <ChartSkeleton />
            ) : (
              <TotalSalesRevenueChart data={salesChartData} />
            )}
            {revenueLoading ? (
              <ChartSkeleton />
            ) : (
              <RevenueBreakdownChart data={revenueBreakdown} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {salesChartLoading ? (
              <ChartSkeleton />
            ) : (
              <SalesOverviewChart data={salesChartData} variant="area" />
            )}
            {ordersChartLoading ? (
              <ChartSkeleton />
            ) : (
              <OrdersChart data={ordersChartData} />
            )}
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                <Link href="/dashboard/orders" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              {ordersLoading ? (
                <div className="p-4">
                  <RecentOrdersTableSkeleton />
                </div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => {
                        const StatusIcon = STATUS_ICONS[order.status.toLowerCase()] || Clock;
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No recent orders</div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Top Products</h3>
                <Link href="/dashboard/products" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              {productsLoading ? (
                <div className="p-4">
                  <TopProductsListSkeleton />
                </div>
              ) : topProducts && topProducts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                        {product.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{product.sales} sales</span>
                        <span className="font-medium text-gray-900">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No products found</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer text-center">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
