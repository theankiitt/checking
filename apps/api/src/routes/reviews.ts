import { Router } from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviews,
  updateReviewStatus,
  replyToReview,
  removeReviewReply,
  addReaction,
  removeReaction,
} from "@/controllers/reviewApiController";
import { authenticateToken, authorize, optionalAuth } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";
import { writeLimiter, publicReadLimiter } from "@/middleware/rateLimiter";

const router = Router();

router.get("/my-reviews", authenticateToken, asyncHandler(getMyReviews));
router.get(
  "/product/:productId",
  publicReadLimiter,
  optionalAuth,
  asyncHandler(getProductReviews),
);

router.post("/", writeLimiter, authenticateToken, asyncHandler(createReview));
router.patch(
  "/:reviewId",
  writeLimiter,
  authenticateToken,
  asyncHandler(updateReview),
);
router.delete("/:reviewId", authenticateToken, asyncHandler(deleteReview));

router.post(
  "/:reviewId/react",
  writeLimiter,
  authenticateToken,
  asyncHandler(addReaction),
);
router.delete(
  "/:reviewId/react",
  authenticateToken,
  asyncHandler(removeReaction),
);

router.get(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getAllReviews),
);
router.patch(
  "/:reviewId/status",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(updateReviewStatus),
);
router.post(
  "/:reviewId/reply",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(replyToReview),
);
router.delete(
  "/:reviewId/reply",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(removeReviewReply),
);

export default router;
