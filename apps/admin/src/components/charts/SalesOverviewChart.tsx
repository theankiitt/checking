"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
} from "recharts";

interface ChartDataPoint {
  name?: string;
  label?: string;
  [key: string]: any;
}

interface SalesOverviewChartProps {
  data?: ChartDataPoint[];
  variant?: "line" | "area" | "bar";
}

interface OrdersChartProps {
  data?: ChartDataPoint[];
}

interface TotalSalesRevenueChartProps {
  data?: ChartDataPoint[];
}

interface RevenueBreakdownChartProps {
  data?: Array<{ name: string; value: number; color?: string }>;
}

const COLORS = ["#EA580C", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

export function SalesOverviewChart({
  data,
  variant = "area",
}: SalesOverviewChartProps) {
  const ChartComponent =
    variant === "bar" ? BarChart : variant === "line" ? LineChart : AreaChart;
  const DataComponent =
    variant === "bar" ? Bar : variant === "line" ? Line : Area;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          <div className="text-gray-400 text-sm z-10">No sales data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-500">
            Revenue vs Sales (last 7 months)
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EA580C]" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FB923C]" />
            <span className="text-xs text-gray-500">Sales</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <DataComponent
              type="monotone"
              dataKey="revenue"
              stroke="#EA580C"
              fill="#EA580C"
              fillOpacity={variant === "area" ? 0.3 : 1}
              strokeWidth={2}
            />
            <DataComponent
              type="monotone"
              dataKey="sales"
              stroke="#FB923C"
              fill="#FB923C"
              fillOpacity={variant === "area" ? 0.3 : 1}
              strokeWidth={2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OrdersChart({ data }: OrdersChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-72 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          <div className="text-gray-400 text-sm z-10">No orders data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Orders</h3>
          <p className="text-sm text-gray-500">Orders per day (this week)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FB923C]" />
          <span className="text-xs text-gray-500">Orders</span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="orders" fill="#FB923C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TotalSalesRevenueChart({ data }: TotalSalesRevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            {["Revenue ($)", "Orders", "Profit ($)"].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          <div className="text-gray-400 text-sm z-10">No revenue data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Total Sales & Revenue
          </h3>
          <p className="text-sm text-gray-500">Weekly performance metrics</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C2410C]" />
            <span className="text-xs text-gray-500">Revenue ($)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FB923C]" />
            <span className="text-xs text-gray-500">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FED7AA]" />
            <span className="text-xs text-gray-500">Profit ($)</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              fill="#C2410C"
              fillOpacity={0.2}
              stroke="#C2410C"
              strokeWidth={2}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              fill="#FB923C"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke="#FED7AA"
              strokeWidth={2}
              dot={{ fill: "#FED7AA" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-gray-200 rounded-full animate-pulse overflow-hidden" />
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue by Category
        </h3>
        <p className="text-sm text-gray-500">
          Sales distribution across categories
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-4">
            <span className="w-24 text-sm text-gray-600">{item.name}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color || COLORS[index % COLORS.length],
                }}
              />
            </div>
            <span className="w-12 text-sm font-medium text-gray-900 text-right">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
