import { Router } from "express";
import {
  getWebsiteAnalytics,
  getSalesAnalytics,
} from "@/controllers/analyticsController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler.js";

const router = Router();

router.get(
  "/website",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getWebsiteAnalytics),
);

router.get(
  "/sales",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getSalesAnalytics),
);

export default router;
