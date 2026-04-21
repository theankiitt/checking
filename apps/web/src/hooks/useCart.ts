"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail?: string;
    images?: string[];
    currencyPrices?: Array<{
      price: string;
      country: string;
    }>;
  };
}

interface CartResponse {
  items: CartItem[];
  itemCount: number;
  total: number;
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await apiClient.get<CartResponse>("/cart");
      return response;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const response = await apiClient.post<{ cartItem: CartItem }>("/cart", {
        productId,
        quantity,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const response = await apiClient.patch<{ cartItem: CartItem }>(
        `/cart/${itemId}`,
        {
          quantity,
        },
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      await apiClient.delete(`/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete("/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
