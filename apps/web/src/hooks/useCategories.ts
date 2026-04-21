"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Category } from "@/shared/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<{ categories: Category[] }>(
        "/categories",
      );
      return response.categories;
    },
  });
}

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const response = await apiClient.get<{ category: Category }>(
        `/categories/${categoryId}`,
      );
      return response.category;
    },
    enabled: !!categoryId,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: async () => {
      const response = await apiClient.get<{ category: Category }>(
        `/categories/slug/${slug}`,
      );
      return response.category;
    },
    enabled: !!slug,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      const response = await apiClient.get<{ categories: Category[] }>(
        "/categories/tree",
      );
      return response.categories;
    },
  });
}

export function useCategoryBreadcrumbs(categoryId: string) {
  return useQuery({
    queryKey: ["categories", "breadcrumbs", categoryId],
    queryFn: async () => {
      const response = await apiClient.get<{ breadcrumbs: Category[] }>(
        `/categories/${categoryId}/breadcrumbs`,
      );
      return response.breadcrumbs;
    },
    enabled: !!categoryId,
  });
}

export function useCategoriesWithProducts(
  params: { limit?: number; country?: string } = {},
) {
  return useQuery({
    queryKey: ["categories", "with-products", params],
    queryFn: async () => {
      const response = await apiClient.get<{ categories: Category[] }>(
        "/categories/with-products",
        {
          limit: params.limit,
          country: params.country,
        },
      );
      return response.categories;
    },
  });
}
