import prisma from "@/config/database";
import { logger } from "@/utils/logger";
import { cacheService } from "@/services/CacheService";

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface ReviewReplyInput {
  reply: string;
}

export interface ReactionInput {
  type: "LIKE" | "DISLIKE";
}

export interface ReviewListParams {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  isActive?: boolean;
  rating?: number;
}

export class ReviewService {
  async create(userId: string, input: CreateReviewInput) {
    const { productId, rating, title, comment } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        isVerified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    await this.updateProductRating(productId);

    logger.info("Review created", { reviewId: review.id, userId, productId });

    return review;
  }

  async replyToReview(
    reviewId: string,
    adminId: string,
    input: ReviewReplyInput,
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        adminReply: input.reply,
        adminRepliedAt: new Date(),
        adminReplyId: adminId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        adminReplyUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    await this.updateProductRating(review.productId);

    logger.info("Review replied by admin", { reviewId, adminId });

    return updatedReview;
  }

  async removeReply(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        adminReply: null,
        adminRepliedAt: null,
        adminReplyId: null,
      },
    });

    await this.updateProductRating(review.productId);

    logger.info("Review reply removed", { reviewId });

    return updatedReview;
  }

  async addReaction(
    userId: string,
    reviewId: string,
    type: "LIKE" | "DISLIKE",
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    const existingReaction = await prisma.reviewReaction.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        throw new Error(`You have already ${type.toLowerCase()}d this review`);
      }

      await prisma.reviewReaction.update({
        where: { userId_reviewId: { userId, reviewId } },
        data: { type },
      });

      const updateData: Record<
        string,
        { increment?: number; decrement?: number }
      > = {};
      if (type === "LIKE") {
        updateData.likeCount = { increment: 1 };
        updateData.dislikeCount = { decrement: 1 };
      } else {
        updateData.likeCount = { decrement: 1 };
        updateData.dislikeCount = { increment: 1 };
      }

      await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
      });
    } else {
      await prisma.reviewReaction.create({
        data: { userId, reviewId, type },
      });

      const updateData: Record<
        string,
        { increment?: number; decrement?: number }
      > = {};
      if (type === "LIKE") {
        updateData.likeCount = { increment: 1 };
      } else {
        updateData.dislikeCount = { increment: 1 };
      }

      await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
      });
    }

    const updatedReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { likeCount: true, dislikeCount: true },
    });

    logger.info("Review reaction added", { reviewId, userId, type });

    return updatedReview;
  }

  async removeReaction(userId: string, reviewId: string) {
    const reaction = await prisma.reviewReaction.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    await prisma.reviewReaction.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });

    const updateData: {
      likeCount?: { decrement: number };
      dislikeCount?: { decrement: number };
    } = {};
    if (reaction.type === "LIKE") {
      updateData.likeCount = { decrement: 1 };
    } else {
      updateData.dislikeCount = { decrement: 1 };
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    const updatedReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { likeCount: true, dislikeCount: true },
    });

    logger.info("Review reaction removed", { reviewId, userId });

    return updatedReview;
  }

  async getUserReaction(userId: string, reviewId: string) {
    const reaction = await prisma.reviewReaction.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    return reaction?.type || null;
  }

  async list(params: ReviewListParams) {
    const {
      page = 1,
      limit = 10,
      productId,
      userId,
      isActive = true,
      rating,
    } = params;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (isActive !== undefined) where.isActive = isActive;
    if (rating) where.rating = rating;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          adminReplyUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const stats = await prisma.review.aggregate({
      where: productId ? { productId, isActive: true } : { isActive: true },
      _avg: { rating: true },
      _count: true,
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats: {
        averageRating: stats._avg.rating
          ? Math.round(stats._avg.rating * 10) / 10
          : 0,
        totalReviews: stats._count,
      },
    };
  }

  async getById(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        adminReplyUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        reviewReactions: {
          where: { userId: undefined },
          select: { type: true },
        },
      },
    });

    return review;
  }

  async updateStatus(reviewId: string, isActive: boolean) {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isActive },
    });

    await this.updateProductRating(review.productId);

    logger.info("Review status updated", { reviewId, isActive });

    return review;
  }

  async delete(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await this.updateProductRating(review.productId);

    logger.info("Review deleted", { reviewId });

    return { success: true };
  }

  async getMyReviews(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId, isActive: true },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { userId, isActive: true } }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          adminReplyUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { productId, isActive: true } }),
    ]);

    const stats = await prisma.review.aggregate({
      where: { productId, isActive: true },
      _avg: { rating: true },
      _count: true,
    });

    const ratingsBreakdown = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId, isActive: true },
      _count: { rating: true },
    });

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingsBreakdown.forEach((r) => {
      breakdown[r.rating as keyof typeof breakdown] = r._count.rating;
    });

    let userReactions: Record<string, string> = {};
    if (userId) {
      const reactions = await prisma.reviewReaction.findMany({
        where: {
          userId,
          reviewId: { in: reviews.map((r) => r.id) },
        },
      });
      userReactions = reactions.reduce(
        (acc, r) => {
          acc[r.reviewId] = r.type;
          return acc;
        },
        {} as Record<string, string>,
      );
    }

    return {
      reviews: reviews.map((review) => ({
        ...review,
        userReaction: userId ? userReactions[review.id] || null : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats: {
        averageRating: stats._avg.rating
          ? Math.round(stats._avg.rating * 10) / 10
          : 0,
        totalReviews: stats._count,
        breakdown,
      },
    };
  }

  private async updateProductRating(productId: string) {
    const ratingAggregation = await prisma.review.aggregate({
      where: { productId, isActive: true },
      _avg: { rating: true },
      _count: true,
    });

    const averageRating = ratingAggregation._avg.rating || 0;
    const reviewCount = ratingAggregation._count;

    logger.debug("Product rating updated", {
      productId,
      averageRating,
      reviewCount,
    });
  }
}

export const reviewService = new ReviewService();
