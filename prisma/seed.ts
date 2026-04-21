import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingBanner = await prisma.topBanner.findFirst({
    where: {
      title: {
        contains: "Free Shipping",
      },
    },
  });

  if (!existingBanner) {
    await prisma.topBanner.create({
      data: {
        title: "Free Shipping on Orders Above $100",
        isActive: true,
      },
    });
    console.log("Default banner created");
  } else {
    console.log("Banner already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
