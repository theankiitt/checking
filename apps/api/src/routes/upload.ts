import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import { asyncHandler } from "@/middleware/errorHandler";
import { env } from "@/config/env";
import { uploadLimiter } from "@/middleware/rateLimiter";

const router = Router();

// Ensure upload directories exist
const createUploadDirs = () => {
  const uploadDir = path.join(process.cwd(), "uploads");
  const dirs = [
    "categories",
    "brands",
    "sliders",
    "media",
    "products",
    "splash-screens",
  ];

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  dirs.forEach((dir) => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "media"; // default

    // Determine folder based on upload type
    if (req.url.includes("/category")) folder = "categories";
    else if (req.url.includes("/brand")) folder = "brands";
    else if (req.url.includes("/slider")) folder = "sliders";
    else if (req.url.includes("/product")) folder = "products";
    else if (req.url.includes("/splash-screen")) folder = "splash-screens";

    const uploadPath = path.join(process.cwd(), "uploads", folder);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increased from 10MB)
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image or video
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Only image and video files are allowed", 400));
    }
  },
});

// Helper function to get file path (relative path to store in DB)
const getFilePath = (filename: string, folder: string): string => {
  return `/uploads/${folder}/${filename}`;
};

// Helper function to get file URL (for API responses) - returns relative path
const getFileUrl = (req: Request, filename: string, folder: string): string => {
  // Return relative path for database storage
  return getFilePath(filename, folder);
};

// Upload category image
export const uploadCategoryImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, "categories");
    const filePath = getFilePath(req.file.filename, "categories");

    logger.info("Category image uploaded successfully", {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath, // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload category image error:", error);
    throw new AppError("Failed to upload image", 500);
  }
};

// Upload brand image
export const uploadBrandImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, "brands");
    const filePath = getFilePath(req.file.filename, "brands");

    logger.info("Brand image uploaded successfully", {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath, // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload brand image error:", error);
    throw new AppError("Failed to upload image", 500);
  }
};

// Upload slider image
export const uploadSliderImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, "sliders");
    const filePath = getFilePath(req.file.filename, "sliders");

    logger.info("Slider image uploaded successfully", {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: "Slider image uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath, // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload slider image error:", error);
    throw new AppError("Failed to upload slider image", 500);
  }
};

// Upload media file (image or video)
export const uploadMediaFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No media file provided", 400);
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const fileUrl = getFileUrl(req, req.file.filename, "media");
    const filePath = getFilePath(req.file.filename, "media");

    logger.info("Media file uploaded successfully", {
      originalName: req.file.originalname,
      size: req.file.size,
      type: isVideo ? "video" : "image",
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: "Media file uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath, // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        type: isVideo ? "video" : "image",
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload media file error:", error);
    throw new AppError("Failed to upload media file", 500);
  }
};

// Upload product image with compression
export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const originalPath = req.file.path;
    
    // Verify the file exists
    if (!fs.existsSync(originalPath)) {
      throw new AppError("Failed to save uploaded file", 500);
    }
    
    const compressedFilename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const compressedPath = path.join(
      process.cwd(),
      "uploads",
      "products",
      compressedFilename,
    );

    await sharp(originalPath)
      .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    // Delete original file
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // Verify compressed file exists
    if (!fs.existsSync(compressedPath)) {
      throw new AppError("Failed to compress image", 500);
    }

    const fileUrl = getFileUrl(req, compressedFilename, "products");
    const filePath = getFilePath(compressedFilename, "products");
    const stats = fs.statSync(compressedPath);

    logger.info("Product image uploaded and compressed successfully", {
      originalName: req.file.originalname,
      originalSize: req.file.size,
      compressedSize: stats.size,
      url: fileUrl,
      path: filePath,
      filename: compressedFilename,
    });

    res.json({
      success: true,
      message: "Product image uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath,
        originalName: req.file.originalname,
        size: stats.size,
        filename: compressedFilename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload product image error:", error);
    throw new AppError("Failed to upload product image", 500);
  }
};

// Routes
router.post(
  "/category",
  uploadLimiter,
  upload.single("image"),
  asyncHandler(uploadCategoryImage),
);
router.post(
  "/brand",
  uploadLimiter,
  upload.single("image"),
  asyncHandler(uploadBrandImage),
);
router.post(
  "/slider",
  uploadLimiter,
  upload.single("image"),
  asyncHandler(uploadSliderImage),
);
router.post(
  "/product",
  uploadLimiter,
  upload.single("image"),
  asyncHandler(uploadProductImage),
);
router.post(
  "/media",
  uploadLimiter,
  upload.single("file"),
  asyncHandler(uploadMediaFile),
);

// Upload multiple product images (multipart form data)
export const uploadMultipleProductImages = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError("No image files provided", 400);
    }

    const uploadedImages = req.files.map((file) => {
      const fileUrl = getFileUrl(req, file.filename, "products");
      const filePath = getFilePath(file.filename, "products");

      logger.info("Product image uploaded successfully", {
        originalName: file.originalname,
        size: file.size,
        url: fileUrl,
        path: filePath,
        filename: file.filename,
      });

      return {
        url: fileUrl,
        path: filePath,
        originalName: file.originalname,
        size: file.size,
        filename: file.filename,
        mimetype: file.mimetype,
      };
    });

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload multiple product images error:", error);
    throw new AppError("Failed to upload product images", 500);
  }
};

// Upload multiple product images route
router.post(
  "/product/multiple",
  uploadLimiter,
  upload.array("images", 10), // Max 10 images
  asyncHandler(uploadMultipleProductImages),
);

// Upload splash screen media
export const uploadSplashScreen = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError("No file provided", 400);
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const fileUrl = getFileUrl(req, req.file.filename, "splash-screens");
    const filePath = getFilePath(req.file.filename, "splash-screens");

    logger.info("Splash screen file uploaded successfully", {
      originalName: req.file.originalname,
      size: req.file.size,
      type: isVideo ? "video" : "image",
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: "Splash screen file uploaded successfully",
      data: {
        url: fileUrl,
        path: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
        type: isVideo ? "video" : "image",
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Upload splash screen error:", error);
    throw new AppError("Failed to upload splash screen file", 500);
  }
};

router.post(
  "/splash-screen",
  uploadLimiter,
  upload.single("file"),
  asyncHandler(uploadSplashScreen),
);

export default router;
