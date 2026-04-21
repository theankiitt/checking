import { Router, Request, Response } from "express";
import prisma from "@/config/database";
import { authenticateToken } from "@/middleware/auth";
import { adminAuth } from "@/middleware/adminAuth";
import { logger } from "@/utils/logger";
import multer from "multer";
import path from "path";

const router = Router();

// Configure multer for splash screen uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "splash-screens");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `splash-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

// Alias route for /splash-slides (backward compatibility)
router.get("/splash-slides", async (req: Request, res: Response) => {
  const splashScreens = await prisma.mediaItem.findMany({
    where: {
      mediaType: "SPLASH",
      isActive: req.query.isActive === "true" ? true : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const data = splashScreens.map((splash) => ({
    ...splash,
    mediaUrl: splash.mediaUrl.startsWith("/")
      ? `${baseUrl}${splash.mediaUrl}`
      : splash.mediaUrl,
  }));
  return res.json({ success: true, data: { splashScreens: data } });
});

// Get active splash screen (public)
router.get("/splash-screen", async (req: Request, res: Response) => {
  try {
    const splashScreen = await prisma.mediaItem.findFirst({
      where: {
        mediaType: "SPLASH",
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert local path to full URL for frontend
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const splashData = splashScreen
      ? {
          ...splashScreen,
          mediaUrl: splashScreen.mediaUrl.startsWith("/")
            ? `${baseUrl}${splashScreen.mediaUrl}`
            : splashScreen.mediaUrl,
        }
      : null;

    res.json({
      success: true,
      data: splashData,
    });
  } catch (error) {
    logger.error("Error fetching splash screen:", { error });
    res.status(500).json({
      success: false,
      message: "Failed to fetch splash screen",
    });
  }
});

// Get all splash screens (admin)
router.get(
  "/splash-screen/admin",
  authenticateToken,
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const splashScreens = await prisma.mediaItem.findMany({
        where: { mediaType: "SPLASH" },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        data: splashScreens,
      });
    } catch (error) {
      logger.error("Error fetching splash screens:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch splash screens",
      });
    }
  },
);

// Get single splash screen (admin)
router.get(
  "/splash-screen/:id",
  authenticateToken,
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const splashScreen = await prisma.mediaItem.findUnique({
        where: { id: req.params.id },
      });

      if (!splashScreen) {
        return res.status(404).json({
          success: false,
          message: "Splash screen not found",
        });
      }

      res.json({
        success: true,
        data: splashScreen,
      });
    } catch (error) {
      logger.error("Error fetching splash screen:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch splash screen",
      });
    }
  },
);

// Create splash screen with file upload (admin)
router.post(
  "/splash-screen",
  authenticateToken,
  adminAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { title, description, ctaText, internalLink, isActive } = req.body;

      // Validate file upload
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Media file is required",
        });
      }

      // Store local file path (relative path)
      const mediaUrl = `/uploads/splash-screens/${req.file.filename}`;

      const splashScreen = await prisma.mediaItem.create({
        data: {
          mediaType: "SPLASH",
          title: title || null,
          description: description || null,
          ctaText: ctaText || null,
          mediaUrl,
          internalLink: internalLink || null,
          isActive: isActive !== undefined ? isActive === "true" : true,
          linkTo: "splash-screen",
        },
      });

      logger.info("Splash screen created", {
        splashScreenId: splashScreen.id,
        createdBy: req.user?.id,
        filename: req.file.filename,
      });

      res.status(201).json({
        success: true,
        data: splashScreen,
        message: "Splash screen created successfully",
      });
    } catch (error) {
      logger.error("Error creating splash screen:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to create splash screen",
      });
    }
  },
);

// Update splash screen with optional file upload (admin)
router.put(
  "/splash-screen/:id",
  authenticateToken,
  adminAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, ctaText, internalLink, isActive } = req.body;

      const existing = await prisma.mediaItem.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Splash screen not found",
        });
      }

      // If new file uploaded, use the new path
      const mediaUrl = req.file
        ? `/uploads/splash-screens/${req.file.filename}`
        : existing.mediaUrl;

      const splashScreen = await prisma.mediaItem.update({
        where: { id },
        data: {
          title: title !== undefined ? title : existing.title,
          description:
            description !== undefined ? description : existing.description,
          ctaText: ctaText !== undefined ? ctaText : existing.ctaText,
          mediaUrl,
          internalLink:
            internalLink !== undefined ? internalLink : existing.internalLink,
          isActive:
            isActive !== undefined ? isActive === "true" : existing.isActive,
        },
      });

      logger.info("Splash screen updated", {
        splashScreenId: splashScreen.id,
        updatedBy: req.user?.id,
        filename: req.file?.filename,
      });

      res.json({
        success: true,
        data: splashScreen,
        message: "Splash screen updated successfully",
      });
    } catch (error) {
      logger.error("Error updating splash screen:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to update splash screen",
      });
    }
  },
);

// Toggle splash screen active status (admin)
router.patch(
  "/splash-screen/:id/toggle",
  authenticateToken,
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existing = await prisma.mediaItem.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Splash screen not found",
        });
      }

      const splashScreen = await prisma.mediaItem.update({
        where: { id },
        data: { isActive: !existing.isActive },
      });

      logger.info("Splash screen toggled", {
        splashScreenId: splashScreen.id,
        newStatus: splashScreen.isActive,
        toggledBy: req.user?.id,
      });

      res.json({
        success: true,
        data: splashScreen,
        message: `Splash screen ${
          splashScreen.isActive ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error) {
      logger.error("Error toggling splash screen:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to toggle splash screen status",
      });
    }
  },
);

// Delete splash screen (admin)
router.delete(
  "/splash-screen/:id",
  authenticateToken,
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existing = await prisma.mediaItem.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Splash screen not found",
        });
      }

      // Delete the file from disk
      const fs = await import("fs");
      const filePath = path.join(process.cwd(), existing.mediaUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await prisma.mediaItem.delete({
        where: { id },
      });

      logger.info("Splash screen deleted", {
        splashScreenId: id,
        deletedBy: req.user?.id,
        filename: path.basename(existing.mediaUrl),
      });

      res.json({
        success: true,
        message: "Splash screen deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting splash screen:", { error });
      res.status(500).json({
        success: false,
        message: "Failed to delete splash screen",
      });
    }
  },
);

export default router;
