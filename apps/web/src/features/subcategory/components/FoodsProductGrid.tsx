"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { manrope } from "@/app/fonts";

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

interface FoodsProductGridProps {
  products: Product[];
}

const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return imagePath;
};

export default function FoodsProductGrid({ products }: FoodsProductGridProps) {
  return (
    <section className="w-full bg-gray-100 py-6 md:py-8">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className={`text-2xl md:text-3xl tracking-tight font-bold text-black ${manrope.className}`}
            >
              Foods
            </h2>
            <p className="text-gray-800 text-md mt-1">Traditional Authentic Recipe</p>
          </div>
          <Link href="/products/foods" className="text-sm font-medium text-[#EB6426] hover:underline whitespace-nowrap">
            View More
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-48"
            >
              <Link
                href={`/products/${product.category?.slug || "foods"}/all/${product.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={getFullImageUrl(product.image || product.images?.[0] || "")}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="font-semibold mt-4 text-gray-900 text-base tracking-tight  group-hover:text-[#EB6426] transition-colors">
                  {product.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
