import fs from "fs";
import path from "path";

const statueJsonPath = path.join(process.cwd(), "products_statue_gs.json");
const apiJsonPath = path.join(process.cwd(), "products_api_format.json");

interface StatueProduct {
  sn: number;
  code: string;
  name: string;
  description: string;
  price: string;
  relatedLink: string;
  notes: string;
}

interface ApiProduct {
  name: string;
  productCode: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  trackQuantity: boolean;
  quantity: number;
  weight: number;
  weightUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  categoryId: string;
  brandId: string;
  currencyPrices: any[];
  tags: string[];
  requiresShipping: boolean;
  freeShipping: boolean;
  taxable: boolean;
}

const statueProducts: StatueProduct[] = JSON.parse(
  fs.readFileSync(statueJsonPath, "utf-8"),
);
const apiProducts: ApiProduct[] = JSON.parse(
  fs.readFileSync(apiJsonPath, "utf-8"),
);

const codeToSn = new Map<string, number>();
statueProducts.forEach((p) => {
  codeToSn.set(p.code, p.sn);
});

let updatedCount = 0;

for (const product of apiProducts) {
  const sn = codeToSn.get(product.productCode);
  if (sn) {
    const imageFolder = path.join(
      process.cwd(),
      "Statue Pictures Resized",
      sn.toString(),
    );
    if (fs.existsSync(imageFolder)) {
      const images = fs
        .readdirSync(imageFolder)
        .filter((f) => f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .sort()
        .map((f) => path.join("Statue Pictures Resized", sn.toString(), f));

      product.images = images;
      updatedCount++;
    }
  }
}

fs.writeFileSync(apiJsonPath, JSON.stringify(apiProducts, null, 2), "utf-8");
console.log(`✅ Updated ${updatedCount} products with resized image paths`);
