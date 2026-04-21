import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/config/database";
import {
  generateTokens,
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieOptions,
  cookieOptions,
} from "@/middleware/auth";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import { env } from "@/config/env";
import { sendEmail } from "@/services/email.service";
import {
  getForgotPasswordEmailTemplate,
  getPasswordResetConfirmationTemplate,
  getEmailVerificationTemplate,
} from "@/templates/emails";

// Register user
export const register = async (req: Request, res: Response) => {
  const { email, username, password, firstName, lastName, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError(
        "User with this email or username already exists",
        409,
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Set refresh token in HttpOnly cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions,
    );

    logger.info("User registered successfully", {
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Registration error:", error);
    throw new AppError("Registration failed", 500);
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check if user has password (not OAuth user)
    if (!user.password) {
      throw new AppError("Please login with Google", 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Set refresh token in HttpOnly cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions,
    );

    // Update last login (you might want to add this field to your schema)
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Login error:", error);
    throw new AppError("Login failed", 500);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get profile error:", error);
    throw new AppError("Failed to get profile", 500);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { firstName, lastName, phone, avatar } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    logger.info("User profile updated", { userId });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    throw new AppError("Failed to update profile", 500);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.password) {
      throw new AppError("Cannot change password for OAuth users", 400);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new AppError("Current password is incorrect", 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    logger.info("User password changed", { userId });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Change password error:", error);
    throw new AppError("Failed to change password", 500);
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  // Get refresh token from cookie
  const refreshTokenFromCookie = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshTokenFromCookie) {
    throw new AppError("Refresh token is required", 401);
  }

  try {
    const { verifyRefreshToken } = await import("@/middleware/auth");
    const { id } = verifyRefreshToken(refreshTokenFromCookie);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      // Clear invalid cookie
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookieOptions);
      throw new AppError("Invalid refresh token", 401);
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Set new refresh token in cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      newRefreshToken,
      refreshTokenCookieOptions,
    );

    logger.info("Token refreshed successfully", { userId: user.id });

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    // Clear cookie on error
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookieOptions);

    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Refresh token error:", error);
    throw new AppError("Invalid refresh token", 401);
  }
};

// Logout - Clear refresh token cookie
export const logout = async (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookieOptions);

  logger.info("User logged out", { userId: req.user?.id });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

// Google OAuth - Register or Login with Google
export const googleAuth = async (req: Request, res: Response) => {
  const { email, name, googleId, avatar } = req.body;

  if (!email || !googleId) {
    throw new AppError("Email and Google ID are required", 400);
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      const nameParts = (name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = await prisma.user.create({
        data: {
          email,
          username: email.split("@")[0],
          googleId,
          firstName,
          lastName,
          avatar,
          password: "", // No password for OAuth users
          isActive: true,
        },
      });

      logger.info("New user created via Google OAuth", {
        userId: user.id,
        email,
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          avatar: avatar || user.avatar,
        },
      });

      logger.info("Google account linked to existing user", {
        userId: user.id,
        email,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Set refresh token in HttpOnly cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions,
    );

    res.json({
      success: true,
      message: "Google authentication successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Google auth error:", error);
    throw new AppError("Google authentication failed", 500);
  }
};

// Forgot Password - Send reset email
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user || !user.isActive) {
      logger.info("Forgot password request for non-existent email", { email });
      res.json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send reset email
    const resetLink = `${env.FRONTEND_URL || "http://localhost:4000"}/reset-password?token=${resetToken}`;
    const emailHtml = getForgotPasswordEmailTemplate({
      userName: user.firstName || user.username || "User",
      resetLink,
      expiryTime: "1 hour",
    });

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - Ghar Samma",
      html: emailHtml,
    });

    logger.info("Password reset email sent", {
      userId: user.id,
      email: user.email,
    });

    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    // Still return success to prevent email enumeration
    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }
};

// Reset Password - Using token
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  try {
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    // Send confirmation email
    const emailHtml = getPasswordResetConfirmationTemplate({
      userName: user.firstName || user.username || "User",
      resetTime: new Date().toLocaleString(),
      supportEmail: "support@gharsamma.com",
    });

    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully - Ghar Samma",
      html: emailHtml,
    });

    logger.info("Password reset successful", { userId: user.id });

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Reset password error:", error);
    throw new AppError("Failed to reset password", 500);
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  try {
    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    logger.info("Email verified successfully", { userId: user.id });

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Email verification error:", error);
    throw new AppError("Failed to verify email", 500);
  }
};

// Resend Verification Email
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      // Don't reveal if user exists
      res.json({
        success: true,
        message:
          "If an unverified account exists with this email, a verification email has been sent.",
      });
      return;
    }

    if (user.emailVerified) {
      res.json({
        success: true,
        message: "This email is already verified.",
      });
      return;
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    const verificationLink = `${env.FRONTEND_URL || "http://localhost:4000"}/verify-email?token=${verificationToken}`;
    const emailHtml = getEmailVerificationTemplate({
      userName: user.firstName || user.username || "User",
      verificationLink,
      expiryTime: "24 hours",
      supportEmail: "support@gharsamma.com",
    });

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email Address - Ghar Samma",
      html: emailHtml,
    });

    logger.info("Verification email resent", { userId: user.id });

    res.json({
      success: true,
      message:
        "If an unverified account exists with this email, a verification email has been sent.",
    });
  } catch (error) {
    logger.error("Resend verification error:", error);
    res.json({
      success: true,
      message:
        "If an unverified account exists with this email, a verification email has been sent.",
    });
  }
};
