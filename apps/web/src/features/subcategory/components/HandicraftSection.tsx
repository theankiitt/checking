import { Suspense } from "react";
import HandicraftSectionClient from "./HandicraftSectionClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  categoryId: string;
  subCategoryId?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

function HandicraftSkeleton() {
  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-5 w-96 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex-shrink-0 w-56">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function getHandicraftProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?categorySlug=handicraft&limit=20`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.success || !data.data?.products?.length) {
      return [];
    }

    return data.data.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      image: p.images?.[0] || p.thumbnail || "",
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId,
      category: p.category || { id: "", name: "Handicraft", slug: "handicraft" },
    }));
  } catch (error) {
    return [];
  }
}

export default async function HandicraftSection() {
  const products = await getHandicraftProducts();

  return (
    <Suspense fallback={<HandicraftSkeleton />}>
      <HandicraftSectionClient
        title="Handicraft"
        subtitle="Exquisite handcrafted products from Nepal"
        products={products}
      />
    </Suspense>
  );
}
