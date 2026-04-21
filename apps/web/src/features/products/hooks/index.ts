"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api";
import type { ProductFilters, ProductResponse } from "../types";
import { Product, Review, ReviewStats } from "@/shared/types";

export function useProducts(params: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => productApi.getProducts(params),
  });
}

export function useProduct(
  productId: string,
  params: { country?: string } = {},
) {
  return useQuery({
    queryKey: ["products", productId, params],
    queryFn: () => productApi.getProduct(productId, params),
    enabled: !!productId,
  });
}

export function useProductBySlug(
  slug: string,
  params: { country?: string } = {},
) {
  return useQuery({
    queryKey: ["products", "slug", slug, params],
    queryFn: () => productApi.getProductBySlug(slug, params),
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit: number = 6, country?: string) {
  return useQuery({
    queryKey: ["products", "featured", limit, country],
    queryFn: () => productApi.getFeaturedProducts(limit, country),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBestSellerProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "best-sellers", limit, country],
    queryFn: () => productApi.getBestSellerProducts(limit, country),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivalProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "new-arrivals", limit, country],
    queryFn: () => productApi.getNewArrivalProducts(limit, country),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOnSaleProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "on-sale", limit, country],
    queryFn: () => productApi.getOnSaleProducts(limit, country),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedProducts(
  productId: string,
  limit: number = 6,
  country?: string,
) {
  return useQuery({
    queryKey: ["products", "related", productId, limit, country],
    queryFn: () => productApi.getRelatedProducts(productId, limit, country),
    enabled: !!productId,
  });
}

export function useProductsByCategory(
  categoryId: string,
  params: ProductFilters = {},
) {
  return useQuery({
    queryKey: ["products", "category", categoryId, params],
    queryFn: () => productApi.getProductsByCategory(categoryId, params),
    enabled: !!categoryId,
  });
}

export function useProductReviews(
  productId: string,
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: ["products", productId, "reviews", params],
    queryFn: () => productApi.getProductReviews(productId, params),
    enabled: !!productId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewData,
    }: {
      productId: string;
      reviewData: {
        rating: number;
        title?: string;
        comment: string;
        images?: File[];
      };
    }) => productApi.submitReview(productId, reviewData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId, "reviews"],
      });
    },
  });
}
