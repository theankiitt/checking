import { Router, Request, Response } from "express";
import { categoryRepository } from "@/repositories";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import { asyncHandler } from "@/middleware/errorHandler";
import { cacheMiddleware } from "@/middleware/cache";
import { authenticateToken } from "@/middleware/auth";
import { adminAuth } from "@/middleware/adminAuth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  image: z.string().optional().nullable(),
  internalLink: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  disclaimer: z.string().optional().nullable(),
  additionalDetails: z.string().optional().nullable(),
  howToCare: z.string().optional().nullable(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .nullable(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  image: z.string().optional().nullable(),
  internalLink: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  disclaimer: z.string().optional().nullable(),
  additionalDetails: z.string().optional().nullable(),
  howToCare: z.string().optional().nullable(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

const router = Router();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    const categories = await categoryRepository.findAllWithHierarchy(
      includeInactive === "true",
    );

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    logger.error("Get categories error:", error);
    res.status(200).json({
      success: true,
      data: { categories: [] },
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let category = await categoryRepository.findById(id);

    if (!category) {
      category = await categoryRepository.findBySlug(id);
    }

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Get category error:", error);
    throw new AppError("Failed to fetch category", 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const existing = await categoryRepository.findOne({
      name: validatedData.name,
      parentId: validatedData.parentId || null,
    });
    if (existing) {
      throw new AppError("Category with this name already exists in this parent", 400);
    }

    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure unique slug by appending counter if needed
    let slug = baseSlug;
    let counter = 1;
    const existingSlug = await categoryRepository.findOne({ slug });
    if (existingSlug) {
      slug = `${baseSlug}-${counter}`;
      while (await categoryRepository.findOne({ slug })) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    }

    const createData: any = {
      ...validatedData,
      slug,
    };

    // Auto-generate internalLink for subcategories
    if (validatedData.parentId && !validatedData.internalLink) {
      const parent = await categoryRepository.findById(validatedData.parentId);
      if (parent) {
        const parentLink = parent.internalLink || `/products/${parent.slug}`;
        createData.internalLink = `${parentLink}/${slug}`;
      }
    }

    const category = await categoryRepository.create(createData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof z.ZodError) {
      throw new AppError("Validation error", 400);
    }
    logger.error("Create category error:", error);
    throw new AppError("Failed to create category", 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);

    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    const updateData: any = validatedData;
    const category = await categoryRepository.update(id, updateData);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof z.ZodError) {
      throw new AppError("Validation error", 400);
    }
    logger.error("Update category error:", error);
    throw new AppError("Failed to update category", 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    logger.info(`[deleteCategory] Attempting to delete category: ${id}, trimmed: '${id?.trim()}'`);

    const trimmedId = id?.trim();
    if (!trimmedId) {
      logger.warn(`[deleteCategory] Invalid ID: ${id}`);
      throw new AppError("Invalid category ID", 400);
    }

    try {
      const deleted = await categoryRepository.delete(trimmedId);
      if (!deleted) {
        logger.warn(`[deleteCategory] Category not found: ${trimmedId}`);
        throw new AppError("Category not found", 404);
      }

      logger.info(`[deleteCategory] Successfully deleted category: ${trimmedId}`);

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (deleteError: any) {
      logger.error("[deleteCategory] Delete operation failed:", deleteError);
      const msg = deleteError?.message || "Failed to delete category";
      throw new AppError(msg, 500);
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error("Delete category error:", error);
    const errMsg = error?.message || "Unknown error";
    throw new AppError(`Failed to delete category: ${errMsg}`, 500);
  }
};

export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.findTree();

    const categoryMap = new Map();
    const rootCategories: any[] = [];

    categories.forEach((category: any) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
      });
    });

    categoryMap.forEach((category: any) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    res.json({
      success: true,
      data: { categories: rootCategories },
    });
  } catch (error) {
    logger.error("Get category tree error:", error);
    throw new AppError("Failed to fetch category tree", 500);
  }
};

router.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Categories API is working",
    timestamp: new Date().toISOString(),
  });
});

router.get("/", cacheMiddleware({ ttl: 300 }), asyncHandler(getCategories));
router.get(
  "/tree",
  cacheMiddleware({ ttl: 300 }),
  asyncHandler(getCategoryTree),
);
router.get("/:id", cacheMiddleware({ ttl: 300 }), asyncHandler(getCategory));
router.post("/", authenticateToken, adminAuth, asyncHandler(createCategory));
router.put("/:id", authenticateToken, adminAuth, asyncHandler(updateCategory));
router.delete("/:id", authenticateToken, adminAuth, asyncHandler(deleteCategory));

export default router;
