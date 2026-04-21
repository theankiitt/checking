import { Suspense } from "react";
import JewelryProductGrid from "./JewelryProductGrid";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
  images?: string[];
  averageRating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

function JewelrySkeleton() {
  return (
    <div className="w-full bg-gray-100 py-6 md:py-8">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl tracking-tight font-bold text-black">
              Jewelry Collection
            </h2>
            <p className="text-gray-500 text-sm mt-1">Traditional Nepali Jewelry</p>
          </div>
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex-shrink-0 w-48 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function getJewelryProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?categorySlug=jewelry&limit=20`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.success || !data.data?.products?.length) {
      return [];
    }

    return data.data.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.image || "",
      images: product.images || [],
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      category: product.category || { id: "", name: "Jewelry", slug: "jewelry" },
    }));
  } catch (error) {
    return [];
  }
}

export default async function JewelrySection() {
  const products = await getJewelryProducts();

  if (products.length === 0) {
    return <JewelrySkeleton />;
  }

  return (
    <Suspense fallback={<JewelrySkeleton />}>
      <JewelryProductGrid products={products} />
    </Suspense>
  );
}
