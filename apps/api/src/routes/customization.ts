/**
 * @swagger
 * /api/v1/customization:
 *   post:
 *     summary: Submit a customization request
 *     tags: [Customization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               customizationType:
 *                 type: string
 *               productName:
 *                 type: string
 *               budget:
 *                 type: string
 *               deadline:
 *                 type: string
 *               medium:
 *                 type: string
 *                 enum: [viber, whatsapp]
 *               contactNumber:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customization request submitted
 *       400:
 *         description: Validation error
 */

import { Router, Request, Response } from "express";
import { authenticateToken, optionalAuth, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

const router = Router();

router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      medium,
      contactNumber,
      description,
      userEmail,
    } = req.body;

    if (!contactNumber) {
      throw new AppError("Contact number is required", 400);
    }

    if (!medium || !["viber", "whatsapp"].includes(medium.toLowerCase())) {
      throw new AppError("Medium must be either 'viber' or 'whatsapp'", 400);
    }

    const customizationRequest = await prisma.customizationRequest.create({
      data: {
        userId: req.user?.id || null,
        userEmail: req.user?.email || userEmail || null,
        customizationType: medium.toLowerCase(),
        description: description || null,
        contactMethod: medium.toLowerCase(),
        phone: contactNumber,
        status: "PENDING",
      },
    });

    logger.info("Customization request submitted", {
      requestId: customizationRequest.id,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Customization request submitted successfully!",
      data: {
        id: customizationRequest.id,
        status: customizationRequest.status,
      },
    });
  }),
);

router.get(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(async (req: Request, res: Response) => {
    const { page = "1", limit = "20", status } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.customizationRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.customizationRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  }),
);

router.patch(
  "/:id/status",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const updated = await prisma.customizationRequest.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      data: { request: updated },
    });
  }),
);

export default router;
