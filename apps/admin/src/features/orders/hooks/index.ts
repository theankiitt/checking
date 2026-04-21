"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrder,
  getOrderStats,
  getRecentOrders,
  updateOrderStatus,
} from "../api";

export function useOrders(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => getOrders(params),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["admin", "orders", "stats"],
    queryFn: getOrderStats,
    staleTime: 60 * 1000,
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ["admin", "orders", "recent", limit],
    queryFn: () => getRecentOrders(limit),
    staleTime: 60 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: {
        status?: string;
        paymentStatus?: string;
        shippingStatus?: string;
      };
    }) => updateOrderStatus(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
