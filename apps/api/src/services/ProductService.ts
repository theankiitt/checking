import prisma from "@/config/database";
import { logger } from "@/utils/logger";
import { cacheService } from "@/services/CacheService";
import {
  getCurrencyForCountry,
  getSymbolForCurrency,
  transformCurrencyPrice,
  CurrencyPriceInput,
} from "@/utils/currency";
import { processImages, processThumbnail } from "@/utils/imageProcessing";

export interface CreateProductInput {
  name: string;
  description?: string;
  comparePrice?: number;
  costPrice?: number;
  slug?: string;
  sku?: string;
  images?: string[];
  videos?: string[];
  thumbnail?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  metaTags?: Record<string, unknown>;
  isActive?: boolean;
  isDigital?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  visibility?: string;
  publishedAt?: string;
  categoryId: string;
  subCategoryId?: string;
  subSubCategoryId?: string;
  tags?: string[];
  brandId?: string;
  notes?: string;
  currencyPrices?: CurrencyPriceInput[];
  seo?: {
    ogImage?: string;
    canonicalUrl?: string;
    focusKeyword?: string;
  };
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductListParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  categoryId?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  subSubCategorySlug?: string;
  parentCategorySlug?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
}

export class ProductService {
  async list(params: ProductListParams) {
    const {
      page = 1,
      limit = 10,
      isActive = true,
      categoryId,
      categorySlug,
      subCategorySlug,
      subSubCategorySlug,
      parentCategorySlug,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      isFeatured,
      isBestSeller,
      isNew,
      isOnSale,
    } = params;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive };

    if (categoryId) {
      where.OR = [{ categoryId }, { subCategoryId: categoryId }];
    }

    if (subSubCategorySlug) {
      const subSubCat = await prisma.category.findUnique({
        where: { slug: subSubCategorySlug },
        select: { id: true },
      });

      if (subSubCat) {
        where.subSubCategoryId = subSubCat.id;
      } else {
        return { products: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
      }
    } else if (subCategorySlug) {
      const subCat = await prisma.category.findUnique({
        where: { slug: subCategorySlug },
        select: { id: true },
      });

      if (subCat) {
        where.subCategoryId = subCat.id;
      } else {
        return { products: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
      }
    } else if (categorySlug) {
      const baseSlug = categorySlug.split("-")[0];

      const categoryConditions: Record<string, unknown>[] = [
        { slug: categorySlug },
        { slug: { startsWith: categorySlug } },
      ];
      if (baseSlug && baseSlug !== categorySlug) {
        categoryConditions.push({ slug: baseSlug });
        categoryConditions.push({ slug: { startsWith: `${baseSlug}-` } });
      }

      const subCategoryConditions: Record<string, unknown>[] = [
        { slug: categorySlug },
        { slug: { startsWith: categorySlug } },
      ];
      if (baseSlug && baseSlug !== categorySlug) {
        subCategoryConditions.push({ slug: baseSlug });
        subCategoryConditions.push({ slug: { startsWith: `${baseSlug}-` } });
      }

      const orClauses: Record<string, unknown>[] = [
        { category: { OR: categoryConditions } },
        { subCategory: { OR: subCategoryConditions } },
      ];

      if (parentCategorySlug) {
        orClauses.push({ category: { slug: parentCategorySlug } });
      }

      where.OR = [
        ...((where.OR as Array<unknown>) || []),
        ...orClauses,
      ];
    }

    if (search) {
      where.OR = [
        ...((where.OR as Array<unknown>) || []),
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isFeatured === true) {
      where.isFeatured = true;
    }

    if (isBestSeller === true) {
      where.isBestSeller = true;
    }

    if (isNew === true) {
      where.isNew = true;
    }

    if (isOnSale === true) {
      where.isOnSale = true;
    }

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
          images: true,
          thumbnail: true,
          isActive: true,
          isFeatured: true,
          isNew: true,
          isOnSale: true,
          isBestSeller: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          subCategoryId: true,
          subSubCategoryId: true,
          brandId: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, logo: true },
          },
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
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        reviewCount: p._count.reviews,
        _count: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getById(id: string) {
    const cacheKey = `product:${id}`;
    const cached = await cacheService.get<unknown>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, logo: true } },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: { select: { id: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (product) {
      const serializedProduct = {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        margin: product.margin ? Number(product.margin) : null,
        currencyPrices: product.currencyPrices.map((cp) => ({
          ...cp,
          price: Number(cp.price),
          comparePrice: cp.comparePrice ? Number(cp.comparePrice) : null,
        })),
        reviews: product.reviews.map((r) => ({
          ...r,
        })),
        reviewCount: product._count.reviews,
        _count: undefined,
      };

      await cacheService.set(cacheKey, serializedProduct, 300);
      return serializedProduct;
    }

    return product;
  }

  async create(input: CreateProductInput) {
    const {
      currencyPrices,
      seo,
      images,
      thumbnail,
      ...rest
    } = input;

    const slug = input.slug || this.generateSlug(input.name);

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      throw new Error("A product with this name already exists");
    }

    logger.info("Processing product images:", {
      imageCount: images?.length || 0,
      hasThumbnail: !!thumbnail,
    });

    // Process images - handle both file paths (from multipart upload) and base64 (legacy)
    const processedImages = await processImages(images || [], {
      subDir: "products",
    });
    const processedThumbnail = await processThumbnail(thumbnail, {
      subDir: "products",
    });

    logger.info("Processed images:", {
      processedImageCount: processedImages.length,
      thumbnail: processedThumbnail,
      images: processedImages,
    });

    logger.info("Creating product in database:", {
      name: input.name,
      slug,
      categoryId: input.categoryId,
      imageCount: processedImages.length,
    });

    try {
      const product = await prisma.product.create({
        data: {
          name: input.name,
          slug,
          description: input.description,
          price: input.price ?? input.currencyPrices?.[0]?.price ?? 0,
          comparePrice: input.comparePrice ?? input.currencyPrices?.[0]?.comparePrice ?? null,
          costPrice: input.costPrice ?? null,
          margin: input.margin ?? null,
          sku: input.sku,
          images: processedImages,
          thumbnail: processedThumbnail,
          videos: input.videos || [],
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          seoKeywords: input.seoKeywords,
          metaTags: input.metaTags as any,
          isActive: input.isActive ?? true,
          isDigital: input.isDigital ?? false,
          isFeatured: input.isFeatured ?? false,
          isNew: input.isNew ?? false,
          isOnSale: input.isOnSale ?? false,
          isBestSeller: input.isBestSeller ?? false,
          visibility: (input.visibility as any) || "VISIBLE",
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          subSubCategoryId: input.subSubCategoryId,
          tags: input.tags || [],
          brandId: input.brandId,
          notes: input.notes,
          ogImage: input.ogImage || input.seo?.ogImage || null,
          canonicalUrl: input.seo?.canonicalUrl || null,
          focusKeyword: input.seo?.focusKeyword || null,
        },
    });

    // Save currency prices (create default if not provided)
    const pricesToSave = currencyPrices?.length
      ? currencyPrices
      : [{
          country: "USA",
          currency: "USD",
          symbol: "$",
          price: input.price ?? 0,
          comparePrice: input.comparePrice ?? null,
          minDeliveryDays: 1,
          maxDeliveryDays: 7,
          isActive: true,
        }];

    await prisma.productCurrencyPrice.createMany({
      data: pricesToSave.map((cp) => ({
        productId: product.id,
        ...transformCurrencyPrice(cp, product.id),
      })),
    });

    if (seo?.ogImage || seo?.canonicalUrl || seo?.focusKeyword) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          ogImage: seo.ogImage,
          canonicalUrl: seo.canonicalUrl,
          focusKeyword: seo.focusKeyword,
        },
      });
    }

    await cacheService.invalidateRelated("product");

    logger.info("Product created successfully", {
      productId: product.id,
      name: product.name,
    });

    return this.getById(product.id);
  } catch (error) {
    logger.error("Failed to create product in database:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      productName: input.name,
    });
    throw error;
  }
}

  async update(id: string, input: UpdateProductInput) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Product not found");
    }

    let slug = existing.slug;

    // If a custom slug is provided, use it
    if (input.slug !== undefined && input.slug !== "") {
      slug = input.slug;
      const slugExists = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugExists) {
        throw new Error("A product with this slug already exists");
      }
    } else if (input.name && input.name !== existing.name) {
      // If name changed and no custom slug provided, regenerate
      slug = this.generateSlug(input.name);
      const slugExists = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugExists) {
        throw new Error("A product with this name already exists");
      }
    }

const { currencyPrices, images, thumbnail, seo, ...rest } = input;

    const updateData: Record<string, unknown> = { ...rest, slug };

    if (updateData.price !== undefined) {
      delete updateData.price;
    }

    if (seo) {
      if (seo.ogImage !== undefined) updateData.ogImage = seo.ogImage;
      if (seo.canonicalUrl !== undefined)
        updateData.canonicalUrl = seo.canonicalUrl;
      if (seo.focusKeyword !== undefined)
        updateData.focusKeyword = seo.focusKeyword;
    }

    if (images) {
      updateData.images = await processImages(images, { subDir: "products" });
    }

    if (thumbnail) {
      updateData.thumbnail = await processThumbnail(thumbnail, {
        subDir: "products",
      });
    }

    if (currencyPrices) {
      await prisma.productCurrencyPrice.deleteMany({
        where: { productId: id },
      });
      if (currencyPrices.length > 0) {
        await prisma.productCurrencyPrice.createMany({
          data: currencyPrices.map((cp) => ({
            productId: id,
            ...transformCurrencyPrice(cp, id),
          })),
        });
      }
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    await cacheService.invalidateRelated("product", id);

    logger.info("Product updated", { productId: id, name: existing.name });

    return this.getById(id);
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await cacheService.invalidateRelated("product", id);

    logger.info("Product deleted", { productId: id, name: product.name });

    return { success: true };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}

export const productService = new ProductService();
