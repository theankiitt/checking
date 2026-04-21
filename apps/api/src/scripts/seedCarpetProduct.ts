import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const prisma = new PrismaClient();

async function seedCarpetProduct() {
  try {

    // Get Handicraft category
    const handicraft = await prisma.category.findFirst({
      where: { slug: { startsWith: 'handicraft' } },
    });

    if (!handicraft) {
      return;
    }


    // Get Carpet subcategory
    const carpet = await prisma.category.findFirst({
      where: { slug: 'carpet', parentId: handicraft.id },
    });

    if (!carpet) {
      return;
    }


    // Check if product already exists
    const existing = await prisma.product.findFirst({
      where: { slug: 'handmade-tibetan-carpet' },
    });

    if (existing) {
      return;
    }

    const productId = randomUUID();

    await prisma.product.create({
      data: {
        id: productId,
        name: 'Handmade Tibetan Carpet',
        slug: 'handmade-tibetan-carpet',
        description: 'Beautiful handmade Tibetan carpet with traditional patterns and premium wool.',
        price: 250,
        comparePrice: 300,
        sku: 'CARPET-001',
        images: [],
        videos: [],
        thumbnail: null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: [],
        metaTags: null,
        ogImage: null,
        canonicalUrl: null,
        focusKeyword: null,
        isActive: true,
        isDigital: false,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        isBestSeller: false,
        visibility: 'VISIBLE' as any,
        publishedAt: null,
        categoryId: handicraft.id,
        subCategoryId: carpet.id,
        tags: ['carpet', 'handicraft', 'tibetan'],
        brandId: null,
        customFields: null,
        notes: null,
      },
    });

  } catch (error) {
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedCarpetProduct().then(() => {
});
