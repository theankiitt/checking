"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  images?: string[];
  thumbnail?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  currencyPrices?: Array<{
    country: string;
    price: string;
    comparePrice?: string;
  }>;
  _count?: {
    reviews: number;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useProducts(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>("/products", {
        page: params.page,
        limit: params.limit,
        category: params.category,
        brand: params.brand,
        search: params.search,
        isActive: params.isActive,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });
      return response;
    },
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: async () => {
      const response = await apiClient.get<{ product: Product }>(
        `/products/${productId}`,
      );
      return response.product;
    },
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const response = await apiClient.post<{ product: Product }>(
        "/products",
        data,
      );
      return response.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const response = await apiClient.patch<{ product: Product }>(
        `/products/${id}`,
        data,
      );
      return response.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["admin", "products", "featured", limit],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/featured",
        { limit },
      );
      return response.products;
    },
  });
}

export function useBestSellerProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["admin", "products", "best-sellers", limit],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/best-sellers",
        { limit },
      );
      return response.products;
    },
  });
}
