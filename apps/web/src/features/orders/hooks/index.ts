"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../api";

export function useMyOrders(
  params: { page?: number; limit?: number; status?: string } = {},
) {
  return useQuery({
    queryKey: ["orders", "my-orders", params],
    queryFn: () => orderApi.getMyOrders(params),
  });
}

export function useMyOrder(orderId: string) {
  return useQuery({
    queryKey: ["orders", "my-order", orderId],
    queryFn: () => orderApi.getMyOrder(orderId),
    enabled: !!orderId,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: orderApi.getOrderStats,
    staleTime: 60 * 1000,
  });
}
