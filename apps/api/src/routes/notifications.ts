import { Router } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *           enum: [INFO, SUCCESS, WARNING, ERROR]
 *         status:
 *           type: string
 *           enum: [UNREAD, READ, ARCHIVED]
 *         userId:
 *           type: string
 *           format: uuid
 *         isGlobal:
 *           type: boolean
 *         metadata:
 *           type: object
 *         readAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NotificationList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

import {
  createNotification,
  getNotification,
  getUserNotifications,
  getAllNotifications,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  cleanupExpired,
} from "@/controllers/notificationController";
import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { AppError } from "@/middleware/errorHandler";
import { authenticateToken, authorize, optionalAuth } from "@/middleware/auth";
import {
  validateBody,
  validateQuery,
  validatePagination,
} from "@/middleware/validation";
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationQuerySchema,
} from "@/types/validation";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INFO, SUCCESS, WARNING, ERROR]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UNREAD, READ, ARCHIVED]
 *     responses:
 *       200:
 *         description: List of user notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationList'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [INFO, SUCCESS, WARNING, ERROR]
 *                 default: INFO
 *               userId:
 *                 type: string
 *                 format: uuid
 *               isGlobal:
 *                 type: boolean
 *                 default: false
 *               metadata:
 *                 type: object
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Notification created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/v1/notifications/admin:
 *   get:
 *     summary: Get all notifications (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INFO, SUCCESS, WARNING, ERROR]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UNREAD, READ, ARCHIVED]
 *       - in: query
 *         name: isGlobal
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/v1/notifications/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification details
 *       404:
 *         description: Notification not found
 *   put:
 *     summary: Update a notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [INFO, SUCCESS, WARNING, ERROR]
 *               status:
 *                 type: string
 *                 enum: [UNREAD, READ, ARCHIVED]
 *               metadata:
 *                 type: object
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Notification updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Notification not found
 *   delete:
 *     summary: Delete a notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Notification not found
 *
 * /api/v1/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Notification not found
 *
 * /api/v1/notifications/mark-all-read:
 *   put:
 *     summary: Mark all user notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/notifications/cleanup:
 *   post:
 *     summary: Cleanup expired notifications (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// User routes (authenticated)
router.use(authenticateToken);

// Get user notifications
router.get(
  "/",
  validateQuery(notificationQuerySchema),
  validatePagination,
  asyncHandler(getUserNotifications),
);

// Mark all as read
router.put("/mark-all-read", asyncHandler(markAllAsRead));

// Get unread count
router.get("/unread-count", asyncHandler(getUnreadCount));

// Mark specific notification as read
router.put("/:id/read", asyncHandler(markAsRead));

// Admin routes
router.use(authorize("ADMIN"));

// Create notification
router.post(
  "/",
  validateBody(createNotificationSchema),
  asyncHandler(createNotification),
);

// Get all notifications (admin)
router.get(
  "/admin",
  validateQuery(notificationQuerySchema),
  validatePagination,
  asyncHandler(getAllNotifications),
);

// Get notification by ID
router.get("/:id", asyncHandler(getNotification));

// Update notification
router.put(
  "/:id",
  validateBody(updateNotificationSchema),
  asyncHandler(updateNotification),
);

// Delete notification
router.delete("/:id", asyncHandler(deleteNotification));

// Cleanup expired notifications
router.post("/cleanup", asyncHandler(cleanupExpired));

export default router;