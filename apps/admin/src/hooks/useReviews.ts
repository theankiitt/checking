"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ReviewsResponse {
  reviews: Review[];
  stats?: {
    averageRating: number;
    totalReviews: number;
    breakdown: Record<number, number>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useReviews(
  params: {
    page?: number;
    limit?: number;
    productId?: string;
    rating?: number;
    isActive?: boolean;
  } = {},
) {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => {
      const response = await apiClient.get<ReviewsResponse>("/reviews", {
        page: params.page,
        limit: params.limit,
        productId: params.productId,
        rating: params.rating,
        isActive: params.isActive,
      });
      return response;
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      isActive,
    }: {
      reviewId: string;
      isActive: boolean;
    }) => {
      const response = await apiClient.patch<{ review: Review }>(
        `/reviews/${reviewId}/status`,
        { isActive },
      );
      return response.review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      await apiClient.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}
