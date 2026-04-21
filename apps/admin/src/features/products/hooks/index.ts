"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api";

export function useProducts(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isActive?: boolean;
  } = {},
) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export { useProductMutations } from "./useProductMutations";
