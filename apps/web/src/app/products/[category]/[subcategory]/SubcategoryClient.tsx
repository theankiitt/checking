"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

interface SubcategoryClientProps {
  subcategory: Category | null;
  initialProducts: Product[];
  subcategorySlug: string;
  categorySlug: string;
  isSubSubCategory?: boolean;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Products" },
  { value: "inStock", label: "In Stock" },
  { value: "outOfStock", label: "Out of Stock" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "0-100", label: "Under $100" },
  { value: "100-500", label: "$100 - $500" },
  { value: "500-1000", label: "$500 - $1000" },
  { value: "1000-99999", label: "$1000+" },
];

export default function SubcategoryClient({
  subcategory,
  initialProducts,
  subcategorySlug,
  categorySlug,
  isSubSubCategory = false,
}: SubcategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products] = useState<Product[]>(initialProducts);
  const [showFilters, setShowFilters] = useState(false);

  const currentSort = searchParams?.get("sort") || "newest";
  const currentAvailability = searchParams?.get("availability") || "all";
  const currentPriceRange = searchParams?.get("priceRange") || "all";

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (currentAvailability === "inStock") {
      result = result.filter((p) => (p.quantity ?? 0) > 0);
    } else if (currentAvailability === "outOfStock") {
      result = result.filter((p) => (p.quantity ?? 0) <= 0);
    }

    if (currentPriceRange !== "all") {
      const [min, max] = currentPriceRange.split("-").map(Number);
      result = result.filter((p) => p.price >= min && (max ? p.price <= max : true));
    }

    if (currentSort === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [products, currentSort, currentAvailability, currentPriceRange]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const activeFilterCount = [
    currentSort !== "newest",
    currentAvailability !== "all",
    currentPriceRange !== "all",
  ].filter(Boolean).length;

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const FilterSection = ({ title, options, current, filterKey }: { title: string; options: typeof SORT_OPTIONS; current: string; filterKey: string }) => (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-1">
        {options.map((option) => {
          const isActive = current === option.value;
          return (
            <button
              key={option.value}
              onClick={() => updateFilter(filterKey, option.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-[#EB6426] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{option.label}</span>
              {isActive && (
                <Check className="w-4 h-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 pt-8 pb-12">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className={`text-lg font-medium tracking-tight ${manrope.className}`}>Back to Home</span>
        </button>

        <div className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                {subcategory?.name || subcategorySlug}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {filteredProducts.length} products
              </p>
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#EB6426] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 space-y-5">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${categorySlug}/${subcategorySlug}/${product.slug}`}
                className="group bg-white  overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden ">
                  {product.images?.[0] || product.image ? (
                    <Image
                      src={getImageUrl(product.images?.[0] || product.image) || "/image.png"}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-200 text-5xl font-bold">{product.name.charAt(0)}</span>
                    </div>
                  )}

                  {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                    <span className="absolute top-3 left-3 bg-[#EB6426] text-white text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wide">
                      Sale
                    </span>
                  )}

                 
                </div>

                <div className={`p-4 tracking-tight`}>
                  <h3 className="font-medium text-xl text-gray-700  line-clamp-2 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-[#EB6426]">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                      <span className="text-xs text-gray-400 line-through">
                        ${Number(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`bg-white rounded-xl p-16 text-center h-[60vh] ${manrope.className} flex flex-col items-center justify-center`}>
            <h3 className="text-2xl font-semibold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-gray-800 text-lg">
              {activeFilterCount > 0 ? "Try adjusting your filters" : "Products will be added soon"}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowFilters(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                <FilterSection
                  title="Sort By"
                  options={SORT_OPTIONS}
                  current={currentSort}
                  filterKey="sort"
                />

                <div className="border-t border-gray-100" />

                <FilterSection
                  title="Availability"
                  options={AVAILABILITY_OPTIONS}
                  current={currentAvailability}
                  filterKey="availability"
                />

                <div className="border-t border-gray-100" />

                <FilterSection
                  title="Price Range"
                  options={PRICE_OPTIONS}
                  current={currentPriceRange}
                  filterKey="priceRange"
                />
              </div>

              <div className="border-t border-gray-100 px-5 py-4 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2.5 bg-[#EB6426] text-white rounded-lg text-sm font-medium hover:bg-[#d55a21] transition-colors"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
