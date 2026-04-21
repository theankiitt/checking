import prisma from "@/config/database";
import { logger } from "@/utils/logger";

/**
 * Optimized product listing query that fetches products with all necessary relations
 * in a single query to avoid N+1 problems
 */
export async function getProductsOptimized(params: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const {
    page = 1,
    limit = 10,
    isActive = true,
    categoryId,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit;

  try {
    // Build where clause
    const where: any = {
      isActive,
    };

    if (categoryId) {
      where.OR = [{ categoryId }, { subCategoryId: categoryId }];
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute queries in parallel for better performance
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          comparePrice: true,
          sku: true,
          barcode: true,
          images: true,
          thumbnail: true,
          isActive: true,
          isFeatured: true,
          isNew: true,
          isOnSale: true,
          isBestSeller: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          subCategoryId: true,
          brandId: true,
          // Include category in select to avoid separate query
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          // Include brand in select to avoid separate query
          brand: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          // Include active currency prices
          currencyPrices: {
            where: { isActive: true },
            select: {
              country: true,
              price: true,
              comparePrice: true,
              currency: true,
              symbol: true,
            },
          },
          // Include review count
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error("Error in getProductsOptimized:", {
      error,
      params,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get a single product with all relations optimized
 */
export async function getProductOptimized(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        comparePrice: true,
        costPrice: true,
        sku: true,
        barcode: true,
        upc: true,
        ean: true,
        isbn: true,
        images: true,
        thumbnail: true,
        videos: true,
        isActive: true,
        isDigital: true,
        isFeatured: true,
        isNew: true,
        isOnSale: true,
        isBestSeller: true,
        quantity: true,
        lowStockThreshold: true,
        weight: true,
        weightUnit: true,
        dimensions: true,
        tags: true,
        requiresShipping: true,
        freeShipping: true,
        taxable: true,
        taxClass: true,
        customFields: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        // Include all relations in select
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
        attributes: {
          orderBy: { sortOrder: "asc" },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    logger.error("Error in getProductOptimized:", {
      error,
      productId,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
