import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBanner() {
  try {
    // Create a sample banner similar to the image description
    const banner = await prisma.topBanner.create({
      data: {
        title: 'Free Delivery on orders over NPR.10000. Don\'t miss discount.',
        isActive: true,
      },
    });

  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

seedBanner();


