import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const API_URL = process.env.API_URL || "http://localhost:4444";
const TOKEN = process.env.TOKEN || "";

interface Product {
  name: string;
  description: string;
  shortDescription: string;
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

function uploadImageWithCurl(
  imagePath: string,
  token: string,
): Promise<string | null> {
  return new Promise((resolve) => {
    const curl = spawn("curl", [
      "-s",
      "-X",
      "POST",
      `${API_URL}/api/v1/upload/product`,
      "-H",
      `Authorization: Bearer ${token}`,
      "-F",
      `image=@${imagePath}`,
    ]);

    let data = "";
    let error = "";

    curl.stdout.on("data", (chunk) => {
      data += chunk;
    });
    curl.stderr.on("data", (chunk) => {
      error += chunk;
    });

    curl.on("close", (code) => {
      if (code === 0 && data) {
        try {
          const json = JSON.parse(data);
          resolve(json.data?.url || json.data?.path || null);
        } catch {
          resolve(null);
        }
      } else {
        console.error(`Curl error: ${error}`);
        resolve(null);
      }
    });
  });
}

async function processProducts() {
  if (!TOKEN) {
    console.error("❌ Please set TOKEN environment variable");
    console.log(
      "   Usage: TOKEN=<your-jwt-token> npx ts-node scripts/upload-images.ts",
    );
    process.exit(1);
  }

  console.log(`📡 API URL: ${API_URL}`);
  console.log(`🔐 Token: ${TOKEN.substring(0, 20)}...\n`);

  const jsonPath = path.join(process.cwd(), "products_api_format.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ products_api_format.json not found");
    process.exit(1);
  }

  const products: Product[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(`📦 Loaded ${products.length} products\n`);

  let totalImages = 0;
  let uploadedImages = 0;
  let failedImages = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const imagePaths = product.images;
    totalImages += imagePaths.length;

    console.log(
      `Processing ${i + 1}/${products.length}: ${product.productCode}`,
    );
    console.log(`  Images: ${imagePaths.length}`);

    const uploadedUrls: string[] = [];

    for (const imagePath of imagePaths) {
      const fullPath = path.join(process.cwd(), imagePath);

      if (!fs.existsSync(fullPath)) {
        console.log(`  ⚠️  File not found: ${imagePath}`);
        failedImages++;
        continue;
      }

      const url = await uploadImageWithCurl(fullPath, TOKEN);
      if (url) {
        uploadedUrls.push(url);
        uploadedImages++;
        console.log(`  ✅ ${path.basename(imagePath)}`);
      } else {
        failedImages++;
        console.log(`  ❌ ${path.basename(imagePath)}`);
      }

      await new Promise((r) => setTimeout(r, 200));
    }

    product.images = uploadedUrls;
    product.thumbnail = uploadedUrls[0] || "";

    fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), "utf-8");

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\n📊 Results:");
  console.log(`   Total products: ${products.length}`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Uploaded: ${uploadedImages}`);
  console.log(`   Failed: ${failedImages}`);
  console.log("\n✅ JSON file updated!");
}

processProducts().catch(console.error);
