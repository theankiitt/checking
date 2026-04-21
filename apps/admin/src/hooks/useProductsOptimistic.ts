"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

export interface Product {
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

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    nextCursor?: string;
  };
}

export function useProductsInfinite(
  params: {
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {},
) {
  return useInfiniteQuery({
    queryKey: ["admin", "products", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const response = await adminApiClient.get<ProductsResponse>("/products", {
        ...params,
        cursor: pageParam,
        limit: params.limit || 10,
      });
      return response;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.nextCursor) return undefined;
      return lastPage.pagination.nextCursor;
    },
  });
}

export function useCreateProductOptimistic() {
  const queryClient = useQueryClient();

  return {
    mutationFn: async (data: Partial<Product>) => {
      const response = await adminApiClient.post<{ product: Product }>(
        "/products",
        data,
      );
      return response.product;
    },
    onMutate: async (newProduct: Partial<Product>) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });

      const previousData = queryClient.getQueriesData({
        queryKey: ["admin", "products"],
      });

      const optimisticProduct: Product = {
        id: `temp-${Date.now()}`,
        name: newProduct.name || "",
        slug: newProduct.slug || "",
        price: newProduct.price || "",
        isActive: true,
        isFeatured: false,
        isNew: true,
        isOnSale: false,
        isBestSeller: false,
        ...newProduct,
      };

      queryClient.setQueriesData(
        { queryKey: ["admin", "products"] },
        (old: any) => {
          if (!old) return old;
          if ("pages" in old) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                products: [optimisticProduct, ...page.products],
                pagination: {
                  ...page.pagination,
                  total: page.pagination.total + 1,
                },
              })),
            };
          }
          return {
            ...old,
            products: [optimisticProduct, ...old.products],
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        },
      );

      return { previousData };
    },
    onError: (error: any, newProduct: Partial<Product>, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [string, any]) => {
          queryClient.setQueryData([queryKey], data);
        });
      }
      toast.error(error?.message || "Failed to create product");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onSuccess: () => {
      toast.success("Product created successfully");
    },
  };
}

export function useUpdateProductOptimistic() {
  const queryClient = useQueryClient();

  return {
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      const response = await adminApiClient.patch<{ product: Product }>(
        `/products/${id}`,
        data,
      );
      return response.product;
    },
    onMutate: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });

      const previousData = queryClient.getQueriesData({
        queryKey: ["admin", "products"],
      });

      queryClient.setQueriesData(
        { queryKey: ["admin", "products"] },
        (old: any) => {
          if (!old) return old;
          if ("pages" in old) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                products: page.products.map((product: Product) =>
                  product.id === id ? { ...product, ...data } : product,
                ),
              })),
            };
          }
          return {
            ...old,
            products: old.products.map((product: Product) =>
              product.id === id ? { ...product, ...data } : product,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (error: any, variables: any, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [string, any]) => {
          queryClient.setQueryData([queryKey], data);
        });
      }
      toast.error(error?.message || "Failed to update product");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
  };
}

export function useDeleteProductOptimistic() {
  const queryClient = useQueryClient();

  return {
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/products/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "products"] });

      const previousData = queryClient.getQueriesData({
        queryKey: ["admin", "products"],
      });

      queryClient.setQueriesData(
        { queryKey: ["admin", "products"] },
        (old: any) => {
          if (!old) return old;
          if ("pages" in old) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                products: page.products.filter(
                  (product: Product) => product.id !== id,
                ),
                pagination: {
                  ...page.pagination,
                  total: page.pagination.total - 1,
                },
              })),
            };
          }
          return {
            ...old,
            products: old.products.filter(
              (product: Product) => product.id !== id,
            ),
            pagination: {
              ...old.pagination,
              total: old.pagination.total - 1,
            },
          };
        },
      );

      return { previousData };
    },
    onError: (error: any, id: string, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [string, any]) => {
          queryClient.setQueryData([queryKey], data);
        });
      }
      toast.error(error?.message || "Failed to delete product");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
  };
}

export function usePrefetchProducts() {
  const queryClient = useQueryClient();

  return {
    prefetchProducts: (params: any = {}) => {
      queryClient.prefetchQuery({
        queryKey: ["admin", "products", params],
        queryFn: () =>
          adminApiClient.get<ProductsResponse>("/products", {
            ...params,
            limit: 10,
          }),
        staleTime: 60 * 1000,
      });
    },
    prefetchProduct: (productId: string) => {
      queryClient.prefetchQuery({
        queryKey: ["admin", "product", productId],
        queryFn: () =>
          adminApiClient.get<{ product: Product }>(`/products/${productId}`),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchNextPage: (currentData: any, params: any = {}) => {
      if (!currentData?.pagination?.nextCursor) return;

      queryClient.prefetchInfiniteQuery({
        queryKey: ["admin", "products", "infinite", params],
        queryFn: () => Promise.resolve(currentData),
        initialPageParam: currentData.pagination.nextCursor,
        staleTime: 60 * 1000,
      });
    },
  };
}
