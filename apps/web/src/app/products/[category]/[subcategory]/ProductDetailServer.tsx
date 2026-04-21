import { Suspense } from "react";
import { Product } from "@/shared/types";

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
      };
      
      return { product, error: null };
    }
    
    return { product: null, error: "Product not found" };
  } catch (error) {
    return { product: null, error: "Failed to load product" };
  }
}

export default async function ProductDetailServer({ categorySlug, productSlug }: { categorySlug: string; productSlug: string }) {
  const { product, error } = await fetchProductData(productSlug);
  
  if (error || !product) {
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
      <ProductDetailClient product={product} categorySlug={categorySlug} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 pt-8 pb-12">
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

function ProductDetailClient({ product, categorySlug }: { product: Product; categorySlug: string }) {
  return (
    <div className="bg-white tracking-tight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.images?.[0] || product.image || "/image.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-2">Category: {product.category?.name}</p>
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#EB6426]">
                ${(product.price || 0).toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${(product.comparePrice).toFixed(2)}
                </span>
              )}
            </div>
            
            {product.description && (
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            
            <button className="w-full bg-[#EB6426] text-white py-4 rounded-xl font-semibold hover:bg-[#d55a21] transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
