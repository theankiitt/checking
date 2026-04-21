import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSampleProducts() {
  try {
    console.log("Creating sample products in different categories...\n");

    const products = [
      {
        name: "Diamond Gold Ring",
        description: "Beautiful 18K gold ring with certified diamond",
        price: 0,
        quantity: 10,
        categoryId: "cmnaeqial0001w369cd68bfdd",
        isActive: true,
        isFeatured: true,
        tags: ["diamond", "gold", "ring", "jewelry"],
        currencyPrices: [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 1500,
            comparePrice: 1800,
          },
          {
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: 1200,
            comparePrice: 1500,
          },
          {
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: 180000,
            comparePrice: 220000,
          },
        ],
      },
      {
        name: "Elegant Silk Sari",
        description:
          "Beautiful handwoven silk sari with traditional embroidery",
        price: 0,
        quantity: 15,
        categoryId: "cmnaeqi7u0000w369w7tgqqll",
        isActive: true,
        isFeatured: true,
        tags: ["dress", "silk", "sari", "traditional"],
        currencyPrices: [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 250,
            comparePrice: 300,
          },
          {
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: 200,
            comparePrice: 250,
          },
          {
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: 30000,
            comparePrice: 36000,
          },
        ],
      },
      {
        name: "Handcrafted Buddha Statue",
        description: "Beautiful hand-carved wooden Buddha statue",
        price: 0,
        quantity: 20,
        categoryId: "cmk4sh79w00014wrnwnbddkp3",
        subCategoryId: "cmk4shxdc00034wrnhwfbaf2x",
        isActive: true,
        isFeatured: true,
        isNew: true,
        tags: ["handicraft", "buddha", "statue", "wood"],
        currencyPrices: [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 180,
            comparePrice: 220,
          },
          {
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: 145,
            comparePrice: 180,
          },
          {
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: 22000,
            comparePrice: 27000,
          },
        ],
      },
      {
        name: "Designer Lehenga Choli",
        description:
          "Stunning designer lehenga for special occasions with mirror work",
        price: 0,
        quantity: 8,
        categoryId: "cmnaeqi7u0000w369w7tgqqll",
        isActive: true,
        isFeatured: true,
        isBestSeller: true,
        tags: ["dress", "lehenga", "designer", "occasion"],
        currencyPrices: [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 450,
            comparePrice: 550,
          },
          {
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: 360,
            comparePrice: 440,
          },
          {
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: 55000,
            comparePrice: 66000,
          },
        ],
      },
      {
        name: "Diamond Necklace Set",
        description:
          "Elegant 18K gold necklace with matching earrings and certified diamonds",
        price: 0,
        quantity: 5,
        categoryId: "cmnaeqial0001w369cd68bfdd",
        isActive: true,
        isFeatured: true,
        isBestSeller: true,
        tags: ["diamond", "gold", "necklace", "jewelry", "set"],
        currencyPrices: [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 3500,
            comparePrice: 4200,
          },
          {
            country: "UK",
            currency: "GBP",
            symbol: "£",
            price: 2800,
            comparePrice: 3400,
          },
          {
            country: "Nepal",
            currency: "NPR",
            symbol: "NPR",
            price: 420000,
            comparePrice: 500000,
          },
        ],
      },
    ];

    for (const productData of products) {
      const { currencyPrices, ...baseProductData } = productData;

      const product = await prisma.product.create({
        data: {
          ...baseProductData,
          slug: baseProductData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        },
      });

      for (const cp of currencyPrices) {
        await prisma.productCurrencyPrice.create({
          data: {
            ...cp,
            productId: product.id,
            minDeliveryDays: 1,
            maxDeliveryDays: 7,
            isActive: true,
          },
        });
      }

      console.log(`✓ Created: ${product.name}`);
      console.log(`  Category ID: ${product.categoryId}`);
      if (product.subCategoryId) {
        console.log(`  Sub-Category ID: ${product.subCategoryId}`);
      }
      console.log(`  Currency Prices: ${currencyPrices.length} countries`);
      console.log("");
    }

    console.log("✅ All products created successfully!");
  } catch (error) {
    console.error("❌ Error creating products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleProducts();
