import { apiClient } from "@/shared/api/client";

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  lowStock: number;
  stockChange: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  sales: number;
  revenue: number;
  trend: "up" | "down";
  image?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<{
      success: boolean;
      data: DashboardStats;
    }>("/dashboard/overview");
    return response.data;
  },

  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { orders: RecentOrder[] };
    }>("/orders/recent", { limit });
    return response.data.orders;
  },

  getTopProducts: async (limit: number = 5): Promise<TopProduct[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { products: TopProduct[] };
    }>("/products/top", { limit });
    return response.data.products;
  },

  getSalesChartData: async (
    period: string = "7d",
  ): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: ChartDataPoint[];
    }>("/dashboard/chart/sales", { period });
    return response.data;
  },

  getRevenueBreakdown: async (): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: ChartDataPoint[];
    }>("/dashboard/chart/revenue");
    return response.data;
  },

  getOrdersChartData: async (
    period: string = "7d",
  ): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: ChartDataPoint[];
    }>("/dashboard/chart/orders", { period });
    return response.data;
  },
};
