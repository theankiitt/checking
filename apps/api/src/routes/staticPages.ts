import { Router } from "express";
import {
  getStaticPages,
  getStaticPageBySlug,
  createStaticPage,
  updateStaticPage,
  deleteStaticPage,
} from "@/controllers/staticPageController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getStaticPages));

router.get("/:slug", asyncHandler(getStaticPageBySlug));

router.post(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(createStaticPage),
);

router.put(
  "/:slug",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(updateStaticPage),
);

router.delete(
  "/:slug",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(deleteStaticPage),
);

export default router;
