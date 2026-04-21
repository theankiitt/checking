"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api";

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
    queryFn: () => reviewApi.getReviews(params),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      isActive,
    }: {
      reviewId: string;
      isActive: boolean;
    }) => reviewApi.updateReviewStatus(reviewId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}
