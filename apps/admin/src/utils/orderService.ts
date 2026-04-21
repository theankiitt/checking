import { apiClient } from "@/shared/api/client";

export interface Order {
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
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
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
    total: string;
    product?: {
      id: string;
      name: string;
      slug: string;
      images?: string[];
      thumbnail?: string;
    };
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
  };
  byPaymentStatus: {
    pending: number;
    paid: number;
    failed: number;
    refunded: number;
    partiallyRefunded: number;
  };
}

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

export const orderService = {
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Promise<OrdersResponse> {
    return apiClient.get<OrdersResponse>("/orders", {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
      paymentStatus: params?.paymentStatus,
      search: params?.search,
    });
  },

  async getOrder(id: string): Promise<{ order: Order }> {
    return apiClient.get<{ order: Order }>(`/orders/${id}`);
  },

  async updateOrderStatus(
    id: string,
    data: { status?: string; paymentStatus?: string; shippingStatus?: string },
  ): Promise<{ order: Order }> {
    return apiClient.patch<{ order: Order }>(`/orders/${id}/status`, data);
  },

  async getOrderStats(): Promise<OrderStats> {
    return apiClient.get<OrderStats>("/orders/stats");
  },

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return apiClient.get<Order[]>(`/orders/recent?limit=${limit}`);
  },
};

export default orderService;
