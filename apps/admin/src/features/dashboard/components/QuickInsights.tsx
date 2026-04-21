"use client";

import { TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { QuickInsightSkeleton } from "./Skeletons";
import type {
  DashboardStats,
  TopProduct,
  RecentOrderInfo,
} from "@/shared/types";
import { formatCurrency } from "@/utils/currency";

interface QuickInsightsProps {
  data?: DashboardStats;
  isLoading: boolean;
}

export function QuickInsights({ data, isLoading }: QuickInsightsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <QuickInsightSkeleton key={i} />
        ))}
      </div>
    );
  }

  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Top Products
        </h3>
        {topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts
              .slice(0, 3)
              .map((product: TopProduct, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 custom-font truncate flex-1 mr-2">
                    {product.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 custom-font whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 custom-font">No products found</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Low Stock
        </h3>
        {topProducts.filter((p: TopProduct) => p.stock <= 5).length > 0 ? (
          <div className="space-y-3">
            {topProducts
              .filter((p: TopProduct) => p.stock <= 5)
              .slice(0, 3)
              .map((product: TopProduct, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 custom-font truncate flex-1 mr-2">
                    {product.name}
                  </span>
                  <span className="text-sm font-medium text-orange-600 custom-font whitespace-nowrap">
                    {product.stock} left
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 custom-font">All products in stock</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Pending Orders
        </h3>
        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.slice(0, 3).map((order: RecentOrderInfo) => (
              <div key={order.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 custom-font">
                  {order.orderNumber}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "PROCESSING"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "SHIPPED"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 custom-font">No pending orders</p>
        )}
      </div>
    </div>
  );
}
