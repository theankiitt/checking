import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateBrandLogos() {
  try {

    // Update TechBrand logo
    const techBrand = await prisma.brand.findUnique({
      where: { name: 'TechBrand' },
    });

    if (techBrand && techBrand.logo?.includes('example.com')) {
      await prisma.brand.update({
        where: { id: techBrand.id },
        data: {
          logo: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop',
        },
      });
    }

    // Update FashionHouse logo
    const fashionHouse = await prisma.brand.findUnique({
      where: { name: 'FashionHouse' },
    });

    if (fashionHouse && fashionHouse.logo?.includes('example.com')) {
      await prisma.brand.update({
        where: { id: fashionHouse.id },
        data: {
          logo: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop',
        },
      });
    }

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateBrandLogos()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });
