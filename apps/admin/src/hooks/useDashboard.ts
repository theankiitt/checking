"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { DashboardStats, ChartData } from "@/shared/types";

export type { DashboardStats, ChartData };

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>("/dashboard/stats");
      return response;
    },
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardChartData(period: number = 14) {
  return useQuery({
    queryKey: ["admin", "dashboard", "chart", period],
    queryFn: async () => {
      const response = await apiClient.get<ChartData>("/dashboard/chart", {
        period,
      });
      return response;
    },
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return {
    refreshStats: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      }),
    refreshChart: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "chart"],
      }),
    refreshAll: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "chart"],
      });
    },
  };
}
