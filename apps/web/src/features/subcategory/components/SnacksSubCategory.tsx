import { Suspense } from "react";
import FoodsProductGrid from "./FoodsProductGrid";

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

function SnacksSkeleton() {
  return (
    <div className="w-full bg-gray-100 py-8 md:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="text-2xl md:text-3xl tracking-tight font-bold text-black mb-4">
          Foods
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function getFoodsProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?categorySlug=foods&limit=20`,
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
      category: product.category || { id: "", name: "Foods", slug: "foods" },
    }));
  } catch (error) {
    return [];
  }
}

export default async function SnacksSubCategory() {
  const products = await getFoodsProducts();

  if (products.length === 0) {
    return <SnacksSkeleton />;
  }

  return (
    <Suspense fallback={<SnacksSkeleton />}>
      <FoodsProductGrid products={products} />
    </Suspense>
  );
}
