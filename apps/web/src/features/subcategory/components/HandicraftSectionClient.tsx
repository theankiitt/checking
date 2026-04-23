"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { manrope } from "@/app/fonts";

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

interface HandicraftSectionClientProps {
  title: string;
  subtitle: string;
  products: Product[];
}

const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    return `${API_BASE_URL}${imagePath}`;
  }
  return imagePath;
};

export default function HandicraftSectionClient({
  title,
  subtitle,
  products,
}: HandicraftSectionClientProps) {

  if (!products || products.length === 0) {
    return (
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${manrope.className}`}>
            {title}
          </h2>
          <p className="text-gray-500 text-sm mb-8">{subtitle}</p>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex-shrink-0 w-56 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-3" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${manrope.className}`}>
              {title}
            </h2>
            <p className="text-gray-800 text-md mt-1">{subtitle}</p>
          </div>
          <Link href="/products/handicraft" className="text-sm font-medium text-[#EB6426] hover:underline whitespace-nowrap">
            View More
          </Link>
        </div>

        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
        >
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-56 snap-start"
            >
              <Link href={`/products/handicraft/all/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                  {product.image ? (
                    <Image
                      src={getFullImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-300 text-3xl font-bold">{product.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 text-base tracking-tight  group-hover:text-[#EB6426] transition-colors">
                    {product.name}
                  </h3>
                 
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
