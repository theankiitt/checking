import { Request, Response } from "express";
import { NotificationService, CreateNotificationInput, UpdateNotificationInput, NotificationFilters } from "@/services/NotificationService";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

// Create notification (Admin only)
export const createNotification = async (req: Request, res: Response) => {
  try {
    const input: CreateNotificationInput = req.body;
    const notification = await NotificationService.create(input);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error("Error in createNotification:", error);
    throw error;
  }
};

// Get notification by ID
export const getNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.getById(id);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error("Error in getNotification:", error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const filters: NotificationFilters = {
      userId,
      type: req.query.type as string,
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await NotificationService.getUserNotifications(userId, filters);

    res.json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error in getUserNotifications:", error);
    throw error;
  }
};

// Get all notifications (Admin only)
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const filters: NotificationFilters = {
      userId: req.query.userId as string,
      type: req.query.type as string,
      status: req.query.status as string,
      isGlobal: req.query.isGlobal ? req.query.isGlobal === "true" : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await NotificationService.getAll(filters);

    res.json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("Error in getAllNotifications:", error);
    throw error;
  }
};

// Update notification
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const input: UpdateNotificationInput = req.body;
    const notification = await NotificationService.update(id, input);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error("Error in updateNotification:", error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const notification = await NotificationService.markAsRead(id, userId);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error("Error in markAsRead:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const result = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error in markAllAsRead:", error);
    throw error;
  }
};

// Delete notification (Admin only)
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await NotificationService.delete(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error in deleteNotification:", error);
    throw error;
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const result = await NotificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error in getUnreadCount:", error);
    throw error;
  }
};

// Cleanup expired notifications (Admin only)
export const cleanupExpired = async (req: Request, res: Response) => {
  try {
    const result = await NotificationService.cleanupExpired();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error in cleanupExpired:", error);
    throw error;
  }
};