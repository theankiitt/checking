import { apiClient } from "@/shared/api/client";
import { Review, ReviewStats } from "@/shared/types";

export interface ReviewsResponse {
  reviews: Review[];
  stats?: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const reviewApi = {
  getReviews: async (
    params: {
      page?: number;
      limit?: number;
      productId?: string;
      rating?: number;
      isActive?: boolean;
    } = {},
  ): Promise<ReviewsResponse> => {
    return apiClient.get<ReviewsResponse>("/reviews", {
      page: params.page,
      limit: params.limit,
      productId: params.productId,
      rating: params.rating,
      isActive: params.isActive,
    });
  },

  updateReviewStatus: async (
    reviewId: string,
    isActive: boolean,
  ): Promise<Review> => {
    const response = await apiClient.patch<{ review: Review }>(
      `/reviews/${reviewId}/status`,
      { isActive },
    );
    return response.review;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },
};
