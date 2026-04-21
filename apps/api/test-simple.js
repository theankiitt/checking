const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSimple() {
  try {
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test brands table
    const brands = await prisma.brand.findMany();
    
    // Test creating a brand
    const testBrand = await prisma.brand.create({
      data: {
        name: 'Test Brand ' + Date.now(),
        logo: 'https://example.com/logo.jpg',
        website: 'https://example.com'
      }
    });
    
    
    // Clean up
    await prisma.brand.delete({
      where: { id: testBrand.id }
    });
    
    
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

testSimple();
