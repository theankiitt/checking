import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { AppError } from "@/middleware/errorHandler";

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  userId?: string;
  isGlobal?: boolean;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}

export interface UpdateNotificationInput {
  title?: string;
  message?: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  status?: "UNREAD" | "READ" | "ARCHIVED";
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}

export interface NotificationFilters {
  userId?: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  status?: "UNREAD" | "READ" | "ARCHIVED";
  isGlobal?: boolean;
  page?: number;
  limit?: number;
}

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    try {
      const notification = await prisma.notification.create({
        data: {
          title: input.title,
          message: input.message,
          type: input.type || "INFO",
          userId: input.userId,
          isGlobal: input.isGlobal || false,
          metadata: input.metadata || {},
          expiresAt: input.expiresAt,
        },
      });

      logger.info(`Notification created: ${notification.id}`);
      return notification;
    } catch (error) {
      logger.error("Error creating notification:", error);
      throw new AppError("Failed to create notification", 500);
    }
  }

  static async getById(id: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new AppError("Notification not found", 404);
      }

      return notification;
    } catch (error) {
      logger.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  }

  static async getUserNotifications(userId: string, filters: NotificationFilters = {}) {
    try {
      const {
        type,
        status,
        page = 1,
        limit = 10,
      } = filters;

      const where: any = {
        OR: [
          { userId },
          { isGlobal: true },
        ],
      };

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.notification.count({ where }),
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching notifications for user ${userId}:`, error);
      throw new AppError("Failed to fetch notifications", 500);
    }
  }

  static async getAll(filters: NotificationFilters = {}) {
    try {
      const {
        userId,
        type,
        status,
        isGlobal,
        page = 1,
        limit = 10,
      } = filters;

      const where: any = {};

      if (userId) {
        where.userId = userId;
      }

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      if (isGlobal !== undefined) {
        where.isGlobal = isGlobal;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.notification.count({ where }),
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Error fetching all notifications:", error);
      throw new AppError("Failed to fetch notifications", 500);
    }
  }

  static async update(id: string, input: UpdateNotificationInput) {
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: {
          ...input,
          readAt: input.status === "READ" && !input.readAt ? new Date() : undefined,
        },
      });

      logger.info(`Notification updated: ${id}`);
      return notification;
    } catch (error) {
      logger.error(`Error updating notification ${id}:`, error);
      if (error.code === "P2025") {
        throw new AppError("Notification not found", 404);
      }
      throw new AppError("Failed to update notification", 500);
    }
  }

  static async markAsRead(id: string, userId?: string) {
    try {
      const updateData: any = {
        status: "READ",
        readAt: new Date(),
      };

      // If userId is provided, ensure the notification belongs to that user or is global
      if (userId) {
        const notification = await prisma.notification.findUnique({
          where: { id },
        });

        if (!notification) {
          throw new AppError("Notification not found", 404);
        }

        if (notification.userId && notification.userId !== userId && !notification.isGlobal) {
          throw new AppError("Access denied", 403);
        }
      }

      const notification = await prisma.notification.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Notification marked as read: ${id}`);
      return notification;
    } catch (error) {
      logger.error(`Error marking notification as read ${id}:`, error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      await prisma.notification.updateMany({
        where: {
          OR: [
            { userId },
            { isGlobal: true },
          ],
          status: "UNREAD",
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      });

      logger.info(`All notifications marked as read for user: ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw new AppError("Failed to mark notifications as read", 500);
    }
  }

  static async delete(id: string) {
    try {
      await prisma.notification.delete({
        where: { id },
      });

      logger.info(`Notification deleted: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting notification ${id}:`, error);
      if (error.code === "P2025") {
        throw new AppError("Notification not found", 404);
      }
      throw new AppError("Failed to delete notification", 500);
    }
  }

  static async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          OR: [
            { userId },
            { isGlobal: true },
          ],
          status: "UNREAD",
        },
      });

      return { count };
    } catch (error) {
      logger.error(`Error getting unread count for user ${userId}:`, error);
      throw new AppError("Failed to get unread count", 500);
    }
  }

  // Clean up expired notifications
  static async cleanupExpired() {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      logger.info(`Cleaned up ${result.count} expired notifications`);
      return { deletedCount: result.count };
    } catch (error) {
      logger.error("Error cleaning up expired notifications:", error);
      throw new AppError("Failed to cleanup expired notifications", 500);
    }
  }
}