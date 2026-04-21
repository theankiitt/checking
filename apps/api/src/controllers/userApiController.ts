import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    const orderCount = await prisma.order.count({ where: { userId } });

    res.json({
      success: true,
      data: {
        user,
        addresses,
        stats: {
          totalOrders: orderCount,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get profile error:", error);
    throw new AppError("Failed to fetch profile", 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { firstName, lastName, phone, username } = req.body;

  try {
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, id: { not: userId } },
      });
      if (existing) {
        throw new AppError("Username already taken", 400);
      }
      updateData.username = username;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
        updatedAt: true,
      },
    });

    logger.info("Profile updated", { userId });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update profile error:", error);
    throw new AppError("Failed to update profile", 500);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { avatar } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        avatar: true,
      },
    });

    res.json({
      success: true,
      message: "Avatar updated successfully",
      data: { user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update avatar error:", error);
    throw new AppError("Failed to update avatar", 500);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError("New password must be at least 6 characters", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password || "");

    if (!isValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info("Password changed", { userId });

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

export const getAllUsers = async (req: Request, res: Response) => {
  const { page = "1", limit = "20", search, role, isActive } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      role: { in: ["ADMIN", "STAFF", "MANAGER"] },
    };

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: "insensitive" } },
        { username: { contains: search as string, mode: "insensitive" } },
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          permissions: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error) {
    logger.error("Get all users error:", error);
    throw new AppError("Failed to fetch users", 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
        addresses: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
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
    logger.error("Get user error:", error);
    throw new AppError("Failed to fetch user", 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, phone, role, isActive, permissions, password } =
    req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(permissions !== undefined && { permissions }),
        ...(password && {
          password: await (await import("bcryptjs")).hash(password, 10),
        }),
      },
    });

    logger.info("User updated", { userId: id, permissions });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "USER_UPDATED",
          action: "user_updated",
          description: `User ${user.username} updated`,
          entityId: user.id,
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update user error:", error);
    throw new AppError("Failed to update user", 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    role,
    permissions,
  } = req.body;

  try {
    if (!email || !username || !password || !role) {
      throw new AppError(
        "Email, username, password, and role are required",
        400,
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      throw new AppError(
        "User with this email or username already exists",
        400,
      );
    }

    const hashedPassword = await (await import("bcryptjs")).hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        permissions: permissions || [],
        isActive: true,
      },
    });

    logger.info("User created", { userId: user.id, role, permissions });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "USER_REGISTERED",
          action: "user_created",
          description: `User ${username} created with role ${role}`,
          entityId: user.id,
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });

    logger.info("User created", { userId: user.id, role, permissions });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "USER_REGISTERED",
          action: "user_created",
          description: `User ${username} created with role ${role}`,
          entityId: user.id,
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Create user error:", error);
    throw new AppError("Failed to create user", 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const currentUserId = req.user!.id;

    if (id === currentUserId) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, username: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("Cannot delete admin users", 400);
    }

    await prisma.user.delete({ where: { id } });

    logger.info("User deleted", { userId: id });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "DELETE",
          action: "user_deleted",
          description: `User ${user.username} deleted`,
          entityId: id,
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Delete user error:", error);
    throw new AppError("Failed to delete user", 500);
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("Cannot reset password for admin users", 400);
    }

    const hashedPassword = await (
      await import("bcryptjs")
    ).hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    logger.info("User password reset", { userId: id });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "UPDATE",
          action: "password_reset",
          description: `Password reset for user ${user.username}`,
          entityId: user.id,
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Reset password error:", error);
    throw new AppError("Failed to reset password", 500);
  }
};

export const bulkUpdateUserStatus = async (req: Request, res: Response) => {
  const { userIds, isActive } = req.body;

  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new AppError("User IDs array is required", 400);
    }

    // Don't allow deactivating current user
    const currentUserId = req.user!.id;
    const updatedIds = userIds.filter((id) => id !== currentUserId);

    if (updatedIds.length === 0) {
      throw new AppError("No valid users to update", 400);
    }

    await prisma.user.updateMany({
      where: {
        id: { in: updatedIds },
        role: { not: "ADMIN" },
      },
      data: { isActive },
    });

    logger.info("Bulk user status update", { userIds: updatedIds, isActive });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          type: "UPDATE",
          action: "bulk_status_update",
          description: `Bulk update: ${updatedIds.length} users set to ${isActive ? "active" : "inactive"}`,
          entityId: updatedIds.join(","),
          entityType: "User",
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    } catch (logError) {
    }

    res.json({
      success: true,
      message: `${updatedIds.length} users updated successfully`,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Bulk update error:", error);
    throw new AppError("Failed to bulk update users", 500);
  }
};
