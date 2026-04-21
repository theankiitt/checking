"use client";

import { Clock, BarChart } from "lucide-react";
import VisitorsByCountryChart from "./VisitorsByCountryChart";
import OrdersChartComponent from "./OrdersChart";
import { ChartSkeleton } from "./Skeletons";
import type { ChartData, OrderChartItem } from "@/shared/types";

interface DashboardChartsProps {
  data?: ChartData;
  isLoading: boolean;
}

export function DashboardCharts({ data, isLoading }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  const visitorsData = data?.visitorsByCountry || [];
  const ordersData =
    data?.ordersChart?.map((d: OrderChartItem) => d.orders) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 custom-font">
              Visitors by Country
            </h3>
          </div>
          <span className="text-xs text-gray-500 custom-font">Last 7 days</span>
        </div>
        <VisitorsByCountryChart
          data={
            visitorsData.length > 0
              ? visitorsData
              : [
                  { country: "Nepal", value: 0 },
                  { country: "India", value: 0 },
                  { country: "USA", value: 0 },
                  { country: "UK", value: 0 },
                  { country: "AU", value: 0 },
                ]
          }
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 custom-font">
              Orders (Last 14 days)
            </h3>
          </div>
          <span className="text-xs text-gray-500 custom-font">
            Updated hourly
          </span>
        </div>
        <OrdersChartComponent data={ordersData.length > 0 ? ordersData : []} />
      </div>
    </div>
  );
}
