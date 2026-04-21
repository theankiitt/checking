import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCategoryProducts() {
  try {
    console.log("Creating categories and products...\n");

    const categories = [
      {
        name: "Statue",
        slug: "statue",
        description: "Handcrafted statues and idols",
      },
      {
        name: "Carpet",
        slug: "carpet",
        description: "Handwoven carpets and rugs",
      },
      {
        name: "Dress",
        slug: "dress",
        description: "Traditional Nepali dresses and clothing",
      },
    ];

    for (const cat of categories) {
      let category = await prisma.category.findFirst({
        where: { slug: cat.slug },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            isActive: true,
          },
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Found category: ${category.name}`);
      }
    }

    const statueCategory = await prisma.category.findFirst({
      where: { slug: "statue" },
    });
    const carpetCategory = await prisma.category.findFirst({
      where: { slug: "carpet" },
    });
    const dressCategory = await prisma.category.findFirst({
      where: { slug: "dress" },
    });

    const products = [
      // Statue products
      {
        name: "Brass Ganesh Statue",
        description: "Traditional brass Ganesh idol with gold plating",
        price: 250,
        quantity: 15,
        categoryId: statueCategory!.id,
        tags: ["statue", "brass", "ganesh", "religious"],
        isBestSeller: true,
      },
      {
        name: "Bronze Shiva Parvati Set",
        description: "Handcrafted bronze statues of Shiva and Parvati",
        price: 450,
        quantity: 8,
        categoryId: statueCategory!.id,
        tags: ["statue", "bronze", "shiva", "religious"],
        isNew: true,
      },
      {
        name: "Wooden Buddha Head",
        description: "Artisan carved wooden Buddha head sculpture",
        price: 180,
        quantity: 12,
        categoryId: statueCategory!.id,
        tags: ["statue", "wood", "buddha", "decor"],
        isFeatured: true,
      },
      // Carpet products
      {
        name: "Handwoven Wool Carpet",
        description: "Authentic Nepalese wool carpet with traditional patterns",
        price: 850,
        quantity: 10,
        categoryId: carpetCategory!.id,
        tags: ["carpet", "wool", "handwoven", "traditional"],
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: "Pure Silk Carpet",
        description: "Luxurious pure silk carpet with intricate designs",
        price: 1500,
        quantity: 5,
        categoryId: carpetCategory!.id,
        tags: ["carpet", "silk", "luxury", "handwoven"],
        isFeatured: true,
      },
      {
        name: "Knotted Wool Rug",
        description: "Hand-knotted wool rug with geometric patterns",
        price: 420,
        quantity: 15,
        categoryId: carpetCategory!.id,
        tags: ["carpet", "rug", "wool", "knotted"],
      },
      // Dress products
      {
        name: "Traditional Silk Sari",
        description: "Beautiful handwoven silk sari with embroidery",
        price: 280,
        quantity: 20,
        categoryId: dressCategory!.id,
        tags: ["dress", "sari", "silk", "traditional"],
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: "Daura Suruwal Set",
        description: "Traditional Nepali Daura Suruwal for men",
        price: 150,
        quantity: 25,
        categoryId: dressCategory!.id,
        tags: ["dress", "daura", "suruwal", "traditional"],
      },
      {
        name: "Gunyo Choli",
        description: "Traditional Newari Gunyo Choli for women",
        price: 120,
        quantity: 18,
        categoryId: dressCategory!.id,
        tags: ["dress", "gunyo", "choli", "newari"],
        isNew: true,
      },
    ];

    let productIndex = 0;
    for (const productData of products) {
      productIndex++;
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug:
            productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
            "-" +
            productIndex,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          categoryId: productData.categoryId,
          isActive: true,
          isFeatured: productData.isFeatured || false,
          isBestSeller: productData.isBestSeller || false,
          isNew: productData.isNew || false,
          tags: productData.tags,
        },
      });

      await prisma.productCurrencyPrice.createMany({
        data: [
          {
            productId: product.id,
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: productData.price,
            comparePrice: productData.price * 1.2,
            minDeliveryDays: 1,
            maxDeliveryDays: 7,
            isActive: true,
          },
          {
            productId: product.id,
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: productData.price * 0.8,
            comparePrice: productData.price * 0.96,
            minDeliveryDays: 3,
            maxDeliveryDays: 10,
            isActive: true,
          },
          {
            productId: product.id,
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: productData.price * 133,
            comparePrice: productData.price * 160,
            minDeliveryDays: 1,
            maxDeliveryDays: 3,
            isActive: true,
          },
        ],
      });

      console.log(`✓ Created: ${product.name}`);
    }

    console.log("\n✅ All products created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategoryProducts();
