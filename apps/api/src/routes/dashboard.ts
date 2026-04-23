import { Router } from "express";
import {
  getDashboardStats,
  getChartData,
  getSalesChartData,
  getRevenueChartData,
  getOrdersChartData,
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
  "/overview",
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

router.get(
  "/chart/sales",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getSalesChartData),
);

router.get(
  "/chart/revenue",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getRevenueChartData),
);

router.get(
  "/chart/orders",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getOrdersChartData),
);

export default router;
