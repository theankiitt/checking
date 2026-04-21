import { apiClient } from "@/lib/api/client";
import { Cart, CartItem } from "@/shared/types";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>("/cart");
    return response;
  },

  addToCart: async (
    productId: string,
    quantity: number = 1,
  ): Promise<{ cartItem: CartItem }> => {
    const response = await apiClient.post<{ cartItem: CartItem }>("/cart", {
      productId,
      quantity,
    });
    return response;
  },

  updateCartItem: async (
    itemId: string,
    quantity: number,
  ): Promise<{ cartItem: CartItem }> => {
    const response = await apiClient.patch<{ cartItem: CartItem }>(
      `/cart/${itemId}`,
      { quantity },
    );
    return response;
  },

  removeFromCart: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },
};
