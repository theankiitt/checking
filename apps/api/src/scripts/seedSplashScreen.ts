import prisma from "../config/database";

async function seedSplashScreen() {

  try {
    // Delete existing splash screen media
    await prisma.mediaItem.deleteMany({
      where: { linkTo: "splash-screen" },
    });

    // Create splash screen media items
    const splashItems = [
      {
        mediaType: "IMAGE" as const,
        mediaUrl: "/banner1.jpeg",
        linkTo: "splash-screen",
        internalLink: "/products",
        isActive: true,
        title: "Welcome to GharSamma",
        description:
          "Discover authentic Nepali handicrafts, puja samagri, and traditional products",
        ctaText: "Shop Now",
      },
      {
        mediaType: "IMAGE" as const,
        mediaUrl: "/carousel1.jpeg",
        linkTo: "splash-screen",
        internalLink: "/categories",
        isActive: true,
        title: "Handcrafted Excellence",
        description:
          "Experience the finest collection of traditional Nepali artifacts",
        ctaText: "Explore Collection",
      },
      {
        mediaType: "IMAGE" as const,
        mediaUrl: "/carousel2.jpeg",
        linkTo: "splash-screen",
        internalLink: "/special-offers",
        isActive: true,
        title: "Quality Guaranteed",
        description: "Premium products with secure payment and fast delivery",
        ctaText: "View Offers",
      },
    ];

    for (const item of splashItems) {
      await prisma.mediaItem.create({
        data: item,
      });
    }

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSplashScreen()
  .then(() => process.exit(0))
  .catch((error) => {
    process.exit(1);
  });
