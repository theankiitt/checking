import { Router } from "express";
import {
  getDashboardStats,
  getChartData,
} from "@/controllers/dashboardController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

router.get(
  "/stats",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getDashboardStats),
);

router.get(
  "/chart",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getChartData),
);

export default router;
