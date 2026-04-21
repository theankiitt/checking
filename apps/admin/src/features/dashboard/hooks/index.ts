"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";

export function useDashboardOverview(period?: string) {
  return useQuery({
    queryKey: ["dashboard", "overview", period],
    queryFn: () => dashboardApi.getOverview(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ["dashboard", "recent-orders", limit],
    queryFn: () => dashboardApi.getRecentOrders(limit),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useTopProducts(limit: number = 5) {
  return useQuery({
    queryKey: ["dashboard", "top-products", limit],
    queryFn: () => dashboardApi.getTopProducts(limit),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useSalesChartData(period: string = "7d") {
  return useQuery({
    queryKey: ["dashboard", "chart", "sales", period],
    queryFn: () => dashboardApi.getSalesChartData(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevenueBreakdown() {
  return useQuery({
    queryKey: ["dashboard", "chart", "revenue"],
    queryFn: () => dashboardApi.getRevenueBreakdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useOrdersChartData(period: string = "7d") {
  return useQuery({
    queryKey: ["dashboard", "chart", "orders", period],
    queryFn: () => dashboardApi.getOrdersChartData(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
