"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { adminApiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface UseCategoriesResult {
  categories: Category[];
}

export function useCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const response =
        await adminApiClient.get<UseCategoriesResult>("/categories");
      return response.categories;
    },
    select: (data) => data.filter((cat) => cat.isActive),
  });
}

export function useAllCategories() {
  return useQuery<UseCategoriesResult>({
    queryKey: ["admin", "categories", "all"],
    queryFn: async () => {
      const response =
        await adminApiClient.get<UseCategoriesResult>("/categories");
      return response;
    },
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["admin", "categories", "tree"],
    queryFn: async () => {
      const response = await adminApiClient.get<{ categories: Category[] }>(
        "/categories/tree",
      );
      return response.categories;
    },
  });
}

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: ["admin", "category", categoryId],
    queryFn: async () => {
      const response = await adminApiClient.get<{ category: Category }>(
        `/categories/${categoryId}`,
      );
      return response.category;
    },
    enabled: !!categoryId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await adminApiClient.post<{ category: Category }>(
        "/categories",
        data,
      );
      return response.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Category>;
    }) => {
      const response = await adminApiClient.patch<{ category: Category }>(
        `/categories/${id}`,
        data,
      );
      return response.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ["admin", "categories", "stats"],
    queryFn: async () => {
      const response = await adminApiClient.get<{
        total: number;
        active: number;
        inactive: number;
      }>("/categories/stats");
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}
