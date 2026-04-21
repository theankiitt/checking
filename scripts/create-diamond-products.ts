import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDiamondProducts() {
  try {
    console.log("Creating Diamond category and products...\n");

    // Find or create the Diamond category
    let diamondCategory = await prisma.category.findFirst({
      where: { slug: "diamond" },
    });

    if (!diamondCategory) {
      diamondCategory = await prisma.category.create({
        data: {
          name: "Diamond",
          slug: "diamond",
          description: "Premium diamond and gold jewellery",
          isActive: true,
        },
      });
      console.log(`Created Diamond category: ${diamondCategory.id}`);
    }

    const products = [
      {
        name: "Diamond Solitaire Ring",
        description: "Elegant 18K gold ring with certified solitaire diamond",
        price: 1500,
        quantity: 10,
        isFeatured: true,
        tags: ["diamond", "ring", "gold", "solitaire"],
      },
      {
        name: "Gold Tennis Bracelet",
        description:
          "Stunning 18K gold tennis bracelet with brilliant-cut diamonds",
        price: 2200,
        quantity: 5,
        isFeatured: true,
        tags: ["diamond", "bracelet", "gold", "tennis"],
      },
      {
        name: "Diamond Earrings",
        description: "Classic diamond stud earrings in 14K gold setting",
        price: 850,
        quantity: 15,
        isBestSeller: true,
        tags: ["diamond", "earrings", "gold", "stud"],
      },
      {
        name: "Gold Pendant Set",
        description: "Beautiful gold pendant with diamond accent",
        price: 650,
        quantity: 12,
        tags: ["diamond", "pendant", "gold", "set"],
      },
      {
        name: "Diamond Necklace",
        description: "Elegant diamond necklace with 18K gold chain",
        price: 3200,
        quantity: 3,
        isFeatured: true,
        tags: ["diamond", "necklace", "gold", "elegant"],
      },
      {
        name: "Gold Bangle with Diamonds",
        description: "Traditional gold bangle featuring diamond patterns",
        price: 950,
        quantity: 8,
        isNew: true,
        tags: ["diamond", "bangle", "gold", "traditional"],
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
          categoryId: diamondCategory.id,
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

    console.log("\n✅ All Diamond products created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDiamondProducts();
