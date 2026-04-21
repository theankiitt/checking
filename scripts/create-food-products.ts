import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFoodProducts() {
  try {
    console.log("Creating food products...\n");

    // Find or create the food category
    let foodCategory = await prisma.category.findFirst({
      where: { slug: "food" },
    });

    if (!foodCategory) {
      foodCategory = await prisma.category.create({
        data: {
          name: "Food",
          slug: "food",
          description:
            "Traditional Nepalese food items including tea, spices, pickles, and snacks",
          isActive: true,
        },
      });
      console.log(
        `Created food category: ${foodCategory.name} (${foodCategory.id})\n`,
      );
    } else {
      console.log(
        `Found food category: ${foodCategory.name} (${foodCategory.id})\n`,
      );
    }

    const products = [
      {
        name: "Organic Himalayan Green Tea",
        description:
          "Premium organic green tea harvested from Himalayan highlands, rich in antioxidants and natural flavor",
        price: 15,
        quantity: 100,
        categoryId: foodCategory.id,
        isActive: true,
        isFeatured: true,
        tags: ["tea", "organic", "green tea", "himachal", "healthy"],
      },
      {
        name: "Traditional Masala Chai Mix",
        description:
          "Authentic Nepali masala chai spice blend with cardamom, ginger, cinnamon, and clove",
        price: 12,
        quantity: 80,
        categoryId: foodCategory.id,
        isActive: true,
        isFeatured: true,
        tags: ["masala", "chai", "spices", "traditional", "authentic"],
      },
      {
        name: "Spicy Green Chili Achar",
        description:
          "Traditional Nepali pickle made from fresh green chilies, garlic, and aromatic spices",
        price: 8,
        quantity: 50,
        categoryId: foodCategory.id,
        isActive: true,
        isBestSeller: true,
        tags: ["achar", "pickle", "spicy", "green chili", "traditional"],
      },
      {
        name: "Mixed Vegetable Achar",
        description:
          "Tangy and spicy mixed vegetable pickle with carrots, cauliflower, and radish",
        price: 10,
        quantity: 45,
        categoryId: foodCategory.id,
        isActive: true,
        tags: ["achar", "pickle", "vegetable", "mixed", "spicy"],
      },
      {
        name: "Dried Buffalo Meat (Sukuti)",
        description:
          "Traditional dried buffalo meat (sukuti) - spicy and flavorful Nepalese snack",
        price: 25,
        quantity: 30,
        categoryId: foodCategory.id,
        isActive: true,
        isBestSeller: true,
        tags: ["dried meat", "sukuti", "buffalo", "snack", "spicy"],
      },
      {
        name: "Dried Fish (Tingale/Fish Sukuti)",
        description:
          "Sun-dried salted fish, a traditional Nepali delicacy with authentic taste",
        price: 18,
        quantity: 25,
        categoryId: foodCategory.id,
        isActive: true,
        tags: ["dried fish", "tingale", "fish", "seafood", "traditional"],
      },
      {
        name: "Crispy Rice Crisps (Chura)",
        description:
          "Traditional flattened rice crisps, perfect for snacking or breakfast",
        price: 5,
        quantity: 60,
        categoryId: foodCategory.id,
        isActive: true,
        tags: ["chura", "rice crisps", "snack", "breakfast", "traditional"],
      },
      {
        name: "Spicy Lentil Chips (Musalman Bhaji)",
        description:
          "Crunchy spicy lentil chips - popular Nepali tea time snack",
        price: 6,
        quantity: 55,
        categoryId: foodCategory.id,
        isActive: true,
        tags: ["snack", "lentil", "chips", "spicy", "tea time"],
      },
      {
        name: "Tingting - Spicy Corn Snack",
        description: "Crispy spicy corn puffs - addictive Nepali snack",
        price: 4,
        quantity: 70,
        categoryId: foodCategory.id,
        isActive: true,
        tags: ["corn", "snack", "spicy", "crispy", "tingting"],
      },
      {
        name: "Sweetened Flattened Rice (Champa)",
        description:
          "Sweet and crunchy flattened rice with jaggery - traditional Nepalese sweet",
        price: 7,
        quantity: 40,
        categoryId: foodCategory.id,
        isActive: true,
        isNew: true,
        tags: ["champa", "flattened rice", "sweet", "traditional", "jaggery"],
      },
    ];

    let productIndex = 0;

    for (const productData of products) {
      productIndex++;
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug:
            productData.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/-+/g, "-") +
            "-" +
            productIndex,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          categoryId: productData.categoryId,
          isActive: productData.isActive,
          isFeatured: productData.isFeatured || false,
          isBestSeller: productData.isBestSeller || false,
          isNew: productData.isNew || false,
          tags: productData.tags,
        },
      });

      // Add currency prices for different countries
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

    console.log("\n✅ All food products created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createFoodProducts();
