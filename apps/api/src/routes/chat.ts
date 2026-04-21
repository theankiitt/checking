import { Router, Request, Response } from "express";
import prisma from "@/config/database";
import { authenticateToken } from "@/middleware/auth";
import { adminAuth } from "@/middleware/adminAuth";
import { logger } from "@/utils/logger";

const router = Router();

// Get user's chat rooms
router.get("/rooms", authenticateToken, async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        userId: req.user?.id,
        isActive: true,
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    res.json({ success: true, data: rooms });
  } catch (error) {
    logger.error("Error fetching user rooms:", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat rooms",
    });
  }
});

// Get admin chat rooms
router.get("/admin/rooms", adminAuth, async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        status: { in: ["OPEN", "CLOSED"] },
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    res.json({ success: true, data: rooms });
  } catch (error) {
    logger.error("Error fetching admin rooms:", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat rooms",
    });
  }
});

// Get single chat room with messages
router.get(
  "/rooms/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const room = await prisma.chatRoom.findUnique({
        where: { id: req.params.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Chat room not found",
        });
      }

      // Check if user has access to this room
      if (room.userId !== req.user?.id && req.user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({ success: true, data: room });
    } catch (error) {
      logger.error("Error fetching chat room:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch chat room",
      });
    }
  },
);

// Close a chat room
router.patch(
  "/rooms/:id/close",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const room = await prisma.chatRoom.update({
        where: { id: req.params.id },
        data: { status: "CLOSED" },
      });

      res.json({ success: true, data: room });
    } catch (error) {
      logger.error("Error closing chat room:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to close chat room",
      });
    }
  },
);

// Get unread message count
router.get(
  "/unread",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const count = await prisma.chatMessage.count({
        where: {
          senderType: req.user?.role === "ADMIN" ? "USER" : "ADMIN",
          isRead: false,
          room: {
            userId: req.user?.role === "ADMIN" ? undefined : req.user?.id,
            adminId: req.user?.role === "ADMIN" ? req.user?.id : undefined,
          },
        },
      });

      res.json({ success: true, data: { count } });
    } catch (error) {
      logger.error("Error fetching unread count:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch unread count",
      });
    }
  },
);

// Get online admins count (public endpoint)
router.get("/status", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        online: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch status",
    });
  }
});

export default router;
