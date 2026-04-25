import { Suspense } from "react";
import { Product } from "@/shared/types";
import ProductDetailClient from "./ProductDetailClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

async function fetchProductData(productSlug: string) {
  try {
    const productRes = await fetch(`${API_BASE_URL}/api/v1/products/${productSlug}`, {
      next: { revalidate: 300 },
    });

    if (!productRes.ok) {
      return { product: null, error: "Product not found" };
    }

    const productData = await productRes.json();

    if (productData.success && productData.data?.product) {
      const product: Product = {
        id: productData.data.product.id,
        name: productData.data.product.name,
        slug: productData.data.product.slug,
        description: productData.data.product.description || "",
        price: Number(productData.data.product.price) || 0,
        comparePrice: productData.data.product.comparePrice
          ? Number(productData.data.product.comparePrice)
          : undefined,
        image: productData.data.product.images?.[0] || productData.data.product.thumbnail || "/image.png",
        images: productData.data.product.images || [],
        averageRating: 0,
        reviewCount: productData.data.product.reviewCount || 0,
        category: productData.data.product.category
          ? {
              id: productData.data.product.category.id,
              slug: productData.data.product.category.slug,
              name: productData.data.product.category.name,
            }
          : { id: "", slug: "", name: "Uncategorized" },
        quantity: productData.data.product.quantity || 0,
        currencyPrices: productData.data.product.currencyPrices || [],
      };

      return { product, error: null };
    }

    return { product: null, error: "Product not found" };
  } catch (error) {
    return { product: null, error: "Failed to load product" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ category: string; subcategory: string; product: string }> }) {
  const { category, subcategory, product } = await params;
  const { product: productData, error } = await fetchProductData(product);

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500">{error || "This product is no longer available."}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient product={productData} categorySlug={category} subcategorySlug={subcategory} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
