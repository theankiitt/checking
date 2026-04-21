import * as path from "path";
import { promises as fsPromises } from "fs";
import { logger } from "@/utils/logger";

export interface ProcessedImage {
  path: string;
  filename: string;
}

export interface ImageProcessingOptions {
  uploadDir?: string;
  subDir?: string;
  prefix?: string;
}

/**
 * Process base64 image and save to uploads directory
 */
export const processBase64Image = async (
  base64String: string,
  options: ImageProcessingOptions = {},
): Promise<ProcessedImage | null> => {
  try {
    if (!base64String.startsWith("data:image")) {
      return null;
    }

    const [header, data] = base64String.split(";base64,");
    if (!data) {
      logger.error("Invalid base64 image format");
      return null;
    }

    const mimeType = header.split(":")[1];
    const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const prefix = options.prefix || "image";
    const filename = `${prefix}-${uniqueSuffix}.${extension}`;

    const baseUploadDir =
      options.uploadDir || path.join(process.cwd(), "uploads");
    const uploadDir = options.subDir
      ? path.join(baseUploadDir, options.subDir)
      : baseUploadDir;

    try {
      await fsPromises.access(uploadDir);
    } catch {
      await fsPromises.mkdir(uploadDir, { recursive: true });
      logger.info(`Created upload directory: ${uploadDir}`);
    }

    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(data, "base64");
    
    // Verify buffer size before writing
    if (buffer.length === 0) {
      logger.error("Empty image buffer");
      return null;
    }
    
    await fsPromises.writeFile(filePath, buffer);
    
    // Verify file was written successfully
    const fileStats = await fsPromises.stat(filePath);
    if (fileStats.size === 0) {
      logger.error(`File written but size is 0: ${filename}`);
      return null;
    }

    const relativePath = options.subDir
      ? `/uploads/${options.subDir}/${filename}`
      : `/uploads/${filename}`;

    logger.info(`Successfully processed image: ${filename}, size: ${fileStats.size} bytes`);

    return {
      path: relativePath,
      filename,
    };
  } catch (error) {
    logger.error("Error processing base64 image:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};

/**
 * Process multiple images
 */
export const processImages = async (
  images: (string | undefined)[],
  options: ImageProcessingOptions = {},
): Promise<string[]> => {
  const processedImages: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (!image) continue;

    try {
      if (image.startsWith("data:image")) {
        const result = await processBase64Image(image, options);
        if (result) {
          processedImages.push(result.path);
        } else {
          logger.warn(`Failed to process image at index ${i}`);
        }
      } else if (image.startsWith("http")) {
        try {
          const url = new URL(image);
          processedImages.push(url.pathname);
        } catch {
          processedImages.push(image);
        }
      } else {
        processedImages.push(image);
      }
    } catch (error) {
      logger.error(`Error processing image at index ${i}:`, {
        error: error instanceof Error ? error.message : String(error),
        imagePreview: image.substring(0, 50) + "...",
      });
      // Continue with next image instead of failing completely
    }
  }

  logger.info(`Processed ${processedImages.length}/${images.length} images successfully`);
  return processedImages;
};

/**
 * Process single thumbnail
 */
export const processThumbnail = async (
  thumbnail: string | undefined,
  options: ImageProcessingOptions = {},
): Promise<string | undefined> => {
  if (!thumbnail) return undefined;

  if (thumbnail.startsWith("data:image")) {
    const result = await processBase64Image(thumbnail, {
      ...options,
      prefix: "thumb",
    });
    return result?.path;
  }

  if (thumbnail.startsWith("http")) {
    try {
      const url = new URL(thumbnail);
      return url.pathname;
    } catch {
      return thumbnail;
    }
  }

  return thumbnail;
};
