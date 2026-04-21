import { Router } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         phone:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             accessToken:
 *               type: string
 *             refreshToken:
 *               type: string
 */

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  googleAuth,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "@/controllers/userController";
import { authenticateToken } from "@/middleware/auth";
import { validateBody } from "@/middleware/validation";
import {
  authLimiter,
  registrationLimiter,
  emailVerificationLimiter,
  passwordResetLimiter,
  apiLimiter,
} from "@/middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} from "@/types/validation";
import { asyncHandler } from "@/middleware/errorHandler";
import { z } from "zod";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /api/v1/auth/google:
 *   post:
 *     summary: Register or login with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - googleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               googleId:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google authentication successful
 *
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */

// Public routes - with rate limiting
router.post(
  "/register",
  registrationLimiter,
  validateBody(registerSchema),
  asyncHandler(register),
);
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(login),
);
router.post("/refresh-token", apiLimiter, asyncHandler(refreshToken));
router.post("/google", registrationLimiter, asyncHandler(googleAuth));
router.post(
  "/forgot-password",
  passwordResetLimiter,
  asyncHandler(forgotPassword),
);
router.post(
  "/reset-password",
  passwordResetLimiter,
  asyncHandler(resetPassword),
);
router.post(
  "/verify-email",
  emailVerificationLimiter,
  asyncHandler(verifyEmail),
);
router.post(
  "/resend-verification",
  emailVerificationLimiter,
  asyncHandler(resendVerification),
);

// Protected routes
router.use(authenticateToken);

router.get("/profile", asyncHandler(getProfile));
router.put(
  "/profile",
  validateBody(updateUserSchema),
  asyncHandler(updateProfile),
);
router.put(
  "/change-password",
  validateBody(changePasswordSchema),
  asyncHandler(changePassword),
);
router.post("/logout", asyncHandler(logout));

export default router;
