import { Request, Response } from "express";
import prisma from "@/config/database";
import { reviewService } from "@/services/ReviewService";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

export const getProductReviews = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { page = "1", limit = "10" } = req.query;

  const userId = req.user?.id;

  try {
    const result = await reviewService.getProductReviews(
      productId,
      Number(page),
      Number(limit),
      userId,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Get product reviews error:", error);
    throw new AppError("Failed to fetch reviews", 500);
  }
};

export const createReview = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId, rating, title, comment } = req.body;

  try {
    if (!productId || !rating) {
      throw new AppError("Product ID and rating are required", 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        isVerified: true,
        isActive: true,
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

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Create review error:", error);
    throw new AppError("Failed to create review", 500);
  }
};

export const updateReview = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Review update endpoint - implement if needed",
  });
};

export const deleteReview = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Review delete endpoint - implement if needed",
  });
};

export const getMyReviews = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { page = "1", limit = "10" } = req.query;

  try {
    const result = await reviewService.getMyReviews(
      userId,
      Number(page),
      Number(limit),
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Get my reviews error:", error);
    throw new AppError("Failed to fetch reviews", 500);
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  const { page = "1", limit = "20", productId, rating, isActive } = req.query;

  try {
    const result = await reviewService.list({
      page: Number(page),
      limit: Number(limit),
      productId: productId as string,
      rating: rating ? Number(rating) : undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Get all reviews error:", error);
    throw new AppError("Failed to fetch reviews", 500);
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { isActive } = req.body;

  try {
    const review = await reviewService.updateStatus(reviewId, isActive);

    res.json({
      success: true,
      message: "Review status updated",
      data: { review },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 404);
    }
    logger.error("Update review status error:", error);
    throw new AppError("Failed to update review status", 500);
  }
};

export const replyToReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { reply } = req.body;
  const adminId = req.user!.id;

  try {
    if (!reply || reply.trim().length === 0) {
      throw new AppError("Reply content is required", 400);
    }

    const review = await reviewService.replyToReview(reviewId, adminId, {
      reply,
    });

    res.json({
      success: true,
      message: "Reply added successfully",
      data: { review },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 404);
    }
    logger.error("Reply to review error:", error);
    throw new AppError("Failed to reply to review", 500);
  }
};

export const removeReviewReply = async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  try {
    const review = await reviewService.removeReply(reviewId);

    res.json({
      success: true,
      message: "Reply removed successfully",
      data: { review },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 404);
    }
    logger.error("Remove review reply error:", error);
    throw new AppError("Failed to remove reply", 500);
  }
};

export const addReaction = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { type } = req.body;
  const userId = req.user!.id;

  try {
    if (!type || !["LIKE", "DISLIKE"].includes(type)) {
      throw new AppError("Type must be LIKE or DISLIKE", 400);
    }

    const result = await reviewService.addReaction(userId, reviewId, type);

    res.json({
      success: true,
      message: `${type} added successfully`,
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("not found") || error.message.includes("already"))
    ) {
      throw new AppError(error.message, 400);
    }
    logger.error("Add reaction error:", error);
    throw new AppError("Failed to add reaction", 500);
  }
};

export const removeReaction = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = req.user!.id;

  try {
    const result = await reviewService.removeReaction(userId, reviewId);

    res.json({
      success: true,
      message: "Reaction removed successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 400);
    }
    logger.error("Remove reaction error:", error);
    throw new AppError("Failed to remove reaction", 500);
  }
};
