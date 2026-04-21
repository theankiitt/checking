import { apiClient } from "@/lib/api/client";

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderTracking {
  order: Order;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    status: string;
    estimatedDelivery?: string;
    updates?: Array<{
      timestamp: string;
      status: string;
      location?: string;
      description?: string;
    }>;
  };
}

export async function trackOrder(
  orderNumber: string,
): Promise<OrderTracking | null> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: {
        order?: Order;
        tracking?: OrderTracking["tracking"];
      };
    }>(`/api/v1/orders/${orderNumber}`);

    if (!data.success || !data.data?.order) {
      return null;
    }

    return {
      order: data.data.order,
      tracking: data.data.tracking,
    };
  } catch (error) {
    return null;
  }
}
