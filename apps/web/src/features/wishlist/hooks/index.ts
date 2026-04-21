"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../api";

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
