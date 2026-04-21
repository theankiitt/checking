import { apiClient } from "@/shared/api/client";
import { Order, OrderStats } from "@/shared/types";

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: OrderStats;
}

export async function getOrders(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  } = {},
): Promise<OrdersResponse> {
  return apiClient.get<OrdersResponse>("/orders", {
    page: params.page,
    limit: params.limit,
    status: params.status,
    paymentStatus: params.paymentStatus,
    search: params.search,
  });
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await apiClient.get<{ order: Order }>(`/orders/${orderId}`);
  return response.order;
}

export async function updateOrderStatus(
  orderId: string,
  data: { status?: string; paymentStatus?: string; shippingStatus?: string },
): Promise<Order> {
  const response = await apiClient.patch<{ order: Order }>(
    `/orders/${orderId}/status`,
    data,
  );
  return response.order;
}

export async function getOrderStats(): Promise<OrderStats> {
  return apiClient.get<OrderStats>("/orders/stats");
}

export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
  return apiClient.get<Order[]>(`/orders/recent?limit=${limit}`);
}
