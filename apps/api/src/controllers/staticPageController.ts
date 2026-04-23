import { Request, Response } from "express";
import prisma from "@/config/database.js";
import { AppError } from "@/middleware/errorHandler.js";
import { logger } from "@/utils/logger.js";

export const getStaticPages = async (_req: Request, res: Response) => {
  try {
    const pages = await prisma.staticPage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    logger.error("Get static pages error:", error);
    throw new AppError("Failed to fetch static pages", 500);
  }
};

export const getStaticPageBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await prisma.staticPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new AppError("Page not found", 404);
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Get static page error:", error);
    throw new AppError("Failed to fetch page", 500);
  }
};

export const createStaticPage = async (req: Request, res: Response) => {
  try {
    const { slug, title, content, metaTitle, metaDescription, isActive } = req.body;

    if (!slug || !title) {
      throw new AppError("Slug and title are required", 400);
    }

    const existing = await prisma.staticPage.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError("A page with this slug already exists", 409);
    }

    const page = await prisma.staticPage.create({
      data: {
        slug,
        title,
        content: content || "",
        metaTitle,
        metaDescription,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({
      success: true,
      data: page,
      message: "Page created successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Create static page error:", error);
    throw new AppError("Failed to create page", 500);
  }
};

export const updateStaticPage = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, content, metaTitle, metaDescription, isActive } = req.body;

    const existing = await prisma.staticPage.findUnique({ where: { slug } });
    if (!existing) {
      throw new AppError("Page not found", 404);
    }

    const page = await prisma.staticPage.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      data: page,
      message: "Page updated successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Update static page error:", error);
    throw new AppError("Failed to update page", 500);
  }
};

export const deleteStaticPage = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const existing = await prisma.staticPage.findUnique({ where: { slug } });
    if (!existing) {
      throw new AppError("Page not found", 404);
    }

    await prisma.staticPage.delete({ where: { slug } });

    res.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Delete static page error:", error);
    throw new AppError("Failed to delete page", 500);
  }
};
