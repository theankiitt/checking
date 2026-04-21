import { apiClient } from "@/lib/api/client";
import { Order, OrderStats } from "@/shared/types";

export const orderApi = {
  getMyOrders: async (
    params: { page?: number; limit?: number; status?: string } = {},
  ): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get<{
      orders: Order[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/orders/my-orders", {
      page: params.page,
      limit: params.limit,
      status: params.status,
    });
    return response;
  },

  getMyOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<{ order: Order }>(
      `/orders/my-orders/${orderId}`,
    );
    return response.order;
  },

  getOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<{ data: OrderStats }>("/orders/stats");
    return response.data;
  },
};
