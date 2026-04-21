import { apiClient } from "@/lib/api/client";
import { Product, Review, ReviewStats } from "@/shared/types";
import type { ProductFilters, ProductResponse } from "../types";

export const productApi = {
  getProducts: async (
    params: ProductFilters = {},
  ): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>("/products", {
      page: params.page,
      limit: params.limit,
      category: params.category,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      sort: params.sortBy as
        | "price_asc"
        | "price_desc"
        | "rating"
        | "newest"
        | undefined,
      country: params.country,
    });
    return response;
  },

  getProduct: async (
    productId: string,
    params: { country?: string } = {},
  ): Promise<Product> => {
    const response = await apiClient.get<{ product: Product }>(
      `/products/${productId}`,
      {
        country: params.country,
      },
    );
    return response.product;
  },

  getProductBySlug: async (
    slug: string,
    params: { country?: string } = {},
  ): Promise<Product> => {
    const response = await apiClient.get<{ product: Product }>(
      `/products/slug/${slug}`,
      {
        country: params.country,
      },
    );
    return response.product;
  },

  getFeaturedProducts: async (
    limit: number = 6,
    country?: string,
  ): Promise<Product[]> => {
    const response = await apiClient.get<{ products: Product[] }>(
      "/products/featured",
      {
        limit,
        country,
      },
    );
    return response.products;
  },

  getBestSellerProducts: async (
    limit: number = 8,
    country?: string,
  ): Promise<Product[]> => {
    const response = await apiClient.get<{ products: Product[] }>(
      "/products/best-sellers",
      {
        limit,
        country,
      },
    );
    return response.products;
  },

  getNewArrivalProducts: async (
    limit: number = 8,
    country?: string,
  ): Promise<Product[]> => {
    const response = await apiClient.get<{ products: Product[] }>(
      "/products/new-arrivals",
      {
        limit,
        country,
      },
    );
    return response.products;
  },

  getOnSaleProducts: async (
    limit: number = 8,
    country?: string,
  ): Promise<Product[]> => {
    const response = await apiClient.get<{ products: Product[] }>(
      "/products/on-sale",
      {
        limit,
        country,
      },
    );
    return response.products;
  },

  getRelatedProducts: async (
    productId: string,
    limit: number = 6,
    country?: string,
  ): Promise<Product[]> => {
    const response = await apiClient.get<{ products: Product[] }>(
      `/products/${productId}/related`,
      {
        limit,
        country,
      },
    );
    return response.products;
  },

  getProductsByCategory: async (
    categoryId: string,
    params: ProductFilters = {},
  ): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>(
      `/products/category/${categoryId}`,
      {
        page: params.page,
        limit: params.limit,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        search: params.search,
        sort: params.sortBy as
          | "price_asc"
          | "price_desc"
          | "rating"
          | "newest"
          | undefined,
        country: params.country,
      },
    );
    return response;
  },

  submitReview: async (
    productId: string,
    reviewData: {
      rating: number;
      title?: string;
      comment: string;
      images?: File[];
    },
  ): Promise<Review> => {
    if (reviewData.images && reviewData.images.length > 0) {
      const formData = new FormData();
      formData.append("rating", String(reviewData.rating));
      if (reviewData.title) formData.append("title", reviewData.title);
      formData.append("comment", reviewData.comment);
      reviewData.images.forEach((image) => formData.append("images", image));
      const response = await apiClient.postFormData<{ review: Review }>(
        `/products/${productId}/reviews`,
        formData,
      );
      return response.review;
    }
    const response = await apiClient.post<{ review: Review }>(
      `/products/${productId}/reviews`,
      {
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment,
      },
    );
    return response.review;
  },

  getProductReviews: async (
    productId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<{ reviews: Review[]; stats: ReviewStats }> => {
    const response = await apiClient.get<{
      reviews: Review[];
      stats: ReviewStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/reviews/product/${productId}`, {
      page: params.page,
      limit: params.limit,
    });
    return { reviews: response.reviews, stats: response.stats };
  },
};
