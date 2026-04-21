import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminAndSeedProducts() {
  try {
    console.log("🚀 Starting product creation...\n");

    console.log("⚠️  Note: Admin creation skipped (database schema mismatch)");
    console.log("Products can be created directly via database script\n");

    // Get categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
    });

    const categoryMap = new Map(
      categories.map((cat) => [cat.name.toLowerCase(), cat.id]),
    );

    console.log("📂 Available categories:");
    categories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.id})`);
    });
    console.log("");

    // Create sample products in different categories
    const productsData = [
      {
        name: "Handwoven Wool Carpet",
        description:
          "Authentic Nepalese wool carpet with traditional geometric patterns",
        categoryName: "Carpet",
        price: 850,
        tags: ["carpet", "wool", "handwoven", "traditional"],
        images: [],
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: "Pure Silk Carpet",
        description: "Luxurious pure silk carpet with intricate floral designs",
        categoryName: "Carpet",
        price: 1500,
        tags: ["carpet", "silk", "luxury"],
        images: [],
        isFeatured: true,
      },
      {
        name: "Brass Ganesh Statue",
        description: "Traditional brass Ganesh idol with gold plating",
        categoryName: "Statue",
        price: 250,
        tags: ["statue", "brass", "ganesh", "religious"],
        images: [],
        isBestSeller: true,
      },
      {
        name: "Bronze Shiva Parvati Set",
        description: "Handcrafted bronze statues of Shiva and Parvati",
        categoryName: "Statue",
        price: 450,
        tags: ["statue", "bronze", "shiva", "religious"],
        images: [],
        isNew: true,
      },
      {
        name: "Traditional Yomari",
        description: "Fresh handmade Yomari with coconut and molasses filling",
        categoryName: "Food",
        price: 3,
        tags: ["food", "yomari", "traditional", "sweet"],
        images: [],
        isBestSeller: true,
      },
      {
        name: "Homemade Achar Set",
        description: "Set of 6 different traditional Nepali pickles/achar",
        categoryName: "Food",
        price: 25,
        tags: ["food", "achar", "pickle", "traditional"],
        images: [],
        isNew: true,
      },
    ];

    console.log("📦 Creating products...\n");

    for (const productData of productsData) {
      const categoryId = categoryMap.get(
        productData.categoryName.toLowerCase(),
      );

      if (!categoryId) {
        console.log(
          `⚠️  Category "${productData.categoryName}" not found, skipping "${productData.name}"`,
        );
        continue;
      }

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: 0,
          quantity: 50,
          categoryId,
          isActive: true,
          isFeatured: productData.isFeatured || false,
          isBestSeller: productData.isBestSeller || false,
          isNew: productData.isNew || false,
          tags: productData.tags,
          images: [],
        },
      });

      // Create currency prices
      const currencyPrices = [
        {
          country: "USA",
          currency: "USD",
          symbol: "$",
          price: productData.price,
        },
        {
          country: "UK",
          currency: "GBP",
          symbol: "£",
          price: productData.price * 0.8,
        },
        {
          country: "Nepal",
          currency: "NPR",
          symbol: "NPR",
          price: productData.price * 130,
        },
      ];

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

      console.log(
        `✓ Created: ${product.name} (Category: ${productData.categoryName})`,
      );
    }

    console.log("\n🎉 All done! Here's how to create products with curl:\n");
    console.log("# Login to get token:");
    console.log(
      'curl -X POST http://localhost:4444/api/v1/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email":"admin@gharsamma.com","password":"admin123"}\'',
    );
    console.log("\n# Create product with token:");
    console.log(
      'curl -X POST http://localhost:4444/api/v1/products \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d \'{"name":"Product Name","price":100,"categoryId":"CATEGORY_ID","currencyPrices":[{"country":"USA","currency":"USD","symbol":"$","price":100}]}\'',
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAndSeedProducts();
