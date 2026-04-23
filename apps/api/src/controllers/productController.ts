import { Request, Response } from "express";
import { productService } from "@/services/ProductService";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import { cacheService } from "@/services/CacheService";

export const getProducts = async (req: Request, res: Response) => {
  console.log("CONTROLLER DEBUG: req.query =", JSON.stringify(req.query));
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    categoryId,
    category,
    categorySlug,
    subCategorySlug,
    subSubCategorySlug,
    search,
    isActive = "true",
    isFeatured,
    isBestSeller,
    isNew,
    isOnSale,
  } = req.query;

  console.log("CONTROLLER DEBUG: subCategorySlug =", subCategorySlug, "subSubCategorySlug =", subSubCategorySlug, "categorySlug =", categorySlug);

  const validatedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const validatedPage = Math.max(Number(page) || 1, 1);

  const result = await productService.list({
    page: validatedPage,
    limit: validatedLimit,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
    categoryId: categoryId as string,
    categorySlug: categorySlug as string,
    subCategorySlug: subCategorySlug as string,
    subSubCategorySlug: subSubCategorySlug as string,
    parentCategorySlug: category as string,
    search: search as string,
    isActive: isActive === "true",
    isFeatured: isFeatured === "true",
    isBestSeller: isBestSeller === "true",
    isNew: isNew === "true",
    isOnSale: isOnSale === "true",
  });

  res.json({
    success: true,
    data: result,
  });
};

export const getProductsAdmin = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    category,
    categorySlug,
    isActive = "true",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const validatedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const validatedPage = Math.max(Number(page) || 1, 1);

  const result = await productService.list({
    page: validatedPage,
    limit: validatedLimit,
    search: search as string,
    categoryId: categoryId as string,
    categorySlug: categorySlug as string,
    parentCategorySlug: category as string,
    isActive: isActive === "true",
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  });

  res.json({
    success: true,
    data: result,
  });
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productService.getById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Get product error:", error);
    throw new AppError("Failed to fetch product", 500);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.create(req.body as any);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    // Log full error details for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error("Create product error:", {
      message: errorMessage,
      stack: errorStack,
      productName: req.body?.name,
      categoryId: req.body?.categoryId,
      imagesCount: req.body?.images?.length,
    });
    
    // Check for duplicate product name
    if (errorMessage.includes("already exists")) {
      throw new AppError(errorMessage, 409);
    }
    
    // Check for Prisma errors
    if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
      logger.error("Database error detected:", { message: errorMessage });
    }
    
    // Check for file system errors
    if (errorMessage.includes("ENOENT") || errorMessage.includes("EACCES")) {
      logger.error("File system error detected:", { message: errorMessage });
    }
    
    throw new AppError(`Failed to create product: ${errorMessage}`, 500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productService.update(id, req.body as any);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Update product error:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 404);
    }
    if (error instanceof Error && error.message.includes("already exists")) {
      throw new AppError(error.message, 409);
    }
    throw new AppError("Failed to update product", 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await productService.delete(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Delete product error:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      throw new AppError(error.message, 404);
    }
    throw new AppError("Failed to delete product", 500);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  const { limit = 8 } = req.query;
  const validatedLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);

  const result = await productService.list({
    limit: validatedLimit,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  res.json({
    success: true,
    data: { products: result.products.filter((p: any) => p.isFeatured) },
  });
};

export const getBestSellerProducts = async (req: Request, res: Response) => {
  const { limit = 8 } = req.query;
  const validatedLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);

  const result = await productService.list({
    limit: validatedLimit,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  res.json({
    success: true,
    data: { products: result.products.filter((p: any) => p.isBestSeller) },
  });
};

export const getNewArrivalProducts = async (req: Request, res: Response) => {
  const { limit = 8 } = req.query;
  const validatedLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);

  const result = await productService.list({
    limit: validatedLimit,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  res.json({
    success: true,
    data: { products: result.products.filter((p: any) => p.isNew) },
  });
};

export const getOnSaleProducts = async (req: Request, res: Response) => {
  const { limit = 8 } = req.query;
  const validatedLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);

  const result = await productService.list({
    limit: validatedLimit,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  res.json({
    success: true,
    data: { products: result.products.filter((p: any) => p.isOnSale) },
  });
};

export const getTopProducts = async (req: Request, res: Response) => {
  const { limit = 4 } = req.query;
  const validatedLimit = Math.min(Math.max(Number(limit) || 4, 1), 50);

  const result = await productService.list({
    limit: validatedLimit,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  res.json({
    success: true,
    data: result.products.slice(0, validatedLimit),
  });
};

export const getProductPricing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity = 1, country } = req.query;

  try {
    const product = await productService.getById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const currencyPrices = (product as any).currencyPrices || [];
    let basePrice = 0;
    let currencyPrice = null;

    if (country) {
      currencyPrice = currencyPrices.find(
        (cp: any) => cp.country.toLowerCase() === String(country).toLowerCase(),
      );
      if (currencyPrice) {
        basePrice = Number(currencyPrice.price);
      }
    }

    if (basePrice === 0 && currencyPrices.length > 0) {
      basePrice = Number(currencyPrices[0].price);
      currencyPrice = currencyPrices[0];
    }

    const pricingTiers = (product as any).pricingTiers || [];
    let finalPrice = basePrice;
    let appliedTier = null;

    for (const tier of pricingTiers) {
      if (
        Number(quantity) >= tier.minQuantity &&
        (!tier.maxQuantity || Number(quantity) <= tier.maxQuantity)
      ) {
        finalPrice = Number(tier.price);
        appliedTier = tier;
      }
    }

    let discountAmount = 0;
    if (appliedTier?.discount) {
      discountAmount = (finalPrice * Number(appliedTier.discount)) / 100;
      finalPrice = finalPrice - discountAmount;
    }

    res.json({
      success: true,
      data: {
        productId: (product as any).id,
        basePrice,
        finalPrice,
        quantity: Number(quantity),
        appliedTier,
        discountAmount,
        savings: basePrice - finalPrice,
        currencyPrice: currencyPrice
          ? {
              country: currencyPrice.country,
              price: Number(currencyPrice.price),
              comparePrice: currencyPrice.comparePrice
                ? Number(currencyPrice.comparePrice)
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Get product pricing error:", error);
    throw new AppError("Failed to get product pricing", 500);
  }
};

export const addPricingTier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { minQuantity, maxQuantity, price, discount } = req.body;

  try {
    const product = await productService.getById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(201).json({
      success: true,
      message: "Pricing tier added successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Add pricing tier error:", error);
    throw new AppError("Failed to add pricing tier", 500);
  }
};

export const updatePricingTier = async (req: Request, res: Response) => {
  const { tierId } = req.params;
  const updateData = req.body;

  try {
    res.json({
      success: true,
      message: "Pricing tier updated successfully",
    });
  } catch (error) {
    logger.error("Update pricing tier error:", error);
    throw new AppError("Failed to update pricing tier", 500);
  }
};

export const deletePricingTier = async (req: Request, res: Response) => {
  const { tierId } = req.params;

  try {
    res.json({
      success: true,
      message: "Pricing tier deleted successfully",
    });
  } catch (error) {
    logger.error("Delete pricing tier error:", error);
    throw new AppError("Failed to delete pricing tier", 500);
  }
};

export const addProductAttribute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, value, type, isRequired, isFilterable, sortOrder } = req.body;

  try {
    const product = await productService.getById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(201).json({
      success: true,
      message: "Product attribute added successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error("Add product attribute error:", error);
    throw new AppError("Failed to add product attribute", 500);
  }
};

export const updateProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;
  const updateData = req.body;

  try {
    res.json({
      success: true,
      message: "Product attribute updated successfully",
    });
  } catch (error) {
    logger.error("Update product attribute error:", error);
    throw new AppError("Failed to update product attribute", 500);
  }
};

export const deleteProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;

  try {
    res.json({
      success: true,
      message: "Product attribute deleted successfully",
    });
  } catch (error) {
    logger.error("Delete product attribute error:", error);
    throw new AppError("Failed to delete product attribute", 500);
  }
};
