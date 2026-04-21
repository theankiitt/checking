import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  resetUserPassword,
  bulkUpdateUserStatus,
} from "@/controllers/userApiController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";
import { validateBody } from "@/middleware/validation";
import { z } from "zod";

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["STAFF", "MANAGER"]),
  permissions: z.array(z.string()).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["STAFF", "MANAGER"]).optional(),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const bulkUpdateSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user ID is required"),
  isActive: z.boolean(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

router.get("/profile", authenticateToken, asyncHandler(getProfile));
router.patch("/profile", authenticateToken, asyncHandler(updateProfile));
router.patch("/avatar", authenticateToken, asyncHandler(updateAvatar));
router.patch(
  "/password",
  authenticateToken,
  validateBody(changePasswordSchema),
  asyncHandler(changePassword),
);

router.get(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getAllUsers),
);
router.get(
  "/:id",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getUser),
);
router.patch(
  "/:id",
  authenticateToken,
  authorize("ADMIN"),
  validateBody(updateUserSchema),
  asyncHandler(updateUser),
);
router.post(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  validateBody(createUserSchema),
  asyncHandler(createUser),
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(deleteUser),
);
router.post(
  "/:id/reset-password",
  authenticateToken,
  authorize("ADMIN"),
  validateBody(resetPasswordSchema),
  asyncHandler(resetUserPassword),
);
router.post(
  "/bulk-update",
  authenticateToken,
  authorize("ADMIN"),
  validateBody(bulkUpdateSchema),
  asyncHandler(bulkUpdateUserStatus),
);

export default router;
