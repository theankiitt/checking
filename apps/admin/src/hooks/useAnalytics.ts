"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type {
  WebsiteAnalyticsData,
  SalesAnalyticsData,
  AnalyticsOverview,
  TrafficData,
  VisitorData,
  RevenueData,
  DeviceData,
  TrafficSourceData,
  TopPage,
  SalesData,
  SalesMetrics,
  TopSellingProduct,
  ConversionFunnel,
  OrderStatusBreakdown,
} from "@/shared/types";

export type {
  WebsiteAnalyticsData,
  SalesAnalyticsData,
  AnalyticsOverview,
  TrafficData,
  VisitorData,
  RevenueData,
  DeviceData,
  TrafficSourceData,
  TopPage,
  SalesData,
  SalesMetrics,
  TopSellingProduct,
  ConversionFunnel,
  OrderStatusBreakdown,
};

export function useWebsiteAnalytics(period: string = "30days") {
  return useQuery<WebsiteAnalyticsData>({
    queryKey: ["admin", "analytics", "website", period],
    queryFn: async () => {
      const response = await apiClient.get<WebsiteAnalyticsData>(
        "/analytics/website",
        {
          period,
        },
      );
      return response;
    },
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useSalesAnalytics(period: string = "30d") {
  return useQuery<SalesAnalyticsData>({
    queryKey: ["admin", "analytics", "sales", period],
    queryFn: async () => {
      const response = await apiClient.get<SalesAnalyticsData>(
        "/analytics/sales",
        {
          period,
        },
      );
      return response;
    },
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useRefreshAnalytics() {
  const queryClient = useQueryClient();

  return {
    refreshWebsite: (period?: string) =>
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "website"],
      }),
    refreshSales: (period?: string) =>
      queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "sales"],
      }),
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  };
}
