"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  subtotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount: string;
  totalAmount: string;
  currency: string;
  currencySymbol: string;
  createdAt: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: string;
    product?: {
      name: string;
      thumbnail?: string;
    };
  }>;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
}

export function useOrders(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await apiClient.get<OrdersResponse>("/orders", {
        page: params.page,
        limit: params.limit,
        status: params.status,
        search: params.search,
      });
      return response;
    },
  });
}

export function useMyOrders(
  params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["orders", "my-orders", params],
    queryFn: async () => {
      const response = await apiClient.get<OrdersResponse>(
        "/orders/my-orders",
        {
          page: params.page,
          limit: params.limit,
          status: params.status,
        },
      );
      return response;
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await apiClient.get<{ order: Order }>(
        `/orders/${orderId}`,
      );
      return response.order;
    },
    enabled: !!orderId,
  });
}

export function useMyOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", "my", orderId],
    queryFn: async () => {
      const response = await apiClient.get<{ order: Order }>(
        `/orders/my-orders/${orderId}`,
      );
      return response.order;
    },
    enabled: !!orderId,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: OrderStats }>(
        "/orders/stats",
      );
      return response.data;
    },
  });
}
