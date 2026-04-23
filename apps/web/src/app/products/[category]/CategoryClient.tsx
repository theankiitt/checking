"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, X, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import ProductCard from "@/shared/components/ProductCard";
import { Product } from "@/shared/types";
import { manrope } from "@/app/fonts";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Category[];
  _count?: { products: number };
}

const CATEGORY_CONFIG: Record<string, { title: string; subtitle: string; bannerColor: string; bannerTitle: string }> = {
  foods: {
    title: "Foods",
    subtitle: "Crafted with spice and love",
    bannerColor: "from-amber-600 to-amber-700",
    bannerTitle: "Traditional Nepali Foods"
  },
  clothing: {
    title: "Clothing",
    subtitle: "Traditional elegance meets modern style",
    bannerColor: "from-pink-600 to-pink-700",
    bannerTitle: "Traditional Clothing"
  },
  jewellery: {
    title: "Jewellery",
    subtitle: "Exquisite craftsmanship",
    bannerColor: "from-yellow-600 to-yellow-700",
    bannerTitle: "Nepali Jewellery"
  },
  jewelry: {
    title: "Jewellery",
    subtitle: "Exquisite craftsmanship",
    bannerColor: "from-yellow-600 to-yellow-700",
    bannerTitle: "Nepali Jewellery"
  },
  tea: {
    title: "Tea",
    subtitle: "Premium quality brews",
    bannerColor: "from-green-600 to-green-700",
    bannerTitle: "Organic Tea"
  },
  masala: {
    title: "Masala",
    subtitle: "Authentic spices",
    bannerColor: "from-red-600 to-red-700",
    bannerTitle: "Authentic Masala"
  },
  handicraft: {
    title: "Handicraft",
    subtitle: "Handmade with love",
    bannerColor: "from-purple-600 to-purple-700",
    bannerTitle: "Handicraft Collection"
  },
};

const CustomOrderForm = lazy(() => import("./CustomOrderForm"));

export default function CategoryClient({
  category,
  initialProducts,
  categorySlug,
  otherProducts,
  subcategoryProducts,
}: {
  category: Category | null;
  initialProducts: Product[];
  categorySlug: string;
  otherProducts?: { category: Category; products: Product[] }[];
  subcategoryProducts?: { category: Category; products: Product[] }[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  const [modalSubcategory, setModalSubcategory] = useState<Category | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  const baseSlug = categorySlug?.split("-")[0] || "";
  const config = CATEGORY_CONFIG[baseSlug] || {
    title: category?.name || "",
    subtitle: "Quality products for you",
    bannerColor: "from-orange-500 to-orange-600",
    bannerTitle: category?.name || ""
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const subCategories = category?.children || [];

  const handleSubcategoryClick = (sub: Category) => {
    if (sub.children && sub.children.length > 0) {
      setModalSubcategory(sub);
      setShowChildrenModal(true);
    } else {
      router.push(`/products/${categorySlug}/${sub.slug}`);
    }
  };

  const handleChildrenSelect = (child: Category) => {
    router.push(`/products/${categorySlug}/${child.slug}`);
  };

  const fetchSubcategoryProducts = async (slug: string) => {
    try {
      setProductsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/products?categorySlug=${slug}&limit=50`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data?.products || data.data?.items || data.data || []);
      }
    } catch (error) {
      
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 pt-8 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-4 flex items-center gap-2 text-gray-900 "
        >
          <ArrowLeft className="w-5 h-5" />
          <span className={`font-medium tracking-tight ${manrope.className}`}>Back to Home</span>
        </button>

        {/* Header */}
        <div className={`mb-8 ${manrope.className} tracking-tight`}>
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            {category?.name || config.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium mt-1">
            {config.subtitle}
          </p>
        </div>

        {/* Subcategories and Banner */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Subcategory Grid */}
          <div className="lg:w-1/2">
            {subCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {subCategories.map((sub) => {
                  const imageUrl = getImageUrl(sub.image);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(sub)}
                      className="rounded-xl overflow-hidden transition-all text-left hover:shadow-md"
                    >
                      <div className="relative h-40 bg-gray-50 rounded-md">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={sub.name}
                            fill
                            className="object-contain py-3"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className={`font-extrabold text-lg text-gray-900 tracking-tight transition-colors ${manrope.className}`}>
                          {sub.name}
                        </div>
                       
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">No subcategories found</p>
              </div>
            )}
          </div>

          {/* Banner */}
          <div className="mt-2 md:mt-0 lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden h-full min-h-[480px]">
              {category?.image ? (
                <Image
                  src={getImageUrl(category.image)!}
                  alt={category.name}
                  fill
                    className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${config.bannerColor}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className={`text-3xl font-bold mb-2 ${manrope.className}`}>
                  {config.bannerTitle}
                </h2>
                <p className="text-white/90 text-base">
                  Explore our premium collection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Grouped by Subcategory */}
        {subcategoryProducts && subcategoryProducts.some((group) => group.products.length > 0) ? (
          <div className="space-y-12 w-full ">
            {subcategoryProducts
              .filter((group) => group.products.length > 0)
              .map((group) => (
                <div key={group.category.id}>
                  <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl font-bold text-gray-900">{group.category.name}</h2>
                    <Link href={`/products/${categorySlug}/${group.category.slug}`} className="text-sm font-semibold tracking-tight text-[#EB6426] hover:underline flex items-center gap-1">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {group.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : subCategories.length > 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products available yet
            </h3>
            <p className="text-gray-500">
              Explore our subcategories above and check back soon for new products
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              {selectedSubcategory && (
                <button
                  onClick={() => { setSelectedSubcategory(null); setSubcategoryName(""); setProducts(initialProducts); }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <div className="flex-1 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {subcategoryName || `All ${category?.name || config.title} Products`}
                </h2>
                <span className="text-gray-500 text-sm">
                  {products.length} products
                </span>
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl p-4">
                    <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center h-[80vh]">
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  {selectedSubcategory
                    ? "No products in this subcategory"
                    : "Products will be added soon"
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* You May Also Like Section */}
        {otherProducts && otherProducts.some((g) => g.products.length > 0) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
              {otherProducts
                .flatMap((group) => group.products)
                .slice(0, 8)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}

        {/* Custom Order Section */}
        <div className="mt-16 max-w-[88rem]">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className={`text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-3 ${manrope.className}`}>
                Customize Your Order
              </h2>
              <p className="text-gray-600 tracking-tight max-w-2xl mx-auto">
                Can't find what you're looking for? Share your requirements and we'll help you customize your order.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <Suspense fallback={<CustomOrderFallback />}>
                <CustomOrderForm categorySlug={categorySlug} />
              </Suspense>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <a
                href="https://wa.me/9779814768889?text=Hi!%20I'm%20interested%20in%20customizing%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#EB6426] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#d55a21] transition-colors shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Children Modal */}
        {showChildrenModal && modalSubcategory && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
            onClick={() => { setShowChildrenModal(false); setModalSubcategory(null); }}
          >
            <div
              className="bg-[#F0F2F5] w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className={`text-xl font-bold text-gray-900 tracking-tight ${manrope.className}`}>
                    {modalSubcategory.name}
                  </h3>
                  <p className={`text-sm text-gray-600 mt-0.5 ${manrope.className}`}>
                    {modalSubcategory.children?.length} categories
                  </p>
                </div>
                <button
                  onClick={() => { setShowChildrenModal(false); setModalSubcategory(null); }}
                  className="p-2.5"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {modalSubcategory.children?.map((child) => {
                    const childImageUrl = getImageUrl(child.image);
                    return (
                      <button
                        key={child.id}
                        onClick={() => handleChildrenSelect(child)}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all text-left"
                      >
                        <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          {childImageUrl ? (
                            <Image
                              src={childImageUrl}
                              alt={child.name}
                              fill
                              className="object-contain p-3 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, 33vw"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {child.name}
                          </div>
                          {child._count?.products ? (
                            <div className="text-xs text-gray-400 mt-1">
                              {child._count.products} products
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomOrderFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
      <div className="h-24 bg-gray-200 rounded-xl"></div>
      <div className="h-12 bg-gray-300 rounded-xl"></div>
    </div>
  );
}
