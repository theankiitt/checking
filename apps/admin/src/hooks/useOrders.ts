"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Order, OrderStats } from "@/utils/orderService";

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: OrderStats;
}

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
    queryFn: async () => {
      const response = await apiClient.get<OrdersResponse>("/orders", {
        page: params.page,
        limit: params.limit,
        status: params.status,
        paymentStatus: params.paymentStatus,
        search: params.search,
      });
      return response;
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: async () => {
      const response = await apiClient.get<{ order: Order }>(
        `/orders/${orderId}`,
      );
      return response.order;
    },
    enabled: !!orderId,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["admin", "orders", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<OrderStats>("/orders/stats");
      return response;
    },
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ["admin", "orders", "recent", limit],
    queryFn: async () => {
      const response = await apiClient.get<Order[]>(
        `/orders/recent?limit=${limit}`,
      );
      return response;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: {
        status?: string;
        paymentStatus?: string;
        shippingStatus?: string;
      };
    }) => {
      const response = await apiClient.patch<{ order: Order }>(
        `/orders/${orderId}/status`,
        data,
      );
      return response.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
