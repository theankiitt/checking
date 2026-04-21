"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Product } from "@/shared/types";

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  country?: string;
}

interface GetProductParams {
  country?: string;
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

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>("/products", {
        page: params.page,
        limit: params.limit,
        category: params.category,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        search: params.search,
        sort: params.sort,
        country: params.country,
      });
      return response;
    },
  });
}

export function useProduct(productId: string, params: GetProductParams = {}) {
  return useQuery({
    queryKey: ["product", productId, params],
    queryFn: async () => {
      const response = await apiClient.get<{ product: Product }>(
        `/products/${productId}`,
        {
          country: params.country,
        },
      );
      return response.product;
    },
    enabled: !!productId,
  });
}

export function useProductBySlug(slug: string, params: GetProductParams = {}) {
  return useQuery({
    queryKey: ["product", "slug", slug, params],
    queryFn: async () => {
      const response = await apiClient.get<{ product: Product }>(
        `/products/slug/${slug}`,
        {
          country: params.country,
        },
      );
      return response.product;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit: number = 6, country?: string) {
  return useQuery({
    queryKey: ["products", "featured", limit, country],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/featured",
        {
          limit,
          country,
        },
      );
      return response.products;
    },
  });
}

export function useBestSellerProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "best-sellers", limit, country],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/best-sellers",
        {
          limit,
          country,
        },
      );
      return response.products;
    },
  });
}

export function useNewArrivalProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "new-arrivals", limit, country],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/new-arrivals",
        {
          limit,
          country,
        },
      );
      return response.products;
    },
  });
}

export function useOnSaleProducts(limit: number = 8, country?: string) {
  return useQuery({
    queryKey: ["products", "on-sale", limit, country],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        "/products/on-sale",
        {
          limit,
          country,
        },
      );
      return response.products;
    },
  });
}

export function useRelatedProducts(
  productId: string,
  limit: number = 6,
  country?: string,
) {
  return useQuery({
    queryKey: ["products", "related", productId, limit, country],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        `/products/${productId}/related`,
        {
          limit,
          country,
        },
      );
      return response.products;
    },
    enabled: !!productId,
  });
}

export function useSearchProducts(
  query: string,
  params: Omit<GetProductsParams, "search"> = {},
) {
  return useQuery({
    queryKey: ["products", "search", query, params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>("/products", {
        ...params,
        search: query,
      });
      return response;
    },
    enabled: query.length > 0,
  });
}

export function useProductsByCategory(
  categoryId: string,
  params: Omit<GetProductsParams, "category"> = {},
) {
  return useQuery({
    queryKey: ["products", "category", categoryId, params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>(
        `/products/category/${categoryId}`,
        params,
      );
      return response;
    },
    enabled: !!categoryId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
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
    }) => {
      if (reviewData.images && reviewData.images.length > 0) {
        const formData = new FormData();
        formData.append("rating", String(reviewData.rating));
        if (reviewData.title) {
          formData.append("title", reviewData.title);
        }
        formData.append("comment", reviewData.comment);
        reviewData.images.forEach((image: File) => {
          formData.append("images", image);
        });
        const response = await apiClient.postFormData<{ review: any }>(
          `/products/${productId}/reviews`,
          formData,
        );
        return response;
      } else {
        const response = await apiClient.post<{ review: any }>(
          `/products/${productId}/reviews`,
          {
            rating: reviewData.rating,
            title: reviewData.title || null,
            comment: reviewData.comment,
          },
        );
        return response;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
}
