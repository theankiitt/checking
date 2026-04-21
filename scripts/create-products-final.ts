import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createProductsDirectly() {
  try {
    console.log("🚀 Creating products directly in database...\n");

    // Get categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
    });

    console.log("📂 Available categories:");
    categories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.id})`);
    });
    console.log("");

    // Products to create
    const productsData = [
      {
        name: "Handwoven Wool Carpet",
        description:
          "Authentic Nepalese wool carpet with traditional geometric patterns, hand-knotted by skilled artisans",
        categorySlug: "carpet",
        price: 850,
        tags: ["carpet", "wool", "handwoven", "traditional", "nepal"],
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: "Pure Silk Carpet",
        description:
          "Luxurious pure silk carpet with intricate floral designs, perfect for elegant living spaces",
        categorySlug: "carpet",
        price: 1500,
        tags: ["carpet", "silk", "luxury", "handwoven"],
        isFeatured: true,
      },
      {
        name: "Brass Ganesh Statue",
        description:
          "Traditional brass Ganesh idol with gold plating, handcrafted by local artisans",
        categorySlug: "statue",
        price: 250,
        tags: ["statue", "brass", "ganesh", "religious", "home decor"],
        isBestSeller: true,
      },
      {
        name: "Bronze Shiva Parvati Set",
        description:
          "Handcrafted bronze statues of Shiva and Parvati, perfect for home temple",
        categorySlug: "statue",
        price: 450,
        tags: ["statue", "bronze", "shiva", "religious", "couple"],
        isNew: true,
      },
      {
        name: "Traditional Yomari Gift Box",
        description:
          "Fresh handmade Yomari with coconut and molasses filling, gift packed",
        categorySlug: "food",
        price: 3,
        tags: ["food", "yomari", "traditional", "sweet", "gift"],
        isBestSeller: true,
      },
      {
        name: "Homemade Achar Collection",
        description:
          "Set of 6 different traditional Nepali pickles/achar, preservative-free",
        categorySlug: "food",
        price: 25,
        tags: ["food", "achar", "pickle", "traditional", "spicy"],
        isNew: true,
      },
      {
        name: "Diamond Solitaire Ring",
        description:
          "Elegant platinum ring with certified 1-carat diamond, stunning brilliance",
        categorySlug: "diamond",
        price: 2500,
        tags: ["diamond", "ring", "jewelry", "platinum", "solitaire"],
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: "Diamond Drop Earrings",
        description:
          "Beautiful diamond drop earrings in white gold, perfect for special occasions",
        categorySlug: "diamond",
        price: 1800,
        tags: ["diamond", "earrings", "jewelry", "white gold"],
        isFeatured: true,
      },
      {
        name: "Cotton Anarkali Suit",
        description:
          "Beautiful cotton Anarkali suit with hand embroidery, comfortable and elegant",
        categorySlug: "dress",
        price: 180,
        tags: ["dress", "anarkali", "cotton", "traditional", "suits"],
        isFeatured: true,
      },
      {
        name: "Silk Embroidered Kurti",
        description:
          "Designer silk kurti with intricate embroidery work, perfect for festivals",
        categorySlug: "dress",
        price: 120,
        tags: ["dress", "kurti", "silk", "designer", "embroidery"],
        isNew: true,
      },
    ];

    let createdCount = 0;

    for (const productData of productsData) {
      // Find category by slug or name
      const category = categories.find(
        (c) =>
          c.slug === productData.categorySlug ||
          c.name.toLowerCase() === productData.categorySlug,
      );

      if (!category) {
        console.log(
          `⚠️  Category "${productData.categorySlug}" not found, skipping "${productData.name}"`,
        );
        continue;
      }

      // Create product
      const slug =
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now();

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: slug,
          description: productData.description,
          price: 0, // Base price is deprecated
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity 10-60
          categoryId: category.id,
          isActive: true,
          isFeatured: productData.isFeatured || false,
          isBestSeller: productData.isBestSeller || false,
          isNew: productData.isNew || false,
          tags: productData.tags,
          images: [],
        },
      });

      // Create currency prices for different countries
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
          price: Math.round(productData.price * 0.79),
        },
        {
          country: "Australia",
          currency: "AUD",
          symbol: "A$",
          price: Math.round(productData.price * 1.53),
        },
        {
          country: "India",
          currency: "INR",
          symbol: "₹",
          price: Math.round(productData.price * 83.12),
        },
        {
          country: "Nepal",
          currency: "NPR",
          symbol: "NPR",
          price: Math.round(productData.price * 130),
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

      console.log(`✓ Created: ${product.name}`);
      console.log(`  Category: ${category.name}`);
      console.log(
        `  Prices: $${productData.price} USD, £${currencyPrices[1].price} GBP, NPR ${currencyPrices[4].price}`,
      );
      console.log("");

      createdCount++;
    }

    console.log(`\n🎉 Successfully created ${createdCount} products!`);
    console.log("\n📋 To create products using curl (requires admin auth):\n");
    console.log("# 1. Login to get auth token:");
    console.log("curl -X POST http://localhost:4444/api/v1/auth/login \\");
    console.log('  -H "Content-Type: application/json" \\');
    console.log(
      '  -d \'{"email":"admin@gharsamma.com","password":"admin123"}\'',
    );
    console.log("\n# 2. Use the token to create a product:");
    console.log("curl -X POST http://localhost:4444/api/v1/products \\");
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\');
    console.log("  -d '{");
    console.log('    "name": "Product Name",');
    console.log('    "description": "Product description",');
    console.log('    "categoryId": "CATEGORY_ID",');
    console.log('    "quantity": 100,');
    console.log('    "currencyPrices": [');
    console.log(
      '      {"country": "USA", "currency": "USD", "symbol": "$", "price": 100},',
    );
    console.log(
      '      {"country": "UK", "currency": "GBP", "symbol": "£", "price": 80},',
    );
    console.log(
      '      {"country": "Nepal", "currency": "NPR", "symbol": "NPR", "price": 13000}',
    );
    console.log("    ]");
    console.log("  }'");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createProductsDirectly();
